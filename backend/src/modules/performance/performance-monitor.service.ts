import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as prometheus from 'prom-client';

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

@Injectable()
export class PerformanceMonitorService extends EventEmitter implements OnModuleInit {
  private readonly logger = new Logger(PerformanceMonitorService.name);
  private readonly queryMetrics = new Map<string, QueryPerformanceData[]>();
  private readonly memoryMetrics: PerformanceMetrics[] = [];
  private readonly maxHistorySize = 1000;
  private readonly alertThresholds = {
    slowQueryMs: 2000,
    memoryUsagePercent: 80,
    cpuUsagePercent: 85,
    errorRatePercent: 5,
  };

  // Prometheus metrics
  private queryDuration: prometheus.Histogram<string>;
  private queryCounter: prometheus.Counter<string>;
  private queryErrors: prometheus.Counter<string>;
  private memoryUsageGauge: prometheus.Gauge<string>;
  private cacheHitRateGauge: prometheus.Gauge<string>;

  constructor() {
    super();
    this.initializePrometheusMetrics();
  }

  async onModuleInit() {
    await this.startMonitoring();
    this.logger.log('Performance monitoring initialized');
  }

  private initializePrometheusMetrics() {
    // Create a Prometheus registry
    const register = new prometheus.Registry();

    // Query performance metrics
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

    // Memory metrics
    this.memoryUsageGauge = new prometheus.Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    // Cache metrics
    this.cacheHitRateGauge = new prometheus.Gauge({
      name: 'cache_hit_rate_percentage',
      help: 'Cache hit rate percentage',
      labelNames: ['cache_type'],
    });

    // Register metrics
    register.registerMetric(this.queryDuration);
    register.registerMetric(this.queryCounter);
    register.registerMetric(this.queryErrors);
    register.registerMetric(this.memoryUsageGauge);
    register.registerMetric(this.cacheHitRateGauge);

    // Enable collection of default metrics
    prometheus.collectDefaultMetrics({ register });
  }

  private async startMonitoring() {
    // Start system metrics collection
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000); // Every 30 seconds

    // Start query performance analysis
    setInterval(() => {
      this.analyzeQueryPerformance();
    }, 60000); // Every minute

    // Start memory cleanup
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000); // Every 5 minutes
  }

  // Query performance tracking
  recordQueryTime(queryName: string, executionTime: number, success: boolean = true, error?: Error) {
    const timestamp = new Date();
    const queryData: QueryPerformanceData = {
      queryName,
      executionTime,
      timestamp,
      success,
      error,
    };

    // Store in memory
    if (!this.queryMetrics.has(queryName)) {
      this.queryMetrics.set(queryName, []);
    }

    const queryHistory = this.queryMetrics.get(queryName)!;
    queryHistory.push(queryData);

    // Limit history size
    if (queryHistory.length > this.maxHistorySize) {
      queryHistory.shift();
    }

    // Record Prometheus metrics
    this.queryDuration
      .labels(queryName, success ? 'success' : 'error')
      .observe(executionTime / 1000); // Convert to seconds

    this.queryCounter
      .labels(queryName, success ? 'success' : 'error')
      .inc();

    if (!success && error) {
      this.queryErrors
        .labels(queryName, error.constructor.name)
        .inc();
    }

    // Emit event for real-time monitoring
    this.emit('queryExecuted', queryData);

    // Check for performance alerts
    this.checkQueryAlerts(queryData);
  }

  recordError(queryName: string, error: Error) {
    this.recordQueryTime(queryName, 0, false, error);
    this.logger.error(`Query error recorded for ${queryName}:`, error);
    this.emit('queryError', { queryName, error, timestamp: new Date() });
  }

  private checkQueryAlerts(queryData: QueryPerformanceData) {
    // Slow query alert
    if (queryData.executionTime > this.alertThresholds.slowQueryMs) {
      this.emit('slowQuery', {
        queryName: queryData.queryName,
        executionTime: queryData.executionTime,
        timestamp: queryData.timestamp,
      });
      this.logger.warn(`Slow query detected: ${queryData.queryName} took ${queryData.executionTime}ms`);
    }

    // Check for error patterns
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

  private collectSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics: PerformanceMetrics = {
      queryTime: 0,
      memoryUsage,
      cpuUsage,
      timestamp: new Date(),
    };

    // Store in memory
    this.memoryMetrics.push(metrics);
    if (this.memoryMetrics.length > this.maxHistorySize) {
      this.memoryMetrics.shift();
    }

    // Update Prometheus metrics
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

    // Check for memory alerts
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

  private analyzeQueryPerformance() {
    for (const [queryName, queries] of this.queryMetrics.entries()) {
      if (queries.length === 0) continue;

      const recentQueries = queries.slice(-100); // Last 100 queries
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

      // Check for performance degradation
      if (avgExecutionTime > this.alertThresholds.slowQueryMs) {
        this.logger.warn(`Performance degradation detected for ${queryName}: avg ${avgExecutionTime.toFixed(2)}ms`);
      }
    }
  }

  private cleanupOldMetrics() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Clean old query metrics
    for (const [queryName, queries] of this.queryMetrics.entries()) {
      const filteredQueries = queries.filter(q => q.timestamp > cutoffTime);
      this.queryMetrics.set(queryName, filteredQueries);
    }

    // Clean old memory metrics
    this.memoryMetrics.splice(0, this.memoryMetrics.length - this.maxHistorySize);
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  // Public API methods
  getQueryMetrics(queryName?: string) {
    if (queryName) {
      return this.queryMetrics.get(queryName) || [];
    }

    const allMetrics: { queryName: string; metrics: QueryPerformanceData[] }[] = [];
    for (const [name, metrics] of this.queryMetrics.entries()) {
      allMetrics.push({ queryName: name, metrics });
    }
    return allMetrics;
  }

  getSystemMetrics() {
    return this.memoryMetrics.slice(-100); // Last 100 measurements
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
        if (!query.success) totalErrors++;
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

  recordCacheHitRate(cacheType: string, hitRate: number) {
    this.cacheHitRateGauge
      .labels(cacheType)
      .set(hitRate);

    this.emit('cacheHitRate', { cacheType, hitRate, timestamp: new Date() });
  }

  // Prometheus metrics endpoint
  async getPrometheusMetrics(): Promise<string> {
    return await prometheus.register.metrics();
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      const summary = this.getPerformanceSummary();

      // Check if error rate is acceptable
      if (summary.errorRate > this.alertThresholds.errorRatePercent) {
        return false;
      }

      // Check if memory usage is acceptable
      const memoryUsagePercent = (summary.memoryUsage.heapUsed / summary.memoryUsage.heapTotal) * 100;
      if (memoryUsagePercent > this.alertThresholds.memoryUsagePercent) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }

  // Reset metrics (useful for testing)
  resetMetrics() {
    this.queryMetrics.clear();
    this.memoryMetrics.length = 0;
    prometheus.register.clear();
    this.initializePrometheusMetrics();
    this.logger.log('Performance metrics reset');
  }

  // Export metrics for external monitoring
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
}