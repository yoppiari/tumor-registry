import { Module } from '@nestjs/common';
import { CaseReviewController } from './case-review.controller';
import { CaseReviewService } from './case-review.service';
import { PrismaService } from '@/common/database/prisma.service';

@Module({
  controllers: [CaseReviewController],
  providers: [CaseReviewService, PrismaService],
  exports: [CaseReviewService],
})
export class CaseReviewModule {}
