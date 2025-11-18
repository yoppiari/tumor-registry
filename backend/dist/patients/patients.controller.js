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
const throttler_1 = require("@nestjs/throttler");
const patients_service_1 = require("./patients.service");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const patient_search_dto_1 = require("./dto/patient-search.dto");
const quick_patient_entry_dto_1 = require("./dto/quick-patient-entry.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PatientsController = class PatientsController {
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    async create(req, createPatientDto) {
        const userId = req.user.sub;
        return this.patientsService.create(createPatientDto, userId);
    }
    async quickEntry(req, quickEntryDto) {
        const userId = req.user.sub;
        return this.patientsService.quickEntry(quickEntryDto, userId);
    }
    async findAll(searchDto, page, limit, sortBy, sortOrder) {
        return this.patientsService.findAll({
            ...searchDto,
            page,
            limit,
            sortBy: sortBy,
            sortOrder: sortOrder || 'desc'
        });
    }
    async getStatistics() {
        return this.patientsService.getStatistics();
    }
    async findByMedicalRecordNumber(medicalRecordNumber) {
        return this.patientsService.findByMedicalRecordNumber(medicalRecordNumber);
    }
    async findOne(id) {
        return this.patientsService.findById(id);
    }
    async update(req, id, updatePatientDto) {
        const userId = req.user.sub;
        return this.patientsService.update(id, updatePatientDto, userId);
    }
    async markAsDeceased(req, id, body) {
        const userId = req.user.sub;
        return this.patientsService.markAsDeceased(id, new Date(body.dateOfDeath), body.causeOfDeath, userId);
    }
    async softDelete(id) {
        return this.patientsService.softDelete(id);
    }
    async createChatSession(req) {
        const userId = req.user.sub;
        return this.patientsService.createEntrySession(userId);
    }
    async sendChatMessage(sessionId, chatMessageDto) {
        return this.patientsService.updateSession(sessionId, chatMessageDto.content, chatMessageDto.fieldName);
    }
    async getChatSession(sessionId) {
        return this.patientsService.getSession(sessionId);
    }
    async advancedSearch(advancedSearchDto) {
        return this.patientsService.findAll(advancedSearchDto);
    }
    async searchByPhone(phone) {
        return this.patientsService.findAll({ phone });
    }
    async searchByName(name) {
        return this.patients.service.findAll({ name });
    }
    async exportToCsv(searchDto) {
        const result = await this.patientsService.findAll(searchDto);
        return {
            downloadUrl: '/api/v1/patients/downloads/patients.csv',
            recordCount: result.total,
            generatedAt: new Date().toISOString()
        };
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient created successfully', type: patient_interface_1.Patient }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Patient already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_patient_dto_1.CreatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('quick-entry'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Quick patient entry (WhatsApp-inspired)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Patient created successfully', type: patient_interface_1.Patient }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, quick_patient_entry_dto_1.QuickPatientEntryDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "quickEntry", null);
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: false, description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'medicalRecordNumber', required: false, description: 'Medical record number' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Patient name' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerStage', required: false, description: 'Cancer stage' }),
    (0, swagger_1.ApiQuery)({ name: 'treatmentStatus', required: false, description: 'Treatment status' }),
    (0, swagger_1.ApiQuery)({ name: 'primarySite', required: false, description: 'Primary cancer site' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sort field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [patient_search_dto_1.PatientSearchDto, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('mrn/:medicalRecordNumber'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by medical record number' }),
    (0, swagger_1.ApiParam)({ name: 'medicalRecordNumber', description: 'Medical record number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient found', type: patient_interface_1.Patient }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('medicalRecordNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findByMedicalRecordNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient found', type: patient_interface_1.Patient }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient updated successfully', type: patient_interface_1.Patient }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_patient_dto_1.UpdatePatientDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deceased'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Mark patient as deceased' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient marked as deceased' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Patient already deceased' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "markAsDeceased", null);
__decorate([
    (0, common_1.Patch)(':id/soft-delete'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete patient (deactivate)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('admin', 'national_stakeholder'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Post)('chat/session'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create patient entry chat session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat session created' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "createChatSession", null);
__decorate([
    (0, common_1.Post)('chat/:sessionId/message'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Send message in patient entry chat' }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', description: 'Chat session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quick_patient_entry_dto_1.ChatMessageDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "sendChatMessage", null);
__decorate([
    (0, common_1.Get)('chat/:sessionId'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat session' }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', description: 'Chat session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat session retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getChatSession", null);
__decorate([
    (0, common_1.Get)('search/advanced'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced patient search' }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfBirthFrom', required: false, description: 'Date of birth from' }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfBirthTo', required: false, description: 'Date of birth to' }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfDiagnosisFrom', required: false, description: 'Date of diagnosis from' }),
    (0, swagger_1.ApiQuery)({ name: 'dateOfDiagnosisTo', required: false, description: 'Date of diagnosis to' }),
    (0, swagger_1.ApiQuery)({ name: 'isDeceased', required: false, description: 'Filter deceased patients' }),
    (0, swagger_1.ApiQuery)({ name: 'treatmentCenter', required: false, description: 'Filter by treatment center' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Advanced search results' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "advancedSearch", null);
__decorate([
    (0, common_1.Get)('search/by-phone/:phone'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients by phone number' }),
    (0, swagger_1.ApiParam)({ name: 'phone', description: 'Phone number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "searchByPhone", null);
__decorate([
    (0, common_1.Get)('search/by-name/:name'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients by name' }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Patient name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "searchByName", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Export patients to CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV export generated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [patient_search_dto_1.PatientSearchDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "exportToCsv", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_1.ApiTags)('patients'),
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map