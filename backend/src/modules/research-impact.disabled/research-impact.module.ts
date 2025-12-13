import { Module } from '@nestjs/common';
import { ResearchImpactController } from './research-impact.controller';
import { ResearchImpactService } from './research-impact.service';
import { DatabaseModule } from '../../database/database.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [DatabaseModule, AnalyticsModule],
  controllers: [ResearchImpactController],
  providers: [ResearchImpactService],
  exports: [ResearchImpactService],
})
export class ResearchImpactModule {}
