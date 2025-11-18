import { IsOptional, IsString, IsEnum, IsDateString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PatientSearchDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search query (name, MRN, phone)' })
  query?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Medical record number' })
  medicalRecordNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Identity number (NIK)' })
  identityNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Patient name' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @IsOptional()
  @IsEnum(['I', 'II', 'III', 'IV'])
  @ApiPropertyOptional({
    enum: ['I', 'II', 'III', 'IV'],
    description: 'Cancer stage filter'
  })
  cancerStage?: 'I' | 'II' | 'III' | 'IV';

  @IsOptional()
  @IsEnum(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'])
  @ApiPropertyOptional({
    enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
    description: 'Treatment status filter'
  })
  treatmentStatus?: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Primary cancer site' })
  primarySite?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Treatment center ID' })
  treatmentCenter?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of birth from (YYYY-MM-DD)' })
  dateOfBirthFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of birth to (YYYY-MM-DD)' })
  dateOfBirthTo?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of diagnosis from (YYYY-MM-DD)' })
  dateOfDiagnosisFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of diagnosis to (YYYY-MM-DD)' })
  dateOfDiagnosisTo?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiPropertyOptional({ description: 'Filter deceased patients' })
  isDeceased?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number (default: 1)', minimum: 1, default: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Items per page (default: 10)', minimum: 1, maximum: 100, default: 10 })
  limit?: number;

  @IsOptional()
  @IsEnum(['name', 'createdAt', 'dateOfDiagnosis', 'lastVisitDate'])
  @ApiPropertyOptional({
    enum: ['name', 'createdAt', 'dateOfDiagnosis', 'lastVisitDate'],
    description: 'Sort field'
  })
  sortBy?: 'name' | 'createdAt' | 'dateOfDiagnosis' | 'lastVisitDate';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort order'
  })
  sortOrder?: 'asc' | 'desc';
}