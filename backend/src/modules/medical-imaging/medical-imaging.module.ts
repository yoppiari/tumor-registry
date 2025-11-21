import { Module } from '@nestjs/common';
import { MedicalImagingController } from './medical-imaging.controller';
import { MedicalImagingService } from './medical-imaging.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [MedicalImagingController],
  providers: [MedicalImagingService, PrismaService],
  exports: [MedicalImagingService],
})
export class MedicalImagingModule {}
