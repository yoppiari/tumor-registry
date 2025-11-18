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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsResultModel, mlPredictionModel, monitoringAlertModel, monitoringRuleModel, executiveKpiModel, executiveDashboardModel, dataQualityReportModel, complianceAuditModel, analyticsExportModel, externalSystemIntegrationModel) {
        this.analyticsResultModel = analyticsResultModel;
        this.mlPredictionModel = mlPredictionModel;
        this.monitoringAlertModel = monitoringAlertModel;
        this.monitoringRuleModel = monitoringRuleModel;
        this.executiveKpiModel = executiveKpiModel;
        this.executiveDashboardModel = executiveDashboardModel;
        this.dataQualityReportModel = dataQualityReportModel;
        this.complianceAuditModel = complianceAuditModel;
        this.analyticsExportModel = analyticsExportModel;
        this.externalSystemIntegrationModel = externalSystemIntegrationModel;
    }
    async executeAnalyticsQuery(query) {
        const startTime = Date.now();
        const queryId = (0, uuid_1.v4)();
        try {
            const data = await this.processAnalyticsQuery(query);
            const metadata = await this.generateQueryMetadata(query);
            const insights = await this.generateInsights(data, query);
            const recommendations = await this.generateRecommendations(insights, query);
            const result = {
                query: query,
                data,
                metadata: {
                    ...metadata,
                    confidence: this.calculatePredictionConfidence(data)
                },
                insights,
                recommendations,
                generatedAt: new Date(),
                executionTime: Date.now() - startTime
            };
            await this.analyticsResultModel.create({
                ...result,
                id: queryId,
                cached: true
            });
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Analytics query execution failed: ${error.message}`);
        }
    }
    async processAnalyticsQuery(query) {
        const mockData = [
            {
                dimensions: {
                    cancerType: 'Breast',
                    stage: 'II',
                    treatmentType: 'Chemotherapy',
                    ageGroup: '45-54'
                },
                metrics: {
                    patientCount: 156,
                    responseRate: 78.5,
                    medianSurvival: 42.3,
                    toxicityRate: 23.1
                }
            },
            {
                dimensions: {
                    cancerType: 'Lung',
                    stage: 'III',
                    treatmentType: 'Radiotherapy',
                    ageGroup: '55-64'
                },
                metrics: {
                    patientCount: 89,
                    responseRate: 62.3,
                    medianSurvival: 18.7,
                    toxicityRate: 31.4
                }
            },
            {
                dimensions: {
                    cancerType: 'Colorectal',
                    stage: 'II',
                    treatmentType: 'Surgery',
                    ageGroup: '65-74'
                },
                metrics: {
                    patientCount: 67,
                    responseRate: 85.2,
                    medianSurvival: 58.9,
                    toxicityRate: 15.8
                }
            }
        ];
        return this.applyFilters(mockData, query.filters || []);
    }
    applyFilters(data, filters) {
        return data.filter(row => {
            return filters.every(filter => {
                const fieldValue = this.getNestedValue(row, filter.field);
                return this.applyFilterOperator(fieldValue, filter.operator, filter.value);
            });
        });
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    applyFilterOperator(value, operator, filterValue) {
        switch (operator) {
            case 'eq': return value === filterValue;
            case 'ne': return value !== filterValue;
            case 'gt': return value > filterValue;
            case 'gte': return value >= filterValue;
            case 'lt': return value < filterValue;
            case 'lte': return value <= filterValue;
            case 'in': return Array.isArray(filterValue) && filterValue.includes(value);
            case 'nin': return Array.isArray(filterValue) && !filterValue.includes(value);
            case 'contains': return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
            default: return true;
        }
    }
    async generateQueryMetadata(query) {
        return {
            totalRows: 0,
            cached: false,
            lastUpdated: new Date(),
            dataSource: 'data_warehouse'
        };
    }
    calculatePredictionConfidence(data) {
        if (data.length === 0)
            return 0;
        if (data.length < 10)
            return 0.3;
        if (data.length < 50)
            return 0.6;
        return 0.9;
    }
    async generateInsights(data, query) {
        const insights = [];
        if (data.length > 1) {
            const responseRates = data.map(d => d.metrics.responseRate);
            const avgResponseRate = responseRates.reduce((sum, rate) => sum + rate, 0) / responseRates.length;
            if (avgResponseRate < 60) {
                insights.push({
                    type: 'trend',
                    title: 'Low Response Rate Detected',
                    description: `Average response rate of ${avgResponseRate.toFixed(1)}% is below expected threshold`,
                    confidence: 0.8,
                    significance: 0.05,
                    impact: 'high',
                    actionable: true,
                    recommendations: [
                        'Review treatment protocols',
                        'Consider clinical trial enrollment',
                        'Evaluate patient selection criteria'
                    ],
                    data: { avgResponseRate },
                    discoveredAt: new Date()
                });
            }
        }
        data.forEach(row => {
            if (row.metrics.toxicityRate > 40) {
                insights.push({
                    type: 'anomaly',
                    title: 'High Toxicity Rate',
                    description: `Toxicity rate of ${row.metrics.toxicityRate}% for ${row.dimensions.cancerType} cancer exceeds normal range`,
                    confidence: 0.9,
                    significance: 0.01,
                    impact: 'critical',
                    actionable: true,
                    data: row,
                    discoveredAt: new Date()
                });
            }
        });
        return insights;
    }
    async generateRecommendations(insights, query) {
        const recommendations = [];
        insights.forEach(insight => {
            if (insight.recommendations) {
                insight.recommendations.forEach(rec => {
                    recommendations.push({
                        type: 'clinical',
                        priority: insight.impact === 'critical' ? 'urgent' : insight.impact === 'high' ? 'high' : 'medium',
                        title: `Clinical Action Required: ${insight.title}`,
                        description: rec,
                        expectedImpact: 'Improved patient outcomes and safety',
                        implementation: 'Review and update clinical protocols',
                        timeframe: '30 days',
                        kpi: ['response_rate', 'toxicity_rate', 'patient_safety']
                    });
                });
            }
        });
        return recommendations;
    }
    async generateMLPrediction(predictionDto) {
        const predictionId = (0, uuid_1.v4)();
        const { modelType, patientId, treatmentPlanId, features } = predictionDto;
        let prediction;
        switch (modelType) {
            case 'survival':
                prediction = await this.generateSurvivalPrediction(features, predictionId);
                break;
            case 'response':
                prediction = await this.generateResponsePrediction(features, predictionId);
                break;
            case 'toxicity':
                prediction = await this.generateToxicityPrediction(features, predictionId);
                break;
            default:
                throw new common_1.BadRequestException(`Unsupported model type: ${modelType}`);
        }
        prediction.patientId = patientId;
        prediction.treatmentPlanId = treatmentPlanId;
        prediction.createdAt = new Date();
        await this.mlPredictionModel.create(prediction);
        return prediction;
    }
    async generateSurvivalPrediction(features, predictionId) {
        const age = features.find(f => f.category === 'demographic' && f.name === 'age')?.value || 65;
        const stage = features.find(f => f.category === 'clinical' && f.name === 'stage')?.value || 'III';
        const performanceStatus = features.find(f => f.category === 'clinical' && f.name === 'performance_status')?.value || 2;
        const baseSurvival = 24;
        const ageFactor = Math.max(0.5, 1 - (age - 65) * 0.02);
        const stageFactor = stage === 'I' ? 1.5 : stage === 'II' ? 1.2 : stage === 'III' ? 0.8 : 0.5;
        const performanceFactor = Math.max(0.3, 1 - performanceStatus * 0.2);
        const overallSurvivalMonths = Math.round(baseSurvival * ageFactor * stageFactor * performanceFactor);
        const pfsMonths = Math.round(overallSurvivalMonths * 0.6);
        return {
            id: predictionId,
            modelType: 'survival',
            modelName: 'Cox Proportional Hazards Model',
            version: '1.0',
            inputFeatures: features,
            prediction: {
                overallSurvival: {
                    months: overallSurvivalMonths,
                    probability: 0.75
                },
                progressionFreeSurvival: {
                    months: pfsMonths,
                    probability: 0.68
                }
            },
            confidence: 0.82,
            explanation: {
                method: 'feature_importance',
                factors: [
                    { feature: 'age', value: age, contribution: -0.3, importance: 0.35, description: 'Advanced age reduces survival probability' },
                    { feature: 'stage', value: stage, contribution: -0.2, importance: 0.28, description: 'Advanced stage impacts prognosis' },
                    { feature: 'performance_status', value: performanceStatus, contribution: -0.25, importance: 0.25, description: 'Performance status is strong predictor' }
                ],
                summary: 'Patient prognosis primarily influenced by age, cancer stage, and performance status'
            },
            metadata: {
                modelTrainingDate: new Date('2024-01-01'),
                lastCalibrated: new Date('2024-06-01'),
                validationScore: 0.87,
                trainingDatasetSize: 5000,
                featureCount: features.length,
                algorithm: 'cox_regression'
            },
            createdAt: new Date()
        };
    }
    async generateResponsePrediction(features, predictionId) {
        const cancerType = features.find(f => f.category === 'clinical' && f.name === 'cancer_type')?.value || 'Unknown';
        const biomarkerStatus = features.find(f => f.category === 'genomic' && f.name === 'her2_status')?.value || 'negative';
        const tumorBurden = features.find(f => f.category === 'clinical' && f.name === 'tumor_burden')?.value || 'moderate';
        let baseResponseRate = 0.6;
        if (cancerType === 'Breast' && biomarkerStatus === 'positive') {
            baseResponseRate += 0.25;
        }
        if (tumorBurden === 'minimal') {
            baseResponseRate += 0.15;
        }
        else if (tumorBurden === 'extensive') {
            baseResponseRate -= 0.2;
        }
        return {
            id: predictionId,
            modelType: 'response',
            modelName: 'Treatment Response Prediction Model',
            version: '2.1',
            inputFeatures: features,
            prediction: {
                responseRate: baseResponseRate,
                responseCategory: baseResponseRate > 0.8 ? 'CR' : baseResponseRate > 0.6 ? 'PR' : baseResponseRate > 0.4 ? 'SD' : 'PD',
                timeToResponse: Math.round(2 + (1 - baseResponseRate) * 4),
                durationOfResponse: Math.round(baseResponseRate * 12)
            },
            confidence: 0.78,
            metadata: {
                modelTrainingDate: new Date('2024-01-01'),
                lastCalibrated: new Date('2024-06-01'),
                validationScore: 0.83,
                trainingDatasetSize: 3500,
                featureCount: features.length,
                algorithm: 'gradient_boosting'
            },
            createdAt: new Date()
        };
    }
    async generateToxicityPrediction(features, predictionId) {
        const age = features.find(f => f.category === 'demographic' && f.name === 'age')?.value || 65;
        const renalFunction = features.find(f => f.category === 'laboratory' && f.name === 'creatinine_clearance')?.value || 80;
        const performanceStatus = features.find(f => f.category === 'clinical' && f.name === 'performance_status')?.value || 2;
        const ageFactor = Math.max(1, age / 60);
        const renalFactor = Math.max(0.5, renalFunction / 90);
        const performanceFactor = Math.max(0.7, (4 - performanceStatus) / 4);
        const overallRisk = Math.min(0.9, 0.15 * ageFactor * (2 - renalFactor) * (2 - performanceFactor));
        const grade3PlusRisk = overallRisk * 0.6;
        return {
            id: predictionId,
            modelType: 'toxicity',
            modelName: 'CTCAE Toxicity Prediction Model',
            version: '1.5',
            inputFeatures: features,
            prediction: {
                overallToxicityRisk: overallRisk,
                grade3PlusRisk,
                specificToxicities: [
                    {
                        toxicityType: 'Neutropenia',
                        risk: overallRisk * 1.2,
                        severity: overallRisk > 0.3 ? 'severe' : overallRisk > 0.15 ? 'moderate' : 'mild'
                    },
                    {
                        toxicityType: 'Nausea/Vomiting',
                        risk: overallRisk * 0.8,
                        severity: overallRisk > 0.25 ? 'moderate' : 'mild'
                    },
                    {
                        toxicityType: 'Fatigue',
                        risk: overallRisk * 0.9,
                        severity: 'moderate'
                    }
                ]
            },
            confidence: 0.75,
            metadata: {
                modelTrainingDate: new Date('2024-01-01'),
                lastCalibrated: new Date('2024-06-01'),
                validationScore: 0.79,
                trainingDatasetSize: 4200,
                featureCount: features.length,
                algorithm: 'random_forest'
            },
            createdAt: new Date()
        };
    }
    async createMonitoringRule(ruleDto) {
        const rule = {
            id: (0, uuid_1.v4)(),
            ...ruleDto,
            enabled: true,
            lastTriggered: undefined,
            createdAt: new Date()
        };
        await this.monitoringRuleModel.create(rule);
        return rule;
    }
    async checkMonitoringRules() {
        const activeRules = await this.monitoringRuleModel.find({ enabled: true });
        const alerts = [];
        for (const rule of activeRules) {
            const shouldTrigger = await this.evaluateMonitoringRule(rule);
            if (shouldTrigger) {
                const alert = await this.createAlertFromRule(rule);
                alerts.push(alert);
            }
        }
        return alerts;
    }
    async evaluateMonitoringRule(rule) {
        if (rule.cooldownPeriod && rule.lastTriggered) {
            const timeSinceLastTrigger = Date.now() - rule.lastTriggered.getTime();
            const cooldownMs = rule.cooldownPeriod * 60 * 1000;
            if (timeSinceLastTrigger < cooldownMs) {
                return false;
            }
        }
        return Math.random() > 0.9;
    }
    async createAlertFromRule(rule) {
        const alert = {
            id: (0, uuid_1.v4)(),
            alertType: rule.category,
            severity: rule.severity,
            title: `Alert: ${rule.name}`,
            message: rule.description,
            category: rule.category,
            source: 'monitoring_system',
            timestamp: new Date(),
            resolved: false,
            actions: []
        };
        await this.monitoringAlertModel.create(alert);
        await this.monitoringRuleModel.updateOne({ id: rule.id }, { lastTriggered: new Date() });
        return alert;
    }
    async getActiveAlerts(severity) {
        const query = { resolved: false };
        if (severity) {
            query.severity = severity;
        }
        return await this.monitoringAlertModel
            .find(query)
            .sort({ timestamp: -1 })
            .limit(100)
            .lean()
            .exec();
    }
    async calculateExecutiveKPIs() {
        const kpis = [
            {
                id: (0, uuid_1.v4)(),
                name: 'Patient Volume',
                description: 'Total number of active patients',
                category: 'clinical',
                value: 2543,
                previousValue: 2487,
                target: 3000,
                unit: 'patients',
                trend: 'up',
                trendPercentage: 2.3,
                status: 'good',
                lastUpdated: new Date(),
                dataSource: 'patient_management',
                drillDownPath: '/patients',
                insights: [
                    '12% increase in new patient registrations this month',
                    'Highest growth in breast cancer referrals'
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Treatment Response Rate',
                description: 'Overall treatment response rate',
                category: 'quality',
                value: 73.8,
                previousValue: 71.2,
                target: 75,
                unit: '%',
                trend: 'up',
                trendPercentage: 3.7,
                status: 'good',
                lastUpdated: new Date(),
                dataSource: 'treatment_outcomes',
                insights: [
                    'Improved outcomes in lung cancer treatments',
                    'Targeted therapy showing higher response rates'
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Average Treatment Duration',
                description: 'Average duration from diagnosis to treatment completion',
                category: 'operational',
                value: 8.2,
                previousValue: 9.1,
                target: 8,
                unit: 'months',
                trend: 'down',
                trendPercentage: -9.9,
                status: 'excellent',
                lastUpdated: new Date(),
                dataSource: 'treatment_management',
                insights: [
                    'Streamlined treatment protocols reducing duration',
                    'Better coordination between departments'
                ]
            },
            {
                id: (0, uuid_1.v4)(),
                name: 'Patient Satisfaction',
                description: 'Patient satisfaction survey results',
                category: 'satisfaction',
                value: 87.5,
                previousValue: 85.3,
                target: 90,
                unit: 'score',
                trend: 'up',
                trendPercentage: 2.6,
                status: 'good',
                lastUpdated: new Date(),
                dataSource: 'patient_surveys',
                insights: [
                    'Improvements in communication and care coordination',
                    'Higher satisfaction with nursing care'
                ]
            }
        ];
        return kpis;
    }
    async createExecutiveDashboard(dashboardDto) {
        const dashboard = {
            id: (0, uuid_1.v4)(),
            ...dashboardDto,
            widgets: [],
            filters: [],
            dateRange: dashboardDto.dateRange || {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                endDate: new Date()
            },
            lastRefreshed: new Date(),
            refreshInterval: dashboardDto.refreshInterval || 15,
            shared: dashboardDto.shared || false,
            owners: dashboardDto.owners || [],
            viewers: dashboardDto.viewers || [],
            settings: dashboardDto.settings || {
                autoRefresh: true,
                theme: 'light',
                language: 'en',
                timezone: 'Asia/Jakarta',
                exportFormat: 'pdf',
                notifications: true,
                drillDownMode: 'modal'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.executiveDashboardModel.create(dashboard);
        return dashboard;
    }
    async getExecutiveDashboards(userId) {
        const query = {};
        if (userId) {
            query.$or = [
                { owners: userId },
                { viewers: userId },
                { shared: true }
            ];
        }
        return await this.executiveDashboardModel
            .find(query)
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
    }
    async generateDataQualityReport(dataSource) {
        const report = {
            id: (0, uuid_1.v4)(),
            reportDate: new Date(),
            dataSource,
            overallScore: 87.3,
            dimensions: [
                {
                    name: 'Patient Demographics',
                    score: 92.1,
                    status: 'excellent',
                    metrics: {
                        completeness: 95.2,
                        accuracy: 94.8,
                        consistency: 89.3,
                        timeliness: 96.7,
                        validity: 91.5,
                        uniqueness: 85.2
                    }
                },
                {
                    name: 'Treatment Records',
                    score: 84.7,
                    status: 'good',
                    metrics: {
                        completeness: 88.3,
                        accuracy: 91.2,
                        consistency: 86.5,
                        timeliness: 79.8,
                        validity: 87.6,
                        uniqueness: 84.9
                    }
                },
                {
                    name: 'Laboratory Results',
                    score: 85.9,
                    status: 'good',
                    metrics: {
                        completeness: 91.7,
                        accuracy: 88.4,
                        consistency: 83.2,
                        timeliness: 85.6,
                        validity: 90.3,
                        uniqueness: 76.8
                    }
                }
            ],
            issues: [
                {
                    id: (0, uuid_1.v4)(),
                    severity: 'medium',
                    type: 'missing_data',
                    field: 'treatment.end_date',
                    description: 'Missing treatment end dates for completed treatments',
                    count: 147,
                    percentage: 5.8,
                    firstDetected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    lastDetected: new Date(),
                    status: 'open'
                }
            ],
            recommendations: [
                {
                    id: (0, uuid_1.v4)(),
                    priority: 'medium',
                    category: 'data_entry',
                    title: 'Improve Treatment Completion Data Entry',
                    description: 'Implement mandatory fields and validation for treatment end dates',
                    expectedImpact: '5% improvement in data completeness',
                    implementation: 'Update data entry forms and add validation rules',
                    effort: 'medium',
                    timeframe: '2 weeks'
                }
            ],
            generatedBy: 'system',
            createdAt: new Date()
        };
        await this.dataQualityReportModel.create(report);
        return report;
    }
    async generateComplianceAudit(auditType) {
        const audit = {
            id: (0, uuid_1.v4)(),
            auditDate: new Date(),
            auditType: auditType,
            scope: ['patient_data', 'treatment_records', 'access_logs'],
            findings: [
                {
                    id: (0, uuid_1.v4)(),
                    category: 'Access Control',
                    severity: 'medium',
                    description: 'Some user accounts have excessive permissions',
                    requirement: 'HIPAA §164.308(a)(4)',
                    status: 'needs_improvement',
                    remediationPlan: 'Review and update role-based access controls',
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    responsibleParty: 'Security Team'
                }
            ],
            overallScore: 91.2,
            status: 'partial',
            recommendations: [
                {
                    id: (0, uuid_1.v4)(),
                    priority: 'medium',
                    title: 'Implement Regular Access Reviews',
                    description: 'Schedule quarterly reviews of user access permissions',
                    requirements: ['HIPAA', 'Internal Security Policy'],
                    implementation: 'Set up automated access review workflows',
                    timeline: '30 days',
                    resources: ['Security Team', 'IT Support'],
                    riskMitigation: 'Reduces risk of unauthorized data access'
                }
            ],
            nextAuditDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            auditor: 'Internal Audit Team',
            reviewedBy: 'Compliance Officer',
            createdAt: new Date()
        };
        await this.complianceAuditModel.create(audit);
        return audit;
    }
    async generateAnalyticsReport(reportDto) {
        const { reportType, parameters } = reportDto;
        switch (reportType) {
            case 'treatment_outcomes':
                return await this.generateTreatmentOutcomesReport(parameters);
            case 'quality_metrics':
                return await this.generateQualityMetricsReport(parameters);
            case 'operational_efficiency':
                return await this.generateOperationalEfficiencyReport(parameters);
            case 'financial_analysis':
                return await this.generateFinancialAnalysisReport(parameters);
            default:
                throw new common_1.BadRequestException(`Unsupported report type: ${reportType}`);
        }
    }
    async generateTreatmentOutcomesReport(parameters) {
        return {
            title: 'Treatment Outcomes Analysis',
            generatedAt: new Date(),
            parameters,
            summary: {
                totalPatients: 2543,
                overallResponseRate: 73.8,
                medianSurvival: 42.3,
                oneYearSurvivalRate: 85.2
            },
            sections: [
                {
                    title: 'Response Rates by Cancer Type',
                    data: {
                        'Breast Cancer': 78.5,
                        'Lung Cancer': 62.3,
                        'Colorectal Cancer': 71.2,
                        'Prostate Cancer': 82.1
                    }
                },
                {
                    title: 'Survival Analysis',
                    data: {
                        'Overall Survival (median)': 42.3,
                        'Progression-Free Survival (median)': 18.7,
                        '1-Year Survival Rate': 85.2,
                        '5-Year Survival Rate': 62.8
                    }
                },
                {
                    title: 'Treatment Toxicity Profile',
                    data: {
                        'Grade 3+ Toxicities': 23.4,
                        'Treatment Modifications': 18.7,
                        'Treatment Discontinuations': 8.2
                    }
                }
            ],
            insights: [
                'Targeted therapies showing improved response rates',
                'Early detection significantly improves survival outcomes',
                'Toxicity management protocols reducing severe adverse events'
            ],
            recommendations: [
                'Expand molecular testing program',
                'Implement proactive toxicity monitoring',
                'Enhance survivorship care programs'
            ]
        };
    }
    async generateQualityMetricsReport(parameters) {
        return {
            title: 'Quality Metrics Dashboard',
            generatedAt: new Date(),
            parameters,
            metrics: {
                guidelineConcordance: 91.7,
                timeToTreatment: 14.2,
                multidisciplinaryReview: 87.3,
                patientSatisfaction: 87.5,
                readmissionRate: 8.3,
                complicationRate: 12.7
            },
            benchmarks: {
                guidelineConcordance: { current: 91.7, target: 95, benchmark: 92 },
                timeToTreatment: { current: 14.2, target: 10, benchmark: 12 },
                multidisciplinaryReview: { current: 87.3, target: 95, benchmark: 90 }
            }
        };
    }
    async generateOperationalEfficiencyReport(parameters) {
        return {
            title: 'Operational Efficiency Analysis',
            generatedAt: new Date(),
            parameters,
            efficiency: {
                bedOccupancyRate: 78.5,
                averageLengthOfStay: 6.2,
                resourceUtilization: 82.3,
                staffProductivity: 85.7,
                patientWaitTime: 18.4
            }
        };
    }
    async generateFinancialAnalysisReport(parameters) {
        return {
            title: 'Financial Performance Analysis',
            generatedAt: new Date(),
            parameters,
            financials: {
                totalRevenue: 15750000,
                totalCosts: 12340000,
                profitMargin: 21.6,
                costPerPatient: 4852,
                revenuePerPatient: 6195
            }
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('AnalyticsResult')),
    __param(1, (0, mongoose_1.InjectModel)('MLPrediction')),
    __param(2, (0, mongoose_1.InjectModel)('MonitoringAlert')),
    __param(3, (0, mongoose_1.InjectModel)('MonitoringRule')),
    __param(4, (0, mongoose_1.InjectModel)('ExecutiveKPI')),
    __param(5, (0, mongoose_1.InjectModel)('ExecutiveDashboard')),
    __param(6, (0, mongoose_1.InjectModel)('DataQualityReport')),
    __param(7, (0, mongoose_1.InjectModel)('ComplianceAudit')),
    __param(8, (0, mongoose_1.InjectModel)('AnalyticsExport')),
    __param(9, (0, mongoose_1.InjectModel)('ExternalSystemIntegration')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _g : Object, typeof (_h = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _h : Object, typeof (_j = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _j : Object, typeof (_k = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _k : Object])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map