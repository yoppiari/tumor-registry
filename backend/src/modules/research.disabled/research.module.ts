import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchSprint3Controller } from './research.controller.sprint3';
import { ResearchSprint3Service } from './research.service.sprint3';
import { ResearchDiscoveryController } from './controllers/research-discovery.controller';
import { AdvancedSearchService } from './services/advanced-search.service';
import { CollaborationService } from './services/collaboration.service';
import { ResearchPlanningService } from './services/research-planning.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    ResearchController,
    ResearchSprint3Controller,
    ResearchDiscoveryController,
  ],
  providers: [
    ResearchService,
    ResearchSprint3Service,
    AdvancedSearchService,
    CollaborationService,
    ResearchPlanningService,
  ],
  exports: [
    ResearchService,
    ResearchSprint3Service,
    AdvancedSearchService,
    CollaborationService,
    ResearchPlanningService,
  ],
})
export class ResearchModule {}