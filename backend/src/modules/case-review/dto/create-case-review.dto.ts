import { IsString, IsEnum, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CaseType {
  UNUSUAL_PRESENTATION = 'UNUSUAL_PRESENTATION',
  RARE_DIAGNOSIS = 'RARE_DIAGNOSIS',
  COMPLEX_COMORBIDITY = 'COMPLEX_COMORBIDITY',
  TREATMENT_CHALLENGE = 'TREATMENT_CHALLENGE',
  DIAGNOSTIC_UNCERTAINTY = 'DIAGNOSTIC_UNCERTAINTY',
  ADVERSE_EVENT = 'ADVERSE_EVENT',
  EXCEPTIONAL_OUTCOME = 'EXCEPTIONAL_OUTCOME',
  RESEARCH_INTEREST = 'RESEARCH_INTEREST',
  QUALITY_CONCERN = 'QUALITY_CONCERN',
  OTHER = 'OTHER',
}

export enum CaseComplexity {
  SIMPLE = 'SIMPLE',
  STANDARD = 'STANDARD',
  MODERATE = 'MODERATE',
  COMPLEX = 'COMPLEX',
  HIGHLY_COMPLEX = 'HIGHLY_COMPLEX',
}

export enum MedicalSpecialty {
  ONCOLOGY = 'ONCOLOGY',
  HEMATOLOGY = 'HEMATOLOGY',
  SURGICAL_ONCOLOGY = 'SURGICAL_ONCOLOGY',
  RADIATION_ONCOLOGY = 'RADIATION_ONCOLOGY',
  PATHOLOGY = 'PATHOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  INTERNAL_MEDICINE = 'INTERNAL_MEDICINE',
  PEDIATRICS = 'PEDIATRICS',
  GYNECOLOGY = 'GYNECOLOGY',
  UROLOGY = 'UROLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  PULMONOLOGY = 'PULMONOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  CARDIOLOGY = 'CARDIOLOGY',
  OTHER = 'OTHER',
}

export enum ReviewPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export class CreateCaseReviewDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiProperty({ enum: CaseType })
  @IsEnum(CaseType)
  caseType: CaseType;

  @ApiPropertyOptional({ enum: CaseComplexity, default: 'STANDARD' })
  @IsOptional()
  @IsEnum(CaseComplexity)
  complexity?: CaseComplexity;

  @ApiProperty({ description: 'Reason for flagging this case' })
  @IsString()
  flagReason: string;

  @ApiProperty({ description: 'Detailed description of the case' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Clinical data snapshot', type: Object })
  clinicalData: any;

  @ApiPropertyOptional({ description: 'Diagnosis IDs related to this case', type: [String] })
  @IsOptional()
  @IsArray()
  diagnosisIds?: string[];

  @ApiPropertyOptional({ description: 'Findings', type: Object })
  @IsOptional()
  findings?: any;

  @ApiPropertyOptional({ description: 'Recommended actions', type: Object })
  @IsOptional()
  recommendedActions?: any;

  @ApiPropertyOptional({ enum: MedicalSpecialty })
  @IsOptional()
  @IsEnum(MedicalSpecialty)
  specialty?: MedicalSpecialty;

  @ApiPropertyOptional({ enum: ReviewPriority, default: 'MEDIUM' })
  @IsOptional()
  @IsEnum(ReviewPriority)
  priority?: ReviewPriority;

  @ApiPropertyOptional({ description: 'Due date for review' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
