import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsObject,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DataFieldsSelectionDto } from './data-fields-selection.dto';

export enum ResearchType {
  ACADEMIC = 'ACADEMIC', // Skripsi, Tesis, Disertasi
  CLINICAL_TRIAL = 'CLINICAL_TRIAL',
  OBSERVATIONAL = 'OBSERVATIONAL',
  SYSTEMATIC_REVIEW = 'SYSTEMATIC_REVIEW',
  META_ANALYSIS = 'META_ANALYSIS',
  OTHER = 'OTHER',
}

export enum IRBStatus {
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
}

/**
 * Data filters for patient selection
 */
export class DataFiltersDto {
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  tumorTypes?: string[]; // 'bone', 'soft_tissue', 'metastatic'

  @IsOptional()
  whoClassifications?: string[]; // IDs of WHO classifications

  @IsOptional()
  ennekingStages?: string[]; // 'IA', 'IB', 'IIA', 'IIB', 'III'

  @IsOptional()
  ajccStages?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  ageMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  ageMax?: number;

  @IsOptional()
  genders?: string[]; // 'MALE', 'FEMALE'

  @IsOptional()
  centerIds?: string[]; // Filter by specific centers

  @IsOptional()
  treatmentTypes?: string[]; // 'limb_salvage', 'amputation', 'chemotherapy', 'radiotherapy'
}

/**
 * Main DTO for creating/updating research request
 */
export class CreateResearchRequestDto {
  // STEP 1: Research Info
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  title: string;

  @IsEnum(ResearchType)
  researchType: ResearchType;

  @IsString()
  @MaxLength(500)
  researchAbstract: string;

  @IsString()
  @MaxLength(300)
  objectives: string;

  @IsOptional()
  @IsString()
  researcherPhone?: string;

  @IsOptional()
  @IsString()
  researcherInstitution?: string;

  // STEP 2: Data Criteria
  @ValidateNested()
  @Type(() => DataFiltersDto)
  @IsObject()
  dataFilters: DataFiltersDto;

  @IsOptional()
  @IsInt()
  estimatedPatientCount?: number;

  // STEP 3: Data Fields Selection (CORE)
  @ValidateNested()
  @Type(() => DataFieldsSelectionDto)
  @IsObject()
  requestedDataFields: DataFieldsSelectionDto;

  // STEP 4: Ethics & Timeline
  @IsEnum(IRBStatus)
  irbStatus: IRBStatus;

  @IsOptional()
  @IsString()
  ethicsApprovalNumber?: string;

  @IsOptional()
  @IsDateString()
  ethicsApprovalDate?: string;

  @IsOptional()
  @IsString()
  irbCertificateUrl?: string;

  @IsOptional()
  @IsString()
  protocolUrl?: string;

  @IsOptional()
  @IsString()
  proposalUrl?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsDateString()
  researchStart: string;

  @IsDateString()
  researchEnd: string;

  @IsInt()
  @Min(1)
  @Max(24)
  accessDurationMonths: number; // 3, 6, 12, or 24 months

  @IsBoolean()
  agreementSigned: boolean;

  @IsOptional()
  @IsDateString()
  agreementDate?: string;
}

/**
 * DTO for updating draft research request
 */
export class UpdateResearchRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ResearchType)
  researchType?: ResearchType;

  @IsOptional()
  @IsString()
  researchAbstract?: string;

  @IsOptional()
  @IsString()
  objectives?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DataFiltersDto)
  dataFilters?: DataFiltersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DataFieldsSelectionDto)
  requestedDataFields?: DataFieldsSelectionDto;

  @IsOptional()
  @IsEnum(IRBStatus)
  irbStatus?: IRBStatus;

  @IsOptional()
  @IsInt()
  accessDurationMonths?: number;

  @IsOptional()
  @IsBoolean()
  agreementSigned?: boolean;
}

/**
 * DTO for admin approval decision
 */
export class ApproveResearchRequestDto {
  @IsEnum(['APPROVE', 'APPROVE_WITH_CONDITIONS', 'REJECT', 'REQUEST_MORE_INFO'])
  decision: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  conditions?: string;

  @IsOptional()
  @IsInt()
  reducedAccessDuration?: number; // Admin can reduce duration

  @IsOptional()
  excludedFields?: string[]; // Admin can exclude certain fields
}
