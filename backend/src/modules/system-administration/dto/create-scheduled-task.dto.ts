import { IsString, IsOptional, IsBoolean, IsJSON, IsEnum, IsInt } from 'class-validator';

export enum TaskType {
  BACKUP = 'BACKUP',
  CLEANUP = 'CLEANUP',
  REPORT_GENERATION = 'REPORT_GENERATION',
  DATA_SYNC = 'DATA_SYNC',
  HEALTH_CHECK = 'HEALTH_CHECK',
  NOTIFICATION = 'NOTIFICATION',
  CACHE_REFRESH = 'CACHE_REFRESH',
  LOG_ROTATION = 'LOG_ROTATION',
  INDEX_REBUILD = 'INDEX_REBUILD',
  STATISTICS_UPDATE = 'STATISTICS_UPDATE',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  MAINTENANCE = 'MAINTENANCE',
  CUSTOM_SCRIPT = 'CUSTOM_SCRIPT',
}

export class CreateScheduledTaskDto {
  @IsString()
  name: string;

  @IsEnum(TaskType)
  taskType: TaskType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  schedule: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  concurrency?: number;

  @IsOptional()
  @IsInt()
  timeout?: number;

  @IsOptional()
  @IsInt()
  retryAttempts?: number;

  @IsOptional()
  @IsInt()
  retryDelay?: number;

  @IsOptional()
  @IsInt()
  maxRunTime?: number;

  @IsOptional()
  @IsJSON()
  configuration?: any;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsString()
  createdBy: string;
}