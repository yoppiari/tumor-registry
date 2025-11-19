"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ApiPerformanceMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPerformanceMiddleware = void 0;
const common_1 = require("@nestjs/common");
const performance_monitor_service_1 = require("./performance-monitor.service");
const redis_service_1 = require("./redis.service");
let ApiPerformanceMiddleware = ApiPerformanceMiddleware_1 = class ApiPerformanceMiddleware {
    constructor(performanceMonitor, redisService) {
        this.performanceMonitor = performanceMonitor;
        this.redisService = redisService;
        this.logger = new common_1.Logger(ApiPerformanceMiddleware_1.name);
        this.SLOW_REQUEST_THRESHOLD = 2000;
        this.CACHEABLE_METHODS = ['GET'];
        this.CACHEABLE_STATUS_CODES = [200, 304];
    }
    async use(req, res, next) {
        const startTime = Date.now();
        const requestId = this.generateRequestId();
        const metrics = {
            requestId,
            method: req.method,
            url: req.originalUrl || req.url,
            userAgent: req.get('User-Agent') || 'unknown',
            ip: this.getClientIp(req),
            userId: this.getUserId(req),
            startTime,
        };
        res.setHeader('X-Request-ID', requestId);
        let isCached = false;
        if (this.CACHEABLE_METHODS.includes(req.method)) {
            const cacheKey = this.getCacheKey(req);
            const cachedResponse = await this.redisService.get(cacheKey);
            if (cachedResponse) {
                try {
                    const cached = JSON.parse(cachedResponse);
                    res.setHeader('X-Cache', 'HIT');
                    res.setHeader('X-Cache-Key', cacheKey);
                    res.status(cached.statusCode).json(cached.data);
                    metrics.endTime = Date.now();
                    metrics.duration = metrics.endTime - metrics.startTime;
                    metrics.statusCode = cached.statusCode;
                    metrics.cached = true;
                    this.recordMetrics(metrics);
                    this.performanceMonitor.recordCacheHitRate('api_responses', 85);
                    return;
                }
                catch (error) {
                    this.logger.warn('Invalid cached response:', error);
                }
            }
            else {
                res.setHeader('X-Cache', 'MISS');
                res.setHeader('X-Cache-Key', cacheKey);
            }
        }
        const originalSend = res.send;
        res.send = function (body) {
            metrics.endTime = Date.now();
            metrics.duration = metrics.endTime - metrics.startTime;
            metrics.statusCode = res.statusCode;
            metrics.responseSize = Buffer.byteLength(body || '', 'utf8');
            if (this.CACHEABLE_METHODS.includes(req.method) &&
                this.CACHEABLE_STATUS_CODES.includes(res.statusCode) &&
                !isCached) {
                this.cacheResponse(req, res, body);
            }
            this.recordMetrics(metrics);
            return originalSend.call(this, body);
        }.bind(this);
        res.on('error', (error) => {
            metrics.endTime = Date.now();
            metrics.duration = metrics.endTime - metrics.startTime;
            metrics.error = error.message;
            this.recordMetrics(metrics);
        });
        const slowRequestTimer = setTimeout(() => {
            this.logger.warn(`Slow request detected: ${req.method} ${req.originalUrl} - ${Date.now() - startTime}ms (ID: ${requestId})`);
            this.performanceMonitor.emit('slowRequest', {
                requestId,
                method: req.method,
                url: req.originalUrl,
                duration: Date.now() - startTime,
                timestamp: new Date(),
            });
        }, this.SLOW_REQUEST_THRESHOLD);
        res.on('finish', () => {
            clearTimeout(slowRequestTimer);
        });
        next();
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getClientIp(req) {
        return (req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection?.socket?.remoteAddress ||
            'unknown');
    }
    getUserId(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                return undefined;
            }
            catch (error) {
                return undefined;
            }
        }
        return undefined;
    }
    getCacheKey(req) {
        const url = req.originalUrl || req.url;
        const query = JSON.stringify(req.query);
        const hash = Buffer.from(`${req.method}:${url}:${query}`).toString('base64');
        return `api_cache:${hash}`;
    }
    async cacheResponse(req, res, body) {
        try {
            const cacheKey = this.getCacheKey(req);
            const ttl = this.getCacheTTL(req);
            const cacheData = {
                statusCode: res.statusCode,
                data: typeof body === 'string' ? body : JSON.parse(body),
                headers: {
                    'content-type': res.get('content-type'),
                },
                cachedAt: new Date().toISOString(),
            };
            await this.redisService.setex(cacheKey, ttl, JSON.stringify(cacheData));
        }
        catch (error) {
            this.logger.error('Failed to cache response:', error);
        }
    }
    getCacheTTL(req) {
        const url = req.originalUrl || req.url;
        if (url.includes('/analytics/'))
            return 600;
        if (url.includes('/patients/'))
            return 300;
        if (url.includes('/reports/'))
            return 1800;
        if (url.includes('/dashboard/'))
            return 900;
        return 300;
    }
    recordMetrics(metrics) {
        try {
            this.performanceMonitor.recordQueryTime(`api_${metrics.method}_${this.extractEndpoint(metrics.url)}`, metrics.duration || 0, !metrics.error, metrics.error ? new Error(metrics.error) : undefined);
            this.performanceMonitor.emit('apiRequest', metrics);
            if (metrics.duration && metrics.duration > this.SLOW_REQUEST_THRESHOLD) {
                this.logger.warn(`Slow API request: ${metrics.method} ${metrics.url} - ${metrics.duration}ms (ID: ${metrics.requestId})`);
            }
            if (metrics.error || (metrics.statusCode && metrics.statusCode >= 400)) {
                this.logger.error(`API error: ${metrics.method} ${metrics.url} - ${metrics.statusCode || 'Unknown'} - ${metrics.error || 'Unknown error'}`);
            }
            if (metrics.cached) {
                this.performanceMonitor.recordCacheHitRate('api_responses_cache_hit', 100);
            }
        }
        catch (error) {
            this.logger.error('Failed to record API metrics:', error);
        }
    }
    extractEndpoint(url) {
        const parts = url.split('/').filter(part => part && part !== 'api' && !part.match(/^[0-9a-fA-F]{24}$/));
        return parts.join('_') || 'unknown';
    }
    static createPerformanceConfig() {
        return {
            compression: {
                threshold: 1024,
                level: 6,
            },
            rateLimit: {
                windowMs: 15 * 60 * 1000,
                max: 1000,
                message: 'Too many requests from this IP, please try again later.',
            },
            timeout: {
                connection: 10000,
                read: 30000,
                write: 30000,
            },
            connectionPool: {
                max: 100,
                min: 10,
                idleTimeoutMillis: 30000,
            },
            caching: {
                defaultTTL: 300,
                maxSize: 1000,
                checkPeriod: 600,
            },
            thresholds: {
                slowRequest: 2000,
                errorRate: 5,
                memoryUsage: 80,
                cpuUsage: 85,
            },
        };
    }
    async getHealthStatus() {
        try {
            const summary = this.performanceMonitor.getPerformanceSummary();
            const cacheInfo = await this.redisService.getCacheInfo();
            const metrics = {
                averageResponseTime: summary.avgQueryTime,
                errorRate: summary.errorRate,
                cacheHitRate: cacheInfo.hitRate,
                memoryUsage: (summary.memoryUsage.heapUsed / summary.memoryUsage.heapTotal) * 100,
                activeConnections: 0,
            };
            const alerts = [];
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
            let status = 'healthy';
            if (alerts.length > 0) {
                status = alerts.length > 2 ? 'unhealthy' : 'degraded';
            }
            return { status, metrics, alerts };
        }
        catch (error) {
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
};
exports.ApiPerformanceMiddleware = ApiPerformanceMiddleware;
exports.ApiPerformanceMiddleware = ApiPerformanceMiddleware = ApiPerformanceMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [performance_monitor_service_1.PerformanceMonitorService,
        redis_service_1.RedisService])
], ApiPerformanceMiddleware);
//# sourceMappingURL=api-performance.middleware.js.map