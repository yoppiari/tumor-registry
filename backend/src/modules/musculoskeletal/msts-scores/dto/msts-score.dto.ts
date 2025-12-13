import { IsString, IsInt, IsDateString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MstsScoreDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiPropertyOptional()
  followUpVisitId?: string;

  @ApiProperty({ description: 'Pain score (0-5 points)', minimum: 0, maximum: 5 })
  pain: number;

  @ApiProperty({ description: 'Function score (0-5 points)', minimum: 0, maximum: 5 })
  function: number;

  @ApiProperty({ description: 'Emotional acceptance score (0-5 points)', minimum: 0, maximum: 5 })
  emotionalAcceptance: number;

  @ApiProperty({ description: 'Supports score (0-5 points)', minimum: 0, maximum: 5 })
  supports: number;

  @ApiProperty({ description: 'Walking score (0-5 points)', minimum: 0, maximum: 5 })
  walking: number;

  @ApiProperty({ description: 'Gait score (0-5 points)', minimum: 0, maximum: 5 })
  gait: number;

  @ApiProperty({ description: 'Total score (0-30 points)', minimum: 0, maximum: 30 })
  totalScore: number;

  @ApiProperty()
  assessmentDate: Date;

  @ApiProperty()
  assessedBy: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateMstsScoreDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiPropertyOptional({ description: 'Follow-up visit ID if part of follow-up' })
  @IsOptional()
  @IsString()
  followUpVisitId?: string;

  @ApiProperty({ description: 'Pain score (0-5)', minimum: 0, maximum: 5, example: 4 })
  @IsInt()
  @Min(0)
  @Max(5)
  pain: number;

  @ApiProperty({ description: 'Function score (0-5)', minimum: 0, maximum: 5, example: 3 })
  @IsInt()
  @Min(0)
  @Max(5)
  function: number;

  @ApiProperty({ description: 'Emotional acceptance (0-5)', minimum: 0, maximum: 5, example: 4 })
  @IsInt()
  @Min(0)
  @Max(5)
  emotionalAcceptance: number;

  @ApiProperty({ description: 'Supports score (0-5)', minimum: 0, maximum: 5, example: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  supports: number;

  @ApiProperty({ description: 'Walking score (0-5)', minimum: 0, maximum: 5, example: 3 })
  @IsInt()
  @Min(0)
  @Max(5)
  walking: number;

  @ApiProperty({ description: 'Gait score (0-5)', minimum: 0, maximum: 5, example: 3 })
  @IsInt()
  @Min(0)
  @Max(5)
  gait: number;

  @ApiProperty({ description: 'Assessment date', example: '2025-12-11' })
  @IsDateString()
  assessmentDate: string;

  @ApiProperty({ description: 'Assessed by (user ID or name)' })
  @IsString()
  assessedBy: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMstsScoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  pain?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  function?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  emotionalAcceptance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  supports?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  walking?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  gait?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  assessmentDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assessedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
