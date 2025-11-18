import { Module } from '@nestjs/common';
import { PredictiveAnalyticsController } from './predictive-analytics.controller';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PredictiveAnalyticsController],
  providers: [PredictiveAnalyticsService],
  exports: [PredictiveAnalyticsService],
})
export class PredictiveAnalyticsModule {}