import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean, IsDateString, Min, Max, ArrayNotEmpty, ValidateNested, IsArray, IsEmail, IsUUID, Matches, IsUrl, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StudyType, ResearchPriority, DataAccessLevel, CollaborationRole } from '@prisma/client';

export class EnhancedCreateResearchRequestDto {
  @ApiProperty({ description: 'Research title' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 200, { message: 'Title must be between 10 and 200 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_.,:;()]+$/, { message: 'Title contains invalid characters' })
  title: string;

  @ApiProperty({ description: 'Detailed research description' })
  @IsString()
  @IsNotEmpty()
  @Length(50, 2000, { message: 'Description must be between 50 and 2000 characters' })
  description: string;

  @ApiProperty({ description: 'Principal investigator ID' })
  @IsUUID()
  @IsNotEmpty()
  principalInvestigatorId: string;

  @ApiProperty({ enum: StudyType, description: 'Type of study' })
  @IsEnum(StudyType)
  studyType: StudyType;

  @ApiProperty({ description: 'Research objectives' })
  @IsString()
  @IsNotEmpty()
  @Length(20, 1000, { message: 'Objectives must be between 20 and 1000 characters' })
  objectives: string;

  @ApiProperty({ description: 'Research methodology' })
  @IsString()
  @IsNotEmpty()
  @Length(50, 1500, { message: 'Methodology must be between 50 and 1500 characters' })
  methodology: string;

  @ApiProperty({ description: 'Inclusion criteria' })
  @IsString()
  @IsNotEmpty()
  @Length(20, 1000, { message: 'Inclusion criteria must be between 20 and 1000 characters' })
  inclusionCriteria: string;

  @ApiProperty({ description: 'Exclusion criteria' })
  @IsString()
  @IsNotEmpty()
  @Length(20, 1000, { message: 'Exclusion criteria must be between 20 and 1000 characters' })
  exclusionCriteria: string;

  @ApiProperty({ description: 'Sample size' })
  @IsInt()
  @Min(1)
  @Max(1000000, { message: 'Sample size cannot exceed 1,000,000' })
  sampleSize: number;

  @ApiProperty({ description: 'Study duration in months' })
  @IsInt()
  @Min(1)
  @Max(120, { message: 'Study duration cannot exceed 120 months (10 years)' })
  duration: number;

  @ApiProperty({ description: 'Whether ethics approval is required' })
  @IsBoolean()
  requiresEthicsApproval: boolean;

  @ApiProperty({ description: 'Data requested (structured JSON format)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\s*\{[\s\S]*\}\s*$/, { message: 'Data requested must be valid JSON format' })
  dataRequested: string;

  @ApiPropertyOptional({ description: 'Confidentiality requirements' })
  @IsString()
  @IsOptional()
  @Length(10, 500, { message: 'Confidentiality requirements must be between 10 and 500 characters' })
  confidentialityRequirements?: string;

  @ApiPropertyOptional({ description: 'Funding source' })
  @IsString()
  @IsOptional()
  @Length(5, 200, { message: 'Funding source must be between 5 and 200 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_.,]+$/, { message: 'Funding source contains invalid characters' })
  fundingSource?: string;

  @ApiPropertyOptional({ description: 'Expected outcomes' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Expected outcomes must be between 20 and 1000 characters' })
  expectedOutcomes?: string;

  @ApiPropertyOptional({ description: 'Risk assessment' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Risk assessment must be between 20 and 1000 characters' })
  riskAssessment?: string;

  @ApiPropertyOptional({ description: 'Data retention period in months' })
  @IsInt()
  @Min(1)
  @Max(360, { message: 'Data retention period cannot exceed 360 months (30 years)' })
  @IsOptional()
  dataRetentionPeriod?: number;

  @ApiPropertyOptional({ enum: ResearchPriority, description: 'Research priority' })
  @IsEnum(ResearchPriority)
  @IsOptional()
  priority?: ResearchPriority;

  @ApiPropertyOptional({ description: 'Collaborator IDs (JSON array)' })
  @IsString()
  @IsOptional()
  @Matches(/^\s*\[[\s\S]*\]\s*$/, { message: 'Collaborators must be valid JSON array format' })
  collaborators?: string;

  @ApiPropertyOptional({ description: 'Contact email for research' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Research website' })
  @IsUrl()
  @IsOptional()
  researchWebsite?: string;

  @ApiPropertyOptional({ description: 'Keywords for research categorization' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9\s\-_,]+$/, { message: 'Keywords contain invalid characters' })
  keywords?: string;

  @ApiPropertyOptional({ type: () => [EnhancedCreateCollaborationDto], description: 'Collaborations' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnhancedCreateCollaborationDto)
  @IsOptional()
  collaborationDetails?: EnhancedCreateCollaborationDto[];
}

export class EnhancedCreateCollaborationDto {
  @ApiProperty({ description: 'Collaborator user ID' })
  @IsUUID()
  @IsNotEmpty()
  collaboratorId: string;

  @ApiProperty({ enum: CollaborationRole, description: 'Collaboration role' })
  @IsEnum(CollaborationRole)
  role: CollaborationRole;

  @ApiPropertyOptional({ description: 'Responsibilities' })
  @IsString()
  @IsOptional()
  @Length(10, 500, { message: 'Responsibilities must be between 10 and 500 characters' })
  responsibilities?: string;

  @ApiPropertyOptional({ description: 'Affiliation' })
  @IsString()
  @IsOptional()
  @Length(5, 200, { message: 'Affiliation must be between 5 and 200 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_.,()]+$/, { message: 'Affiliation contains invalid characters' })
  affiliation?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone' })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[\d\s\-\(\)]+$/, { message: 'Phone number format is invalid' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Expertise' })
  @IsString()
  @IsOptional()
  @Length(10, 300, { message: 'Expertise must be between 10 and 300 characters' })
  expertise?: string;

  @ApiPropertyOptional({ description: 'Conflict of interest' })
  @IsString()
  @IsOptional()
  @Length(10, 1000, { message: 'Conflict of interest must be between 10 and 1000 characters' })
  conflictOfInterest?: string;

  @ApiPropertyOptional({ enum: DataAccessLevel, description: 'Data access level' })
  @IsEnum(DataAccessLevel)
  @IsOptional()
  dataAccessLevel?: DataAccessLevel;
}

export class EnhancedUpdateResearchRequestDto {
  @ApiPropertyOptional({ description: 'Research title' })
  @IsString()
  @IsOptional()
  @Length(10, 200, { message: 'Title must be between 10 and 200 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_.,:;()]+$/, { message: 'Title contains invalid characters' })
  title?: string;

  @ApiPropertyOptional({ description: 'Research description' })
  @IsString()
  @IsOptional()
  @Length(50, 2000, { message: 'Description must be between 50 and 2000 characters' })
  description?: string;

  @ApiPropertyOptional({ description: 'Research objectives' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Objectives must be between 20 and 1000 characters' })
  objectives?: string;

  @ApiPropertyOptional({ description: 'Research methodology' })
  @IsString()
  @IsOptional()
  @Length(50, 1500, { message: 'Methodology must be between 50 and 1500 characters' })
  methodology?: string;

  @ApiPropertyOptional({ description: 'Inclusion criteria' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Inclusion criteria must be between 20 and 1000 characters' })
  inclusionCriteria?: string;

  @ApiPropertyOptional({ description: 'Exclusion criteria' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Exclusion criteria must be between 20 and 1000 characters' })
  exclusionCriteria?: string;

  @ApiPropertyOptional({ description: 'Sample size' })
  @IsInt()
  @Min(1)
  @Max(1000000, { message: 'Sample size cannot exceed 1,000,000' })
  @IsOptional()
  sampleSize?: number;

  @ApiPropertyOptional({ description: 'Study duration in months' })
  @IsInt()
  @Min(1)
  @Max(120, { message: 'Study duration cannot exceed 120 months (10 years)' })
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Expected outcomes' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Expected outcomes must be between 20 and 1000 characters' })
  expectedOutcomes?: string;

  @ApiPropertyOptional({ description: 'Risk assessment' })
  @IsString()
  @IsOptional()
  @Length(20, 1000, { message: 'Risk assessment must be between 20 and 1000 characters' })
  riskAssessment?: string;

  @ApiPropertyOptional({ description: 'Data retention period in months' })
  @IsInt()
  @Min(1)
  @Max(360, { message: 'Data retention period cannot exceed 360 months (30 years)' })
  @IsOptional()
  dataRetentionPeriod?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  @Length(5, 1000, { message: 'Notes must be between 5 and 1000 characters' })
  notes?: string;
}

export class EnhancedSearchResearchDto {
  @ApiPropertyOptional({ description: 'Search term for title/description' })
  @IsString()
  @IsOptional()
  @Length(3, 100, { message: 'Search term must be between 3 and 100 characters' })
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z_]+$/, { message: 'Status must be uppercase with underscores' })
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by study type' })
  @IsEnum(StudyType)
  @IsOptional()
  studyType?: StudyType;

  @ApiPropertyOptional({ description: 'Filter by principal investigator ID' })
  @IsUUID()
  @IsOptional()
  principalInvestigatorId?: string;

  @ApiPropertyOptional({ description: 'Filter by center ID' })
  @IsUUID()
  @IsOptional()
  centerId?: string;

  @ApiPropertyOptional({ description: 'Start date filter' })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'End date filter' })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Page number' })
  @IsInt()
  @Min(1)
  @Max(1000, { message: 'Page number cannot exceed 1000' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Results per page' })
  @IsInt()
  @Min(1)
  @Max(100, { message: 'Results per page cannot exceed 100' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z_]+$/, { message: 'Sort field must contain only letters and underscores' })
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsString()
  @IsOptional()
  @Matches(/^(asc|desc)$/i, { message: 'Sort order must be asc or desc' })
  sortOrder?: string;
}

export class EnhancedApprovalDto {
  @ApiProperty({ description: 'Approver ID' })
  @IsUUID()
  @IsNotEmpty()
  approvedBy: string;

  @ApiPropertyOptional({ description: 'Approval comments' })
  @IsString()
  @IsOptional()
  @Length(10, 1000, { message: 'Comments must be between 10 and 1000 characters' })
  comments?: string;

  @ApiPropertyOptional({ description: 'Conditions for approval' })
  @IsString()
  @IsOptional()
  @Length(10, 1000, { message: 'Conditions must be between 10 and 1000 characters' })
  conditions?: string;

  @ApiPropertyOptional({ description: 'Ethics number (if applicable)' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z0-9\-_\/]+$/, { message: 'Ethics number contains invalid characters' })
  ethicsNumber?: string;
}