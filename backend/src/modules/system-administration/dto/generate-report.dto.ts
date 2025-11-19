import { IsString, IsOptional, IsJSON, IsEnum, IsDate } from 'class-validator';

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  HTML = 'HTML',
  POWERPOINT = 'POWERPOINT',
}

export class GenerateReportDto {
  @IsString()
  templateId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsJSON()
  parameters?: any;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsString()
  generatedBy: string;
}