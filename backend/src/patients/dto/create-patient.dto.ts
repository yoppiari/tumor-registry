import { IsString, IsEmail, IsDate, IsEnum, IsOptional, IsObject, ValidateNested, IsArray, IsPhoneNumber, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Address validation
export class AddressDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Street address' })
  street?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Village/Kelurahan' })
  village?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'District/Kecamatan' })
  district?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'City/Kabupaten' })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Province' })
  province?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}$/, { message: 'Postal code must be 5 digits' })
  @ApiPropertyOptional({ description: '5-digit postal code' })
  postalCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Country (default: Indonesia)' })
  country?: string;
}

// Emergency Contact validation
export class EmergencyContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ description: 'Emergency contact name' })
  name: string;

  @IsEnum(['spouse', 'parent', 'child', 'sibling', 'other', 'friend'])
  @ApiProperty({ enum: ['spouse', 'parent', 'child', 'sibling', 'other', 'friend'], description: 'Relationship to patient' })
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other' | 'friend';

  @IsString()
  @IsPhoneNumber('ID')
  @ApiProperty({ description: 'Emergency contact phone number (Indonesian format)' })
  phone: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Emergency contact address' })
  address?: string;
}

// Cancer Diagnosis validation
export class CancerDiagnosisDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Primary cancer site' })
  primarySite: string;

  @IsEnum(['left', 'right', 'bilateral', 'midline', 'unknown'])
  @ApiProperty({ enum: ['left', 'right', 'bilateral', 'midline', 'unknown'], description: 'Laterality' })
  laterality: 'left' | 'right' | 'bilateral' | 'midline' | 'unknown';

  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Morphology (ICD-O code)' })
  morphology: string;

  @IsEnum(['benign', 'borderline', 'invasive', 'in_situ'])
  @ApiProperty({ enum: ['benign', 'borderline', 'invasive', 'in_situ'], description: 'Tumor behavior' })
  behavior: 'benign' | 'borderline' | 'invasive' | 'in_situ';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Grade of differentiation' })
  grade?: string;
}

// TNM Classification validation
export class TNMClassificationDto {
  @IsString()
  @Matches(/^T[0-4][a-c]?$/, { message: 'T classification must be valid format (e.g., T1, T2a, T3b)' })
  @ApiProperty({ description: 'Tumor size/extent (T classification)' })
  t: string;

  @IsString()
  @Matches(/^N[0-3][a-c]?$/, { message: 'N classification must be valid format (e.g., N0, N1, N2a)' })
  @ApiProperty({ description: 'Lymph node involvement (N classification)' })
  n: string;

  @IsString()
  @Matches(/^M[0-1]$/, { message: 'M classification must be M0 or M1' })
  @ApiProperty({ description: 'Metastasis (M classification)' })
  m: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Clinical stage' })
  clinicalStage?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Pathological stage' })
  pathologicalStage?: string;
}

// Molecular Marker validation
export class MolecularMarkerDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Marker name (e.g., HER2, ER, PR)' })
  name: string;

  @IsEnum(['positive', 'negative', 'unknown'])
  @ApiProperty({ enum: ['positive', 'negative', 'unknown'], description: 'Test result' })
  result: 'positive' | 'negative' | 'unknown';

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'Test date', type: 'string', format: 'date' })
  testDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Test methodology' })
  methodology?: string;
}

// Main Create Patient DTO
export class CreatePatientDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9\-\/]+$/, { message: 'Medical record number can only contain letters, numbers, hyphens, and slashes' })
  @ApiProperty({ description: 'Medical record number (No. RM)', example: 'RM20240001' })
  medicalRecordNumber: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{16}$/, { message: 'Identity number must be 16 digits' })
  @ApiPropertyOptional({ description: '16-digit NIK', example: '3201011234560001' })
  identityNumber?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ description: 'Patient full name', example: 'John Doe' })
  name: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: 'Date of birth', type: 'string', format: 'date' })
  dateOfBirth: Date;

  @IsEnum(['male', 'female'])
  @ApiProperty({ enum: ['male', 'female'], description: 'Gender' })
  gender: 'male' | 'female';

  @IsOptional()
  @IsEnum(['A', 'B', 'AB', 'O'])
  @ApiPropertyOptional({ enum: ['A', 'B', 'AB', 'O'], description: 'Blood type' })
  bloodType?: 'A' | 'B' | 'AB' | 'O';

  @IsOptional()
  @IsEnum(['positive', 'negative'])
  @ApiPropertyOptional({ enum: ['positive', 'negative'], description: 'Rh factor' })
  rhFactor?: 'positive' | 'negative';

  @IsOptional()
  @IsString()
  @IsPhoneNumber('ID')
  @ApiPropertyOptional({ description: 'Phone number (Indonesian format)', example: '+62812345678' })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'Email address', example: 'patient@example.com' })
  email?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({ type: AddressDto, description: 'Patient address' })
  address: AddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  @ApiProperty({ type: EmergencyContactDto, description: 'Emergency contact information' })
  emergencyContact: EmergencyContactDto;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'Occupation', example: 'Teacher' })
  occupation?: string;

  @IsOptional()
  @IsEnum(['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'])
  @ApiPropertyOptional({
    enum: ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'],
    description: 'Education level'
  })
  educationLevel?: 'SD' | 'SMP' | 'SMA' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3';

  @IsOptional()
  @IsEnum(['single', 'married', 'divorced', 'widowed'])
  @ApiPropertyOptional({
    enum: ['single', 'married', 'divorced', 'widowed'],
    description: 'Marital status'
  })
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';

  @IsOptional()
  @IsEnum(['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'other'])
  @ApiPropertyOptional({
    enum: ['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'other'],
    description: 'Religion'
  })
  religion?: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu' | 'other';

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CancerDiagnosisDto)
  @ApiPropertyOptional({ type: CancerDiagnosisDto, description: 'Cancer diagnosis information' })
  primaryCancerDiagnosis?: CancerDiagnosisDto;

  @IsOptional()
  @IsEnum(['I', 'II', 'III', 'IV'])
  @ApiPropertyOptional({ enum: ['I', 'II', 'III', 'IV'], description: 'Cancer stage' })
  cancerStage?: 'I' | 'II' | 'III' | 'IV';

  @IsOptional()
  @IsEnum(['G1', 'G2', 'G3', 'G4'])
  @ApiPropertyOptional({ enum: ['G1', 'G2', 'G3', 'G4'], description: 'Cancer grade' })
  cancerGrade?: 'G1' | 'G2' | 'G3' | 'G4';

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TNMClassificationDto)
  @ApiPropertyOptional({ type: TNMClassificationDto, description: 'TNM classification' })
  tnmClassification?: TNMClassificationDto;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ description: 'Histology', example: 'Adenocarcinoma' })
  histology?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MolecularMarkerDto)
  @ApiPropertyOptional({ type: [MolecularMarkerDto], description: 'Molecular markers' })
  molecularMarkers?: MolecularMarkerDto[];

  @IsEnum(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'])
  @ApiProperty({
    enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
    description: 'Treatment status'
  })
  treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'Date of diagnosis', type: 'string', format: 'date' })
  dateOfDiagnosis?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'Date of first visit', type: 'string', format: 'date' })
  dateOfFirstVisit?: Date;

  @IsString()
  @ApiProperty({ description: 'Treatment center ID' })
  treatmentCenter: string;
}