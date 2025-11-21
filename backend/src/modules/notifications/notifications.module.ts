import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../auth/email.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
