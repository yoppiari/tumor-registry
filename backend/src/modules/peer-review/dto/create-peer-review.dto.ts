import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PeerReviewEntity {
  PATIENT_RECORD = 'PATIENT_RECORD',
  DIAGNOSIS = 'DIAGNOSIS',
  TREATMENT_PLAN = 'TREATMENT_PLAN',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  LABORATORY_RESULT = 'LABORATORY_RESULT',
  RADIOLOGY_REPORT = 'RADIOLOGY_REPORT',
  PATHOLOGY_REPORT = 'PATHOLOGY_REPORT',
  CASE_REVIEW = 'CASE_REVIEW',
  RESEARCH_DATA = 'RESEARCH_DATA',
  DATA_ENTRY = 'DATA_ENTRY',
}

export enum PeerReviewType {
  QUALITY_CHECK = 'QUALITY_CHECK',
  DATA_VALIDATION = 'DATA_VALIDATION',
  CLINICAL_REVIEW = 'CLINICAL_REVIEW',
  COMPLETENESS_CHECK = 'COMPLETENESS_CHECK',
  ACCURACY_VERIFICATION = 'ACCURACY_VERIFICATION',
  PROTOCOL_COMPLIANCE = 'PROTOCOL_COMPLIANCE',
  DOCUMENTATION_REVIEW = 'DOCUMENTATION_REVIEW',
  PEER_CONSULTATION = 'PEER_CONSULTATION',
}

export enum ReviewPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export class CreatePeerReviewDto {
  @ApiProperty({ enum: PeerReviewEntity })
  @IsEnum(PeerReviewEntity)
  entityType: PeerReviewEntity;

  @ApiProperty({ description: 'Entity ID being reviewed' })
  @IsString()
  entityId: string;

  @ApiPropertyOptional({ enum: PeerReviewType, default: 'QUALITY_CHECK' })
  @IsOptional()
  @IsEnum(PeerReviewType)
  reviewType?: PeerReviewType;

  @ApiPropertyOptional({ description: 'User ID to assign the review to' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ enum: ReviewPriority, default: 'MEDIUM' })
  @IsOptional()
  @IsEnum(ReviewPriority)
  priority?: ReviewPriority;

  @ApiPropertyOptional({ description: 'Due date for review' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ description: 'Review title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Context data snapshot', type: Object })
  @IsOptional()
  context?: any;

  @ApiPropertyOptional({ description: 'Review checklist items', type: Object })
  @IsOptional()
  checklist?: any;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
