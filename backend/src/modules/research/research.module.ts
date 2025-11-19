import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchSprint3Controller } from './research.controller.sprint3';
import { ResearchSprint3Service } from './research.service.sprint3';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ResearchController, ResearchSprint3Controller],
  providers: [ResearchService, ResearchSprint3Service],
  exports: [ResearchService, ResearchSprint3Service],
})
export class ResearchModule {}