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
exports.ResearchSprint3Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const research_service_sprint3_1 = require("./research.service.sprint3");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const create_research_request_dto_1 = require("./dto/create-research-request.dto");
const create_approval_dto_1 = require("./dto/create-approval.dto");
const search_research_dto_1 = require("./dto/search-research.dto");
const data_access_dto_1 = require("./dto/data-access.dto");
const client_1 = require("@prisma/client");
let ResearchSprint3Controller = class ResearchSprint3Controller {
    constructor(researchService) {
        this.researchService = researchService;
    }
    async getAggregateStatistics(queryDto, req) {
        return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
    }
    async getCancerTrends(query, req) {
        const queryDto = {
            ...query,
            includeTrends: true,
            aggregateFunction: 'trend',
        };
        return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
    }
    async getDemographicAnalysis(query, req) {
        const queryDto = {
            ...query,
            groupBy: 'demographics',
            aggregateFunction: 'demographic',
        };
        return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
    }
    async getGeographicData(geoDto, req) {
        return await this.researchService.getGeographicData(geoDto, req.user.userId);
    }
    async getCancerHotspots(query, req) {
        const geoDto = {
            ...query,
            mapType: 'heatmap',
            metric: 'incidence_rate',
        };
        return await this.researchService.getGeographicData(geoDto, req.user.userId);
    }
    async getProvincialStatistics(query, req) {
        const geoDto = {
            ...query,
            groupBy: 'province',
        };
        return await this.researchService.getGeographicData(geoDto, req.user.userId);
    }
    async createResearchRequest(createResearchRequestDto, req) {
        return await this.researchService.createResearchRequest(createResearchRequestDto, req.user.userId);
    }
    async getResearchRequests(searchDto, req) {
        return await this.researchService.getResearchRequests(searchDto, req.user.userId);
    }
    async getResearchRequestById(id, req) {
        return await this.researchService.getResearchRequestById(id, req.user.userId);
    }
    async updateResearchRequest(id, updateResearchRequestDto, req) {
        return await this.researchService.updateResearchRequest(id, updateResearchRequestDto, req.user.userId);
    }
    async createApproval(createApprovalDto, req) {
        return await this.researchService.createApproval(createApprovalDto, req.user.userId);
    }
    async getApprovalsByResearchRequest(id, req) {
        return await this.researchService.getApprovalsByResearchRequest(id, req.user.userId);
    }
    async updateApproval(id, updateApprovalDto, req) {
        return await this.researchService.updateApproval(id, updateApprovalDto, req.user.userId);
    }
    async getMyApprovals(query, req) {
        return await this.researchService.getMyApprovals(query, req.user.userId);
    }
    async createCollaboration(createCollaborationDto, req) {
        return await this.researchService.createCollaboration(createCollaborationDto, req.user.userId);
    }
    async updateCollaborationStatus(id, status, req) {
        return await this.researchService.updateCollaborationStatus(id, status, req.user.userId);
    }
    async getCollaborations(id, searchDto, req) {
        return await this.researchService.getCollaborations(id, searchDto, req.user.userId);
    }
    async getMyCollaborations(query, req) {
        return await this.researchService.getMyCollaborations(query, req.user.userId);
    }
    async createDataAccessSession(createSessionDto, req) {
        return await this.researchService.createDataAccessSession(createSessionDto, req.user.userId);
    }
    async endDataAccessSession(id, updateData, req) {
        return await this.researchService.endDataAccessSession(id, new Date(), updateData.dataAccessed, updateData.queriesExecuted, req.user.userId);
    }
    async getDataAccessSessions(searchDto, req) {
        return await this.researchService.getDataAccessSessions(searchDto, req.user.userId);
    }
    async getMyDataAccessSessions(query, req) {
        return await this.researchService.getMyDataAccessSessions(query, req.user.userId);
    }
    async createImpactMetric(metricData, req) {
        return await this.researchService.createImpactMetric(metricData, req.user.userId);
    }
    async getImpactMetrics(id, searchDto, req) {
        return await this.researchService.getImpactMetrics(id, searchDto, req.user.userId);
    }
    async createPublication(publicationData, req) {
        return await this.researchService.createPublication(publicationData, req.user.userId);
    }
    async getPublications(id, searchDto, req) {
        return await this.researchService.getPublications(id, searchDto, req.user.userId);
    }
    async getDashboardOverview(req) {
        return await this.researchService.getDashboardOverview(req.user.userId);
    }
    async getWorkflowAnalytics(query, req) {
        return await this.researchService.getWorkflowAnalytics(query, req.user.userId);
    }
    async getComplianceAnalytics(query, req) {
        return await this.researchService.getComplianceAnalytics(query, req.user.userId);
    }
    async getResearchStats(req) {
        return await this.researchService.getResearchStats(req.user.userId);
    }
    async exportCleanData(query, req, res) {
        return await this.researchService.exportCleanData(query, res, req.user.userId);
    }
    async validateResearchRequest(requestData, req) {
        return await this.researchService.validateResearchRequest(requestData, req.user.userId);
    }
};
exports.ResearchSprint3Controller = ResearchSprint3Controller;
__decorate([
    (0, common_1.Get)('aggregate-statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregate cancer statistics with privacy controls' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aggregate statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_AGGREGATE'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_AGGREGATE_STATISTICS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_access_dto_1.AggregateDataQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getAggregateStatistics", null);
__decorate([
    (0, common_1.Get)('cancer-trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer trends over time' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Filter by cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'yearRange', required: false, description: 'Year range (e.g., 2018-2023)' }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, description: 'Filter by location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trends data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_AGGREGATE'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_CANCER_TRENDS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getCancerTrends", null);
__decorate([
    (0, common_1.Get)('demographic-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get demographic analysis of cancer data' }),
    (0, swagger_1.ApiQuery)({ name: 'ageGroups', required: false, description: 'Age groups to analyze' }),
    (0, swagger_1.ApiQuery)({ name: 'genders', required: false, description: 'Genders to include' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerTypes', required: false, description: 'Cancer types to analyze' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demographic analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_AGGREGATE'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_DEMOGRAPHIC_ANALYSIS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getDemographicAnalysis", null);
__decorate([
    (0, common_1.Get)('geographic-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Get geographic cancer data for Indonesia map visualization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Geographic data retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_GEOGRAPHIC'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_GEOGRAPHIC_DATA'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_access_dto_1.GeographicVisualizationDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getGeographicData", null);
__decorate([
    (0, common_1.Get)('cancer-hotspots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer hotspots visualization data' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Filter by cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, description: 'Filter by year' }),
    (0, swagger_1.ApiQuery)({ name: 'intensity', required: false, description: 'Hotspot intensity level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer hotspots data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_GEOGRAPHIC'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_CANCER_HOTSPOTS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getCancerHotspots", null);
__decorate([
    (0, common_1.Get)('provincial-statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get provincial cancer statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false, description: 'Specific province' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, description: 'Filter by year' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Provincial statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_GEOGRAPHIC'),
    (0, audit_log_decorator_1.AuditLog)('ACCESS_PROVINCIAL_STATISTICS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getProvincialStatistics", null);
__decorate([
    (0, common_1.Post)('research-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new research data request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Research request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_research_request_dto_1.CreateResearchRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createResearchRequest", null);
__decorate([
    (0, common_1.Get)('research-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter research requests' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search by title or description' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ResearchRequestStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'studyType', required: false, description: 'Filter by study type' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research requests retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('SEARCH_RESEARCH_REQUESTS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_research_dto_1.SearchResearchRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getResearchRequests", null);
__decorate([
    (0, common_1.Get)('research-requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research request by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Research request not found' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getResearchRequestById", null);
__decorate([
    (0, common_1.Put)('research-requests/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update research request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research request updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Research request not found' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_research_request_dto_1.UpdateResearchRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "updateResearchRequest", null);
__decorate([
    (0, common_1.Post)('approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update research approval' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Approval created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid approval data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient approval permissions' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_RESEARCH_APPROVAL'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_approval_dto_1.CreateApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createApproval", null);
__decorate([
    (0, common_1.Get)('research-requests/:id/approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all approvals for a research request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approvals retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_RESEARCH_APPROVALS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getApprovalsByResearchRequest", null);
__decorate([
    (0, common_1.Put)('approvals/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update approval status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Approval ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_RESEARCH_APPROVAL'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_approval_dto_1.UpdateApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "updateApproval", null);
__decorate([
    (0, common_1.Get)('my-approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals for current user' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.ApprovalStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending approvals retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_APPROVE'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_PENDING_APPROVALS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getMyApprovals", null);
__decorate([
    (0, common_1.Post)('collaborations'),
    (0, swagger_1.ApiOperation)({ summary: 'Create research collaboration invitation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Collaboration invitation sent successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_COLLABORATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_COLLABORATION'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_research_request_dto_1.CreateCollaborationDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createCollaboration", null);
__decorate([
    (0, common_1.Put)('collaborations/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update collaboration status (accept/decline)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Collaboration ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.CollaborationStatus, description: 'New collaboration status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collaboration status updated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_COLLABORATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_COLLABORATION_STATUS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.CollaborationStatus !== "undefined" && client_1.CollaborationStatus) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "updateCollaborationStatus", null);
__decorate([
    (0, common_1.Get)('research-requests/:id/collaborations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get collaborations for a research request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collaborations retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_COLLABORATIONS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_research_dto_1.SearchCollaborationDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getCollaborations", null);
__decorate([
    (0, common_1.Get)('my-collaborations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user collaboration invitations' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.CollaborationStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collaborations retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_COLLABORATE'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_MY_COLLABORATIONS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getMyCollaborations", null);
__decorate([
    (0, common_1.Post)('data-access-sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Start data access session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data access session created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient data access permissions' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_SESSION'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_DATA_ACCESS_SESSION'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_access_dto_1.CreateDataAccessSessionDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createDataAccessSession", null);
__decorate([
    (0, common_1.Put)('data-access-sessions/:id/end'),
    (0, swagger_1.ApiOperation)({ summary: 'End data access session' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data access session ended successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_SESSION'),
    (0, audit_log_decorator_1.AuditLog)('END_DATA_ACCESS_SESSION'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "endDataAccessSession", null);
__decorate([
    (0, common_1.Get)('data-access-sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Search data access sessions' }),
    (0, swagger_1.ApiQuery)({ name: 'researchRequestId', required: false, description: 'Filter by research request' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user' }),
    (0, swagger_1.ApiQuery)({ name: 'complianceStatus', required: false, enum: client_1.ComplianceStatus, description: 'Filter by compliance status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data access sessions retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_AUDIT'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_DATA_ACCESS_SESSIONS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_access_dto_1.SearchDataAccessSessionDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getDataAccessSessions", null);
__decorate([
    (0, common_1.Get)('my-data-access-sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user data access sessions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data access sessions retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_SESSION'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_MY_DATA_ACCESS_SESSIONS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getMyDataAccessSessions", null);
__decorate([
    (0, common_1.Post)('impact-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Create research impact metric' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Impact metric created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_IMPACT_TRACK'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_IMPACT_METRIC'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createImpactMetric", null);
__decorate([
    (0, common_1.Get)('research-requests/:id/impact-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get impact metrics for research request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiQuery)({ name: 'metricType', required: false, enum: client_1.ImpactMetricType, description: 'Filter by metric type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Impact metrics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_IMPACT_METRICS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_research_dto_1.SearchImpactMetricDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getImpactMetrics", null);
__decorate([
    (0, common_1.Post)('publications'),
    (0, swagger_1.ApiOperation)({ summary: 'Create research publication record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Publication created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_PUBLICATION'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_PUBLICATION'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "createPublication", null);
__decorate([
    (0, common_1.Get)('research-requests/:id/publications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get publications for research request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Research request ID' }),
    (0, swagger_1.ApiQuery)({ name: 'publicationType', required: false, enum: client_1.PublicationType, description: 'Filter by publication type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publications retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_PUBLICATIONS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_research_dto_1.SearchPublicationDto, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getPublications", null);
__decorate([
    (0, common_1.Get)('dashboard/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research dashboard overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard overview retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_DASHBOARD'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_RESEARCH_DASHBOARD'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getDashboardOverview", null);
__decorate([
    (0, common_1.Get)('analytics/workflow'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research workflow analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateRange', required: false, description: 'Date range for analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workflow analytics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_ANALYTICS'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_WORKFLOW_ANALYTICS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getWorkflowAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'dateRange', required: false, description: 'Date range for analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance analytics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_ACCESS_AUDIT'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_COMPLIANCE_ANALYTICS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getComplianceAnalytics", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research statistics summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('VIEW_RESEARCH_STATS'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "getResearchStats", null);
__decorate([
    (0, common_1.Get)('export/clean-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Export de-identified research data' }),
    (0, swagger_1.ApiQuery)({ name: 'researchRequestId', required: true, description: 'Research request ID' }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false, description: 'Export format (csv, json, xlsx)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_EXPORT'),
    (0, audit_log_decorator_1.AuditLog)('EXPORT_RESEARCH_DATA'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "exportCleanData", null);
__decorate([
    (0, common_1.Post)('validate-request'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate research request before submission' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Request validation completed' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('VALIDATE_RESEARCH_REQUEST'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResearchSprint3Controller.prototype, "validateResearchRequest", null);
exports.ResearchSprint3Controller = ResearchSprint3Controller = __decorate([
    (0, swagger_1.ApiTags)('Research Discovery & Collaboration (Sprint 3)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('research-sprint3'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [research_service_sprint3_1.ResearchSprint3Service])
], ResearchSprint3Controller);
//# sourceMappingURL=research.controller.sprint3.js.map