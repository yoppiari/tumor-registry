import { Module } from '@nestjs/common';
import { WhoClassificationsController } from './who-classifications.controller';
import { WhoClassificationsService } from './who-classifications.service';

@Module({
  controllers: [WhoClassificationsController],
  providers: [WhoClassificationsService],
  exports: [WhoClassificationsService],
})
export class WhoClassificationsModule {}
