import { Module } from '@nestjs/common';
import { PathologyTypesController } from './pathology-types.controller';
import { PathologyTypesService } from './pathology-types.service';

@Module({
  controllers: [PathologyTypesController],
  providers: [PathologyTypesService],
  exports: [PathologyTypesService],
})
export class PathologyTypesModule {}
