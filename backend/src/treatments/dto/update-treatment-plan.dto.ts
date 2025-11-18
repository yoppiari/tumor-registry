import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsArray, IsEnum, IsOptional, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTreatmentPlanDto {
  @ApiPropertyOptional({ description: 'Plan name' })
  @IsString()
  @IsOptional()
  planName?: string;

  @ApiPropertyOptional({ description: 'Expected end date', example: '2024-06-15' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expectedEndDate?: Date;

  @ApiPropertyOptional({ description: 'Total number of cycles', example: 6 })
  @IsNumber()
  @IsOptional()
  totalCycles?: number;

  @ApiPropertyOptional({
    description: 'Treatment status',
    enum: ['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']
  })
  @IsEnum(['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled'])
  @IsOptional()
  status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Treatment phase',
    enum: ['initial', 'consolidation', 'maintenance', 'follow_up']
  })
  @IsEnum(['initial', 'consolidation', 'maintenance', 'follow_up'])
  @IsOptional()
  phase?: 'initial' | 'consolidation' | 'maintenance' | 'follow_up';

  @ApiPropertyOptional({ description: 'Actual end date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  actualEndDate?: Date;

  @ApiPropertyOptional({ description: 'Response assessment', type: UpdateResponseAssessmentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateResponseAssessmentDto)
  @IsOptional()
  responseAssessment?: UpdateResponseAssessmentDto;
}

export class UpdateResponseAssessmentDto {
  @ApiPropertyOptional({ description: 'Assessment date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  assessmentDate?: Date;

  @ApiPropertyOptional({
    description: 'Response criteria',
    enum: ['RECIST_1.1', 'WHO', 'PERCIST', 'clinical']
  })
  @IsEnum(['RECIST_1.1', 'WHO', 'PERCIST', 'clinical'])
  @IsOptional()
  responseCriteria?: 'RECIST_1.1' | 'WHO' | 'PERCIST' | 'clinical';

  @ApiPropertyOptional({
    description: 'Overall response',
    enum: ['CR', 'PR', 'SD', 'PD']
  })
  @IsEnum(['CR', 'PR', 'SD', 'PD'])
  @IsOptional()
  overallResponse?: 'CR' | 'PR' | 'SD' | 'PD';

  @ApiPropertyOptional({ description: 'Target lesion response' })
  @IsString()
  @IsOptional()
  targetLesionResponse?: string;

  @ApiPropertyOptional({ description: 'Non-target lesion response' })
  @IsString()
  @IsOptional()
  nonTargetLesionResponse?: string;

  @ApiPropertyOptional({ description: 'New lesions detected' })
  @IsOptional()
  newLesions?: boolean;

  @ApiPropertyOptional({ description: 'Progression date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  progressionDate?: Date;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Assessed by' })
  @IsString()
  @IsOptional()
  assessedBy?: string;
}