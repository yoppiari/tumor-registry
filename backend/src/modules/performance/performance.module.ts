import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { RedisService } from './redis.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { StreamingService } from './streaming.service';
import { DatabasePerformanceService } from './database-performance.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [PerformanceController],
  providers: [
    PerformanceService,
    RedisService,
    PerformanceMonitorService,
    StreamingService,
    DatabasePerformanceService,
  ],
  exports: [
    PerformanceService,
    RedisService,
    PerformanceMonitorService,
    StreamingService,
    DatabasePerformanceService,
  ],
})
export class PerformanceModule {}