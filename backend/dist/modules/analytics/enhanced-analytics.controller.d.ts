import { EnhancedAnalyticsService } from './enhanced-analytics.service';
import { RedisService } from './redis.service';
export declare class EnhancedAnalyticsController {
    private readonly enhancedAnalyticsService;
    private readonly redisService;
    constructor(enhancedAnalyticsService: EnhancedAnalyticsService, redisService: RedisService);
    getExecutiveDashboard(centerId?: string, timeRange?: string): Promise<any>;
    getNationalIntelligence(): Promise<any>;
    getPerformanceBenchmarking(centerId?: string, benchmarkPeriod?: string): Promise<any>;
    getCenterPerformanceMetrics(centerId: string, period?: string): Promise<any>;
    getPredictiveTrends(cancerType?: string, geographicLevel?: string, predictionHorizon?: number): Promise<any>;
    getCancerTypeTrends(cancerType: string, geographicLevel?: string, predictionHorizon?: number): Promise<any>;
    getResearchImpact(researchRequestId?: string, impactType?: string, timeFrame?: string): Promise<any>;
    getResearchImpactSummary(timeFrame?: string): Promise<any>;
    getRealTimeMetrics(): Promise<unknown>;
    getCacheStats(): Promise<{
        memoryStats: any;
        performanceMetrics: any;
        health: boolean;
        timestamp: Date;
    }>;
    getCacheMetrics(): Promise<any>;
    invalidateAllCache(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    invalidateCenterCache(centerId: string): Promise<{
        message: string;
        centerId: string;
        timestamp: Date;
    }>;
    invalidatePatientCache(patientId: string): Promise<{
        message: string;
        patientId: string;
        timestamp: Date;
    }>;
    refreshMaterializedViews(): Promise<any>;
    getDataQualitySummary(centerId?: string, timeRange?: string): Promise<{
        overallQuality: any;
        recommendations: string[];
        lastUpdated: any;
    }>;
    getAnalyticsHealth(): Promise<{
        status: string;
        services: {
            redis: {
                status: string;
                responseTime: string;
            };
            analytics: {
                status: string;
                responseTime: string;
            };
            database: {
                status: string;
                responseTime: string;
            };
        };
        performance: {
            cacheHitRate: any;
            cacheEfficiency: string;
        };
        timestamp: Date;
    }>;
    getRecentEvents(eventType?: string, limit?: number): Promise<{
        events: ({
            eventType: string;
            timestamp: Date;
            data: {
                dashboardId: string;
                queryType?: undefined;
                duration?: undefined;
                cacheKey?: undefined;
            };
        } | {
            eventType: string;
            timestamp: Date;
            data: {
                queryType: string;
                duration: number;
                dashboardId?: undefined;
                cacheKey?: undefined;
            };
        } | {
            eventType: string;
            timestamp: Date;
            data: {
                cacheKey: string;
                dashboardId?: undefined;
                queryType?: undefined;
                duration?: undefined;
            };
        })[];
        total: number;
        timestamp: Date;
    }>;
    optimizeCache(): Promise<{
        message: string;
        actions: string[];
        timestamp: Date;
    }>;
}
