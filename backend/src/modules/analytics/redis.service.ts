import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const redisConfig = {
        host: this.configService.get('redis.host') || 'localhost',
        port: parseInt(this.configService.get('redis.port')) || 6379,
        password: this.configService.get('redis.password'),
        db: parseInt(this.configService.get('redis.db')) || 0,
        keyPrefix: 'inamsos:',
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      };

      this.redis = new Redis(redisConfig);

      this.redis.on('connect', () => {
        this.logger.log('Redis connected successfully');
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
      });

      this.redis.on('close', () => {
        this.logger.warn('Redis connection closed');
      });

      await this.redis.connect();
    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error);
      // Redis is optional for development
      this.redis = null;
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  // Basic cache operations
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.redis) return false;

    try {
      const serializedValue = JSON.stringify(value);
      const expiration = ttl || this.defaultTTL;

      await this.redis.setex(key, expiration, serializedValue);
      return true;
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;

    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.redis) return false;

    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false;

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking cache key ${key}:`, error);
      return false;
    }
  }

  async increment(key: string, value: number = 1): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      this.logger.error(`Error incrementing cache key ${key}:`, error);
      return 0;
    }
  }

  // Pattern-based operations
  async setByPattern(pattern: string, data: any, ttl?: number): Promise<void> {
    if (!this.redis) return;

    try {
      // Generate a unique key for the pattern
      const key = `${pattern}:${Date.now()}`;
      await this.set(key, data, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache by pattern ${pattern}:`, error);
    }
  }

  async getByPattern<T>(pattern: string): Promise<T[]> {
    if (!this.redis) return [];

    try {
      const keys = await this.redis.keys(`*${pattern}*`);
      const values = await this.redis.mget(keys);

      return values
        .filter(value => value !== null)
        .map(value => JSON.parse(value));
    } catch (error) {
      this.logger.error(`Error getting cache by pattern ${pattern}:`, error);
      return [];
    }
  }

  async deleteByPattern(pattern: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      const keys = await this.redis.keys(`*${pattern}*`);
      if (keys.length === 0) return 0;

      return await this.redis.del(...keys);
    } catch (error) {
      this.logger.error(`Error deleting cache by pattern ${pattern}:`, error);
      return 0;
    }
  }

  // Analytics-specific caching methods
  async cacheDashboardData(dashboardId: string, data: any, ttl: number = 1800): Promise<void> {
    const key = `dashboard:${dashboardId}:data`;
    await this.set(key, data, ttl);
    await this.logAnalyticsEvent('DASHBOARD_CACHE_SET', { dashboardId, ttl });
  }

  async getCachedDashboardData(dashboardId: string): Promise<any> {
    const key = `dashboard:${dashboardId}:data`;
    const data = await this.get(key);

    if (data) {
      await this.logAnalyticsEvent('DASHBOARD_CACHE_HIT', { dashboardId });
    } else {
      await this.logAnalyticsEvent('DASHBOARD_CACHE_MISS', { dashboardId });
    }

    return data;
  }

  async cacheAnalyticsQuery(queryHash: string, result: any, ttl: number = 3600): Promise<void> {
    const key = `query:${queryHash}`;
    await this.set(key, result, ttl);

    // Track query cache metrics
    await this.increment('metrics:query_cache_sets');
  }

  async getCachedAnalyticsQuery(queryHash: string): Promise<any> {
    const key = `query:${queryHash}`;
    const result = await this.get(key);

    if (result) {
      await this.increment('metrics:query_cache_hits');
    } else {
      await this.increment('metrics:query_cache_misses');
    }

    return result;
  }

  async cacheCenterMetrics(centerId: string, metrics: any, ttl: number = 3600): Promise<void> {
    const key = `center:${centerId}:metrics`;
    await this.set(key, metrics, ttl);

    // Also add to recent metrics list
    await this.redis.lpush(`center:${centerId}:metrics_history`, JSON.stringify(metrics));
    await this.redis.ltrim(`center:${centerId}:metrics_history`, 0, 99); // Keep last 100 entries
  }

  async getCachedCenterMetrics(centerId: string): Promise<any> {
    const key = `center:${centerId}:metrics`;
    return await this.get(key);
  }

  async cacheTrendAnalysis(cancerType: string, trendData: any, ttl: number = 7200): Promise<void> {
    const key = `trend:${cancerType}`;
    await this.set(key, trendData, ttl);
  }

  async getCachedTrendAnalysis(cancerType: string): Promise<any> {
    const key = `trend:${cancerType}`;
    return await this.get(key);
  }

  async cacheNationalIntelligence(data: any, ttl: number = 1800): Promise<void> {
    const key = 'national:intelligence';
    await this.set(key, data, ttl);
  }

  async getCachedNationalIntelligence(): Promise<any> {
    const key = 'national:intelligence';
    return await this.get(key);
  }

  // Cache invalidation methods
  async invalidateCenterCache(centerId: string): Promise<void> {
    await this.deleteByPattern(`center:${centerId}`);
    await this.deleteByPattern(`dashboard:*center:${centerId}*`);
    await this.logAnalyticsEvent('CENTER_CACHE_INVALIDATED', { centerId });
  }

  async invalidatePatientCache(patientId: string): Promise<void> {
    await this.deleteByPattern(`patient:${patientId}`);
    await this.deleteByPattern(`analytics:*patient:${patientId}*`);
  }

  async invalidateAllAnalyticsCache(): Promise<void> {
    await this.deleteByPattern('dashboard:*');
    await this.deleteByPattern('query:*');
    await this.deleteByPattern('trend:*');
    await this.deleteByPattern('center:*:metrics*');
    await this.deleteByPattern('national:*');
    await this.logAnalyticsEvent('ALL_ANALYTICS_CACHE_INVALIDATED', {});
  }

  // Cache statistics and monitoring
  async getCacheStats(): Promise<any> {
    if (!this.redis) return null;

    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      const stats = await this.redis.info('stats');

      return {
        memory: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        stats: this.parseRedisInfo(stats),
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return null;
    }
  }

  async getCacheMetrics(): Promise<any> {
    if (!this.redis) return null;

    try {
      const hits = await this.get('metrics:cache_hits') || 0;
      const misses = await this.get('metrics:cache_misses') || 0;
      const queryHits = await this.get('metrics:query_cache_hits') || 0;
      const queryMisses = await this.get('metrics:query_cache_misses') || 0;

      const totalRequests = hits + misses;
      const hitRate = totalRequests > 0 ? (hits / totalRequests) * 100 : 0;
      const queryHitRate = (queryHits + queryMisses) > 0 ? (queryHits / (queryHits + queryMisses)) * 100 : 0;

      return {
        cacheHits: hits,
        cacheMisses: misses,
        hitRate: Math.round(hitRate * 100) / 100,
        queryCacheHits: queryHits,
        queryCacheMisses: queryMisses,
        queryHitRate: Math.round(queryHitRate * 100) / 100,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting cache metrics:', error);
      return null;
    }
  }

  // Real-time aggregation methods
  async incrementCounter(counterName: string, value: number = 1, ttl?: number): Promise<number> {
    if (!this.redis) return 0;

    try {
      const key = `counter:${counterName}`;
      const result = await this.redis.incrby(key, value);

      if (ttl) {
        await this.redis.expire(key, ttl);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error incrementing counter ${counterName}:`, error);
      return 0;
    }
  }

  async addToSortedSet(setName: string, score: number, member: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      const key = `sorted_set:${setName}`;
      return await this.redis.zadd(key, score, member);
    } catch (error) {
      this.logger.error(`Error adding to sorted set ${setName}:`, error);
      return 0;
    }
  }

  async getTopFromSortedSet(setName: string, count: number = 10): Promise<Array<{ score: number; member: string }>> {
    if (!this.redis) return [];

    try {
      const key = `sorted_set:${setName}`;
      const results = await this.redis.zrevrange(key, 0, count - 1, 'WITHSCORES');

      const parsedResults = [];
      for (let i = 0; i < results.length; i += 2) {
        parsedResults.push({
          member: results[i],
          score: parseFloat(results[i + 1]),
        });
      }

      return parsedResults;
    } catch (error) {
      this.logger.error(`Error getting top from sorted set ${setName}:`, error);
      return [];
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    if (!this.redis) return false;

    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return false;
    }
  }

  // Private helper methods
  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const parsed: any = {};

    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          parsed[key] = isNaN(Number(value)) ? value : Number(value);
        }
      }
    }

    return parsed;
  }

  private async logAnalyticsEvent(eventType: string, data: any): Promise<void> {
    const eventKey = `analytics:events:${new Date().toISOString().split('T')[0]}`;
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    try {
      await this.redis.lpush(eventKey, JSON.stringify(event));
      await this.redis.expire(eventKey, 86400 * 7); // Keep for 7 days
    } catch (error) {
      // Don't log errors for event logging to avoid infinite loops
    }
  }
}