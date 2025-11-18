import { Module } from '@nestjs/common';
import { PopulationHealthController } from './population-health.controller';
import { PopulationHealthService } from './population-health.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PopulationHealthController],
  providers: [PopulationHealthService],
  exports: [PopulationHealthService],
})
export class PopulationHealthModule {}