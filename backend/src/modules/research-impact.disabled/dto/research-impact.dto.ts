import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImpactMetricType } from '@prisma/client';

export class CreateImpactMetricDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  researchRequestId: string;

  @ApiProperty({ enum: ImpactMetricType, description: 'Impact metric type' })
  @IsEnum(ImpactMetricType)
  metricType: ImpactMetricType;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Metric description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Metric date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Data source' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Methodology used' })
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiPropertyOptional({ description: 'Baseline value for comparison' })
  @IsOptional()
  @IsNumber()
  baseline?: number;

  @ApiPropertyOptional({ description: 'Target value' })
  @IsOptional()
  @IsNumber()
  target?: number;

  @ApiPropertyOptional({ description: 'Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags (comma-separated)' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ResearcherContributionDto {
  @ApiProperty({ description: 'Researcher user ID' })
  @IsString()
  researcherId: string;

  @ApiPropertyOptional({ description: 'Time period for analysis (e.g., 1y, 5y, all)' })
  @IsOptional()
  @IsString()
  timePeriod?: string;

  @ApiPropertyOptional({ description: 'Include detailed breakdown?', default: false })
  @IsOptional()
  @IsBoolean()
  includeDetails?: boolean;
}

export class CollaborationNetworkDto {
  @ApiPropertyOptional({ description: 'Research request ID to analyze' })
  @IsOptional()
  @IsString()
  researchRequestId?: string;

  @ApiPropertyOptional({ description: 'Center ID to analyze' })
  @IsOptional()
  @IsString()
  centerId?: string;

  @ApiPropertyOptional({ description: 'Maximum depth of network', default: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxDepth?: number;

  @ApiPropertyOptional({ description: 'Minimum collaboration strength (0-1)', default: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  minStrength?: number;
}

export class InnovationTrackingDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  researchRequestId: string;

  @ApiProperty({ description: 'Innovation type (patent, diagnostic_tool, clinical_protocol, policy_change)' })
  @IsString()
  innovationType: string;

  @ApiProperty({ description: 'Innovation title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Application/patent number' })
  @IsOptional()
  @IsString()
  applicationNumber?: string;

  @ApiPropertyOptional({ description: 'Status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filing/implementation date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Organizations involved' })
  @IsOptional()
  @IsString()
  organizations?: string;

  @ApiPropertyOptional({ description: 'Expected/actual impact' })
  @IsOptional()
  @IsString()
  impact?: string;
}

export class ROIAnalysisDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  researchRequestId: string;

  @ApiPropertyOptional({ description: 'Funding amount invested' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fundingAmount?: number;

  @ApiPropertyOptional({ description: 'Analysis time period (years)', default: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  timePeriod?: number;

  @ApiPropertyOptional({ description: 'Include economic impact?', default: true })
  @IsOptional()
  @IsBoolean()
  includeEconomicImpact?: boolean;

  @ApiPropertyOptional({ description: 'Include social impact?', default: true })
  @IsOptional()
  @IsBoolean()
  includeSocialImpact?: boolean;

  @ApiPropertyOptional({ description: 'Include academic impact?', default: true })
  @IsOptional()
  @IsBoolean()
  includeAcademicImpact?: boolean;
}

export class ImpactReportDto {
  @ApiPropertyOptional({ description: 'Research request ID (optional, for specific research)' })
  @IsOptional()
  @IsString()
  researchRequestId?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Report format (summary, detailed, executive)', default: 'summary' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Include visualizations?', default: true })
  @IsOptional()
  @IsBoolean()
  includeVisualizations?: boolean;

  @ApiPropertyOptional({ description: 'Stakeholder type (funder, ministry, public, academic)' })
  @IsOptional()
  @IsString()
  stakeholderType?: string;
}

export class BiblometricIndicatorsDto {
  @ApiProperty({ description: 'Researcher user ID' })
  @IsString()
  researcherId: string;

  @ApiPropertyOptional({ description: 'Include h-index?', default: true })
  @IsOptional()
  @IsBoolean()
  includeHIndex?: boolean;

  @ApiPropertyOptional({ description: 'Include i10-index?', default: true })
  @IsOptional()
  @IsBoolean()
  includeI10Index?: boolean;

  @ApiPropertyOptional({ description: 'Include g-index?', default: false })
  @IsOptional()
  @IsBoolean()
  includeGIndex?: boolean;

  @ApiPropertyOptional({ description: 'Include field-weighted citation impact?', default: false })
  @IsOptional()
  @IsBoolean()
  includeFWCI?: boolean;

  @ApiPropertyOptional({ description: 'Time period (all time or specific years)' })
  @IsOptional()
  @IsString()
  timePeriod?: string;
}
