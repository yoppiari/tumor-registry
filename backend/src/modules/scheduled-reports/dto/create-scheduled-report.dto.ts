import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RecipientDto {
  @ApiProperty({ enum: ['USER', 'ROLE', 'EMAIL', 'GROUP'] })
  @IsEnum(['USER', 'ROLE', 'EMAIL', 'GROUP'])
  type: 'USER' | 'ROLE' | 'EMAIL' | 'GROUP';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  personalization?: Record<string, any>;
}

export class CreateScheduledReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Cron expression for schedule' })
  @IsString()
  @IsNotEmpty()
  schedule: string;

  @ApiProperty({ type: [RecipientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiProperty({ enum: ['PDF', 'EXCEL', 'CSV', 'JSON', 'HTML'] })
  @IsEnum(['PDF', 'EXCEL', 'CSV', 'JSON', 'HTML'])
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'HTML';

  @ApiProperty({ enum: ['EMAIL', 'FILE_SHARE', 'API_WEBHOOK', 'SFTP', 'CLOUD_STORAGE'] })
  @IsEnum(['EMAIL', 'FILE_SHARE', 'API_WEBHOOK', 'SFTP', 'CLOUD_STORAGE'])
  deliveryMethod: 'EMAIL' | 'FILE_SHARE' | 'API_WEBHOOK' | 'SFTP' | 'CLOUD_STORAGE';

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
