import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MedicalSpecialty, ReviewPriority } from './create-case-review.dto';

export class AssignReviewDto {
  @ApiProperty({ description: 'User ID to assign the review to' })
  @IsString()
  assignedTo: string;

  @ApiPropertyOptional({ enum: MedicalSpecialty })
  @IsOptional()
  @IsEnum(MedicalSpecialty)
  specialty?: MedicalSpecialty;

  @ApiPropertyOptional({ description: 'Role of the assignee' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ enum: ReviewPriority, default: 'MEDIUM' })
  @IsOptional()
  @IsEnum(ReviewPriority)
  priority?: ReviewPriority;

  @ApiPropertyOptional({ description: 'Due date for this assignment' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Assignment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
