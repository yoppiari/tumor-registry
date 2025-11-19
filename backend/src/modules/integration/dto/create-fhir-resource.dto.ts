import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateFHIRResourceDto {
  @ApiProperty({ description: 'FHIR resource type', enum: ['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport'] })
  @IsEnum(['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport'])
  @IsNotEmpty()
  resourceType: 'Patient' | 'Observation' | 'Condition' | 'Procedure' | 'Medication' | 'Encounter' | 'DiagnosticReport';

  @ApiProperty({ description: 'FHIR resource data' })
  @IsNotEmpty()
  resource: any;

  @ApiProperty({ description: 'Resource ID', required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Resource version', required: false })
  @IsString()
  @IsOptional()
  version?: string;
}