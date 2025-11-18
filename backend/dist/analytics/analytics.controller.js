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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const analytics_service_1 = require("./analytics.service");
const create_analytics_query_dto_1 = require("./dto/create-analytics-query.dto");
const create_ml_prediction_dto_1 = require("./dto/create-ml-prediction.dto");
const create_monitoring_rule_dto_1 = require("./dto/create-monitoring-rule.dto");
const create_executive_dashboard_dto_1 = require("./dto/create-executive-dashboard.dto");
const generate_analytics_report_dto_1 = require("./dto/generate-analytics-report.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async executeAnalyticsQuery(req, queryDto) {
        return this.analyticsService.executeAnalyticsQuery(queryDto);
    }
    async getCachedQueries(limit) {
        return {
            cachedResults: [
                {
                    id: 'query-1',
                    query: 'Patient volume trends',
                    result: { value: 2543, trend: 'up' },
                    cachedAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
                }
            ],
            total: 1
        };
    }
    async generateMLPrediction(req, predictionDto) {
        return this.analyticsService.generateMLPrediction(predictionDto);
    }
    async getMLModels(type) {
        const models = [
            {
                id: 'survival-cox-v1.0',
                name: 'Survival Prediction Model',
                type: 'survival',
                algorithm: 'cox_regression',
                version: '1.0',
                accuracy: 0.87,
                features: 15,
                trainingData: 5000,
                lastUpdated: new Date('2024-06-01'),
                description: 'Predicts overall and progression-free survival based on clinical and demographic factors'
            },
            {
                id: 'response-gb-v2.1',
                name: 'Treatment Response Model',
                type: 'response',
                algorithm: 'gradient_boosting',
                version: '2.1',
                accuracy: 0.83,
                features: 22,
                trainingData: 3500,
                lastUpdated: new Date('2024-05-15'),
                description: 'Predicts treatment response rate and duration'
            },
            {
                id: 'toxicity-rf-v1.5',
                name: 'Toxicity Prediction Model',
                type: 'toxicity',
                algorithm: 'random_forest',
                version: '1.5',
                accuracy: 0.79,
                features: 18,
                trainingData: 4200,
                lastUpdated: new Date('2024-04-20'),
                description: 'Predicts likelihood of treatment-related toxicities'
            }
        ];
        const filteredModels = type ? models.filter(m => m.type === type) : models;
        return { models: filteredModels, total: filteredModels.length };
    }
    async getMLPredictions(patientId, modelType, limit) {
        return {
            predictions: [
                {
                    id: 'pred-1',
                    patientId: 'patient-123',
                    modelType: 'survival',
                    prediction: { overallSurvival: 42.3, probability: 0.75 },
                    confidence: 0.82,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            ],
            total: 1
        };
    }
    async createMonitoringRule(req, ruleDto) {
        return this.analyticsService.createMonitoringRule(ruleDto);
    }
    async getMonitoringRules(enabled, category) {
        return {
            rules: [
                {
                    id: 'rule-1',
                    name: 'High Toxicity Rate Alert',
                    category: 'clinical',
                    enabled: true,
                    severity: 'warning',
                    lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000)
                }
            ],
            total: 1
        };
    }
    async getMonitoringAlerts(severity, resolved) {
        return this.analyticsService.getActiveAlerts(severity);
    }
    async resolveAlert(req, alertId, resolutionData) {
        return {
            success: true,
            message: 'Alert resolved successfully',
            resolvedAt: new Date()
        };
    }
    async createExecutiveDashboard(req, dashboardDto) {
        return this.analyticsService.createExecutiveDashboard(dashboardDto);
    }
    async getExecutiveDashboards(shared) {
        const userId = req.user.sub;
        return this.analyticsService.getExecutiveDashboards(userId);
    }
    async getDashboardById(dashboardId) {
        return {
            id: dashboardId,
            name: 'Executive Overview',
            widgets: [
                {
                    id: 'widget-1',
                    type: 'kpi',
                    title: 'Patient Volume',
                    value: 2543,
                    trend: 'up'
                }
            ],
            lastRefreshed: new Date()
        };
    }
    async getExecutiveKPIs(category, period) {
        return this.analyticsService.calculateExecutiveKPIs();
    }
    async getKPITrends(kpi, period, granularity) {
        const dataPoints = [];
        const now = new Date();
        for (let i = period; i >= 0; i -= Math.ceil(period / 20)) {
            dataPoints.push({
                date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
                value: Math.round(2000 + Math.random() * 1000),
                target: 2500
            });
        }
        return {
            kpi,
            period,
            granularity: granularity || 'day',
            dataPoints,
            trend: {
                direction: 'up',
                percentage: 8.5
            }
        };
    }
    async generateDataQualityReport(dataSource) {
        return this.analyticsService.generateDataQualityReport(dataSource);
    }
    async getDataQualityReports(dataSource, limit) {
        return {
            reports: [
                {
                    id: 'dq-1',
                    reportDate: new Date(),
                    dataSource: 'patient_management',
                    overallScore: 87.3,
                    status: 'good'
                }
            ],
            total: 1
        };
    }
    async generateComplianceAudit(auditType) {
        return this.analyticsService.generateComplianceAudit(auditType);
    }
    async getComplianceAudits(auditType, status) {
        return {
            audits: [
                {
                    id: 'audit-1',
                    auditType: 'hipaa',
                    auditDate: new Date(),
                    status: 'partial',
                    overallScore: 91.2
                }
            ],
            total: 1
        };
    }
    async generateAdvancedReport(req, reportDto) {
        return this.analyticsService.generateAnalyticsReport(reportDto);
    }
    async getReportTemplates(category) {
        const templates = [
            {
                id: 'template-1',
                name: 'Treatment Outcomes Analysis',
                category: 'clinical',
                description: 'Comprehensive analysis of treatment outcomes and survival data',
                parameters: ['dateRange', 'cancerType', 'treatmentType'],
                outputFormats: ['pdf', 'excel', 'json']
            },
            {
                id: 'template-2',
                name: 'Quality Metrics Dashboard',
                category: 'quality',
                description: 'Quality indicators and performance metrics',
                parameters: ['dateRange', 'department', 'kpis'],
                outputFormats: ['pdf', 'excel', 'json']
            },
            {
                id: 'template-3',
                name: 'Operational Efficiency Report',
                category: 'operational',
                description: 'Resource utilization and operational efficiency analysis',
                parameters: ['dateRange', 'facility', 'metrics'],
                outputFormats: ['pdf', 'excel', 'json']
            }
        ];
        const filteredTemplates = category ? templates.filter(t => t.category === category) : templates;
        return { templates: filteredTemplates, total: filteredTemplates.length };
    }
    async getReportHistory(reportType, limit) {
        return {
            reports: [
                {
                    id: 'report-1',
                    reportType: 'treatment_outcomes',
                    title: 'Q3 2024 Treatment Outcomes Analysis',
                    generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    generatedBy: 'dr.smith',
                    status: 'completed',
                    fileUrl: '/reports/outcomes-q3-2024.pdf'
                }
            ],
            total: 1
        };
    }
    async getSystemPerformance(timeframe) {
        return {
            timestamp: new Date(),
            responseTime: 145,
            throughput: 1250,
            errorRate: 0.2,
            cpuUsage: 65.3,
            memoryUsage: 72.8,
            diskUsage: 45.1,
            networkLatency: 23.4,
            databaseConnections: 18,
            activeUsers: 234,
            cacheHitRate: 87.2,
            uptime: 99.97,
            lastRestart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        };
    }
    async getHealthStatus() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            version: '1.0.0',
            services: {
                analyticsEngine: 'healthy',
                mlModels: 'healthy',
                monitoring: 'healthy',
                dataQuality: 'healthy'
            },
            metrics: {
                cacheSize: 1024,
                activeQueries: 3,
                queuedJobs: 0,
                errorRate: 0.1
            }
        };
    }
    async discoverInsights(insightRequest) {
        return {
            insights: [
                {
                    type: 'correlation',
                    title: 'Age and Treatment Response Correlation',
                    description: 'Strong positive correlation found between patient age under 65 and higher response rates',
                    confidence: 0.89,
                    significance: 0.003,
                    impact: 'medium',
                    actionable: true
                },
                {
                    type: 'anomaly',
                    title: 'Unusual Toxicity Pattern',
                    description: 'Elevated neurotoxicity rates detected in recent treatment cycle',
                    confidence: 0.95,
                    significance: 0.001,
                    impact: 'high',
                    actionable: true
                }
            ],
            discoveryTime: 2345
        };
    }
    async generateBatchPredictions(batchRequest) {
        return {
            batchId: uuidv4(),
            totalPatients: batchRequest.patientIds.length,
            completedPredictions: batchRequest.patientIds.length,
            predictions: batchRequest.patientIds.map(patientId => ({
                patientId,
                prediction: { value: 0.75, category: 'good' },
                confidence: 0.82
            })),
            processingTime: 3421
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('query'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Execute analytics query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics query executed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid query parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_analytics_query_dto_1.CreateAnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "executeAnalyticsQuery", null);
__decorate([
    (0, common_1.Get)('cached-queries'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get cached analytics results' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of cached results to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cached results retrieved successfully' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCachedQueries", null);
__decorate([
    (0, common_1.Post)('ml/predict'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate ML prediction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ML prediction generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid prediction request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('clinician', 'researcher', 'admin'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof create_ml_prediction_dto_1.CreateMLPredictionDto !== "undefined" && create_ml_prediction_dto_1.CreateMLPredictionDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateMLPrediction", null);
__decorate([
    (0, common_1.Get)('ml/models'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get available ML models' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by model type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ML models retrieved successfully' }),
    (0, roles_decorator_1.Roles)('clinician', 'researcher', 'admin'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMLModels", null);
__decorate([
    (0, common_1.Get)('ml/predictions'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get ML prediction history' }),
    (0, swagger_1.ApiQuery)({ name: 'patientId', required: false, description: 'Filter by patient ID' }),
    (0, swagger_1.ApiQuery)({ name: 'modelType', required: false, description: 'Filter by model type' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of results to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prediction history retrieved successfully' }),
    (0, roles_decorator_1.Roles)('clinician', 'researcher', 'admin'),
    __param(0, (0, common_1.Query)('patientId')),
    __param(1, (0, common_1.Query)('modelType')),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMLPredictions", null);
__decorate([
    (0, common_1.Post)('monitoring/rules'),
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create monitoring rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Monitoring rule created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid rule parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('admin', 'system_operator'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_monitoring_rule_dto_1.CreateMonitoringRuleDto !== "undefined" && create_monitoring_rule_dto_1.CreateMonitoringRuleDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createMonitoringRule", null);
__decorate([
    (0, common_1.Get)('monitoring/rules'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get monitoring rules' }),
    (0, swagger_1.ApiQuery)({ name: 'enabled', required: false, description: 'Filter by enabled status' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Monitoring rules retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'system_operator'),
    __param(0, (0, common_1.Query)('enabled')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMonitoringRules", null);
__decorate([
    (0, common_1.Get)('monitoring/alerts'),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get active monitoring alerts' }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, description: 'Filter by severity level' }),
    (0, swagger_1.ApiQuery)({ name: 'resolved', required: false, description: 'Filter by resolution status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alerts retrieved successfully' }),
    __param(0, (0, common_1.Query)('severity')),
    __param(1, (0, common_1.Query)('resolved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMonitoringAlerts", null);
__decorate([
    (0, common_1.Post)('monitoring/alerts/:alertId/resolve'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve monitoring alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Alert not found' }),
    (0, roles_decorator_1.Roles)('admin', 'system_operator'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('alertId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Post)('dashboards'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create executive dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dashboard created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid dashboard configuration' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('admin', 'executive', 'manager'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof create_executive_dashboard_dto_1.CreateExecutiveDashboardDto !== "undefined" && create_executive_dashboard_dto_1.CreateExecutiveDashboardDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createExecutiveDashboard", null);
__decorate([
    (0, common_1.Get)('dashboards'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get executive dashboards' }),
    (0, swagger_1.ApiQuery)({ name: 'shared', required: false, description: 'Filter by shared dashboards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboards retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'executive', 'manager'),
    __param(0, (0, common_1.Query)('shared')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getExecutiveDashboards", null);
__decorate([
    (0, common_1.Get)('dashboards/:dashboardId'),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard by ID' }),
    (0, swagger_1.ApiParam)({ name: 'dashboardId', description: 'Dashboard ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dashboard not found' }),
    (0, roles_decorator_1.Roles)('admin', 'executive', 'manager'),
    __param(0, (0, common_1.Param)('dashboardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardById", null);
__decorate([
    (0, common_1.Get)('kpis'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get executive KPIs' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by KPI category' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Time period for KPIs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'executive', 'manager'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getExecutiveKPIs", null);
__decorate([
    (0, common_1.Get)('kpis/trends'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPI trends over time' }),
    (0, swagger_1.ApiQuery)({ name: 'kpi', required: true, description: 'KPI name' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Time period (days)' }),
    (0, swagger_1.ApiQuery)({ name: 'granularity', required: false, description: 'Time granularity (hour/day/week/month)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI trends retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'executive', 'manager'),
    __param(0, (0, common_1.Query)('kpi')),
    __param(1, (0, common_1.Query)('period', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('granularity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getKPITrends", null);
__decorate([
    (0, common_1.Post)('data-quality/reports'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate data quality report' }),
    (0, swagger_1.ApiQuery)({ name: 'dataSource', required: true, description: 'Data source to analyze' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data quality report generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data source' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('admin', 'data_manager'),
    __param(0, (0, common_1.Query)('dataSource')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateDataQualityReport", null);
__decorate([
    (0, common_1.Get)('data-quality/reports'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get data quality reports' }),
    (0, swagger_1.ApiQuery)({ name: 'dataSource', required: false, description: 'Filter by data source' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of reports to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data quality reports retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'data_manager'),
    __param(0, (0, common_1.Query)('dataSource')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDataQualityReports", null);
__decorate([
    (0, common_1.Post)('compliance/audits'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate compliance audit' }),
    (0, swagger_1.ApiQuery)({ name: 'auditType', required: true, description: 'Type of compliance audit' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Compliance audit generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid audit type' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('admin', 'compliance_officer'),
    __param(0, (0, common_1.Query)('auditType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateComplianceAudit", null);
__decorate([
    (0, common_1.Get)('compliance/audits'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance audits' }),
    (0, swagger_1.ApiQuery)({ name: 'auditType', required: false, description: 'Filter by audit type' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by audit status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance audits retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'compliance_officer'),
    __param(0, (0, common_1.Query)('auditType')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getComplianceAudits", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate advanced analytics report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid report parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof generate_analytics_report_dto_1.GenerateAnalyticsReportDto !== "undefined" && generate_analytics_report_dto_1.GenerateAnalyticsReportDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateAdvancedReport", null);
__decorate([
    (0, common_1.Get)('reports/templates'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get available report templates' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by report category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report templates retrieved successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReportTemplates", null);
__decorate([
    (0, common_1.Get)('reports/history'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get report generation history' }),
    (0, swagger_1.ApiQuery)({ name: 'reportType', required: false, description: 'Filter by report type' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of reports to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report history retrieved successfully' }),
    __param(0, (0, common_1.Query)('reportType')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReportHistory", null);
__decorate([
    (0, common_1.Get)('system/performance'),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get system performance metrics' }),
    (0, swagger_1.ApiQuery)({ name: 'timeframe', required: false, description: 'Timeframe for metrics (minutes)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance metrics retrieved successfully' }),
    (0, roles_decorator_1.Roles)('admin', 'system_operator'),
    __param(0, (0, common_1.Query)('timeframe', new common_1.DefaultValuePipe(60), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSystemPerformance", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, throttler_1.Throttle)({ default: { limit: 200, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Analytics service health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getHealthStatus", null);
__decorate([
    (0, common_1.Post)('insights/discover'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Discover insights from data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insights discovered successfully' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "discoverInsights", null);
__decorate([
    (0, common_1.Post)('predictions/batch'),
    (0, throttler_1.Throttle)({ default: { limit: 2, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate batch ML predictions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Batch predictions generated successfully' }),
    (0, roles_decorator_1.Roles)('researcher', 'admin', 'national_stakeholder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "generateBatchPredictions", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map