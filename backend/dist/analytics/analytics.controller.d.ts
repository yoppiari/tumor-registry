import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsQueryDto } from './dto/create-analytics-query.dto';
import { CreateMLPredictionDto } from './dto/create-ml-prediction.dto';
import { CreateMonitoringRuleDto } from './dto/create-monitoring-rule.dto';
import { CreateExecutiveDashboardDto } from './dto/create-executive-dashboard.dto';
import { GenerateAnalyticsReportDto } from './dto/generate-analytics-report.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    executeAnalyticsQuery(req: any, queryDto: CreateAnalyticsQueryDto): Promise<import("./interfaces/analytics.interface").AnalyticsResult>;
    getCachedQueries(limit: number): Promise<{
        cachedResults: {
            id: string;
            query: string;
            result: {
                value: number;
                trend: string;
            };
            cachedAt: Date;
            expiresAt: Date;
        }[];
        total: number;
    }>;
    generateMLPrediction(req: any, predictionDto: CreateMLPredictionDto): Promise<import("./interfaces/analytics.interface").MLPrediction>;
    getMLModels(type?: string): Promise<{
        models: {
            id: string;
            name: string;
            type: string;
            algorithm: string;
            version: string;
            accuracy: number;
            features: number;
            trainingData: number;
            lastUpdated: Date;
            description: string;
        }[];
        total: number;
    }>;
    getMLPredictions(patientId?: string, modelType?: string, limit: number): Promise<{
        predictions: {
            id: string;
            patientId: string;
            modelType: string;
            prediction: {
                overallSurvival: number;
                probability: number;
            };
            confidence: number;
            createdAt: Date;
        }[];
        total: number;
    }>;
    createMonitoringRule(req: any, ruleDto: CreateMonitoringRuleDto): Promise<import("./interfaces/analytics.interface").MonitoringRule>;
    getMonitoringRules(enabled?: boolean, category?: string): Promise<{
        rules: {
            id: string;
            name: string;
            category: string;
            enabled: boolean;
            severity: string;
            lastTriggered: Date;
        }[];
        total: number;
    }>;
    getMonitoringAlerts(severity?: string, resolved?: boolean): Promise<import("./interfaces/analytics.interface").MonitoringAlert[]>;
    resolveAlert(req: any, alertId: string, resolutionData: {
        notes?: string;
        assignedTo?: string;
    }): Promise<{
        success: boolean;
        message: string;
        resolvedAt: Date;
    }>;
    createExecutiveDashboard(req: any, dashboardDto: CreateExecutiveDashboardDto): Promise<import("./interfaces/analytics.interface").ExecutiveDashboard>;
    getExecutiveDashboards(shared?: boolean): Promise<import("./interfaces/analytics.interface").ExecutiveDashboard[]>;
    getDashboardById(dashboardId: string): Promise<{
        id: string;
        name: string;
        widgets: {
            id: string;
            type: string;
            title: string;
            value: number;
            trend: string;
        }[];
        lastRefreshed: Date;
    }>;
    getExecutiveKPIs(category?: string, period?: string): Promise<import("./interfaces/analytics.interface").ExecutiveKPI[]>;
    getKPITrends(kpi: string, period: number, granularity?: string): Promise<{
        kpi: string;
        period: number;
        granularity: string;
        dataPoints: any[];
        trend: {
            direction: string;
            percentage: number;
        };
    }>;
    generateDataQualityReport(dataSource: string): Promise<import("./interfaces/analytics.interface").DataQualityReport>;
    getDataQualityReports(dataSource?: string, limit: number): Promise<{
        reports: {
            id: string;
            reportDate: Date;
            dataSource: string;
            overallScore: number;
            status: string;
        }[];
        total: number;
    }>;
    generateComplianceAudit(auditType: string): Promise<import("./interfaces/analytics.interface").ComplianceAudit>;
    getComplianceAudits(auditType?: string, status?: string): Promise<{
        audits: {
            id: string;
            auditType: string;
            auditDate: Date;
            status: string;
            overallScore: number;
        }[];
        total: number;
    }>;
    generateAdvancedReport(req: any, reportDto: GenerateAnalyticsReportDto): Promise<any>;
    getReportTemplates(category?: string): Promise<{
        templates: {
            id: string;
            name: string;
            category: string;
            description: string;
            parameters: string[];
            outputFormats: string[];
        }[];
        total: number;
    }>;
    getReportHistory(reportType?: string, limit: number): Promise<{
        reports: {
            id: string;
            reportType: string;
            title: string;
            generatedAt: Date;
            generatedBy: string;
            status: string;
            fileUrl: string;
        }[];
        total: number;
    }>;
    getSystemPerformance(timeframe: number): Promise<{
        timestamp: Date;
        responseTime: number;
        throughput: number;
        errorRate: number;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        networkLatency: number;
        databaseConnections: number;
        activeUsers: number;
        cacheHitRate: number;
        uptime: number;
        lastRestart: Date;
    }>;
    getHealthStatus(): Promise<{
        status: string;
        timestamp: Date;
        version: string;
        services: {
            analyticsEngine: string;
            mlModels: string;
            monitoring: string;
            dataQuality: string;
        };
        metrics: {
            cacheSize: number;
            activeQueries: number;
            queuedJobs: number;
            errorRate: number;
        };
    }>;
    discoverInsights(insightRequest: {
        dataSource: string;
        insightTypes: string[];
    }): Promise<{
        insights: {
            type: string;
            title: string;
            description: string;
            confidence: number;
            significance: number;
            impact: string;
            actionable: boolean;
        }[];
        discoveryTime: number;
    }>;
    generateBatchPredictions(batchRequest: {
        patientIds: string[];
        modelType: string;
    }): Promise<{
        batchId: any;
        totalPatients: number;
        completedPredictions: number;
        predictions: {
            patientId: string;
            prediction: {
                value: number;
                category: string;
            };
            confidence: number;
        }[];
        processingTime: number;
    }>;
}
