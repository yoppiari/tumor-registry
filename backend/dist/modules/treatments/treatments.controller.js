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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreatmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const treatments_service_1 = require("./treatments.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let TreatmentsController = class TreatmentsController {
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async createTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            performedBy: 'current-user-id',
        });
    }
    async searchTreatments(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.treatmentsService.searchTreatments(data);
    }
    async getStatistics(centerId, providerId) {
        return await this.treatmentsService.getTreatmentStatistics(centerId, providerId);
    }
    async getUpcomingTreatments(days, centerId) {
        return await this.treatmentsService.getUpcomingTreatments(days ? parseInt(days) : 7, centerId);
    }
    async findByPatientId(patientId, status, page, limit) {
        return await this.treatmentsService.findByPatientId(patientId, status, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async getActiveTreatmentsByPatient(patientId) {
        return await this.treatmentsService.getActiveTreatmentsByPatient(patientId);
    }
    async findById(id) {
        return await this.treatmentsService.findById(id);
    }
    async updateTreatment(id, updateTreatmentDto) {
        const data = { ...updateTreatmentDto };
        if (updateTreatmentDto.startDate) {
            data.startDate = new Date(updateTreatmentDto.startDate);
        }
        if (updateTreatmentDto.endDate) {
            data.endDate = new Date(updateTreatmentDto.endDate);
        }
        return await this.treatmentsService.updateTreatment(id, data);
    }
    async scheduleTreatment(id, scheduleDto) {
        return await this.treatmentsService.scheduleTreatment(id, new Date(scheduleDto.startDate), scheduleDto.endDate ? new Date(scheduleDto.endDate) : undefined);
    }
    async startTreatment(id) {
        return await this.treatmentsService.startTreatment(id);
    }
    async completeTreatment(id, completeDto) {
        return await this.treatmentsService.completeTreatment(id, completeDto.outcome, completeDto.complications);
    }
    async cancelTreatment(id, reason) {
        return await this.treatmentsService.cancelTreatment(id, reason);
    }
    async createChemotherapyTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            procedureName: `Chemotherapy - ${createTreatmentDto.protocol || 'Standard Protocol'}`,
            procedureCode: this.generateChemoCode(createTreatmentDto.protocol),
            indication: createTreatmentDto.indication,
            description: createTreatmentDto.description,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            status: 'SCHEDULED',
            performedBy: 'current-user-id',
            notes: createTreatmentDto.notes,
        });
    }
    async createRadiotherapyTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            procedureName: `Radiotherapy - ${createTreatmentDto.technique || 'Standard Technique'}`,
            procedureCode: this.generateRadTherapyCode(createTreatmentDto.technique),
            indication: createTreatmentDto.indication,
            description: createTreatmentDto.description,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            status: 'SCHEDULED',
            performedBy: 'current-user-id',
            notes: createTreatmentDto.notes,
        });
    }
    async createSurgeryTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            procedureName: `Surgery - ${createTreatmentDto.procedure || 'Standard Procedure'}`,
            procedureCode: this.generateSurgeryCode(createTreatmentDto.procedure),
            indication: createTreatmentDto.indication,
            description: createTreatmentDto.description,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            status: 'SCHEDULED',
            performedBy: 'current-user-id',
            notes: createTreatmentDto.notes,
        });
    }
    async createImmunotherapyTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            procedureName: `Immunotherapy - ${createTreatmentDto.agent || 'Standard Agent'}`,
            procedureCode: this.generateImmunoCode(createTreatmentDto.agent),
            indication: createTreatmentDto.indication,
            description: createTreatmentDto.description,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            status: 'SCHEDULED',
            performedBy: 'current-user-id',
            notes: createTreatmentDto.notes,
        });
    }
    async createTargetedTherapyTreatment(createTreatmentDto) {
        return await this.treatmentsService.createTreatment({
            ...createTreatmentDto,
            procedureName: `Targeted Therapy - ${createTreatmentDto.drug || 'Standard Drug'}`,
            procedureCode: this.generateTargetedCode(createTreatmentDto.drug),
            indication: createTreatmentDto.indication,
            description: createTreatmentDto.description,
            startDate: new Date(createTreatmentDto.startDate),
            endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
            status: 'SCHEDULED',
            performedBy: 'current-user-id',
            notes: createTreatmentDto.notes,
        });
    }
    generateChemoCode(protocol) {
        return `CHEMO-${protocol?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
    }
    generateRadTherapyCode(technique) {
        return `RAD-${technique?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
    }
    generateSurgeryCode(procedure) {
        return `SURG-${procedure?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
    }
    generateImmunoCode(agent) {
        return `IMMUNO-${agent?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
    }
    generateTargetedCode(drug) {
        return `TARGET-${drug?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
    }
};
exports.TreatmentsController = TreatmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient treatment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Treatment created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or date validation failed' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createTreatment", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search treatments with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatments retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ProcedureStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "searchTreatments", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming scheduled treatments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming treatments retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Days ahead to look for treatments' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getUpcomingTreatments", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatments by patient ID' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient treatments retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ProcedureStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.ProcedureStatus !== "undefined" && client_1.ProcedureStatus) === "function" ? _a : Object, String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active treatments for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active treatments retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getActiveTreatmentsByPatient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update treatment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_TREATMENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "updateTreatment", null);
__decorate([
    (0, common_1.Put)(':id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule treatment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment scheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('SCHEDULE_TREATMENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "scheduleTreatment", null);
__decorate([
    (0, common_1.Put)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start treatment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('START_TREATMENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "startTreatment", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete treatment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('COMPLETE_TREATMENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "completeTreatment", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel treatment' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment not found' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('CANCEL_TREATMENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "cancelTreatment", null);
__decorate([
    (0, common_1.Post)('templates/chemotherapy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create chemotherapy treatment template' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CHEMOTHERAPY_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createChemotherapyTreatment", null);
__decorate([
    (0, common_1.Post)('templates/radiotherapy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create radiotherapy treatment template' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RADIOTHERAPY_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createRadiotherapyTreatment", null);
__decorate([
    (0, common_1.Post)('templates/surgery'),
    (0, swagger_1.ApiOperation)({ summary: 'Create surgery treatment template' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_SURGERY_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createSurgeryTreatment", null);
__decorate([
    (0, common_1.Post)('templates/immunotherapy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create immunotherapy treatment template' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_IMMUNOTHERAPY_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createImmunotherapyTreatment", null);
__decorate([
    (0, common_1.Post)('templates/targeted-therapy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create targeted therapy treatment template' }),
    (0, permissions_decorator_1.RequirePermissions)('TREATMENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_TARGETED_THERAPY_TREATMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createTargetedTherapyTreatment", null);
exports.TreatmentsController = TreatmentsController = __decorate([
    (0, swagger_1.ApiTags)('Treatments'),
    (0, common_1.Controller)('treatments'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [treatments_service_1.TreatmentsService])
], TreatmentsController);
//# sourceMappingURL=treatments.controller.js.map