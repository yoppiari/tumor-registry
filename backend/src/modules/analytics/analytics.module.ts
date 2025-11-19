import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { EnhancedAnalyticsController } from './enhanced-analytics.controller';
import { EnhancedAnalyticsService } from './enhanced-analytics.service';
import { RedisService } from './redis.service';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AnalyticsController,
    EnhancedAnalyticsController,
  ],
  providers: [
    AnalyticsService,
    EnhancedAnalyticsService,
    RedisService,
    ScheduledTasksService,
  ],
  exports: [
    AnalyticsService,
    EnhancedAnalyticsService,
    RedisService,
    ScheduledTasksService,
  ],
})
export class AnalyticsModule {}