import { Module } from '@nestjs/common';
import { ClinicalPhotosController } from './clinical-photos.controller';
import { ClinicalPhotosService } from './clinical-photos.service';
import { PrismaService } from '@/common/database/prisma.service';

@Module({
  controllers: [ClinicalPhotosController],
  providers: [ClinicalPhotosService, PrismaService],
  exports: [ClinicalPhotosService],
})
export class ClinicalPhotosModule {}
