import { Module, Global } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuditLogService } from '../modules/audit/audit.service';

@Global()
@Module({
  providers: [PrismaService, AuditLogService],
  exports: [PrismaService, AuditLogService],
})
export class CommonModule {}
