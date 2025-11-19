import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../performance/redis.service';
import { PerformanceMonitorService } from '../performance/performance-monitor.service';
export declare class AnalyticsService implements OnModuleInit {
    private prisma;
    private redisService;
    private performanceMonitor;
    private readonly logger;
    private readonly BATCH_SIZE;
    private readonly QUERY_TIMEOUT;
    constructor(prisma: PrismaService, redisService: RedisService, performanceMonitor: PerformanceMonitorService);
    onModuleInit(): Promise<void>;
    getDashboardData(centerId?: string, timeRange?: string): Promise<any>;
    getCancerStatistics(provinceId?: string, cancerType?: string): Promise<any>;
    getCancerTrends(period?: string): Promise<{
        period: string;
        data: {
            month: string;
            cases: number;
            trend: number;
        }[] | {
            quarter: string;
            cases: number;
        }[];
        growth: number;
    }>;
    getCenterPerformance(): Promise<{
        totalCenters: number;
        activeCenters: number;
        performance: {
            centerName: string;
            totalPatients: number;
            dataQuality: number;
            rank: number;
        }[];
        averageQuality: number;
        lastUpdated: Date;
    }>;
    private parseTimeRange;
    private initializePerformanceOptimizations;
    private createPerformanceIndexes;
    private initializeConnectionPooling;
    private getPatientStatisticsOptimized;
    private getMedicalRecordStatisticsOptimized;
    private getGeographicDistributionOptimized;
    private getCancerTypeDistributionOptimized;
    private getTotalCancerCasesOptimized;
    private getCancerDemographicsOptimized;
    private getGeographicCancerDataOptimized;
    private getCancerTrendsOptimized;
    private getNewCasesThisMonthOptimized;
    private getMostCommonCancersOptimized;
    streamLargeDataset<T>(query: () => Promise<T[]>, batchSize: number, processor: (batch: T[]) => Promise<void>): Promise<void>;
    processAnalyticsBatch<T>(items: T[], batchSize: number, processor: (batch: T[]) => Promise<void>): Promise<void>;
    private getDefaultCancerDistribution;
    private getDefaultDemographics;
    measureQueryPerformance<T>(queryName: string, query: () => Promise<T>): Promise<{
        result: T;
        executionTime: number;
    }>;
    getConnectionPoolStats(): Promise<any>;
}
