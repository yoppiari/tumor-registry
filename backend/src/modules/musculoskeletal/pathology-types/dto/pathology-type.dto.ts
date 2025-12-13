import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PathologyTypeDto {
  @ApiProperty({ description: 'Pathology type ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Unique code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Pathology type name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Sort order' })
  @IsInt()
  sortOrder: number;
}

export class CreatePathologyTypeDto {
  @ApiProperty({ description: 'Unique code', example: 'bone_tumor' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Pathology type name', example: 'Tumor Tulang (Bone Tumor)' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdatePathologyTypeDto {
  @ApiPropertyOptional({ description: 'Pathology type name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
