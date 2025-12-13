import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis;
  private readonly keyPrefix = 'inamsos:';
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Check if Redis is disabled via environment variable
    const redisDisabled = this.configService.get<string>('REDIS_DISABLED', 'true') === 'true';

    if (redisDisabled) {
      this.logger.log('Redis is disabled - running without cache');
      this.redis = null;
      return;
    }

    await this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
      const config: any = {
        host: this.configService.get<string>('REDIS_HOST') || 'localhost',
        port: this.configService.get<number>('REDIS_PORT') || 6379,
        db: this.configService.get<number>('REDIS_DB') || 0,
        keyPrefix: this.keyPrefix,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        family: 4,
        connectTimeout: 10000,
        commandTimeout: 5000,
      };

      if (redisPassword) {
        config.password = redisPassword;
      }

      this.redis = new Redis(config);

      // Connection event handlers
      this.redis.on('connect', () => {
        this.logger.log('Redis connected successfully');
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
      });

      this.redis.on('close', () => {
        this.logger.warn('Redis connection closed');
      });

      this.redis.on('reconnecting', () => {
        this.logger.log('Redis reconnecting...');
      });

      // Test connection
      await this.redis.ping();
      this.logger.log('Redis initialized successfully');

    } catch (error) {
      this.logger.warn('Failed to initialize Redis - running without cache:', error.message);
      this.redis = null;
    }
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    if (!this.redis) return null;

    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.redis) return;

    try {
      const expireTime = ttl || this.defaultTTL;
      await this.redis.setex(key, expireTime, value);
    } catch (error) {
      this.logger.error(`Redis set error for key ${key}:`, error);
    }
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.setex(key, seconds, value);
    } catch (error) {
      this.logger.error(`Redis setex error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Redis del error for key ${key}:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.exists(key);
    } catch (error) {
      this.logger.error(`Redis exists error for key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Redis expire error for key ${key}:`, error);
      return 0;
    }
  }

  // Pattern-based operations
  async keys(pattern: string): Promise<string[]> {
    if (!this.redis) return [];

    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.logger.error(`Redis keys error for pattern ${pattern}:`, error);
      return [];
    }
  }

  async flushPattern(pattern: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.redis.del(...keys);
    } catch (error) {
      this.logger.error(`Redis flush pattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | null> {
    if (!this.redis) return null;

    try {
      return await this.redis.hget(key, field);
    } catch (error) {
      this.logger.error(`Redis hget error for key ${key}, field ${field}:`, error);
      return null;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.hset(key, field, value);
    } catch (error) {
      this.logger.error(`Redis hset error for key ${key}, field ${field}:`, error);
      return 0;
    }
  }

  async hmset(key: string, data: Record<string, string>): Promise<string> {
    if (!this.redis) return 'OK';

    try {
      return await this.redis.hmset(key, data);
    } catch (error) {
      this.logger.error(`Redis hmset error for key ${key}:`, error);
      return 'OK';
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.redis) return {};

    try {
      return await this.redis.hgetall(key);
    } catch (error) {
      this.logger.error(`Redis hgetall error for key ${key}:`, error);
      return {};
    }
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.lpush(key, ...values);
    } catch (error) {
      this.logger.error(`Redis lpush error for key ${key}:`, error);
      return 0;
    }
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    if (!this.redis) return 0;

    try {
      return await this.redis.rpush(key, ...values);
    } catch (error) {
      this.logger.error(`Redis rpush error for key ${key}:`, error);
      return 0;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.redis) return [];

    try {
      return await this.redis.lrange(key, start, stop);
    } catch (error) {
      this.logger.error(`Redis lrange error for key ${key}:`, error);
      return [];
    }
  }

  // Cache warming strategies
  async warmCache(cacheConfig: Array<{
    key: string;
    data: any;
    ttl: number;
  }>): Promise<void> {
    if (!this.redis) return;

    try {
      const promises = cacheConfig.map(({ key, data, ttl }) =>
        this.set(key, JSON.stringify(data), ttl)
      );
      await Promise.all(promises);
      this.logger.log(`Warmed ${cacheConfig.length} cache entries`);
    } catch (error) {
      this.logger.error('Cache warming failed:', error);
    }
  }

  // Cache stampede protection
  async getWithStampedeProtection<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL,
    lockTimeout: number = 10
  ): Promise<T> {
    if (!this.redis) return await fetcher();

    const lockKey = `${key}:lock`;
    const resultKey = key;

    try {
      // Try to get cached value
      const cached = await this.get(resultKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Try to acquire lock
      const lockAcquired = await this.redis.set(lockKey, '1', 'EX', lockTimeout, 'NX');

      if (lockAcquired === 'OK') {
        try {
          // Fetch fresh data
          const data = await fetcher();

          // Store in cache
          await this.set(resultKey, JSON.stringify(data), ttl);

          return data;
        } finally {
          // Release lock
          await this.del(lockKey);
        }
      } else {
        // Lock not acquired, wait and retry
        await new Promise(resolve => setTimeout(resolve, 100));
        const retryCached = await this.get(resultKey);
        if (retryCached) {
          return JSON.parse(retryCached);
        }

        // If still no cache, fetch directly (fallback)
        return await fetcher();
      }
    } catch (error) {
      this.logger.error(`Cache stampede protection failed for key ${key}:`, error);
      // Fallback to direct fetch
      return await fetcher();
    }
  }

  // Multi-level caching
  async getWithMultiLevelCache<T>(
    key: string,
    l1Fetcher: () => Promise<T | null>, // Memory cache
    l2Fetcher: () => Promise<T | null>, // Redis cache
    dbFetcher: () => Promise<T>,        // Database
    ttl: number = this.defaultTTL
  ): Promise<T> {
    if (!this.redis) return await dbFetcher();

    try {
      // Level 1: Memory cache (fastest)
      const l1Result = await l1Fetcher();
      if (l1Result !== null) {
        return l1Result;
      }

      // Level 2: Redis cache
      const l2Result = await this.get(key);
      if (l2Result) {
        const data = JSON.parse(l2Result);
        // Populate L1 cache
        await l1Fetcher().then(() => {}); // This should set the L1 cache
        return data;
      }

      // Level 3: Database
      const dbResult = await dbFetcher();

      // Populate L2 cache
      await this.set(key, JSON.stringify(dbResult), ttl);

      // Populate L1 cache
      await l1Fetcher().then(() => {}); // This should set the L1 cache

      return dbResult;
    } catch (error) {
      this.logger.error(`Multi-level cache failed for key ${key}:`, error);
      return await dbFetcher();
    }
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern: string): Promise<number> {
    return await this.flushPattern(pattern);
  }

  async invalidateRelatedKeys(baseKey: string, relations: string[]): Promise<number> {
    const patterns = relations.map(relation => `${baseKey}:${relation}:*`);

    let totalDeleted = 0;
    for (const pattern of patterns) {
      totalDeleted += await this.flushPattern(pattern);
    }

    return totalDeleted;
  }

  // Cache analytics
  async getCacheInfo(): Promise<{
    connected: boolean;
    memory: string;
    keys: number;
    hits: number;
    misses: number;
    hitRate: number;
  }> {
    if (!this.redis) {
      return {
        connected: false,
        memory: '0B',
        keys: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
      };
    }

    try {
      const info = await this.redis.info('memory');
      const stats = await this.redis.info('stats');

      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const keysMatch = stats.match(/keyspace_hits:([^\r\n]+)/);
      const missesMatch = stats.match(/keyspace_misses:([^\r\n]+)/);

      const hits = keysMatch ? parseInt(keysMatch[1]) : 0;
      const misses = missesMatch ? parseInt(missesMatch[1]) : 0;
      const total = hits + misses;

      return {
        connected: this.redis.status === 'ready',
        memory: memoryMatch ? memoryMatch[1] : 'unknown',
        keys: total,
        hits,
        misses,
        hitRate: total > 0 ? (hits / total) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Error getting cache info:', error);
      return {
        connected: false,
        memory: '0B',
        keys: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
      };
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

  // Graceful shutdown
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    }
  }

  // Get Redis client for advanced operations
  getClient(): Redis {
    return this.redis;
  }
}