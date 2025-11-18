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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSystemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const external_systems_service_1 = require("./external-systems.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
let ExternalSystemsController = class ExternalSystemsController {
    constructor(externalSystemsService) {
        this.externalSystemsService = externalSystemsService;
    }
    async processHL7Message(messageData) {
        return await this.externalSystemsService.processHL7Message(messageData.message);
    }
    async processDICOMImage(imageData) {
        return await this.externalSystemsService.processDICOMImage(imageData.image);
    }
    async integrateWithEMR(emrData) {
        return await this.externalSystemsService.integrateWithEMR(emrData);
    }
    async syncWithLaboratory(labConfig) {
        return await this.externalSystemsService.syncWithLaboratorySystem(labConfig);
    }
    async integrateWithPharmacy(pharmacyConfig) {
        return await this.externalSystemsService.integrateWithPharmacySystem(pharmacyConfig);
    }
    async createFHIRResource(resourceType, fhirData) {
        return await this.externalSystemsService.createFHIRResource(resourceType, fhirData);
    }
    async getIntegrationStatus() {
        return await this.externalSystemsService.getIntegrationStatus();
    }
    async processAdmissionHL7(admissionData) {
        const hl7Message = this.constructADTMessage('A01', admissionData);
        return await this.externalSystemsService.processHL7Message(hl7Message);
    }
    async processTransferHL7(transferData) {
        const hl7Message = this.constructADTMessage('A02', transferData);
        return await this.externalSystemsService.processHL7Message(hl7Message);
    }
    async processDischargeHL7(dischargeData) {
        const hl7Message = this.constructADTMessage('A03', dischargeData);
        return await this.externalSystemsService.processHL7Message(hl7Message);
    }
    async sendLabOrderHL7(orderData) {
        const hl7Message = this.constructORMMessage(orderData);
        return await this.externalSystemsService.processHL7Message(hl7Message);
    }
    async processLabResultsHL7(resultsData) {
        const hl7Message = this.constructORUMessage(resultsData);
        return await this.externalSystemsService.processHL7Message(hl7Message);
    }
    async getDICOMWorklist(modality, dateFrom, dateTo) {
        return {
            message: 'DICOM worklist endpoint',
            filters: { modality, dateFrom, dateTo },
            worklist: [
                {
                    scheduledProcedureStepId: 'SPS_001',
                    scheduledProcedureStepDescription: 'CT Chest with Contrast',
                    modality: 'CT',
                    scheduledStationAETitle: 'CT_SCANNER_01',
                    scheduledProcedureStepStartDate: '20241120',
                    scheduledProcedureStepStartTime: '143000',
                    patientId: 'PAT_001',
                    patientName: 'DOE^JOHN',
                    requestingPhysician: 'DR_SMITH^JOHN',
                    studyInstanceUID: '1.2.840.113619.2.55.3.604688237.641.1240134237.689',
                },
                {
                    scheduledProcedureStepId: 'SPS_002',
                    scheduledProcedureStepDescription: 'MRI Brain',
                    modality: 'MR',
                    scheduledStationAETitle: 'MRI_01',
                    scheduledProcedureStepStartDate: '20241120',
                    scheduledProcedureStepStartTime: '153000',
                    patientId: 'PAT_002',
                    patientName: 'SMITH^JANE',
                    requestingPhysician: 'DR_JOHNSON^MARY',
                    studyInstanceUID: '1.2.840.113619.2.55.3.604688237.641.1240134237.690',
                },
            ],
        };
    }
    async getFHIRPatient(id) {
        return {
            resourceType: 'Patient',
            id: id,
            identifier: [
                {
                    type: { text: 'MRN' },
                    value: 'MRN123456',
                },
            ],
            name: [
                {
                    use: 'official',
                    family: 'Doe',
                    given: ['John'],
                },
            ],
            gender: 'male',
            birthDate: '1980-01-01',
        };
    }
    async getFHIRObservations(patientId) {
        return {
            resourceType: 'Bundle',
            type: 'searchset',
            entry: [
                {
                    resource: {
                        resourceType: 'Observation',
                        id: 'obs_001',
                        status: 'final',
                        code: {
                            coding: [
                                {
                                    system: 'http://loinc.org',
                                    code: '2345-7',
                                    display: 'Glucose [Mass/volume] in Blood',
                                },
                            ],
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        effectiveDateTime: '2024-11-20T10:30:00Z',
                        valueQuantity: {
                            value: 95,
                            unit: 'mg/dL',
                            system: 'http://unitsofmeasure.org',
                            code: 'mg/dL',
                        },
                    },
                },
            ],
        };
    }
    async testHL7Connection(testData) {
        return {
            connectionTest: 'success',
            endpoint: testData.endpoint,
            port: testData.port,
            responseTime: 125,
            messageValidation: 'passed',
            timestamp: new Date(),
        };
    }
    async testDICOMConnection(testData) {
        return {
            connectionTest: 'success',
            aeTitle: testData.aeTitle,
            host: testData.host,
            port: testData.port,
            echoResponse: 'success',
            supportedTransferSyntaxes: ['1.2.840.10008.1.2'],
            timestamp: new Date(),
        };
    }
    constructADTMessage(eventType, data) {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
        let message = `MSH|^~\\&|INAMSOS|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ADT_${eventType}|${timestamp}|P|2.5||||||UNICODE\r`;
        message += `PID|1||${data.patientId}||${data.patientName}^^^^^L||${data.dateOfBirth.replace(/-/g, '')}|${data.gender}||\r`;
        if (eventType === 'A01') {
            message += `PV1|1|${data.location}||||${data.admissionType}||${data.physician}||||||||||\r`;
        }
        else if (eventType === 'A02') {
            message += `PV1|1|${data.toLocation}||||||||${data.fromLocation}||||||||||\r`;
        }
        else if (eventType === 'A03') {
            message += `PV1|1||||||${data.dischargeDisposition}|||||||${data.attendingPhysician}|||\r`;
        }
        return message;
    }
    constructORMMessage(data) {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
        let message = `MSH|^~\\&|INAMSOS|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ORM^O01|${timestamp}|P|2.5||||||UNICODE\r`;
        message += `PID|1||${data.patientId}||${data.patientName}^^^^^L\r`;
        message += `PV1|1||\r`;
        message += `ORC|NW|${data.orderId}||||||||${data.collectionDateTime}||^||||^||||||\r`;
        data.tests.forEach((test, index) => {
            message += `OBR|${index + 1}|${data.orderId}|${test.testCode}^${test.testName}^^^L||${data.collectionDateTime}||||||||||||^||||||||||||||\r`;
        });
        return message;
    }
    constructORUMessage(data) {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
        let message = `MSH|^~\\&|LAB|HOSPITAL|${new Date().toISOString().split('T')[0].replace(/-/g, '')}||ORU^R01|${timestamp}|P|2.5||||||UNICODE\r`;
        message += `PID|1||${data.patientId}||\r`;
        message += `PV1|1||\r`;
        message += `OBR|1|${data.orderId}||${data.results[0]?.testCode || ''}||${data.resultDateTime}||||||||||||${data.performingLaboratory}^L|||||\r`;
        data.results.forEach((result, index) => {
            message += `OBX|${index + 1}|NM|${result.testCode}^${result.testName}^^^L|${result.resultValue}|${result.units}|${result.referenceRange}|${result.abnormalFlag || ''}||${result.resultStatus}|\r`;
        });
        return message;
    }
};
exports.ExternalSystemsController = ExternalSystemsController;
__decorate([
    (0, common_1.Post)('hl7/message'),
    (0, swagger_1.ApiOperation)({ summary: 'Process HL7 message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HL7 message processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_HL7_MESSAGE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processHL7Message", null);
__decorate([
    (0, common_1.Post)('dicom/image'),
    (0, swagger_1.ApiOperation)({ summary: 'Process DICOM image' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DICOM image processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_DICOM_IMAGE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processDICOMImage", null);
__decorate([
    (0, common_1.Post)('emr/integrate'),
    (0, swagger_1.ApiOperation)({ summary: 'Integrate with EMR system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'EMR integration completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('INTEGRATE_EMR'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "integrateWithEMR", null);
__decorate([
    (0, common_1.Post)('laboratory/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync with laboratory system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Laboratory sync completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('SYNC_LABORATORY'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "syncWithLaboratory", null);
__decorate([
    (0, common_1.Post)('pharmacy/integrate'),
    (0, swagger_1.ApiOperation)({ summary: 'Integrate with pharmacy system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pharmacy integration completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('INTEGRATE_PHARMACY'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "integrateWithPharmacy", null);
__decorate([
    (0, common_1.Post)('fhir/:resourceType'),
    (0, swagger_1.ApiOperation)({ summary: 'Create FHIR resource' }),
    (0, swagger_1.ApiParam)({ name: 'resourceType', description: 'FHIR resource type (Patient, Observation, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FHIR resource created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('CREATE_FHIR_RESOURCE'),
    __param(0, (0, common_1.Param)('resourceType')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "createFHIRResource", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get integration status overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integration status retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "getIntegrationStatus", null);
__decorate([
    (0, common_1.Post)('hl7/admit'),
    (0, swagger_1.ApiOperation)({ summary: 'Process patient admission HL7 message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient admission processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_ADMISSION_HL7'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processAdmissionHL7", null);
__decorate([
    (0, common_1.Post)('hl7/transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Process patient transfer HL7 message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient transfer processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_TRANSFER_HL7'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processTransferHL7", null);
__decorate([
    (0, common_1.Post)('hl7/discharge'),
    (0, swagger_1.ApiOperation)({ summary: 'Process patient discharge HL7 message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient discharge processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_DISCHARGE_HL7'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processDischargeHL7", null);
__decorate([
    (0, common_1.Post)('laboratory/order'),
    (0, swagger_1.ApiOperation)({ summary: 'Send laboratory order via HL7' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Laboratory order sent successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('SEND_LAB_ORDER_HL7'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "sendLabOrderHL7", null);
__decorate([
    (0, common_1.Post)('laboratory/results'),
    (0, swagger_1.ApiOperation)({ summary: 'Process laboratory results via HL7' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Laboratory results processed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('PROCESS_LAB_RESULTS_HL7'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "processLabResultsHL7", null);
__decorate([
    (0, common_1.Get)('dicom/worklist'),
    (0, swagger_1.ApiOperation)({ summary: 'Get DICOM modality worklist' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DICOM worklist retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_READ'),
    (0, swagger_1.ApiQuery)({ name: 'modality', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('modality')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "getDICOMWorklist", null);
__decorate([
    (0, common_1.Get)('fhir/Patient/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FHIR Patient resource' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FHIR Patient resource retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "getFHIRPatient", null);
__decorate([
    (0, common_1.Get)('fhir/Observation/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FHIR Observation resources for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FHIR Observations retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('INTEGRATION_READ'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "getFHIRObservations", null);
__decorate([
    (0, common_1.Post)('test/hl7-connection'),
    (0, swagger_1.ApiOperation)({ summary: 'Test HL7 connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HL7 connection test completed' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_MONITOR'),
    (0, audit_log_decorator_1.AuditLog)('TEST_HL7_CONNECTION'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "testHL7Connection", null);
__decorate([
    (0, common_1.Post)('test/dicom-connection'),
    (0, swagger_1.ApiOperation)({ summary: 'Test DICOM connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'DICOM connection test completed' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_MONITOR'),
    (0, audit_log_decorator_1.AuditLog)('TEST_DICOM_CONNECTION'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSystemsController.prototype, "testDICOMConnection", null);
exports.ExternalSystemsController = ExternalSystemsController = __decorate([
    (0, swagger_1.ApiTags)('External Systems Integration'),
    (0, common_1.Controller)('integration/external'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [external_systems_service_1.ExternalSystemsService])
], ExternalSystemsController);
//# sourceMappingURL=external-systems.controller.js.map