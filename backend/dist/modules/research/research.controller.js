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
exports.ResearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const research_service_1 = require("./research.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let ResearchController = class ResearchController {
    constructor(researchService) {
        this.researchService = researchService;
    }
    async createResearchRequest(createResearchRequestDto) {
        return await this.researchService.createResearchRequest(createResearchRequestDto);
    }
    async searchResearchRequests(searchQuery) {
        const data = { ...searchQuery };
        if (searchQuery.dateFrom) {
            data.dateFrom = new Date(searchQuery.dateFrom);
        }
        if (searchQuery.dateTo) {
            data.dateTo = new Date(searchQuery.dateTo);
        }
        return await this.researchService.getResearchRequests(data);
    }
    async getResearchRequestById(requestId) {
        return await this.researchService.getResearchRequestById(requestId);
    }
    async updateResearchRequest(requestId, updateData) {
        return await this.researchService.updateResearchRequest(requestId, updateData);
    }
    async approveResearchRequest(requestId, approvalData) {
        return await this.researchService.approveResearchRequest(requestId, approvalData.approvedBy, approvalData.comments);
    }
    async rejectResearchRequest(requestId, rejectionData) {
        return await this.researchService.rejectResearchRequest(requestId, rejectionData.rejectionReason, rejectionData.reviewedBy);
    }
    async requestEthicsReview(requestId) {
        return await this.researchService.requestEthicsReview(requestId);
    }
    async approveEthics(requestId, ethicsData) {
        return await this.researchService.approveEthics(requestId, ethicsData.approvedBy, ethicsData.ethicsNumber);
    }
    async exportResearchData(requestId, exportData) {
        return await this.researchService.exportResearchData(requestId, exportData.format, exportData.requestedBy);
    }
    async getResearchStatistics(centerId) {
        return await this.researchService.getResearchStatistics(centerId);
    }
    async getPendingRequests(centerId) {
        return await this.researchService.getResearchRequests({
            status: 'PENDING_REVIEW',
            centerId: centerId ? { principalInvestigator: { centerId } } : undefined,
        });
    }
    async getMyRequests(principalInvestigatorId) {
        return await this.researchService.getResearchRequests({
            principalInvestigatorId,
        });
    }
    async getEthicsPendingRequests(centerId) {
        return await this.researchService.getResearchRequests({
            ethicsStatus: 'PENDING',
            centerId: centerId ? { principalInvestigator: { centerId } } : undefined,
        });
    }
    async createObservationalStudyRequest(studyData) {
        return await this.researchService.createResearchRequest({
            title: `Observational Study: ${studyData.title}`,
            description: studyData.description,
            principalInvestigatorId: studyData.principalInvestigatorId,
            studyType: 'OBSERVATIONAL',
            objectives: studyData.objectives,
            methodology: `Retrospective and prospective observational study of ${studyData.cancerType} patients`,
            inclusionCriteria: `Patients diagnosed with ${studyData.cancerType}`,
            exclusionCriteria: `Patients without confirmed ${studyData.cancerType} diagnosis`,
            sampleSize: studyData.sampleSize,
            duration: studyData.duration,
            requiresEthicsApproval: true,
            dataRequested: `Patient demographics, diagnosis, treatment, and outcomes data for ${studyData.cancerType}`,
            confidentialityRequirements: 'All patient data will be de-identified and stored securely',
            fundingSource: studyData.fundingSource,
        });
    }
    async createClinicalOutcomeStudyRequest(outcomeData) {
        return await this.researchService.createResearchRequest({
            title: `Clinical Outcome Study: ${outcomeData.title}`,
            description: outcomeData.description,
            principalInvestigatorId: outcomeData.principalInvestigatorId,
            studyType: 'COHORT',
            objectives: outcomeData.objectives,
            methodology: `Prospective cohort study analyzing outcomes of ${outcomeData.treatmentType} in ${outcomeData.cancerType} patients`,
            inclusionCriteria: `Patients with ${outcomeData.cancerType} receiving ${outcomeData.treatmentType}`,
            exclusionCriteria: `Patients with incomplete treatment data or lost to follow-up`,
            sampleSize: outcomeData.sampleSize,
            duration: outcomeData.duration,
            requiresEthicsApproval: true,
            dataRequested: `Treatment details, response rates, survival outcomes, and adverse events data`,
            confidentialityRequirements: 'Strict confidentiality with limited access to treatment outcomes',
            fundingSource: outcomeData.fundingSource,
        });
    }
    async createRegistryBasedStudyRequest(registryData) {
        return await this.researchService.createResearchRequest({
            title: `Registry-Based Study: ${registryData.title}`,
            description: registryData.description,
            principalInvestigatorId: registryData.principalInvestigatorId,
            studyType: 'REGISTRY_BASED',
            objectives: registryData.objectives,
            methodology: 'Registry-based retrospective analysis using cancer registry data',
            inclusionCriteria: 'All patients in the cancer registry meeting study criteria',
            exclusionCriteria: 'Patients with incomplete or missing data elements',
            sampleSize: registryData.sampleSize,
            duration: registryData.duration,
            requiresEthicsApproval: true,
            dataRequested: `Registry data including: ${registryData.dataElements.join(', ')}`,
            confidentialityRequirements: 'Registry data with standard privacy protections',
            fundingSource: registryData.fundingSource,
        });
    }
    async createQualityImprovementStudyRequest(qualityData) {
        return await this.researchService.createResearchRequest({
            title: `Quality Improvement Study: ${qualityData.title}`,
            description: qualityData.description,
            principalInvestigatorId: qualityData.principalInvestigatorId,
            studyType: 'OBSERVATIONAL',
            objectives: qualityData.objectives,
            methodology: `Quality improvement study focusing on ${qualityData.qualityMetrics.join(', ')}`,
            inclusionCriteria: 'Relevant patient cases for quality metrics analysis',
            exclusionCriteria: 'Cases not meeting inclusion criteria for quality assessment',
            sampleSize: 500,
            duration: qualityData.duration,
            requiresEthicsApproval: false,
            dataRequested: `Quality metrics data: ${qualityData.qualityMetrics.join(', ')}, ${qualityData.baselineData}`,
            confidentialityRequirements: 'Quality improvement data with limited identifiers',
            fundingSource: qualityData.fundingSource,
        });
    }
};
exports.ResearchController = ResearchController;
__decorate([
    (0, common_1.Post)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new research request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Research request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "createResearchRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Search research requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research requests retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ResearchRequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'studyType', required: false, enum: client_1.StudyType }),
    (0, swagger_1.ApiQuery)({ name: 'principalInvestigatorId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'ethicsStatus', required: false, enum: client_1.EthicsStatus }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "searchResearchRequests", null);
__decorate([
    (0, common_1.Get)('requests/:requestId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research request by ID' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Research request not found' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "getResearchRequestById", null);
__decorate([
    (0, common_1.Put)('requests/:requestId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update research request' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Research request not found' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "updateResearchRequest", null);
__decorate([
    (0, common_1.Put)('requests/:requestId/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve research request' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request approved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('APPROVE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "approveResearchRequest", null);
__decorate([
    (0, common_1.Put)('requests/:requestId/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject research request' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request rejected successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('REJECT_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "rejectResearchRequest", null);
__decorate([
    (0, common_1.Put)('requests/:requestId/ethics/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Request ethics review' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ethics review requested successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('REQUEST_ETHICS_REVIEW'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "requestEthicsReview", null);
__decorate([
    (0, common_1.Put)('requests/:requestId/ethics/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve ethics for research request' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ethics approved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('APPROVE_ETHICS'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "approveEthics", null);
__decorate([
    (0, common_1.Post)('requests/:requestId/export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export research data' }),
    (0, swagger_1.ApiParam)({ name: 'requestId', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data export initiated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_EXPORT'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('EXPORT_RESEARCH_DATA'),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "exportResearchData", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "getResearchStatistics", null);
__decorate([
    (0, common_1.Get)('requests/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending research requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('requests/my-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my research requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'My requests retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    __param(0, (0, common_1.Query)('principalInvestigatorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "getMyRequests", null);
__decorate([
    (0, common_1.Get)('ethics/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get requests pending ethics review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ethics pending requests retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "getEthicsPendingRequests", null);
__decorate([
    (0, common_1.Post)('templates/observational-study'),
    (0, swagger_1.ApiOperation)({ summary: 'Create observational study request template' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_OBSERVATIONAL_STUDY_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "createObservationalStudyRequest", null);
__decorate([
    (0, common_1.Post)('templates/clinical-outcome-study'),
    (0, swagger_1.ApiOperation)({ summary: 'Create clinical outcome study request template' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_OUTCOME_STUDY_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "createClinicalOutcomeStudyRequest", null);
__decorate([
    (0, common_1.Post)('templates/registry-based-study'),
    (0, swagger_1.ApiOperation)({ summary: 'Create registry-based study request template' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_REGISTRY_STUDY_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "createRegistryBasedStudyRequest", null);
__decorate([
    (0, common_1.Post)('templates/quality-improvement-study'),
    (0, swagger_1.ApiOperation)({ summary: 'Create quality improvement study request template' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_QUALITY_IMPROVEMENT_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchController.prototype, "createQualityImprovementStudyRequest", null);
exports.ResearchController = ResearchController = __decorate([
    (0, swagger_1.ApiTags)('Research Management'),
    (0, common_1.Controller)('research'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [research_service_1.ResearchService])
], ResearchController);
//# sourceMappingURL=research.controller.js.map