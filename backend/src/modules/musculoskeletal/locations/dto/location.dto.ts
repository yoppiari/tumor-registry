import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Bone Location DTOs
export class BoneLocationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ description: 'Level: 1=Region, 2=Bone, 3=Segment' })
  level: number;

  @ApiProperty()
  region: string;

  @ApiPropertyOptional()
  boneName?: string;

  @ApiPropertyOptional()
  segment?: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ type: [BoneLocationDto] })
  children?: BoneLocationDto[];
}

// Soft Tissue Location DTOs
export class SoftTissueLocationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  anatomicalRegion: string;

  @ApiProperty()
  specificLocation: string;

  @ApiProperty()
  sortOrder: number;
}

// Query DTOs
export class GetBoneLocationsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by level (1, 2, or 3)' })
  @IsOptional()
  @IsInt()
  level?: number;

  @ApiPropertyOptional({ description: 'Filter by region' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: 'Include children in response', default: false })
  @IsOptional()
  @IsBoolean()
  includeChildren?: boolean;
}

export class GetSoftTissueLocationsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by anatomical region' })
  @IsOptional()
  @IsString()
  anatomicalRegion?: string;
}
