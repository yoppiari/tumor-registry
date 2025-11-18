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
exports.CancerRegistryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cancer_registry_service_1 = require("./cancer-registry.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
const client_1 = require("@prisma/client");
let CancerRegistryController = class CancerRegistryController {
    constructor(cancerRegistryService) {
        this.cancerRegistryService = cancerRegistryService;
    }
    async getOverview(centerId, dateFrom, dateTo) {
        return await this.cancerRegistryService.getCancerRegistryOverview(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, centerId);
    }
    async getIncidenceTrends(years, centerId) {
        return await this.cancerRegistryService.getCancerIncidenceTrends(years ? parseInt(years) : 5, centerId);
    }
    async getSurvivalAnalysis(cancerType, stage, centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis(cancerType, stage, centerId);
    }
    async getTreatmentOutcomes(cancerType, treatmentType, centerId) {
        return await this.cancerRegistryService.getTreatmentOutcomes(cancerType, treatmentType, centerId);
    }
    async getEpidemiologicalReport(centerId) {
        return await this.cancerRegistryService.getEpidemiologicalReport(centerId);
    }
    async getQualityMetrics(centerId) {
        return await this.cancerRegistryService.getQualityMetrics(centerId);
    }
    async exportRegistryData(exportData) {
        const filters = {
            ...exportData.filters,
            dateFrom: exportData.filters?.dateFrom ? new Date(exportData.filters.dateFrom) : undefined,
            dateTo: exportData.filters?.dateTo ? new Date(exportData.filters.dateTo) : undefined,
        };
        return await this.cancerRegistryService.exportRegistryData(exportData.format, filters);
    }
    async getBreastCancerStatistics(centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis('Breast Cancer', undefined, centerId);
    }
    async getLungCancerStatistics(centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis('Lung Cancer', undefined, centerId);
    }
    async getColorectalCancerStatistics(centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis('Colorectal Cancer', undefined, centerId);
    }
    async getCervicalCancerStatistics(centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis('Cervical Cancer', undefined, centerId);
    }
    async getStageDistributionAnalysis(cancerType, centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis(cancerType, undefined, centerId);
    }
    async getAgeGroupStatistics(centerId) {
        return {
            message: 'Age group statistics endpoint',
            centerId,
        };
    }
    async getGenderDistribution(cancerType, centerId) {
        return await this.cancerRegistryService.getSurvivalAnalysis(cancerType, undefined, centerId);
    }
    async getAnnualSummary(year, centerId) {
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        return await this.cancerRegistryService.getCancerRegistryOverview(new Date(targetYear, 0, 1), new Date(targetYear, 11, 31), centerId);
    }
    async getComparativeAnalysis(query) {
        return {
            message: 'Comparative analysis endpoint',
            query,
        };
    }
};
exports.CancerRegistryController = CancerRegistryController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer registry overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer registry overview retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('incidence-trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer incidence trends' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer incidence trends retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'years', required: false, type: Number, description: 'Number of years to analyze' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('years')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getIncidenceTrends", null);
__decorate([
    (0, common_1.Get)('survival-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get survival analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Survival analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'stage', required: false, enum: client_1.CancerStage }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('stage')),
    __param(2, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof client_1.CancerStage !== "undefined" && client_1.CancerStage) === "function" ? _a : Object, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getSurvivalAnalysis", null);
__decorate([
    (0, common_1.Get)('treatment-outcomes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get treatment outcomes analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment outcomes retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'treatmentType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('treatmentType')),
    __param(2, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getTreatmentOutcomes", null);
__decorate([
    (0, common_1.Get)('epidemiological-report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive epidemiological report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Epidemiological report generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getEpidemiologicalReport", null);
__decorate([
    (0, common_1.Get)('quality-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer registry quality metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality metrics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getQualityMetrics", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export cancer registry data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data exported successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_EXPORT'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('EXPORT_CANCER_REGISTRY'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "exportRegistryData", null);
__decorate([
    (0, common_1.Get)('statistics/breast-cancer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get breast cancer specific statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Breast cancer statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getBreastCancerStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/lung-cancer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lung cancer specific statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lung cancer statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getLungCancerStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/colorectal-cancer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get colorectal cancer specific statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Colorectal cancer statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getColorectalCancerStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/cervical-cancer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cervical cancer specific statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cervical cancer statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getCervicalCancerStatistics", null);
__decorate([
    (0, common_1.Get)('analytics/stage-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed stage distribution analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stage distribution analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getStageDistributionAnalysis", null);
__decorate([
    (0, common_1.Get)('analytics/age-groups'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer statistics by age groups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Age group statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getAgeGroupStatistics", null);
__decorate([
    (0, common_1.Get)('analytics/gender-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer statistics by gender' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gender distribution statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getGenderDistribution", null);
__decorate([
    (0, common_1.Get)('reports/annual-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get annual cancer registry summary report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Annual summary report generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getAnnualSummary", null);
__decorate([
    (0, common_1.Get)('reports/comparative-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comparative analysis between periods or centers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparative analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_READ'),
    (0, swagger_1.ApiQuery)({ name: 'period1Start', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'period1End', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'period2Start', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'period2End', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'center1Id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'center2Id', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CancerRegistryController.prototype, "getComparativeAnalysis", null);
exports.CancerRegistryController = CancerRegistryController = __decorate([
    (0, swagger_1.ApiTags)('Cancer Registry'),
    (0, common_1.Controller)('cancer-registry'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [cancer_registry_service_1.CancerRegistryService])
], CancerRegistryController);
//# sourceMappingURL=cancer-registry.controller.js.map