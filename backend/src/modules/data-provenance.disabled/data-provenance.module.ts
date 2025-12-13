import { Module } from '@nestjs/common';
import { DataProvenanceController } from './data-provenance.controller';
import { DataProvenanceService } from './data-provenance.service';

@Module({
  controllers: [DataProvenanceController],
  providers: [DataProvenanceService],
  exports: [DataProvenanceService],
})
export class DataProvenanceModule {}
