import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateExecutiveDashboardDto {
  @ApiProperty({ description: 'Dashboard name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Dashboard description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Dashboard widgets' })
  @IsArray()
  @IsOptional()
  widgets?: any[];
}