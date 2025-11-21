import { IsString, IsOptional, IsEnum, IsDate, IsArray, ValidateNested, IsObject, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  HTML = 'HTML',
  POWERPOINT = 'POWERPOINT',
}

export class ReportFilterDto {
  @IsString()
  field: string;

  @IsString()
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';

  value: any;
}

export class OrderByDto {
  @IsString()
  field: string;

  @IsString()
  direction: 'asc' | 'desc';
}

export class GenerateReportDto {
  @IsString()
  templateId: string;

  @IsString()
  name: string;

  @IsOptional()
  parameters?: any;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFilterDto)
  filters?: ReportFilterDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderByDto)
  orderBy?: OrderByDto[];

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsString()
  generatedBy: string;
}

export class ScheduleReportDto {
  @IsString()
  templateId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  schedule: string; // cron expression

  @IsArray()
  recipients: Array<{
    type: 'email' | 'role' | 'user';
    value: string;
  }>;

  @IsOptional()
  parameters?: any;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsString()
  deliveryMethod: 'EMAIL' | 'FILE_SHARE' | 'API_WEBHOOK';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsString()
  createdBy: string;
}