import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class ReportHistoryService {
  private readonly logger = new Logger(ReportHistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Story 6.5: Create immutable history record when report is generated
  async createHistoryRecord(reportData: {
    reportId: string;
    reportType: 'GENERATED' | 'SCHEDULED' | 'AD_HOC' | 'AUTOMATED';
    templateId: string;
    templateVersion?: string;
    name: string;
    format: string;
    parameters?: any;
    status: string;
    generatedBy?: string;
    generatedAt: Date;
    completedAt?: Date;
    fileSize?: number;
    filePath?: string;
    changeDescription?: string;
    previousVersion?: string;
  }): Promise<any> {
    try {
      // Calculate file hash for integrity verification
      const fileHash = reportData.filePath
        ? await this.calculateFileHash(reportData.filePath)
        : undefined;

      // Calculate retention date based on policy
      const retentionUntil = this.calculateRetentionDate(reportData.reportType);

      const historyRecord = await this.prisma.reportHistory.create({
        data: {
          reportId: reportData.reportId,
          reportType: reportData.reportType as any,
          templateId: reportData.templateId,
          templateVersion: reportData.templateVersion,
          name: reportData.name,
          format: reportData.format as any,
          parameters: reportData.parameters as any,
          status: reportData.status as any,
          generatedBy: reportData.generatedBy,
          generatedAt: reportData.generatedAt,
          completedAt: reportData.completedAt,
          fileSize: reportData.fileSize,
          filePath: reportData.filePath,
          fileHash,
          changeDescription: reportData.changeDescription,
          previousVersion: reportData.previousVersion,
          retentionUntil,
        },
      });

      this.logger.log(`History record created for report: ${reportData.reportId}`);
      return historyRecord;
    } catch (error) {
      this.logger.error('Error creating history record', error);
      throw error;
    }
  }

  // Story 6.5: Track report distributions
  async trackDistribution(distributionData: {
    reportHistoryId: string;
    reportExecutionId?: string;
    recipientType: string;
    recipientId: string;
    recipientEmail?: string;
    recipientName?: string;
    deliveryMethod: string;
    deliveryStatus: string;
  }): Promise<any> {
    return this.prisma.reportDistribution.create({
      data: {
        reportHistoryId: distributionData.reportHistoryId,
        reportExecutionId: distributionData.reportExecutionId,
        recipientType: distributionData.recipientType as any,
        recipientId: distributionData.recipientId,
        recipientEmail: distributionData.recipientEmail,
        recipientName: distributionData.recipientName,
        deliveryMethod: distributionData.deliveryMethod as any,
        deliveryStatus: distributionData.deliveryStatus as any,
      },
    });
  }

  // Story 6.5: Update distribution delivery confirmation
  async confirmDelivery(distributionId: string, status: string): Promise<any> {
    const updates: any = {
      deliveryStatus: status as any,
    };

    if (status === 'DELIVERED') {
      updates.deliveredAt = new Date();
    } else if (status === 'OPENED') {
      updates.openedAt = new Date();
    } else if (status === 'FAILED') {
      updates.retryCount = { increment: 1 };
    }

    return this.prisma.reportDistribution.update({
      where: { id: distributionId },
      data: updates,
    });
  }

  // Story 6.5: Log report access (who viewed the report)
  async logAccess(accessData: {
    reportHistoryId: string;
    userId?: string;
    userName?: string;
    accessType: 'VIEW' | 'DOWNLOAD' | 'PRINT' | 'SHARE' | 'EXPORT';
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    pagesViewed?: number;
    actionsPerformed?: any;
  }): Promise<any> {
    return this.prisma.reportAccessLog.create({
      data: {
        reportHistoryId: accessData.reportHistoryId,
        userId: accessData.userId,
        userName: accessData.userName,
        accessType: accessData.accessType as any,
        ipAddress: accessData.ipAddress,
        userAgent: accessData.userAgent,
        duration: accessData.duration,
        pagesViewed: accessData.pagesViewed,
        actionsPerformed: accessData.actionsPerformed as any,
      },
    });
  }

  // Get complete history for a report
  async getReportHistory(reportId: string): Promise<any[]> {
    return this.prisma.reportHistory.findMany({
      where: { reportId },
      include: {
        distributions: true,
        accessLogs: {
          orderBy: { accessedAt: 'desc' },
          take: 100,
        },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  // Get history by template
  async getTemplateHistory(
    templateId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      status?: string;
      limit?: number;
    },
  ): Promise<any[]> {
    const where: any = { templateId };

    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.generatedAt = {};
      if (filters.startDate) where.generatedAt.gte = filters.startDate;
      if (filters.endDate) where.generatedAt.lte = filters.endDate;
    }

    return this.prisma.reportHistory.findMany({
      where,
      include: {
        _count: {
          select: {
            distributions: true,
            accessLogs: true,
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
      take: filters?.limit || 100,
    });
  }

  // Story 6.5: Get distribution tracking with recipient lists
  async getDistributions(
    reportHistoryId: string,
    includeDetails: boolean = true,
  ): Promise<any[]> {
    return this.prisma.reportDistribution.findMany({
      where: { reportHistoryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Story 6.5: Get access logs (who viewed the report)
  async getAccessLogs(
    reportHistoryId: string,
    filters?: {
      userId?: string;
      accessType?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<any[]> {
    const where: any = { reportHistoryId };

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.accessType) where.accessType = filters.accessType;
    if (filters?.startDate || filters?.endDate) {
      where.accessedAt = {};
      if (filters.startDate) where.accessedAt.gte = filters.startDate;
      if (filters.endDate) where.accessedAt.lte = filters.endDate;
    }

    return this.prisma.reportAccessLog.findMany({
      where,
      orderBy: { accessedAt: 'desc' },
    });
  }

  // Story 6.5: Verify report integrity using file hash
  async verifyIntegrity(reportHistoryId: string): Promise<{
    isValid: boolean;
    originalHash: string;
    currentHash?: string;
    message: string;
  }> {
    const history = await this.prisma.reportHistory.findUnique({
      where: { id: reportHistoryId },
    });

    if (!history) {
      throw new NotFoundException('Report history not found');
    }

    if (!history.filePath || !history.fileHash) {
      return {
        isValid: false,
        originalHash: history.fileHash || '',
        message: 'File path or hash not available',
      };
    }

    // Check if file exists
    if (!fs.existsSync(history.filePath)) {
      return {
        isValid: false,
        originalHash: history.fileHash,
        message: 'Report file not found',
      };
    }

    // Calculate current hash
    const currentHash = await this.calculateFileHash(history.filePath);

    const isValid = currentHash === history.fileHash;

    return {
      isValid,
      originalHash: history.fileHash,
      currentHash,
      message: isValid ? 'File integrity verified' : 'File has been modified',
    };
  }

  // Story 6.5: Export history for compliance audits
  async exportForAudit(filters?: {
    startDate?: Date;
    endDate?: Date;
    templateId?: string;
    reportType?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.templateId) where.templateId = filters.templateId;
    if (filters?.reportType) where.reportType = filters.reportType;
    if (filters?.startDate || filters?.endDate) {
      where.generatedAt = {};
      if (filters.startDate) where.generatedAt.gte = filters.startDate;
      if (filters.endDate) where.generatedAt.lte = filters.endDate;
    }

    return this.prisma.reportHistory.findMany({
      where,
      include: {
        distributions: {
          select: {
            recipientEmail: true,
            recipientName: true,
            deliveryMethod: true,
            deliveryStatus: true,
            sentAt: true,
            deliveredAt: true,
          },
        },
        accessLogs: {
          select: {
            userId: true,
            userName: true,
            accessType: true,
            accessedAt: true,
            ipAddress: true,
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  // Story 6.5: Archive old reports based on retention policy
  async archiveOldReports(): Promise<{ archived: number; deleted: number }> {
    const now = new Date();

    // Find reports past retention date
    const reportsToArchive = await this.prisma.reportHistory.findMany({
      where: {
        retentionUntil: {
          lte: now,
        },
        archivedAt: null,
      },
    });

    let archived = 0;
    let deleted = 0;

    for (const report of reportsToArchive) {
      try {
        // Archive the file (move to archive storage)
        if (report.filePath && fs.existsSync(report.filePath)) {
          const archivePath = this.getArchivePath(report.filePath);
          await this.moveToArchive(report.filePath, archivePath);

          await this.prisma.reportHistory.update({
            where: { id: report.id },
            data: {
              archivedAt: now,
              filePath: archivePath,
            },
          });

          archived++;
        } else {
          // If file doesn't exist, just mark as archived
          await this.prisma.reportHistory.update({
            where: { id: report.id },
            data: {
              archivedAt: now,
            },
          });

          deleted++;
        }
      } catch (error) {
        this.logger.error(`Error archiving report ${report.id}`, error);
      }
    }

    this.logger.log(`Archived ${archived} reports, deleted ${deleted} missing files`);

    return { archived, deleted };
  }

  // Get version history with changes
  async getVersionHistory(reportId: string): Promise<any[]> {
    const history = await this.prisma.reportHistory.findMany({
      where: { reportId },
      orderBy: { generatedAt: 'desc' },
    });

    // Build version chain
    const versions = [];
    for (const version of history) {
      versions.push({
        id: version.id,
        version: version.templateVersion,
        generatedAt: version.generatedAt,
        generatedBy: version.generatedBy,
        changeDescription: version.changeDescription,
        status: version.status,
        fileSize: version.fileSize,
      });
    }

    return versions;
  }

  // Helper methods
  private async calculateFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private calculateRetentionDate(reportType: string): Date {
    // Different retention policies based on report type
    const retentionDays = {
      GENERATED: 90,
      SCHEDULED: 180,
      AD_HOC: 30,
      AUTOMATED: 365,
    };

    const days = retentionDays[reportType] || 90;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private getArchivePath(originalPath: string): string {
    // Move to archive directory
    return originalPath.replace('/reports/', '/reports/archive/');
  }

  private async moveToArchive(sourcePath: string, destPath: string): Promise<void> {
    // Ensure archive directory exists
    const archiveDir = destPath.substring(0, destPath.lastIndexOf('/'));

    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Move file
    fs.renameSync(sourcePath, destPath);
  }

  // Statistics and analytics
  async getHistoryStatistics(filters?: {
    templateId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    const where: any = {};

    if (filters?.templateId) where.templateId = filters.templateId;
    if (filters?.startDate || filters?.endDate) {
      where.generatedAt = {};
      if (filters.startDate) where.generatedAt.gte = filters.startDate;
      if (filters.endDate) where.generatedAt.lte = filters.endDate;
    }

    const [
      totalReports,
      totalDistributions,
      totalAccesses,
      averageFileSize,
      distributionsByStatus,
    ] = await Promise.all([
      this.prisma.reportHistory.count({ where }),
      this.prisma.reportDistribution.count({
        where: { reportHistory: where },
      }),
      this.prisma.reportAccessLog.count({
        where: { reportHistory: where },
      }),
      this.prisma.reportHistory.aggregate({
        where,
        _avg: { fileSize: true },
      }),
      this.getDistributionsByStatus(where),
    ]);

    return {
      totalReports,
      totalDistributions,
      totalAccesses,
      averageFileSize: averageFileSize._avg.fileSize,
      distributionsByStatus,
    };
  }

  private async getDistributionsByStatus(historyWhere: any): Promise<any> {
    const distributions = await this.prisma.reportDistribution.groupBy({
      by: ['deliveryStatus'],
      where: { reportHistory: historyWhere },
      _count: true,
    });

    const result: any = {};
    distributions.forEach((item) => {
      result[item.deliveryStatus] = item._count;
    });

    return result;
  }
}
