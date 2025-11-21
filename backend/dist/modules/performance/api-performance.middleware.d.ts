import { NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { PerformanceMonitorService } from './performance-monitor.service';
import { RedisService } from './redis.service';
export interface ApiPerformanceMetrics {
    requestId: string;
    method: string;
    url: string;
    userAgent: string;
    ip: string;
    userId?: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    statusCode?: number;
    responseSize?: number;
    cached?: boolean;
    error?: string;
}
export declare class ApiPerformanceMiddleware implements NestMiddleware {
    private performanceMonitor;
    private redisService;
    private readonly logger;
    private readonly SLOW_REQUEST_THRESHOLD;
    private readonly CACHEABLE_METHODS;
    private readonly CACHEABLE_STATUS_CODES;
    constructor(performanceMonitor: PerformanceMonitorService, redisService: RedisService);
    use(req: FastifyRequest, reply: FastifyReply, next: NextFunction): Promise<void>;
    private generateRequestId;
    private getClientIp;
    private getUserId;
    private getCacheKey;
    private cacheResponse;
    private getCacheTTL;
    private recordMetrics;
    private extractEndpoint;
    static createPerformanceConfig(): {
        compression: {
            threshold: number;
            level: number;
        };
        rateLimit: {
            windowMs: number;
            max: number;
            message: string;
        };
        timeout: {
            connection: number;
            read: number;
            write: number;
        };
        connectionPool: {
            max: number;
            min: number;
            idleTimeoutMillis: number;
        };
        caching: {
            defaultTTL: number;
            maxSize: number;
            checkPeriod: number;
        };
        thresholds: {
            slowRequest: number;
            errorRate: number;
            memoryUsage: number;
            cpuUsage: number;
        };
    };
    getHealthStatus(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        metrics: {
            averageResponseTime: number;
            errorRate: number;
            cacheHitRate: number;
            memoryUsage: number;
            activeConnections: number;
        };
        alerts: string[];
    }>;
}
