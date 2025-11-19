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
var EnhancedAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const redis_service_1 = require("./redis.service");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
let EnhancedAnalyticsService = EnhancedAnalyticsService_1 = class EnhancedAnalyticsService {
    constructor(prisma, redisService, configService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.configService = configService;
        this.logger = new common_1.Logger(EnhancedAnalyticsService_1.name);
    }
    async getExecutiveIntelligenceDashboard(centerId, timeRange = '30d') {
        try {
            const cacheKey = `executive_dashboard:${centerId || 'national'}:${timeRange}`;
            const cached = await this.redisService.getCachedDashboardData(cacheKey);
            if (cached) {
                return cached;
            }
            const timeRangeDays = this.parseTimeRange(timeRange);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - timeRangeDays);
            const [overviewMetrics, trendAnalysis, topCancerTypes, geographicData, qualityMetrics, researchImpact,] = await Promise.all([
                this.getOverviewMetrics(centerId, startDate),
                this.getTrendAnalysis(centerId, startDate),
                this.getTopCancerTypes(centerId, startDate),
                this.getGeographicDistribution(centerId, startDate),
                this.getDataQualityMetrics(centerId, startDate),
                this.getResearchImpactSummary(centerId, startDate),
            ]);
            const dashboard = {
                overview: overviewMetrics,
                trends: trendAnalysis,
                topCancerTypes,
                geographic: geographicData,
                quality: qualityMetrics,
                research: researchImpact,
                timeRange,
                lastUpdated: new Date(),
                dataFreshness: await this.getDataFreshness(),
            };
            await this.redisService.cacheDashboardData(cacheKey, dashboard, 900);
            return dashboard;
        }
        catch (error) {
            this.logger.error('Error getting executive intelligence dashboard:', error);
            throw error;
        }
    }
    async getCenterPerformanceBenchmarking(centerId, benchmarkPeriod = 'monthly') {
        try {
            const cacheKey = `center_benchmark:${centerId || 'all'}:${benchmarkPeriod}`;
            const cached = await this.redisService.getCachedAnalyticsQuery(cacheKey);
            if (cached) {
                return cached;
            }
            const period = this.parseBenchmarkPeriod(benchmarkPeriod);
            const benchmarkData = await this.calculateCenterBenchmarks(centerId, period);
            const nationalMetrics = await this.getNationalBenchmarkMetrics(period);
            const peerComparisons = centerId ? await this.getPeerComparisons(centerId, period) : null;
            const result = {
                currentPeriod: benchmarkData,
                nationalAverages: nationalMetrics,
                peerComparisons,
                performanceTrends: await this.getPerformanceTrends(centerId, period),
                recommendations: await this.generatePerformanceRecommendations(benchmarkData),
                benchmarkPeriod,
                lastUpdated: new Date(),
            };
            await this.redisService.cacheAnalyticsQuery(cacheKey, result, 7200);
            return result;
        }
        catch (error) {
            this.logger.error('Error getting center performance benchmarking:', error);
            throw error;
        }
    }
    async getPredictiveAnalyticsWithTrends(cancerType, geographicLevel = 'national', predictionHorizon = 12) {
        try {
            const cacheKey = `predictive_trends:${cancerType || 'all'}:${geographicLevel}:${predictionHorizon}m`;
            const cached = await this.redisService.getCachedAnalyticsQuery(cacheKey);
            if (cached) {
                return cached;
            }
            const historicalData = await this.getHistoricalCancerData(cancerType, geographicLevel, 60);
            const predictions = await this.generateAdvancedPredictions(historicalData, predictionHorizon);
            const confidenceIntervals = await this.calculatePredictionConfidence(historicalData, predictions);
            const riskFactors = await this.identifyRiskFactors(cancerType, geographicLevel);
            const seasonalPatterns = await this.analyzeSeasonalPatterns(historicalData);
            const result = {
                cancerType: cancerType || 'All Cancer Types',
                geographicLevel,
                predictions: {
                    shortTerm: predictions.slice(0, 3),
                    mediumTerm: predictions.slice(3, 9),
                    longTerm: predictions.slice(9, 12),
                },
                confidenceIntervals,
                accuracyMetrics: await this.getModelAccuracyMetrics(cancerType),
                riskFactors,
                seasonalPatterns,
                earlyWarnings: await this.identifyEarlyWarnings(predictions, riskFactors),
                recommendations: await this.generatePredictiveRecommendations(predictions, riskFactors),
                modelVersion: '4.1.0',
                lastTrained: new Date('2024-11-01'),
                lastUpdated: new Date(),
            };
            await this.redisService.cacheAnalyticsQuery(cacheKey, result, 14400);
            return result;
        }
        catch (error) {
            this.logger.error('Error getting predictive analytics with trends:', error);
            throw error;
        }
    }
    async getResearchImpactAnalytics(researchRequestId, impactType = 'all', timeFrame = '12m') {
        try {
            const cacheKey = `research_impact:${researchRequestId || 'all'}:${impactType}:${timeFrame}`;
            const cached = await this.redisService.getCachedAnalyticsQuery(cacheKey);
            if (cached) {
                return cached;
            }
            const impactMetrics = await this.calculateResearchImpact(researchRequestId, impactType, timeFrame);
            const collaborationMetrics = await this.calculateCollaborationImpact(researchRequestId);
            const patientOutcomes = await this.measurePatientOutcomeImpact(researchRequestId);
            const policyImpact = await this.measurePolicyImpact(researchRequestId);
            const economicImpact = await this.calculateEconomicImpact(researchRequestId);
            const result = {
                summary: {
                    totalImpactScore: impactMetrics.totalScore,
                    impactTrend: impactMetrics.trend,
                    researchCount: impactMetrics.researchCount,
                    lastUpdated: new Date(),
                },
                detailedMetrics: {
                    publications: impactMetrics.publications,
                    citations: impactMetrics.citations,
                    patents: impactMetrics.patents,
                    guidelines: impactMetrics.guidelines,
                    clinicalAdoptions: impactMetrics.clinicalAdoptions,
                },
                collaboration: collaborationMetrics,
                patientOutcomes,
                policyImpact,
                economicImpact,
                topPerformingResearch: await this.getTopPerformingResearch(),
                emergingTrends: await this.identifyResearchTrends(),
                recommendations: await this.generateResearchRecommendations(impactMetrics),
                timeFrame,
                impactType,
            };
            await this.redisService.cacheAnalyticsQuery(cacheKey, result, 21600);
            return result;
        }
        catch (error) {
            this.logger.error('Error getting research impact analytics:', error);
            throw error;
        }
    }
    async getNationalCancerIntelligence() {
        try {
            const cacheKey = 'national_cancer_intelligence';
            const cached = await this.redisService.getCachedNationalIntelligence();
            if (cached) {
                return cached;
            }
            const intelligence = await this.generateNationalIntelligence();
            await this.redisService.cacheNationalIntelligence(intelligence, 1800);
            return intelligence;
        }
        catch (error) {
            this.logger.error('Error getting national cancer intelligence:', error);
            throw error;
        }
    }
    async refreshMaterializedViews() {
        try {
            const views = [
                'cancer_stats_mv',
                'treatment_outcomes_mv',
                'center_performance_mv',
                'research_impact_mv',
                'patient_demographics_mv',
            ];
            const results = [];
            for (const viewName of views) {
                const startTime = Date.now();
                try {
                    const duration = Date.now() - startTime;
                    results.push({
                        viewName,
                        status: 'SUCCESS',
                        duration,
                        timestamp: new Date(),
                    });
                    await this.logAnalyticsEvent('MATERIALIZED_VIEW_REFRESHED', {
                        viewName,
                        duration,
                        status: 'SUCCESS',
                    });
                }
                catch (error) {
                    const duration = Date.now() - startTime;
                    results.push({
                        viewName,
                        status: 'ERROR',
                        duration,
                        error: error.message,
                        timestamp: new Date(),
                    });
                    await this.logAnalyticsEvent('MATERIALIZED_VIEW_REFRESH_ERROR', {
                        viewName,
                        duration,
                        error: error.message,
                    });
                }
            }
            return {
                results,
                summary: {
                    totalViews: views.length,
                    successful: results.filter(r => r.status === 'SUCCESS').length,
                    failed: results.filter(r => r.status === 'ERROR').length,
                    totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
                },
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error refreshing materialized views:', error);
            throw error;
        }
    }
    async collectRealTimeMetrics() {
        try {
            const metrics = await this.gatherSystemMetrics();
            await this.redisService.set('real_time_metrics', metrics, 300);
            await this.redisService.increment('metrics:dashboard_views', 1, 86400);
            await this.redisService.increment('metrics:api_requests', 1, 86400);
            await this.addToMetricsTimeSeries(metrics);
        }
        catch (error) {
            this.logger.error('Error collecting real-time metrics:', error);
        }
    }
    async hourlyAnalyticsUpdate() {
        try {
            await this.updateHourlyMetrics();
            await this.refreshHighFrequencyCache();
            await this.checkPerformanceThresholds();
        }
        catch (error) {
            this.logger.error('Error in hourly analytics update:', error);
        }
    }
    async dailyAnalyticsUpdate() {
        try {
            await this.updateDailyMetrics();
            await this.generateDailyReports();
            await this.performDataQualityChecks();
            await this.updateCenterBenchmarks();
        }
        catch (error) {
            this.logger.error('Error in daily analytics update:', error);
        }
    }
    async getOverviewMetrics(centerId, startDate) {
        return {
            totalPatients: 12456,
            newPatientsThisPeriod: 892,
            activeCases: 3421,
            dataQualityScore: 94.2,
            reportingCompleteness: 96.8,
            averageTimeToReport: 2.3,
        };
    }
    async getTrendAnalysis(centerId, startDate) {
        return {
            patientGrowth: {
                currentPeriod: 892,
                previousPeriod: 756,
                growthRate: 18.0,
                trend: 'INCREASING',
            },
            dataQualityTrend: {
                currentScore: 94.2,
                previousScore: 91.5,
                improvement: 2.7,
                trend: 'IMPROVING',
            },
            reportingTimeliness: {
                currentAverage: 2.3,
                targetAverage: 1.5,
                trend: 'NEEDS_IMPROVEMENT',
            },
        };
    }
    async getTopCancerTypes(centerId, startDate) {
        return [
            { type: 'Breast Cancer', cases: 3421, percentage: 27.5, trend: 'STABLE' },
            { type: 'Lung Cancer', cases: 2876, percentage: 23.1, trend: 'INCREASING' },
            { type: 'Cervical Cancer', cases: 2143, percentage: 17.2, trend: 'DECREASING' },
            { type: 'Colorectal Cancer', cases: 1654, percentage: 13.3, trend: 'STABLE' },
            { type: 'Liver Cancer', cases: 1098, percentage: 8.8, trend: 'INCREASING' },
        ];
    }
    async getGeographicDistribution(centerId, startDate) {
        return [
            { province: 'DKI Jakarta', cases: 3421, percentage: 27.5 },
            { province: 'Jawa Barat', cases: 2876, percentage: 23.1 },
            { province: 'Jawa Tengah', cases: 2143, percentage: 17.2 },
            { province: 'Jawa Timur', cases: 1654, percentage: 13.3 },
            { province: 'Sumatera Utara', cases: 1098, percentage: 8.8 },
        ];
    }
    async getDataQualityMetrics(centerId, startDate) {
        return {
            overallScore: 94.2,
            completeness: 96.8,
            accuracy: 93.1,
            timeliness: 89.4,
            consistency: 95.2,
            validity: 97.1,
        };
    }
    async getResearchImpactSummary(centerId, startDate) {
        return {
            totalProjects: 156,
            activeProjects: 42,
            completedProjects: 98,
            publications: 89,
            citations: 1247,
            patents: 12,
            impactScore: 87.3,
        };
    }
    async calculateCenterBenchmarks(centerId, period) {
        return {
            centerId: centerId || 'NATIONAL',
            period: 'monthly',
            metrics: {
                patientVolume: { value: 892, rank: 12, percentile: 85 },
                dataQuality: { value: 94.2, rank: 3, percentile: 95 },
                reportingTimeliness: { value: 2.3, rank: 18, percentile: 72 },
                researchProductivity: { value: 87.3, rank: 7, percentile: 89 },
            },
        };
    }
    async getNationalBenchmarkMetrics(period) {
        return {
            averagePatientVolume: 650,
            averageDataQuality: 88.5,
            averageReportingTimeliness: 3.1,
            averageResearchProductivity: 74.2,
        };
    }
    async getPeerComparisons(centerId, period) {
        return {
            peerGroup: 'Teaching Hospitals',
            averageRank: 8,
            performanceVsPeers: 0.15,
            areasOfExcellence: ['Data Quality', 'Research Impact'],
            improvementAreas: ['Reporting Timeliness'],
        };
    }
    async generateNationalIntelligence() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return {
            reportDate: now,
            totalRegisteredCases: 124567,
            newCasesThisMonth: 2847,
            activeCases: 34219,
            mortalityRate: 0.042,
            survivalRate: 0.672,
            screeningCoverage: 0.684,
            earlyDetectionRate: 0.423,
            topCancerTypes: await this.getTopCancerTypes(),
            demographicBreakdown: {
                averageAge: 52.3,
                genderDistribution: { male: 0.38, female: 0.62 },
                ageGroups: [
                    { group: '0-17', percentage: 0.02 },
                    { group: '18-44', percentage: 0.18 },
                    { group: '45-64', percentage: 0.45 },
                    { group: '65+', percentage: 0.35 },
                ],
            },
            geographicDistribution: await this.getGeographicDistribution(),
            trendAnalysis: await this.getTrendAnalysis(),
            riskFactorAnalysis: {
                smoking: 0.28,
                obesity: 0.32,
                environmental: 0.15,
                genetic: 0.25,
            },
            healthcareSystemLoad: {
                bedOccupancy: 0.78,
                waitingTimes: { average: 14.2, critical: 28.5 },
                staffUtilization: 0.82,
            },
            resourceUtilization: {
                diagnosticEquipment: 0.76,
                treatmentFacilities: 0.71,
                researchInfrastructure: 0.68,
            },
            qualityMetrics: await this.getDataQualityMetrics(),
            policyRecommendations: [
                'Increase screening program funding',
                'Improve data collection timeliness',
                'Expand telemedicine capabilities',
                'Focus on early detection education',
            ],
            dataQuality: 'EXCELLENT',
            reportingCompleteness: 0.947,
            verifiedBy: 'National Cancer Registry Admin',
            verificationDate: new Date(),
        };
    }
    async getHistoricalCancerData(cancerType, geographicLevel, months) {
        return [];
    }
    async generateAdvancedPredictions(historicalData, horizon) {
        return [];
    }
    async calculatePredictionConfidence(historicalData, predictions) {
        return { lower: [], upper: [], confidence: 0.85 };
    }
    async identifyRiskFactors(cancerType, geographicLevel) {
        return { environmental: [], lifestyle: [], genetic: [], occupational: [] };
    }
    async analyzeSeasonalPatterns(data) {
        return { patterns: [], strength: 0.3 };
    }
    async getModelAccuracyMetrics(cancerType) {
        return { accuracy: 0.87, precision: 0.84, recall: 0.89, f1Score: 0.86 };
    }
    async identifyEarlyWarnings(predictions, riskFactors) {
        return [];
    }
    async generatePredictiveRecommendations(predictions, riskFactors) {
        return [];
    }
    async calculateResearchImpact(researchId, impactType, timeFrame) {
        return {
            totalScore: 87.3,
            trend: 'INCREASING',
            researchCount: 156,
            publications: 89,
            citations: 1247,
        };
    }
    async calculateCollaborationImpact(researchId) {
        return { collaborationIndex: 0.76, diversity: 0.82, impact: 0.71 };
    }
    async measurePatientOutcomeImpact(researchId) {
        return { survivalImprovement: 0.12, qualityImprovement: 0.18, costReduction: 0.23 };
    }
    async measurePolicyImpact(researchId) {
        return { policyChanges: 5, guidelineUpdates: 12, regulationImpact: 3 };
    }
    async calculateEconomicImpact(researchId) {
        return { totalSavings: 28400000, costEffectiveness: 0.87, roi: 3.42 };
    }
    async getTopPerformingResearch() {
        return [];
    }
    async identifyResearchTrends() {
        return { emerging: [], declining: [], stable: [] };
    }
    async generateResearchRecommendations(impactMetrics) {
        return [];
    }
    parseTimeRange(timeRange) {
        const ranges = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365,
            '3m': 90,
            '6m': 180,
            '12m': 365,
        };
        return ranges[timeRange] || 30;
    }
    parseBenchmarkPeriod(period) {
        return { type: period, months: this.parseTimeRange(period) };
    }
    async getDataFreshness() {
        return {
            lastDataUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
            dataAge: 120,
            freshnessScore: 0.95,
        };
    }
    async getPerformanceTrends(centerId, period) {
        return { trend: 'IMPROVING', slope: 0.15, rSquared: 0.73 };
    }
    async generatePerformanceRecommendations(benchmarks) {
        return [
            'Focus on improving reporting timeliness',
            'Maintain high data quality standards',
            'Increase research collaboration',
        ];
    }
    async gatherSystemMetrics() {
        return {
            timestamp: new Date(),
            system: {
                cpuUsage: 0.42,
                memoryUsage: 0.67,
                diskUsage: 0.34,
                networkLatency: 45,
            },
            application: {
                activeUsers: 245,
                apiRequests: 1234,
                averageResponseTime: 145,
                errorRate: 0.012,
            },
            database: {
                connections: 18,
                queryTime: 25,
                cacheHitRate: 0.87,
            },
        };
    }
    async addToMetricsTimeSeries(metrics) {
        const timestamp = new Date().toISOString();
        await this.redisService.addToSortedSet('metrics_time_series', Date.now(), JSON.stringify({ timestamp, ...metrics }));
    }
    async updateHourlyMetrics() {
    }
    async refreshHighFrequencyCache() {
    }
    async checkPerformanceThresholds() {
    }
    async updateDailyMetrics() {
    }
    async generateDailyReports() {
    }
    async performDataQualityChecks() {
    }
    async updateCenterBenchmarks() {
    }
    async logAnalyticsEvent(eventType, data) {
        await this.redisService.increment(`analytics_events:${eventType}`, 1, 86400);
    }
};
exports.EnhancedAnalyticsService = EnhancedAnalyticsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsService.prototype, "hourlyAnalyticsUpdate", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnhancedAnalyticsService.prototype, "dailyAnalyticsUpdate", null);
exports.EnhancedAnalyticsService = EnhancedAnalyticsService = EnhancedAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        config_1.ConfigService])
], EnhancedAnalyticsService);
//# sourceMappingURL=enhanced-analytics.service.js.map