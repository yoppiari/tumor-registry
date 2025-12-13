import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { PerformanceMonitorService } from './performance-monitor.service';
import { RedisService } from './redis.service';

type DoneFunction = (error?: Error | any) => void;

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

@Injectable()
export class ApiPerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ApiPerformanceMiddleware.name);
  private readonly SLOW_REQUEST_THRESHOLD = 2000; // 2 seconds
  private readonly CACHEABLE_METHODS = ['GET'];
  private readonly CACHEABLE_STATUS_CODES = [200, 304];

  constructor(
    private performanceMonitor: PerformanceMonitorService,
    private redisService: RedisService,
  ) {}

  async use(req: FastifyRequest, reply: FastifyReply, done: DoneFunction) {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Attach metrics to request
    const metrics: ApiPerformanceMetrics = {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: this.getClientIp(req),
      userId: this.getUserId(req),
      startTime,
    };

    // Add request ID to response headers
    reply.header('X-Request-ID', requestId);

    // Check cache for GET requests
    let isCached = false;
    if (this.CACHEABLE_METHODS.includes(req.method)) {
      const cacheKey = this.getCacheKey(req);
      const cachedResponse = await this.redisService.get(cacheKey);

      if (cachedResponse) {
        try {
          const cached = JSON.parse(cachedResponse);

          // Set cached response headers
          reply.header('X-Cache', 'HIT');
          reply.header('X-Cache-Key', cacheKey);

          // Send cached response
          reply.status(cached.statusCode).send(cached.data);

          // Record cache hit metrics
          metrics.endTime = Date.now();
          metrics.duration = metrics.endTime - metrics.startTime;
          metrics.statusCode = cached.statusCode;
          metrics.cached = true;

          this.recordMetrics(metrics);
          this.performanceMonitor.recordCacheHitRate('api_responses', 85);

          return;
        } catch (error) {
          this.logger.warn('Invalid cached response:', error);
        }
      } else {
        reply.header('X-Cache', 'MISS');
        reply.header('X-Cache-Key', cacheKey);
      }
    }

    // TODO: Implement response interception for Fastify
    // For now, just record basic metrics
    const slowRequestTimer = setTimeout(() => {
      this.logger.warn(
        `Slow request detected: ${req.method} ${req.url} - ${Date.now() - startTime}ms (ID: ${requestId})`
      );

      this.performanceMonitor.emit('slowRequest', {
        requestId,
        method: req.method,
        url: req.url,
        duration: Date.now() - startTime,
        timestamp: new Date(),
      });
    }, this.SLOW_REQUEST_THRESHOLD);

    // Record metrics when request completes
    reply.raw.on('finish', () => {
      clearTimeout(slowRequestTimer);
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.statusCode = reply.statusCode;
      this.recordMetrics(metrics);
    });

    // Handle request errors
    reply.raw.on('error', (error) => {
      clearTimeout(slowRequestTimer);
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      metrics.error = error.message;
      this.recordMetrics(metrics);
    });

    done();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientIp(req: FastifyRequest): string {
    return (
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }

  private getUserId(req: FastifyRequest): string | undefined {
    // Try to get user ID from JWT token or session
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // In a real implementation, you'd decode the JWT token
        // For now, return undefined
        return undefined;
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }

  private getCacheKey(req: FastifyRequest): string {
    const url = req.url;
    const query = JSON.stringify(req.query);
    const hash = Buffer.from(`${req.method}:${url}:${query}`).toString('base64');
    return `api_cache:${hash}`;
  }

  private async cacheResponse(req: FastifyRequest, reply: FastifyReply, body: any): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(req);
      const ttl = this.getCacheTTL(req);

      const cacheData = {
        statusCode: reply.statusCode,
        data: typeof body === 'string' ? body : JSON.parse(body),
        headers: {
          'content-type': reply.getHeader('content-type'),
        },
        cachedAt: new Date().toISOString(),
      };

      await this.redisService.setex(cacheKey, ttl, JSON.stringify(cacheData));
    } catch (error) {
      this.logger.error('Failed to cache response:', error);
    }
  }

  private getCacheTTL(req: FastifyRequest): number {
    const url = req.url;

    // Different TTL for different endpoints
    if (url.includes('/analytics/')) return 600; // 10 minutes for analytics
    if (url.includes('/patients/')) return 300; // 5 minutes for patients
    if (url.includes('/reports/')) return 1800; // 30 minutes for reports
    if (url.includes('/dashboard/')) return 900; // 15 minutes for dashboard

    return 300; // Default 5 minutes
  }

  private recordMetrics(metrics: ApiPerformanceMetrics): void {
    try {
      // Record in performance monitor
      this.performanceMonitor.recordQueryTime(
        `api_${metrics.method}_${this.extractEndpoint(metrics.url)}`,
        metrics.duration || 0,
        !metrics.error,
        metrics.error ? new Error(metrics.error) : undefined
      );

      // Emit API performance event
      this.performanceMonitor.emit('apiRequest', metrics);

      // Log slow requests
      if (metrics.duration && metrics.duration > this.SLOW_REQUEST_THRESHOLD) {
        this.logger.warn(
          `Slow API request: ${metrics.method} ${metrics.url} - ${metrics.duration}ms (ID: ${metrics.requestId})`
        );
      }

      // Log errors
      if (metrics.error || (metrics.statusCode && metrics.statusCode >= 400)) {
        this.logger.error(
          `API error: ${metrics.method} ${metrics.url} - ${metrics.statusCode || 'Unknown'} - ${metrics.error || 'Unknown error'}`
        );
      }

      // Log cache hits
      if (metrics.cached) {
        this.performanceMonitor.recordCacheHitRate('api_responses_cache_hit', 100);
      }
    } catch (error) {
      this.logger.error('Failed to record API metrics:', error);
    }
  }

  private extractEndpoint(url: string): string {
    // Extract endpoint name from URL for metrics
    const parts = url.split('/').filter(part => part && part !== 'api' && !part.match(/^[0-9a-fA-F]{24}$/));
    return parts.join('_') || 'unknown';
  }

  // Utility methods for performance optimization
  static createPerformanceConfig() {
    return {
      // Response compression
      compression: {
        threshold: 1024, // Only compress responses larger than 1KB
        level: 6, // Compression level (1-9)
      },

      // Rate limiting
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Limit each IP to 1000 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
      },

      // Request timeout
      timeout: {
        connection: 10000, // 10 seconds
        read: 30000, // 30 seconds
        write: 30000, // 30 seconds
      },

      // Connection pooling
      connectionPool: {
        max: 100, // Maximum connections
        min: 10, // Minimum connections
        idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      },

      // Caching configuration
      caching: {
        defaultTTL: 300, // 5 minutes
        maxSize: 1000, // Maximum cached responses
        checkPeriod: 600, // Check for expired keys every 10 minutes
      },

      // Monitoring thresholds
      thresholds: {
        slowRequest: 2000, // 2 seconds
        errorRate: 5, // 5%
        memoryUsage: 80, // 80%
        cpuUsage: 85, // 85%
      },
    };
  }

  // Health check for API performance
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: {
      averageResponseTime: number;
      errorRate: number;
      cacheHitRate: number;
      memoryUsage: number;
      activeConnections: number;
    };
    alerts: string[];
  }> {
    try {
      const summary = this.performanceMonitor.getPerformanceSummary();
      const cacheInfo = await this.redisService.getCacheInfo();

      const metrics = {
        averageResponseTime: summary.avgQueryTime,
        errorRate: summary.errorRate,
        cacheHitRate: cacheInfo.hitRate,
        memoryUsage: (summary.memoryUsage.heapUsed / summary.memoryUsage.heapTotal) * 100,
        activeConnections: 0, // Would need to track this separately
      };

      const alerts: string[] = [];

      if (metrics.averageResponseTime > this.SLOW_REQUEST_THRESHOLD) {
        alerts.push('High average response time');
      }

      if (metrics.errorRate > 5) {
        alerts.push('High error rate');
      }

      if (metrics.cacheHitRate < 70) {
        alerts.push('Low cache hit rate');
      }

      if (metrics.memoryUsage > 80) {
        alerts.push('High memory usage');
      }

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (alerts.length > 0) {
        status = alerts.length > 2 ? 'unhealthy' : 'degraded';
      }

      return { status, metrics, alerts };
    } catch (error) {
      this.logger.error('Failed to get health status:', error);
      return {
        status: 'unhealthy',
        metrics: {
          averageResponseTime: 0,
          errorRate: 0,
          cacheHitRate: 0,
          memoryUsage: 0,
          activeConnections: 0,
        },
        alerts: ['Health check failed'],
      };
    }
  }
}