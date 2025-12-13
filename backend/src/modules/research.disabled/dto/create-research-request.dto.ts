import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString, Min, Max, ArrayNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudyType, ResearchPriority, DataAccessLevel, CollaborationRole } from '@prisma/client';

// Declare CreateCollaborationDto first since it's referenced by CreateResearchRequestDto
export class CreateCollaborationDto {
  @ApiProperty({ description: 'Collaborator user ID' })
  @IsString()
  @IsNotEmpty()
  collaboratorId: string;

  @ApiProperty({ enum: CollaborationRole, description: 'Collaboration role' })
  @IsEnum(CollaborationRole)
  role: CollaborationRole;

  @ApiPropertyOptional({ description: 'Responsibilities' })
  @IsString()
  @IsOptional()
  responsibilities?: string;

  @ApiPropertyOptional({ description: 'Affiliation' })
  @IsString()
  @IsOptional()
  affiliation?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Expertise' })
  @IsString()
  @IsOptional()
  expertise?: string;

  @ApiPropertyOptional({ description: 'Conflict of interest' })
  @IsString()
  @IsOptional()
  conflictOfInterest?: string;

  @ApiPropertyOptional({ enum: DataAccessLevel, description: 'Data access level' })
  @IsEnum(DataAccessLevel)
  @IsOptional()
  dataAccessLevel?: DataAccessLevel;
}

// Now declare CreateResearchRequestDto after CreateCollaborationDto
export class CreateResearchRequestDto {
  @ApiProperty({ description: 'Research title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed research description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Principal investigator ID' })
  @IsString()
  @IsNotEmpty()
  principalInvestigatorId: string;

  @ApiProperty({ enum: StudyType, description: 'Type of study' })
  @IsEnum(StudyType)
  studyType: StudyType;

  @ApiProperty({ description: 'Research objectives' })
  @IsString()
  @IsNotEmpty()
  objectives: string;

  @ApiProperty({ description: 'Research methodology' })
  @IsString()
  @IsNotEmpty()
  methodology: string;

  @ApiProperty({ description: 'Inclusion criteria' })
  @IsString()
  @IsNotEmpty()
  inclusionCriteria: string;

  @ApiProperty({ description: 'Exclusion criteria' })
  @IsString()
  @IsNotEmpty()
  exclusionCriteria: string;

  @ApiProperty({ description: 'Sample size' })
  @IsInt()
  @Min(1)
  sampleSize: number;

  @ApiProperty({ description: 'Study duration in months' })
  @IsInt()
  @Min(1)
  @Max(120)
  duration: number;

  @ApiProperty({ description: 'Whether ethics approval is required' })
  @IsBoolean()
  requiresEthicsApproval: boolean;

  @ApiProperty({ description: 'Data requested (JSON format)' })
  @IsString()
  @IsNotEmpty()
  dataRequested: string;

  @ApiPropertyOptional({ description: 'Confidentiality requirements' })
  @IsString()
  @IsOptional()
  confidentialityRequirements?: string;

  @ApiPropertyOptional({ description: 'Funding source' })
  @IsString()
  @IsOptional()
  fundingSource?: string;

  @ApiPropertyOptional({ description: 'Expected outcomes' })
  @IsString()
  @IsOptional()
  expectedOutcomes?: string;

  @ApiPropertyOptional({ description: 'Risk assessment' })
  @IsString()
  @IsOptional()
  riskAssessment?: string;

  @ApiPropertyOptional({ description: 'Data retention period in months' })
  @IsInt()
  @Min(1)
  @Max(360)
  @IsOptional()
  dataRetentionPeriod?: number;

  @ApiPropertyOptional({ enum: ResearchPriority, description: 'Research priority' })
  @IsEnum(ResearchPriority)
  @IsOptional()
  priority?: ResearchPriority;

  @ApiPropertyOptional({ description: 'Collaborator IDs (JSON array)' })
  @IsString()
  @IsOptional()
  collaborators?: string;

  @ApiPropertyOptional({ type: [CreateCollaborationDto], description: 'Collaborations' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCollaborationDto)
  @IsOptional()
  collaborationDetails?: CreateCollaborationDto[];
}

export class UpdateResearchRequestDto {
  @ApiPropertyOptional({ description: 'Research title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Research description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Research objectives' })
  @IsString()
  @IsOptional()
  objectives?: string;

  @ApiPropertyOptional({ description: 'Research methodology' })
  @IsString()
  @IsOptional()
  methodology?: string;

  @ApiPropertyOptional({ description: 'Inclusion criteria' })
  @IsString()
  @IsOptional()
  inclusionCriteria?: string;

  @ApiPropertyOptional({ description: 'Exclusion criteria' })
  @IsString()
  @IsOptional()
  exclusionCriteria?: string;

  @ApiPropertyOptional({ description: 'Sample size' })
  @IsInt()
  @Min(1)
  @IsOptional()
  sampleSize?: number;

  @ApiPropertyOptional({ description: 'Study duration in months' })
  @IsInt()
  @Min(1)
  @Max(120)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Expected outcomes' })
  @IsString()
  @IsOptional()
  expectedOutcomes?: string;

  @ApiPropertyOptional({ description: 'Risk assessment' })
  @IsString()
  @IsOptional()
  riskAssessment?: string;

  @ApiPropertyOptional({ description: 'Data retention period in months' })
  @IsInt()
  @Min(1)
  @Max(360)
  @IsOptional()
  dataRetentionPeriod?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}