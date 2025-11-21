import { Module } from '@nestjs/common';
import { PeerReviewController } from './peer-review.controller';
import { PeerReviewService } from './peer-review.service';
import { PrismaService } from '@/common/database/prisma.service';

@Module({
  controllers: [PeerReviewController],
  providers: [PeerReviewService, PrismaService],
  exports: [PeerReviewService],
})
export class PeerReviewModule {}
