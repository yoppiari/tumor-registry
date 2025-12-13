import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsArray } from 'class-validator';

export enum BiopsyType {
  INCISIONAL = 'Incisional',
  EXCISIONAL = 'Excisional',
  CORE_NEEDLE = 'Core needle',
  FINE_NEEDLE_ASPIRATION = 'Fine needle aspiration',
  BONE_BIOPSY = 'Bone biopsy',
  SOFT_TISSUE_BIOPSY = 'Soft tissue biopsy',
}

export enum PathologyStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  AMENDED = 'AMENDED',
}

export enum TumorGrade {
  LOW_GRADE_G1 = 'Low-grade (G1)',
  HIGH_GRADE_G2 = 'High-grade (G2)',
  UNDIFFERENTIATED_G3 = 'Undifferentiated (G3)',
}

export class CreatePathologyReportDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiProperty({ description: 'Pathology report number/identifier' })
  @IsString()
  reportNumber: string;

  @ApiProperty({ enum: BiopsyType, description: 'Type of biopsy performed' })
  @IsEnum(BiopsyType)
  biopsyType: BiopsyType;

  @ApiProperty({ description: 'Date when biopsy was performed' })
  @IsDateString()
  biopsyDate: string;

  @ApiPropertyOptional({ description: 'Date when specimen was received' })
  @IsOptional()
  @IsDateString()
  specimenReceivedDate?: string;

  @ApiProperty({ description: 'Site/location where biopsy was taken', example: 'Right distal femur' })
  @IsString()
  specimenSite: string;

  @ApiPropertyOptional({ description: 'Description of the specimen' })
  @IsOptional()
  @IsString()
  specimenDescription?: string;

  @ApiProperty({ description: 'Gross description of the specimen' })
  @IsString()
  grossDescription: string;

  @ApiProperty({ description: 'Microscopic examination findings' })
  @IsString()
  microscopicDescription: string;

  @ApiProperty({ description: 'Final diagnosis' })
  @IsString()
  diagnosis: string;

  @ApiPropertyOptional({ enum: TumorGrade, description: 'Tumor histological grade' })
  @IsOptional()
  @IsEnum(TumorGrade)
  tumorGrade?: TumorGrade;

  @ApiPropertyOptional({ description: 'Mitosis count per 10 HPF' })
  @IsOptional()
  @IsString()
  mitosisCount?: string;

  @ApiPropertyOptional({ description: 'Percentage of necrosis', example: '20%' })
  @IsOptional()
  @IsString()
  necrosisPercentage?: string;

  @ApiPropertyOptional({ description: 'Tumor cellularity percentage', example: '80%' })
  @IsOptional()
  @IsString()
  cellularity?: string;

  @ApiPropertyOptional({ description: 'Immunohistochemistry findings' })
  @IsOptional()
  @IsString()
  immunohistochemistry?: string;

  @ApiPropertyOptional({ description: 'Molecular/genetic testing results' })
  @IsOptional()
  @IsString()
  molecularFindings?: string;

  @ApiPropertyOptional({ description: 'Margins status (for excisional biopsies)' })
  @IsOptional()
  @IsString()
  marginsStatus?: string;

  @ApiPropertyOptional({ description: 'Is malignant?' })
  @IsOptional()
  @IsBoolean()
  isMalignant?: boolean;

  @ApiProperty({ enum: PathologyStatus, description: 'Status of the pathology report' })
  @IsEnum(PathologyStatus)
  status: PathologyStatus;

  @ApiPropertyOptional({ description: 'Additional comments or notes' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ description: 'Pathologist ID who prepared the report' })
  @IsString()
  pathologistId: string;

  @ApiPropertyOptional({ description: 'Date when report was finalized' })
  @IsOptional()
  @IsDateString()
  reportDate?: string;

  @ApiPropertyOptional({ description: 'Special stains used', type: [String] })
  @IsOptional()
  @IsArray()
  specialStains?: string[];

  @ApiPropertyOptional({ description: 'IHC markers used', type: [String] })
  @IsOptional()
  @IsArray()
  ihcMarkers?: string[];
}
