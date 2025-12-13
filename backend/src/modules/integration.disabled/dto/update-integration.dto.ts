import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateIntegrationDto {
  @ApiProperty({ description: 'Integration name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Integration description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Configuration settings', required: false })
  @IsOptional()
  config?: any;

  @ApiProperty({ description: 'Enabled status', required: false })
  @IsOptional()
  enabled?: boolean;
}