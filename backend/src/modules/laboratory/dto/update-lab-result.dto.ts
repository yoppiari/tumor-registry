import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { LabResultStatus } from './create-lab-result.dto';

export class UpdateLabResultDto {
  @ApiPropertyOptional({ description: 'Test result value' })
  @IsOptional()
  @IsString()
  result?: string;

  @ApiPropertyOptional({ description: 'Normal range for this test' })
  @IsOptional()
  @IsString()
  normalRange?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ enum: LabResultStatus, description: 'Status of the test result' })
  @IsOptional()
  @IsEnum(LabResultStatus)
  status?: LabResultStatus;

  @ApiPropertyOptional({ description: 'Additional notes or comments' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Date when test was performed' })
  @IsOptional()
  @IsDateString()
  performedAt?: string;
}
