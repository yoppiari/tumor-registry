import { OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
export interface PerformanceMetrics {
    queryTime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    timestamp: Date;
}
export interface QueryPerformanceData {
    queryName: string;
    executionTime: number;
    timestamp: Date;
    success: boolean;
    error?: Error;
}
export declare class PerformanceMonitorService extends EventEmitter implements OnModuleInit {
    private readonly logger;
    private readonly queryMetrics;
    private readonly memoryMetrics;
    private readonly maxHistorySize;
    private readonly alertThresholds;
    private queryDuration;
    private queryCounter;
    private queryErrors;
    private memoryUsageGauge;
    private cacheHitRateGauge;
    constructor();
    onModuleInit(): Promise<void>;
    private initializePrometheusMetrics;
    private startMonitoring;
    recordQueryTime(queryName: string, executionTime: number, success?: boolean, error?: Error): void;
    recordError(queryName: string, error: Error): void;
    private checkQueryAlerts;
    private collectSystemMetrics;
    private analyzeQueryPerformance;
    private cleanupOldMetrics;
    private calculatePercentile;
    getQueryMetrics(queryName?: string): QueryPerformanceData[] | {
        queryName: string;
        metrics: QueryPerformanceData[];
    }[];
    getSystemMetrics(): PerformanceMetrics[];
    getPerformanceSummary(): {
        totalQueries: number;
        avgQueryTime: number;
        errorRate: number;
        slowQueries: number;
        memoryUsage: NodeJS.MemoryUsage;
        timestamp: Date;
    };
    recordCacheHitRate(cacheType: string, hitRate: number): void;
    getPrometheusMetrics(): Promise<string>;
    isHealthy(): Promise<boolean>;
    resetMetrics(): void;
    exportMetrics(): {
        timestamp: Date;
        performance: {
            queries: {
                total: number;
                averageTime: number;
                errorRate: number;
                slowQueries: number;
            };
            memory: {
                used: number;
                total: number;
                external: number;
                rss: number;
            };
            health: {
                status: Promise<boolean>;
                alerts: {
                    slowQueryThreshold: number;
                    memoryThreshold: number;
                    errorThreshold: number;
                };
            };
        };
    };
}
