import { IsString, IsOptional, IsDateString, IsInt, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCitationDto {
  @ApiProperty({ description: 'Publication ID being cited' })
  @IsString()
  publicationId: string;

  @ApiProperty({ description: 'Citing publication title' })
  @IsString()
  citingTitle: string;

  @ApiPropertyOptional({ description: 'Citing authors' })
  @IsOptional()
  @IsString()
  citingAuthors?: string;

  @ApiPropertyOptional({ description: 'Citing journal' })
  @IsOptional()
  @IsString()
  citingJournal?: string;

  @ApiPropertyOptional({ description: 'Citation date' })
  @IsOptional()
  @IsDateString()
  citationDate?: string;

  @ApiPropertyOptional({ description: 'DOI of citing publication' })
  @IsOptional()
  @IsString()
  citingDoi?: string;

  @ApiPropertyOptional({ description: 'Citation type (e.g., direct, supportive, critical)' })
  @IsOptional()
  @IsString()
  citationType?: string;

  @ApiPropertyOptional({ description: 'Citation context' })
  @IsOptional()
  @IsString()
  citationContext?: string;

  @ApiPropertyOptional({ description: 'Source of citation data' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class BulkCitationImportDto {
  @ApiProperty({ description: 'Publication ID' })
  @IsString()
  publicationId: string;

  @ApiPropertyOptional({ description: 'External API source (e.g., CrossRef, PubMed, Scopus)' })
  @IsOptional()
  @IsString()
  externalSource?: string;

  @ApiPropertyOptional({ description: 'Force refresh from external API', default: false })
  @IsOptional()
  forceRefresh?: boolean;
}

export class CitationAnalysisDto {
  @ApiProperty({ description: 'Publication ID' })
  @IsString()
  publicationId: string;

  @ApiPropertyOptional({ description: 'Start date for analysis' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for analysis' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Include citation trends?', default: true })
  @IsOptional()
  includeTrends?: boolean;

  @ApiPropertyOptional({ description: 'Include co-citation analysis?', default: false })
  @IsOptional()
  includeCoCitation?: boolean;
}
