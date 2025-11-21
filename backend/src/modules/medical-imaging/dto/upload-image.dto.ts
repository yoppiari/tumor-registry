import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MedicalImageType {
  HISTOLOGY = 'HISTOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  CLINICAL_PHOTO = 'CLINICAL_PHOTO',
  PATHOLOGY = 'PATHOLOGY',
  ENDOSCOPY = 'ENDOSCOPY',
  ULTRASOUND = 'ULTRASOUND',
  CT_SCAN = 'CT_SCAN',
  MRI = 'MRI',
  XRAY = 'XRAY',
  PET_SCAN = 'PET_SCAN',
  MAMMOGRAPHY = 'MAMMOGRAPHY',
  OTHER = 'OTHER',
}

export enum ImageCategory {
  HISTOLOGY = 'HISTOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  CLINICAL = 'CLINICAL',
  PATHOLOGY = 'PATHOLOGY',
  DIAGNOSTIC = 'DIAGNOSTIC',
  SURGICAL = 'SURGICAL',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  OTHER = 'OTHER',
}

export class UploadImageDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiPropertyOptional({ description: 'Related medical record ID' })
  @IsOptional()
  @IsString()
  recordId?: string;

  @ApiProperty({ enum: MedicalImageType })
  @IsEnum(MedicalImageType)
  imageType: MedicalImageType;

  @ApiProperty({ enum: ImageCategory })
  @IsEnum(ImageCategory)
  category: ImageCategory;

  @ApiPropertyOptional({ description: 'Image description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Clinical findings' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ description: 'Body part imaged' })
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional({ description: 'Imaging modality' })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiPropertyOptional({ description: 'Study date' })
  @IsOptional()
  @IsDateString()
  studyDate?: string;

  @ApiPropertyOptional({ description: 'Series number' })
  @IsOptional()
  @IsString()
  seriesNumber?: string;

  @ApiPropertyOptional({ description: 'Instance number' })
  @IsOptional()
  @IsString()
  instanceNumber?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Is DICOM format' })
  @IsOptional()
  @IsBoolean()
  isDicom?: boolean;

  @ApiPropertyOptional({ description: 'DICOM metadata', type: Object })
  @IsOptional()
  dicomMetadata?: any;

  @ApiPropertyOptional({ description: 'Image annotations', type: Object })
  @IsOptional()
  annotations?: any;
}
