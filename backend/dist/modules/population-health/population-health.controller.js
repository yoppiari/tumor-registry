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
exports.PopulationHealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const population_health_service_1 = require("./population-health.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
let PopulationHealthController = class PopulationHealthController {
    constructor(populationHealthService) {
        this.populationHealthService = populationHealthService;
    }
    async getOverview(province, regency) {
        return await this.populationHealthService.getPopulationHealthOverview(province, regency);
    }
    async getIncidenceByRegion(level = 'province') {
        return await this.populationHealthService.getCancerIncidenceByRegion(level);
    }
    async getScreeningEffectiveness() {
        return await this.populationHealthService.getScreeningProgramEffectiveness();
    }
    async getHealthcareAccessAnalysis() {
        return await this.populationHealthService.getHealthcareAccessAnalysis();
    }
    async getRiskFactorAnalysis() {
        return await this.populationHealthService.getRiskFactorAnalysis();
    }
    async getPopulationProjections(years) {
        return await this.populationHealthService.getPopulationProjections(years ? parseInt(years) : 10);
    }
    async getHealthEconomicAnalysis() {
        return await this.populationHealthService.getHealthEconomicAnalysis();
    }
    async generateReport(reportData) {
        const filters = {
            ...reportData.filters,
            dateFrom: reportData.filters?.dateFrom ? new Date(reportData.filters.dateFrom) : undefined,
            dateTo: reportData.filters?.dateTo ? new Date(reportData.filters.dateTo) : undefined,
        };
        return await this.populationHealthService.generatePopulationHealthReport(reportData.reportType, filters);
    }
    async getNationalOverview() {
        return await this.populationHealthService.getPopulationHealthOverview();
    }
    async getBreastCancerPopulationStats(province) {
        return await this.populationHealthService.getPopulationHealthOverview(province);
    }
    async getCervicalCancerPopulationStats(province) {
        return await this.populationHealthService.getPopulationHealthOverview(province);
    }
    async getPreventionImpactAnalysis() {
        return {
            message: 'Prevention impact analysis endpoint',
            data: {
                smokingReduction: {
                    casesPrevented: 4567,
                    costSavings: 125000000,
                    qalyGained: 12345,
                },
                vaccinationImpact: {
                    casesPrevented: 2345,
                    costSavings: 89000000,
                    qalyGained: 8765,
                },
                screeningImpact: {
                    earlyDetections: 6789,
                    stageShift: 35.2,
                    survivalImprovement: 22.8,
                },
            },
        };
    }
    async getHealthDisparitiesAnalysis() {
        return {
            message: 'Health disparities analysis endpoint',
            data: {
                urbanRural: {
                    urban: { incidence: 142.3, mortality: 85.6, survival: 68.5 },
                    rural: { incidence: 178.9, mortality: 112.4, survival: 52.3 },
                },
                socioeconomic: {
                    low: { incidence: 189.4, mortality: 125.6, survival: 45.2 },
                    middle: { incidence: 156.2, mortality: 92.4, survival: 62.8 },
                    high: { incidence: 134.7, mortality: 78.9, survival: 74.5 },
                },
                education: {
                    primary: { incidence: 198.5, mortality: 134.2, survival: 42.1 },
                    secondary: { incidence: 159.3, mortality: 95.7, survival: 61.3 },
                    tertiary: { incidence: 128.9, mortality: 71.4, survival: 78.6 },
                },
            },
        };
    }
    async getCancerHotspots(cancerType, heatLevel) {
        return {
            message: 'Cancer hotspot mapping endpoint',
            filters: { cancerType, heatLevel },
            data: {
                hotspots: [
                    { province: 'DKI Jakarta', regency: 'Jakarta Pusat', intensity: 0.85, cases: 4567 },
                    { province: 'Jawa Barat', regency: 'Bandung', intensity: 0.72, cases: 3234 },
                    { province: 'Jawa Tengah', regency: 'Semarang', intensity: 0.68, cases: 2876 },
                    { province: 'Jawa Timur', regency: 'Surabaya', intensity: 0.79, cases: 3892 },
                ],
                metadata: {
                    totalAreas: 514,
                    highRiskAreas: 23,
                    mediumRiskAreas: 156,
                    lowRiskAreas: 335,
                },
            },
        };
    }
    async getTimeSeriesTrends(metric, period = 'yearly', years) {
        return {
            message: 'Time series trends analysis endpoint',
            filters: { metric, period, years: years ? parseInt(years) : 5 },
            data: {
                series: [
                    { year: 2019, incidence: 142.3, mortality: 87.6, survival: 62.4 },
                    { year: 2020, incidence: 148.7, mortality: 89.2, survival: 63.1 },
                    { year: 2021, incidence: 151.2, mortality: 90.8, survival: 64.2 },
                    { year: 2022, incidence: 154.6, mortality: 91.5, survival: 65.3 },
                    { year: 2023, incidence: 156.2, mortality: 92.4, survival: 66.1 },
                ],
                trends: {
                    incidence: { direction: 'increasing', rate: 1.9, significance: 'p<0.05' },
                    mortality: { direction: 'stable', rate: 0.8, significance: 'p>0.05' },
                    survival: { direction: 'increasing', rate: 1.2, significance: 'p<0.01' },
                },
            },
        };
    }
    async getComparativeAnalysis(query) {
        return {
            message: 'Comparative population health analysis endpoint',
            filters: query,
            data: {
                regions: [
                    {
                        name: 'DKI Jakarta',
                        incidence: 178.9,
                        mortality: 98.4,
                        screening: 42.3,
                        healthcareAccess: 89.2,
                        rank: 1,
                    },
                    {
                        name: 'Jawa Barat',
                        incidence: 156.2,
                        mortality: 89.7,
                        screening: 28.7,
                        healthcareAccess: 72.4,
                        rank: 2,
                    },
                    {
                        name: 'Jawa Tengah',
                        incidence: 143.8,
                        mortality: 85.2,
                        screening: 31.4,
                        healthcareAccess: 68.9,
                        rank: 3,
                    },
                ],
                benchmarks: {
                    nationalAverage: { incidence: 156.2, mortality: 92.4, screening: 35.1, healthcareAccess: 76.8 },
                    bestPractice: { incidence: 128.7, mortality: 74.3, screening: 58.9, healthcareAccess: 92.4 },
                },
            },
        };
    }
    async getRealTimeDashboard() {
        return {
            message: 'Real-time population health dashboard',
            lastUpdated: new Date(),
            metrics: {
                currentCases: 124567,
                newCasesToday: 342,
                activeScreening: 8934,
                highRiskAreas: 23,
                alerts: [
                    {
                        type: 'outbreak',
                        location: 'Jakarta Pusat',
                        severity: 'medium',
                        message: 'Unusual increase in lung cancer cases detected',
                    },
                    {
                        type: 'resource',
                        location: 'Bandung',
                        severity: 'high',
                        message: 'Radiotherapy capacity exceeded by 20%',
                    },
                ],
            },
        };
    }
};
exports.PopulationHealthController = PopulationHealthController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get population health overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Population health overview retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'regency', required: false }),
    __param(0, (0, common_1.Query)('province')),
    __param(1, (0, common_1.Query)('regency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('incidence-by-region'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer incidence by region' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regional cancer incidence data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, enum: ['province', 'regency'], description: 'Geographic level' }),
    __param(0, (0, common_1.Query)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getIncidenceByRegion", null);
__decorate([
    (0, common_1.Get)('screening-effectiveness'),
    (0, swagger_1.ApiOperation)({ summary: 'Get screening program effectiveness' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Screening effectiveness data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getScreeningEffectiveness", null);
__decorate([
    (0, common_1.Get)('healthcare-access'),
    (0, swagger_1.ApiOperation)({ summary: 'Get healthcare access analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Healthcare access analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getHealthcareAccessAnalysis", null);
__decorate([
    (0, common_1.Get)('risk-factors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get risk factor analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk factor analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getRiskFactorAnalysis", null);
__decorate([
    (0, common_1.Get)('population-projections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get population health projections' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Population projections retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'years', required: false, type: Number, description: 'Number of years to project' }),
    __param(0, (0, common_1.Query)('years')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getPopulationProjections", null);
__decorate([
    (0, common_1.Get)('health-economics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health economic analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health economic analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getHealthEconomicAnalysis", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate population health report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_EXPORT'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_POPULATION_HEALTH_REPORT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('statistics/national-overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get national population health statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'National statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getNationalOverview", null);
__decorate([
    (0, common_1.Get)('statistics/breast-cancer-population'),
    (0, swagger_1.ApiOperation)({ summary: 'Get breast cancer population statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Breast cancer population statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false }),
    __param(0, (0, common_1.Query)('province')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getBreastCancerPopulationStats", null);
__decorate([
    (0, common_1.Get)('statistics/cervical-cancer-population'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cervical cancer population statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cervical cancer population statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false }),
    __param(0, (0, common_1.Query)('province')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getCervicalCancerPopulationStats", null);
__decorate([
    (0, common_1.Get)('analytics/prevention-impact'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prevention program impact analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prevention impact analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getPreventionImpactAnalysis", null);
__decorate([
    (0, common_1.Get)('analytics/health-disparities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get health disparities analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health disparities analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getHealthDisparitiesAnalysis", null);
__decorate([
    (0, common_1.Get)('maps/cancer-hotspots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer hotspot mapping data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer hotspot data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'heatLevel', required: false, enum: ['high', 'medium', 'low'] }),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('heatLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getCancerHotspots", null);
__decorate([
    (0, common_1.Get)('trends/time-series'),
    (0, swagger_1.ApiOperation)({ summary: 'Get time series trends analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time series trends retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'metric', required: false, enum: ['incidence', 'mortality', 'survival', 'screening'] }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['monthly', 'quarterly', 'yearly'] }),
    (0, swagger_1.ApiQuery)({ name: 'years', required: false, type: Number }),
    __param(0, (0, common_1.Query)('metric')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('years')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getTimeSeriesTrends", null);
__decorate([
    (0, common_1.Get)('reports/comparative-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comparative population health analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comparative analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getComparativeAnalysis", null);
__decorate([
    (0, common_1.Get)('dashboards/real-time'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time population health dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Real-time dashboard data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PopulationHealthController.prototype, "getRealTimeDashboard", null);
exports.PopulationHealthController = PopulationHealthController = __decorate([
    (0, swagger_1.ApiTags)('Population Health'),
    (0, common_1.Controller)('population-health'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [population_health_service_1.PopulationHealthService])
], PopulationHealthController);
//# sourceMappingURL=population-health.controller.js.map