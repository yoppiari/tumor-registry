import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '@/common/database/prisma.service';
import { CronJob } from 'cron';
import * as crypto from 'crypto';
import {
  ScheduleConfig,
  ReportScheduleData,
  ExecutionContext,
  ExecutionResult,
  ReportValidation,
  ExecutiveSummary,
  ThresholdAlert,
  KeyMetric,
  Insight,
} from '../interfaces/scheduled-reports.interface';
import { CreateScheduledReportDto } from '../dto/create-scheduled-report.dto';
import { UpdateScheduledReportDto } from '../dto/update-scheduled-report.dto';

@Injectable()
export class ScheduledReportsService {
  private readonly logger = new Logger(ScheduledReportsService.name);
  private scheduledJobs = new Map<string, CronJob>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.initializeScheduledReports();
  }

  // Lifecycle: Initialize all active scheduled reports on service start
  async onModuleInit() {
    await this.initializeScheduledReports();
  }

  async onModuleDestroy() {
    // Cleanup: Stop all cron jobs
    this.scheduledJobs.forEach((job) => job.stop());
    this.scheduledJobs.clear();
  }

  // Story 6.3: Create scheduled report
  async create(createDto: CreateScheduledReportDto): Promise<any> {
    try {
      // Validate cron expression
      this.validateCronExpression(createDto.schedule);

      // Validate template exists
      const template = await this.prisma.reportTemplate.findUnique({
        where: { id: createDto.templateId },
      });

      if (!template) {
        throw new NotFoundException('Report template not found');
      }

      // Calculate next run time
      const nextRun = this.calculateNextRun(createDto.schedule);

      const scheduledReport = await this.prisma.scheduledReport.create({
        data: {
          templateId: createDto.templateId,
          name: createDto.name,
          description: createDto.description,
          schedule: createDto.schedule,
          recipients: createDto.recipients as any,
          parameters: createDto.parameters as any,
          format: createDto.format,
          deliveryMethod: createDto.deliveryMethod,
          isActive: createDto.isActive ?? true,
          nextRun,
          createdBy: createDto.createdBy,
        },
        include: {
          template: true,
        },
      });

      // Schedule the cron job if active
      if (scheduledReport.isActive) {
        await this.scheduleJob(scheduledReport);
      }

      this.logger.log(`Scheduled report created: ${scheduledReport.name} (ID: ${scheduledReport.id})`);
      return scheduledReport;
    } catch (error) {
      this.logger.error('Error creating scheduled report', error);
      throw error;
    }
  }

  // Story 6.3: Update scheduled report
  async update(id: string, updateDto: UpdateScheduledReportDto): Promise<any> {
    try {
      const existing = await this.prisma.scheduledReport.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Scheduled report not found');
      }

      // If schedule changed, validate new cron expression
      if (updateDto.schedule && updateDto.schedule !== existing.schedule) {
        this.validateCronExpression(updateDto.schedule);
      }

      const nextRun = updateDto.schedule
        ? this.calculateNextRun(updateDto.schedule)
        : existing.nextRun;

      const updated = await this.prisma.scheduledReport.update({
        where: { id },
        data: {
          ...updateDto,
          recipients: updateDto.recipients as any,
          parameters: updateDto.parameters as any,
          nextRun,
        },
        include: {
          template: true,
        },
      });

      // Reschedule the job
      await this.unscheduleJob(id);
      if (updated.isActive) {
        await this.scheduleJob(updated);
      }

      this.logger.log(`Scheduled report updated: ${updated.name} (ID: ${id})`);
      return updated;
    } catch (error) {
      this.logger.error('Error updating scheduled report', error);
      throw error;
    }
  }

  // Get scheduled report by ID
  async findOne(id: string): Promise<any> {
    const report = await this.prisma.scheduledReport.findUnique({
      where: { id },
      include: {
        template: true,
        executions: {
          take: 10,
          orderBy: { executionTime: 'desc' },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Scheduled report not found');
    }

    return report;
  }

  // Get all scheduled reports with filters
  async findAll(filters?: {
    templateId?: string;
    isActive?: boolean;
    deliveryMethod?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.templateId) where.templateId = filters.templateId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.deliveryMethod) where.deliveryMethod = filters.deliveryMethod;

    return this.prisma.scheduledReport.findMany({
      where,
      include: {
        template: true,
        _count: {
          select: {
            executions: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { nextRun: 'asc' },
      ],
    });
  }

  // Toggle active status
  async toggleActive(id: string): Promise<any> {
    const report = await this.prisma.scheduledReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Scheduled report not found');
    }

    const updated = await this.prisma.scheduledReport.update({
      where: { id },
      data: {
        isActive: !report.isActive,
      },
    });

    if (updated.isActive) {
      await this.scheduleJob(updated);
    } else {
      await this.unscheduleJob(id);
    }

    this.logger.log(`Scheduled report ${updated.isActive ? 'activated' : 'deactivated'}: ${id}`);
    return updated;
  }

  // Delete scheduled report
  async remove(id: string): Promise<void> {
    const report = await this.prisma.scheduledReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Scheduled report not found');
    }

    await this.unscheduleJob(id);
    await this.prisma.scheduledReport.delete({
      where: { id },
    });

    this.logger.log(`Scheduled report deleted: ${id}`);
  }

  // Story 6.3: Execute scheduled report with data validation
  async executeScheduledReport(context: ExecutionContext): Promise<ExecutionResult> {
    const startTime = Date.now();
    const { scheduledReportId, executionTime, parameters } = context;

    try {
      this.logger.log(`Executing scheduled report: ${scheduledReportId}`);

      // Get scheduled report details
      const scheduledReport = await this.prisma.scheduledReport.findUnique({
        where: { id: scheduledReportId },
        include: {
          template: true,
        },
      });

      if (!scheduledReport) {
        throw new NotFoundException('Scheduled report not found');
      }

      // Create execution record
      const execution = await this.prisma.reportExecution.create({
        data: {
          scheduledReportId,
          executionTime,
          status: 'RUNNING',
          recipients: scheduledReport.recipients,
          success: false,
        },
      });

      // Story 6.3: Validate data quality before generation
      const validation = await this.validateReportData(scheduledReport.template.dataSource);

      if (!validation.isValid) {
        throw new BadRequestException(`Data validation failed: ${validation.errors.join(', ')}`);
      }

      // Log warnings if data quality is not optimal
      if (validation.warnings.length > 0) {
        this.logger.warn(`Data quality warnings for report ${scheduledReportId}: ${validation.warnings.join(', ')}`);
      }

      // Generate the report (this would call the reports service)
      const reportResult = await this.generateReport(scheduledReport, parameters);

      // Story 6.3: Generate executive summary
      const executiveSummary = await this.generateExecutiveSummary(
        reportResult.data,
        scheduledReport.template,
      );

      // Story 6.3: Check threshold alerts
      const alerts = await this.checkThresholds(reportResult.data, scheduledReport.template);

      // Send alerts if thresholds exceeded
      if (alerts.length > 0) {
        await this.sendThresholdAlerts(alerts, scheduledReport);
      }

      const duration = Math.floor((Date.now() - startTime) / 1000);

      // Update execution record
      await this.prisma.reportExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          filePath: reportResult.filePath,
          fileSize: reportResult.fileSize,
          duration,
          success: true,
          deliveryStatus: 'SENT',
        },
      });

      // Update scheduled report stats
      await this.prisma.scheduledReport.update({
        where: { id: scheduledReportId },
        data: {
          lastRun: executionTime,
          nextRun: this.calculateNextRun(scheduledReport.schedule),
          successCount: { increment: 1 },
        },
      });

      // Story 6.3: Distribute report to stakeholders
      await this.distributeReport(execution.id, scheduledReport, reportResult, executiveSummary);

      this.logger.log(`Scheduled report executed successfully: ${scheduledReportId} (${duration}s)`);

      return {
        success: true,
        filePath: reportResult.filePath,
        fileSize: reportResult.fileSize,
        duration,
      };
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);

      this.logger.error(`Error executing scheduled report ${scheduledReportId}`, error);

      // Update failure count
      await this.prisma.scheduledReport.update({
        where: { id: scheduledReportId },
        data: {
          lastRun: executionTime,
          nextRun: this.calculateNextRun((await this.findOne(scheduledReportId)).schedule),
          failureCount: { increment: 1 },
        },
      });

      return {
        success: false,
        duration,
        errorMessage: error.message,
      };
    }
  }

  // Story 6.3: Validate data before report generation
  private async validateReportData(dataSource: string): Promise<ReportValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let dataQuality = { completeness: 100, accuracy: 100, timeliness: 100 };

    try {
      // Check data availability
      const dataCount = await this.getDataSourceCount(dataSource);

      if (dataCount === 0) {
        errors.push('No data available for report generation');
      }

      // Check data freshness (last 24 hours)
      const recentDataCount = await this.getRecentDataCount(dataSource, 24);
      const freshnessRatio = dataCount > 0 ? (recentDataCount / dataCount) * 100 : 0;

      if (freshnessRatio < 10) {
        warnings.push('Data may be stale - less than 10% updated in last 24 hours');
        dataQuality.timeliness = freshnessRatio;
      }

      // Check data completeness (this is simplified)
      const completenessScore = await this.checkDataCompleteness(dataSource);
      if (completenessScore < 80) {
        warnings.push(`Data completeness is ${completenessScore}% - some fields may be missing`);
        dataQuality.completeness = completenessScore;
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        dataQuality,
      };
    } catch (error) {
      this.logger.error('Error validating report data', error);
      return {
        isValid: false,
        errors: [error.message],
        warnings,
      };
    }
  }

  // Story 6.3: Generate executive summary with key insights
  private async generateExecutiveSummary(data: any[], template: any): Promise<ExecutiveSummary> {
    // This is a simplified implementation
    // In production, you would use AI/ML or advanced analytics

    const keyMetrics: KeyMetric[] = [];
    const insights: Insight[] = [];

    // Calculate basic metrics
    keyMetrics.push({
      name: 'Total Records',
      value: data.length,
      trend: 'stable',
      status: 'good',
    });

    // Generate insights based on data patterns
    if (data.length > 0) {
      insights.push({
        category: 'Data Volume',
        description: `Report contains ${data.length} records`,
        impact: 'medium',
        data: { count: data.length },
      });
    }

    return {
      title: `Executive Summary - ${template.name}`,
      period: new Date().toISOString().split('T')[0],
      keyMetrics,
      insights,
      recommendations: [
        'Review data quality metrics regularly',
        'Monitor threshold alerts for anomalies',
      ],
      generatedAt: new Date(),
    };
  }

  // Story 6.3: Check metrics against thresholds
  private async checkThresholds(data: any[], template: any): Promise<ThresholdAlert[]> {
    const alerts: ThresholdAlert[] = [];

    // Example threshold checks (customize based on template configuration)
    const recordCount = data.length;

    // Check if record count is below expected threshold
    if (recordCount < 100) {
      alerts.push({
        metricName: 'Record Count',
        currentValue: recordCount,
        thresholdValue: 100,
        condition: 'less_than',
        severity: 'warning',
        message: `Record count (${recordCount}) is below expected threshold (100)`,
      });
    }

    return alerts;
  }

  // Send threshold alerts to stakeholders
  private async sendThresholdAlerts(alerts: ThresholdAlert[], scheduledReport: any): Promise<void> {
    for (const alert of alerts) {
      this.logger.warn(`THRESHOLD ALERT [${alert.severity}]: ${alert.message}`);

      // In production, send notifications through notification service
      // await this.notificationService.send({
      //   type: 'THRESHOLD_EXCEEDED',
      //   severity: alert.severity,
      //   title: `Alert: ${alert.metricName}`,
      //   message: alert.message,
      //   recipients: scheduledReport.recipients,
      // });
    }
  }

  // Story 6.3: Distribute report with personalization
  private async distributeReport(
    executionId: string,
    scheduledReport: any,
    reportResult: any,
    executiveSummary: ExecutiveSummary,
  ): Promise<void> {
    const recipients = scheduledReport.recipients as any[];

    for (const recipient of recipients) {
      try {
        // Create distribution record
        await this.prisma.reportDistribution.create({
          data: {
            reportExecutionId: executionId,
            recipientType: recipient.type,
            recipientId: recipient.value,
            recipientEmail: await this.resolveRecipientEmail(recipient),
            recipientName: await this.resolveRecipientName(recipient),
            deliveryMethod: scheduledReport.deliveryMethod,
            deliveryStatus: 'PENDING',
          },
        });

        // Personalize and send (simplified - would use email/notification service)
        const personalizedContent = this.personalizeReport(
          reportResult,
          executiveSummary,
          recipient.personalization || {},
        );

        this.logger.log(`Report distributed to: ${recipient.value} (${recipient.type})`);
      } catch (error) {
        this.logger.error(`Error distributing report to ${recipient.value}`, error);
      }
    }
  }

  private personalizeReport(reportResult: any, summary: ExecutiveSummary, personalization: any): any {
    // Apply personalization rules
    return {
      ...reportResult,
      summary,
      personalization,
    };
  }

  // Helper methods
  private async initializeScheduledReports(): Promise<void> {
    try {
      const activeReports = await this.prisma.scheduledReport.findMany({
        where: { isActive: true },
      });

      for (const report of activeReports) {
        await this.scheduleJob(report);
      }

      this.logger.log(`Initialized ${activeReports.length} scheduled reports`);
    } catch (error) {
      this.logger.error('Error initializing scheduled reports', error);
    }
  }

  private async scheduleJob(scheduledReport: any): Promise<void> {
    try {
      const job = new CronJob(
        scheduledReport.schedule,
        () => {
          this.executeScheduledReport({
            scheduledReportId: scheduledReport.id,
            executionTime: new Date(),
          });
        },
        null,
        true,
        'UTC',
      );

      this.scheduledJobs.set(scheduledReport.id, job);
      this.logger.log(`Scheduled job created for report: ${scheduledReport.name}`);
    } catch (error) {
      this.logger.error(`Error scheduling job for report ${scheduledReport.id}`, error);
      throw error;
    }
  }

  private async unscheduleJob(reportId: string): Promise<void> {
    const job = this.scheduledJobs.get(reportId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(reportId);
      this.logger.log(`Unscheduled job for report: ${reportId}`);
    }
  }

  private validateCronExpression(expression: string): void {
    try {
      new CronJob(expression, () => {}, null, false);
    } catch (error) {
      throw new BadRequestException(`Invalid cron expression: ${expression}`);
    }
  }

  private calculateNextRun(cronExpression: string): Date {
    const job = new CronJob(cronExpression, () => {}, null, false);
    return job.nextDate().toJSDate();
  }

  private async generateReport(scheduledReport: any, parameters?: any): Promise<any> {
    // Simplified - would integrate with ReportsService
    const filePath = `/reports/${scheduledReport.id}_${Date.now()}.${scheduledReport.format.toLowerCase()}`;
    const fileSize = 1024 * 100; // 100KB mock

    return {
      filePath,
      fileSize,
      data: [], // Would contain actual report data
    };
  }

  private async getDataSourceCount(dataSource: string): Promise<number> {
    // Simplified implementation
    if (dataSource === 'patients') {
      return this.prisma.patient.count();
    }
    return 0;
  }

  private async getRecentDataCount(dataSource: string, hours: number): Promise<number> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    if (dataSource === 'patients') {
      return this.prisma.patient.count({
        where: {
          createdAt: { gte: since },
        },
      });
    }
    return 0;
  }

  private async checkDataCompleteness(dataSource: string): Promise<number> {
    // Simplified - would check field completeness
    return 95; // Mock 95% completeness
  }

  private async resolveRecipientEmail(recipient: any): Promise<string> {
    if (recipient.type === 'EMAIL') {
      return recipient.value;
    }
    if (recipient.type === 'USER') {
      const user = await this.prisma.user.findUnique({
        where: { id: recipient.value },
        select: { email: true },
      });
      return user?.email || '';
    }
    return '';
  }

  private async resolveRecipientName(recipient: any): Promise<string> {
    if (recipient.type === 'USER') {
      const user = await this.prisma.user.findUnique({
        where: { id: recipient.value },
        select: { name: true },
      });
      return user?.name || '';
    }
    return recipient.value;
  }

  // Cron job to cleanup old executions
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldExecutions() {
    const retentionDays = 90;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    try {
      const result = await this.prisma.reportExecution.deleteMany({
        where: {
          executionTime: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(`Cleaned up ${result.count} old report executions`);
    } catch (error) {
      this.logger.error('Error cleaning up old executions', error);
    }
  }
}
