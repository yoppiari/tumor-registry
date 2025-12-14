import { Module } from '@nestjs/common';
import { ResearchRequestsService } from './research-requests.service';
import { ResearchRequestsController } from './research-requests.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResearchRequestsController],
  providers: [ResearchRequestsService],
  exports: [ResearchRequestsService],
})
export class ResearchRequestsModule {}
