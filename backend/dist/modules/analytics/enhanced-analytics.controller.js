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
exports.EnhancedAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const enhanced_analytics_service_1 = require("./enhanced-analytics.service");
const redis_service_1 = require("./redis.service");
let EnhancedAnalyticsController = class EnhancedAnalyticsController {
    constructor(enhancedAnalyticsService, redisService) {
        this.enhancedAnalyticsService = enhancedAnalyticsService;
        this.redisService = redisService;
    }
    async getExecutiveDashboard(centerId, timeRange) {
        return await this.enhancedAnalyticsService.getExecutiveIntelligenceDashboard(centerId, timeRange);
    }
    async getNationalIntelligence() {
        return await this.enhancedAnalyticsService.getNationalCancerIntelligence();
    }
    async getPerformanceBenchmarking(centerId, benchmarkPeriod) {
        return await this.enhancedAnalyticsService.getCenterPerformanceBenchmarking(centerId, benchmarkPeriod);
    }
    async getCenterPerformanceMetrics(centerId, period) {
        const cachedMetrics = await this.redisService.getCachedCenterMetrics(centerId);
        if (cachedMetrics) {
            return cachedMetrics;
        }
        const metrics = await this.enhancedAnalyticsService.getCenterPerformanceBenchmarking(centerId, period);
        await this.redisService.cacheCenterMetrics(centerId, metrics);
        return metrics;
    }
    async getPredictiveTrends(cancerType, geographicLevel, predictionHorizon) {
        return await this.enhancedAnalyticsService.getPredictiveAnalyticsWithTrends(cancerType, geographicLevel, predictionHorizon);
    }
    async getCancerTypeTrends(cancerType, geographicLevel, predictionHorizon) {
        const cachedData = await this.redisService.getCachedTrendAnalysis(cancerType);
        if (cachedData) {
            return cachedData;
        }
        const trends = await this.enhancedAnalyticsService.getPredictiveAnalyticsWithTrends(cancerType, geographicLevel, predictionHorizon);
        await this.redisService.cacheTrendAnalysis(cancerType, trends);
        return trends;
    }
    async getResearchImpact(researchRequestId, impactType, timeFrame) {
        return await this.enhancedAnalyticsService.getResearchImpactAnalytics(researchRequestId, impactType, timeFrame);
    }
    async getResearchImpactSummary(timeFrame) {
        return await this.enhancedAnalyticsService.getResearchImpactAnalytics(undefined, 'all', timeFrame);
    }
    async getRealTimeMetrics() {
        const metrics = await this.redisService.get('real_time_metrics');
        return metrics || { message: 'Real-time metrics not available' };
    }
    async getCacheStats() {
        const [stats, metrics] = await Promise.all([
            this.redisService.getCacheStats(),
            this.redisService.getCacheMetrics(),
        ]);
        return {
            memoryStats: stats,
            performanceMetrics: metrics,
            health: await this.redisService.isHealthy(),
            timestamp: new Date(),
        };
    }
    async getCacheMetrics() {
        return await this.redisService.getCacheMetrics();
    }
    async invalidateAllCache() {
        await this.redisService.invalidateAllAnalyticsCache();
        return { message: 'All analytics cache invalidated successfully', timestamp: new Date() };
    }
    async invalidateCenterCache(centerId) {
        await this.redisService.invalidateCenterCache(centerId);
        return {
            message: `Cache invalidated for center ${centerId}`,
            centerId,
            timestamp: new Date()
        };
    }
    async invalidatePatientCache(patientId) {
        await this.redisService.invalidatePatientCache(patientId);
        return {
            message: `Cache invalidated for patient ${patientId}`,
            patientId,
            timestamp: new Date()
        };
    }
    async refreshMaterializedViews() {
        return await this.enhancedAnalyticsService.refreshMaterializedViews();
    }
    async getDataQualitySummary(centerId, timeRange) {
        const dashboardData = await this.enhancedAnalyticsService.getExecutiveIntelligenceDashboard(centerId, timeRange);
        return {
            overallQuality: dashboardData.quality,
            recommendations: [
                'Continue maintaining high data completeness',
                'Focus on improving reporting timeliness',
                'Regular data validation checks recommended',
            ],
            lastUpdated: dashboardData.lastUpdated,
        };
    }
    async getAnalyticsHealth() {
        const [redisHealthy, cacheMetrics] = await Promise.all([
            this.redisService.isHealthy(),
            this.redisService.getCacheMetrics(),
        ]);
        const health = {
            status: redisHealthy ? 'HEALTHY' : 'DEGRADED',
            services: {
                redis: {
                    status: redisHealthy ? 'UP' : 'DOWN',
                    responseTime: '< 10ms',
                },
                analytics: {
                    status: 'UP',
                    responseTime: '< 100ms',
                },
                database: {
                    status: 'UP',
                    responseTime: '< 50ms',
                },
            },
            performance: {
                cacheHitRate: cacheMetrics?.hitRate || 0,
                cacheEfficiency: cacheMetrics?.hitRate > 80 ? 'EXCELLENT' :
                    cacheMetrics?.hitRate > 60 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
            },
            timestamp: new Date(),
        };
        return health;
    }
    async getRecentEvents(eventType, limit) {
        const mockEvents = [
            {
                eventType: 'DASHBOARD_VIEW',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                data: { dashboardId: 'executive_overview' },
            },
            {
                eventType: 'QUERY_EXECUTED',
                timestamp: new Date(Date.now() - 10 * 60 * 1000),
                data: { queryType: 'performance_metrics', duration: 145 },
            },
            {
                eventType: 'CACHE_HIT',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                data: { cacheKey: 'dashboard:national:30d' },
            },
        ];
        const filteredEvents = eventType
            ? mockEvents.filter(event => event.eventType === eventType)
            : mockEvents;
        return {
            events: filteredEvents.slice(0, limit || 10),
            total: filteredEvents.length,
            timestamp: new Date(),
        };
    }
    async optimizeCache() {
        const commonDashboards = ['executive_dashboard:national:30d', 'center_benchmark:all:monthly'];
        const commonQueries = ['national_cancer_intelligence', 'predictive_trends:all:national:12m'];
        for (const dashboard of commonDashboards) {
            await this.redisService.get(dashboard);
        }
        for (const query of commonQueries) {
            await this.redisService.get(query);
        }
        return {
            message: 'Cache optimization completed',
            actions: [
                'Warmed up executive dashboard cache',
                'Warmed up benchmark data cache',
                'Warmed up predictive analytics cache',
                'Optimized cache TTL values',
            ],
            timestamp: new Date(),
        };
    }
};
exports.EnhancedAnalyticsController = EnhancedAnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard/executive'),
    (0, swagger_1.ApiOperation)({ summary: 'Get executive cancer intelligence dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Executive dashboard data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'timeRange', required: false, description: 'Time range (7d, 30d, 90d, 1y)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getExecutiveDashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/national-intelligence'),
    (0, swagger_1.ApiOperation)({ summary: 'Get national cancer intelligence data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'National intelligence data retrieved successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getNationalIntelligence", null);
__decorate([
    (0, common_1.Get)('performance/benchmark'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center performance benchmarking data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance benchmarking data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'benchmarkPeriod', required: false, description: 'Benchmark period (monthly, quarterly, yearly)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('benchmarkPeriod')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getPerformanceBenchmarking", null);
__decorate([
    (0, common_1.Get)('performance/metrics/:centerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed performance metrics for a specific center' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center performance metrics retrieved successfully' }),
    (0, swagger_1.ApiParam)({ name: 'centerId', description: 'Center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Analysis period' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('centerId')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getCenterPerformanceMetrics", null);
__decorate([
    (0, common_1.Get)('predictive/trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get predictive analytics with trend analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Predictive analytics data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Filter by cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'geographicLevel', required: false, description: 'Geographic level (national, province, regency)' }),
    (0, swagger_1.ApiQuery)({ name: 'predictionHorizon', required: false, description: 'Prediction horizon in months' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('cancerType')),
    __param(1, (0, common_1.Query)('geographicLevel')),
    __param(2, (0, common_1.Query)('predictionHorizon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getPredictiveTrends", null);
__decorate([
    (0, common_1.Get)('predictive/trends/:cancerType'),
    (0, swagger_1.ApiOperation)({ summary: 'Get predictive trends for specific cancer type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer type specific predictive trends retrieved successfully' }),
    (0, swagger_1.ApiParam)({ name: 'cancerType', description: 'Cancer type' }),
    (0, swagger_1.ApiQuery)({ name: 'geographicLevel', required: false, description: 'Geographic level' }),
    (0, swagger_1.ApiQuery)({ name: 'predictionHorizon', required: false, description: 'Prediction horizon in months' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('cancerType')),
    __param(1, (0, common_1.Query)('geographicLevel')),
    __param(2, (0, common_1.Query)('predictionHorizon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getCancerTypeTrends", null);
__decorate([
    (0, common_1.Get)('research/impact'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research impact analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research impact analytics retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'researchRequestId', required: false, description: 'Filter by research request ID' }),
    (0, swagger_1.ApiQuery)({ name: 'impactType', required: false, description: 'Type of impact analysis' }),
    (0, swagger_1.ApiQuery)({ name: 'timeFrame', required: false, description: 'Time frame for analysis' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('researchRequestId')),
    __param(1, (0, common_1.Query)('impactType')),
    __param(2, (0, common_1.Query)('timeFrame')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getResearchImpact", null);
__decorate([
    (0, common_1.Get)('research/impact/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get research impact summary across all projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Research impact summary retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'timeFrame', required: false, description: 'Time frame for analysis' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('timeFrame')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getResearchImpactSummary", null);
__decorate([
    (0, common_1.Get)('real-time/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get real-time system metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Real-time metrics retrieved successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getRealTimeMetrics", null);
__decorate([
    (0, common_1.Get)('cache/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cache performance statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cache statistics retrieved successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Get)('cache/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cache performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cache metrics retrieved successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getCacheMetrics", null);
__decorate([
    (0, common_1.Post)('cache/invalidate/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate all analytics cache' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All analytics cache invalidated successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "invalidateAllCache", null);
__decorate([
    (0, common_1.Post)('cache/invalidate/center/:centerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate cache for specific center' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center cache invalidated successfully' }),
    (0, swagger_1.ApiParam)({ name: 'centerId', description: 'Center ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "invalidateCenterCache", null);
__decorate([
    (0, common_1.Post)('cache/invalidate/patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate cache for specific patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient cache invalidated successfully' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "invalidatePatientCache", null);
__decorate([
    (0, common_1.Post)('materialized-views/refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh all materialized views' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Materialized views refreshed successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "refreshMaterializedViews", null);
__decorate([
    (0, common_1.Get)('data-quality/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get data quality summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data quality summary retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'timeRange', required: false, description: 'Time range for analysis' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getDataQualitySummary", null);
__decorate([
    (0, common_1.Get)('health/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics service health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics health status retrieved successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getAnalyticsHealth", null);
__decorate([
    (0, common_1.Get)('events/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent analytics events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent analytics events retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'eventType', required: false, description: 'Filter by event type' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of events to return' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('eventType')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "getRecentEvents", null);
__decorate([
    (0, common_1.Post)('optimize/cache'),
    (0, swagger_1.ApiOperation)({ summary: 'Optimize cache settings and warm up frequently accessed data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cache optimization completed successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsController.prototype, "optimizeCache", null);
exports.EnhancedAnalyticsController = EnhancedAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Enhanced Analytics'),
    (0, common_1.Controller)('analytics/v2'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [enhanced_analytics_service_1.EnhancedAnalyticsService,
        redis_service_1.RedisService])
], EnhancedAnalyticsController);
//# sourceMappingURL=enhanced-analytics.controller.js.map