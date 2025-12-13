import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ResearchRequestStatus,
  StudyType,
  EthicsStatus,
  ResearchPriority,
  ApprovalLevel,
  CollaborationStatus,
  PublicationType,
  ImpactMetricType
} from '@prisma/client';

export class SearchResearchRequestDto {
  @ApiPropertyOptional({ description: 'Search by title or description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ResearchRequestStatus, description: 'Filter by status' })
  @IsEnum(ResearchRequestStatus)
  @IsOptional()
  status?: ResearchRequestStatus;

  @ApiPropertyOptional({ enum: StudyType, description: 'Filter by study type' })
  @IsEnum(StudyType)
  @IsOptional()
  studyType?: StudyType;

  @ApiPropertyOptional({ enum: EthicsStatus, description: 'Filter by ethics status' })
  @IsEnum(EthicsStatus)
  @IsOptional()
  ethicsStatus?: EthicsStatus;

  @ApiPropertyOptional({ enum: ResearchPriority, description: 'Filter by priority' })
  @IsEnum(ResearchPriority)
  @IsOptional()
  priority?: ResearchPriority;

  @ApiPropertyOptional({ description: 'Filter by principal investigator ID' })
  @IsString()
  @IsOptional()
  principalInvestigatorId?: string;

  @ApiPropertyOptional({ description: 'Filter by creator ID' })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Filter by funding source' })
  @IsString()
  @IsOptional()
  fundingSource?: string;

  @ApiPropertyOptional({ description: 'Filter by province' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: 'Minimum sample size' })
  @IsInt()
  @Min(1)
  @IsOptional()
  minSampleSize?: number;

  @ApiPropertyOptional({ description: 'Maximum sample size' })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxSampleSize?: number;

  @ApiPropertyOptional({ description: 'Minimum duration in months' })
  @IsInt()
  @Min(1)
  @IsOptional()
  minDuration?: number;

  @ApiPropertyOptional({ description: 'Maximum duration in months' })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxDuration?: number;

  @ApiPropertyOptional({ description: 'Whether ethics approval is required' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  requiresEthicsApproval?: boolean;

  @ApiPropertyOptional({ description: 'Submitted after date' })
  @IsString()
  @IsOptional()
  submittedAfter?: string;

  @ApiPropertyOptional({ description: 'Submitted before date' })
  @IsString()
  @IsOptional()
  submittedBefore?: string;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort direction' })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class SearchCollaborationDto {
  @ApiPropertyOptional({ description: 'Research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiPropertyOptional({ description: 'Collaborator user ID' })
  @IsString()
  @IsOptional()
  collaboratorId?: string;

  @ApiPropertyOptional({ enum: CollaborationStatus, description: 'Filter by status' })
  @IsEnum(CollaborationStatus)
  @IsOptional()
  status?: CollaborationStatus;

  @ApiPropertyOptional({ description: 'Collaborator email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Affiliation' })
  @IsString()
  @IsOptional()
  affiliation?: string;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}

export class SearchPublicationDto {
  @ApiPropertyOptional({ description: 'Research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiPropertyOptional({ description: 'Search by title or abstract' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: PublicationType, description: 'Filter by publication type' })
  @IsEnum(PublicationType)
  @IsOptional()
  publicationType?: PublicationType;

  @ApiPropertyOptional({ description: 'Journal name' })
  @IsString()
  @IsOptional()
  journal?: string;

  @ApiPropertyOptional({ description: 'DOI' })
  @IsString()
  @IsOptional()
  doi?: string;

  @ApiPropertyOptional({ description: 'PMID' })
  @IsString()
  @IsOptional()
  pmid?: string;

  @ApiPropertyOptional({ description: 'Open access' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  openAccess?: boolean;

  @ApiPropertyOptional({ description: 'Year of publication' })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}

export class SearchImpactMetricDto {
  @ApiPropertyOptional({ description: 'Research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiPropertyOptional({ enum: ImpactMetricType, description: 'Filter by metric type' })
  @IsEnum(ImpactMetricType)
  @IsOptional()
  metricType?: ImpactMetricType;

  @ApiPropertyOptional({ description: 'Category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Verified status' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isVerified?: boolean;

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
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}

export class SearchGeographicDataDto {
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

  @ApiPropertyOptional({ description: 'Stage' })
  @IsString()
  @IsOptional()
  stage?: string;

  @ApiPropertyOptional({ description: 'Year' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({ description: 'Month', minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  @IsOptional()
  month?: number;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Age group' })
  @IsString()
  @IsOptional()
  ageGroup?: string;

  @ApiPropertyOptional({ description: 'Urban/rural' })
  @IsString()
  @IsOptional()
  urbanRural?: string;

  @ApiPropertyOptional({ description: 'Minimum count' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minCount?: number;

  @ApiPropertyOptional({ description: 'Maximum count' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxCount?: number;

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 1000, default: 100 })
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 100;
}