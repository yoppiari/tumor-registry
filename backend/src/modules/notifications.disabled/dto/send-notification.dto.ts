import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({ enum: ['USER', 'ROLE', 'EMAIL', 'GROUP'] })
  @IsEnum(['USER', 'ROLE', 'EMAIL', 'GROUP'])
  recipientType: 'USER' | 'ROLE' | 'EMAIL' | 'GROUP';

  @ApiProperty({ enum: ['EMAIL', 'SMS', 'IN_APP', 'PUSH', 'WEBHOOK'] })
  @IsEnum(['EMAIL', 'SMS', 'IN_APP', 'PUSH', 'WEBHOOK'])
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH' | 'WEBHOOK';

  @ApiProperty({ enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ALERT'] })
  @IsEnum(['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ALERT'])
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'], required: false })
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledFor?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  responseRequired?: boolean;
}

export class CreateNotificationPreferenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ['SYSTEM', 'SECURITY', 'REPORTS', 'BACKUPS', 'PERFORMANCE', 'COMPLIANCE'] })
  @IsEnum(['SYSTEM', 'SECURITY', 'REPORTS', 'BACKUPS', 'PERFORMANCE', 'COMPLIANCE'])
  category: string;

  @ApiProperty({ enum: ['EMAIL', 'SMS', 'IN_APP', 'PUSH'] })
  @IsEnum(['EMAIL', 'SMS', 'IN_APP', 'PUSH'])
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH';

  @ApiProperty({ default: true })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty({ enum: ['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'] })
  @IsEnum(['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'])
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quietHoursStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quietHoursEnd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  digestSchedule?: string;
}

export class UpdateNotificationPreferenceDto extends CreateNotificationPreferenceDto {}
