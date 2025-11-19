import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionType, DataAccessLevel, ComplianceStatus } from '@prisma/client';

export class CreateDataAccessSessionDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  @IsNotEmpty()
  researchRequestId: string;

  @ApiProperty({ description: 'User ID accessing data' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: SessionType, description: 'Type of session' })
  @IsEnum(SessionType)
  sessionType: SessionType;

  @ApiProperty({ enum: DataAccessLevel, description: 'Access level' })
  @IsEnum(DataAccessLevel)
  accessLevel: DataAccessLevel;

  @ApiPropertyOptional({ description: 'Session purpose' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Approval reference' })
  @IsString()
  @IsOptional()
  approvalReference?: string;

  @ApiPropertyOptional({ description: 'Enable automated monitoring' })
  @IsBoolean()
  @IsOptional()
  automatedMonitoring?: boolean;
}

export class UpdateDataAccessSessionDto {
  @ApiPropertyOptional({ description: 'End time' })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsInt()
  @Min(0)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Data accessed (JSON format)' })
  @IsString()
  @IsOptional()
  dataAccessed?: string;

  @ApiPropertyOptional({ description: 'Queries executed (JSON format)' })
  @IsString()
  @IsOptional()
  queriesExecuted?: string;

  @ApiPropertyOptional({ enum: ComplianceStatus, description: 'Compliance status' })
  @IsEnum(ComplianceStatus)
  @IsOptional()
  complianceStatus?: ComplianceStatus;

  @ApiPropertyOptional({ description: 'Violation reason' })
  @IsString()
  @IsOptional()
  violationReason?: string;
}

export class SearchDataAccessSessionDto {
  @ApiPropertyOptional({ description: 'Research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ enum: SessionType, description: 'Session type' })
  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @ApiPropertyOptional({ enum: DataAccessLevel, description: 'Access level' })
  @IsEnum(DataAccessLevel)
  @IsOptional()
  accessLevel?: DataAccessLevel;

  @ApiPropertyOptional({ enum: ComplianceStatus, description: 'Compliance status' })
  @IsEnum(ComplianceStatus)
  @IsOptional()
  complianceStatus?: ComplianceStatus;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Date from' })
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date to' })
  @IsString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class AggregateDataQueryDto {
  @ApiPropertyOptional({ description: 'Cancer types to include' })
  @IsString()
  @IsOptional()
  cancerTypes?: string;

  @ApiPropertyOptional({ description: 'Years to include' })
  @IsString()
  @IsOptional()
  years?: string;

  @ApiPropertyOptional({ description: 'Provinces to include' })
  @IsString()
  @IsOptional()
  provinces?: string;

  @ApiPropertyOptional({ description: 'Age groups to include' })
  @IsString()
  @IsOptional()
  ageGroups?: string;

  @ApiPropertyOptional({ description: 'Genders to include' })
  @IsString()
  @IsOptional()
  genders?: string;

  @ApiPropertyOptional({ description: 'Stages to include' })
  @IsString()
  @IsOptional()
  stages?: string;

  @ApiPropertyOptional({ description: 'Include mortality data' })
  @IsBoolean()
  @IsOptional()
  includeMortality?: boolean = false;

  @ApiPropertyOptional({ description: 'Include survival data' })
  @IsBoolean()
  @IsOptional()
  includeSurvival?: boolean = false;

  @ApiPropertyOptional({ description: 'Include trends' })
  @IsBoolean()
  @IsOptional()
  includeTrends?: boolean = false;

  @ApiPropertyOptional({ description: 'Minimum case count for privacy' })
  @IsInt()
  @Min(0)
  @IsOptional()
  privacyThreshold?: number = 5;

  @ApiPropertyOptional({ description: 'Group by field' })
  @IsString()
  @IsOptional()
  groupBy?: string;

  @ApiPropertyOptional({ description: 'Aggregate function' })
  @IsString()
  @IsOptional()
  aggregateFunction?: string = 'sum';

  @ApiPropertyOptional({ description: 'Output format' })
  @IsString()
  @IsOptional()
  outputFormat?: string = 'json';
}

export class GeographicVisualizationDto {
  @ApiPropertyOptional({ description: 'Province' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: 'Regency' })
  @IsString()
  @IsOptional()
  regency?: string;

  @ApiPropertyOptional({ description: 'Cancer type' })
  @IsString()
  @IsOptional()
  cancerType?: string;

  @ApiPropertyOptional({ description: 'Year' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ description: 'Month', minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @ApiPropertyOptional({ description: 'Metric to visualize' })
  @IsString()
  @IsOptional()
  metric?: string = 'count';

  @ApiPropertyOptional({ description: 'Map type' })
  @IsString()
  @IsOptional()
  mapType?: string = 'choropleth';

  @ApiPropertyOptional({ description: 'Color scheme' })
  @IsString()
  @IsOptional()
  colorScheme?: string = 'blues';

  @ApiPropertyOptional({ description: 'Show labels' })
  @IsBoolean()
  @IsOptional()
  showLabels?: boolean = true;

  @ApiPropertyOptional({ description: 'Minimum case count for privacy' })
  @IsInt()
  @Min(0)
  @IsOptional()
  privacyThreshold?: number = 5;

  @ApiPropertyOptional({ description: 'Include coordinates' })
  @IsBoolean()
  @IsOptional()
  includeCoordinates?: boolean = true;
}