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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaboratoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const laboratory_service_1 = require("./laboratory.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let LaboratoryController = class LaboratoryController {
    constructor(laboratoryService) {
        this.laboratoryService = laboratoryService;
    }
    async createLabOrder(createLabOrderDto) {
        return await this.laboratoryService.createLabOrder({
            ...createLabOrderDto,
            requestedDate: new Date(createLabOrderDto.requestedDate),
        });
    }
    async searchLabOrders(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.laboratoryService.getLabOrdersByPatient(searchQuery.patientId, data);
    }
    async getPendingOrders(centerId) {
        return await this.laboratoryService.getPendingOrders(centerId);
    }
    async getLabOrderById(orderId) {
        return await this.laboratoryService.getLabOrderById(orderId);
    }
    async updateLabOrderStatus(orderId, updateData) {
        return await this.laboratoryService.updateLabOrderStatus(orderId, updateData.status, updateData.updatedBy);
    }
    async updateLabResult(orderId, resultData) {
        const data = { ...resultData };
        if (resultData.performedAt) {
            data.performedAt = new Date(resultData.performedAt);
        }
        if (resultData.verifiedAt) {
            data.verifiedAt = new Date(resultData.verifiedAt);
        }
        return await this.laboratoryService.updateLabResult(orderId, data);
    }
    async getLabOrdersByPatient(patientId, testType, status, dateFrom, dateTo, page, limit) {
        return await this.laboratoryService.getLabOrdersByPatient(patientId, {
            testType,
            status,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async getLabStatistics(centerId, dateFrom, dateTo) {
        return await this.laboratoryService.getLabStatistics(centerId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async createCBCOrder(cbcOrderDto) {
        return await this.laboratoryService.createLabOrder({
            patientId: cbcOrderDto.patientId,
            orderingPhysicianId: cbcOrderDto.orderingPhysicianId,
            testType: 'COMPLETE_BLOOD_COUNT',
            specimenType: 'BLOOD',
            urgency: cbcOrderDto.urgency,
            clinicalIndication: cbcOrderDto.clinicalIndication,
            requestedDate: new Date(),
            notes: `CBC Order: ${cbcOrderDto.notes || 'Routine complete blood count'}`,
        });
    }
    async createCMPOrder(cmpOrderDto) {
        return await this.laboratoryService.createLabOrder({
            patientId: cmpOrderDto.patientId,
            orderingPhysicianId: cmpOrderDto.orderingPhysicianId,
            testType: 'COMPREHENSIVE_METABOLIC_PANEL',
            specimenType: 'BLOOD',
            urgency: cmpOrderDto.urgency,
            clinicalIndication: cmpOrderDto.clinicalIndication,
            requestedDate: new Date(),
            notes: `CMP Order: ${cmpOrderDto.notes || 'Routine comprehensive metabolic panel'}`,
        });
    }
    async createLFTOrder(lftOrderDto) {
        return await this.laboratoryService.createLabOrder({
            patientId: lftOrderDto.patientId,
            orderingPhysicianId: lftOrderDto.orderingPhysicianId,
            testType: 'LIVER_FUNCTION_TESTS',
            specimenType: 'BLOOD',
            urgency: lftOrderDto.urgency,
            clinicalIndication: lftOrderDto.clinicalIndication,
            requestedDate: new Date(),
            notes: `LFT Order: ${lftOrderDto.notes || 'Liver function assessment'}`,
        });
    }
    async createTumorMarkersOrder(tumorMarkersDto) {
        return await this.laboratoryService.createLabOrder({
            patientId: tumorMarkersDto.patientId,
            orderingPhysicianId: tumorMarkersDto.orderingPhysicianId,
            testType: 'TISSUE_MARKERS',
            specimenType: 'BLOOD',
            urgency: tumorMarkersDto.urgency,
            clinicalIndication: tumorMarkersDto.clinicalIndication || `Tumor marker assessment for ${tumorMarkersDto.cancerType || 'cancer surveillance'}`,
            requestedDate: new Date(),
            notes: `Tumor Markers Order${tumorMarkersDto.cancerType ? ` - ${tumorMarkersDto.cancerType}` : ''}: ${tumorMarkersDto.notes || 'Cancer surveillance'}`,
        });
    }
    async createCoagulationOrder(coagOrderDto) {
        return await this.laboratoryService.createLabOrder({
            patientId: coagOrderDto.patientId,
            orderingPhysicianId: coagOrderDto.orderingPhysicianId,
            testType: 'COAGULATION_PROFILE',
            specimenType: 'BLOOD',
            urgency: coagOrderDto.urgency,
            clinicalIndication: coagOrderDto.clinicalIndication,
            requestedDate: new Date(),
            notes: `Coagulation Profile Order: ${coagOrderDto.notes || 'Bleeding assessment before procedure'}`,
        });
    }
};
exports.LaboratoryController = LaboratoryController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new lab test order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lab order created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_LAB_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createLabOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Search lab orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab orders retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_READ'),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'testType', required: false, enum: client_1.LabTestType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.LabTestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "searchLabOrders", null);
__decorate([
    (0, common_1.Get)('orders/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending lab orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending lab orders retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "getPendingOrders", null);
__decorate([
    (0, common_1.Get)('orders/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Lab order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab order retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_READ'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "getLabOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab order status' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Lab order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab order status updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_LAB_ORDER_STATUS'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "updateLabOrderStatus", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/result'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lab test result' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Lab order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_LAB_RESULT'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "updateLabResult", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab orders by patient ID' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient lab orders retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'testType', required: false, enum: client_1.LabTestType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.LabTestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('testType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.LabTestType !== "undefined" && client_1.LabTestType) === "function" ? _a : Object, typeof (_b = typeof client_1.LabTestStatus !== "undefined" && client_1.LabTestStatus) === "function" ? _b : Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "getLabOrdersByPatient", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get laboratory statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Laboratory statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "getLabStatistics", null);
__decorate([
    (0, common_1.Post)('templates/complete-blood-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Complete Blood Count order' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CBC_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createCBCOrder", null);
__decorate([
    (0, common_1.Post)('templates/comprehensive-metabolic-panel'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Comprehensive Metabolic Panel order' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CMP_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createCMPOrder", null);
__decorate([
    (0, common_1.Post)('templates/liver-function-tests'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Liver Function Tests order' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_LFT_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createLFTOrder", null);
__decorate([
    (0, common_1.Post)('templates/tumor-markers'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Tumor Markers panel order' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_TUMOR_MARKERS_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createTumorMarkersOrder", null);
__decorate([
    (0, common_1.Post)('templates/coagulation-profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Coagulation Profile order' }),
    (0, permissions_decorator_1.RequirePermissions)('LABORATORY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_COAGULATION_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LaboratoryController.prototype, "createCoagulationOrder", null);
exports.LaboratoryController = LaboratoryController = __decorate([
    (0, swagger_1.ApiTags)('Laboratory'),
    (0, common_1.Controller)('laboratory'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [laboratory_service_1.LaboratoryService])
], LaboratoryController);
//# sourceMappingURL=laboratory.controller.js.map