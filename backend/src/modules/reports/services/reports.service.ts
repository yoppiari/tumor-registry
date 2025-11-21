import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { PdfGenerator } from '../generators/pdf.generator';
import { ExcelGenerator } from '../generators/excel.generator';
import { CsvGenerator } from '../generators/csv.generator';
import {
  ReportGenerationRequest,
  ReportTemplateData,
  ReportValidationResult,
  ReportStatistics,
  ReportQuery,
  ReportFilter,
  ReportData,
} from '../interfaces/reports.interface';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { GenerateReportDto } from '../dto/generate-report.dto';
import * as cron from 'node-cron';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private scheduledReports = new Map<string, cron.ScheduledTask>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfGenerator: PdfGenerator,
    private readonly excelGenerator: ExcelGenerator,
    private readonly csvGenerator: CsvGenerator,
  ) {
    this.initializeScheduledReports();
  }

  async createTemplate(createTemplateDto: CreateReportTemplateDto): Promise<any> {
    try {
      // Validate the template
      const validation = await this.validateTemplate({
        ...createTemplateDto,
        layout: createTemplateDto.layout as any,
        charts: createTemplateDto.charts as any,
      });

      if (!validation.isValid) {
        throw new BadRequestException(`Template validation failed: ${validation.errors.join(', ')}`);
      }

      const template = await this.prisma.reportTemplate.create({
        data: {
          ...createTemplateDto,
          layout: createTemplateDto.layout as any,
          styling: createTemplateDto.styling,
          filters: createTemplateDto.filters,
          aggregations: createTemplateDto.aggregations,
          charts: createTemplateDto.charts as any,
        },
      });

      this.logger.log(`Report template created: ${template.name}`);
      return template;
    } catch (error) {
      this.logger.error('Error creating report template', error);
      throw error;
    }
  }

  async generateReport(generateReportDto: GenerateReportDto): Promise<any> {
    try {
      // Get template
      const template = await this.prisma.reportTemplate.findUnique({
        where: { id: generateReportDto.templateId },
      });

      if (!template) {
        throw new NotFoundException('Report template not found');
      }

      // Validate access permissions
      await this.validateReportAccess(template, generateReportDto.generatedBy, generateReportDto.centerId);

      // Create report job
      const report = await this.prisma.generatedReport.create({
        data: {
          templateId: generateReportDto.templateId,
          name: generateReportDto.name,
          parameters: generateReportDto.parameters,
          format: generateReportDto.format,
          status: 'GENERATING',
          generatedBy: generateReportDto.generatedBy,
          expiresAt: generateReportDto.expiresAt,
        },
      });

      // Generate report asynchronously
      this.processReportGeneration(report, template, generateReportDto);

      return report;
    } catch (error) {
      this.logger.error('Error generating report', error);
      throw error;
    }
  }

  async getReport(reportId: string): Promise<any> {
    const report = await this.prisma.generatedReport.findUnique({
      where: { id: reportId },
      include: {
        template: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Check if report has expired
    if (report.expiresAt && new Date() > report.expiresAt) {
      throw new NotFoundException('Report has expired');
    }

    return report;
  }

  async downloadReport(reportId: string): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const report = await this.getReport(reportId);

    if (!report.filePath) {
      throw new NotFoundException('Report file not available');
    }

    // Check if file exists
    if (!fs.existsSync(report.filePath)) {
      throw new NotFoundException('Report file not found on disk');
    }

    const fileName = path.basename(report.filePath);
    const mimeType = this.getMimeType(report.format);

    return { filePath: report.filePath, fileName, mimeType };
  }

  async scheduleReport(scheduleData: any): Promise<any> {
    try {
      const scheduledReport = await this.prisma.scheduledReport.create({
        data: {
          ...scheduleData,
          recipients: scheduleData.recipients,
          parameters: scheduleData.parameters,
        },
      });

      // Schedule the report
      if (scheduledReport.isActive) {
        this.scheduleReportJob(scheduledReport);
      }

      this.logger.log(`Report scheduled: ${scheduledReport.name}`);
      return scheduledReport;
    } catch (error) {
      this.logger.error('Error scheduling report', error);
      throw error;
    }
  }

  async getTemplates(filters?: {
    reportType?: string;
    accessLevel?: string;
    centerId?: string;
    isActive?: boolean;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.reportType) where.reportType = filters.reportType;
    if (filters?.accessLevel) where.accessLevel = filters.accessLevel;
    if (filters?.centerId) where.centerId = filters.centerId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.prisma.reportTemplate.findMany({
      where,
      include: {
        center: true,
        _count: {
          select: {
            generatedReports: true,
            scheduledReports: true,
          },
        },
      },
      orderBy: [
        { reportType: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async getGeneratedReports(filters?: {
    templateId?: string;
    status?: string;
    format?: string;
    generatedBy?: string;
    centerId?: string;
    limit?: number;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.templateId) where.templateId = filters.templateId;
    if (filters?.status) where.status = filters.status;
    if (filters?.format) where.format = filters.format;
    if (filters?.generatedBy) where.generatedBy = filters.generatedBy;

    if (filters?.centerId) {
      where.template = { centerId: filters.centerId };
    }

    return this.prisma.generatedReport.findMany({
      where,
      include: {
        template: true,
      },
      orderBy: { generatedAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async getReportStatistics(centerId?: string): Promise<ReportStatistics> {
    const templateWhere = centerId ? { centerId } : {};
    const reportWhere = centerId ? { template: { centerId } } : {};

    const [
      totalReports,
      activeReports,
      scheduledReports,
      recentGenerations,
      popularTemplates,
      averageGenerationTime,
      successRate,
    ] = await Promise.all([
      this.prisma.generatedReport.count(),
      this.prisma.reportTemplate.count({ where: { ...templateWhere, isActive: true } }),
      this.prisma.scheduledReport.count({
        where: { isActive: true, template: templateWhere },
      }),
      this.prisma.generatedReport.count({
        where: {
          ...reportWhere,
          generatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.getPopularTemplates(centerId),
      this.getAverageGenerationTime(centerId),
      this.getSuccessRate(centerId),
    ]);

    const formatDistribution = await this.getFormatDistribution(centerId);

    return {
      totalReports,
      activeReports,
      scheduledReports,
      recentGenerations,
      popularTemplates,
      averageGenerationTime,
      successRate,
      formatDistribution,
    };
  }

  async validateTemplate(templateData: ReportTemplateData): Promise<ReportValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate basic required fields
    if (!templateData.name) errors.push('Template name is required');
    if (!templateData.title) errors.push('Template title is required');
    if (!templateData.dataSource) errors.push('Data source is required');
    if (!templateData.layout || !templateData.layout.sections || templateData.layout.sections.length === 0) {
      errors.push('At least one layout section is required');
    }

    // Validate data source
    try {
      const sampleData = await this.executeReportQuery({
        dataSource: templateData.dataSource,
        filters: [],
        limit: 5,
      });

      if (sampleData.length === 0) {
        warnings.push('Data source returned no results');
      }
    } catch (error) {
      errors.push(`Data source validation failed: ${error.message}`);
    }

    // Validate layout sections
    if (templateData.layout?.sections) {
      for (const section of templateData.layout.sections) {
        if (!section.type) {
          errors.push('All sections must have a type');
        }

        if (section.type === 'table' && !section.content?.data) {
          warnings.push(`Table section "${section.id}" has no data defined`);
        }

        if (section.type === 'chart' && !section.content?.config) {
          warnings.push(`Chart section "${section.id}" has no configuration`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sampleData: undefined, // Don't include sample data in response for security
    };
  }

  private async processReportGeneration(
    report: any,
    template: any,
    request: GenerateReportDto,
  ): Promise<void> {
    try {
      // Execute data query
      const data = await this.executeReportQuery({
        dataSource: template.dataSource,
        filters: request.filters || [],
        orderBy: request.orderBy || [],
        limit: request.limit,
        parameters: request.parameters,
      });

      // Generate report based on format
      let result: { filePath: string; fileSize: number };

      switch (request.format) {
        case 'PDF':
          result = await this.pdfGenerator.generateReport(
            data,
            template.layout as any,
            {
              title: request.name,
              filename: `${report.id}.pdf`,
            },
          );
          break;
        case 'EXCEL':
          result = await this.excelGenerator.generateReport(
            data,
            template.layout as any,
            {
              title: request.name,
              filename: `${report.id}.xlsx`,
              includeCharts: true,
            },
          );
          break;
        case 'CSV':
          result = await this.csvGenerator.generateReport(
            data,
            template.layout as any,
            {
              title: request.name,
              filename: `${report.id}.csv`,
            },
          );
          break;
        default:
          throw new BadRequestException(`Unsupported format: ${request.format}`);
      }

      // Update report with results
      await this.prisma.generatedReport.update({
        where: { id: report.id },
        data: {
          status: 'COMPLETED',
          filePath: result.filePath,
          fileSize: result.fileSize,
          completedAt: new Date(),
        },
      });

      this.logger.log(`Report generated successfully: ${report.id}`);
    } catch (error) {
      // Update report with error
      await this.prisma.generatedReport.update({
        where: { id: report.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });

      this.logger.error(`Report generation failed: ${report.id}`, error);
    }
  }

  private async executeReportQuery(query: ReportQuery): Promise<ReportData> {
    // This is a simplified implementation
    // In production, you would implement proper query execution with SQL/NoSQL databases

    try {
      // For demo purposes, return sample data
      // In real implementation, you would:
      // 1. Parse the dataSource
      // 2. Build appropriate queries
      // 3. Execute against database
      // 4. Apply filters, aggregations, etc.

      if (query.dataSource === 'patients') {
        return this.prisma.patient.findMany({
          where: this.buildFilters(query.filters),
          orderBy: this.buildOrderBy(query.orderBy),
          take: query.limit || 100,
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            isActive: true,
            createdAt: true,
          },
        });
      }

      if (query.dataSource === 'users') {
        return this.prisma.user.findMany({
          where: this.buildFilters(query.filters),
          orderBy: this.buildOrderBy(query.orderBy),
          take: query.limit || 100,
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            createdAt: true,
          },
        });
      }

      return [];
    } catch (error) {
      this.logger.error('Error executing report query', error);
      throw error;
    }
  }

  private buildFilters(filters?: ReportFilter[]): any {
    if (!filters || filters.length === 0) return {};

    const where: any = {};

    for (const filter of filters) {
      switch (filter.operator) {
        case 'eq':
          where[filter.field] = filter.value;
          break;
        case 'ne':
          where[filter.field] = { not: filter.value };
          break;
        case 'gt':
          where[filter.field] = { gt: filter.value };
          break;
        case 'gte':
          where[filter.field] = { gte: filter.value };
          break;
        case 'lt':
          where[filter.field] = { lt: filter.value };
          break;
        case 'lte':
          where[filter.field] = { lte: filter.value };
          break;
        case 'in':
          where[filter.field] = { in: Array.isArray(filter.value) ? filter.value : [filter.value] };
          break;
        case 'contains':
          where[filter.field] = { contains: filter.value };
          break;
      }
    }

    return where;
  }

  private buildOrderBy(orderBy?: { field: string; direction: 'asc' | 'desc' }[]): any {
    if (!orderBy || orderBy.length === 0) return [];

    return orderBy.map(order => ({
      [order.field]: order.direction,
    }));
  }

  private async validateReportAccess(template: any, userId: string, centerId?: string): Promise<void> {
    // Check user permissions
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user has report generation permissions
    const hasPermission = user.userRoles.some(userRole =>
      userRole.role.rolePermissions.some(rolePermission =>
        rolePermission.permission.name === 'GENERATE_REPORTS' ||
        rolePermission.permission.code === 'reports.generate'
      )
    );

    if (!hasPermission) {
      throw new BadRequestException('Insufficient permissions to generate reports');
    }

    // Check center access if specified
    if (centerId && template.centerId && centerId !== template.centerId) {
      throw new BadRequestException('Cannot access report from different center');
    }
  }

  private async initializeScheduledReports(): Promise<void> {
    const scheduledReports = await this.prisma.scheduledReport.findMany({
      where: { isActive: true },
    });

    for (const report of scheduledReports) {
      this.scheduleReportJob(report);
    }
  }

  private scheduleReportJob(scheduledReport: any): void {
    if (this.scheduledReports.has(scheduledReport.id)) {
      this.scheduledReports.get(scheduledReport.id)?.stop();
    }

    try {
      const task = cron.schedule(scheduledReport.schedule, () => {
        this.executeScheduledReport(scheduledReport);
      }, {
        scheduled: true,
        timezone: 'UTC',
      });

      this.scheduledReports.set(scheduledReport.id, task);
      this.logger.log(`Scheduled report job started: ${scheduledReport.name}`);
    } catch (error) {
      this.logger.error(`Failed to schedule report: ${scheduledReport.name}`, error);
    }
  }

  private async executeScheduledReport(scheduledReport: any): Promise<void> {
    try {
      const reportName = `${scheduledReport.name}_${Date.now()}`;

      await this.prisma.generatedReport.create({
        data: {
          templateId: scheduledReport.templateId,
          name: reportName,
          parameters: scheduledReport.parameters,
          format: scheduledReport.format,
          status: 'PENDING',
          generatedBy: 'SYSTEM',
        },
      });

      this.logger.log(`Scheduled report executed: ${reportName}`);
    } catch (error) {
      this.logger.error(`Error executing scheduled report: ${scheduledReport.name}`, error);
    }
  }

  private async getPopularTemplates(centerId?: string): Promise<any[]> {
    const where = centerId ? { template: { centerId } } : {};

    const templates = await this.prisma.generatedReport.groupBy({
      by: ['templateId'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const result = [];
    for (const item of templates) {
      const template = await this.prisma.reportTemplate.findUnique({
        where: { id: item.templateId },
        select: { id: true, name: true },
      });

      if (template) {
        result.push({
          templateId: template.id,
          templateName: template.name,
          generationCount: item._count.id,
        });
      }
    }

    return result;
  }

  private async getAverageGenerationTime(centerId?: string): Promise<number> {
    const where = centerId ? { template: { centerId } } : {};

    const reports = await this.prisma.generatedReport.findMany({
      where: {
        ...where,
        status: 'COMPLETED',
        completedAt: { not: null },
        generatedAt: { not: null },
      },
      select: {
        generatedAt: true,
        completedAt: true,
      },
    });

    if (reports.length === 0) return 0;

    const totalDuration = reports.reduce((sum, report) => {
      if (report.completedAt && report.generatedAt) {
        return sum + (report.completedAt.getTime() - report.generatedAt.getTime());
      }
      return sum;
    }, 0);

    return Math.round(totalDuration / reports.length / 1000); // Return in seconds
  }

  private async getSuccessRate(centerId?: string): Promise<number> {
    const where = centerId ? { template: { centerId } } : {};

    const [completed, failed] = await Promise.all([
      this.prisma.generatedReport.count({
        where: { ...where, status: 'COMPLETED' },
      }),
      this.prisma.generatedReport.count({
        where: { ...where, status: 'FAILED' },
      }),
    ]);

    const total = completed + failed;
    return total > 0 ? Math.round((completed / total) * 100) : 100;
  }

  private async getFormatDistribution(centerId?: string): Promise<Record<string, number>> {
    const where = centerId ? { template: { centerId } } : {};

    const reports = await this.prisma.generatedReport.groupBy({
      by: ['format'],
      where,
      _count: {
        id: true,
      },
    });

    const distribution: Record<string, number> = {};
    for (const item of reports) {
      distribution[item.format] = item._count.id;
    }

    return distribution;
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'PDF':
        return 'application/pdf';
      case 'EXCEL':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'CSV':
        return 'text/csv';
      case 'JSON':
        return 'application/json';
      case 'HTML':
        return 'text/html';
      default:
        return 'application/octet-stream';
    }
  }
}