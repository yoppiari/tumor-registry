import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TumorSyndromeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  geneticMarker?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  associatedTumors?: string;
}

export class CreateTumorSyndromeDto {
  @ApiProperty({ example: 'Li-Fraumeni Syndrome' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'TP53' })
  @IsOptional()
  @IsString()
  geneticMarker?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  associatedTumors?: string;
}
