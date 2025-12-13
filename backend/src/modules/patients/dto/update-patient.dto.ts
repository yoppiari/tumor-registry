import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  IsNumber,
  IsIn,
  Min,
  Max,
  Length,
  Matches,
  ValidateIf
} from 'class-validator';

const GENDERS = ['MALE', 'FEMALE'];
const BLOOD_TYPES = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
const MARITAL_STATUSES = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
const PATHOLOGY_TYPES = ['bone_tumor', 'soft_tissue_tumor', 'metastatic_bone_disease'];
const BIOPSY_TYPES = ['Incisional', 'Excisional', 'Core needle', 'Fine needle aspiration'];
const EDUCATION_LEVELS = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
const RELIGIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const ENNEKING_STAGES = ['IA', 'IB', 'IIA', 'IIB', 'III'];
const AJCC_STAGES = ['IA', 'IB', 'IIA', 'IIB', 'III', 'IVA', 'IVB'];
const TUMOR_GRADES = ['Low-grade (G1)', 'High-grade (G2)', 'Undifferentiated (G3)'];

export class UpdatePatientDto {
  // Section 1: Pathology Type
  @ApiPropertyOptional({ enum: PATHOLOGY_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(PATHOLOGY_TYPES)
  pathologyType?: string;

  // Section 2: Patient Identity
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeOfBirth?: string;

  @ApiPropertyOptional({ enum: GENDERS })
  @IsOptional()
  @IsString()
  @IsIn(GENDERS)
  gender?: string;

  @ApiPropertyOptional({ enum: BLOOD_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(BLOOD_TYPES)
  bloodType?: string;

  @ApiPropertyOptional({ enum: RELIGIONS })
  @IsOptional()
  @IsString()
  @IsIn(RELIGIONS)
  religion?: string;

  @ApiPropertyOptional({ enum: MARITAL_STATUSES })
  @IsOptional()
  @IsString()
  @IsIn(MARITAL_STATUSES)
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ enum: EDUCATION_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(EDUCATION_LEVELS)
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  regency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  emergencyContact?: any;

  // Section 3: Clinical Data
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  symptomDuration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  presentingSymptoms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  tumorSizeAtPresentation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  familyHistoryCancer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tumorSyndromeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  karnofskysScore?: number;

  // Section 4: Diagnostic Investigations
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  biopsyDate?: string;

  @ApiPropertyOptional({ enum: BIOPSY_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(BIOPSY_TYPES)
  biopsyType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biopsyResult?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagingStudies?: string;

  // Section 5: Diagnosis & Location
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whoBoneTumorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whoSoftTissueTumorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  boneLocationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  softTissueLocationId?: string;

  @ApiPropertyOptional({ enum: TUMOR_GRADES })
  @IsOptional()
  @IsString()
  @IsIn(TUMOR_GRADES)
  histopathologyGrade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  histopathologyDetails?: string;

  // Section 6: Staging
  @ApiPropertyOptional({ enum: ENNEKING_STAGES })
  @IsOptional()
  @IsString()
  @IsIn(ENNEKING_STAGES)
  ennekingStage?: string;

  @ApiPropertyOptional({ enum: AJCC_STAGES })
  @IsOptional()
  @IsString()
  @IsIn(AJCC_STAGES)
  ajccStage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  metastasisPresent?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metastasisSites?: string;

  // Status flags
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDeceased?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfDeath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  causeOfDeath?: string;
}
