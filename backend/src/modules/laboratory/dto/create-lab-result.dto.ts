import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';

export enum LabTestType {
  TUMOR_MARKER = 'TUMOR_MARKER',
  CBC = 'CBC',
  CHEMISTRY = 'CHEMISTRY',
  COAGULATION = 'COAGULATION',
  URINALYSIS = 'URINALYSIS',
  GENETIC = 'GENETIC',
  MOLECULAR = 'MOLECULAR',
  OTHER = 'OTHER',
}

export enum LabResultStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ABNORMAL = 'ABNORMAL',
  CRITICAL = 'CRITICAL',
  CANCELLED = 'CANCELLED',
}

export class CreateLabResultDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiProperty({ enum: LabTestType, description: 'Type of laboratory test' })
  @IsEnum(LabTestType)
  testType: LabTestType;

  @ApiProperty({ description: 'Name of the test', example: 'Alkaline Phosphatase (ALP)' })
  @IsString()
  testName: string;

  @ApiProperty({ description: 'Test result value', example: '150' })
  @IsString()
  result: string;

  @ApiPropertyOptional({ description: 'Normal range for this test', example: '30-120 U/L' })
  @IsOptional()
  @IsString()
  normalRange?: string;

  @ApiPropertyOptional({ description: 'Unit of measurement', example: 'U/L' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ enum: LabResultStatus, description: 'Status of the test result' })
  @IsEnum(LabResultStatus)
  status: LabResultStatus;

  @ApiPropertyOptional({ description: 'Additional notes or comments' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'User ID of who ordered the test' })
  @IsString()
  orderedBy: string;

  @ApiPropertyOptional({ description: 'Date when test was performed' })
  @IsOptional()
  @IsDateString()
  performedAt?: string;
}
