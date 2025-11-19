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
var PerformanceMonitorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitorService = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const prometheus = require("prom-client");
let PerformanceMonitorService = PerformanceMonitorService_1 = class PerformanceMonitorService extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = new common_1.Logger(PerformanceMonitorService_1.name);
        this.queryMetrics = new Map();
        this.memoryMetrics = [];
        this.maxHistorySize = 1000;
        this.alertThresholds = {
            slowQueryMs: 2000,
            memoryUsagePercent: 80,
            cpuUsagePercent: 85,
            errorRatePercent: 5,
        };
        this.initializePrometheusMetrics();
    }
    async onModuleInit() {
        await this.startMonitoring();
        this.logger.log('Performance monitoring initialized');
    }
    initializePrometheusMetrics() {
        const register = new prometheus.Registry();
        this.queryDuration = new prometheus.Histogram({
            name: 'query_duration_seconds',
            help: 'Query execution time in seconds',
            labelNames: ['query_name', 'status'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 30],
        });
        this.queryCounter = new prometheus.Counter({
            name: 'query_total',
            help: 'Total number of queries executed',
            labelNames: ['query_name', 'status'],
        });
        this.queryErrors = new prometheus.Counter({
            name: 'query_errors_total',
            help: 'Total number of query errors',
            labelNames: ['query_name', 'error_type'],
        });
        this.memoryUsageGauge = new prometheus.Gauge({
            name: 'memory_usage_bytes',
            help: 'Memory usage in bytes',
            labelNames: ['type'],
        });
        this.cacheHitRateGauge = new prometheus.Gauge({
            name: 'cache_hit_rate_percentage',
            help: 'Cache hit rate percentage',
            labelNames: ['cache_type'],
        });
        register.registerMetric(this.queryDuration);
        register.registerMetric(this.queryCounter);
        register.registerMetric(this.queryErrors);
        register.registerMetric(this.memoryUsageGauge);
        register.registerMetric(this.cacheHitRateGauge);
        prometheus.collectDefaultMetrics({ register });
    }
    async startMonitoring() {
        setInterval(() => {
            this.collectSystemMetrics();
        }, 30000);
        setInterval(() => {
            this.analyzeQueryPerformance();
        }, 60000);
        setInterval(() => {
            this.cleanupOldMetrics();
        }, 300000);
    }
    recordQueryTime(queryName, executionTime, success = true, error) {
        const timestamp = new Date();
        const queryData = {
            queryName,
            executionTime,
            timestamp,
            success,
            error,
        };
        if (!this.queryMetrics.has(queryName)) {
            this.queryMetrics.set(queryName, []);
        }
        const queryHistory = this.queryMetrics.get(queryName);
        queryHistory.push(queryData);
        if (queryHistory.length > this.maxHistorySize) {
            queryHistory.shift();
        }
        this.queryDuration
            .labels(queryName, success ? 'success' : 'error')
            .observe(executionTime / 1000);
        this.queryCounter
            .labels(queryName, success ? 'success' : 'error')
            .inc();
        if (!success && error) {
            this.queryErrors
                .labels(queryName, error.constructor.name)
                .inc();
        }
        this.emit('queryExecuted', queryData);
        this.checkQueryAlerts(queryData);
    }
    recordError(queryName, error) {
        this.recordQueryTime(queryName, 0, false, error);
        this.logger.error(`Query error recorded for ${queryName}:`, error);
        this.emit('queryError', { queryName, error, timestamp: new Date() });
    }
    checkQueryAlerts(queryData) {
        if (queryData.executionTime > this.alertThresholds.slowQueryMs) {
            this.emit('slowQuery', {
                queryName: queryData.queryName,
                executionTime: queryData.executionTime,
                timestamp: queryData.timestamp,
            });
            this.logger.warn(`Slow query detected: ${queryData.queryName} took ${queryData.executionTime}ms`);
        }
        const recentQueries = this.queryMetrics.get(queryData.queryName) || [];
        const recentErrors = recentQueries.filter(q => !q.success && q.success);
        const errorRate = (recentErrors.length / recentQueries.length) * 100;
        if (errorRate > this.alertThresholds.errorRatePercent && recentQueries.length > 10) {
            this.emit('highErrorRate', {
                queryName: queryData.queryName,
                errorRate,
                timestamp: queryData.timestamp,
            });
            this.logger.warn(`High error rate detected for ${queryData.queryName}: ${errorRate.toFixed(2)}%`);
        }
    }
    collectSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const metrics = {
            queryTime: 0,
            memoryUsage,
            cpuUsage,
            timestamp: new Date(),
        };
        this.memoryMetrics.push(metrics);
        if (this.memoryMetrics.length > this.maxHistorySize) {
            this.memoryMetrics.shift();
        }
        this.memoryUsageGauge
            .labels('heap_used')
            .set(memoryUsage.heapUsed);
        this.memoryUsageGauge
            .labels('heap_total')
            .set(memoryUsage.heapTotal);
        this.memoryUsageGauge
            .labels('external')
            .set(memoryUsage.external);
        this.memoryUsageGauge
            .labels('rss')
            .set(memoryUsage.rss);
        const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        if (memoryUsagePercent > this.alertThresholds.memoryUsagePercent) {
            this.emit('highMemoryUsage', {
                usage: memoryUsagePercent,
                timestamp: metrics.timestamp,
            });
            this.logger.warn(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
        }
        this.emit('systemMetrics', metrics);
    }
    analyzeQueryPerformance() {
        for (const [queryName, queries] of this.queryMetrics.entries()) {
            if (queries.length === 0)
                continue;
            const recentQueries = queries.slice(-100);
            const avgExecutionTime = recentQueries.reduce((sum, q) => sum + q.executionTime, 0) / recentQueries.length;
            const p95ExecutionTime = this.calculatePercentile(recentQueries.map(q => q.executionTime), 95);
            const errorRate = (recentQueries.filter(q => !q.success).length / recentQueries.length) * 100;
            const analysis = {
                queryName,
                avgExecutionTime,
                p95ExecutionTime,
                errorRate,
                totalQueries: recentQueries.length,
                timestamp: new Date(),
            };
            this.emit('queryAnalysis', analysis);
            if (avgExecutionTime > this.alertThresholds.slowQueryMs) {
                this.logger.warn(`Performance degradation detected for ${queryName}: avg ${avgExecutionTime.toFixed(2)}ms`);
            }
        }
    }
    cleanupOldMetrics() {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        for (const [queryName, queries] of this.queryMetrics.entries()) {
            const filteredQueries = queries.filter(q => q.timestamp > cutoffTime);
            this.queryMetrics.set(queryName, filteredQueries);
        }
        this.memoryMetrics.splice(0, this.memoryMetrics.length - this.maxHistorySize);
    }
    calculatePercentile(values, percentile) {
        const sorted = values.sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index] || 0;
    }
    getQueryMetrics(queryName) {
        if (queryName) {
            return this.queryMetrics.get(queryName) || [];
        }
        const allMetrics = [];
        for (const [name, metrics] of this.queryMetrics.entries()) {
            allMetrics.push({ queryName: name, metrics });
        }
        return allMetrics;
    }
    getSystemMetrics() {
        return this.memoryMetrics.slice(-100);
    }
    getPerformanceSummary() {
        const summary = {
            totalQueries: 0,
            avgQueryTime: 0,
            errorRate: 0,
            slowQueries: 0,
            memoryUsage: process.memoryUsage(),
            timestamp: new Date(),
        };
        let totalTime = 0;
        let totalErrors = 0;
        for (const queries of this.queryMetrics.values()) {
            summary.totalQueries += queries.length;
            for (const query of queries) {
                totalTime += query.executionTime;
                if (!query.success)
                    totalErrors++;
                if (query.executionTime > this.alertThresholds.slowQueryMs) {
                    summary.slowQueries++;
                }
            }
        }
        if (summary.totalQueries > 0) {
            summary.avgQueryTime = totalTime / summary.totalQueries;
            summary.errorRate = (totalErrors / summary.totalQueries) * 100;
        }
        return summary;
    }
    recordCacheHitRate(cacheType, hitRate) {
        this.cacheHitRateGauge
            .labels(cacheType)
            .set(hitRate);
        this.emit('cacheHitRate', { cacheType, hitRate, timestamp: new Date() });
    }
    async getPrometheusMetrics() {
        return await prometheus.register.metrics();
    }
    async isHealthy() {
        try {
            const summary = this.getPerformanceSummary();
            if (summary.errorRate > this.alertThresholds.errorRatePercent) {
                return false;
            }
            const memoryUsagePercent = (summary.memoryUsage.heapUsed / summary.memoryUsage.heapTotal) * 100;
            if (memoryUsagePercent > this.alertThresholds.memoryUsagePercent) {
                return false;
            }
            return true;
        }
        catch (error) {
            this.logger.error('Health check failed:', error);
            return false;
        }
    }
    resetMetrics() {
        this.queryMetrics.clear();
        this.memoryMetrics.length = 0;
        prometheus.register.clear();
        this.initializePrometheusMetrics();
        this.logger.log('Performance metrics reset');
    }
    exportMetrics() {
        const summary = this.getPerformanceSummary();
        return {
            timestamp: summary.timestamp,
            performance: {
                queries: {
                    total: summary.totalQueries,
                    averageTime: summary.avgQueryTime,
                    errorRate: summary.errorRate,
                    slowQueries: summary.slowQueries,
                },
                memory: {
                    used: summary.memoryUsage.heapUsed,
                    total: summary.memoryUsage.heapTotal,
                    external: summary.memoryUsage.external,
                    rss: summary.memoryUsage.rss,
                },
                health: {
                    status: this.isHealthy(),
                    alerts: {
                        slowQueryThreshold: this.alertThresholds.slowQueryMs,
                        memoryThreshold: this.alertThresholds.memoryUsagePercent,
                        errorThreshold: this.alertThresholds.errorRatePercent,
                    },
                },
            },
        };
    }
};
exports.PerformanceMonitorService = PerformanceMonitorService;
exports.PerformanceMonitorService = PerformanceMonitorService = PerformanceMonitorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PerformanceMonitorService);
//# sourceMappingURL=performance-monitor.service.js.map