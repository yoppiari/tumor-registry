import { IsOptional, IsString, IsEnum, IsNumber, IsArray, IsBoolean, Min, Max, IsUUID, IsEmail, IsUrl, Matches, Length, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TimeRange {
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  NINETY_DAYS = '90d',
  SIX_MONTHS = '6m',
  ONE_YEAR = '1y',
}

export enum GeographicLevel {
  NATIONAL = 'national',
  PROVINCE = 'province',
  REGENCY = 'regency',
}

export enum BenchmarkPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum ImpactType {
  ALL = 'all',
  PUBLICATIONS = 'publications',
  CITATIONS = 'citations',
  PATENTS = 'patents',
  POLICY = 'policy',
  CLINICAL = 'clinical',
  ECONOMIC = 'economic',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

// Dashboard DTOs
export class ExecutiveDashboardQueryDto {
  @ApiPropertyOptional({ description: 'Center ID filter' })
  @IsOptional()
  @IsUUID()
  centerId?: string;

  @ApiPropertyOptional({ enum: TimeRange, description: 'Time range for dashboard data' })
  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange = TimeRange.THIRTY_DAYS;
}

export class NationalIntelligenceQueryDto {
  // No parameters needed for national intelligence
}

// Performance Benchmarking DTOs
export class PerformanceBenchmarkQueryDto {
  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsEnum(BenchmarkPeriod)
  benchmarkPeriod?: BenchmarkPeriod = BenchmarkPeriod.MONTHLY;
}

export class CenterMetricsQueryDto {
  @IsString()
  centerId: string;

  @IsOptional()
  @IsString()
  period?: string;
}

// Predictive Analytics DTOs
export class PredictiveTrendsQueryDto {
  @IsOptional()
  @IsString()
  cancerType?: string;

  @IsOptional()
  @IsEnum(GeographicLevel)
  geographicLevel?: GeographicLevel = GeographicLevel.NATIONAL;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  predictionHorizon?: number = 12;
}

export class CancerTypeTrendsQueryDto {
  @IsString()
  cancerType: string;

  @IsOptional()
  @IsEnum(GeographicLevel)
  geographicLevel?: GeographicLevel = GeographicLevel.NATIONAL;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  predictionHorizon?: number = 12;
}

// Research Impact DTOs
export class ResearchImpactQueryDto {
  @IsOptional()
  @IsString()
  researchRequestId?: string;

  @IsOptional()
  @IsEnum(ImpactType)
  impactType?: ImpactType = ImpactType.ALL;

  @IsOptional()
  @IsString()
  timeFrame?: string = '12m';
}

// Cache Management DTOs
export class InvalidateCacheDto {
  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsBoolean()
  all?: boolean = false;
}

export class CacheStatsQueryDto {
  @IsOptional()
  @IsBoolean()
  detailed?: boolean = false;

  @IsOptional()
  @IsString()
  metricType?: string;
}

// Data Quality DTOs
export class DataQualityQueryDto {
  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsEnum(TimeRange)
  timeRange?: TimeRange = TimeRange.THIRTY_DAYS;

  @IsOptional()
  @IsBoolean()
  includeRecommendations?: boolean = true;
}

// Health Check DTOs
export class HealthCheckQueryDto {
  @IsOptional()
  @IsBoolean()
  detailed?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];
}

// Events Query DTOs
export class EventsQueryDto {
  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

// Report Generation DTOs
export class ReportGenerationDto {
  @IsString()
  reportType: string;

  @IsEnum(ReportFormat)
  format: ReportFormat = ReportFormat.PDF;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  parameters?: Record<string, any>;
}

export class ReportSchedulingDto {
  @IsString()
  name: string;

  @IsString()
  reportType: string;

  @IsString()
  schedule: string; // cron expression

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsEnum(ReportFormat)
  format: ReportFormat = ReportFormat.PDF;

  @IsOptional()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

// Benchmark Comparison DTOs
export class BenchmarkComparisonDto {
  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comparisonCenters?: string[];

  @IsOptional()
  @IsString()
  peerGroup?: string;

  @IsOptional()
  @IsEnum(BenchmarkPeriod)
  period?: BenchmarkPeriod = BenchmarkPeriod.MONTHLY;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  numberOfPeriods?: number = 6;
}

// Analytics Configuration DTOs
export class AnalyticsConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(300)
  @Max(86400)
  cacheTTL?: number = 3600;

  @IsOptional()
  @IsBoolean()
  enableRealTimeUpdates?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  updateInterval?: number = 5;

  @IsOptional()
  @IsString()
  defaultTimeRange?: TimeRange = TimeRange.THIRTY_DAYS;

  @IsOptional()
  @IsBoolean()
  enablePredictiveAnalytics?: boolean = true;

  @IsOptional()
  @IsBoolean()
  enableBenchmarking?: boolean = true;
}

// Performance Metrics DTOs
export class PerformanceMetricsDto {
  @IsString()
  metricType: string;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsBoolean()
  includeComparisons?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeTargets?: boolean = true;
}

// Trend Analysis DTOs
export class TrendAnalysisDto {
  @IsOptional()
  @IsString()
  cancerType?: string;

  @IsOptional()
  @IsString()
  geographicArea?: string;

  @IsOptional()
  @IsEnum(GeographicLevel)
  geographicLevel?: GeographicLevel = GeographicLevel.NATIONAL;

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(60)
  historicalMonths?: number = 24;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  predictionMonths?: number = 12;

  @IsOptional()
  @IsBoolean()
  includeSeasonality?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeRiskFactors?: boolean = true;
}

// Research Analytics DTOs
export class ResearchAnalyticsDto {
  @IsOptional()
  @IsString()
  researchRequestId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchTypes?: string[];

  @IsOptional()
  @IsString()
  timeFrame?: string = '12m';

  @IsOptional()
  @IsBoolean()
  includeCollaborations?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includeEconomicImpact?: boolean = true;

  @IsOptional()
  @IsBoolean()
  includePatientOutcomes?: boolean = true;
}

// Alert Configuration DTOs
export class AlertConfigurationDto {
  @IsString()
  metricType: string;

  @IsString()
  condition: string; // '>', '<', '=', '>=', '<='

  @IsNumber()
  threshold: number;

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(1440)
  checkInterval?: number = 60; // minutes
}

// Export Data DTOs
export class ExportDataDto {
  @IsString()
  dataType: string;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsBoolean()
  includeMetadata?: boolean = true;

  @IsOptional()
  @IsString()
  filterCriteria?: string;
}

// Response DTOs
export class AnalyticsApiResponseDto<T = any> {
  data: T;
  metadata: {
    timestamp: Date;
    cacheHit: boolean;
    executionTime: number;
    dataFreshness?: Date;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

export class ErrorResponseDto {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
  path: string;
}