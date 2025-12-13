import { IsString, IsEnum, IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFHIRResourceDto {
  @ApiProperty({
    description: 'FHIR resource type',
    enum: ['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport', 'Organization', 'Practitioner', 'ServiceRequest'],
    example: 'Patient'
  })
  @IsEnum(['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport', 'Organization', 'Practitioner', 'ServiceRequest'])
  resourceType: 'Patient' | 'Observation' | 'Condition' | 'Procedure' | 'Medication' | 'Encounter' | 'DiagnosticReport' | 'Organization' | 'Practitioner' | 'ServiceRequest';

  @ApiPropertyOptional({
    description: 'FHIR version',
    example: 'R4'
  })
  @IsOptional()
  @IsString()
  fhirVersion?: string;

  @ApiProperty({
    description: 'API endpoint',
    example: 'https://api.example.com/fhir'
  })
  @IsString()
  apiEndpoint: string;

  @ApiPropertyOptional({
    description: 'Resource ID',
    example: 'patient-123'
  })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiPropertyOptional({
    description: 'Version ID',
    example: '1'
  })
  @IsOptional()
  @IsString()
  versionId?: string;

  @ApiProperty({
    description: 'Source system',
    example: 'EHR-System'
  })
  @IsString()
  sourceSystem: string;

  @ApiProperty({
    description: 'FHIR resource object',
    example: {
      resourceType: 'Patient',
      id: 'patient-123',
      identifier: [{ system: 'urn:mrn', value: 'MRN12345' }],
      name: [{ family: 'Doe', given: ['John'] }]
    }
  })
  @IsObject()
  resource: any;

  @ApiPropertyOptional({
    description: 'FHIR extensions',
    type: Array
  })
  @IsOptional()
  @IsArray()
  extensions?: any[];

  @ApiPropertyOptional({
    description: 'FHIR identifiers',
    type: Array
  })
  @IsOptional()
  @IsArray()
  identifiers?: any[];
}
