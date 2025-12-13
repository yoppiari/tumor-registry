import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { AnalyticsModule } from '../modules/analytics/analytics.module';
import { PatientsModule } from '../modules/patients/patients.module';
// import { TreatmentsModule } from '../treatments/treatments.module'; // Module not found - commented out

@Module({
  imports: [
    ConfigModule,
    AnalyticsModule,
    PatientsModule,
    // TreatmentsModule // Module not found - commented out
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}