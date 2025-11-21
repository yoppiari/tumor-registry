import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SyncOfflineDataDto } from './dto/sync-offline-data.dto';
import { ResolveConflictDto } from './dto/resolve-conflict.dto';

@Injectable()
export class OfflineQueueService {
  private readonly logger = new Logger(OfflineQueueService.name);

  constructor(private prisma: PrismaService) {}

  async queueOfflineData(syncDto: SyncOfflineDataDto, userId: string): Promise<any> {
    try {
      const queueItem = await this.prisma.offlineDataQueue.create({
        data: {
          userId,
          entityType: syncDto.entityType,
          entityId: syncDto.entityId,
          operation: syncDto.operation,
          data: syncDto.data,
          priority: syncDto.priority || 0,
          localTimestamp: new Date(syncDto.localTimestamp),
          deviceId: syncDto.deviceId,
          sessionId: syncDto.sessionId,
          metadata: syncDto.metadata,
        },
      });

      this.logger.log(`Offline data queued: ${queueItem.id} for ${syncDto.entityType} ${syncDto.operation}`);

      // Try to sync immediately
      const syncResult = await this.processQueueItem(queueItem.id, userId);

      return syncResult;
    } catch (error) {
      this.logger.error('Error queuing offline data', error);
      throw error;
    }
  }

  async processQueueItem(queueId: string, userId: string): Promise<any> {
    try {
      const queueItem = await this.prisma.offlineDataQueue.findUnique({
        where: { id: queueId },
      });

      if (!queueItem) {
        throw new NotFoundException(`Queue item with ID ${queueId} not found`);
      }

      if (queueItem.status === 'SYNCED') {
        return { status: 'ALREADY_SYNCED', queueItem };
      }

      // Update status to processing
      await this.prisma.offlineDataQueue.update({
        where: { id: queueId },
        data: {
          status: 'PROCESSING',
          attemptCount: { increment: 1 },
        },
      });

      let result: any;
      let hasConflict = false;
      let conflictData: any = null;

      try {
        // Process based on entity type and operation
        result = await this.executeOperation(
          queueItem.entityType,
          queueItem.operation,
          queueItem.entityId,
          queueItem.data as any,
          userId,
        );

        // Mark as synced
        await this.prisma.offlineDataQueue.update({
          where: { id: queueId },
          data: {
            status: 'SYNCED',
            syncedAt: new Date(),
            errorMessage: null,
            errorDetails: null,
          },
        });

        this.logger.log(`Queue item ${queueId} synced successfully`);

        return { status: 'SYNCED', result, queueItem };
      } catch (error: any) {
        // Check if it's a conflict error
        if (error instanceof ConflictException || error.message?.includes('conflict')) {
          hasConflict = true;
          conflictData = {
            errorMessage: error.message,
            localData: queueItem.data,
            remoteData: await this.fetchRemoteData(queueItem.entityType, queueItem.entityId),
          };

          await this.prisma.offlineDataQueue.update({
            where: { id: queueId },
            data: {
              status: 'CONFLICT',
              conflictData,
              errorMessage: error.message,
            },
          });

          return { status: 'CONFLICT', conflictData, queueItem };
        }

        // Other errors - mark as failed
        const shouldRetry = queueItem.attemptCount < queueItem.maxAttempts;

        await this.prisma.offlineDataQueue.update({
          where: { id: queueId },
          data: {
            status: shouldRetry ? 'PENDING' : 'FAILED',
            errorMessage: error.message,
            errorDetails: {
              stack: error.stack,
              timestamp: new Date().toISOString(),
            },
          },
        });

        if (!shouldRetry) {
          this.logger.error(`Queue item ${queueId} failed after ${queueItem.attemptCount} attempts`, error);
        }

        return { status: shouldRetry ? 'RETRY' : 'FAILED', error: error.message, queueItem };
      }
    } catch (error) {
      this.logger.error(`Error processing queue item ${queueId}`, error);
      throw error;
    }
  }

