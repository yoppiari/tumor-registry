import { Module } from '@nestjs/common';
import { ExternalSystemsController } from './external-systems.controller';
import { ExternalSystemsService } from './external-systems.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ExternalSystemsController],
  providers: [ExternalSystemsService],
  exports: [ExternalSystemsService],
})
export class ExternalSystemsModule {}