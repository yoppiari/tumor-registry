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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const config_1 = require("@nestjs/config");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.keyPrefix = 'inamsos:';
        this.defaultTTL = 3600;
    }
    async onModuleInit() {
        await this.initializeRedis();
    }
    async initializeRedis() {
        try {
            this.redis = new ioredis_1.default({
                host: this.configService.get('REDIS_HOST', 'localhost'),
                port: this.configService.get('REDIS_PORT', 6379),
                password: this.configService.get('REDIS_PASSWORD'),
                db: this.configService.get('REDIS_DB', 0),
                keyPrefix: this.keyPrefix,
                retryDelayOnFailover: 100,
                enableReadyCheck: true,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                keepAlive: 30000,
                family: 4,
                connectTimeout: 10000,
                commandTimeout: 5000,
            });
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
            await this.redis.ping();
            this.logger.log('Redis initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Redis:', error);
            throw error;
        }
    }
    async get(key) {
        try {
            return await this.redis.get(key);
        }
        catch (error) {
            this.logger.error(`Redis get error for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            const expireTime = ttl || this.defaultTTL;
            await this.redis.setex(key, expireTime, value);
        }
        catch (error) {
            this.logger.error(`Redis set error for key ${key}:`, error);
            throw error;
        }
    }
    async setex(key, seconds, value) {
        try {
            await this.redis.setex(key, seconds, value);
        }
        catch (error) {
            this.logger.error(`Redis setex error for key ${key}:`, error);
            throw error;
        }
    }
    async del(key) {
        try {
            return await this.redis.del(key);
        }
        catch (error) {
            this.logger.error(`Redis del error for key ${key}:`, error);
            return 0;
        }
    }
    async exists(key) {
        try {
            return await this.redis.exists(key);
        }
        catch (error) {
            this.logger.error(`Redis exists error for key ${key}:`, error);
            return 0;
        }
    }
    async expire(key, seconds) {
        try {
            return await this.redis.expire(key, seconds);
        }
        catch (error) {
            this.logger.error(`Redis expire error for key ${key}:`, error);
            return 0;
        }
    }
    async keys(pattern) {
        try {
            return await this.redis.keys(pattern);
        }
        catch (error) {
            this.logger.error(`Redis keys error for pattern ${pattern}:`, error);
            return [];
        }
    }
    async flushPattern(pattern) {
        try {
            const keys = await this.keys(pattern);
            if (keys.length === 0)
                return 0;
            return await this.redis.del(...keys);
        }
        catch (error) {
            this.logger.error(`Redis flush pattern error for pattern ${pattern}:`, error);
            return 0;
        }
    }
    async hget(key, field) {
        try {
            return await this.redis.hget(key, field);
        }
        catch (error) {
            this.logger.error(`Redis hget error for key ${key}, field ${field}:`, error);
            return null;
        }
    }
    async hset(key, field, value) {
        try {
            return await this.redis.hset(key, field, value);
        }
        catch (error) {
            this.logger.error(`Redis hset error for key ${key}, field ${field}:`, error);
            return 0;
        }
    }
    async hmset(key, data) {
        try {
            return await this.redis.hmset(key, data);
        }
        catch (error) {
            this.logger.error(`Redis hmset error for key ${key}:`, error);
            throw error;
        }
    }
    async hgetall(key) {
        try {
            return await this.redis.hgetall(key);
        }
        catch (error) {
            this.logger.error(`Redis hgetall error for key ${key}:`, error);
            return {};
        }
    }
    async lpush(key, ...values) {
        try {
            return await this.redis.lpush(key, ...values);
        }
        catch (error) {
            this.logger.error(`Redis lpush error for key ${key}:`, error);
            return 0;
        }
    }
    async rpush(key, ...values) {
        try {
            return await this.redis.rpush(key, ...values);
        }
        catch (error) {
            this.logger.error(`Redis rpush error for key ${key}:`, error);
            return 0;
        }
    }
    async lrange(key, start, stop) {
        try {
            return await this.redis.lrange(key, start, stop);
        }
        catch (error) {
            this.logger.error(`Redis lrange error for key ${key}:`, error);
            return [];
        }
    }
    async warmCache(cacheConfig) {
        try {
            const promises = cacheConfig.map(({ key, data, ttl }) => this.set(key, JSON.stringify(data), ttl));
            await Promise.all(promises);
            this.logger.log(`Warmed ${cacheConfig.length} cache entries`);
        }
        catch (error) {
            this.logger.error('Cache warming failed:', error);
        }
    }
    async getWithStampedeProtection(key, fetcher, ttl = this.defaultTTL, lockTimeout = 10) {
        const lockKey = `${key}:lock`;
        const resultKey = key;
        try {
            const cached = await this.get(resultKey);
            if (cached) {
                return JSON.parse(cached);
            }
            const lockAcquired = await this.redis.set(lockKey, '1', 'EX', lockTimeout, 'NX');
            if (lockAcquired === 'OK') {
                try {
                    const data = await fetcher();
                    await this.set(resultKey, JSON.stringify(data), ttl);
                    return data;
                }
                finally {
                    await this.del(lockKey);
                }
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 100));
                const retryCached = await this.get(resultKey);
                if (retryCached) {
                    return JSON.parse(retryCached);
                }
                return await fetcher();
            }
        }
        catch (error) {
            this.logger.error(`Cache stampede protection failed for key ${key}:`, error);
            return await fetcher();
        }
    }
    async getWithMultiLevelCache(key, l1Fetcher, l2Fetcher, dbFetcher, ttl = this.defaultTTL) {
        try {
            const l1Result = await l1Fetcher();
            if (l1Result !== null) {
                return l1Result;
            }
            const l2Result = await this.get(key);
            if (l2Result) {
                const data = JSON.parse(l2Result);
                await l1Fetcher().then(() => { });
                return data;
            }
            const dbResult = await dbFetcher();
            await this.set(key, JSON.stringify(dbResult), ttl);
            await l1Fetcher().then(() => { });
            return dbResult;
        }
        catch (error) {
            this.logger.error(`Multi-level cache failed for key ${key}:`, error);
            return await dbFetcher();
        }
    }
    async invalidatePattern(pattern) {
        return await this.flushPattern(pattern);
    }
    async invalidateRelatedKeys(baseKey, relations) {
        const patterns = relations.map(relation => `${baseKey}:${relation}:*`);
        let totalDeleted = 0;
        for (const pattern of patterns) {
            totalDeleted += await this.flushPattern(pattern);
        }
        return totalDeleted;
    }
    async getCacheInfo() {
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
        }
        catch (error) {
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
    async isHealthy() {
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        }
        catch (error) {
            this.logger.error('Redis health check failed:', error);
            return false;
        }
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
            this.logger.log('Redis connection closed');
        }
    }
    getClient() {
        return this.redis;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map