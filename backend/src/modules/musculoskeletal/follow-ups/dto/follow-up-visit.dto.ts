import { IsString, IsInt, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FollowUpVisitDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty({ description: 'Visit number (1-14)', minimum: 1, maximum: 14 })
  visitNumber: number;

  @ApiProperty({ description: 'Scheduled visit date' })
  scheduledDate: Date;

  @ApiPropertyOptional({ description: 'Actual visit date' })
  actualDate?: Date;

  @ApiProperty({ description: 'Visit type', example: '3-month' })
  visitType: string;

  @ApiProperty({ description: 'Visit status', example: 'scheduled' })
  status: string;

  @ApiPropertyOptional({ description: 'Clinical status', example: 'NED' })
  clinicalStatus?: string;

  @ApiPropertyOptional()
  localRecurrence?: boolean;

  @ApiPropertyOptional()
  distantMetastasis?: boolean;

  @ApiPropertyOptional()
  metastasisSites?: string;

  @ApiPropertyOptional()
  currentTreatment?: string;

  @ApiPropertyOptional()
  mstsScoreId?: string;

  @ApiPropertyOptional({ description: 'Karnofsky Performance Score (0-100)' })
  karnofskyScore?: number;

  @ApiPropertyOptional()
  imagingPerformed?: string;

  @ApiPropertyOptional()
  imagingFindings?: string;

  @ApiPropertyOptional()
  labResults?: string;

  @ApiPropertyOptional()
  complications?: string;

  @ApiPropertyOptional()
  nextVisitDate?: Date;

  @ApiPropertyOptional()
  completedBy?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateFollowUpVisitDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty({ description: 'Visit number (1-14)', minimum: 1, maximum: 14, example: 1 })
  @IsInt()
  @Min(1)
  @Max(14)
  visitNumber: number;

  @ApiProperty({ example: '2026-03-11' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ example: '3-month', description: '3-month, 6-month, or annual' })
  @IsString()
  visitType: string;

  @ApiPropertyOptional({ example: '2026-03-11' })
  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @ApiPropertyOptional({ default: 'scheduled', description: 'scheduled, completed, missed, cancelled' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateFollowUpVisitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'NED, AWD, DOD, etc.' })
  @IsOptional()
  @IsString()
  clinicalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  localRecurrence?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  distantMetastasis?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metastasisSites?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentTreatment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mstsScoreId?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  karnofskyScore?: number;

  @ApiPropertyOptional({ description: 'X-ray, CT, MRI, Bone scan, PET-CT' })
  @IsOptional()
  @IsString()
  imagingPerformed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagingFindings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  labResults?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextVisitDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  completedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GenerateFollowUpScheduleDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiProperty({ description: 'Treatment completion date', example: '2025-12-11' })
  @IsDateString()
  treatmentCompletionDate: string;
}
