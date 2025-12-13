import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

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
  PATIENT_OUTCOMES = 'PATIENT_OUTCOMES',
  CLINICAL_TRIALS = 'CLINICAL_TRIALS',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
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

export class ChartConfigDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  xAxis?: string;

  @IsOptional()
  @IsString()
  yAxis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  series?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  options?: any;
}

export class LayoutSectionDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: any;

  @IsObject()
  position: { x: number; y: number; width: number; height: number };

  @IsOptional()
  styling?: any;
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

  @IsEnum(TemplateType)
  templateType: TemplateType;

  @IsString()
  dataSource: string;

  @IsOptional()
  parameters?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutSectionDto)
  layout: LayoutSectionDto[];

  @IsOptional()
  styling?: any;

  @IsOptional()
  filters?: any;

  @IsOptional()
  aggregations?: any;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartConfigDto)
  charts?: ChartConfigDto[];

  @IsEnum(DataAccessLevel)
  accessLevel: DataAccessLevel;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsString()
  createdBy: string;
}