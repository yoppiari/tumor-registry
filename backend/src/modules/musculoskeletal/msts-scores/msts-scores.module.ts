import { Module } from '@nestjs/common';
import { MstsScoresController } from './msts-scores.controller';
import { MstsScoresService } from './msts-scores.service';

@Module({
  controllers: [MstsScoresController],
  providers: [MstsScoresService],
  exports: [MstsScoresService],
})
export class MstsScoresModule {}
