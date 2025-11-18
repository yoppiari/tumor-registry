"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDataMappingDto = exports.CreateWorkflowDto = exports.CreateFHIRResourceDto = exports.CreateHL7MessageDto = exports.UpdateExternalSystemDto = exports.CreateExternalSystemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateExternalSystemDto {
}
exports.CreateExternalSystemDto = CreateExternalSystemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the external system',
        example: 'Hospital Information System'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExternalSystemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of external system',
        enum: ['hl7', 'fhir', 'rest_api', 'database', 'file', 'websocket', 'mqtt', 'dicom'],
        example: 'hl7'
    }),
    (0, class_validator_1.IsEnum)(['hl7', 'fhir', 'rest_api', 'database', 'file', 'websocket', 'mqtt', 'dicom']),
    __metadata("design:type", String)
], CreateExternalSystemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vendor of the external system',
        example: 'Epic Systems'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExternalSystemDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Version of the external system',
        example: 'v2.7'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExternalSystemDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'System configuration',
        type: integration_interface_1.SystemConfiguration
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateExternalSystemDto.prototype, "configuration", void 0);
class UpdateExternalSystemDto {
}
exports.UpdateExternalSystemDto = UpdateExternalSystemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the external system',
        example: 'Updated Hospital Information System'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExternalSystemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vendor of the external system',
        example: 'Updated Vendor'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExternalSystemDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Version of the external system',
        example: 'v3.0'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExternalSystemDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'System status',
        enum: ['active', 'inactive', 'error', 'maintenance'],
        example: 'active'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'inactive', 'error', 'maintenance']),
    __metadata("design:type", String)
], UpdateExternalSystemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'System configuration',
        type: integration_interface_1.SystemConfiguration
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateExternalSystemDto.prototype, "configuration", void 0);
class CreateHL7MessageDto {
}
exports.CreateHL7MessageDto = CreateHL7MessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HL7 message type',
        example: 'ADT'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "messageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HL7 trigger event',
        example: 'A01'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "triggerEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message control ID',
        example: '12345'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "messageControlId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Processing ID',
        example: 'P'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "processingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Version ID',
        example: '2.7'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sender system',
        example: 'HIS'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Receiver system',
        example: 'INAMSOS'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw HL7 message',
        example: 'MSH|^~\\&|HIS|INAMSOS|20240101120000||ADT^A01|12345|P|2.7|...'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "rawMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sequence number',
        example: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateHL7MessageDto.prototype, "sequenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Acceptance acknowledgment',
        example: 'AL'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "acceptanceAcknowledgement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Application acknowledgment',
        example: 'AL'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHL7MessageDto.prototype, "applicationAcknowledgement", void 0);
class CreateFHIRResourceDto {
}
exports.CreateFHIRResourceDto = CreateFHIRResourceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FHIR resource type',
        enum: ['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport', 'Organization', 'Practitioner', 'ServiceRequest'],
        example: 'Patient'
    }),
    (0, class_validator_1.IsEnum)(['Patient', 'Observation', 'Condition', 'Procedure', 'Medication', 'Encounter', 'DiagnosticReport', 'Organization', 'Practitioner', 'ServiceRequest']),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "resourceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'FHIR version',
        example: 'R4'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "fhirVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API endpoint',
        example: 'https://api.example.com/fhir'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "apiEndpoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Resource ID',
        example: 'patient-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "resourceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Version ID',
        example: '1'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source system',
        example: 'EHR-System'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFHIRResourceDto.prototype, "sourceSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FHIR resource object',
        example: {
            resourceType: 'Patient',
            id: 'patient-123',
            identifier: [{ system: 'urn:mrn', value: 'MRN12345' }],
            name: [{ family: 'Doe', given: ['John'] }]
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateFHIRResourceDto.prototype, "resource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'FHIR extensions',
        type: Array
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateFHIRResourceDto.prototype, "extensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'FHIR identifiers',
        type: Array
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateFHIRResourceDto.prototype, "identifiers", void 0);
class CreateWorkflowDto {
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow name',
        example: 'ADT to FHIR Patient Conversion'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow description',
        example: 'Converts HL7 ADT messages to FHIR Patient resources'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow type',
        enum: ['inbound', 'outbound', 'bi_directional'],
        example: 'inbound'
    }),
    (0, class_validator_1.IsEnum)(['inbound', 'outbound', 'bi_directional']),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow trigger configuration',
        example: {
            type: 'event',
            condition: 'message.type == "ADT"'
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateWorkflowDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Workflow configuration',
        example: {
            parallel: false,
            transactional: true,
            rollbackOnFailure: true,
            logging: { enabled: true, level: 'info', detailed: true },
            monitoring: { enabled: true, alerts: true, metrics: true }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "configuration", void 0);
class CreateDataMappingDto {
}
exports.CreateDataMappingDto = CreateDataMappingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mapping name',
        example: 'HL7 ADT to FHIR Patient'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mapping description',
        example: 'Maps HL7 ADT message fields to FHIR Patient resource fields'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source system',
        example: 'HIS'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "sourceSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target system',
        example: 'FHIR-Server'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "targetSystem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Source format',
        enum: ['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'],
        example: 'hl7_v2'
    }),
    (0, class_validator_1.IsEnum)(['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited']),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "sourceFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target format',
        enum: ['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited'],
        example: 'fhir_r4'
    }),
    (0, class_validator_1.IsEnum)(['hl7_v2', 'hl7_v3', 'fhir_r4', 'fhir_stu3', 'fhir_dstu2', 'custom_xml', 'custom_json', 'csv', 'fixed_width', 'delimited']),
    __metadata("design:type", String)
], CreateDataMappingDto.prototype, "targetFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateDataMappingDto.prototype, "mappings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Validation rules',
        type: Array
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateDataMappingDto.prototype, "validation", void 0);
//# sourceMappingURL=create-integration.dto.js.map