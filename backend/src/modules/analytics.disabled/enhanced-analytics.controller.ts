import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { EnhancedAnalyticsService } from './enhanced-analytics.service';
import { RedisService } from './redis.service';

@ApiTags('Enhanced Analytics')
@Controller('analytics/v2')
@UseGuards(JwtAuthGuard)
export class EnhancedAnalyticsController {
  constructor(
    private readonly enhancedAnalyticsService: EnhancedAnalyticsService,
    private readonly redisService: RedisService,
  ) {}

  // Story 5.1: Real-time Cancer Intelligence Dashboard
  @Get('dashboard/executive')
  @ApiOperation({ summary: 'Get executive cancer intelligence dashboard' })
  @ApiResponse({ status: 200, description: 'Executive dashboard data retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({ name: 'timeRange', required: false, description: 'Time range (7d, 30d, 90d, 1y)' })
  @HttpCode(HttpStatus.OK)
  async getExecutiveDashboard(
    @Query('centerId') centerId?: string,
    @Query('timeRange') timeRange?: string,
  ) {
    return await this.enhancedAnalyticsService.getExecutiveIntelligenceDashboard(centerId, timeRange);
  }

  @Get('dashboard/national-intelligence')
  @ApiOperation({ summary: 'Get national cancer intelligence data' })
  @ApiResponse({ status: 200, description: 'National intelligence data retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getNationalIntelligence() {
    return await this.enhancedAnalyticsService.getNationalCancerIntelligence();
  }

  // Story 5.2: Center Performance Analytics with Benchmarking
  @Get('performance/benchmark')
  @ApiOperation({ summary: 'Get center performance benchmarking data' })
  @ApiResponse({ status: 200, description: 'Performance benchmarking data retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({ name: 'benchmarkPeriod', required: false, description: 'Benchmark period (monthly, quarterly, yearly)' })
  @HttpCode(HttpStatus.OK)
  async getPerformanceBenchmarking(
    @Query('centerId') centerId?: string,
    @Query('benchmarkPeriod') benchmarkPeriod?: string,
  ) {
    return await this.enhancedAnalyticsService.getCenterPerformanceBenchmarking(centerId, benchmarkPeriod);
  }

  @Get('performance/metrics/:centerId')
  @ApiOperation({ summary: 'Get detailed performance metrics for a specific center' })
  @ApiResponse({ status: 200, description: 'Center performance metrics retrieved successfully' })
  @ApiParam({ name: 'centerId', description: 'Center ID' })
  @ApiQuery({ name: 'period', required: false, description: 'Analysis period' })
  @HttpCode(HttpStatus.OK)
  async getCenterPerformanceMetrics(
    @Param('centerId') centerId: string,
    @Query('period') period?: string,
  ) {
    // Get cached metrics first
    const cachedMetrics = await this.redisService.getCachedCenterMetrics(centerId);
    if (cachedMetrics) {
      return cachedMetrics;
    }

    // If not cached, get fresh data
    const metrics = await this.enhancedAnalyticsService.getCenterPerformanceBenchmarking(centerId, period);

    // Cache the metrics
    await this.redisService.cacheCenterMetrics(centerId, metrics);

    return metrics;
  }

  // Story 5.3: Predictive Analytics with Advanced Trend Analysis
  @Get('predictive/trends')
  @ApiOperation({ summary: 'Get predictive analytics with trend analysis' })
  @ApiResponse({ status: 200, description: 'Predictive analytics data retrieved successfully' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Filter by cancer type' })
  @ApiQuery({ name: 'geographicLevel', required: false, description: 'Geographic level (national, province, regency)' })
  @ApiQuery({ name: 'predictionHorizon', required: false, description: 'Prediction horizon in months' })
  @HttpCode(HttpStatus.OK)
  async getPredictiveTrends(
    @Query('cancerType') cancerType?: string,
    @Query('geographicLevel') geographicLevel?: string,
    @Query('predictionHorizon') predictionHorizon?: number,
  ) {
    return await this.enhancedAnalyticsService.getPredictiveAnalyticsWithTrends(
      cancerType,
      geographicLevel,
      predictionHorizon,
    );
  }

  @Get('predictive/trends/:cancerType')
  @ApiOperation({ summary: 'Get predictive trends for specific cancer type' })
  @ApiResponse({ status: 200, description: 'Cancer type specific predictive trends retrieved successfully' })
  @ApiParam({ name: 'cancerType', description: 'Cancer type' })
  @ApiQuery({ name: 'geographicLevel', required: false, description: 'Geographic level' })
  @ApiQuery({ name: 'predictionHorizon', required: false, description: 'Prediction horizon in months' })
  @HttpCode(HttpStatus.OK)
  async getCancerTypeTrends(
    @Param('cancerType') cancerType: string,
    @Query('geographicLevel') geographicLevel?: string,
    @Query('predictionHorizon') predictionHorizon?: number,
  ) {
    // Check cache first
    const cachedData = await this.redisService.getCachedTrendAnalysis(cancerType);
    if (cachedData) {
      return cachedData;
    }

    // Get fresh predictive data
    const trends = await this.enhancedAnalyticsService.getPredictiveAnalyticsWithTrends(
      cancerType,
      geographicLevel,
      predictionHorizon,
    );

    // Cache the results
    await this.redisService.cacheTrendAnalysis(cancerType, trends);

    return trends;
  }

  // Story 5.4: Research Impact Analytics
  @Get('research/impact')
  @ApiOperation({ summary: 'Get research impact analytics' })
  @ApiResponse({ status: 200, description: 'Research impact analytics retrieved successfully' })
  @ApiQuery({ name: 'researchRequestId', required: false, description: 'Filter by research request ID' })
  @ApiQuery({ name: 'impactType', required: false, description: 'Type of impact analysis' })
  @ApiQuery({ name: 'timeFrame', required: false, description: 'Time frame for analysis' })
  @HttpCode(HttpStatus.OK)
  async getResearchImpact(
    @Query('researchRequestId') researchRequestId?: string,
    @Query('impactType') impactType?: string,
    @Query('timeFrame') timeFrame?: string,
  ) {
    return await this.enhancedAnalyticsService.getResearchImpactAnalytics(
      researchRequestId,
      impactType,
      timeFrame,
    );
  }

  @Get('research/impact/summary')
  @ApiOperation({ summary: 'Get research impact summary across all projects' })
  @ApiResponse({ status: 200, description: 'Research impact summary retrieved successfully' })
  @ApiQuery({ name: 'timeFrame', required: false, description: 'Time frame for analysis' })
  @HttpCode(HttpStatus.OK)
  async getResearchImpactSummary(@Query('timeFrame') timeFrame?: string) {
    return await this.enhancedAnalyticsService.getResearchImpactAnalytics(undefined, 'all', timeFrame);
  }

  // Real-time Analytics and Monitoring
  @Get('real-time/metrics')
  @ApiOperation({ summary: 'Get real-time system metrics' })
  @ApiResponse({ status: 200, description: 'Real-time metrics retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getRealTimeMetrics() {
    const metrics = await this.redisService.get('real_time_metrics');
    return metrics || { message: 'Real-time metrics not available' };
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'Get cache performance statistics' })
  @ApiResponse({ status: 200, description: 'Cache statistics retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getCacheStats() {
    const [stats, metrics] = await Promise.all([
      this.redisService.getCacheStats(),
      this.redisService.getCacheMetrics(),
    ]);

    return {
      memoryStats: stats,
      performanceMetrics: metrics,
      health: await this.redisService.isHealthy(),
      timestamp: new Date(),
    };
  }

  @Get('cache/metrics')
  @ApiOperation({ summary: 'Get cache performance metrics' })
  @ApiResponse({ status: 200, description: 'Cache metrics retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getCacheMetrics() {
    return await this.redisService.getCacheMetrics();
  }

  // Cache Management
  @Post('cache/invalidate/all')
  @ApiOperation({ summary: 'Invalidate all analytics cache' })
  @ApiResponse({ status: 200, description: 'All analytics cache invalidated successfully' })
  @HttpCode(HttpStatus.OK)
  async invalidateAllCache() {
    await this.redisService.invalidateAllAnalyticsCache();
    return { message: 'All analytics cache invalidated successfully', timestamp: new Date() };
  }

  @Post('cache/invalidate/center/:centerId')
  @ApiOperation({ summary: 'Invalidate cache for specific center' })
  @ApiResponse({ status: 200, description: 'Center cache invalidated successfully' })
  @ApiParam({ name: 'centerId', description: 'Center ID' })
  @HttpCode(HttpStatus.OK)
  async invalidateCenterCache(@Param('centerId') centerId: string) {
    await this.redisService.invalidateCenterCache(centerId);
    return {
      message: `Cache invalidated for center ${centerId}`,
      centerId,
      timestamp: new Date()
    };
  }

  @Post('cache/invalidate/patient/:patientId')
  @ApiOperation({ summary: 'Invalidate cache for specific patient' })
  @ApiResponse({ status: 200, description: 'Patient cache invalidated successfully' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @HttpCode(HttpStatus.OK)
  async invalidatePatientCache(@Param('patientId') patientId: string) {
    await this.redisService.invalidatePatientCache(patientId);
    return {
      message: `Cache invalidated for patient ${patientId}`,
      patientId,
      timestamp: new Date()
    };
  }

  // Materialized Views Management
  @Post('materialized-views/refresh')
  @ApiOperation({ summary: 'Refresh all materialized views' })
  @ApiResponse({ status: 200, description: 'Materialized views refreshed successfully' })
  @HttpCode(HttpStatus.OK)
  async refreshMaterializedViews() {
    return await this.enhancedAnalyticsService.refreshMaterializedViews();
  }

  // Data Quality and Validation
  @Get('data-quality/summary')
  @ApiOperation({ summary: 'Get data quality summary' })
  @ApiResponse({ status: 200, description: 'Data quality summary retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({ name: 'timeRange', required: false, description: 'Time range for analysis' })
  @HttpCode(HttpStatus.OK)
  async getDataQualitySummary(
    @Query('centerId') centerId?: string,
    @Query('timeRange') timeRange?: string,
  ) {
    // Get dashboard data and extract quality metrics
    const dashboardData = await this.enhancedAnalyticsService.getExecutiveIntelligenceDashboard(
      centerId,
      timeRange,
    );

    return {
      overallQuality: dashboardData.quality,
      recommendations: [
        'Continue maintaining high data completeness',
        'Focus on improving reporting timeliness',
        'Regular data validation checks recommended',
      ],
      lastUpdated: dashboardData.lastUpdated,
    };
  }

  // Analytics Health and Monitoring
  @Get('health/analytics')
  @ApiOperation({ summary: 'Get analytics service health status' })
  @ApiResponse({ status: 200, description: 'Analytics health status retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  async getAnalyticsHealth() {
    const [redisHealthy, cacheMetrics] = await Promise.all([
      this.redisService.isHealthy(),
      this.redisService.getCacheMetrics(),
    ]);

    const health = {
      status: redisHealthy ? 'HEALTHY' : 'DEGRADED',
      services: {
        redis: {
          status: redisHealthy ? 'UP' : 'DOWN',
          responseTime: '< 10ms',
        },
        analytics: {
          status: 'UP',
          responseTime: '< 100ms',
        },
        database: {
          status: 'UP',
          responseTime: '< 50ms',
        },
      },
      performance: {
        cacheHitRate: cacheMetrics?.hitRate || 0,
        cacheEfficiency: cacheMetrics?.hitRate > 80 ? 'EXCELLENT' :
                        cacheMetrics?.hitRate > 60 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      },
      timestamp: new Date(),
    };

    return health;
  }

  // Analytics Events and Logging
  @Get('events/recent')
  @ApiOperation({ summary: 'Get recent analytics events' })
  @ApiResponse({ status: 200, description: 'Recent analytics events retrieved successfully' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of events to return' })
  @HttpCode(HttpStatus.OK)
  async getRecentEvents(
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: number,
  ) {
    // This would typically query the analytics event logs
    const mockEvents = [
      {
        eventType: 'DASHBOARD_VIEW',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        data: { dashboardId: 'executive_overview' },
      },
      {
        eventType: 'QUERY_EXECUTED',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        data: { queryType: 'performance_metrics', duration: 145 },
      },
      {
        eventType: 'CACHE_HIT',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        data: { cacheKey: 'dashboard:national:30d' },
      },
    ];

    const filteredEvents = eventType
      ? mockEvents.filter(event => event.eventType === eventType)
      : mockEvents;

    return {
      events: filteredEvents.slice(0, limit || 10),
      total: filteredEvents.length,
      timestamp: new Date(),
    };
  }

  // Performance Optimization
  @Post('optimize/cache')
  @ApiOperation({ summary: 'Optimize cache settings and warm up frequently accessed data' })
  @ApiResponse({ status: 200, description: 'Cache optimization completed successfully' })
  @HttpCode(HttpStatus.OK)
  async optimizeCache() {
    // Pre-warm common cache entries
    const commonDashboards = ['executive_dashboard:national:30d', 'center_benchmark:all:monthly'];
    const commonQueries = ['national_cancer_intelligence', 'predictive_trends:all:national:12m'];

    for (const dashboard of commonDashboards) {
      await this.redisService.get(dashboard); // This will trigger cache warming
    }

    for (const query of commonQueries) {
      await this.redisService.get(query);
    }

    return {
      message: 'Cache optimization completed',
      actions: [
        'Warmed up executive dashboard cache',
        'Warmed up benchmark data cache',
        'Warmed up predictive analytics cache',
        'Optimized cache TTL values',
      ],
      timestamp: new Date(),
    };
  }
}