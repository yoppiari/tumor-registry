import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { Readable } from 'stream';
export interface StreamOptions {
    batchSize?: number;
    memoryThreshold?: number;
    timeout?: number;
    enableProgressTracking?: boolean;
}
export interface StreamProgress {
    totalProcessed: number;
    totalBatches: number;
    currentBatch: number;
    estimatedRemaining: number;
    memoryUsage: NodeJS.MemoryUsage;
    startTime: Date;
}
export declare class StreamingService implements OnModuleInit {
    private prisma;
    private performanceMonitor;
    private readonly logger;
    private readonly DEFAULT_BATCH_SIZE;
    private readonly DEFAULT_MEMORY_THRESHOLD;
    private readonly DEFAULT_TIMEOUT;
    constructor(prisma: PrismaService, performanceMonitor: PerformanceMonitorService);
    onModuleInit(): Promise<void>;
    streamLargeDataset<T>(queryName: string, fetchBatch: (offset: number, limit: number) => Promise<T[]>, processor: (batch: T[], batchNumber: number) => Promise<void>, options?: StreamOptions): Promise<{
        totalProcessed: number;
        duration: number;
    }>;
    streamPatientsWithPagination(centerId?: string, processor: (patients: any[], batchNumber: number) => Promise<void>, options?: StreamOptions): Promise<{
        totalProcessed: number;
        duration: number;
    }>;
    streamCancerAnalytics(filters: {
        startDate?: Date;
        endDate?: Date;
        province?: string;
        cancerType?: string;
    }, processor: (data: any[], batchNumber: number) => Promise<void>, options?: StreamOptions): Promise<{
        totalProcessed: number;
        duration: number;
    }>;
    createPatientStream(centerId?: string): Readable;
    createCsvStream<T>(dataStream: Readable, headers: string[], rowMapper: (data: T) => string[]): Readable;
    processBatchWithRetry<T>(items: T[], processor: (batch: T[], batchNumber: number) => Promise<void>, options?: {
        batchSize?: number;
        maxRetries?: number;
        retryDelay?: number;
        parallelBatches?: number;
    }): Promise<{
        totalProcessed: number;
        failedBatches: number;
    }>;
    private performMemoryCleanup;
    private calculateRemainingTime;
    getMemoryUsage(): Promise<{
        current: NodeJS.MemoryUsage;
        percentage: number;
        threshold: number;
        isAboveThreshold: boolean;
    }>;
    createOptimizedQuery<T>(model: any, options?: {
        where?: any;
        select?: any;
        include?: any;
        orderBy?: any;
        batchSize?: number;
        maxResults?: number;
    }): {
        fetchBatch(offset: number): Promise<T[]>;
        getTotalCount(): Promise<number>;
    };
}
