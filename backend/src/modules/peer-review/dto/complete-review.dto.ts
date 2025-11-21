import { IsEnum, IsOptional, IsNumber, IsBoolean, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReviewRecommendation {
  APPROVE = 'APPROVE',
  APPROVE_WITH_CHANGES = 'APPROVE_WITH_CHANGES',
  MINOR_REVISION = 'MINOR_REVISION',
  MAJOR_REVISION = 'MAJOR_REVISION',
  REJECT = 'REJECT',
  ESCALATE = 'ESCALATE',
  NEEDS_DISCUSSION = 'NEEDS_DISCUSSION',
}

export class CompleteReviewDto {
  @ApiPropertyOptional({ description: 'Quality score 0-100' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiProperty({ enum: ReviewRecommendation })
  @IsEnum(ReviewRecommendation)
  recommendation: ReviewRecommendation;

  @ApiPropertyOptional({ description: 'Does this require changes', default: false })
  @IsOptional()
  @IsBoolean()
  requiresChanges?: boolean;

  @ApiPropertyOptional({ description: 'Review findings', type: Object })
  @IsOptional()
  findings?: any;

  @ApiPropertyOptional({ description: 'Reason for rejection (if applicable)' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ description: 'Time spent in minutes' })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}
