import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum BooleanOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

export enum SearchFieldType {
  CANCER_TYPE = 'cancer_type',
  GENDER = 'gender',
  AGE_GROUP = 'age_group',
  STAGE = 'stage',
  TREATMENT = 'treatment',
  PROVINCE = 'province',
  REGENCY = 'regency',
  DIAGNOSIS_DATE = 'diagnosis_date',
  STUDY_TYPE = 'study_type',
  STATUS = 'status',
}

export class SearchCriterion {
  @ApiProperty({ description: 'Field to search', enum: SearchFieldType })
  @IsEnum(SearchFieldType)
  field: SearchFieldType;

  @ApiProperty({ description: 'Value to search for' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Operator for this criterion', enum: BooleanOperator, default: 'AND' })
  @IsEnum(BooleanOperator)
  @IsOptional()
  operator?: BooleanOperator = BooleanOperator.AND;
}

export class AdvancedSearchDto {
  @ApiPropertyOptional({ description: 'Free text search across all fields' })
  @IsString()
  @IsOptional()
  freeText?: string;

  @ApiPropertyOptional({ description: 'Array of search criteria', type: [SearchCriterion] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SearchCriterion)
  @IsOptional()
  criteria?: SearchCriterion[];

  @ApiPropertyOptional({ description: 'Cancer types to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cancerTypes?: string[];

  @ApiPropertyOptional({ description: 'Provinces to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  provinces?: string[];

  @ApiPropertyOptional({ description: 'Gender filter' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Age groups to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ageGroups?: string[];

  @ApiPropertyOptional({ description: 'Treatment types to include' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  treatments?: string[];

  @ApiPropertyOptional({ description: 'Start date for date range' })
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'End date for date range' })
  @IsString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Enable faceted navigation', default: true })
  @IsBoolean()
  @IsOptional()
  facetedNavigation?: boolean = true;

  @ApiPropertyOptional({ description: 'Facets to include in results' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facets?: string[] = ['cancer_type', 'province', 'gender', 'age_group', 'stage'];

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
  sortBy?: string = 'relevance';

  @ApiPropertyOptional({ description: 'Sort direction' })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ description: 'Include relevance scoring', default: true })
  @IsBoolean()
  @IsOptional()
  includeScoring?: boolean = true;
}

export class SavedSearchDto {
  @ApiProperty({ description: 'Name of the saved search' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the search' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Search criteria to save', type: AdvancedSearchDto })
  @ValidateNested()
  @Type(() => AdvancedSearchDto)
  searchCriteria: AdvancedSearchDto;

  @ApiPropertyOptional({ description: 'Make search public', default: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;

  @ApiPropertyOptional({ description: 'Enable alerts for this search', default: false })
  @IsBoolean()
  @IsOptional()
  alertsEnabled?: boolean = false;

  @ApiPropertyOptional({ description: 'Alert frequency', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'IMMEDIATE'] })
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'IMMEDIATE'])
  @IsOptional()
  alertFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE';
}

export class UpdateSavedSearchDto {
  @ApiPropertyOptional({ description: 'Name of the saved search' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the search' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Search criteria to save', type: AdvancedSearchDto })
  @ValidateNested()
  @Type(() => AdvancedSearchDto)
  @IsOptional()
  searchCriteria?: AdvancedSearchDto;

  @ApiPropertyOptional({ description: 'Make search public' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Enable alerts for this search' })
  @IsBoolean()
  @IsOptional()
  alertsEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Alert frequency', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'IMMEDIATE'] })
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'IMMEDIATE'])
  @IsOptional()
  alertFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'IMMEDIATE';
}
