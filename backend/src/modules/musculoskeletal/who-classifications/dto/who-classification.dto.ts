import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Bone Tumor Classification DTOs
export class WhoBoneTumorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  subcategory: string;

  @ApiProperty()
  diagnosis: string;

  @ApiPropertyOptional()
  icdO3Code?: string;

  @ApiPropertyOptional()
  pageReference?: string;

  @ApiProperty()
  isMalignant: boolean;

  @ApiProperty()
  sortOrder: number;
}

// Soft Tissue Tumor Classification DTOs
export class WhoSoftTissueTumorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  subcategory: string;

  @ApiProperty()
  diagnosis: string;

  @ApiPropertyOptional()
  icdO3Code?: string;

  @ApiProperty()
  isMalignant: boolean;

  @ApiProperty()
  sortOrder: number;
}

// Query DTOs
export class GetBoneTumorsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by subcategory' })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Filter by malignancy' })
  @IsOptional()
  @IsBoolean()
  isMalignant?: boolean;

  @ApiPropertyOptional({ description: 'Search by diagnosis name' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class GetSoftTissueTumorsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by subcategory' })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiPropertyOptional({ description: 'Filter by malignancy' })
  @IsOptional()
  @IsBoolean()
  isMalignant?: boolean;

  @ApiPropertyOptional({ description: 'Search by diagnosis name' })
  @IsOptional()
  @IsString()
  search?: string;
}
