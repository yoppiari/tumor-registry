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
exports.VitalSignsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vital_signs_service_1 = require("./vital-signs.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let VitalSignsController = class VitalSignsController {
    constructor(vitalSignsService) {
        this.vitalSignsService = vitalSignsService;
    }
    async recordVitalSigns(createVitalSignsDto) {
        return await this.vitalSignsService.createVitalSigns({
            patientId: createVitalSignsDto.patientId,
            temperature: createVitalSignsDto.temperature,
            systolicBP: createVitalSignsDto.systolicBP,
            diastolicBP: createVitalSignsDto.diastolicBP,
            heartRate: createVitalSignsDto.heartRate,
            respiratoryRate: createVitalSignsDto.respiratoryRate,
            oxygenSaturation: createVitalSignsDto.oxygenSaturation,
            weight: createVitalSignsDto.weight,
            height: createVitalSignsDto.height,
            painScale: createVitalSignsDto.painScale,
            notes: createVitalSignsDto.notes,
        });
    }
    async getVitalSignsByPatient(patientId, type, dateFrom, dateTo, page, limit) {
        return await this.vitalSignsService.getVitalSignsByPatient(patientId, type, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    async getLatestVitalSigns(patientId) {
        return await this.vitalSignsService.getLatestVitalSigns(patientId);
    }
    async getVitalSignsTrends(patientId, days) {
        return await this.vitalSignsService.getVitalSignsTrends(patientId, days ? parseInt(days) : 7);
    }
    async getAbnormalVitalSigns(patientId, days) {
        return await this.vitalSignsService.getAbnormalVitalSigns(patientId, days ? parseInt(days) : 30);
    }
    async getAlerts(centerId, severity, unreadOnly, page, limit) {
        return await this.vitalSignsService.getAlerts(centerId, severity, unreadOnly === 'true', page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    }
    async getAlertStatistics(centerId, days) {
        return await this.vitalSignsService.getAlertStatistics(centerId, days ? parseInt(days) : 7);
    }
    async acknowledgeAlert(alertId) {
        return await this.vitalSignsService.acknowledgeAlert(alertId);
    }
    async getVitalSignsStatistics(centerId, dateFrom, dateTo) {
        return await this.vitalSignsService.getVitalSignsStatistics(centerId, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
    }
    async getPopulationHealthStatistics(centerId, days) {
        return await this.vitalSignsService.getPopulationHealthStatistics(centerId, days ? parseInt(days) : 30);
    }
    async getWardMonitoring(wardId) {
        return await this.vitalSignsService.getWardMonitoringOverview(wardId);
    }
    async getCriticalPatients(centerId) {
        return await this.vitalSignsService.getCriticalPatients(centerId);
    }
    async recordInitialAssessment(assessmentDto) {
        return await this.vitalSignsService.createVitalSigns({
            patientId: assessmentDto.patientId,
            temperature: assessmentDto.temperature,
            systolicBP: assessmentDto.systolicBP,
            diastolicBP: assessmentDto.diastolicBP,
            heartRate: assessmentDto.heartRate,
            respiratoryRate: assessmentDto.respiratoryRate,
            oxygenSaturation: assessmentDto.oxygenSaturation,
            weight: assessmentDto.weight,
            height: assessmentDto.height,
            painScale: assessmentDto.painScale,
            notes: `Initial Assessment: ${assessmentDto.assessmentNotes || 'Standard initial assessment'}`,
        });
    }
    async recordChemotherapyMonitoring(chemoDto) {
        return await this.vitalSignsService.createVitalSigns({
            patientId: chemoDto.patientId,
            temperature: chemoDto.temperature,
            systolicBP: chemoDto.systolicBP,
            diastolicBP: chemoDto.diastolicBP,
            heartRate: chemoDto.heartRate,
            respiratoryRate: chemoDto.respiratoryRate,
            oxygenSaturation: chemoDto.oxygenSaturation,
            weight: chemoDto.weight,
            notes: `Chemotherapy Monitoring${chemoDto.cycleNumber ? ` - Cycle ${chemoDto.cycleNumber}` : ''}${chemoDto.toxicity ? ` | Toxicity: ${chemoDto.toxicity}` : ''}: ${chemoDto.notes || 'Routine chemo monitoring'}`,
        });
    }
    async recordPreOperativeVitalSigns(preOpDto) {
        return await this.vitalSignsService.createVitalSigns({
            patientId: preOpDto.patientId,
            temperature: preOpDto.temperature,
            systolicBP: preOpDto.systolicBP,
            diastolicBP: preOpDto.diastolicBP,
            heartRate: preOpDto.heartRate,
            respiratoryRate: preOpDto.respiratoryRate,
            oxygenSaturation: preOpDto.oxygenSaturation,
            notes: `Pre-Op Assessment${preOpDto.procedureType ? ` | Procedure: ${preOpDto.procedureType}` : ''}${preOpDto.asaClass ? ` | ASA: ${preOpDto.asaClass}` : ''}${preOpDto.fastingStatus ? ` | Fasting: ${preOpDto.fastingStatus}` : ''}: ${preOpDto.notes || 'Routine pre-op assessment'}`,
        });
    }
    async recordPostOperativeVitalSigns(postOpDto) {
        return await this.vitalSignsService.createVitalSigns({
            patientId: postOpDto.patientId,
            temperature: postOpDto.temperature,
            systolicBP: postOpDto.systolicBP,
            diastolicBP: postOpDto.diastolicBP,
            heartRate: postOpDto.heartRate,
            respiratoryRate: postOpDto.respiratoryRate,
            oxygenSaturation: postOpDto.oxygenSaturation,
            painScale: postOpDto.painScale,
            notes: `Post-Op Assessment${postOpDto.procedureType ? ` | Procedure: ${postOpDto.procedureType}` : ''}${postOpDto.postOpHour ? ` | Hour ${postOpDto.postOpHour}` : ''}${postOpDto.consciousnessLevel ? ` | Consciousness: ${postOpDto.consciousnessLevel}` : ''}${postOpDto.bleeding ? ` | Bleeding: ${postOpDto.bleeding}` : ''}: ${postOpDto.notes || 'Routine post-op assessment'}`,
        });
    }
};
exports.VitalSignsController = VitalSignsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record vital signs for patient' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vital signs recorded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid vital signs data' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('RECORD_VITAL_SIGNS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "recordVitalSigns", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs history for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: client_1.VitalSignType }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.VitalSignType !== "undefined" && client_1.VitalSignType) === "function" ? _a : Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getVitalSignsByPatient", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest vital signs for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest vital signs retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getLatestVitalSigns", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs trends for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs trends retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Number of days to analyze' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getVitalSignsTrends", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/abnormal'),
    (0, swagger_1.ApiOperation)({ summary: 'Get abnormal vital signs for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Abnormal vital signs retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, description: 'Number of days to look back' }),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getAbnormalVitalSigns", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs alerts retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: client_1.AlertSeverity }),
    (0, swagger_1.ApiQuery)({ name: 'unreadOnly', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('unreadOnly')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof client_1.AlertSeverity !== "undefined" && client_1.AlertSeverity) === "function" ? _b : Object, String, String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs alert statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getAlertStatistics", null);
__decorate([
    (0, common_1.Put)('alerts/:alertId/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge vital signs alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert acknowledged successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('ACKNOWLEDGE_VITAL_SIGNS_ALERT'),
    __param(0, (0, common_1.Param)('alertId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Get)('statistics/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vital signs summary statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs statistics retrieved successfully' }),
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
], VitalSignsController.prototype, "getVitalSignsStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/population-health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get population health statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Population health statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getPopulationHealthStatistics", null);
__decorate([
    (0, common_1.Get)('monitoring/ward/:wardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ward monitoring overview' }),
    (0, swagger_1.ApiParam)({ name: 'wardId', description: 'Ward ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ward monitoring data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    __param(0, (0, common_1.Param)('wardId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getWardMonitoring", null);
__decorate([
    (0, common_1.Get)('monitoring/critical-patients'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patients with critical vital signs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical patients list retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PATIENTS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "getCriticalPatients", null);
__decorate([
    (0, common_1.Post)('templates/initial-assessment'),
    (0, swagger_1.ApiOperation)({ summary: 'Record initial assessment vital signs' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('RECORD_INITIAL_ASSESSMENT_VITAL_SIGNS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "recordInitialAssessment", null);
__decorate([
    (0, common_1.Post)('templates/chemotherapy-monitoring'),
    (0, swagger_1.ApiOperation)({ summary: 'Record chemotherapy monitoring vital signs' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('RECORD_CHEMOTHERAPY_VITAL_SIGNS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "recordChemotherapyMonitoring", null);
__decorate([
    (0, common_1.Post)('templates/pre-operative'),
    (0, swagger_1.ApiOperation)({ summary: 'Record pre-operative vital signs' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('RECORD_PREOPERATIVE_VITAL_SIGNS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "recordPreOperativeVitalSigns", null);
__decorate([
    (0, common_1.Post)('templates/post-operative'),
    (0, swagger_1.ApiOperation)({ summary: 'Record post-operative vital signs' }),
    (0, permissions_decorator_1.RequirePermissions)('MEDICAL_RECORDS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('RECORD_POSTOPERATIVE_VITAL_SIGNS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VitalSignsController.prototype, "recordPostOperativeVitalSigns", null);
exports.VitalSignsController = VitalSignsController = __decorate([
    (0, swagger_1.ApiTags)('Vital Signs'),
    (0, common_1.Controller)('vital-signs'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [vital_signs_service_1.VitalSignsService])
], VitalSignsController);
//# sourceMappingURL=vital-signs.controller.js.map