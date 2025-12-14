import { Module } from '@nestjs/common';
import { ResearchRequestsService } from './research-requests.service';
import { ResearchRequestsController } from './research-requests.controller';

@Module({
  controllers: [ResearchRequestsController],
  providers: [ResearchRequestsService],
  exports: [ResearchRequestsService],
})
export class ResearchRequestsModule {}
