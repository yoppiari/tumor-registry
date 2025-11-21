import { Module } from '@nestjs/common';
import { OfflineQueueController } from './offline-queue.controller';
import { OfflineQueueService } from './offline-queue.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [OfflineQueueController],
  providers: [OfflineQueueService, PrismaService],
  exports: [OfflineQueueService],
})
export class OfflineQueueModule {}
