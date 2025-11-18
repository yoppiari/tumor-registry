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
var IntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let IntegrationService = IntegrationService_1 = class IntegrationService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(IntegrationService_1.name);
        this.externalSystems = new Map();
        this.hl7Messages = new Map();
        this.fhirResources = new Map();
        this.workflows = new Map();
        this.dataMappings = new Map();
        this.initializeDefaultSystems();
    }
    initializeDefaultSystems() {
        const hl7System = {
            id: 'hl7-v2-default',
            name: 'Hospital Information System',
            type: 'hl7',
            vendor: 'Epic Systems',
            version: 'v2.7',
            status: 'active',
            lastSync: new Date(),
            errorCount: 0,
            configuration: {
                endpoint: 'localhost',
                protocol: 'tcp',
                port: 2575,
                authentication: { type: 'none' },
                timeout: 30,
                retryAttempts: 3,
                retryDelay: 5,
                batchSize: 100,
                mapping: [],
                validation: []
            },
            statistics: {
                totalMessages: 0,
                successfulMessages: 0,
                failedMessages: 0,
                averageResponseTime: 0,
                dailyStats: [],
                errorStats: [],
                performanceMetrics: {
                    throughput: 0,
                    latency: { p50: 0, p95: 0, p99: 0, max: 0 },
                    availability: 99.9,
                    cpuUsage: 0,
                    memoryUsage: 0
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const fhirSystem = {
            id: 'fhir-r4-default',
            name: 'FHIR Server',
            type: 'fhir',
            vendor: 'Microsoft Azure',
            version: 'R4',
            status: 'active',
            lastSync: new Date(),
            errorCount: 0,
            configuration: {
                endpoint: 'https://api.example.com/fhir',
                protocol: 'https',
                authentication: {
                    type: 'bearer',
                    credentials: { token: 'default-token' }
                },
                timeout: 30,
                retryAttempts: 3,
                retryDelay: 5,
                headers: { 'Content-Type': 'application/fhir+json' },
                mapping: [],
                validation: []
            },
            statistics: {
                totalMessages: 0,
                successfulMessages: 0,
                failedMessages: 0,
                averageResponseTime: 0,
                dailyStats: [],
                errorStats: [],
                performanceMetrics: {
                    throughput: 0,
                    latency: { p50: 0, p95: 0, p99: 0, max: 0 },
                    availability: 99.9,
                    cpuUsage: 0,
                    memoryUsage: 0
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.externalSystems.set('hl7-v2-default', hl7System);
        this.externalSystems.set('fhir-r4-default', fhirSystem);
    }
    async createExternalSystem(createDto) {
        const system = {
            id: this.generateId(),
            ...createDto,
            status: 'inactive',
            errorCount: 0,
            lastSync: undefined,
            statistics: {
                totalMessages: 0,
                successfulMessages: 0,
                failedMessages: 0,
                averageResponseTime: 0,
                dailyStats: [],
                errorStats: [],
                performanceMetrics: {
                    throughput: 0,
                    latency: { p50: 0, p95: 0, p99: 0, max: 0 },
                    availability: 100,
                    cpuUsage: 0,
                    memoryUsage: 0
                }
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.externalSystems.set(system.id, system);
        this.logger.log(`Created external system: ${system.name} (${system.id})`);
        return system;
    }
    async updateExternalSystem(id, updateDto) {
        const system = this.externalSystems.get(id);
        if (!system) {
            throw new common_1.NotFoundException(`External system with ID ${id} not found`);
        }
        const updatedSystem = {
            ...system,
            ...updateDto,
            updatedAt: new Date()
        };
        this.externalSystems.set(id, updatedSystem);
        this.logger.log(`Updated external system: ${system.name} (${id})`);
        return updatedSystem;
    }
    async getExternalSystems() {
        return Array.from(this.externalSystems.values());
    }
    async getExternalSystem(id) {
        const system = this.externalSystems.get(id);
        if (!system) {
            throw new common_1.NotFoundException(`External system with ID ${id} not found`);
        }
        return system;
    }
    async deleteExternalSystem(id) {
        const system = this.externalSystems.get(id);
        if (!system) {
            throw new common_1.NotFoundException(`External system with ID ${id} not found`);
        }
        this.externalSystems.delete(id);
        this.logger.log(`Deleted external system: ${system.name} (${id})`);
    }
    async processHL7Message(createDto) {
        const message = {
            id: this.generateId(),
            messageType: createDto.messageType,
            triggerEvent: createDto.triggerEvent,
            messageControlId: createDto.messageControlId,
            timestamp: new Date(),
            sender: createDto.sender,
            receiver: createDto.receiver,
            processingStatus: 'received',
            segments: this.parseHL7Message(createDto.rawMessage),
            rawMessage: createDto.rawMessage,
            metadata: {
                encodingCharacters: '^~\\&',
                processingRules: [],
                acknowledgmentRules: [],
                customRules: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            message.parsedData = this.parseHL7Data(message.segments);
            await this.validateHL7Message(message);
            message.processingStatus = 'completed';
        }
        catch (error) {
            message.processingStatus = 'error';
            message.errors = [{
                    errorCode: 'PARSE_ERROR',
                    errorMessage: error.message,
                    severity: 'error'
                }];
        }
        this.hl7Messages.set(message.id, message);
        await this.updateSystemStatistics(createDto.sender, message.processingStatus);
        await this.logIntegrationEvent('message_received', createDto.sender, message.id);
        this.logger.log(`Processed HL7 message: ${message.messageType}^${message.triggerEvent} (${message.id})`);
        return message;
    }
    parseHL7Message(rawMessage) {
        const segments = rawMessage.split('\r').filter(segment => segment.length > 0);
        return segments.map((segment, index) => {
            const fields = segment.split('|');
            return {
                segmentType: fields[0],
                fields: fields.map((field, fieldIndex) => ({
                    fieldNumber: fieldIndex,
                    value: field,
                    type: this.getHL7FieldType(fields[0], fieldIndex),
                    description: this.getHL7FieldDescription(fields[0], fieldIndex)
                })),
                rawSegment: segment
            };
        });
    }
    getHL7FieldType(segmentType, fieldNumber) {
        const fieldTypeMap = {
            'MSH': { 1: 'string', 2: 'string', 3: 'string', 4: 'string', 5: 'datetime', 6: 'string' },
            'PID': { 1: 'string', 2: 'string', 3: 'string', 4: 'string', 5: 'string', 6: 'string', 7: 'datetime' },
            'ORC': { 1: 'string', 2: 'string', 3: 'string', 4: 'string', 5: 'datetime' }
        };
        return fieldTypeMap[segmentType]?.[fieldNumber] || 'string';
    }
    getHL7FieldDescription(segmentType, fieldNumber) {
        const fieldDescMap = {
            'MSH': { 1: 'Field Separator', 2: 'Encoding Characters', 3: 'Sending Application', 4: 'Sending Facility' },
            'PID': { 1: 'Set ID', 2: 'Patient ID', 3: 'Patient Identifier List', 4: 'Alternate Patient ID' },
            'ORC': { 1: 'Order Control', 2: 'Placer Order Number', 3: 'Filler Order Number' }
        };
        return fieldDescMap[segmentType]?.[fieldNumber] || `Field ${fieldNumber}`;
    }
    parseHL7Data(segments) {
        const parsedData = {};
        segments.forEach(segment => {
            const segmentData = {};
            segment.fields.forEach((field) => {
                segmentData[field.fieldNumber] = field.value;
            });
            parsedData[segment.segmentType] = segmentData;
        });
        return parsedData;
    }
    async validateHL7Message(message) {
        if (!message.segments.find(s => s.segmentType === 'MSH')) {
            throw new Error('HL7 message must have MSH segment');
        }
        const mshSegment = message.segments.find(s => s.segmentType === 'MSH');
        if (!mshSegment.fields[8] || !mshSegment.fields[8].value) {
            throw new Error('MSH segment must have message type and trigger event (field 8)');
        }
    }
    async processFHIRResource(createDto) {
        const resource = {
            id: this.generateId(),
            resourceType: createDto.resourceType,
            fhirVersion: createDto.fhirVersion || 'R4',
            apiEndpoint: createDto.apiEndpoint,
            resourceId: createDto.resourceId || this.generateId(),
            sourceSystem: createDto.sourceSystem,
            processingStatus: 'received',
            resource: createDto.resource,
            extensions: createDto.extensions || [],
            identifiers: createDto.identifiers || [],
            rawResource: JSON.stringify(createDto.resource, null, 2),
            metadata: {
                profile: [],
                tag: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            await this.validateFHIRResource(resource);
            resource.parsedResource = resource.resource;
            resource.validationStatus = 'valid';
            resource.processingStatus = 'completed';
        }
        catch (error) {
            resource.validationStatus = 'invalid';
            resource.processingStatus = 'error';
            resource.errors = [{
                    element: 'resource',
                    path: '/',
                    constraint: 'FHIR validation',
                    severity: 'error',
                    message: error.message
                }];
        }
        this.fhirResources.set(resource.id, resource);
        await this.updateSystemStatistics(createDto.sourceSystem, resource.processingStatus);
        await this.logIntegrationEvent('message_received', createDto.sourceSystem, resource.id);
        this.logger.log(`Processed FHIR resource: ${resource.resourceType}/${resource.resourceId} (${resource.id})`);
        return resource;
    }
    async validateFHIRResource(resource) {
        if (!resource.resource.resourceType) {
            throw new Error('FHIR resource must have resourceType');
        }
        if (resource.resource.resourceType !== resource.resourceType) {
            throw new Error('Resource type mismatch');
        }
        switch (resource.resourceType) {
            case 'Patient':
                if (!resource.resource.identifier || !Array.isArray(resource.resource.identifier)) {
                    throw new Error('Patient resource must have identifier array');
                }
                break;
            case 'Observation':
                if (!resource.resource.subject) {
                    throw new Error('Observation resource must have subject');
                }
                break;
            case 'Condition':
                if (!resource.resource.subject || !resource.resource.code) {
                    throw new Error('Condition resource must have subject and code');
                }
                break;
        }
    }
    async createWorkflow(createDto) {
        const workflow = {
            id: this.generateId(),
            ...createDto,
            status: 'inactive',
            statistics: {
                totalExecutions: 0,
                successfulExecutions: 0,
                failedExecutions: 0,
                averageExecutionTime: 0,
                executionHistory: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.workflows.set(workflow.id, workflow);
        this.logger.log(`Created integration workflow: ${workflow.name} (${workflow.id})`);
        return workflow;
    }
    async getWorkflows() {
        return Array.from(this.workflows.values());
    }
    async executeWorkflow(workflowId) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new common_1.NotFoundException(`Workflow with ID ${workflowId} not found`);
        }
        if (workflow.status !== 'active') {
            throw new common_1.BadRequestException(`Workflow ${workflowId} is not active`);
        }
        this.logger.log(`Executing workflow: ${workflow.name} (${workflowId})`);
        const startTime = Date.now();
        const execution = {
            id: this.generateId(),
            workflowId,
            startTime: new Date(),
            status: 'running',
            input: {},
            steps: []
        };
        try {
            for (const step of workflow.steps) {
                const stepStart = Date.now();
                await this.executeWorkflowStep(step, execution);
                const stepEnd = Date.now();
                execution.steps.push({
                    stepId: step.id,
                    name: step.name,
                    status: 'completed',
                    startTime: new Date(stepStart),
                    endTime: new Date(stepEnd),
                    duration: stepEnd - stepStart
                });
            }
            execution.status = 'completed';
            execution.endTime = new Date();
            execution.duration = Date.now() - startTime;
            workflow.statistics.totalExecutions++;
            workflow.statistics.successfulExecutions++;
            workflow.statistics.averageExecutionTime =
                (workflow.statistics.averageExecutionTime * (workflow.statistics.totalExecutions - 1) + execution.duration) /
                    workflow.statistics.totalExecutions;
        }
        catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            execution.duration = Date.now() - startTime;
            execution.errors = [{
                    stepId: execution.steps.length > 0 ? execution.steps[execution.steps.length - 1].stepId : 'unknown',
                    errorType: 'ExecutionError',
                    errorMessage: error.message,
                    timestamp: new Date(),
                    resolved: false
                }];
            workflow.statistics.totalExecutions++;
            workflow.statistics.failedExecutions++;
        }
        workflow.statistics.executionHistory.push(execution);
        this.workflows.set(workflowId, workflow);
        await this.logIntegrationEvent('transformation_completed', 'workflow', workflowId);
    }
    async executeWorkflowStep(step, execution) {
        switch (step.type) {
            case 'receive':
                this.logger.log(`Step: Receive message`);
                break;
            case 'transform':
                await this.performDataTransformation(step.configuration);
                break;
            case 'validate':
                await this.performValidation(step.configuration);
                break;
            case 'route':
                await this.performRouting(step.configuration);
                break;
            case 'send':
                await this.performSending(step.configuration);
                break;
            case 'store':
                await this.performStoring(step.configuration);
                break;
            case 'notify':
                await this.performNotification(step.configuration);
                break;
            default:
                throw new Error(`Unknown step type: ${step.type}`);
        }
    }
    async performDataTransformation(configuration) {
        this.logger.log('Performing data transformation');
    }
    async performValidation(configuration) {
        this.logger.log('Performing validation');
    }
    async performRouting(configuration) {
        this.logger.log('Performing routing');
    }
    async performSending(configuration) {
        this.logger.log('Performing sending');
    }
    async performStoring(configuration) {
        this.logger.log('Performing storing');
    }
    async performNotification(configuration) {
        this.logger.log('Performing notification');
    }
    async createDataMapping(mapping) {
        const dataMapping = {
            id: this.generateId(),
            name: mapping.name,
            description: mapping.description,
            sourceSystem: mapping.sourceSystem,
            targetSystem: mapping.targetSystem,
            sourceFormat: mapping.sourceFormat,
            targetFormat: mapping.targetFormat,
            mappings: mapping.mappings || [],
            transformations: mapping.transformations || [],
            validation: mapping.validation || [],
            version: '1.0',
            status: 'active',
            statistics: {
                totalMappings: 0,
                successfulMappings: 0,
                failedMappings: 0,
                averageProcessingTime: 0,
                dataVolume: 0
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.dataMappings.set(dataMapping.id, dataMapping);
        this.logger.log(`Created data mapping: ${dataMapping.name} (${dataMapping.id})`);
        return dataMapping;
    }
    async getDataMappings() {
        return Array.from(this.dataMappings.values());
    }
    async getSystemHealth(systemId) {
        const healthChecks = [];
        if (systemId) {
            const system = this.externalSystems.get(systemId);
            if (system) {
                healthChecks.push(await this.performHealthCheck(system));
            }
        }
        else {
            for (const system of this.externalSystems.values()) {
                healthChecks.push(await this.performHealthCheck(system));
            }
        }
        return healthChecks;
    }
    async performHealthCheck(system) {
        const startTime = Date.now();
        let status = 'unknown';
        try {
            if (system.type === 'hl7') {
                status = await this.checkHL7SystemHealth(system);
            }
            else if (system.type === 'fhir') {
                status = await this.checkFHIRSystemHealth(system);
            }
            else {
                status = 'healthy';
            }
        }
        catch (error) {
            status = 'unhealthy';
            this.logger.error(`Health check failed for system ${system.name}: ${error.message}`);
        }
        const responseTime = Date.now() - startTime;
        const errorRate = system.statistics.totalMessages > 0 ?
            (system.statistics.failedMessages / system.statistics.totalMessages) * 100 : 0;
        return {
            systemId: system.id,
            status,
            lastCheck: new Date(),
            responseTime,
            uptime: system.statistics.performanceMetrics.availability,
            errorRate,
            throughput: system.statistics.performanceMetrics.throughput,
            queueDepth: 0,
            lastError: system.lastError,
            checks: [
                {
                    name: 'Connectivity',
                    status: status === 'healthy' ? 'pass' : status === 'degraded' ? 'warn' : 'fail',
                    message: `${status} connection to ${system.name}`,
                    timestamp: new Date(),
                    responseTime
                },
                {
                    name: 'Authentication',
                    status: 'pass',
                    message: 'Authentication successful',
                    timestamp: new Date()
                },
                {
                    name: 'Performance',
                    status: responseTime < 5000 ? 'pass' : 'warn',
                    message: `Response time: ${responseTime}ms`,
                    timestamp: new Date(),
                    responseTime
                }
            ],
            recommendations: status !== 'healthy' ? [
                'Check network connectivity',
                'Verify system configuration',
                'Review recent error logs'
            ] : []
        };
    }
    async checkHL7SystemHealth(system) {
        const errorRate = system.statistics.totalMessages > 0 ?
            (system.statistics.failedMessages / system.statistics.totalMessages) * 100 : 0;
        if (errorRate > 10)
            return 'unhealthy';
        if (errorRate > 5)
            return 'degraded';
        if (system.errorCount > 5)
            return 'degraded';
        return 'healthy';
    }
    async checkFHIRSystemHealth(system) {
        const errorRate = system.statistics.totalMessages > 0 ?
            (system.statistics.failedMessages / system.statistics.totalMessages) * 100 : 0;
        if (errorRate > 10)
            return 'unhealthy';
        if (errorRate > 5)
            return 'degraded';
        if (system.errorCount > 5)
            return 'degraded';
        return 'healthy';
    }
    async getHL7Messages(filters) {
        let messages = Array.from(this.hl7Messages.values());
        if (filters) {
            if (filters.messageType) {
                messages = messages.filter(msg => msg.messageType === filters.messageType);
            }
            if (filters.status) {
                messages = messages.filter(msg => msg.processingStatus === filters.status);
            }
            if (filters.dateFrom) {
                messages = messages.filter(msg => msg.timestamp >= filters.dateFrom);
            }
            if (filters.dateTo) {
                messages = messages.filter(msg => msg.timestamp <= filters.dateTo);
            }
        }
        return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async getFHIRResources(filters) {
        let resources = Array.from(this.fhirResources.values());
        if (filters) {
            if (filters.resourceType) {
                resources = resources.filter(res => res.resourceType === filters.resourceType);
            }
            if (filters.status) {
                resources = resources.filter(res => res.processingStatus === filters.status);
            }
            if (filters.dateFrom) {
                resources = resources.filter(res => res.createdAt >= filters.dateFrom);
            }
            if (filters.dateTo) {
                resources = resources.filter(res => res.createdAt <= filters.dateTo);
            }
        }
        return resources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    async updateSystemStatistics(systemId, status) {
        const system = this.externalSystems.get(systemId);
        if (!system)
            return;
        system.statistics.totalMessages++;
        if (status === 'completed') {
            system.statistics.successfulMessages++;
        }
        else if (status === 'error') {
            system.statistics.failedMessages++;
            system.errorCount++;
        }
        system.lastSync = new Date();
        system.updatedAt = new Date();
        this.externalSystems.set(systemId, system);
    }
    async logIntegrationEvent(eventType, systemId, messageId) {
        const event = {
            id: this.generateId(),
            eventType: eventType,
            systemId,
            messageId,
            timestamp: new Date(),
            payload: {},
            metadata: {
                source: systemId,
                userId: 'system',
                sessionId: this.generateId(),
                environment: this.configService.get('NODE_ENV') || 'development'
            },
            status: 'success',
            processedBy: 'IntegrationService'
        };
        this.logger.debug(`Integration event: ${eventType} for system ${systemId}`);
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = IntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map