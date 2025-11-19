import { IsString, IsOptional, IsBoolean, IsJSON, IsEnum } from 'class-validator';

export enum ReportType {
  DAILY_SUMMARY = 'DAILY_SUMMARY',
  WEEKLY_ANALYTICS = 'WEEKLY_ANALYTICS',
  MONTHLY_PERFORMANCE = 'MONTHLY_PERFORMANCE',
  QUARTERLY_REVIEW = 'QUARTERLY_REVIEW',
  ANNUAL_REPORT = 'ANNUAL_REPORT',
  AD_HOC_ANALYSIS = 'AD_HOC_ANALYSIS',
  RESEARCH_IMPACT = 'RESEARCH_IMPACT',
  QUALITY_METRICS = 'QUALITY_METRICS',
  EXECUTIVE_BRIEFING = 'EXECUTIVE_BRIEFING',
}

export enum TemplateType {
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM',
  SYSTEM = 'SYSTEM',
  USER_DEFINED = 'USER_DEFINED',
}

export enum DataAccessLevel {
  LIMITED = 'LIMITED',
  AGGREGATE_ONLY = 'AGGREGATE_ONLY',
  DEIDENTIFIED = 'DEIDENTIFIED',
  LIMITED_IDENTIFIABLE = 'LIMITED_IDENTIFIABLE',
  FULL_ACCESS = 'FULL_ACCESS',
}

export class CreateReportTemplateDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportType)
  reportType: ReportType;

  @IsOptional()
  @IsEnum(TemplateType)
  templateType?: TemplateType;

  @IsString()
  dataSource: string;

  @IsOptional()
  @IsJSON()
  parameters?: any;

  @IsJSON()
  layout: any;

  @IsOptional()
  @IsJSON()
  styling?: any;

  @IsOptional()
  @IsJSON()
  filters?: any;

  @IsOptional()
  @IsJSON()
  aggregations?: any;

  @IsOptional()
  @IsJSON()
  charts?: any;

  @IsOptional()
  @IsEnum(DataAccessLevel)
  accessLevel?: DataAccessLevel;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  centerId?: string;
}