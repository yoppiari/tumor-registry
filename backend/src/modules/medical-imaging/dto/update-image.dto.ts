import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ImageQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  STANDARD = 'STANDARD',
  POOR = 'POOR',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export class UpdateImageDto {
  @ApiPropertyOptional({ description: 'Image description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Clinical findings' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ description: 'Body part imaged' })
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Image annotations', type: Object })
  @IsOptional()
  annotations?: any;

  @ApiPropertyOptional({ enum: ImageQuality })
  @IsOptional()
  @IsEnum(ImageQuality)
  quality?: ImageQuality;
}
