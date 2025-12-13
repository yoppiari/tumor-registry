import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  IsUrl,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateResearcherProfileDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Professional title (e.g., Dr., Prof.)' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Institution/University' })
  @IsString()
  @IsOptional()
  institution?: string;

  @ApiPropertyOptional({ description: 'Research interests', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  researchInterests?: string[];

  @ApiPropertyOptional({ description: 'Areas of expertise', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expertise?: string[];

  @ApiPropertyOptional({ description: 'Qualifications and degrees' })
  @IsString()
  @IsOptional()
  qualifications?: string;

  @ApiPropertyOptional({ description: 'Number of publications' })
  @IsInt()
  @Min(0)
  @IsOptional()
  publications?: number;

  @ApiPropertyOptional({ description: 'H-index' })
  @IsInt()
  @Min(0)
  @IsOptional()
  hIndex?: number;

  @ApiPropertyOptional({ description: 'Total citations' })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalCitations?: number;

  @ApiPropertyOptional({ description: 'ORCID ID' })
  @IsString()
  @IsOptional()
  orcidId?: string;

  @ApiPropertyOptional({ description: 'Google Scholar ID' })
  @IsString()
  @IsOptional()
  googleScholarId?: string;

  @ApiPropertyOptional({ description: 'ResearchGate ID' })
  @IsString()
  @IsOptional()
  researchGateId?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsUrl()
  @IsOptional()
  linkedInUrl?: string;

  @ApiPropertyOptional({ description: 'Biography' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'Make profile public', default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;

  @ApiPropertyOptional({ description: 'Available for collaboration', default: true })
  @IsBoolean()
  @IsOptional()
  isAvailableForCollab?: boolean = true;

  @ApiPropertyOptional({ description: 'Preferred collaboration types', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCollabTypes?: string[];

  @ApiPropertyOptional({ description: 'Languages spoken', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({ description: 'Timezone' })
  @IsString()
  @IsOptional()
  timezone?: string;
}

export class UpdateResearcherProfileDto {
  @ApiPropertyOptional({ description: 'Professional title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Institution/University' })
  @IsString()
  @IsOptional()
  institution?: string;

  @ApiPropertyOptional({ description: 'Research interests', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  researchInterests?: string[];

  @ApiPropertyOptional({ description: 'Areas of expertise', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expertise?: string[];

  @ApiPropertyOptional({ description: 'Qualifications and degrees' })
  @IsString()
  @IsOptional()
  qualifications?: string;

  @ApiPropertyOptional({ description: 'Number of publications' })
  @IsInt()
  @Min(0)
  @IsOptional()
  publications?: number;

  @ApiPropertyOptional({ description: 'H-index' })
  @IsInt()
  @Min(0)
  @IsOptional()
  hIndex?: number;

  @ApiPropertyOptional({ description: 'Total citations' })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalCitations?: number;

  @ApiPropertyOptional({ description: 'ORCID ID' })
  @IsString()
  @IsOptional()
  orcidId?: string;

  @ApiPropertyOptional({ description: 'Google Scholar ID' })
  @IsString()
  @IsOptional()
  googleScholarId?: string;

  @ApiPropertyOptional({ description: 'ResearchGate ID' })
  @IsString()
  @IsOptional()
  researchGateId?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsUrl()
  @IsOptional()
  linkedInUrl?: string;

  @ApiPropertyOptional({ description: 'Biography' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'Make profile public' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Available for collaboration' })
  @IsBoolean()
  @IsOptional()
  isAvailableForCollab?: boolean;

  @ApiPropertyOptional({ description: 'Preferred collaboration types', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCollabTypes?: string[];

  @ApiPropertyOptional({ description: 'Languages spoken', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({ description: 'Timezone' })
  @IsString()
  @IsOptional()
  timezone?: string;
}

export class CreateResearchProjectDto {
  @ApiPropertyOptional({ description: 'Associated research request ID' })
  @IsString()
  @IsOptional()
  researchRequestId?: string;

  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Project description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Project objectives' })
  @IsString()
  @IsOptional()
  objectives?: string;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Estimated end date' })
  @IsString()
  @IsOptional()
  estimatedEndDate?: string;

  @ApiPropertyOptional({ description: 'Funding source' })
  @IsString()
  @IsOptional()
  fundingSource?: string;

  @ApiPropertyOptional({ description: 'Total budget' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBudget?: number;

  @ApiPropertyOptional({ description: 'Ethics approval ID' })
  @IsString()
  @IsOptional()
  ethicsApprovalId?: string;

  @ApiPropertyOptional({ description: 'Project tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Project visibility', enum: ['PRIVATE', 'TEAM_ONLY', 'INSTITUTION', 'PUBLIC'], default: 'TEAM_ONLY' })
  @IsEnum(['PRIVATE', 'TEAM_ONLY', 'INSTITUTION', 'PUBLIC'])
  @IsOptional()
  visibility?: 'PRIVATE' | 'TEAM_ONLY' | 'INSTITUTION' | 'PUBLIC' = 'TEAM_ONLY';
}

export class UpdateResearchProjectDto {
  @ApiPropertyOptional({ description: 'Project name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Project objectives' })
  @IsString()
  @IsOptional()
  objectives?: string;

  @ApiPropertyOptional({ description: 'Project status', enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] })
  @IsEnum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

  @ApiPropertyOptional({ description: 'Start date' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Estimated end date' })
  @IsString()
  @IsOptional()
  estimatedEndDate?: string;

  @ApiPropertyOptional({ description: 'Funding source' })
  @IsString()
  @IsOptional()
  fundingSource?: string;

  @ApiPropertyOptional({ description: 'Total budget' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBudget?: number;

  @ApiPropertyOptional({ description: 'Ethics approval ID' })
  @IsString()
  @IsOptional()
  ethicsApprovalId?: string;

  @ApiPropertyOptional({ description: 'Project tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Project visibility', enum: ['PRIVATE', 'TEAM_ONLY', 'INSTITUTION', 'PUBLIC'] })
  @IsEnum(['PRIVATE', 'TEAM_ONLY', 'INSTITUTION', 'PUBLIC'])
  @IsOptional()
  visibility?: 'PRIVATE' | 'TEAM_ONLY' | 'INSTITUTION' | 'PUBLIC';
}

export class AddProjectMemberDto {
  @ApiProperty({ description: 'Researcher profile ID' })
  @IsString()
  researcherProfileId: string;

  @ApiProperty({ description: 'Member role', enum: ['LEAD', 'CO_LEAD', 'MEMBER', 'CONTRIBUTOR', 'OBSERVER'] })
  @IsEnum(['LEAD', 'CO_LEAD', 'MEMBER', 'CONTRIBUTOR', 'OBSERVER'])
  role: 'LEAD' | 'CO_LEAD' | 'MEMBER' | 'CONTRIBUTOR' | 'OBSERVER';

  @ApiPropertyOptional({ description: 'Custom permissions for this member' })
  @IsOptional()
  permissions?: any;
}

export class UpdateProjectMemberDto {
  @ApiPropertyOptional({ description: 'Member role', enum: ['LEAD', 'CO_LEAD', 'MEMBER', 'CONTRIBUTOR', 'OBSERVER'] })
  @IsEnum(['LEAD', 'CO_LEAD', 'MEMBER', 'CONTRIBUTOR', 'OBSERVER'])
  @IsOptional()
  role?: 'LEAD' | 'CO_LEAD' | 'MEMBER' | 'CONTRIBUTOR' | 'OBSERVER';

  @ApiPropertyOptional({ description: 'Member status', enum: ['INVITED', 'ACTIVE', 'INACTIVE', 'REMOVED'] })
  @IsEnum(['INVITED', 'ACTIVE', 'INACTIVE', 'REMOVED'])
  @IsOptional()
  status?: 'INVITED' | 'ACTIVE' | 'INACTIVE' | 'REMOVED';

  @ApiPropertyOptional({ description: 'Contribution level description' })
  @IsString()
  @IsOptional()
  contributionLevel?: string;

  @ApiPropertyOptional({ description: 'Custom permissions' })
  @IsOptional()
  permissions?: any;
}

export class CreateAnnotationDto {
  @ApiProperty({ description: 'Dataset type (e.g., patient, diagnosis)' })
  @IsString()
  datasetType: string;

  @ApiProperty({ description: 'Dataset record ID' })
  @IsString()
  datasetId: string;

  @ApiProperty({ description: 'Annotation type', enum: ['COMMENT', 'QUESTION', 'OBSERVATION', 'ISSUE', 'INSIGHT', 'TODO'] })
  @IsEnum(['COMMENT', 'QUESTION', 'OBSERVATION', 'ISSUE', 'INSIGHT', 'TODO'])
  annotationType: 'COMMENT' | 'QUESTION' | 'OBSERVATION' | 'ISSUE' | 'INSIGHT' | 'TODO';

  @ApiProperty({ description: 'Annotation content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Parent annotation ID (for threaded comments)' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Attachments' })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({ description: 'Mentioned user IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mentions?: string[];
}

export class UpdateAnnotationDto {
  @ApiPropertyOptional({ description: 'Annotation content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Is resolved' })
  @IsBoolean()
  @IsOptional()
  isResolved?: boolean;

  @ApiPropertyOptional({ description: 'Attachments' })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({ description: 'Mentioned user IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mentions?: string[];
}

export class FindExpertsDto {
  @ApiProperty({ description: 'Research area or topic' })
  @IsString()
  researchArea: string;

  @ApiPropertyOptional({ description: 'Additional keywords', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Minimum match score (0-100)', default: 50 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minMatchScore?: number = 50;

  @ApiPropertyOptional({ description: 'Maximum number of matches', default: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  maxResults?: number = 10;
}
