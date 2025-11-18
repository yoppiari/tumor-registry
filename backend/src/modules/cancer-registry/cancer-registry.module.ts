import { Module } from '@nestjs/common';
import { CancerRegistryController } from './cancer-registry.controller';
import { CancerRegistryService } from './cancer-registry.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CancerRegistryController],
  providers: [CancerRegistryService],
  exports: [CancerRegistryService],
})
export class CancerRegistryModule {}