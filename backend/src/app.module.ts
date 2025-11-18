import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './common/health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CentersModule } from './centers/centers.module';
import { PatientsModule } from './patients/patients.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { ConsentModule } from './consent/consent.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { VitalSignsModule } from './vital-signs/vital-signs.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { RadiologyModule } from './radiology/radiology.module';
import { CancerRegistryModule } from './cancer-registry/cancer-registry.module';
import { ResearchModule } from './research/research.module';
import { PopulationHealthModule } from './population-health/population-health.module';
import { PredictiveAnalyticsModule } from './predictive-analytics/predictive-analytics.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IntegrationModule } from './integration/integration.module';
import { DataMigrationModule } from './data-migration/data-migration.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { PerformanceModule } from './performance/performance.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Core modules
    DatabaseModule,
    HealthModule,

    // Business modules
    AuthModule,
    UsersModule,
    RolesModule,
    CentersModule,
    PatientsModule,
    MedicalRecordsModule,
    ConsentModule,
    DiagnosisModule,
    TreatmentsModule,
    VitalSignsModule,
    LaboratoryModule,
    RadiologyModule,
    CancerRegistryModule,
    ResearchModule,
    PopulationHealthModule,
    PredictiveAnalyticsModule,
    AnalyticsModule,
    IntegrationModule,
    DataMigrationModule,
    MonitoringModule,
    PerformanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}