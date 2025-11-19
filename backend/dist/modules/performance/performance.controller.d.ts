import { Response } from 'express';
import { PerformanceService } from './performance.service';
import { RedisService } from './redis.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { StreamingService } from './streaming.service';
import { DatabasePerformanceService } from './database-performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    private readonly redisService;
    private readonly performanceMonitor;
    private readonly streamingService;
    private readonly databasePerformance;
    constructor(performanceService: PerformanceService, redisService: RedisService, performanceMonitor: PerformanceMonitorService, streamingService: StreamingService, databasePerformance: DatabasePerformanceService);
    getDatabaseOptimizationRecommendations(): Promise<any>;
    getApplicationPerformanceMetrics(): Promise<any>;
    implementCachingStrategy(): Promise<any>;
    optimizeQueryPerformance(): Promise<any>;
    getPerformanceDashboard(): Promise<{
        timestamp: Date;
        database: any;
        application: any;
        caching: any;
        summary: {
            healthScore: any;
            totalRecommendations: any;
            criticalIssues: any;
            estimatedImpact: any;
            optimizationProgress: number;
        };
        quickActions: {
            title: string;
            description: string;
            impact: string;
            effort: string;
            timeframe: string;
        }[];
        performanceTrends: {
            responseTime: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            errorRate: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            cacheHitRate: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            memoryUsage: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
        };
    }>;
    runBenchmark(benchmarkConfig: {
        testTypes: string[];
        duration: number;
        concurrency: number;
        scenarios: any[];
    }): Promise<{
        timestamp: Date;
        configuration: {
            testTypes: string[];
            duration: number;
            concurrency: number;
            scenarios: any[];
        };
        results: {
            loadTesting: {
                averageResponseTime: number;
                peakResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
                throughput: number;
            };
            stressTesting: {
                maxConcurrentUsers: number;
                breakingPoint: number;
                recoveryTime: number;
            };
            enduranceTesting: {
                duration: string;
                memoryLeakDetected: boolean;
                performanceDegradation: number;
                averageResponseTime: number;
            };
        };
        comparisons: {
            baseline: {
                averageResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
            };
            current: {
                averageResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
            };
            improvement: {
                responseTime: string;
                throughput: string;
                reliability: string;
            };
        };
        recommendations: {
            category: string;
            priority: string;
            title: string;
            description: string;
        }[];
    }>;
    private calculateOptimizationProgress;
    getCacheInfo(): Promise<{
        connected: boolean;
        memory: string;
        keys: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
    clearCache(pattern?: string): Promise<{
        message: string;
        pattern: string;
        deletedCount: number;
    }>;
    getPerformanceMetrics(queryName?: string): Promise<{
        queryMetrics: import("./performance-monitor.service").QueryPerformanceData[] | {
            queryName: string;
            metrics: import("./performance-monitor.service").QueryPerformanceData[];
        }[];
        systemMetrics: import("./performance-monitor.service").PerformanceMetrics[];
        summary: {
            totalQueries: number;
            avgQueryTime: number;
            errorRate: number;
            slowQueries: number;
            memoryUsage: NodeJS.MemoryUsage;
            timestamp: Date;
        };
        timestamp: Date;
    }>;
    getPrometheusMetrics(): Promise<string>;
    getHealthStatus(): Promise<{
        timestamp: Date;
        status: string;
        components: {
            monitoring: string;
            redis: string;
            database: "healthy" | "unhealthy" | "degraded";
            api: string;
        };
        alerts: string[];
    }>;
    streamPatients(res: Response, centerId?: string, format?: string): Promise<void>;
    getDatabaseMetrics(): Promise<import("./database-performance.service").DatabasePerformanceMetrics>;
    getSlowQueries(limit?: number): Promise<import("./database-performance.service").SlowQuery[]>;
    getDatabaseRecommendations(): Promise<{
        category: string;
        priority: "low" | "medium" | "high" | "critical";
        title: string;
        description: string;
        impact: string;
        effort: string;
        actions: string[];
    }[]>;
    triggerDatabaseMaintenance(maintenanceConfig: {
        tasks: string[];
        schedule?: string;
    }): Promise<{
        message: string;
        tasks: string[];
        scheduledAt: Date;
        estimatedDuration: string;
    }>;
    getRealTimeAnalytics(): Promise<{
        timestamp: Date;
        responseTime: number;
        performance: {
            system: import("./performance-monitor.service").PerformanceMetrics[];
            cache: {
                connected: boolean;
                memory: string;
                keys: number;
                hits: number;
                misses: number;
                hitRate: number;
            };
            queries: import("./performance-monitor.service").QueryPerformanceData[] | {
                queryName: string;
                metrics: import("./performance-monitor.service").QueryPerformanceData[];
            }[];
            database: import("./database-performance.service").DatabasePerformanceMetrics;
        };
        health: {
            status: string;
            score: number;
        };
    }>;
    warmCache(warmConfig: {
        dataTypes: string[];
        centerId?: string;
        timeRange?: string;
    }): Promise<{
        message: string;
        entriesCount: number;
        estimatedDuration: string;
        dataTypes: string[];
    }>;
    getPerformanceAlerts(): Promise<{
        timestamp: Date;
        totalAlerts: number;
        alerts: any[];
    }>;
    exportMetrics(format: string, hours: number, res: Response): Promise<void>;
}
