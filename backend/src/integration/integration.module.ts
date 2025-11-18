import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PatientsModule } from '../patients/patients.module';
import { TreatmentsModule } from '../treatments/treatments.module';

@Module({
  imports: [
    ConfigModule,
    AnalyticsModule,
    PatientsModule,
    TreatmentsModule
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}