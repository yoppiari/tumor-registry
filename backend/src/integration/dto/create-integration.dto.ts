import { IsString, IsEnum, IsOptional, IsObject, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ExternalSystem,
  SystemConfiguration,
  AuthenticationConfig,
  FieldMapping,
  ValidationRule
} from '../interfaces/integration.interface';

export class CreateExternalSystemDto {
  @ApiProperty({
    description: 'Name of the external system',
    example: 'Hospital Information System'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of external system',
    enum: ['hl7', 'fhir', 'rest_api', 'database', 'file', 'websocket', 'mqtt', 'dicom'],
    example: 'hl7'
  })
  @IsEnum(['hl7', 'fhir', 'rest_api', 'database', 'file', 'websocket', 'mqtt', 'dicom'])
  type: 'hl7' | 'fhir' | 'rest_api' | 'database' | 'file' | 'websocket' | 'mqtt' | 'dicom';

  @ApiProperty({
    description: 'Vendor of the external system',
    example: 'Epic Systems'
  })
  @IsString()
  vendor: string;

  @ApiProperty({
    description: 'Version of the external system',
    example: 'v2.7'
  })
  @IsString()
  version: string;

  @ApiProperty({
    description: 'System configuration',
    type: 'object',
    example: {
      endpoint: 'https://api.example.com',
      protocol: 'https',
      port: 443,
      authentication: { type: 'bearer', credentials: { token: 'xxx' } },
      timeout: 30,
      retryAttempts: 3,
      retryDelay: 5,
      mapping: [],
      validation: []
    }
  })
  @IsObject()
  configuration: SystemConfiguration;
}

export class UpdateExternalSystemDto {
  @ApiPropertyOptional({
    description: 'Name of the external system',
    example: 'Updated Hospital Information System'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Vendor of the external system',
    example: 'Updated Vendor'
  })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional({
    description: 'Version of the external system',
    example: 'v3.0'
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: 'System status',
    enum: ['active', 'inactive', 'error', 'maintenance'],
    example: 'active'
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'error', 'maintenance'])
  status?: 'active' | 'inactive' | 'error' | 'maintenance';

  @ApiPropertyOptional({
    description: 'System configuration',
    type: 'object',
    example: {
      endpoint: 'https://api.example.com',
      protocol: 'https',
      port: 443,
      authentication: { type: 'bearer', credentials: { token: 'xxx' } },
      timeout: 30,
      retryAttempts: 3,
      retryDelay: 5,
      mapping: [],
      validation: []
    }
  })
  @IsOptional()
  @IsObject()
  configuration?: SystemConfiguration;
}

export class CreateHL7MessageDto {
  @ApiProperty({
    description: 'HL7 message type',
    example: 'ADT'
  })
  @IsString()
  messageType: string;

  @ApiProperty({
    description: 'HL7 trigger event',
    example: 'A01'
  })
  @IsOptional()
  @IsString()
  triggerEvent?: string;

  @ApiProperty({
    description: 'Message control ID',
    example: '12345'
  })
  @IsOptional()
  @IsString()
  messageControlId?: string;

  @ApiProperty({
    description: 'Processing ID',
    example: 'P'
  })
  @IsOptional()
  @IsString()
  processingId?: string;

  @ApiProperty({
    description: 'Version ID',
    example: '2.7'
  })
  @IsOptional()
  @IsString()
  versionId?: string;

  @ApiProperty({
    description: 'Sender system',
    example: 'HIS'
  })
  @IsString()
  sender: string;

  @ApiProperty({
    description: 'Receiver system',
    example: 'INAMSOS'
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    description: 'Raw HL7 message',
    example: 'MSH|^~\\&|HIS|INAMSOS|20240101120000||ADT^A01|12345|P|2.7|...'
  })
  @IsString()
  rawMessage: string;

  @ApiPropertyOptional({
    description: 'Sequence number',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Min(1)
  sequenceNumber?: number;

  @ApiPropertyOptional({
    description: 'Acceptance acknowledgment',
    example: 'AL'
  })
  @IsOptional()
  @IsString()
  acceptanceAcknowledgement?: string;

  @ApiPropertyOptional({
    description: 'Application acknowledgment',
    example: 'AL'
  })
  @IsOptional()
  @IsString()
  applicationAcknowledgement?: string;
}

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

export class CreateWorkflowDto {
  @ApiProperty({
    description: 'Workflow name',
    example: 'ADT to FHIR Patient Conversion'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Workflow description',
    example: 'Converts HL7 ADT messages to FHIR Patient resources'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Workflow type',
    enum: ['inbound', 'outbound', 'bi_directional'],
    example: 'inbound'
  })
  @IsEnum(['inbound', 'outbound', 'bi_directional'])
  type: 'inbound' | 'outbound' | 'bi_directional';

  @ApiProperty({
    description: 'Workflow trigger configuration',
    example: {
      type: 'event',
      condition: 'message.type == "ADT"'
    }
  })
  @IsObject()
  trigger: any;

  @ApiProperty({
    description: 'Workflow steps',
    type: Array,
    example: [
      {
        id: 'step-1',
        name: 'Receive HL7 Message',
        type: 'receive',
        order: 1,
        configuration: { protocol: 'tcp', port: 2575 }
      },
      {
        id: 'step-2',
        name: 'Transform to FHIR',
        type: 'transform',
        order: 2,
        configuration: { mapping: 'adt-to-patient' }
      },
      {
        id: 'step-3',
        name: 'Validate FHIR',
        type: 'validate',
        order: 3,
        configuration: { profile: 'patient-profile' }
      },
      {
        id: 'step-4',
        name: 'Send to FHIR Server',
        type: 'send',
        order: 4,
        configuration: { endpoint: 'https://fhir.example.com/Patient' }
      }
    ]
  })
  @IsArray()
  steps: any[];

  @ApiPropertyOptional({
    description: 'Workflow configuration',
    example: {
      parallel: false,
      transactional: true,
      rollbackOnFailure: true,
      logging: { enabled: true, level: 'info', detailed: true },
      monitoring: { enabled: true, alerts: true, metrics: true }
    }
  })
  @IsOptional()
  @IsObject()
  configuration?: any;
}

export class CreateDataMappingDto {
  @ApiProperty({
    description: 'Mapping name',
    example: 'HL7 ADT to FHIR Patient'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mapping description',
    example: 'Maps HL7 ADT message fields to FHIR Patient resource fields'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Source system',
    example: 'HIS'
  })
  @IsString()
  sourceSystem: string;

  @ApiProperty({
    description: 'Target system',
    example: 'FHIR-Server'
  })
  @IsString()
  targetSystem: string;

  @ApiProperty({
    description: 'Source format',
    enum: ['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'],
    example: 'hl7_v2'
  })
  @IsEnum(['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'])
  sourceFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';

  @ApiProperty({
    description: 'Target format',
    enum: ['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'],
    example: 'fhir_r4'
  })
  @IsEnum(['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'])
  targetFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';

  @ApiProperty({
    description: 'Field mappings',
    type: Array,
    example: [
      {
        sourceField: 'PID.5.1',
        targetField: 'name[0].family',
        fieldType: 'string',
        required: true,
        description: 'Patient family name'
      },
      {
        sourceField: 'PID.5.2',
        targetField: 'name[0].given[0]',
        fieldType: 'string',
        required: true,
        description: 'Patient given name'
      }
    ]
  })
  @IsArray()
  mappings: FieldMapping[];

  @ApiPropertyOptional({
    description: 'Validation rules',
    type: Array
  })
  @IsOptional()
  @IsArray()
  validation?: ValidationRule[];
}