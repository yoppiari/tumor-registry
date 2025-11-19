import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DatabaseBackupStrategy } from '../strategies/database-backup.strategy';
import {
  BackupJobData,
  BackupExecutionData,
  BackupStatistics,
  BackupHealthStatus,
  RecoveryOptions,
  RecoveryResult,
  StorageConfig,
} from '../interfaces/backup.interface';
import { CreateBackupJobDto } from '../dto/create-backup-job.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as cron from 'node-cron';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private scheduledJobs = new Map<string, cron.ScheduledTask>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly databaseBackupStrategy: DatabaseBackupStrategy,
  ) {
    this.initializeScheduledBackups();
  }

  async createBackupJob(createBackupJobDto: CreateBackupJobDto): Promise<any> {
    try {
      // Validate storage location
      await this.validateStorageLocation(createBackupJobDto.storageLocation);

      const backupJob = await this.prisma.backupJob.create({
        data: {
          ...createBackupJobDto,
          estimatedSize: BigInt(0), // Will be calculated on first run
        },
      });

      // Schedule the backup if a schedule is provided
      if (createBackupJobDto.schedule && createBackupJobDto.isActive) {
        this.scheduleBackupJob(backupJob);
      }

      this.logger.log(`Backup job created: ${backupJob.name}`);
      return backupJob;
    } catch (error) {
      this.logger.error('Error creating backup job', error);
      throw error;
    }
  }

  async executeBackup(backupJobId: string): Promise<any> {
    try {
      const backupJob = await this.prisma.backupJob.findUnique({
        where: { id: backupJobId },
      });

      if (!backupJob) {
        throw new NotFoundException('Backup job not found');
      }

      if (!backupJob.isActive) {
        throw new BadRequestException('Backup job is not active');
      }

      // Create backup execution record
      const execution = await this.prisma.backupExecution.create({
        data: {
          backupJobId,
          status: 'RUNNING',
          startTime: new Date(),
          retryCount: 0,
        },
      });

      // Generate output file path
      const outputPath = this.generateBackupFilePath(backupJob, execution.id);

      // Execute backup strategy based on data source
      let executionResult: BackupExecutionData;

      if (backupJob.dataSource.startsWith('database:')) {
        executionResult = await this.databaseBackupStrategy.executeBackup(
          backupJob.dataSource,
          outputPath,
          backupJob.backupOptions as any,
        );
      } else {
        throw new BadRequestException(`Unsupported data source: ${backupJob.dataSource}`);
      }

      // Update execution record
      const updatedExecution = await this.prisma.backupExecution.update({
        where: { id: execution.id },
        data: {
          status: executionResult.status,
          endTime: executionResult.endTime,
          duration: executionResult.duration,
          fileSize: executionResult.fileSize || BigInt(0),
          compressedSize: executionResult.compressedSize || BigInt(0),
          filesCount: executionResult.filesCount || 0,
          filePath: executionResult.filePath,
          checksum: executionResult.checksum,
          verificationPassed: executionResult.verificationPassed || false,
          errorMessage: executionResult.errorMessage,
        },
      });

      // Update backup job statistics
      await this.updateBackupJobStats(backupJobId, executionResult);

      // Schedule cleanup of old backups
      this.scheduleCleanup(backupJob);

      this.logger.log(`Backup execution completed: ${execution.id}`);

      return updatedExecution;
    } catch (error) {
      this.logger.error(`Backup execution failed: ${backupJobId}`, error);
      throw error;
    }
  }

  async restoreFromBackup(
    executionId: string,
    options: RecoveryOptions,
  ): Promise<RecoveryResult> {
    try {
      const execution = await this.prisma.backupExecution.findUnique({
        where: { id: executionId },
        include: {
          backupJob: true,
        },
      });

      if (!execution) {
        throw new NotFoundException('Backup execution not found');
      }

      if (!execution.filePath) {
        throw new BadRequestException('No backup file available for restore');
      }

      if (!fs.existsSync(execution.filePath)) {
        throw new NotFoundException('Backup file not found on disk');
      }

      // Verify checksum if available
      if (execution.checksum && options.verifyIntegrity !== false) {
        const isValid = await this.verifyBackupIntegrity(execution.filePath, execution.checksum);
        if (!isValid) {
          throw new BadRequestException('Backup file integrity check failed');
        }
      }

      // Perform restore based on data source
      let restoreResult: RecoveryResult;

      if (execution.backupJob.dataSource.startsWith('database:')) {
        restoreResult = await this.databaseBackupStrategy.restoreFromBackup(
          execution.filePath,
          options.targetDatabase || execution.backupJob.dataSource,
          options,
        );
      } else {
        throw new BadRequestException(`Unsupported data source for restore: ${execution.backupJob.dataSource}`);
      }

      // Log restore operation
      await this.logRestoreOperation(executionId, options, restoreResult);

      this.logger.log(`Restore completed for backup execution: ${executionId}`);

      return restoreResult;
    } catch (error) {
      this.logger.error(`Restore failed: ${executionId}`, error);
      throw error;
    }
  }

  async getBackupJobs(filters?: {
    backupType?: string;
    dataSource?: string;
    isActive?: boolean;
    centerId?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.backupType) where.backupType = filters.backupType;
    if (filters?.dataSource) where.dataSource = filters.dataSource;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.centerId) where.centerId = filters.centerId;

    return this.prisma.backupJob.findMany({
      where,
      include: {
        _count: {
          select: {
            executions: true,
          },
        },
        executions: {
          where: {
            executionTime: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          orderBy: { executionTime: 'desc' },
          take: 5,
        },
        center: filters?.centerId ? true : false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBackupExecutions(filters?: {
    backupJobId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<any[]> {
    const where: any = {};

    if (filters?.backupJobId) where.backupJobId = filters.backupJobId;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.executionTime = {};
      if (filters?.startDate) where.executionTime.gte = filters.startDate;
      if (filters?.endDate) where.executionTime.lte = filters.endDate;
    }

    return this.prisma.backupExecution.findMany({
      where,
      include: {
        backupJob: true,
      },
      orderBy: { executionTime: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async getBackupStatistics(centerId?: string): Promise<BackupStatistics> {
    const jobWhere = centerId ? { centerId } : {};
    const executionWhere = centerId ? { backupJob: { centerId } } : {};

    const [
      totalJobs,
      activeJobs,
      completedBackups,
      failedBackups,
      storageUsed,
      typeDistribution,
    ] = await Promise.all([
      this.prisma.backupJob.count({ where: jobWhere }),
      this.prisma.backupJob.count({ where: { ...jobWhere, isActive: true } }),
      this.prisma.backupExecution.count({
        where: { ...executionWhere, status: 'COMPLETED' },
      }),
      this.prisma.backupExecution.count({
        where: { ...executionWhere, status: 'FAILED' },
      }),
      this.calculateStorageUsed(centerId),
      this.prisma.backupJob.groupBy({
        by: ['backupType'],
        where: jobWhere,
        _count: { id: true },
      }),
    ]);

    const [averageBackupTime, lastBackupTime, nextScheduledBackup] = await Promise.all([
      this.calculateAverageBackupTime(centerId),
      this.getLastBackupTime(centerId),
      this.getNextScheduledBackup(centerId),
    ]);

    const storageDistribution = await this.getStorageDistribution(centerId);

    return {
      totalJobs,
      activeJobs,
      completedBackups,
      failedBackups,
      totalStorageUsed: storageUsed,
      averageBackupTime,
      successRate: completedBackups + failedBackups > 0
        ? Math.round((completedBackups / (completedBackups + failedBackups)) * 100)
        : 100,
      lastBackupTime,
      nextScheduledBackup,
      storageDistribution,
      typeDistribution: typeDistribution.reduce((acc, item) => {
        acc[item.backupType] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async getBackupHealthStatus(centerId?: string): Promise<BackupHealthStatus> {
    const [lastSuccessfulBackup, failedCount, storageCapacity] = await Promise.all([
      this.getLastSuccessfulBackup(centerId),
      this.getFailedBackupCount(centerId),
      this.getStorageCapacity(),
    ]);

    const upcomingBackups = await this.getUpcomingBackups(centerId);
    const alerts = await this.generateBackupAlerts(lastSuccessfulBackup, failedCount, storageCapacity);

    // Determine overall health status
    let overall: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';

    if (!lastSuccessfulBackup || (new Date().getTime() - lastSuccessfulBackup.getTime() > 48 * 60 * 60 * 1000)) {
      overall = 'CRITICAL';
    } else if (failedCount > 3 || storageCapacity.percentage > 80) {
      overall = 'WARNING';
    }

    return {
      overall,
      lastSuccessfulBackup,
      failedBackupCount: failedCount,
      storageCapacity,
      upcomingBackups,
      alerts,
    };
  }

  async deleteBackupExecution(executionId: string): Promise<void> {
    const execution = await this.prisma.backupExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution) {
      throw new NotFoundException('Backup execution not found');
    }

    // Delete backup file if it exists
    if (execution.filePath && fs.existsSync(execution.filePath)) {
      try {
        fs.unlinkSync(execution.filePath);
        this.logger.log(`Deleted backup file: ${execution.filePath}`);
      } catch (error) {
        this.logger.warn(`Failed to delete backup file: ${error.message}`);
      }
    }

    // Delete execution record
    await this.prisma.backupExecution.delete({
      where: { id: executionId },
    });

    this.logger.log(`Backup execution deleted: ${executionId}`);
  }

  async deleteBackupJob(jobId: string): Promise<void> {
    const backupJob = await this.prisma.backupJob.findUnique({
      where: { id: jobId },
      include: {
        executions: true,
      },
    });

    if (!backupJob) {
      throw new NotFoundException('Backup job not found');
    }

    // Delete all execution files
    for (const execution of backupJob.executions) {
      if (execution.filePath && fs.existsSync(execution.filePath)) {
        try {
          fs.unlinkSync(execution.filePath);
        } catch (error) {
          this.logger.warn(`Failed to delete backup file: ${error.message}`);
        }
      }
    }

    // Unschedule job if it's scheduled
    if (this.scheduledJobs.has(jobId)) {
      this.scheduledJobs.get(jobId)?.stop();
      this.scheduledJobs.delete(jobId);
    }

    // Delete backup job (cascade deletes executions)
    await this.prisma.backupJob.delete({
      where: { id: jobId },
    });

    this.logger.log(`Backup job deleted: ${jobId}`);
  }

  private async initializeScheduledBackups(): Promise<void> {
    const scheduledBackupJobs = await this.prisma.backupJob.findMany({
      where: { isActive: true, schedule: { not: null } },
    });

    for (const backupJob of scheduledBackupJobs) {
      this.scheduleBackupJob(backupJob);
    }
  }

  private scheduleBackupJob(backupJob: any): void {
    if (!backupJob.schedule || this.scheduledJobs.has(backupJob.id)) {
      return;
    }

    try {
      const task = cron.schedule(backupJob.schedule, () => {
        this.executeBackup(backupJob.id).catch(error => {
          this.logger.error(`Scheduled backup failed: ${backupJob.name}`, error);
        });
      }, {
        scheduled: true,
        timezone: 'UTC',
      });

      this.scheduledJobs.set(backupJob.id, task);
      this.logger.log(`Backup job scheduled: ${backupJob.name} (${backupJob.schedule})`);
    } catch (error) {
      this.logger.error(`Failed to schedule backup job: ${backupJob.name}`, error);
    }
  }

  private generateBackupFilePath(backupJob: any, executionId: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${backupJob.name}_${timestamp}_${executionId}`;

    const baseDir = process.env.BACKUP_STORAGE_PATH || './backups';
    const subDir = backupJob.centerId ? `${backupJob.centerId}/${backupJob.backupType}` : backupJob.backupType;
    const outputDir = path.join(baseDir, subDir);

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Determine file extension based on backup type and options
    let extension = '.backup';
    if (backupJob.backupType.includes('DATABASE')) {
      extension = backupJob.compression ? '.sql.gz' : '.sql';
    }

    return path.join(outputDir, `${filename}${extension}`);
  }

  private async validateStorageLocation(storageLocation: string): Promise<void> {
    // Basic validation - in production, this would be more comprehensive
    if (!storageLocation) {
      throw new BadRequestException('Storage location is required');
    }

    // Test if storage location is accessible
    if (storageLocation.startsWith('local:') || storageLocation.startsWith('/')) {
      const path = storageLocation.replace('local:', '');
      try {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        // Test write permissions
        const testFile = path.join(path, '.backup_test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
      } catch (error) {
        throw new BadRequestException(`Storage location is not accessible: ${error.message}`);
      }
    }
  }

  private async verifyBackupIntegrity(filePath: string, expectedChecksum: string): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      return new Promise((resolve, reject) => {
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => {
          const actualChecksum = hash.digest('hex');
          resolve(actualChecksum === expectedChecksum);
        });
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error('Error verifying backup integrity', error);
      return false;
    }
  }

  private async updateBackupJobStats(backupJobId: string, execution: BackupExecutionData): Promise<void> {
    const stats = execution.status === 'COMPLETED'
      ? { successCount: { increment: 1 }, totalSize: { increment: execution.fileSize || BigInt(0) } }
      : { failureCount: { increment: 1 } };

    await this.prisma.backupJob.update({
      where: { id: backupJobId },
      data: {
        ...stats,
        lastBackup: execution.endTime,
      },
    });
  }

  private async logRestoreOperation(
    executionId: string,
    options: RecoveryOptions,
    result: RecoveryResult,
  ): Promise<void> {
    // This would log to audit trail or restore history table
    this.logger.log(`Restore operation logged for execution: ${executionId}, success: ${result.success}`);
  }

  private async scheduleCleanup(backupJob: any): Promise<void> {
    // Schedule cleanup of old backups based on retention policy
    // This would typically run as a separate cleanup job
  }

  private async calculateStorageUsed(centerId?: string): Promise<bigint> {
    const executions = await this.prisma.backupExecution.findMany({
      where: {
        status: 'COMPLETED',
        fileSize: { not: null },
        backupJob: centerId ? { centerId } : undefined,
      },
      select: { fileSize: true },
    });

    return executions.reduce((total, exec) => total + (exec.fileSize || BigInt(0)), BigInt(0));
  }

  private async calculateAverageBackupTime(centerId?: string): Promise<number> {
    const executions = await this.prisma.backupExecution.findMany({
      where: {
        status: 'COMPLETED',
        duration: { not: null },
        backupJob: centerId ? { centerId } : undefined,
        executionTime: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: { duration: true },
    });

    if (executions.length === 0) return 0;

    const totalDuration = executions.reduce((sum, exec) => sum + (exec.duration || 0), 0);
    return Math.round(totalDuration / executions.length / 1000); // Return in seconds
  }

  private async getLastBackupTime(centerId?: string): Promise<Date | null> {
    const lastBackup = await this.prisma.backupExecution.findFirst({
      where: {
        status: 'COMPLETED',
        backupJob: centerId ? { centerId } : undefined,
      },
      orderBy: { executionTime: 'desc' },
      select: { executionTime: true },
    });

    return lastBackup?.executionTime || null;
  }

  private async getNextScheduledBackup(centerId?: string): Promise<Date | null> {
    const nextBackup = await this.prisma.backupJob.findFirst({
      where: {
        isActive: true,
        nextBackup: { not: null },
        centerId: centerId || null,
      },
      orderBy: { nextBackup: 'asc' },
      select: { nextBackup: true },
    });

    return nextBackup?.nextBackup || null;
  }

  private async getStorageDistribution(centerId?: string): Promise<Record<string, bigint>> {
    const jobs = await this.prisma.backupJob.groupBy({
      by: ['storageLocation'],
      where: centerId ? { centerId } : {},
      _sum: { totalSize: true },
    });

    return jobs.reduce((acc, job) => {
      acc[job.storageLocation] = job._sum.totalSize || BigInt(0);
      return acc;
    }, {} as Record<string, bigint>);
  }

  private async getFailedBackupCount(centerId?: string): Promise<number> {
    return this.prisma.backupExecution.count({
      where: {
        status: 'FAILED',
        executionTime: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
        backupJob: centerId ? { centerId } : undefined,
      },
    });
  }

  private async getLastSuccessfulBackup(centerId?: string): Promise<Date | null> {
    const lastSuccess = await this.prisma.backupExecution.findFirst({
      where: {
        status: 'COMPLETED',
        backupJob: centerId ? { centerId } : undefined,
      },
      orderBy: { executionTime: 'desc' },
      select: { executionTime: true },
    });

    return lastSuccess?.executionTime || null;
  }

  private async getStorageCapacity(): Promise<any> {
    // This would typically check actual storage capacity
    // For now, return mock data
    return {
      used: BigInt(1024 * 1024 * 1024 * 100), // 100GB
      total: BigInt(1024 * 1024 * 1024 * 500), // 500GB
      percentage: 20,
    };
  }

  private async getUpcomingBackups(centerId?: string): Promise<any[]> {
    const upcoming = await this.prisma.backupJob.findMany({
      where: {
        isActive: true,
        nextBackup: {
          gte: new Date(),
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
        },
        centerId: centerId || null,
      },
      select: {
        id: true,
        name: true,
        nextBackup: true,
        backupType: true,
        estimatedSize: true,
      },
      orderBy: { nextBackup: 'asc' },
      take: 10,
    });

    return upcoming.map(job => ({
      jobId: job.id,
      jobName: job.name,
      scheduledTime: job.nextBackup,
      estimatedDuration: this.estimateBackupDuration(job.backupType, job.estimatedSize),
    }));
  }

  private async generateBackupAlerts(
    lastSuccessfulBackup: Date | null,
    failedCount: number,
    storageCapacity: any,
  ): Promise<any[]> {
    const alerts = [];

    if (!lastSuccessfulBackup || (new Date().getTime() - lastSuccessfulBackup.getTime() > 48 * 60 * 60 * 1000)) {
      alerts.push({
        type: 'BACKUP_FAILURE',
        message: 'No successful backup in the last 48 hours',
        severity: 'CRITICAL',
      });
    }

    if (failedCount > 5) {
      alerts.push({
        type: 'BACKUP_FAILURE',
        message: `High number of failed backups: ${failedCount} in the last 7 days`,
        severity: 'HIGH',
      });
    }

    if (storageCapacity.percentage > 90) {
      alerts.push({
        type: 'STORAGE_FULL',
        message: `Storage capacity critically low: ${storageCapacity.percentage}% used`,
        severity: 'CRITICAL',
      });
    } else if (storageCapacity.percentage > 75) {
      alerts.push({
        type: 'STORAGE_FULL',
        message: `Storage capacity running low: ${storageCapacity.percentage}% used`,
        severity: 'MEDIUM',
      });
    }

    return alerts;
  }

  private estimateBackupDuration(backupType: string, estimatedSize: bigint): number {
    // Simple estimation based on backup type and size
    const sizeInGB = Number(estimatedSize) / (1024 * 1024 * 1024);

    switch (backupType) {
      case 'FULL':
        return Math.max(300, sizeInGB * 60); // Minimum 5 minutes
      case 'INCREMENTAL':
        return Math.max(60, sizeInGB * 10); // Minimum 1 minute
      case 'DIFFERENTIAL':
        return Math.max(120, sizeInGB * 30); // Minimum 2 minutes
      default:
        return 300; // 5 minutes default
    }
  }
}