  async resolveConflict(queueId: string, resolveDto: ResolveConflictDto, userId: string): Promise<any> {
    try {
      const queueItem = await this.prisma.offlineDataQueue.findUnique({
        where: { id: queueId },
      });

      if (!queueItem) {
        throw new NotFoundException(`Queue item with ID ${queueId} not found`);
      }

      if (queueItem.status !== 'CONFLICT') {
        throw new BadRequestException('Queue item is not in conflict state');
      }

      let dataToUse: any;

      switch (resolveDto.resolution) {
        case 'USE_LOCAL':
          dataToUse = queueItem.data;
          break;
        case 'USE_REMOTE':
          dataToUse = (queueItem.conflictData as any)?.remoteData;
          break;
        case 'MERGE':
          if (!resolveDto.mergedData) {
            throw new BadRequestException('Merged data is required for MERGE resolution');
          }
          dataToUse = resolveDto.mergedData;
          break;
        case 'MANUAL':
          if (!resolveDto.mergedData) {
            throw new BadRequestException('Manual resolution data is required');
          }
          dataToUse = resolveDto.mergedData;
          break;
      }

      // Execute the operation with resolved data
      const result = await this.executeOperation(
        queueItem.entityType,
        queueItem.operation,
        queueItem.entityId,
        dataToUse,
        userId,
      );

      // Mark as resolved and synced
      await this.prisma.offlineDataQueue.update({
        where: { id: queueId },
        data: {
          status: 'RESOLVED',
          resolution: resolveDto.resolution,
          resolvedBy: userId,
          resolvedAt: new Date(),
          syncedAt: new Date(),
        },
      });

      this.logger.log(`Conflict resolved for queue item ${queueId} using ${resolveDto.resolution}`);

      return { status: 'RESOLVED', result };
    } catch (error) {
      this.logger.error(`Error resolving conflict for queue item ${queueId}`, error);
      throw error;
    }
  }

  async getPendingQueue(userId: string, limit = 100): Promise<any> {
    try {
      const queueItems = await this.prisma.offlineDataQueue.findMany({
        where: {
          userId,
          status: { in: ['PENDING', 'FAILED', 'CONFLICT'] },
        },
        orderBy: [
          { priority: 'desc' },
          { localTimestamp: 'asc' },
        ],
        take: limit,
      });

      return {
        total: queueItems.length,
        items: queueItems,
      };
    } catch (error) {
      this.logger.error(`Error getting pending queue for user ${userId}`, error);
      throw error;
    }
  }

  async getQueueStatistics(userId: string): Promise<any> {
    try {
      const [pending, processing, synced, failed, conflict] = await Promise.all([
        this.prisma.offlineDataQueue.count({ where: { userId, status: 'PENDING' } }),
        this.prisma.offlineDataQueue.count({ where: { userId, status: 'PROCESSING' } }),
        this.prisma.offlineDataQueue.count({ where: { userId, status: 'SYNCED' } }),
        this.prisma.offlineDataQueue.count({ where: { userId, status: 'FAILED' } }),
        this.prisma.offlineDataQueue.count({ where: { userId, status: 'CONFLICT' } }),
      ]);

      return {
        pending,
        processing,
        synced,
        failed,
        conflict,
        needsAttention: failed + conflict,
      };
    } catch (error) {
      this.logger.error(`Error getting queue statistics for user ${userId}`, error);
      throw error;
    }
  }

