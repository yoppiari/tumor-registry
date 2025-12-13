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

export class CreatePatientDto {
  // Section 1: Center & Pathology Type
  @ApiProperty({ description: 'Center ID where patient is registered' })
  @IsString()
  centerId: string;

  @ApiPropertyOptional({ enum: PATHOLOGY_TYPES, example: 'bone_tumor' })
  @IsOptional()
  @IsString()
  @IsIn(PATHOLOGY_TYPES)
  pathologyType?: string;

  // Section 2: Patient Identity
  @ApiProperty({ example: 'MR-2025-00001' })
  @IsString()
  @Length(1, 50)
  medicalRecordNumber: string;

  @ApiProperty({ example: '3173051234567890', description: 'Indonesian National ID (16 digits)' })
  @IsString()
  @Matches(/^\d{16}$/, { message: 'NIK must be 16 digits' })
  nik: string;

  @ApiProperty({ example: 'Ahmad Sudarsono' })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({ example: '1985-05-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  placeOfBirth?: string;

  @ApiProperty({ enum: GENDERS, example: 'MALE' })
  @IsString()
  @IsIn(GENDERS)
  gender: string;

  @ApiPropertyOptional({ enum: BLOOD_TYPES, example: 'O_POSITIVE' })
  @IsOptional()
  @IsString()
  @IsIn(BLOOD_TYPES)
  bloodType?: string;

  @ApiPropertyOptional({ enum: RELIGIONS, example: 'Islam' })
  @IsOptional()
  @IsString()
  @IsIn(RELIGIONS)
  religion?: string;

  @ApiPropertyOptional({ enum: MARITAL_STATUSES, example: 'MARRIED' })
  @IsOptional()
  @IsString()
  @IsIn(MARITAL_STATUSES)
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ enum: EDUCATION_LEVELS, example: 'S1' })
  @IsOptional()
  @IsString()
  @IsIn(EDUCATION_LEVELS)
  education?: string;

  @ApiPropertyOptional({ example: '+628123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'patient@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Jakarta Selatan' })
  @IsOptional()
  @IsString()
  regency?: string;

  @ApiPropertyOptional({ example: 'Kebayoran Baru' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Senayan' })
  @IsOptional()
  @IsString()
  village?: string;

  @ApiPropertyOptional({ example: '12190' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    type: 'object',
    example: { name: 'Siti Aminah', relationship: 'Wife', phone: '+628987654321' }
  })
  @IsOptional()
  emergencyContact?: any;

  // Section 3: Clinical Data
  @ApiPropertyOptional({ example: 'Nyeri dan benjolan di paha kanan' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional({ example: '2025-10-01' })
  @IsOptional()
  @IsDateString()
  onsetDate?: string;

  @ApiPropertyOptional({ example: 6, description: 'Duration of symptoms in months' })
  @IsOptional()
  @IsInt()
  @Min(0)
  symptomDuration?: number;

  @ApiPropertyOptional({
    example: '{"pain": true, "swelling": true, "mass": true, "pathologicalFracture": false, "functionalImpairment": true}'
  })
  @IsOptional()
  @IsString()
  presentingSymptoms?: string;

  @ApiPropertyOptional({ example: 8.5, description: 'Tumor size in cm' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tumorSizeAtPresentation?: number;

  @ApiPropertyOptional({ example: 'Father had bone cancer' })
  @IsOptional()
  @IsString()
  familyHistoryCancer?: string;

  @ApiPropertyOptional({ description: 'Tumor syndrome ID if applicable' })
  @IsOptional()
  @IsString()
  tumorSyndromeId?: string;

  @ApiPropertyOptional({ example: 80, description: 'Karnofsky Performance Score (0-100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  karnofskysScore?: number;

  // Section 4: Diagnostic Investigations
  @ApiPropertyOptional({ example: '2025-11-15' })
  @IsOptional()
  @IsDateString()
  biopsyDate?: string;

  @ApiPropertyOptional({ enum: BIOPSY_TYPES, example: 'Core needle' })
  @IsOptional()
  @IsString()
  @IsIn(BIOPSY_TYPES)
  biopsyType?: string;

  @ApiPropertyOptional({ example: 'High-grade osteosarcoma' })
  @IsOptional()
  @IsString()
  biopsyResult?: string;

  @ApiPropertyOptional({
    example: '{"xray": true, "ct": true, "mri": true, "boneScan": false, "petCt": true}'
  })
  @IsOptional()
  @IsString()
  imagingStudies?: string;

  // Section 5: Diagnosis & Location
  @ApiPropertyOptional({ description: 'WHO Bone Tumor Classification ID' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.pathologyType === 'bone_tumor')
  whoBoneTumorId?: string;

  @ApiPropertyOptional({ description: 'WHO Soft Tissue Tumor Classification ID' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.pathologyType === 'soft_tissue_tumor')
  whoSoftTissueTumorId?: string;

  @ApiPropertyOptional({ description: 'Bone Location ID (for bone tumors)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.pathologyType === 'bone_tumor')
  boneLocationId?: string;

  @ApiPropertyOptional({ description: 'Soft Tissue Location ID (for soft tissue tumors)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.pathologyType === 'soft_tissue_tumor')
  softTissueLocationId?: string;

  @ApiPropertyOptional({ enum: TUMOR_GRADES, example: 'High-grade (G2)' })
  @IsOptional()
  @IsString()
  @IsIn(TUMOR_GRADES)
  histopathologyGrade?: string;

  @ApiPropertyOptional({ example: 'Conventional osteoblastic osteosarcoma' })
  @IsOptional()
  @IsString()
  histopathologyDetails?: string;

  // Section 6: Staging
  @ApiPropertyOptional({ enum: ENNEKING_STAGES, example: 'IIB' })
  @IsOptional()
  @IsString()
  @IsIn(ENNEKING_STAGES)
  ennekingStage?: string;

  @ApiPropertyOptional({ enum: AJCC_STAGES, example: 'IIB' })
  @IsOptional()
  @IsString()
  @IsIn(AJCC_STAGES)
  ajccStage?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  metastasisPresent?: boolean;

  @ApiPropertyOptional({ example: 'Lung metastasis (3 nodules)' })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.metastasisPresent === true)
  metastasisSites?: string;

  // Status flags
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
