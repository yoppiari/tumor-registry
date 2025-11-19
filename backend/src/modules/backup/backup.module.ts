import { Module } from '@nestjs/common';
import { BackupController } from './controllers/backup.controller';
import { BackupService } from './services/backup.service';
import { DatabaseBackupStrategy } from './strategies/database-backup.strategy';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [BackupController],
  providers: [
    BackupService,
    DatabaseBackupStrategy,
    PrismaService,
  ],
  exports: [
    BackupService,
    DatabaseBackupStrategy,
  ],
})
export class BackupModule {}