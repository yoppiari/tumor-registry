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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const patients_service_1 = require("./patients.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let PatientsController = class PatientsController {
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async findAll(centerId, search, includeInactive, page, limit) {
        return await this.patientsService.findAll(centerId, includeInactive === 'true', page ? parseInt(page) : 1, limit ? parseInt(limit) : 50, search);
    }
    async searchPatients(searchQuery) {
        return await this.patientsService.searchPatients(searchQuery);
    }
    async getStatistics(centerId) {
        return await this.patientsService.getPatientStatistics(centerId);
    }
    async findById(id, includeMedicalHistory) {
        const include = includeMedicalHistory === 'true';
        return await this.patientsService.findById(id, include);
    }
    async findByNIK(nik) {
        return await this.patientsService.findByNIK(nik);
    }
    async findByMRN(mrn) {
        return await this.patientsService.findByMedicalRecordNumber(mrn);
    }
    async create(createPatientDto) {
        return await this.patientsService.create({
            ...createPatientDto,
            dateOfBirth: new Date(createPatientDto.dateOfBirth),
        });
    }
    async update(id, updatePatientDto) {
        const data = { ...updatePatientDto };
        if (updatePatientDto.dateOfDeath) {
            data.dateOfDeath = new Date(updatePatientDto.dateOfDeath);
        }
        return await this.patientsService.update(id, data);
    }
    async getPatientVitalSigns(id, limit) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            vitalSigns: patient.vitalSigns || [],
        };
    }
    async getPatientDiagnoses(id) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            diagnoses: patient.diagnoses || [],
        };
    }
    async getPatientMedications(id) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            medications: patient.medications || [],
        };
    }
    async getPatientAllergies(id) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            allergies: patient.allergies || [],
        };
    }
    async getPatientVisits(id, limit) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            visits: patient.visits || [],
        };
    }
    async getPatientInsurance(id) {
        const patient = await this.patientsService.findById(id, true);
        return {
            patientId: id,
            patientName: patient.name,
            insuranceInfos: patient.insuranceInfos || [],
        };
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all patients with pagination and search' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search by name, NIK, MRN, or phone' }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('includeInactive')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced patient search with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients searched successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'gender', required: false, enum: client_1.Gender }),
    (0, swagger_1.ApiQuery)({ name: 'bloodType', required: false, enum: client_1.BloodType }),
    (0, swagger_1.ApiQuery)({ name: 'maritalStatus', required: false, enum: client_1.MaritalStatus }),
    (0, swagger_1.ApiQuery)({ name: 'isDeceased', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfBirthFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfBirthTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'includeMedicalHistory', required: false, type: Boolean }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeMedicalHistory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('nik/:nik'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by NIK' }),
    (0, swagger_1.ApiParam)({ name: 'nik', description: 'Patient NIK' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('nik')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findByNIK", null);
__decorate([
    (0, common_1.Get)('mrn/:mrn'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by Medical Record Number' }),
    (0, swagger_1.ApiParam)({ name: 'mrn', description: 'Medical Record Number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('mrn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findByMRN", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Patient already exists' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PATIENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_PATIENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/vital-signs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient vital signs history' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientVitalSigns", null);
__decorate([
    (0, common_1.Get)(':id/diagnoses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient diagnoses history' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientDiagnoses", null);
__decorate([
    (0, common_1.Get)(':id/medications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient medications' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientMedications", null);
__decorate([
    (0, common_1.Get)(':id/allergies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient allergies' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientAllergies", null);
__decorate([
    (0, common_1.Get)(':id/visits'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient visits history' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientVisits", null);
__decorate([
    (0, common_1.Get)(':id/insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient insurance information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientInsurance", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_1.ApiTags)('Patients'),
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map