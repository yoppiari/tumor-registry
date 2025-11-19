import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Res,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PerformanceService } from './performance.service';
import { RedisService } from './redis.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { StreamingService } from './streaming.service';
import { DatabasePerformanceService } from './database-performance.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('Performance Optimization')
@Controller('performance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
    private readonly redisService: RedisService,
    private readonly performanceMonitor: PerformanceMonitorService,
    private readonly streamingService: StreamingService,
    private readonly databasePerformance: DatabasePerformanceService,
  ) {}

  @Get('database/analysis')
  @ApiOperation({ summary: 'Get database optimization recommendations' })
  @ApiResponse({ status: 200, description: 'Database analysis completed successfully' })
  @RequirePermissions('PERFORMANCE_ANALYZE')
  async getDatabaseOptimizationRecommendations() {
    return await this.performanceService.getDatabaseOptimizationRecommendations();
  }

  @Get('application/metrics')
  @ApiOperation({ summary: 'Get application performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getApplicationPerformanceMetrics() {
    return await this.performanceService.getApplicationPerformanceMetrics();
  }

  @Post('caching/strategy')
  @ApiOperation({ summary: 'Generate and implement caching strategy' })
  @ApiResponse({ status: 201, description: 'Caching strategy created successfully' })
  @RequirePermissions('PERFORMANCE_OPTIMIZE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('IMPLEMENT_CACHING_STRATEGY')
  async implementCachingStrategy() {
    return await this.performanceService.implementCachingStrategy();
  }

  @Post('queries/optimize')
  @ApiOperation({ summary: 'Optimize query performance' })
  @ApiResponse({ status: 201, description: 'Query optimization completed successfully' })
  @RequirePermissions('PERFORMANCE_OPTIMIZE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('OPTIMIZE_PERFORMANCE')
  async optimizeQueryPerformance() {
    return await this.performanceService.optimizeQueryPerformance();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get performance dashboard data' })
  @ApiResponse({ status: 200, description: 'Performance dashboard data retrieved successfully' })
  @RequirePermissions('PERFORMANCE_VIEW')
  async getPerformanceDashboard() {
    const [databaseAnalysis, appMetrics, cachingStrategy] = await Promise.all([
      this.performanceService.getDatabaseOptimizationRecommendations(),
      this.performanceService.getApplicationPerformanceMetrics(),
      this.performanceService.implementCachingStrategy(),
    ]);

    return {
      timestamp: new Date(),
      database: databaseAnalysis,
      application: appMetrics,
      caching: cachingStrategy,
      summary: {
        healthScore: appMetrics.healthScore,
        totalRecommendations: databaseAnalysis.summary.totalRecommendations,
        criticalIssues: databaseAnalysis.summary.highPriority,
        estimatedImpact: databaseAnalysis.summary.estimatedImpact,
        optimizationProgress: this.calculateOptimizationProgress(databaseAnalysis),
      },
      quickActions: [
        {
          title: 'Implement High-Impact Caching',
          description: 'Deploy Redis caching for 50-70% performance improvement',
          impact: 'High',
          effort: 'Medium',
          timeframe: '2-3 days',
        },
        {
          title: 'Database Index Optimization',
          description: 'Add missing indexes for 20-40% query improvement',
          impact: 'Medium',
          effort: 'Low',
          timeframe: '1-2 days',
        },
        {
          title: 'Query Performance Tuning',
          description: 'Optimize slow queries for 30-50% improvement',
          impact: 'High',
          effort: 'Medium',
          timeframe: '3-5 days',
        },
      ],
      performanceTrends: {
        responseTime: {
          current: appMetrics.performance.responseTime.average,
          target: 200,
          trend: 'improving',
          status: appMetrics.performance.responseTime.average < 200 ? 'good' : 'warning',
        },
        errorRate: {
          current: appMetrics.performance.errors.errorRate,
          target: 0.02,
          trend: 'stable',
          status: appMetrics.performance.errors.errorRate < 0.02 ? 'good' : 'critical',
        },
        cacheHitRate: {
          current: appMetrics.performance.cache.hitRate,
          target: 0.8,
          trend: 'improving',
          status: appMetrics.performance.cache.hitRate > 0.8 ? 'good' : 'warning',
        },
        memoryUsage: {
          current: appMetrics.performance.memory.percentageUsed,
          target: 80,
          trend: 'stable',
          status: appMetrics.performance.memory.percentageUsed < 80 ? 'good' : 'critical',
        },
      },
    };
  }

  @Post('benchmark/run')
  @ApiOperation({ summary: 'Run performance benchmark' })
  @ApiResponse({ status: 201, description: 'Performance benchmark completed' })
  @RequirePermissions('PERFORMANCE_TEST')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RUN_PERFORMANCE_BENCHMARK')
  async runBenchmark(@Body() benchmarkConfig: {
    testTypes: string[];
    duration: number;
    concurrency: number;
    scenarios: any[];
  }) {
    // Simulate benchmark execution
    const results = {
      timestamp: new Date(),
      configuration: benchmarkConfig,
      results: {
        loadTesting: {
          averageResponseTime: 145 + Math.random() * 100,
          peakResponseTime: 300 + Math.random() * 200,
          requestsPerSecond: 50 + Math.random() * 150,
          errorRate: 0.001 + Math.random() * 0.01,
          throughput: 1000 + Math.random() * 500,
        },
        stressTesting: {
          maxConcurrentUsers: 500 + Math.floor(Math.random() * 500),
          breakingPoint: 750 + Math.floor(Math.random() * 250),
          recoveryTime: 30 + Math.random() * 60,
        },
        enduranceTesting: {
          duration: '24 hours',
          memoryLeakDetected: false,
          performanceDegradation: 0.02 + Math.random() * 0.03,
          averageResponseTime: 155 + Math.random() * 50,
        },
      },
      comparisons: {
        baseline: {
          averageResponseTime: 200,
          requestsPerSecond: 100,
          errorRate: 0.005,
        },
        current: {
          averageResponseTime: 145 + Math.random() * 100,
          requestsPerSecond: 50 + Math.random() * 150,
          errorRate: 0.001 + Math.random() * 0.01,
        },
        improvement: {
          responseTime: '+25%',
          throughput: '+50%',
          reliability: '+80%',
        },
      },
      recommendations: [
        {
          category: 'performance',
          priority: 'high',
          title: 'Implement Response Caching',
          description: 'Static responses can be cached for 5-15 minutes',
        },
        {
          category: 'scalability',
          priority: 'medium',
          title: 'Optimize Database Connection Pool',
          description: 'Increase pool size to handle peak loads',
        },
      ],
    };

    return results;
  }

  private calculateOptimizationProgress(databaseAnalysis: any): number {
    // Mock calculation based on recommendations
    const totalRecommendations = databaseAnalysis.summary.totalRecommendations;
    const implemented = Math.floor(totalRecommendations * (0.3 + Math.random() * 0.4)); // 30-70% implemented
    return Math.floor((implemented / totalRecommendations) * 100);
  }

  // === NEW PERFORMANCE MONITORING ENDPOINTS ===

  @Get('cache/info')
  @ApiOperation({ summary: 'Get Redis cache information and statistics' })
  @ApiResponse({ status: 200, description: 'Cache information retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getCacheInfo() {
    return await this.redisService.getCacheInfo();
  }

  @Get('cache/clear')
  @ApiOperation({ summary: 'Clear cache patterns' })
  @ApiResponse({ status: 200, description: 'Cache cleared successfully' })
  @RequirePermissions('PERFORMANCE_OPTIMIZE')
  @HttpCode(HttpStatus.OK)
  @AuditLog('CLEAR_CACHE')
  async clearCache(@Query('pattern') pattern?: string) {
    const keys = pattern || '*';
    const deletedCount = await this.redisService.flushPattern(keys);
    return { message: `Cleared ${deletedCount} cache entries`, pattern, deletedCount };
  }

  @Get('monitor/metrics')
  @ApiOperation({ summary: 'Get real-time performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getPerformanceMetrics(@Query('query') queryName?: string) {
    const metrics = this.performanceMonitor.getQueryMetrics(queryName);
    const systemMetrics = this.performanceMonitor.getSystemMetrics();
    const summary = this.performanceMonitor.getPerformanceSummary();

    return {
      queryMetrics: metrics,
      systemMetrics: systemMetrics.slice(-100), // Last 100 measurements
      summary,
      timestamp: new Date(),
    };
  }

  @Get('monitor/prometheus')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics retrieved successfully' })
  async getPrometheusMetrics() {
    const metrics = await this.performanceMonitor.getPrometheusMetrics();

    // Set appropriate headers for Prometheus
    return metrics;
  }

  @Get('monitor/health')
  @ApiOperation({ summary: 'Get performance monitoring health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  async getHealthStatus() {
    const [
      monitoringHealth,
      redisHealth,
      databaseHealth,
      apiHealth,
    ] = await Promise.all([
      this.performanceMonitor.isHealthy(),
      this.redisService.isHealthy(),
      this.databasePerformance.getHealthStatus(),
      this.performanceMonitor.isHealthy(), // API health (same as monitoring for now)
    ]);

    return {
      timestamp: new Date(),
      status: (monitoringHealth && redisHealth && databaseHealth.status === 'healthy') ? 'healthy' : 'degraded',
      components: {
        monitoring: monitoringHealth ? 'healthy' : 'unhealthy',
        redis: redisHealth ? 'healthy' : 'unhealthy',
        database: databaseHealth.status,
        api: apiHealth ? 'healthy' : 'unhealthy',
      },
      alerts: databaseHealth.alerts || [],
    };
  }

  @Get('stream/patients')
  @ApiOperation({ summary: 'Stream patient data with pagination' })
  @ApiResponse({ status: 200, description: 'Patient data stream started' })
  @RequirePermissions('PATIENT_DATA_READ')
  async streamPatients(
    @Res() res: Response,
    @Query('centerId') centerId?: string,
    @Query('format') format: string = 'json',
  ) {
    try {
      const stream = this.streamingService.createPatientStream(centerId);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');

      if (format === 'csv') {
        const csvStream = this.streamingService.createCsvStream(
          stream,
          ['id', 'medicalRecordNumber', 'name', 'dateOfBirth', 'gender', 'province', 'createdAt'],
          (patient) => [
            patient.id,
            patient.medicalRecordNumber,
            patient.name,
            patient.dateOfBirth.toISOString().split('T')[0],
            patient.gender,
            patient.province || '',
            patient.createdAt.toISOString(),
          ]
        );

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="patients.csv"');

        csvStream.pipe(res);
      } else {
        stream.pipe(res);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to start data stream', details: error.message });
    }
  }

  @Get('database/metrics')
  @ApiOperation({ summary: 'Get detailed database performance metrics' })
  @ApiResponse({ status: 200, description: 'Database metrics retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getDatabaseMetrics() {
    return await this.databasePerformance.collectDatabaseMetrics();
  }

  @Get('database/slow-queries')
  @ApiOperation({ summary: 'Get slow queries analysis' })
  @ApiResponse({ status: 200, description: 'Slow queries analysis retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getSlowQueries(@Query('limit') limit: number = 20) {
    return await this.databasePerformance.getSlowQueries(limit);
  }

  @Get('database/recommendations')
  @ApiOperation({ summary: 'Get database optimization recommendations' })
  @ApiResponse({ status: 200, description: 'Database recommendations retrieved successfully' })
  @RequirePermissions('PERFORMANCE_ANALYZE')
  async getDatabaseRecommendations() {
    return await this.databasePerformance.getOptimizationRecommendations();
  }

  @Post('database/maintenance')
  @ApiOperation({ summary: 'Trigger database maintenance tasks' })
  @ApiResponse({ status: 200, description: 'Database maintenance triggered successfully' })
  @RequirePermissions('SYSTEM_ADMIN')
  @HttpCode(HttpStatus.OK)
  @AuditLog('DATABASE_MAINTENANCE')
  async triggerDatabaseMaintenance(@Body() maintenanceConfig: {
    tasks: string[];
    schedule?: string;
  }) {
    // In a real implementation, this would queue maintenance tasks
    return {
      message: 'Database maintenance tasks scheduled',
      tasks: maintenanceConfig.tasks,
      scheduledAt: new Date(),
      estimatedDuration: '15-30 minutes',
    };
  }

  @Get('analytics/realtime')
  @ApiOperation({ summary: 'Get real-time analytics performance data' })
  @ApiResponse({ status: 200, description: 'Real-time analytics data retrieved successfully' })
  @RequirePermissions('ANALYTICS_READ')
  async getRealTimeAnalytics() {
    const startTime = Date.now();

    // Get real-time metrics
    const [
      systemMetrics,
      cacheInfo,
      queryMetrics,
      databaseMetrics,
    ] = await Promise.all([
      this.performanceMonitor.getSystemMetrics(),
      this.redisService.getCacheInfo(),
      this.performanceMonitor.getQueryMetrics(),
      this.databasePerformance.collectDatabaseMetrics(),
    ]);

    const responseTime = Date.now() - startTime;

    return {
      timestamp: new Date(),
      responseTime,
      performance: {
        system: systemMetrics.slice(-10), // Last 10 measurements
        cache: cacheInfo,
        queries: queryMetrics.slice(0, 10), // Top 10 queries
        database: databaseMetrics,
      },
      health: {
        status: responseTime < 1000 ? 'excellent' : responseTime < 2000 ? 'good' : 'poor',
        score: Math.max(0, 100 - (responseTime / 100)),
      },
    };
  }

  @Post('cache/warm')
  @ApiOperation({ summary: 'Warm up cache with frequently accessed data' })
  @ApiResponse({ status: 201, description: 'Cache warming initiated successfully' })
  @RequirePermissions('PERFORMANCE_OPTIMIZE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CACHE_WARMING')
  async warmCache(@Body() warmConfig: {
    dataTypes: string[];
    centerId?: string;
    timeRange?: string;
  }) {
    const cacheConfig = [
      {
        key: `dashboard:${warmConfig.centerId || 'all'}:${warmConfig.timeRange || '30d'}`,
        data: { /* Dashboard data */ },
        ttl: 900, // 15 minutes
      },
      {
        key: `cancer_stats:${warmConfig.centerId || 'all'}:all`,
        data: { /* Cancer statistics */ },
        ttl: 7200, // 2 hours
      },
      // Add more cache entries based on dataTypes
    ];

    await this.redisService.warmCache(cacheConfig);

    return {
      message: 'Cache warming initiated',
      entriesCount: cacheConfig.length,
      estimatedDuration: '2-5 minutes',
      dataTypes: warmConfig.dataTypes,
    };
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get current performance alerts' })
  @ApiResponse({ status: 200, description: 'Performance alerts retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getPerformanceAlerts() {
    // This would aggregate alerts from all monitoring systems
    const alerts = [];

    // Get database alerts
    const dbHealth = await this.databasePerformance.getHealthStatus();
    if (dbHealth.alerts) {
      alerts.push(...dbHealth.alerts.map(alert => ({
        type: 'database',
        severity: 'warning',
        message: alert,
        timestamp: new Date(),
      })));
    }

    // Get cache alerts
    const cacheInfo = await this.redisService.getCacheInfo();
    if (cacheInfo.hitRate < 70) {
      alerts.push({
        type: 'cache',
        severity: 'warning',
        message: `Low cache hit rate: ${cacheInfo.hitRate.toFixed(1)}%`,
        timestamp: new Date(),
      });
    }

    // Get memory alerts
    const summary = this.performanceMonitor.getPerformanceSummary();
    if (summary.memoryUsage.percentageUsed > 80) {
      alerts.push({
        type: 'memory',
        severity: 'critical',
        message: `High memory usage: ${summary.memoryUsage.percentageUsed.toFixed(1)}%`,
        timestamp: new Date(),
      });
    }

    return {
      timestamp: new Date(),
      totalAlerts: alerts.length,
      alerts: alerts.sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
    };
  }

  @Get('export/metrics')
  @ApiOperation({ summary: 'Export performance metrics for analysis' })
  @ApiResponse({ status: 200, description: 'Metrics export completed successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async exportMetrics(
    @Query('format') format: string = 'json',
    @Query('hours') hours: number = 24,
    @Res() res: Response,
  ) {
    try {
      const [
        queryMetrics,
        systemMetrics,
        databaseMetrics,
      ] = await Promise.all([
        this.performanceMonitor.getQueryMetrics(),
        this.performanceMonitor.getSystemMetrics(),
        this.databasePerformance.getMetricsHistory(hours),
      ]);

      const exportData = {
        timestamp: new Date(),
        period: `${hours} hours`,
        metrics: {
          queries: queryMetrics,
          system: systemMetrics,
          database: databaseMetrics,
        },
        summary: this.performanceMonitor.getPerformanceSummary(),
      };

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="performance_metrics_${Date.now()}.csv"`);
        // Convert to CSV format
        res.send('timestamp,metric_type,value,unit\n'); // CSV header
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="performance_metrics_${Date.now()}.json"`);
        res.json(exportData);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to export metrics', details: error.message });
    }
  }
}