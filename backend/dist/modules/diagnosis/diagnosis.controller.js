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
exports.DiagnosisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const diagnosis_service_1 = require("./diagnosis.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let DiagnosisController = class DiagnosisController {
    constructor(diagnosisService) {
        this.diagnosisService = diagnosisService;
    }
    async createDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : undefined,
            resolutionDate: createDiagnosisDto.resolutionDate ? new Date(createDiagnosisDto.resolutionDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async searchDiagnoses(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.diagnosisService.searchDiagnoses(data);
    }
    async getStatistics(centerId, providerId) {
        return await this.diagnosisService.getDiagnosisStatistics(centerId, providerId);
    }
    async findByPatientId(patientId, diagnosisType, status, includeInactive, page, limit) {
        return await this.diagnosisService.findByPatientId(patientId, diagnosisType, status, includeInactive === 'true', page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async getActiveDiagnosesByPatient(patientId) {
        return await this.diagnosisService.getActiveDiagnosesByPatient(patientId);
    }
    async getPrimaryDiagnosesByPatient(patientId) {
        return await this.diagnosisService.getPrimaryDiagnosesByPatient(patientId);
    }
    async findById(id) {
        return await this.diagnosisService.findById(id);
    }
    async updateDiagnosis(id, updateDiagnosisDto) {
        const data = { ...updateDiagnosisDto };
        if (updateDiagnosisDto.onsetDate) {
            data.onsetDate = new Date(updateDiagnosisDto.onsetDate);
        }
        if (updateDiagnosisDto.resolutionDate) {
            data.resolutionDate = new Date(updateDiagnosisDto.resolutionDate);
        }
        return await this.diagnosisService.updateDiagnosis(id, data, 'current-user-id');
    }
    async resolveDiagnosis(id, resolveDto) {
        return await this.diagnosisService.resolveDiagnosis(id, new Date(resolveDto.resolutionDate), resolveDto.notes);
    }
    async createPrimaryCancerDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            diagnosisType: 'PRIMARY',
            status: 'ACTIVE',
            isPrimary: true,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
            providerId: 'current-user-id',
        });
    }
    async createMetastasisDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            diagnosisType: 'SECONDARY',
            status: 'ACTIVE',
            isPrimary: false,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
            providerId: 'current-user-id',
        });
    }
    async createComplicationDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            diagnosisType: 'COMPLICATION',
            status: 'ACTIVE',
            isPrimary: false,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
            providerId: 'current-user-id',
        });
    }
    async createAdmittingDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            diagnosisType: 'ADMITTING',
            status: 'ACTIVE',
            isPrimary: false,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
            providerId: 'current-user-id',
        });
    }
    async createDischargeDiagnosis(createDiagnosisDto) {
        return await this.diagnosisService.createDiagnosis({
            ...createDiagnosisDto,
            diagnosisType: 'DISCHARGE',
            status: 'ACTIVE',
            isPrimary: false,
            onsetDate: createDiagnosisDto.onsetDate ? new Date(createDiagnosisDto.onsetDate) : new Date(),
            providerId: 'current-user-id',
        });
    }
    async searchIcd10ByCategory(category) {
        const categories = {
            'C00-D48': 'Neoplasms (Cancers)',
            'A00-B99': 'Infectious and Parasitic Diseases',
            'I00-I99': 'Diseases of the Circulatory System',
            'J00-J99': 'Diseases of the Respiratory System',
        };
        return {
            category,
            description: categories[category] || 'Unknown Category',
            note: 'Full ICD-10 integration would connect to comprehensive medical coding database',
        };
    }
    async getIcd10Categories() {
        return {
            categories: [
                { code: 'A00-B99', name: 'Infectious and Parasitic Diseases' },
                { code: 'C00-D48', name: 'Neoplasms' },
                { code: 'D50-D89', name: 'Diseases of Blood and Blood-Forming Organs' },
                { code: 'E00-E90', name: 'Endocrine, Nutritional, and Metabolic Diseases' },
                { code: 'F00-F99', name: 'Mental and Behavioural Disorders' },
                { code: 'G00-G99', name: 'Diseases of the Nervous System' },
                { code: 'H00-H59', name: 'Diseases of the Eye and Adnexa' },
                { code: 'I00-I99', name: 'Diseases of the Circulatory System' },
                { code: 'J00-J99', name: 'Diseases of the Respiratory System' },
                { code: 'K00-K93', name: 'Diseases of the Digestive System' },
            ],
            note: 'Cancer-related codes are primarily in C00-D48 (Neoplasms) category',
        };
    }
};
exports.DiagnosisController = DiagnosisController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Diagnosis created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or ICD-10 code' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Diagnosis already exists' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createDiagnosis", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search diagnoses with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnoses retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'diagnosisType', required: false, enum: client_1.DiagnosisType }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: client_1.DiagnosisSeverity }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.DiagnosisStatus }),
    (0, swagger_1.ApiQuery)({ name: 'isPrimary', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "searchDiagnoses", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnoses by patient ID' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient diagnoses retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'diagnosisType', required: false, enum: client_1.DiagnosisType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.DiagnosisStatus }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('diagnosisType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('includeInactive')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active diagnoses for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active diagnoses retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getActiveDiagnosesByPatient", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/primary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get primary diagnoses for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Primary diagnoses retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getPrimaryDiagnosesByPatient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get diagnosis by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update diagnosis' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_DIAGNOSIS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "updateDiagnosis", null);
__decorate([
    (0, common_1.Put)(':id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark diagnosis as resolved' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Diagnosis ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis resolved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Diagnosis not found' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('RESOLVE_DIAGNOSIS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "resolveDiagnosis", null);
__decorate([
    (0, common_1.Post)('templates/primary-cancer'),
    (0, swagger_1.ApiOperation)({ summary: 'Create primary cancer diagnosis template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PRIMARY_CANCER_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createPrimaryCancerDiagnosis", null);
__decorate([
    (0, common_1.Post)('templates/metastasis'),
    (0, swagger_1.ApiOperation)({ summary: 'Create metastasis diagnosis template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_METASTASIS_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createMetastasisDiagnosis", null);
__decorate([
    (0, common_1.Post)('templates/complication'),
    (0, swagger_1.ApiOperation)({ summary: 'Create complication diagnosis template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_COMPLICATION_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createComplicationDiagnosis", null);
__decorate([
    (0, common_1.Post)('templates/admitting'),
    (0, swagger_1.ApiOperation)({ summary: 'Create admitting diagnosis template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_ADMITTING_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createAdmittingDiagnosis", null);
__decorate([
    (0, common_1.Post)('templates/discharge'),
    (0, swagger_1.ApiOperation)({ summary: 'Create discharge diagnosis template' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_DISCHARGE_DIAGNOSIS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "createDischargeDiagnosis", null);
__decorate([
    (0, common_1.Get)('icd10/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search ICD-10 codes by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 search results' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'category', required: true, description: 'ICD-10 category (e.g., C00-D48 for neoplasms)' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "searchIcd10ByCategory", null);
__decorate([
    (0, common_1.Get)('icd10/categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 categories retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DiagnosisController.prototype, "getIcd10Categories", null);
exports.DiagnosisController = DiagnosisController = __decorate([
    (0, swagger_1.ApiTags)('Diagnosis'),
    (0, common_1.Controller)('diagnosis'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [diagnosis_service_1.DiagnosisService])
], DiagnosisController);
//# sourceMappingURL=diagnosis.controller.js.map