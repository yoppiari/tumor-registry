import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PatientsModule } from '../patients/patients.module';
import { TreatmentsModule } from '../treatments/treatments.module';

@Module({
  imports: [PatientsModule, TreatmentsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}