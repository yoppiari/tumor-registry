import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicationType, PublicationStatus, PeerReviewStatus } from '@prisma/client';

export class CreatePublicationDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  researchRequestId: string;

  @ApiProperty({ description: 'Publication title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Publication abstract' })
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiProperty({ description: 'Authors (comma-separated or JSON)' })
  @IsString()
  authors: string;

  @ApiPropertyOptional({ description: 'Journal name' })
  @IsOptional()
  @IsString()
  journal?: string;

  @ApiPropertyOptional({ description: 'Publication date' })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @ApiPropertyOptional({ description: 'Volume' })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({ description: 'Issue' })
  @IsOptional()
  @IsString()
  issue?: string;

  @ApiPropertyOptional({ description: 'Pages' })
  @IsOptional()
  @IsString()
  pages?: string;

  @ApiPropertyOptional({ description: 'DOI' })
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional({ description: 'PubMed ID' })
  @IsOptional()
  @IsString()
  pmid?: string;

  @ApiProperty({ enum: PublicationType, description: 'Publication type' })
  @IsEnum(PublicationType)
  publicationType: PublicationType;

  @ApiPropertyOptional({ enum: PublicationStatus, description: 'Publication status', default: 'DRAFT' })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @ApiPropertyOptional({ enum: PeerReviewStatus, description: 'Peer review status', default: 'PENDING' })
  @IsOptional()
  @IsEnum(PeerReviewStatus)
  peerReviewStatus?: PeerReviewStatus;

  @ApiPropertyOptional({ description: 'Citation count', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  citationCount?: number;

  @ApiPropertyOptional({ description: 'Download count', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  downloadCount?: number;

  @ApiPropertyOptional({ description: 'Is open access?', default: false })
  @IsOptional()
  @IsBoolean()
  openAccess?: boolean;

  @ApiPropertyOptional({ description: 'License information' })
  @IsOptional()
  @IsString()
  license?: string;

  @ApiPropertyOptional({ description: 'Keywords (comma-separated)' })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ description: 'Funding acknowledged?', default: false })
  @IsOptional()
  @IsBoolean()
  fundingAcknowledged?: boolean;

  @ApiPropertyOptional({ description: 'Data availability statement' })
  @IsOptional()
  @IsString()
  dataAvailability?: string;

  @ApiPropertyOptional({ description: 'Ethical considerations' })
  @IsOptional()
  @IsString()
  ethicalConsiderations?: string;

  @ApiPropertyOptional({ description: 'Study limitations' })
  @IsOptional()
  @IsString()
  limitations?: string;

  @ApiPropertyOptional({ description: 'Conflicts of interest' })
  @IsOptional()
  @IsString()
  conflictsOfInterest?: string;
}

export class UpdatePublicationDto {
  @ApiPropertyOptional({ description: 'Publication title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Publication abstract' })
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiPropertyOptional({ description: 'Authors' })
  @IsOptional()
  @IsString()
  authors?: string;

  @ApiPropertyOptional({ description: 'Journal name' })
  @IsOptional()
  @IsString()
  journal?: string;

  @ApiPropertyOptional({ description: 'Publication date' })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @ApiPropertyOptional({ description: 'Volume' })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({ description: 'Issue' })
  @IsOptional()
  @IsString()
  issue?: string;

  @ApiPropertyOptional({ description: 'Pages' })
  @IsOptional()
  @IsString()
  pages?: string;

  @ApiPropertyOptional({ description: 'DOI' })
  @IsOptional()
  @IsString()
  doi?: string;

  @ApiPropertyOptional({ description: 'PubMed ID' })
  @IsOptional()
  @IsString()
  pmid?: string;

  @ApiPropertyOptional({ enum: PublicationType, description: 'Publication type' })
  @IsOptional()
  @IsEnum(PublicationType)
  publicationType?: PublicationType;

  @ApiPropertyOptional({ enum: PublicationStatus, description: 'Publication status' })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @ApiPropertyOptional({ enum: PeerReviewStatus, description: 'Peer review status' })
  @IsOptional()
  @IsEnum(PeerReviewStatus)
  peerReviewStatus?: PeerReviewStatus;

  @ApiPropertyOptional({ description: 'Citation count' })
  @IsOptional()
  @IsInt()
  @Min(0)
  citationCount?: number;

  @ApiPropertyOptional({ description: 'Download count' })
  @IsOptional()
  @IsInt()
  @Min(0)
  downloadCount?: number;

  @ApiPropertyOptional({ description: 'Is open access?' })
  @IsOptional()
  @IsBoolean()
  openAccess?: boolean;

  @ApiPropertyOptional({ description: 'License information' })
  @IsOptional()
  @IsString()
  license?: string;

  @ApiPropertyOptional({ description: 'Keywords' })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiPropertyOptional({ description: 'Funding acknowledged?' })
  @IsOptional()
  @IsBoolean()
  fundingAcknowledged?: boolean;

  @ApiPropertyOptional({ description: 'Data availability statement' })
  @IsOptional()
  @IsString()
  dataAvailability?: string;

  @ApiPropertyOptional({ description: 'Ethical considerations' })
  @IsOptional()
  @IsString()
  ethicalConsiderations?: string;

  @ApiPropertyOptional({ description: 'Study limitations' })
  @IsOptional()
  @IsString()
  limitations?: string;

  @ApiPropertyOptional({ description: 'Conflicts of interest' })
  @IsOptional()
  @IsString()
  conflictsOfInterest?: string;
}
