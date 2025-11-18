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
var IntegrationController_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("./integration.service");
const create_integration_dto_1 = require("./dto/create-integration.dto");
const update_integration_dto_1 = require("./dto/update-integration.dto");
const create_hl7_message_dto_1 = require("./dto/create-hl7-message.dto");
const create_fhir_resource_dto_1 = require("./dto/create-fhir-resource.dto");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
let IntegrationController = IntegrationController_1 = class IntegrationController {
    constructor(integrationService) {
        this.integrationService = integrationService;
        this.logger = new common_1.Logger(IntegrationController_1.name);
    }
    async createExternalSystem(createDto) {
        return this.integrationService.createExternalSystem(createDto);
    }
    async getExternalSystems() {
        return this.integrationService.getExternalSystems();
    }
    async getExternalSystem(id) {
        return this.integrationService.getExternalSystem(id);
    }
    async updateExternalSystem(id, updateDto) {
        return this.integrationService.updateExternalSystem(id, updateDto);
    }
    async deleteExternalSystem(id) {
        await this.integrationService.deleteExternalSystem(id);
        return { message: 'External system deleted successfully' };
    }
    async processHL7Message(createDto) {
        return this.integrationService.processHL7Message(createDto);
    }
    async getHL7Messages(messageType, status, dateFrom, dateTo) {
        return this.integrationService.getHL7Messages({
            messageType,
            status,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined
        });
    }
    async processFHIRResource(createDto) {
        return this.integrationService.processFHIRResource(createDto);
    }
    async getFHIRResources(resourceType, status, dateFrom, dateTo) {
        return this.integrationService.getFHIRResources({
            resourceType,
            status,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined
        });
    }
    async createWorkflow(createDto) {
        return this.integrationService.createWorkflow(createDto);
    }
    async getWorkflows() {
        return this.integrationService.getWorkflows();
    }
    async executeWorkflow(id) {
        await this.integrationService.executeWorkflow(id);
        return { message: 'Workflow execution started successfully' };
    }
    async createDataMapping(mapping) {
        return this.integrationService.createDataMapping(mapping);
    }
    async getDataMappings() {
        return this.integrationService.getDataMappings();
    }
    async getSystemHealth() {
        return this.integrationService.getSystemHealth();
    }
    async getSystemHealthById(systemId) {
        return this.integrationService.getSystemHealth(systemId);
    }
    async processADTMessage(createDto) {
        const adtDto = {
            ...createDto,
            messageType: 'ADT',
            triggerEvent: createDto.triggerEvent || 'A01'
        };
        return this.integrationService.processHL7Message(adtDto);
    }
    async processORUMessage(createDto) {
        const oruDto = {
            ...createDto,
            messageType: 'ORU',
            triggerEvent: createDto.triggerEvent || 'R01'
        };
        return this.integrationService.processHL7Message(oruDto);
    }
    async processORMMessage(createDto) {
        const ormDto = {
            ...createDto,
            messageType: 'ORM',
            triggerEvent: createDto.triggerEvent || 'O01'
        };
        return this.integrationService.processHL7Message(ormDto);
    }
    async processPatientResource(createDto) {
        const patientDto = {
            ...createDto,
            resourceType: 'Patient',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(patientDto);
    }
    async processObservationResource(createDto) {
        const observationDto = {
            ...createDto,
            resourceType: 'Observation',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(observationDto);
    }
    async processConditionResource(createDto) {
        const conditionDto = {
            ...createDto,
            resourceType: 'Condition',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(conditionDto);
    }
    async processProcedureResource(createDto) {
        const procedureDto = {
            ...createDto,
            resourceType: 'Procedure',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(procedureDto);
    }
    async processMedicationResource(createDto) {
        const medicationDto = {
            ...createDto,
            resourceType: 'Medication',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(medicationDto);
    }
    async processEncounterResource(createDto) {
        const encounterDto = {
            ...createDto,
            resourceType: 'Encounter',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(encounterDto);
    }
    async processDiagnosticReportResource(createDto) {
        const diagnosticReportDto = {
            ...createDto,
            resourceType: 'DiagnosticReport',
            fhirVersion: 'R4'
        };
        return this.integrationService.processFHIRResource(diagnosticReportDto);
    }
    async processBatchHL7(messages) {
        const results = [];
        let successful = 0;
        let failed = 0;
        for (const messageDto of messages) {
            try {
                const result = await this.integrationService.processHL7Message(messageDto);
                results.push(result);
                if (result.processingStatus === 'completed') {
                    successful++;
                }
                else {
                    failed++;
                }
            }
            catch (error) {
                failed++;
                this.logger.error(`Failed to process HL7 message: ${error.message}`);
            }
        }
        return {
            processed: messages.length,
            successful,
            failed,
            results
        };
    }
    async processBatchFHIR(resources) {
        const results = [];
        let successful = 0;
        let failed = 0;
        for (const resourceDto of resources) {
            try {
                const result = await this.integrationService.processFHIRResource(resourceDto);
                results.push(result);
                if (result.processingStatus === 'completed') {
                    successful++;
                }
                else {
                    failed++;
                }
            }
            catch (error) {
                failed++;
                this.logger.error(`Failed to process FHIR resource: ${error.message}`);
            }
        }
        return {
            processed: resources.length,
            successful,
            failed,
            results
        };
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Post)('systems'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new external system configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'External system created successfully', type: integration_interface_1.ExternalSystem }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_dto_1.CreateExternalSystemDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "createExternalSystem", null);
__decorate([
    (0, common_1.Get)('systems'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all external systems' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External systems retrieved successfully', type: [integration_interface_1.ExternalSystem] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getExternalSystems", null);
__decorate([
    (0, common_1.Get)('systems/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get external system by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'External system ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External system retrieved successfully', type: integration_interface_1.ExternalSystem }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'External system not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getExternalSystem", null);
__decorate([
    (0, common_1.Put)('systems/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update external system configuration' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'External system ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External system updated successfully', type: integration_interface_1.ExternalSystem }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'External system not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof update_integration_dto_1.UpdateExternalSystemDto !== "undefined" && update_integration_dto_1.UpdateExternalSystemDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "updateExternalSystem", null);
__decorate([
    (0, common_1.Delete)('systems/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete external system' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'External system ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'External system deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'External system not found' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "deleteExternalSystem", null);
__decorate([
    (0, common_1.Post)('hl7/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Process incoming HL7 message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'HL7 message processed successfully', type: integration_interface_1.HL7Message }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid HL7 message format' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_hl7_message_dto_1.CreateHL7MessageDto !== "undefined" && create_hl7_message_dto_1.CreateHL7MessageDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processHL7Message", null);
__decorate([
    (0, common_1.Get)('hl7/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HL7 messages with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'messageType', required: false, description: 'Filter by message type (ADT, ORU, etc.)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by processing status' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, description: 'Filter messages from date' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, description: 'Filter messages to date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HL7 messages retrieved successfully', type: [integration_interface_1.HL7Message] }),
    __param(0, (0, common_1.Query)('messageType')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getHL7Messages", null);
__decorate([
    (0, common_1.Post)('fhir/resources'),
    (0, swagger_1.ApiOperation)({ summary: 'Process incoming FHIR resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FHIR resource processed successfully', type: integration_interface_1.FHIRResource }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid FHIR resource format' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processFHIRResource", null);
__decorate([
    (0, common_1.Get)('fhir/resources'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FHIR resources with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'resourceType', required: false, description: 'Filter by resource type (Patient, Observation, etc.)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by processing status' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, description: 'Filter resources from date' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, description: 'Filter resources to date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FHIR resources retrieved successfully', type: [integration_interface_1.FHIRResource] }),
    __param(0, (0, common_1.Query)('resourceType')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getFHIRResources", null);
__decorate([
    (0, common_1.Post)('workflows'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new integration workflow' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow created successfully', type: integration_interface_1.IntegrationWorkflow }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "createWorkflow", null);
__decorate([
    (0, common_1.Get)('workflows'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all integration workflows' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflows retrieved successfully', type: [integration_interface_1.IntegrationWorkflow] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getWorkflows", null);
__decorate([
    (0, common_1.Post)('workflows/:id/execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute an integration workflow' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Workflow ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow execution started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Workflow is not active' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "executeWorkflow", null);
__decorate([
    (0, common_1.Post)('mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new data mapping configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data mapping created successfully', type: integration_interface_1.DataMapping }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "createDataMapping", null);
__decorate([
    (0, common_1.Get)('mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all data mappings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data mappings retrieved successfully', type: [integration_interface_1.DataMapping] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getDataMappings", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health status of all integration systems' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health checks completed successfully', type: [integration_interface_1.IntegrationHealth] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('health/:systemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health status of specific integration system' }),
    (0, swagger_1.ApiParam)({ name: 'systemId', description: 'External system ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health check completed successfully', type: integration_interface_1.IntegrationHealth }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'System not found' }),
    __param(0, (0, common_1.Param)('systemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getSystemHealthById", null);
__decorate([
    (0, common_1.Post)('hl7/v2/adt'),
    (0, swagger_1.ApiOperation)({ summary: 'Process HL7 v2 ADT (Admission, Discharge, Transfer) message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ADT message processed successfully', type: integration_interface_1.HL7Message }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_hl7_message_dto_1.CreateHL7MessageDto !== "undefined" && create_hl7_message_dto_1.CreateHL7MessageDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processADTMessage", null);
__decorate([
    (0, common_1.Post)('hl7/v2/oru'),
    (0, swagger_1.ApiOperation)({ summary: 'Process HL7 v2 ORU (Observation Result Unsolicited) message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ORU message processed successfully', type: integration_interface_1.HL7Message }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof create_hl7_message_dto_1.CreateHL7MessageDto !== "undefined" && create_hl7_message_dto_1.CreateHL7MessageDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processORUMessage", null);
__decorate([
    (0, common_1.Post)('hl7/v2/orm'),
    (0, swagger_1.ApiOperation)({ summary: 'Process HL7 v2 ORM (Order) message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ORM message processed successfully', type: integration_interface_1.HL7Message }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_hl7_message_dto_1.CreateHL7MessageDto !== "undefined" && create_hl7_message_dto_1.CreateHL7MessageDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processORMMessage", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Patient resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processPatientResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Observation'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Observation resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Observation resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processObservationResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Condition'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Condition resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Condition resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processConditionResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Procedure'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Procedure resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Procedure resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processProcedureResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Medication'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Medication resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medication resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processMedicationResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/Encounter'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 Encounter resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Encounter resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processEncounterResource", null);
__decorate([
    (0, common_1.Post)('fhir/r4/DiagnosticReport'),
    (0, swagger_1.ApiOperation)({ summary: 'Process FHIR R4 DiagnosticReport resource' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'DiagnosticReport resource processed successfully', type: integration_interface_1.FHIRResource }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof create_fhir_resource_dto_1.CreateFHIRResourceDto !== "undefined" && create_fhir_resource_dto_1.CreateFHIRResourceDto) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processDiagnosticReportResource", null);
__decorate([
    (0, common_1.Post)('batch/hl7'),
    (0, swagger_1.ApiOperation)({ summary: 'Process multiple HL7 messages in batch' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Batch HL7 processing completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processBatchHL7", null);
__decorate([
    (0, common_1.Post)('batch/fhir'),
    (0, swagger_1.ApiOperation)({ summary: 'Process multiple FHIR resources in batch' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Batch FHIR processing completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "processBatchFHIR", null);
exports.IntegrationController = IntegrationController = IntegrationController_1 = __decorate([
    (0, swagger_1.ApiTags)('Integration'),
    (0, common_1.Controller)('integration'),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map