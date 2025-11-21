import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledReportsController } from './controllers/scheduled-reports.controller';
import { ScheduledReportsService } from './services/scheduled-reports.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ScheduledReportsController],
  providers: [ScheduledReportsService, PrismaService],
  exports: [ScheduledReportsService],
})
export class ScheduledReportsModule {}
