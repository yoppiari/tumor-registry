import { Module } from '@nestjs/common';
import { PatientsEnhancedController } from './patients-enhanced.controller';
import { PatientsEnhancedService } from './patients-enhanced.service';

@Module({
  controllers: [PatientsEnhancedController],
  providers: [PatientsEnhancedService],
  exports: [PatientsEnhancedService],
})
export class PatientsEnhancedModule {}
