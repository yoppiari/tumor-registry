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
exports.ConsentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const consent_service_1 = require("./consent.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let ConsentController = class ConsentController {
    constructor(consentService) {
        this.consentService = consentService;
    }
    async createConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async findByPatientId(patientId, consentType, includeExpired, page, limit) {
        return await this.consentService.findByPatientId(patientId, consentType, includeExpired === 'true', page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async getStatistics(centerId) {
        return await this.consentService.getConsentStatistics(centerId);
    }
    async getExpiringConsents(days, centerId) {
        return await this.consentService.getExpiringConsents(days ? parseInt(days) : 30, centerId);
    }
    async checkConsent(patientId, consentType, requireActive) {
        return await this.consentService.checkConsent(patientId, consentType, requireActive !== 'false');
    }
    async findById(id) {
        return await this.consentService.findById(id);
    }
    async updateConsent(id, updateConsentDto) {
        const data = { ...updateConsentDto };
        if (updateConsentDto.consentDate) {
            data.consentDate = new Date(updateConsentDto.consentDate);
        }
        if (updateConsentDto.expiredDate) {
            data.expiredDate = new Date(updateConsentDto.expiredDate);
        }
        return await this.consentService.updateConsent(id, data, 'current-user-id');
    }
    async revokeConsent(id, reason) {
        return await this.consentService.revokeConsent(id, reason, 'current-user-id');
    }
    async createTreatmentConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'TREATMENT',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createSurgeryConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'SURGERY',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createAnesthesiaConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'ANESTHESIA',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createBloodTransfusionConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'BLOOD_TRANSFUSION',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createResearchConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'RESEARCH',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createPhotographyConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'PHOTOGRAPHY',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createTelehealthConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'TELEHEALTH',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
    async createPrivacyConsent(createConsentDto) {
        return await this.consentService.createConsent({
            ...createConsentDto,
            consentType: 'PRIVACY',
            consentDate: new Date(createConsentDto.consentDate),
            expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
            providerId: 'current-user-id',
        });
    }
};
exports.ConsentController = ConsentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new patient consent' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Consent created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input or missing guardian information' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createConsent", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get consents by patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consents retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'consentType', required: false, enum: client_1.ConsentType }),
    (0, swagger_1.ApiQuery)({ name: 'includeExpired', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('consentType')),
    __param(2, (0, common_1.Query)('includeExpired')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consent statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consents that will expire soon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expiring consents retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Days until expiry (default: 30)' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "getExpiringConsents", null);
__decorate([
    (0, common_1.Get)('check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if patient has active consent for specific type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent check completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'consentType', required: true, enum: client_1.ConsentType }),
    (0, swagger_1.ApiQuery)({ name: 'requireActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('consentType')),
    __param(2, (0, common_1.Query)('requireActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "checkConsent", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consent by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consent ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consent not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update consent' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consent ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consent not found' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_CONSENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "updateConsent", null);
__decorate([
    (0, common_1.Post)(':id/revoke'),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke consent' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consent ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent revoked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Consent is already revoked' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('REVOKE_CONSENT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "revokeConsent", null);
__decorate([
    (0, common_1.Post)('templates/treatment'),
    (0, swagger_1.ApiOperation)({ summary: 'Create treatment consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_TREATMENT_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createTreatmentConsent", null);
__decorate([
    (0, common_1.Post)('templates/surgery'),
    (0, swagger_1.ApiOperation)({ summary: 'Create surgery consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_SURGERY_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createSurgeryConsent", null);
__decorate([
    (0, common_1.Post)('templates/anesthesia'),
    (0, swagger_1.ApiOperation)({ summary: 'Create anesthesia consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_ANESTHESIA_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createAnesthesiaConsent", null);
__decorate([
    (0, common_1.Post)('templates/blood-transfusion'),
    (0, swagger_1.ApiOperation)({ summary: 'Create blood transfusion consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_BLOOD_TRANSFUSION_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createBloodTransfusionConsent", null);
__decorate([
    (0, common_1.Post)('templates/research'),
    (0, swagger_1.ApiOperation)({ summary: 'Create research consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RESEARCH_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createResearchConsent", null);
__decorate([
    (0, common_1.Post)('templates/photography'),
    (0, swagger_1.ApiOperation)({ summary: 'Create photography consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PHOTOGRAPHY_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createPhotographyConsent", null);
__decorate([
    (0, common_1.Post)('templates/telehealth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create telehealth consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_TELEHEALTH_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createTelehealthConsent", null);
__decorate([
    (0, common_1.Post)('templates/privacy'),
    (0, swagger_1.ApiOperation)({ summary: 'Create privacy consent template' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PRIVACY_CONSENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "createPrivacyConsent", null);
exports.ConsentController = ConsentController = __decorate([
    (0, swagger_1.ApiTags)('Patient Consent'),
    (0, common_1.Controller)('consent'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [consent_service_1.ConsentService])
], ConsentController);
//# sourceMappingURL=consent.controller.js.map