import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StudyType } from '@prisma/client';

export class CheckDataAvailabilityDto {
  @ApiProperty({ description: 'Cancer type' })
  @IsString()
  cancerType: string;

  @ApiPropertyOptional({ description: 'Province filter' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: 'Regency filter' })
  @IsString()
  @IsOptional()
  regency?: string;

  @ApiPropertyOptional({ description: 'Start year' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  yearFrom?: number;

  @ApiPropertyOptional({ description: 'End year' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  yearTo?: number;

  @ApiPropertyOptional({ description: 'Required data fields', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredFields?: string[];
}

export class CalculateSampleSizeDto {
  @ApiProperty({ description: 'Study type', enum: StudyType })
  @IsEnum(StudyType)
  studyType: StudyType;

  @ApiPropertyOptional({ description: 'Expected effect size (Cohen\'s d)', default: 0.5 })
  @IsNumber()
  @Min(0.1)
  @Max(3.0)
  @IsOptional()
  effectSize?: number = 0.5;

  @ApiPropertyOptional({ description: 'Statistical power (0-1)', default: 0.8 })
  @IsNumber()
  @Min(0.5)
  @Max(0.99)
  @IsOptional()
  power?: number = 0.8;

  @ApiPropertyOptional({ description: 'Significance level (alpha)', default: 0.05 })
  @IsNumber()
  @Min(0.01)
  @Max(0.1)
  @IsOptional()
  alpha?: number = 0.05;

  @ApiPropertyOptional({ description: 'Expected dropout rate (0-1)', default: 0.1 })
  @IsNumber()
  @Min(0)
  @Max(0.5)
  @IsOptional()
  dropoutRate?: number = 0.1;

  @ApiPropertyOptional({ description: 'Number of groups/arms', default: 2 })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  numberOfGroups?: number = 2;

  @ApiPropertyOptional({ description: 'Allocation ratio', default: 1 })
  @IsNumber()
  @Min(0.5)
  @Max(5)
  @IsOptional()
  allocationRatio?: number = 1;

  @ApiPropertyOptional({ description: 'Population prevalence (0-1) for case-control studies' })
  @IsNumber()
  @Min(0.001)
  @Max(0.5)
  @IsOptional()
  prevalence?: number;

  @ApiPropertyOptional({ description: 'Expected proportion (0-1) for single proportion studies' })
  @IsNumber()
  @Min(0.01)
  @Max(0.99)
  @IsOptional()
  expectedProportion?: number;

  @ApiPropertyOptional({ description: 'Confidence interval width for proportion studies' })
  @IsNumber()
  @Min(0.01)
  @Max(0.2)
  @IsOptional()
  confidenceWidth?: number;
}

export class AssessFeasibilityDto {
  @ApiPropertyOptional({ description: 'Associated research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiProperty({ description: 'Study type', enum: StudyType })
  @IsEnum(StudyType)
  studyType: StudyType;

  @ApiProperty({ description: 'Cancer type' })
  @IsString()
  cancerType: string;

  @ApiProperty({ description: 'Inclusion criteria' })
  @IsString()
  inclusionCriteria: string;

  @ApiProperty({ description: 'Exclusion criteria' })
  @IsString()
  exclusionCriteria: string;

  @ApiProperty({ description: 'Desired sample size' })
  @IsInt()
  @Min(10)
  desiredSampleSize: number;

  @ApiProperty({ description: 'Study duration in months' })
  @IsInt()
  @Min(1)
  @Max(120)
  studyDuration: number;

  @ApiPropertyOptional({ description: 'Province filter' })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiPropertyOptional({ description: 'Regency filter' })
  @IsString()
  @IsOptional()
  regency?: string;

  @ApiPropertyOptional({ description: 'Required data fields', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredFields?: string[];

  @ApiPropertyOptional({ description: 'Expected recruitment rate per month' })
  @IsInt()
  @Min(1)
  @IsOptional()
  expectedRecruitmentRate?: number;

  @ApiPropertyOptional({ description: 'Available budget' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  availableBudget?: number;

  @ApiPropertyOptional({ description: 'Cost per participant' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  costPerParticipant?: number;
}

export class CreateSimilarStudyDto {
  @ApiProperty({ description: 'Study title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Authors' })
  @IsString()
  authors: string;

  @ApiProperty({ description: 'Publication year' })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ description: 'Study type', enum: StudyType })
  @IsEnum(StudyType)
  studyType: StudyType;

  @ApiProperty({ description: 'Cancer type' })
  @IsString()
  cancerType: string;

  @ApiProperty({ description: 'Sample size' })
  @IsInt()
  @Min(1)
  sampleSize: number;

  @ApiProperty({ description: 'Methodology description' })
  @IsString()
  methodology: string;

  @ApiPropertyOptional({ description: 'Key findings' })
  @IsString()
  @IsOptional()
  findings?: string;

  @ApiPropertyOptional({ description: 'Study strengths' })
  @IsString()
  @IsOptional()
  strengths?: string;

  @ApiPropertyOptional({ description: 'Study limitations' })
  @IsString()
  @IsOptional()
  limitations?: string;

  @ApiPropertyOptional({ description: 'Citation' })
  @IsString()
  @IsOptional()
  citation?: string;

  @ApiPropertyOptional({ description: 'DOI' })
  @IsString()
  @IsOptional()
  doi?: string;

  @ApiPropertyOptional({ description: 'PubMed ID' })
  @IsString()
  @IsOptional()
  pmid?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class SearchSimilarStudiesDto {
  @ApiPropertyOptional({ description: 'Cancer type' })
  @IsString()
  @IsOptional()
  cancerType?: string;

  @ApiPropertyOptional({ description: 'Study type', enum: StudyType })
  @IsEnum(StudyType)
  @IsOptional()
  studyType?: StudyType;

  @ApiPropertyOptional({ description: 'Search keywords' })
  @IsString()
  @IsOptional()
  keywords?: string;

  @ApiPropertyOptional({ description: 'Minimum sample size' })
  @IsInt()
  @Min(1)
  @IsOptional()
  minSampleSize?: number;

  @ApiPropertyOptional({ description: 'Year from' })
  @IsInt()
  @Min(1900)
  @IsOptional()
  yearFrom?: number;

  @ApiPropertyOptional({ description: 'Year to' })
  @IsInt()
  @Max(2100)
  @IsOptional()
  yearTo?: number;

  @ApiPropertyOptional({ description: 'Tags to filter by', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

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
