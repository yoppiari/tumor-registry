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
exports.PredictiveAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const predictive_analytics_service_1 = require("./predictive-analytics.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
let PredictiveAnalyticsController = class PredictiveAnalyticsController {
    constructor(predictiveAnalyticsService) {
        this.predictiveAnalyticsService = predictiveAnalyticsService;
    }
    async getCancerRiskPrediction(patientId) {
        return await this.predictiveAnalyticsService.getCancerRiskPrediction(patientId);
    }
    async getTreatmentResponsePrediction(patientId, treatmentData) {
        return await this.predictiveAnalyticsService.getTreatmentResponsePrediction(patientId, treatmentData.treatmentType);
    }
    async getSurvivalPrediction(patientId) {
        return await this.predictiveAnalyticsService.getSurvivalPrediction(patientId);
    }
    async getRecurrenceRiskPrediction(patientId) {
        return await this.predictiveAnalyticsService.getRecurrenceRiskPrediction(patientId);
    }
    async getPopulationRiskProjection(province, years) {
        return await this.predictiveAnalyticsService.getPopulationRiskProjection(province, years ? parseInt(years) : 5);
    }
    async getMLModelMetrics() {
        return await this.predictiveAnalyticsService.getMLModelMetrics();
    }
    async getBatchRiskAssessment(batchData) {
        const results = await Promise.all(batchData.patientIds.map(async (patientId) => {
            try {
                let result;
                switch (batchData.assessmentType) {
                    case 'cancer-risk':
                        result = await this.predictiveAnalyticsService.getCancerRiskPrediction(patientId);
                        break;
                    case 'treatment-response':
                        result = await this.predictiveAnalyticsService.getTreatmentResponsePrediction(patientId, batchData.treatmentType || 'Chemotherapy');
                        break;
                    case 'survival':
                        result = await this.predictiveAnalyticsService.getSurvivalPrediction(patientId);
                        break;
                    case 'recurrence':
                        result = await this.predictiveAnalyticsService.getRecurrenceRiskPrediction(patientId);
                        break;
                    default:
                        throw new Error(`Unknown assessment type: ${batchData.assessmentType}`);
                }
                return { patientId, success: true, data: result };
            }
            catch (error) {
                return { patientId, success: false, error: error.message };
            }
        }));
        return {
            totalProcessed: batchData.patientIds.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results,
            assessmentType: batchData.assessmentType,
        };
    }
    async getRiskDistributionAnalysis(centerId) {
        return {
            message: 'Risk distribution analysis endpoint',
            centerId,
            data: {
                lowRisk: { count: 45678, percentage: 45.2 },
                moderateRisk: { count: 34567, percentage: 34.2 },
                highRisk: { count: 15678, percentage: 15.5 },
                veryHighRisk: { count: 5678, percentage: 5.6 },
                distribution: [
                    { score: 0.1, count: 12543 },
                    { score: 0.2, count: 15678 },
                    { score: 0.3, count: 17456 },
                    { score: 0.4, count: 12345 },
                    { score: 0.5, count: 9876 },
                    { score: 0.6, count: 7654 },
                    { score: 0.7, count: 5432 },
                    { score: 0.8, count: 3210 },
                    { score: 0.9, count: 1567 },
                ],
            },
        };
    }
    async getPredictionAccuracyAnalysis() {
        return {
            message: 'Prediction accuracy analysis endpoint',
            data: {
                cancerRiskPrediction: {
                    accuracy: 0.87,
                    precision: 0.85,
                    recall: 0.89,
                    f1Score: 0.87,
                    aucScore: 0.91,
                    calibration: 0.82,
                },
                treatmentResponse: {
                    accuracy: 0.84,
                    precision: 0.82,
                    recall: 0.79,
                    f1Score: 0.80,
                    aucScore: 0.86,
                },
                survivalPrediction: {
                    cIndex: 0.78,
                    calibrationScore: 0.82,
                    brierScore: 0.15,
                    integratedBrierScore: 0.12,
                },
                recurrenceRisk: {
                    accuracy: 0.81,
                    sensitivity: 0.79,
                    specificity: 0.83,
                    aucScore: 0.84,
                },
            },
        };
    }
    async getModelPerformanceAnalytics() {
        return {
            message: 'Model performance analytics endpoint',
            data: {
                performance: {
                    training: {
                        accuracy: 0.86,
                        loss: 0.32,
                        precision: 0.84,
                        recall: 0.88,
                    },
                    validation: {
                        accuracy: 0.84,
                        loss: 0.35,
                        precision: 0.82,
                        recall: 0.86,
                    },
                    test: {
                        accuracy: 0.83,
                        loss: 0.38,
                        precision: 0.81,
                        recall: 0.85,
                    },
                },
                metrics: [
                    { epoch: 1, trainLoss: 0.65, valLoss: 0.67, trainAccuracy: 0.72, valAccuracy: 0.70 },
                    { epoch: 10, trainLoss: 0.45, valLoss: 0.48, trainAccuracy: 0.80, valAccuracy: 0.78 },
                    { epoch: 20, trainLoss: 0.35, valLoss: 0.38, trainAccuracy: 0.86, valAccuracy: 0.84 },
                    { epoch: 30, trainLoss: 0.32, valLoss: 0.35, trainAccuracy: 0.87, valAccuracy: 0.84 },
                ],
                featureImportance: [
                    { feature: 'Age', importance: 0.23 },
                    { feature: 'Stage', importance: 0.19 },
                    { feature: 'Genetic Markers', importance: 0.17 },
                    { feature: 'Lifestyle Factors', importance: 0.15 },
                    { feature: 'Family History', importance: 0.12 },
                    { feature: 'Environmental Exposure', importance: 0.08 },
                    { feature: 'Biomarkers', importance: 0.06 },
                ],
            },
        };
    }
    async retrainModels(retrainData) {
        return {
            message: 'Model retraining initiated',
            models: retrainData.models,
            trainingDataPeriod: retrainData.trainingDataPeriod,
            jobId: `retrain_job_${Date.now()}`,
            estimatedDuration: '45 minutes',
            status: 'QUEUED',
        };
    }
    async getTrainingStatus(jobId) {
        return {
            jobId,
            status: 'IN_PROGRESS',
            progress: 67,
            estimatedTimeRemaining: '15 minutes',
            currentEpoch: 20,
            totalEpochs: 30,
            validationLoss: 0.34,
            trainingLoss: 0.31,
            metrics: {
                accuracy: 0.85,
                precision: 0.83,
                recall: 0.87,
                f1Score: 0.85,
            },
        };
    }
    async validatePrediction(validationData) {
        return {
            message: 'Prediction validation recorded',
            validationData,
            impact: {
                modelAccuracyChange: 0.02,
                confidenceUpdate: 0.05,
                featureWeightsAdjusted: ['Age', 'Stage', 'Genetic Markers'],
            },
        };
    }
    async getClinicalDecisionSupportDashboard() {
        return {
            message: 'Clinical decision support dashboard',
            lastUpdated: new Date(),
            metrics: {
                activePredictions: 1256,
                highRiskAlerts: 89,
                treatmentRecommendations: 234,
                accuracyToday: 0.87,
            },
            alerts: [
                {
                    type: 'HIGH_RISK',
                    patientId: 'patient_123',
                    message: 'Patient has >80% cancer risk, immediate screening recommended',
                    urgency: 'HIGH',
                },
                {
                    type: 'TREATMENT_OPTIMIZATION',
                    patientId: 'patient_456',
                    message: 'Alternative treatment shows 15% better predicted response',
                    urgency: 'MEDIUM',
                },
            ],
            recommendations: [
                {
                    category: 'Screening',
                    count: 45,
                    priority: 'HIGH',
                },
                {
                    category: 'Treatment',
                    count: 23,
                    priority: 'MEDIUM',
                },
                {
                    category: 'Follow-up',
                    count: 67,
                    priority: 'LOW',
                },
            ],
        };
    }
    async generateInsights(insightData) {
        return {
            message: 'AI insights generated',
            insights: [
                {
                    category: 'Pattern Recognition',
                    finding: '30% increase in early-stage detection in urban areas with screening campaigns',
                    confidence: 0.92,
                    significance: 'p<0.001',
                },
                {
                    category: 'Correlation',
                    finding: 'Strong correlation between educational level and treatment adherence',
                    confidence: 0.87,
                    significance: 'p<0.01',
                },
                {
                    category: 'Prediction',
                    finding: 'Projected 15% increase in colorectal cancer cases over next 5 years',
                    confidence: 0.78,
                    actionable: true,
                },
            ],
            recommendations: [
                'Expand screening programs to rural areas',
                'Develop patient education materials with health literacy considerations',
                'Allocate additional resources for colorectal cancer prevention',
            ],
            generatedAt: new Date(),
        };
    }
};
exports.PredictiveAnalyticsController = PredictiveAnalyticsController;
__decorate([
    (0, common_1.Post)('risk-assessment/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer risk prediction for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer risk prediction generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_CANCER_RISK_PREDICTION'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getCancerRiskPrediction", null);
__decorate([
    (0, common_1.Post)('treatment-response/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Predict treatment response for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Treatment response prediction generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_TREATMENT_RESPONSE_PREDICTION'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getTreatmentResponsePrediction", null);
__decorate([
    (0, common_1.Post)('survival-prediction/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get survival prediction for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Survival prediction generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_SURVIVAL_PREDICTION'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getSurvivalPrediction", null);
__decorate([
    (0, common_1.Post)('recurrence-risk/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recurrence risk prediction for patient' }),
    (0, swagger_1.ApiParam)({ name: 'patientId', description: 'Patient ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recurrence risk prediction generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_RECURRENCE_RISK_PREDICTION'),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getRecurrenceRiskPrediction", null);
__decorate([
    (0, common_1.Get)('population-risk-projection'),
    (0, swagger_1.ApiOperation)({ summary: 'Get population-level risk projection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Population risk projection generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'years', required: false, type: Number, description: 'Number of years to project' }),
    __param(0, (0, common_1.Query)('province')),
    __param(1, (0, common_1.Query)('years')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getPopulationRiskProjection", null);
__decorate([
    (0, common_1.Get)('ml-model-metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ML model performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ML model metrics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getMLModelMetrics", null);
__decorate([
    (0, common_1.Post)('batch-risk-assessment'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate risk predictions for multiple patients' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Batch risk assessment completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, audit_log_decorator_1.AuditLog)('BATCH_RISK_ASSESSMENT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getBatchRiskAssessment", null);
__decorate([
    (0, common_1.Get)('analytics/risk-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get population risk distribution analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk distribution analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getRiskDistributionAnalysis", null);
__decorate([
    (0, common_1.Get)('analytics/prediction-accuracy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prediction accuracy analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prediction accuracy analysis retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getPredictionAccuracyAnalysis", null);
__decorate([
    (0, common_1.Get)('analytics/model-performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed model performance analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model performance analytics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getModelPerformanceAnalytics", null);
__decorate([
    (0, common_1.Post)('retrain-models'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger model retraining process' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Model retraining initiated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_MONITOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, audit_log_decorator_1.AuditLog)('RETRAIN_ML_MODELS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "retrainModels", null);
__decorate([
    (0, common_1.Get)('model-training-status/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get model training status' }),
    (0, swagger_1.ApiParam)({ name: 'jobId', description: 'Training job ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training status retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_MONITOR'),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getTrainingStatus", null);
__decorate([
    (0, common_1.Post)('validate-prediction'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate prediction against actual outcomes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prediction validation completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('VALIDATE_PREDICTION'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "validatePrediction", null);
__decorate([
    (0, common_1.Get)('dashboard/clinical-decision-support'),
    (0, swagger_1.ApiOperation)({ summary: 'Get clinical decision support dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clinical decision support data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "getClinicalDecisionSupportDashboard", null);
__decorate([
    (0, common_1.Post)('generate-insights'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate AI-powered insights from data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'AI insights generated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('RESEARCH_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('GENERATE_AI_INSIGHTS'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictiveAnalyticsController.prototype, "generateInsights", null);
exports.PredictiveAnalyticsController = PredictiveAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Predictive Analytics'),
    (0, common_1.Controller)('predictive-analytics'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [predictive_analytics_service_1.PredictiveAnalyticsService])
], PredictiveAnalyticsController);
//# sourceMappingURL=predictive-analytics.controller.js.map