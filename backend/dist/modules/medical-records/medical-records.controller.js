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
exports.MedicalRecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const medical_records_service_1 = require("./medical-records.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let MedicalRecordsController = class MedicalRecordsController {
    constructor(medicalRecordsService) {
        this.medicalRecordsService = medicalRecordsService;
    }
    async createMedicalRecord(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            providerId: 'current-user-id',
        });
    }
    async searchMedicalRecords(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.medicalRecordsService.searchMedicalRecords(data);
    }
    async getStatistics(centerId, providerId) {
        return await this.medicalRecordsService.getMedicalRecordStatistics(centerId, providerId);
    }
    async findByPatientId(patientId, recordType, page, limit) {
        return await this.medicalRecordsService.findByPatientId(patientId, recordType, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async findById(id) {
        return await this.medicalRecordsService.findById(id);
    }
    async findByRecordNumber(recordNumber) {
        return await this.medicalRecordsService.findByRecordNumber(recordNumber);
    }
    async updateMedicalRecord(id, updateRecordDto) {
        return await this.medicalRecordsService.updateMedicalRecord(id, updateRecordDto, 'current-user-id');
    }
    async createInitialVisitRecord(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            recordType: 'INITIAL',
            providerId: 'current-user-id',
        });
    }
    async createProgressNote(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            recordType: 'PROGRESS',
            providerId: 'current-user-id',
        });
    }
    async createDischargeSummary(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            recordType: 'DISCHARGE',
            providerId: 'current-user-id',
        });
    }
    async createConsultationRecord(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            recordType: 'CONSULTATION',
            providerId: 'current-user-id',
        });
    }
    async createEmergencyRecord(createRecordDto) {
        return await this.medicalRecordsService.createMedicalRecord({
            ...createRecordDto,
            recordType: 'EMERGENCY',
            providerId: 'current-user-id',
        });
    }
};
exports.MedicalRecordsController = MedicalRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new medical record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medical record created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_MEDICAL_RECORD'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createMedicalRecord", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search medical records with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical records retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'recordType', required: false, enum: client_1.RecordType }),
    (0, swagger_1.ApiQuery)({ name: 'isConfidential', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "searchMedicalRecords", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical record statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical records by patient ID' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical records retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'recordType', required: false, enum: client_1.RecordType }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('recordType')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.RecordType !== "undefined" && client_1.RecordType) === "function" ? _a : Object, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medical record ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical record retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medical record not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('number/:recordNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical record by record number' }),
    (0, swagger_1.ApiParam)({ name: 'recordNumber', description: 'Medical record number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical record retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medical record not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    __param(0, (0, common_1.Param)('recordNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "findByRecordNumber", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medical record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Medical record ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical record updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medical record not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_MEDICAL_RECORD'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateMedicalRecord", null);
__decorate([
    (0, common_1.Post)('templates/initial-visit'),
    (0, swagger_1.ApiOperation)({ summary: 'Create initial visit medical record template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_INITIAL_VISIT_RECORD'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createInitialVisitRecord", null);
__decorate([
    (0, common_1.Post)('templates/progress-note'),
    (0, swagger_1.ApiOperation)({ summary: 'Create progress note medical record template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PROGRESS_NOTE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createProgressNote", null);
__decorate([
    (0, common_1.Post)('templates/discharge-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Create discharge summary medical record template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_DISCHARGE_SUMMARY'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createDischargeSummary", null);
__decorate([
    (0, common_1.Post)('templates/consultation'),
    (0, swagger_1.ApiOperation)({ summary: 'Create consultation medical record template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CONSULTATION_RECORD'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createConsultationRecord", null);
__decorate([
    (0, common_1.Post)('templates/emergency'),
    (0, swagger_1.ApiOperation)({ summary: 'Create emergency medical record template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_EMERGENCY_RECORD'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createEmergencyRecord", null);
exports.MedicalRecordsController = MedicalRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Medical Records'),
    (0, common_1.Controller)('medical-records'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [medical_records_service_1.MedicalRecordsService])
], MedicalRecordsController);
//# sourceMappingURL=medical-records.controller.js.map