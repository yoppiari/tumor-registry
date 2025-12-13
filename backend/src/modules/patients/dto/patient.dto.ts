import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  IsJSON,
  Length,
  Matches
} from 'class-validator';

// Enums
const GENDERS = ['MALE', 'FEMALE'];
const BLOOD_TYPES = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
const MARITAL_STATUSES = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
const PATHOLOGY_TYPES = ['bone_tumor', 'soft_tissue_tumor', 'metastatic_bone_disease'];
const BIOPSY_TYPES = ['Incisional', 'Excisional', 'Core needle', 'Fine needle aspiration'];
const EDUCATION_LEVELS = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
const RELIGIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

export class PatientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  medicalRecordNumber: string;

  @ApiProperty()
  nik: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiPropertyOptional()
  placeOfBirth?: string;

  @ApiProperty({ enum: GENDERS })
  gender: string;

  @ApiPropertyOptional({ enum: BLOOD_TYPES })
  bloodType?: string;

  @ApiPropertyOptional({ enum: RELIGIONS })
  religion?: string;

  @ApiPropertyOptional({ enum: MARITAL_STATUSES })
  maritalStatus?: string;

  @ApiPropertyOptional()
  occupation?: string;

  @ApiPropertyOptional({ enum: EDUCATION_LEVELS })
  education?: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  regency?: string;

  @ApiPropertyOptional()
  district?: string;

  @ApiPropertyOptional()
  village?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional({ type: 'object', description: 'Emergency contact information (JSON)' })
  emergencyContact?: any;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ default: false })
  isDeceased: boolean;

  @ApiPropertyOptional()
  dateOfDeath?: Date;

  @ApiPropertyOptional()
  causeOfDeath?: string;

  @ApiProperty()
  centerId: string;

  // Section 1: Pathology Type
  @ApiPropertyOptional({ enum: PATHOLOGY_TYPES })
  pathologyType?: string;

  // Section 3: Clinical Data
  @ApiPropertyOptional()
  chiefComplaint?: string;

  @ApiPropertyOptional()
  onsetDate?: Date;

  @ApiPropertyOptional()
  symptomDuration?: number;

  @ApiPropertyOptional({ description: 'Presenting symptoms (JSON)' })
  presentingSymptoms?: string;

  @ApiPropertyOptional()
  tumorSizeAtPresentation?: number;

  @ApiPropertyOptional()
  familyHistoryCancer?: string;

  @ApiPropertyOptional()
  tumorSyndromeId?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  karnofskysScore?: number;

  // Section 4: Diagnostic Investigations
  @ApiPropertyOptional()
  biopsyDate?: Date;

  @ApiPropertyOptional({ enum: BIOPSY_TYPES })
  biopsyType?: string;

  @ApiPropertyOptional()
  biopsyResult?: string;

  @ApiPropertyOptional({ description: 'Imaging studies (JSON)' })
  imagingStudies?: string;

  // Section 5: Diagnosis & Location
  @ApiPropertyOptional()
  whoBoneTumorId?: string;

  @ApiPropertyOptional()
  whoSoftTissueTumorId?: string;

  @ApiPropertyOptional()
  boneLocationId?: string;

  @ApiPropertyOptional()
  softTissueLocationId?: string;

  @ApiPropertyOptional()
  histopathologyGrade?: string;

  @ApiPropertyOptional()
  histopathologyDetails?: string;

  // Section 6: Staging
  @ApiPropertyOptional()
  ennekingStage?: string;

  @ApiPropertyOptional()
  ajccStage?: string;

  @ApiPropertyOptional()
  metastasisPresent?: boolean;

  @ApiPropertyOptional()
  metastasisSites?: string;

  // Timestamps
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
