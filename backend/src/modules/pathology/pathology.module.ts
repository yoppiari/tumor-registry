import { Module } from '@nestjs/common';
import { PathologyController } from './pathology.controller';
import { PathologyService } from './pathology.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PathologyController],
  providers: [PathologyService],
  exports: [PathologyService],
})
export class PathologyModule {}
