import { PredictiveAnalyticsService } from './predictive-analytics.service';
export declare class PredictiveAnalyticsController {
    private readonly predictiveAnalyticsService;
    constructor(predictiveAnalyticsService: PredictiveAnalyticsService);
    getCancerRiskPrediction(patientId: string): Promise<any>;
    getTreatmentResponsePrediction(patientId: string, treatmentData: {
        treatmentType: string;
    }): Promise<any>;
    getSurvivalPrediction(patientId: string): Promise<any>;
    getRecurrenceRiskPrediction(patientId: string): Promise<any>;
    getPopulationRiskProjection(province?: string, years?: string): Promise<any>;
    getMLModelMetrics(): Promise<any>;
    getBatchRiskAssessment(batchData: {
        patientIds: string[];
        assessmentType: 'cancer-risk' | 'treatment-response' | 'survival' | 'recurrence';
        treatmentType?: string;
    }): Promise<{
        totalProcessed: number;
        successful: number;
        failed: number;
        results: ({
            patientId: string;
            success: boolean;
            data: any;
            error?: undefined;
        } | {
            patientId: string;
            success: boolean;
            error: any;
            data?: undefined;
        })[];
        assessmentType: "cancer-risk" | "treatment-response" | "survival" | "recurrence";
    }>;
    getRiskDistributionAnalysis(centerId?: string): Promise<{
        message: string;
        centerId: string;
        data: {
            lowRisk: {
                count: number;
                percentage: number;
            };
            moderateRisk: {
                count: number;
                percentage: number;
            };
            highRisk: {
                count: number;
                percentage: number;
            };
            veryHighRisk: {
                count: number;
                percentage: number;
            };
            distribution: {
                score: number;
                count: number;
            }[];
        };
    }>;
    getPredictionAccuracyAnalysis(): Promise<{
        message: string;
        data: {
            cancerRiskPrediction: {
                accuracy: number;
                precision: number;
                recall: number;
                f1Score: number;
                aucScore: number;
                calibration: number;
            };
            treatmentResponse: {
                accuracy: number;
                precision: number;
                recall: number;
                f1Score: number;
                aucScore: number;
            };
            survivalPrediction: {
                cIndex: number;
                calibrationScore: number;
                brierScore: number;
                integratedBrierScore: number;
            };
            recurrenceRisk: {
                accuracy: number;
                sensitivity: number;
                specificity: number;
                aucScore: number;
            };
        };
    }>;
    getModelPerformanceAnalytics(): Promise<{
        message: string;
        data: {
            performance: {
                training: {
                    accuracy: number;
                    loss: number;
                    precision: number;
                    recall: number;
                };
                validation: {
                    accuracy: number;
                    loss: number;
                    precision: number;
                    recall: number;
                };
                test: {
                    accuracy: number;
                    loss: number;
                    precision: number;
                    recall: number;
                };
            };
            metrics: {
                epoch: number;
                trainLoss: number;
                valLoss: number;
                trainAccuracy: number;
                valAccuracy: number;
            }[];
            featureImportance: {
                feature: string;
                importance: number;
            }[];
        };
    }>;
    retrainModels(retrainData: {
        models: string[];
        trainingDataPeriod?: {
            from: string;
            to: string;
        };
    }): Promise<{
        message: string;
        models: string[];
        trainingDataPeriod: {
            from: string;
            to: string;
        };
        jobId: string;
        estimatedDuration: string;
        status: string;
    }>;
    getTrainingStatus(jobId: string): Promise<{
        jobId: string;
        status: string;
        progress: number;
        estimatedTimeRemaining: string;
        currentEpoch: number;
        totalEpochs: number;
        validationLoss: number;
        trainingLoss: number;
        metrics: {
            accuracy: number;
            precision: number;
            recall: number;
            f1Score: number;
        };
    }>;
    validatePrediction(validationData: {
        patientId: string;
        predictionId: string;
        actualOutcome: any;
        predictionType: 'risk' | 'response' | 'survival' | 'recurrence';
    }): Promise<{
        message: string;
        validationData: {
            patientId: string;
            predictionId: string;
            actualOutcome: any;
            predictionType: "risk" | "response" | "survival" | "recurrence";
        };
        impact: {
            modelAccuracyChange: number;
            confidenceUpdate: number;
            featureWeightsAdjusted: string[];
        };
    }>;
    getClinicalDecisionSupportDashboard(): Promise<{
        message: string;
        lastUpdated: Date;
        metrics: {
            activePredictions: number;
            highRiskAlerts: number;
            treatmentRecommendations: number;
            accuracyToday: number;
        };
        alerts: {
            type: string;
            patientId: string;
            message: string;
            urgency: string;
        }[];
        recommendations: {
            category: string;
            count: number;
            priority: string;
        }[];
    }>;
    generateInsights(insightData: {
        dataType: 'population' | 'patient' | 'treatment' | 'outcomes';
        focus: string;
        parameters?: any;
    }): Promise<{
        message: string;
        insights: ({
            category: string;
            finding: string;
            confidence: number;
            significance: string;
            actionable?: undefined;
        } | {
            category: string;
            finding: string;
            confidence: number;
            actionable: boolean;
            significance?: undefined;
        })[];
        recommendations: string[];
        generatedAt: Date;
    }>;
}