  async syncAllPending(userId: string): Promise<any> {
    try {
      const pendingItems = await this.prisma.offlineDataQueue.findMany({
        where: {
          userId,
          status: 'PENDING',
        },
        orderBy: [
          { priority: 'desc' },
          { localTimestamp: 'asc' },
        ],
      });

      const results = {
        total: pendingItems.length,
        synced: 0,
        failed: 0,
        conflicts: 0,
        details: [] as any[],
      };

      for (const item of pendingItems) {
        const result = await this.processQueueItem(item.id, userId);

        if (result.status === 'SYNCED') {
          results.synced++;
        } else if (result.status === 'CONFLICT') {
          results.conflicts++;
        } else if (result.status === 'FAILED') {
          results.failed++;
        }

        results.details.push({
          queueId: item.id,
          entityType: item.entityType,
          operation: item.operation,
          status: result.status,
        });
      }

      this.logger.log(`Bulk sync completed for user ${userId}: ${results.synced} synced, ${results.failed} failed, ${results.conflicts} conflicts`);

      return results;
    } catch (error) {
      this.logger.error(`Error syncing all pending for user ${userId}`, error);
      throw error;
    }
  }

  private async executeOperation(
    entityType: string,
    operation: string,
    entityId: string | null,
    data: any,
    userId: string,
  ): Promise<any> {
    // This is a simplified implementation - in production, you'd have specific handlers for each entity type
    switch (entityType.toLowerCase()) {
      case 'patient':
        return this.handlePatientOperation(operation, entityId, data, userId);
      case 'diagnosis':
        return this.handleDiagnosisOperation(operation, entityId, data, userId);
      case 'medication':
        return this.handleMedicationOperation(operation, entityId, data, userId);
      default:
        throw new BadRequestException(`Unsupported entity type: ${entityType}`);
    }
  }

  private async handlePatientOperation(operation: string, entityId: string | null, data: any, userId: string): Promise<any> {
    switch (operation) {
      case 'CREATE':
        return await this.prisma.patient.create({ data });
      case 'UPDATE':
        if (!entityId) throw new BadRequestException('Entity ID required for UPDATE');
        return await this.prisma.patient.update({ where: { id: entityId }, data });
      case 'DELETE':
        if (!entityId) throw new BadRequestException('Entity ID required for DELETE');
        return await this.prisma.patient.update({ where: { id: entityId }, data: { isActive: false } });
      default:
        throw new BadRequestException(`Unsupported operation: ${operation}`);
    }
  }

  private async handleDiagnosisOperation(operation: string, entityId: string | null, data: any, userId: string): Promise<any> {
    switch (operation) {
      case 'CREATE':
        return await this.prisma.patientDiagnosis.create({ data });
      case 'UPDATE':
        if (!entityId) throw new BadRequestException('Entity ID required for UPDATE');
        return await this.prisma.patientDiagnosis.update({ where: { id: entityId }, data });
      case 'DELETE':
        if (!entityId) throw new BadRequestException('Entity ID required for DELETE');
        return await this.prisma.patientDiagnosis.delete({ where: { id: entityId } });
      default:
        throw new BadRequestException(`Unsupported operation: ${operation}`);
    }
  }

  private async handleMedicationOperation(operation: string, entityId: string | null, data: any, userId: string): Promise<any> {
    switch (operation) {
      case 'CREATE':
        return await this.prisma.patientMedication.create({ data });
      case 'UPDATE':
        if (!entityId) throw new BadRequestException('Entity ID required for UPDATE');
        return await this.prisma.patientMedication.update({ where: { id: entityId }, data });
      case 'DELETE':
        if (!entityId) throw new BadRequestException('Entity ID required for DELETE');
        return await this.prisma.patientMedication.update({ where: { id: entityId }, data: { isActive: false } });
      default:
        throw new BadRequestException(`Unsupported operation: ${operation}`);
    }
  }

  private async fetchRemoteData(entityType: string, entityId: string | null): Promise<any> {
    if (!entityId) return null;

    try {
      switch (entityType.toLowerCase()) {
        case 'patient':
          return await this.prisma.patient.findUnique({ where: { id: entityId } });
        case 'diagnosis':
          return await this.prisma.patientDiagnosis.findUnique({ where: { id: entityId } });
        case 'medication':
          return await this.prisma.patientMedication.findUnique({ where: { id: entityId } });
        default:
          return null;
      }
    } catch (error) {
      this.logger.warn(`Could not fetch remote data for ${entityType} ${entityId}`, error);
      return null;
    }
  }
}
