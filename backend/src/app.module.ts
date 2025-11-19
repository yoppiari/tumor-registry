import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './common/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CentersModule } from './modules/centers/centers.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SystemAdministrationModule } from './modules/system-administration/system-administration.module';
import { ReportsModule } from './modules/reports/reports.module';
import { BackupModule } from './modules/backup/backup.module';
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
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CentersModule,
    PatientsModule,
    AnalyticsModule,
    SystemAdministrationModule,
    ReportsModule,
    BackupModule,
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
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}