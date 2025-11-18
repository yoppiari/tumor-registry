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
exports.RadiologyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const radiology_service_1 = require("./radiology.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let RadiologyController = class RadiologyController {
    constructor(radiologyService) {
        this.radiologyService = radiologyService;
    }
    async createImagingOrder(createImagingOrderDto) {
        return await this.radiologyService.createImagingOrder({
            ...createImagingOrderDto,
            requestedDate: new Date(createImagingOrderDto.requestedDate),
        });
    }
    async searchImagingOrders(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.radiologyService.getImagingOrdersByPatient(searchQuery.patientId, data);
    }
    async getPendingStudies(centerId) {
        return await this.radiologyService.getPendingStudies(centerId);
    }
    async getImagingOrderById(orderId) {
        return await this.radiologyService.getImagingOrderById(orderId);
    }
    async updateImagingOrderStatus(orderId, updateData) {
        return await this.radiologyService.updateImagingOrderStatus(orderId, updateData.status, updateData.updatedBy, updateData.scheduledDate ? new Date(updateData.scheduledDate) : undefined);
    }
    async updateRadiologyReport(orderId, reportData) {
        const data = { ...reportData };
        if (reportData.reportDate) {
            data.reportDate = new Date(reportData.reportDate);
        }
        return await this.radiologyService.updateRadiologyReport(orderId, data);
    }
    async getImagingOrdersByPatient(patientId, modality, status, dateFrom, dateTo, page, limit) {
        return await this.radiologyService.getImagingOrdersByPatient(patientId, {
            modality,
            status,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async getRadiologyStatistics(centerId, dateFrom, dateTo) {
        return await this.radiologyService.getRadiologyStatistics(centerId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getPatientRadiationTracking(patientId) {
        return await this.radiologyService.getPatientRadiationDoseTracking(patientId);
    }
    async createCTCAPOrder(ctOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: ctOrderDto.patientId,
            orderingPhysicianId: ctOrderDto.orderingPhysicianId,
            modality: 'CT',
            bodyPart: 'Chest/Abdomen/Pelvis',
            clinicalIndication: ctOrderDto.clinicalIndication || (ctOrderDto.cancerStaging ? 'Cancer staging' : 'Oncologic evaluation'),
            contrastType: ctOrderDto.contrastType || 'IV_CONTRAST',
            urgency: ctOrderDto.urgency,
            requestedDate: new Date(),
            notes: `CT CAP Order${ctOrderDto.cancerStaging ? ' (Cancer Staging)' : ''}: ${ctOrderDto.notes || 'Routine oncologic evaluation'}`,
        });
    }
    async createCTSpecificOrder(ctOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: ctOrderDto.patientId,
            orderingPhysicianId: ctOrderDto.orderingPhysicianId,
            modality: 'CT',
            bodyPart: ctOrderDto.bodyPart,
            clinicalIndication: ctOrderDto.clinicalIndication,
            contrastType: ctOrderDto.contrastType || 'NONE',
            urgency: ctOrderDto.urgency,
            requestedDate: new Date(),
            notes: `CT ${ctOrderDto.bodyPart} Order: ${ctOrderDto.notes || 'Targeted evaluation'}`,
        });
    }
    async createMRITumorOrder(mriOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: mriOrderDto.patientId,
            orderingPhysicianId: mriOrderDto.orderingPhysicianId,
            modality: 'MRI',
            bodyPart: mriOrderDto.bodyPart,
            clinicalIndication: mriOrderDto.clinicalIndication || `Tumor evaluation for ${mriOrderDto.tumorType || 'known malignancy'}`,
            contrastType: mriOrderDto.contrastType || 'IV_CONTRAST',
            urgency: mriOrderDto.urgency,
            requestedDate: new Date(),
            notes: `MRI ${mriOrderDto.bodyPart} Order${mriOrderDto.tumorType ? ` - ${mriOrderDto.tumorType}` : ''}: ${mriOrderDto.notes || 'Tumor characterization'}`,
        });
    }
    async createPETCTOrder(petOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: petOrderDto.patientId,
            orderingPhysicianId: petOrderDto.orderingPhysicianId,
            modality: 'PET_CT',
            bodyPart: 'Whole Body',
            clinicalIndication: petOrderDto.clinicalIndication || `PET-CT for ${petOrderDto.cancerType || 'oncologic evaluation'}`,
            contrastType: 'NONE',
            urgency: petOrderDto.urgency,
            requestedDate: new Date(),
            notes: `PET-CT Whole Body Order${petOrderDto.cancerType ? ` - ${petOrderDto.cancerType}` : ''}: ${petOrderDto.notes || 'Staging and treatment response'}`,
        });
    }
    async createXRayChestOrder(xrayOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: xrayOrderDto.patientId,
            orderingPhysicianId: xrayOrderDto.orderingPhysicianId,
            modality: 'XRAY',
            bodyPart: 'Chest',
            clinicalIndication: xrayOrderDto.clinicalIndication,
            contrastType: 'NONE',
            urgency: xrayOrderDto.urgency,
            requestedDate: new Date(),
            notes: `Chest X-Ray Order: ${xrayOrderDto.notes || 'Routine chest evaluation'}`,
        });
    }
    async createUltrasoundAbdomenOrder(usOrderDto) {
        return await this.radiologyService.createImagingOrder({
            patientId: usOrderDto.patientId,
            orderingPhysicianId: usOrderDto.orderingPhysicianId,
            modality: 'ULTRASOUND',
            bodyPart: 'Abdomen',
            clinicalIndication: usOrderDto.clinicalIndication,
            contrastType: 'NONE',
            urgency: usOrderDto.urgency,
            requestedDate: new Date(),
            notes: `Abdominal Ultrasound Order: ${usOrderDto.notes || 'Abdominal organ evaluation'}`,
        });
    }
};
exports.RadiologyController = RadiologyController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging order created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RADIOLOGY_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createImagingOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Search imaging orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging orders retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_READ'),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'modality', required: false, enum: client_1.ImagingModality }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ExamStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "searchImagingOrders", null);
__decorate([
    (0, common_1.Get)('orders/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending imaging studies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending imaging studies retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "getPendingStudies", null);
__decorate([
    (0, common_1.Get)('orders/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Imaging order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_READ'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "getImagingOrderById", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update imaging order status' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Imaging order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order status updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_RADIOLOGY_ORDER_STATUS'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "updateImagingOrderStatus", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Update radiology report' }),
    (0, swagger_1.ApiParam)({ name: 'orderId', description: 'Imaging order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Radiology report updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_RADIOLOGY_REPORT'),
    __param(0, (0, common_1.Param)('orderId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "updateRadiologyReport", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging orders by patient ID' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient imaging orders retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'modality', required: false, enum: client_1.ImagingModality }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ExamStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('modality')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('dateFrom')),
    __param(4, (0, common_1.Query)('dateTo')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.ImagingModality !== "undefined" && client_1.ImagingModality) === "function" ? _a : Object, typeof (_b = typeof client_1.ExamStatus !== "undefined" && client_1.ExamStatus) === "function" ? _b : Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "getImagingOrdersByPatient", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get radiology statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Radiology statistics retrieved successfully' }),
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
], RadiologyController.prototype, "getRadiologyStatistics", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/radiation-tracking'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient radiation dose tracking' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Radiation dose tracking retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "getPatientRadiationTracking", null);
__decorate([
    (0, common_1.Post)('templates/ct-chest-abdomen-pelvis'),
    (0, swagger_1.ApiOperation)({ summary: 'Create CT Chest/Abdomen/Pelvis order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CT_CAP_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createCTCAPOrder", null);
__decorate([
    (0, common_1.Post)('templates/ct-specific-area'),
    (0, swagger_1.ApiOperation)({ summary: 'Create CT of specific area order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CT_SPECIFIC_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createCTSpecificOrder", null);
__decorate([
    (0, common_1.Post)('templates/mri-tumor-evaluation'),
    (0, swagger_1.ApiOperation)({ summary: 'Create MRI for tumor evaluation order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_MRI_TUMOR_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createMRITumorOrder", null);
__decorate([
    (0, common_1.Post)('templates/pet-ct-staging'),
    (0, swagger_1.ApiOperation)({ summary: 'Create PET-CT for cancer staging order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PET_CT_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createPETCTOrder", null);
__decorate([
    (0, common_1.Post)('templates/xray-chest'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Chest X-Ray order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_XRAY_CHEST_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createXRayChestOrder", null);
__decorate([
    (0, common_1.Post)('templates/ultrasound-abdomen'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Abdominal Ultrasound order' }),
    (0, permissions_decorator_1.RequirePermissions)('RADIOLOGY_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_ULTRASOUND_ABDOMEN_ORDER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RadiologyController.prototype, "createUltrasoundAbdomenOrder", null);
exports.RadiologyController = RadiologyController = __decorate([
    (0, swagger_1.ApiTags)('Radiology'),
    (0, common_1.Controller)('radiology'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [radiology_service_1.RadiologyService])
], RadiologyController);
//# sourceMappingURL=radiology.controller.js.map