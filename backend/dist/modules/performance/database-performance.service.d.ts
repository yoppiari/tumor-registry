import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PerformanceMonitorService } from './performance-monitor.service';
export interface DatabasePerformanceMetrics {
    timestamp: Date;
    connectionPool: {
        total: number;
        active: number;
        idle: number;
        waiting: number;
    };
    queryPerformance: {
        averageTime: number;
        slowQueries: number;
        totalQueries: number;
        queriesPerSecond: number;
    };
    indexUsage: {
        hitRate: number;
        unusedIndexes: number;
        totalIndexes: number;
    };
    tableStats: {
        totalTables: number;
        bloatedTables: number;
        totalSize: string;
        totalRows: number;
    };
    cachePerformance: {
        hitRatio: number;
        size: string;
    };
}
export interface SlowQuery {
    query: string;
    calls: number;
    totalTime: number;
    meanTime: number;
    rows: number;
    firstSeen: Date;
}
export declare class DatabasePerformanceService implements OnModuleInit {
    private prisma;
    private performanceMonitor;
    private readonly logger;
    private metricsHistory;
    private readonly maxHistorySize;
    private readonly slowQueryThreshold;
    constructor(prisma: PrismaService, performanceMonitor: PerformanceMonitorService);
    onModuleInit(): Promise<void>;
    private initializeDatabaseMonitoring;
    private createPerformanceViews;
    collectDatabaseMetrics(): Promise<DatabasePerformanceMetrics>;
    private getConnectionPoolStats;
    private getQueryPerformanceStats;
    private getIndexUsageStats;
    private getTableStatistics;
    private getCachePerformanceStats;
    getSlowQueries(limit?: number): Promise<SlowQuery[]>;
    getOptimizationRecommendations(): Promise<Array<{
        category: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
        impact: string;
        effort: string;
        actions: string[];
    }>>;
    performDailyMaintenance(): Promise<void>;
    private updateTableStatistics;
    private analyzeIndexUsage;
    private checkTableBloat;
    private refreshMaterializedViews;
    private checkDatabaseAlerts;
    private getDefaultConnectionStats;
    private getDefaultQueryStats;
    private getDefaultIndexStats;
    private getDefaultTableStats;
    private getDefaultCacheStats;
    getMetricsHistory(hours?: number): DatabasePerformanceMetrics[];
    getHealthStatus(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        metrics?: DatabasePerformanceMetrics;
        alerts: string[];
    }>;
}
