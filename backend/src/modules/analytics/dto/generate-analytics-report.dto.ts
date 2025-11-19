import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class GenerateAnalyticsReportDto {
  @ApiProperty({ description: 'Report type', enum: ['summary', 'detailed', 'trends'] })
  @IsEnum(['summary', 'detailed', 'trends'])
  @IsNotEmpty()
  type: 'summary' | 'detailed' | 'trends';

  @ApiProperty({ description: 'Date range start' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'Date range end' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Report format', enum: ['pdf', 'excel', 'csv'] })
  @IsEnum(['pdf', 'excel', 'csv'])
  @IsOptional()
  format?: 'pdf' | 'excel' | 'csv';
}