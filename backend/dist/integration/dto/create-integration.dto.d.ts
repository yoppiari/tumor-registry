import { SystemConfiguration, FieldMapping, ValidationRule } from '../interfaces/integration.interface';
export declare class CreateExternalSystemDto {
    name: string;
    type: 'hl7' | 'fhir' | 'rest_api' | 'database' | 'file' | 'websocket' | 'mqtt' | 'dicom';
    vendor: string;
    version: string;
    configuration: SystemConfiguration;
}
export declare class UpdateExternalSystemDto {
    name?: string;
    vendor?: string;
    version?: string;
    status?: 'active' | 'inactive' | 'error' | 'maintenance';
    configuration?: SystemConfiguration;
}
export declare class CreateHL7MessageDto {
    messageType: string;
    triggerEvent?: string;
    messageControlId?: string;
    processingId?: string;
    versionId?: string;
    sender: string;
    receiver: string;
    rawMessage: string;
    sequenceNumber?: number;
    acceptanceAcknowledgement?: string;
    applicationAcknowledgement?: string;
}
export declare class CreateFHIRResourceDto {
    resourceType: 'Patient' | 'Observation' | 'Condition' | 'Procedure' | 'Medication' | 'Encounter' | 'DiagnosticReport' | 'Organization' | 'Practitioner' | 'ServiceRequest';
    fhirVersion?: string;
    apiEndpoint: string;
    resourceId?: string;
    versionId?: string;
    sourceSystem: string;
    resource: any;
    extensions?: any[];
    identifiers?: any[];
}
export declare class CreateWorkflowDto {
    name: string;
    description: string;
    type: 'inbound' | 'outbound' | 'bi_directional';
    trigger: any;
    steps: any[];
    configuration?: any;
}
export declare class CreateDataMappingDto {
    name: string;
    description: string;
    sourceSystem: string;
    targetSystem: string;
    sourceFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';
    targetFormat: 'hl7_v2' | 'hl7_v3' | 'fhir_r4' | 'fhir_stu3' | 'fhir_dstu2' | 'custom_xml' | 'custom_json' | 'csv' | 'fixed_width' | 'delimited';
    mappings: FieldMapping[];
    validation?: ValidationRule[];
}
