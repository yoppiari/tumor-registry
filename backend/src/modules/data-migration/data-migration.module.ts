import { Module } from '@nestjs/common';
import { DataMigrationController } from './data-migration.controller';
import { DataMigrationService } from './data-migration.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [DataMigrationController],
  providers: [DataMigrationService],
  exports: [DataMigrationService],
})
export class DataMigrationModule {}