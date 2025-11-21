"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/database/prisma.service");
const pdf_generator_1 = require("../generators/pdf.generator");
const excel_generator_1 = require("../generators/excel.generator");
const csv_generator_1 = require("../generators/csv.generator");
const cron = require("node-cron");
const path = require("path");
const fs = require("fs");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor(prisma, pdfGenerator, excelGenerator, csvGenerator) {
        this.prisma = prisma;
        this.pdfGenerator = pdfGenerator;
        this.excelGenerator = excelGenerator;
        this.csvGenerator = csvGenerator;
        this.logger = new common_1.Logger(ReportsService_1.name);
        this.scheduledReports = new Map();
        this.initializeScheduledReports();
    }
    async createTemplate(createTemplateDto) {
        try {
            const validation = await this.validateTemplate({
                ...createTemplateDto,
                layout: createTemplateDto.layout,
                charts: createTemplateDto.charts,
            });
            if (!validation.isValid) {
                throw new common_1.BadRequestException(`Template validation failed: ${validation.errors.join(', ')}`);
            }
            const template = await this.prisma.reportTemplate.create({
                data: {
                    ...createTemplateDto,
                    layout: createTemplateDto.layout,
                    styling: createTemplateDto.styling,
                    filters: createTemplateDto.filters,
                    aggregations: createTemplateDto.aggregations,
                    charts: createTemplateDto.charts,
                },
            });
            this.logger.log(`Report template created: ${template.name}`);
            return template;
        }
        catch (error) {
            this.logger.error('Error creating report template', error);
            throw error;
        }
    }
    async generateReport(generateReportDto) {
        try {
            const template = await this.prisma.reportTemplate.findUnique({
                where: { id: generateReportDto.templateId },
            });
            if (!template) {
                throw new common_1.NotFoundException('Report template not found');
            }
            await this.validateReportAccess(template, generateReportDto.generatedBy, generateReportDto.centerId);
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
            this.processReportGeneration(report, template, generateReportDto);
            return report;
        }
        catch (error) {
            this.logger.error('Error generating report', error);
            throw error;
        }
    }
    async getReport(reportId) {
        const report = await this.prisma.generatedReport.findUnique({
            where: { id: reportId },
            include: {
                template: true,
            },
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        if (report.expiresAt && new Date() > report.expiresAt) {
            throw new common_1.NotFoundException('Report has expired');
        }
        return report;
    }
    async downloadReport(reportId) {
        const report = await this.getReport(reportId);
        if (!report.filePath) {
            throw new common_1.NotFoundException('Report file not available');
        }
        if (!fs.existsSync(report.filePath)) {
            throw new common_1.NotFoundException('Report file not found on disk');
        }
        const fileName = path.basename(report.filePath);
        const mimeType = this.getMimeType(report.format);
        return { filePath: report.filePath, fileName, mimeType };
    }
    async scheduleReport(scheduleData) {
        try {
            const scheduledReport = await this.prisma.scheduledReport.create({
                data: {
                    ...scheduleData,
                    recipients: scheduleData.recipients,
                    parameters: scheduleData.parameters,
                },
            });
            if (scheduledReport.isActive) {
                this.scheduleReportJob(scheduledReport);
            }
            this.logger.log(`Report scheduled: ${scheduledReport.name}`);
            return scheduledReport;
        }
        catch (error) {
            this.logger.error('Error scheduling report', error);
            throw error;
        }
    }
    async getTemplates(filters) {
        const where = {};
        if (filters?.reportType)
            where.reportType = filters.reportType;
        if (filters?.accessLevel)
            where.accessLevel = filters.accessLevel;
        if (filters?.centerId)
            where.centerId = filters.centerId;
        if (filters?.isActive !== undefined)
            where.isActive = filters.isActive;
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
    async getGeneratedReports(filters) {
        const where = {};
        if (filters?.templateId)
            where.templateId = filters.templateId;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.format)
            where.format = filters.format;
        if (filters?.generatedBy)
            where.generatedBy = filters.generatedBy;
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
    async getReportStatistics(centerId) {
        const templateWhere = centerId ? { centerId } : {};
        const reportWhere = centerId ? { template: { centerId } } : {};
        const [totalReports, activeReports, scheduledReports, recentGenerations, popularTemplates, averageGenerationTime, successRate,] = await Promise.all([
            this.prisma.generatedReport.count(),
            this.prisma.reportTemplate.count({ where: { ...templateWhere, isActive: true } }),
            this.prisma.scheduledReport.count({
                where: { isActive: true, template: templateWhere },
            }),
            this.prisma.generatedReport.count({
                where: {
                    ...reportWhere,
                    generatedAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
    async validateTemplate(templateData) {
        const errors = [];
        const warnings = [];
        if (!templateData.name)
            errors.push('Template name is required');
        if (!templateData.title)
            errors.push('Template title is required');
        if (!templateData.dataSource)
            errors.push('Data source is required');
        if (!templateData.layout || !templateData.layout.sections || templateData.layout.sections.length === 0) {
            errors.push('At least one layout section is required');
        }
        try {
            const sampleData = await this.executeReportQuery({
                dataSource: templateData.dataSource,
                filters: [],
                limit: 5,
            });
            if (sampleData.length === 0) {
                warnings.push('Data source returned no results');
            }
        }
        catch (error) {
            errors.push(`Data source validation failed: ${error.message}`);
        }
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
            sampleData: undefined,
        };
    }
    async processReportGeneration(report, template, request) {
        try {
            const data = await this.executeReportQuery({
                dataSource: template.dataSource,
                filters: request.filters || [],
                orderBy: request.orderBy || [],
                limit: request.limit,
                parameters: request.parameters,
            });
            let result;
            switch (request.format) {
                case 'PDF':
                    result = await this.pdfGenerator.generateReport(data, template.layout, {
                        title: request.name,
                        filename: `${report.id}.pdf`,
                    });
                    break;
                case 'EXCEL':
                    result = await this.excelGenerator.generateReport(data, template.layout, {
                        title: request.name,
                        filename: `${report.id}.xlsx`,
                        includeCharts: true,
                    });
                    break;
                case 'CSV':
                    result = await this.csvGenerator.generateReport(data, template.layout, {
                        title: request.name,
                        filename: `${report.id}.csv`,
                    });
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported format: ${request.format}`);
            }
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
        }
        catch (error) {
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
    async executeReportQuery(query) {
        try {
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
        }
        catch (error) {
            this.logger.error('Error executing report query', error);
            throw error;
        }
    }
    buildFilters(filters) {
        if (!filters || filters.length === 0)
            return {};
        const where = {};
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
    buildOrderBy(orderBy) {
        if (!orderBy || orderBy.length === 0)
            return [];
        return orderBy.map(order => ({
            [order.field]: order.direction,
        }));
    }
    async validateReportAccess(template, userId, centerId) {
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
            throw new common_1.BadRequestException('User not found');
        }
        const hasPermission = user.userRoles.some(userRole => userRole.role.rolePermissions.some(rolePermission => rolePermission.permission.name === 'GENERATE_REPORTS' ||
            rolePermission.permission.code === 'reports.generate'));
        if (!hasPermission) {
            throw new common_1.BadRequestException('Insufficient permissions to generate reports');
        }
        if (centerId && template.centerId && centerId !== template.centerId) {
            throw new common_1.BadRequestException('Cannot access report from different center');
        }
    }
    async initializeScheduledReports() {
        const scheduledReports = await this.prisma.scheduledReport.findMany({
            where: { isActive: true },
        });
        for (const report of scheduledReports) {
            this.scheduleReportJob(report);
        }
    }
    scheduleReportJob(scheduledReport) {
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
        }
        catch (error) {
            this.logger.error(`Failed to schedule report: ${scheduledReport.name}`, error);
        }
    }
    async executeScheduledReport(scheduledReport) {
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
        }
        catch (error) {
            this.logger.error(`Error executing scheduled report: ${scheduledReport.name}`, error);
        }
    }
    async getPopularTemplates(centerId) {
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
    async getAverageGenerationTime(centerId) {
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
        if (reports.length === 0)
            return 0;
        const totalDuration = reports.reduce((sum, report) => {
            if (report.completedAt && report.generatedAt) {
                return sum + (report.completedAt.getTime() - report.generatedAt.getTime());
            }
            return sum;
        }, 0);
        return Math.round(totalDuration / reports.length / 1000);
    }
    async getSuccessRate(centerId) {
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
    async getFormatDistribution(centerId) {
        const where = centerId ? { template: { centerId } } : {};
        const reports = await this.prisma.generatedReport.groupBy({
            by: ['format'],
            where,
            _count: {
                id: true,
            },
        });
        const distribution = {};
        for (const item of reports) {
            distribution[item.format] = item._count.id;
        }
        return distribution;
    }
    getMimeType(format) {
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_generator_1.PdfGenerator,
        excel_generator_1.ExcelGenerator,
        csv_generator_1.CsvGenerator])
], ReportsService);
//# sourceMappingURL=reports.service.js.map