import { Module } from '@nestjs/common';
import { CpcController } from './cpc.controller';
import { CpcService } from './cpc.service';

@Module({
  controllers: [CpcController],
  providers: [CpcService],
  exports: [CpcService],
})
export class CpcModule {}
