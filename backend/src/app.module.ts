import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
// import { ScheduleModule } from '@nestjs/schedule'; // Temporarily disabled - crypto issue
import { BullModule } from '@nestjs/bull';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './common/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CentersModule } from './modules/centers/centers.module';
import { PatientsModule } from './modules/patients/patients.module';
// import { AnalyticsModule } from './modules/analytics/analytics.module'; // Temporarily disabled - uses ScheduleModule
// import { ResearchModule } from './modules/research/research.module'; // Temporarily disabled - has Prisma field mismatches
// import { ResearchImpactModule } from './modules/research-impact/research-impact.module'; // Temporarily disabled - depends on ResearchModule
// import { ReportsModule } from './modules/reports/reports.module'; // Temporarily disabled - has TypeScript errors
// import { ScheduledReportsModule } from './modules/scheduled-reports/scheduled-reports.module'; // Temporarily disabled - uses ScheduleModule
// import { NotificationsModule } from './modules/notifications/notifications.module'; // Temporarily disabled - uses ScheduleModule
// Sprint 2: Data Entry & Quality Assurance Modules
import { MedicalImagingModule } from './modules/medical-imaging/medical-imaging.module';
// import { CaseReviewModule } from './modules/case-review/case-review.module'; // Temporarily disabled - has TypeScript errors
import { PeerReviewModule } from './modules/peer-review/peer-review.module';
import { OfflineQueueModule } from './modules/offline-queue/offline-queue.module';
// Batch Implementation: All Missing Stories
// import { SsoModule } from './modules/sso/sso.module'; // Temporarily disabled - ES Module issue
// import { PasswordPolicyModule } from './modules/password-policy/password-policy.module'; // Temporarily disabled - has TypeScript errors
// import { SessionManagementModule } from './modules/session-management/session-management.module'; // Temporarily disabled - has TypeScript errors
// import { SecurityMonitoringModule } from './modules/security-monitoring/security-monitoring.module'; // Temporarily disabled - uses ScheduleModule
// import { DataProvenanceModule } from './modules/data-provenance/data-provenance.module'; // Temporarily disabled - has TypeScript errors
// Musculoskeletal Tumor Registry Module (Dec 11, 2025)
import { MusculoskeletalModule } from './modules/musculoskeletal/musculoskeletal.module';
// Temporarily commented out problematic modules
// import { SystemAdministrationModule } from './modules/system-administration/system-administration.module';
// import { BackupModule } from './modules/backup/backup.module';
// import { SecurityMonitoringModule } from './modules/security-monitoring/security-monitoring.module'; // Temporarily disabled - uses ScheduleModule
import { HttpExceptionFilter, ValidationExceptionFilter } from './common/filters/http-exception.filter';
import { SecurityMiddleware } from './modules/auth/middleware/security.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    // ScheduleModule.forRoot(), // Temporarily disabled - crypto issue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    DatabaseModule,
    CommonModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CentersModule,
    PatientsModule,
    // AnalyticsModule, // Temporarily disabled - uses ScheduleModule
    // ResearchModule, // Temporarily disabled - has Prisma field mismatches
    // ResearchImpactModule, // Temporarily disabled - depends on ResearchModule
    // ReportsModule, // Temporarily disabled - has TypeScript errors
    // ScheduledReportsModule, // Temporarily disabled - uses ScheduleModule
    // NotificationsModule, // Temporarily disabled - uses ScheduleModule
    // Sprint 2 Modules
    MedicalImagingModule,
    // CaseReviewModule, // Temporarily disabled - has TypeScript errors
    PeerReviewModule,
    OfflineQueueModule,
    // Batch Implementation Modules (Nov 22, 2025)
    // SsoModule, // Temporarily disabled - ES Module issue
    // PasswordPolicyModule, // Temporarily disabled - has TypeScript errors
    // SessionManagementModule, // Temporarily disabled - has TypeScript errors
    // SecurityMonitoringModule, // Temporarily disabled - uses ScheduleModule
    // DataProvenanceModule, // Temporarily disabled - has TypeScript errors
    // Musculoskeletal Tumor Registry Module
    MusculoskeletalModule,
    // SystemAdministrationModule,
    // BackupModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Temporarily disabled - middleware needs to be updated for Fastify
    // consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}