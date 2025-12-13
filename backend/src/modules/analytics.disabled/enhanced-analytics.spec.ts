import { Test, TestingModule } from '@nestjs/testing';
import { EnhancedAnalyticsService } from './enhanced-analytics.service';
import { RedisService } from './redis.service';
import { PrismaService } from '@/database/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('EnhancedAnalyticsService', () => {
  let service: EnhancedAnalyticsService;
  let redisService: RedisService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockRedisService = {
    getCachedDashboardData: jest.fn(),
    cacheDashboardData: jest.fn(),
    getCachedAnalyticsQuery: jest.fn(),
    cacheAnalyticsQuery: jest.fn(),
    getCachedCenterMetrics: jest.fn(),
    cacheCenterMetrics: jest.fn(),
    getCachedTrendAnalysis: jest.fn(),
    cacheTrendAnalysis: jest.fn(),
    getCachedNationalIntelligence: jest.fn(),
    cacheNationalIntelligence: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    increment: jest.fn(),
    deleteByPattern: jest.fn(),
    addToMetricsTimeSeries: jest.fn(),
    getCacheStats: jest.fn(),
    getCacheMetrics: jest.fn(),
    isHealthy: jest.fn(),
  };

  const mockPrismaService = {
    center: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    patient: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    patientDiagnosis: {
      findMany: jest.fn(),
    },
    analyticsPerformanceMetric: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnhancedAnalyticsService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EnhancedAnalyticsService>(EnhancedAnalyticsService);
    redisService = module.get<RedisService>(RedisService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getExecutiveIntelligenceDashboard', () => {
    it('should return cached dashboard data when available', async () => {
      const centerId = 'center-123';
      const timeRange = '30d';
      const cachedData = {
        overview: { totalPatients: 1000 },
        trends: { patientGrowth: { growthRate: 10 } },
        lastUpdated: new Date(),
      };

      mockRedisService.getCachedDashboardData.mockResolvedValue(cachedData);

      const result = await service.getExecutiveIntelligenceDashboard(centerId, timeRange);

      expect(result).toEqual(cachedData);
      expect(mockRedisService.getCachedDashboardData).toHaveBeenCalledWith(
        `executive_dashboard:${centerId}:${timeRange}`,
      );
      expect(mockRedisService.cacheDashboardData).not.toHaveBeenCalled();
    });

    it('should fetch fresh data and cache when no cache exists', async () => {
      const centerId = 'center-123';
      const timeRange = '30d';

      mockRedisService.getCachedDashboardData.mockResolvedValue(null);
      mockRedisService.cacheDashboardData.mockResolvedValue(true);

      const result = await service.getExecutiveIntelligenceDashboard(centerId, timeRange);

      expect(result).toBeDefined();
      expect(result.overview).toBeDefined();
      expect(result.trends).toBeDefined();
      expect(result.topCancerTypes).toBeDefined();
      expect(result.geographic).toBeDefined();
      expect(result.quality).toBeDefined();
      expect(result.research).toBeDefined();
      expect(result.timeRange).toBe(timeRange);
      expect(result.lastUpdated).toBeInstanceOf(Date);

      expect(mockRedisService.cacheDashboardData).toHaveBeenCalledWith(
        `executive_dashboard:${centerId}:${timeRange}`,
        expect.any(Object),
        900, // 15 minutes
      );
    });

    it('should handle errors gracefully', async () => {
      const centerId = 'center-123';
      const timeRange = '30d';

      mockRedisService.getCachedDashboardData.mockRejectedValue(new Error('Redis error'));

      await expect(service.getExecutiveIntelligenceDashboard(centerId, timeRange))
        .rejects.toThrow('Redis error');
    });
  });

  describe('getCenterPerformanceBenchmarking', () => {
    it('should return cached benchmarking data when available', async () => {
      const centerId = 'center-123';
      const benchmarkPeriod = 'monthly';
      const cachedData = {
        currentPeriod: {
          metrics: {
            patientVolume: { value: 100, rank: 5, percentile: 80 },
          },
        },
        nationalAverages: { averagePatientVolume: 80 },
      };

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(cachedData);

      const result = await service.getCenterPerformanceBenchmarking(centerId, benchmarkPeriod);

      expect(result).toEqual(cachedData);
      expect(mockRedisService.getCachedAnalyticsQuery).toHaveBeenCalledWith(
        `center_benchmark:${centerId}:${benchmarkPeriod}`,
      );
    });

    it('should generate fresh benchmarking data when no cache exists', async () => {
      const centerId = 'center-123';
      const benchmarkPeriod = 'monthly';

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(null);
      mockRedisService.cacheAnalyticsQuery.mockResolvedValue(true);

      const result = await service.getCenterPerformanceBenchmarking(centerId, benchmarkPeriod);

      expect(result).toBeDefined();
      expect(result.currentPeriod).toBeDefined();
      expect(result.nationalAverages).toBeDefined();
      expect(result.benchmarkPeriod).toBe(benchmarkPeriod);
      expect(result.lastUpdated).toBeInstanceOf(Date);

      expect(mockRedisService.cacheAnalyticsQuery).toHaveBeenCalledWith(
        `center_benchmark:${centerId}:${benchmarkPeriod}`,
        expect.any(Object),
        7200, // 2 hours
      );
    });
  });

  describe('getPredictiveAnalyticsWithTrends', () => {
    it('should return cached predictive trends when available', async () => {
      const cancerType = 'Breast Cancer';
      const geographicLevel = 'national';
      const predictionHorizon = 12;
      const cachedData = {
        cancerType,
        geographicLevel,
        predictions: {
          shortTerm: [{ month: 1, predictedCases: 100 }],
        },
        accuracyMetrics: { accuracy: 0.87 },
      };

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(cachedData);

      const result = await service.getPredictiveAnalyticsWithTrends(
        cancerType,
        geographicLevel,
        predictionHorizon,
      );

      expect(result).toEqual(cachedData);
      expect(mockRedisService.getCachedAnalyticsQuery).toHaveBeenCalledWith(
        `predictive_trends:${cancerType}:${geographicLevel}:${predictionHorizon}m`,
      );
    });

    it('should generate new predictive analytics when no cache exists', async () => {
      const cancerType = 'Lung Cancer';
      const geographicLevel = 'province';
      const predictionHorizon = 6;

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(null);
      mockRedisService.cacheAnalyticsQuery.mockResolvedValue(true);

      const result = await service.getPredictiveAnalyticsWithTrends(
        cancerType,
        geographicLevel,
        predictionHorizon,
      );

      expect(result).toBeDefined();
      expect(result.cancerType).toBe(cancerType);
      expect(result.geographicLevel).toBe(geographicLevel);
      expect(result.predictions).toBeDefined();
      expect(result.confidenceIntervals).toBeDefined();
      expect(result.accuracyMetrics).toBeDefined();
      expect(result.modelVersion).toBeDefined();
      expect(result.lastTrained).toBeInstanceOf(Date);

      expect(mockRedisService.cacheAnalyticsQuery).toHaveBeenCalledWith(
        `predictive_trends:${cancerType}:${geographicLevel}:${predictionHorizon}m`,
        expect.any(Object),
        14400, // 4 hours
      );
    });
  });

  describe('getResearchImpactAnalytics', () => {
    it('should return cached research impact data when available', async () => {
      const researchRequestId = 'research-123';
      const impactType = 'publications';
      const timeFrame = '12m';
      const cachedData = {
        summary: {
          totalImpactScore: 85.5,
          impactTrend: 'INCREASING',
          researchCount: 42,
        },
        detailedMetrics: {
          publications: 15,
          citations: 245,
        },
      };

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(cachedData);

      const result = await service.getResearchImpactAnalytics(
        researchRequestId,
        impactType,
        timeFrame,
      );

      expect(result).toEqual(cachedData);
      expect(mockRedisService.getCachedAnalyticsQuery).toHaveBeenCalledWith(
        `research_impact:${researchRequestId}:${impactType}:${timeFrame}`,
      );
    });

    it('should generate fresh research impact analytics when no cache exists', async () => {
      const researchRequestId = null;
      const impactType = 'all';
      const timeFrame = '12m';

      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(null);
      mockRedisService.cacheAnalyticsQuery.mockResolvedValue(true);

      const result = await service.getResearchImpactAnalytics(
        researchRequestId,
        impactType,
        timeFrame,
      );

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.detailedMetrics).toBeDefined();
      expect(result.collaboration).toBeDefined();
      expect(result.patientOutcomes).toBeDefined();
      expect(result.policyImpact).toBeDefined();
      expect(result.economicImpact).toBeDefined();
      expect(result.timeFrame).toBe(timeFrame);
      expect(result.impactType).toBe(impactType);

      expect(mockRedisService.cacheAnalyticsQuery).toHaveBeenCalledWith(
        `research_impact:${researchRequestId}:${impactType}:${timeFrame}`,
        expect.any(Object),
        21600, // 6 hours
      );
    });
  });

  describe('getNationalCancerIntelligence', () => {
    it('should return cached national intelligence when available', async () => {
      const cachedData = {
        reportDate: new Date(),
        totalRegisteredCases: 50000,
        newCasesThisMonth: 1200,
        topCancerTypes: ['Breast Cancer', 'Lung Cancer'],
        dataQuality: 'EXCELLENT',
      };

      mockRedisService.getCachedNationalIntelligence.mockResolvedValue(cachedData);

      const result = await service.getNationalCancerIntelligence();

      expect(result).toEqual(cachedData);
      expect(mockRedisService.getCachedNationalIntelligence).toHaveBeenCalledWith();
    });

    it('should generate fresh national intelligence when no cache exists', async () => {
      mockRedisService.getCachedNationalIntelligence.mockResolvedValue(null);
      mockRedisService.cacheNationalIntelligence.mockResolvedValue(true);

      const result = await service.getNationalCancerIntelligence();

      expect(result).toBeDefined();
      expect(result.reportDate).toBeInstanceOf(Date);
      expect(result.totalRegisteredCases).toBeGreaterThan(0);
      expect(result.newCasesThisMonth).toBeGreaterThan(0);
      expect(result.activeCases).toBeGreaterThan(0);
      expect(result.topCancerTypes).toBeDefined();
      expect(result.demographicBreakdown).toBeDefined();
      expect(result.geographicDistribution).toBeDefined();
      expect(result.policyRecommendations).toBeDefined();

      expect(mockRedisService.cacheNationalIntelligence).toHaveBeenCalledWith(
        expect.any(Object),
        1800, // 30 minutes
      );
    });
  });

  describe('refreshMaterializedViews', () => {
    it('should refresh all materialized views successfully', async () => {
      const mockPrismaService = {
        $executeRaw: jest.fn().mockResolvedValue({ rowCount: 100 }),
      };

      service = new EnhancedAnalyticsService(mockPrismaService, redisService, configService);

      const result = await service.refreshMaterializedViews();

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.totalViews).toBeGreaterThan(0);
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should handle errors during view refresh', async () => {
      const mockPrismaService = {
        $executeRaw: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      service = new EnhancedAnalyticsService(mockPrismaService, redisService, configService);

      const result = await service.refreshMaterializedViews();

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(result.summary.failed).toBeGreaterThan(0);
    });
  });

  describe('collectRealTimeMetrics', () => {
    it('should collect and store real-time metrics', async () => {
      const mockMetrics = {
        system: { cpuUsage: 0.45, memoryUsage: 0.67 },
        application: { activeUsers: 150, apiRequests: 1000 },
        database: { connections: 15, queryTime: 30 },
      };

      mockRedisService.set.mockResolvedValue(true);
      mockRedisService.increment.mockResolvedValue(1);
      mockRedisService.addToMetricsTimeSeries.mockResolvedValue(1);

      await service.collectRealTimeMetrics();

      expect(mockRedisService.set).toHaveBeenCalledWith(
        'real_time_metrics',
        expect.any(Object),
        300, // 5 minutes
      );
      expect(mockRedisService.increment).toHaveBeenCalledWith('metrics:dashboard_views', 1, 86400);
      expect(mockRedisService.increment).toHaveBeenCalledWith('metrics:api_requests', 1, 86400);
      expect(mockRedisService.addToMetricsTimeSeries).toHaveBeenCalled();
    });

    it('should handle errors gracefully during metrics collection', async () => {
      mockRedisService.set.mockRejectedValue(new Error('Redis error'));

      // Should not throw error
      await expect(service.collectRealTimeMetrics()).resolves.not.toThrow();
    });
  });

  describe('Utility Methods', () => {
    it('should parse time ranges correctly', () => {
      // This would test the private method through public interface
      const result1 = service.getExecutiveIntelligenceDashboard('center-123', '7d');
      const result2 = service.getExecutiveIntelligenceDashboard('center-123', '90d');
      const result3 = service.getExecutiveIntelligenceDashboard('center-123', '1y');

      // The method should handle different time ranges
      expect(Promise.all([result1, result2, result3])).resolves.toBeDefined();
    });

    it('should parse benchmark periods correctly', () => {
      const result1 = service.getCenterPerformanceBenchmarking('center-123', 'monthly');
      const result2 = service.getCenterPerformanceBenchmarking('center-123', 'quarterly');
      const result3 = service.getCenterPerformanceBenchmarking('center-123', 'yearly');

      expect(Promise.all([result1, result2, result3])).resolves.toBeDefined();
    });
  });

  describe('Data Integration', () => {
    it('should integrate with existing patient data', async () => {
      mockPrismaService.patient.count.mockResolvedValue(1000);
      mockPrismaService.patient.findMany.mockResolvedValue([
        { id: 'patient-1', name: 'John Doe', dateOfBirth: new Date('1980-01-01') },
      ]);

      mockRedisService.getCachedDashboardData.mockResolvedValue(null);

      const result = await service.getExecutiveIntelligenceDashboard();

      expect(result.overview.totalPatients).toBeGreaterThan(0);
    });

    it('should integrate with research data', async () => {
      mockRedisService.getCachedAnalyticsQuery.mockResolvedValue(null);

      const result = await service.getResearchImpactAnalytics();

      expect(result.summary.researchCount).toBeGreaterThan(0);
      expect(result.detailedMetrics.publications).toBeGreaterThan(0);
    });
  });

  describe('Performance and Caching', () => {
    it('should leverage caching effectively', async () => {
      const centerId = 'center-123';
      const timeRange = '30d';

      // First call should cache the data
      mockRedisService.getCachedDashboardData.mockResolvedValueOnce(null);
      mockRedisService.getCachedDashboardData.mockResolvedValueOnce({
        cached: true,
        timestamp: new Date(),
      });

      mockRedisService.cacheDashboardData.mockResolvedValue(true);

      await service.getExecutiveIntelligenceDashboard(centerId, timeRange);
      const result = await service.getExecutiveIntelligenceDashboard(centerId, timeRange);

      expect(result.cached).toBe(true);
      expect(mockRedisService.getCachedDashboardData).toHaveBeenCalledTimes(2);
      expect(mockRedisService.cacheDashboardData).toHaveBeenCalledTimes(1);
    });

    it('should handle cache misses gracefully', async () => {
      mockRedisService.getCachedDashboardData.mockResolvedValue(null);
      mockRedisService.cacheDashboardData.mockResolvedValue(true);

      const result = await service.getExecutiveIntelligenceDashboard();

      expect(result).toBeDefined();
      expect(mockRedisService.cacheDashboardData).toHaveBeenCalled();
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle Redis service unavailability', async () => {
      mockRedisService.getCachedDashboardData.mockRejectedValue(new Error('Redis unavailable'));

      await expect(service.getExecutiveIntelligenceDashboard()).rejects.toThrow();
    });

    it('should handle database connection issues', async () => {
      mockPrismaService.patient.count.mockRejectedValue(new Error('Database unavailable'));
      mockRedisService.getCachedDashboardData.mockResolvedValue(null);

      // The service should handle this gracefully
      await expect(service.getExecutiveIntelligenceDashboard()).rejects.toThrow();
    });
  });
});

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'redis.host': 'localhost',
        'redis.port': '6379',
        'redis.password': null,
        'redis.db': '0',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock Redis methods
    service.redis = {
      setex: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
      incrby: jest.fn(),
      keys: jest.fn(),
      mget: jest.fn(),
      mdel: jest.fn(),
      lpush: jest.fn(),
      ltrim: jest.fn(),
      zadd: jest.fn(),
      zrevrange: jest.fn(),
      ping: jest.fn(),
      info: jest.fn(),
      expire: jest.fn(),
      lrange: jest.fn(),
      connect: jest.fn(),
      quit: jest.fn(),
      on: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should cache dashboard data correctly', async () => {
    const dashboardId = 'test-dashboard';
    const data = { patients: 1000, quality: 95.5 };
    const ttl = 1800;

    await service.cacheDashboardData(dashboardId, data, ttl);

    expect(service.redis.setex).toHaveBeenCalledWith(
      expect.stringContaining(dashboardId),
      ttl,
      JSON.stringify(data),
    );
  });

  it('should retrieve cached dashboard data', async () => {
    const dashboardId = 'test-dashboard';
    const cachedData = JSON.stringify({ patients: 1000 });

    (service.redis.get as jest.Mock).mockResolvedValue(cachedData);

    const result = await service.getCachedDashboardData(dashboardId);

    expect(result).toEqual({ patients: 1000 });
    expect(service.redis.get).toHaveBeenCalledWith(
      expect.stringContaining(dashboardId),
    );
  });

  it('should handle cache miss gracefully', async () => {
    const dashboardId = 'non-existent-dashboard';

    (service.redis.get as jest.Mock).mockResolvedValue(null);

    const result = await service.getCachedDashboardData(dashboardId);

    expect(result).toBeNull();
  });

  it('should check Redis health status', async () => {
    (service.redis.ping as jest.Mock).mockResolvedValue('PONG');

    const result = await service.isHealthy();

    expect(result).toBe(true);
    expect(service.redis.ping).toHaveBeenCalled();
  });

  it('should detect Redis health issues', async () => {
    (service.redis.ping as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    const result = await service.isHealthy();

    expect(result).toBe(false);
  });

  it('should increment counters correctly', async () => {
    const counterName = 'test_counter';
    const value = 5;
    const ttl = 3600;

    (service.redis.incrby as jest.Mock).mockResolvedValue(5);
    (service.redis.expire as jest.Mock).mockResolvedValue(1);

    const result = await service.incrementCounter(counterName, value, ttl);

    expect(result).toBe(5);
    expect(service.redis.incrby).toHaveBeenCalledWith(
      expect.stringContaining(counterName),
      value,
    );
    expect(service.redis.expire).toHaveBeenCalled();
  });

  it('should add items to sorted sets', async () => {
    const setName = 'test_set';
    const score = 95.5;
    const member = 'test_member';

    (service.redis.zadd as jest.Mock).mockResolvedValue(1);

    const result = await service.addToSortedSet(setName, score, member);

    expect(result).toBe(1);
    expect(service.redis.zadd).toHaveBeenCalledWith(
      expect.stringContaining(setName),
      score,
      member,
    );
  });

  it('should get top items from sorted sets', async () => {
    const setName = 'test_set';
    const count = 10;
    const mockData = ['member1', '95.5', 'member2', '87.3'];

    (service.redis.zrevrange as jest.Mock).mockResolvedValue(mockData);

    const result = await service.getTopFromSortedSet(setName, count);

    expect(result).toEqual([
      { member: 'member1', score: 95.5 },
      { member: 'member2', score: 87.3 },
    ]);
    expect(service.redis.zrevrange).toHaveBeenCalledWith(
      expect.stringContaining(setName),
      0,
      count - 1,
      'WITHSCORES',
    );
  });
});