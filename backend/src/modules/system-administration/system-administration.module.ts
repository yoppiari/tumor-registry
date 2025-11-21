import { Module } from '@nestjs/common';
import { SystemAdministrationController } from './controllers/system-administration.controller';
import { SystemAdministrationService } from './services/system-administration.service';
import { ConfigurationService } from './services/configuration.service';
import { DashboardService } from './services/dashboard.service';
import { PrismaService } from '@/common/database/prisma.service';

@Module({
  controllers: [SystemAdministrationController],
  providers: [
    SystemAdministrationService,
    ConfigurationService,
    DashboardService,
    PrismaService,
  ],
  exports: [
    SystemAdministrationService,
    ConfigurationService,
    DashboardService,
  ],
})
export class SystemAdministrationModule {}