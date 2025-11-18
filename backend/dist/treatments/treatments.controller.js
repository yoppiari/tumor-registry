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
exports.TreatmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const treatments_service_1 = require("./treatments.service");
const create_treatment_plan_dto_1 = require("./dto/create-treatment-plan.dto");
const update_treatment_plan_dto_1 = require("./dto/update-treatment-plan.dto");
const search_treatment_dto_1 = require("./dto/search-treatment.dto");
const create_treatment_session_dto_1 = require("./dto/create-treatment-session.dto");
const create_medical_record_dto_1 = require("./dto/create-medical-record.dto");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let TreatmentsController = class TreatmentsController {
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async createTreatmentPlan(req, createTreatmentPlanDto) {
        const userId = req.user.sub;
        return this.treatmentsService.createTreatmentPlan(createTreatmentPlanDto, userId);
    }
    async findAllTreatmentPlans(searchDto, page, limit, sortBy, sortOrder) {
        return this.treatmentsService.findAllTreatmentPlans({
            ...searchDto,
            page,
            limit,
            sortBy: sortBy,
            sortOrder: sortOrder || 'desc'
        });
    }
    async findTreatmentPlanById(id) {
        return this.treatmentsService.findTreatmentPlanById(id);
    }
    async updateTreatmentPlan(req, id, updateTreatmentPlanDto) {
        const userId = req.user.sub;
        return this.treatmentsService.updateTreatmentPlan(id, updateTreatmentPlanDto, userId);
    }
    async activateTreatmentPlan(req, id) {
        const userId = req.user.sub;
        return this.treatmentsService.activateTreatmentPlan(id, userId);
    }
    async completeTreatmentPlan(req, id) {
        const userId = req.user.sub;
        return this.treatmentsService.completeTreatmentPlan(id, userId);
    }
    async createTreatmentSession(req, createTreatmentSessionDto) {
        const userId = req.user.sub;
        return this.treatmentsService.createTreatmentSession(createTreatmentSessionDto, userId);
    }
    async findTreatmentSessionsByPlan(planId) {
        return this.treatmentsService.findTreatmentSessionsByPlan(planId);
    }
    async completeTreatmentSession(req, sessionId, postAssessmentData) {
        const userId = req.user.sub;
        return this.treatmentsService.completeTreatmentSession(sessionId, postAssessmentData, userId);
    }
    async createMedicalRecord(req, createMedicalRecordDto) {
        const userId = req.user.sub;
        return this.treatmentsService.createMedicalRecord(createMedicalRecordDto, userId);
    }
    async findMedicalRecordsByPatient(patientId, limit) {
        return this.treatmentsService.findMedicalRecordsByPatient(patientId, limit);
    }
    async calculateQualityMetrics(planId) {
        return this.treatmentsService.calculateQualityMetrics(planId);
    }
    async generateTreatmentReport(req, generateReportDto) {
        const userId = req.user.sub;
        return this.treatmentsService.generateTreatmentReport(generateReportDto, userId);
    }
    async getTreatmentProtocols(cancerType, stage, lineOfTherapy) {
        return {
            protocols: [
                {
                    id: 'protocol-1',
                    name: 'AC-T for Breast Cancer',
                    code: 'BR-AC-T-001',
                    cancerType: 'Breast',
                    stage: 'II',
                    lineOfTherapy: 1,
                    category: 'standard'
                }
            ],
            total: 1
        };
    }
    async getTreatmentOutcomesAnalytics(dateFrom, dateTo, cancerType, stage) {
        return {
            summary: {
                totalPatients: 1250,
                overallResponseRate: 68.5,
                medianProgressionFreeSurvival: 18.2,
                medianOverallSurvival: 42.8,
                oneYearSurvivalRate: 85.2,
                fiveYearSurvivalRate: 62.3
            },
            byCancerType: {
                'Breast': { patients: 450, responseRate: 75.2, medianOS: 58.5 },
                'Lung': { patients: 320, responseRate: 62.1, medianOS: 28.3 },
                'Colorectal': { patients: 280, responseRate: 68.9, medianOS: 45.7 },
                'Other': { patients: 200, responseRate: 65.3, medianOS: 38.2 }
            },
            byStage: {
                'I': { patients: 150, responseRate: 92.3, medianOS: 75.2 },
                'II': { patients: 380, responseRate: 85.1, medianOS: 65.8 },
                'III': { patients: 520, responseRate: 68.4, medianOS: 42.3 },
                'IV': { patients: 200, responseRate: 45.2, medianOS: 18.7 }
            },
            trends: [
                { month: '2024-01', patients: 85, avgResponseRate: 70.2 },
                { month: '2024-02', patients: 92, avgResponseRate: 68.9 },
                { month: '2024-03', patients: 88, avgResponseRate: 71.5 }
            ]
        };
    }
    async getToxicityProfiles(treatmentType, toxicityGrade) {
        return {
            summary: {
                totalPatients: 1250,
                patientsWithToxicity: 780,
                overallToxicityRate: 62.4,
                grade3PlusToxicityRate: 23.1
            },
            commonToxicities: [
                { type: 'Neutropenia', grade3Plus: 28.5, allGrades: 45.2 },
                { type: 'Anemia', grade3Plus: 15.3, allGrades: 32.1 },
                { type: 'Nausea/Vomiting', grade3Plus: 8.7, allGrades: 28.9 },
                { type: 'Fatigue', grade3Plus: 5.2, allGrades: 25.4 },
                { type: 'Mucositis', grade3Plus: 6.8, allGrades: 18.3 }
            ],
            byTreatmentType: {
                'chemotherapy': { toxicityRate: 68.2, grade3PlusRate: 28.5 },
                'radiotherapy': { toxicityRate: 45.7, grade3PlusRate: 12.3 },
                'targeted_therapy': { toxicityRate: 38.9, grade3PlusRate: 15.2 },
                'immunotherapy': { toxicityRate: 52.1, grade3PlusRate: 18.7 }
            }
        };
    }
    async getTreatmentSchedule(date, department, modality) {
        return {
            date,
            totalSessions: 45,
            sessions: [
                {
                    id: 'session-1',
                    patientName: 'John Doe',
                    treatmentType: 'Chemotherapy',
                    time: '09:00',
                    duration: 180,
                    status: 'scheduled'
                }
            ]
        };
    }
};
exports.TreatmentsController = TreatmentsController;
__decorate([
    (0, common_1.Post)('plans'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new treatment plan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Treatment plan created successfully', type: treatment_interface_1.TreatmentPlan }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Patient already has an active treatment plan' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_treatment_plan_dto_1.CreateTreatmentPlanDto]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createTreatmentPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Search treatment plans with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, description: 'Patient ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Treatment plan status' }),
    (0, swagger_1.ApiQuery)({ name: 'modality', required: false, description: 'Treatment modality' }),
    (0, swagger_1.ApiQuery)({ name: 'intent', required: false, description: 'Treatment intent' }),
    (0, swagger_1.ApiQuery)({ name: 'primaryOncologist', required: false, description: 'Primary oncologist name' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sort field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Sort order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plans retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_treatment_dto_1.SearchTreatmentDto, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findAllTreatmentPlans", null);
__decorate([
    (0, common_1.Get)('plans/:id'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment plan by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan found', type: treatment_interface_1.TreatmentPlan }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findTreatmentPlanById", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan updated successfully', type: treatment_interface_1.TreatmentPlan }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_treatment_plan_dto_1.UpdateTreatmentPlanDto]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "updateTreatmentPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id/activate'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Activate treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan activated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot activate treatment plan' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "activateTreatmentPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id/complete'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Complete treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment plan completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot complete treatment plan' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "completeTreatmentPlan", null);
__decorate([
    (0, common_1.Post)('sessions'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new treatment session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Treatment session created successfully', type: treatment_interface_1.TreatmentSession }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_treatment_session_dto_1.CreateTreatmentSessionDto]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createTreatmentSession", null);
__decorate([
    (0, common_1.Get)('plans/:planId/sessions'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment sessions for a plan' }),
    (0, swagger_1.ApiParam)({ name: 'planId', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment sessions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findTreatmentSessionsByPlan", null);
__decorate([
    (0, common_1.Patch)('sessions/:sessionId/complete'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Complete treatment session' }),
    (0, swagger_1.ApiParam)({ name: 'sessionId', description: 'Treatment session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment session completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment session not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot complete treatment session' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "completeTreatmentSession", null);
__decorate([
    (0, common_1.Post)('medical-records'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new medical record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medical record created successfully', type: treatment_interface_1.MedicalRecord }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof create_medical_record_dto_1.CreateMedicalRecordDto !== "undefined" && create_medical_record_dto_1.CreateMedicalRecordDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "createMedicalRecord", null);
__decorate([
    (0, common_1.Get)('patients/:patientId/medical-records'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get medical records for a patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of records to return (default: 50)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medical records retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findMedicalRecordsByPatient", null);
__decorate([
    (0, common_1.Get)('plans/:planId/quality-metrics'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate quality metrics for treatment plan' }),
    (0, swagger_1.ApiParam)({ name: 'planId', description: 'Treatment plan ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality metrics calculated successfully', type: treatment_interface_1.QualityMetrics }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Treatment plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "calculateQualityMetrics", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate treatment report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generated successfully', type: treatment_interface_1.TreatmentReport }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof generate_report_dto_1.GenerateReportDto !== "undefined" && generate_report_dto_1.GenerateReportDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "generateTreatmentReport", null);
__decorate([
    (0, common_1.Get)('protocols'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get available treatment protocols' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'stage', required: false, description: 'Cancer stage' }),
    (0, swagger_1.ApiQuery)({ name: 'lineOfTherapy', required: false, description: 'Line of therapy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment protocols retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('stage')),
    __param(2, (0, common_1.Query)('lineOfTherapy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getTreatmentProtocols", null);
__decorate([
    (0, common_1.Get)('analytics/treatment-outcomes'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment outcomes analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false, description: 'Start date for analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false, description: 'End date for analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Filter by cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'stage', required: false, description: 'Filter by cancer stage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment outcomes analytics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Query)('dateFrom')),
    __param(1, (0, common_1.Query)('dateTo')),
    __param(2, (0, common_1.Query)('cancerType')),
    __param(3, (0, common_1.Query)('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getTreatmentOutcomesAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/toxicity-profiles'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment toxicity profiles' }),
    (0, swagger_1.ApiQuery)({ name: 'treatmentType', required: false, description: 'Filter by treatment type' }),
    (0, swagger_1.ApiQuery)({ name: 'toxicityGrade', required: false, description: 'Filter by toxicity grade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Toxicity profiles retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Query)('treatmentType')),
    __param(1, (0, common_1.Query)('toxicityGrade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getToxicityProfiles", null);
__decorate([
    (0, common_1.Get)('schedules/:date'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment schedule for a specific date' }),
    (0, swagger_1.ApiParam)({ name: 'date', description: 'Date in YYYY-MM-DD format' }),
    (0, swagger_1.ApiQuery)({ name: 'department', required: false, description: 'Filter by department' }),
    (0, swagger_1.ApiQuery)({ name: 'modality', required: false, description: 'Filter by treatment modality' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment schedule retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Query)('department')),
    __param(2, (0, common_1.Query)('modality')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "getTreatmentSchedule", null);
exports.TreatmentsController = TreatmentsController = __decorate([
    (0, swagger_1.ApiTags)('treatments'),
    (0, common_1.Controller)('treatments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [treatments_service_1.TreatmentsService])
], TreatmentsController);
//# sourceMappingURL=treatments.controller.js.map