import { IsString, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OfflineOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SYNC = 'SYNC',
}

export class SyncOfflineDataDto {
  @ApiProperty({ description: 'Entity type (patient, diagnosis, medication, etc.)' })
  @IsString()
  entityType: string;

  @ApiPropertyOptional({ description: 'Entity ID (null for creates)' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ enum: OfflineOperation })
  @IsEnum(OfflineOperation)
  operation: OfflineOperation;

  @ApiProperty({ description: 'The actual data payload', type: Object })
  data: any;

  @ApiPropertyOptional({ description: 'Priority (higher = more important)', default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({ description: 'Local timestamp when created offline' })
  @IsDateString()
  localTimestamp: string;

  @ApiPropertyOptional({ description: 'Device ID' })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata', type: Object })
  @IsOptional()
  metadata?: any;
}
