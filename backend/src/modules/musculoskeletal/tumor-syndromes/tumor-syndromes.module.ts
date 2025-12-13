import { Module } from '@nestjs/common';
import { TumorSyndromesController } from './tumor-syndromes.controller';
import { TumorSyndromesService } from './tumor-syndromes.service';

@Module({
  controllers: [TumorSyndromesController],
  providers: [TumorSyndromesService],
  exports: [TumorSyndromesService],
})
export class TumorSyndromesModule {}
