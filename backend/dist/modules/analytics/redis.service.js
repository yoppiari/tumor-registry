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
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.defaultTTL = 3600;
    }
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
            this.redis = new ioredis_1.default(redisConfig);
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
        }
        catch (error) {
            this.logger.error('Failed to initialize Redis:', error);
            this.redis = null;
        }
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
    async set(key, value, ttl) {
        if (!this.redis)
            return false;
        try {
            const serializedValue = JSON.stringify(value);
            const expiration = ttl || this.defaultTTL;
            await this.redis.setex(key, expiration, serializedValue);
            return true;
        }
        catch (error) {
            this.logger.error(`Error setting cache key ${key}:`, error);
            return false;
        }
    }
    async get(key) {
        if (!this.redis)
            return null;
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            this.logger.error(`Error getting cache key ${key}:`, error);
            return null;
        }
    }
    async del(key) {
        if (!this.redis)
            return false;
        try {
            await this.redis.del(key);
            return true;
        }
        catch (error) {
            this.logger.error(`Error deleting cache key ${key}:`, error);
            return false;
        }
    }
    async exists(key) {
        if (!this.redis)
            return false;
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        }
        catch (error) {
            this.logger.error(`Error checking cache key ${key}:`, error);
            return false;
        }
    }
    async increment(key, value = 1) {
        if (!this.redis)
            return 0;
        try {
            return await this.redis.incrby(key, value);
        }
        catch (error) {
            this.logger.error(`Error incrementing cache key ${key}:`, error);
            return 0;
        }
    }
    async setByPattern(pattern, data, ttl) {
        if (!this.redis)
            return;
        try {
            const key = `${pattern}:${Date.now()}`;
            await this.set(key, data, ttl);
        }
        catch (error) {
            this.logger.error(`Error setting cache by pattern ${pattern}:`, error);
        }
    }
    async getByPattern(pattern) {
        if (!this.redis)
            return [];
        try {
            const keys = await this.redis.keys(`*${pattern}*`);
            const values = await this.redis.mget(keys);
            return values
                .filter(value => value !== null)
                .map(value => JSON.parse(value));
        }
        catch (error) {
            this.logger.error(`Error getting cache by pattern ${pattern}:`, error);
            return [];
        }
    }
    async deleteByPattern(pattern) {
        if (!this.redis)
            return 0;
        try {
            const keys = await this.redis.keys(`*${pattern}*`);
            if (keys.length === 0)
                return 0;
            return await this.redis.del(...keys);
        }
        catch (error) {
            this.logger.error(`Error deleting cache by pattern ${pattern}:`, error);
            return 0;
        }
    }
    async cacheDashboardData(dashboardId, data, ttl = 1800) {
        const key = `dashboard:${dashboardId}:data`;
        await this.set(key, data, ttl);
        await this.logAnalyticsEvent('DASHBOARD_CACHE_SET', { dashboardId, ttl });
    }
    async getCachedDashboardData(dashboardId) {
        const key = `dashboard:${dashboardId}:data`;
        const data = await this.get(key);
        if (data) {
            await this.logAnalyticsEvent('DASHBOARD_CACHE_HIT', { dashboardId });
        }
        else {
            await this.logAnalyticsEvent('DASHBOARD_CACHE_MISS', { dashboardId });
        }
        return data;
    }
    async cacheAnalyticsQuery(queryHash, result, ttl = 3600) {
        const key = `query:${queryHash}`;
        await this.set(key, result, ttl);
        await this.increment('metrics:query_cache_sets');
    }
    async getCachedAnalyticsQuery(queryHash) {
        const key = `query:${queryHash}`;
        const result = await this.get(key);
        if (result) {
            await this.increment('metrics:query_cache_hits');
        }
        else {
            await this.increment('metrics:query_cache_misses');
        }
        return result;
    }
    async cacheCenterMetrics(centerId, metrics, ttl = 3600) {
        const key = `center:${centerId}:metrics`;
        await this.set(key, metrics, ttl);
        await this.redis.lpush(`center:${centerId}:metrics_history`, JSON.stringify(metrics));
        await this.redis.ltrim(`center:${centerId}:metrics_history`, 0, 99);
    }
    async getCachedCenterMetrics(centerId) {
        const key = `center:${centerId}:metrics`;
        return await this.get(key);
    }
    async cacheTrendAnalysis(cancerType, trendData, ttl = 7200) {
        const key = `trend:${cancerType}`;
        await this.set(key, trendData, ttl);
    }
    async getCachedTrendAnalysis(cancerType) {
        const key = `trend:${cancerType}`;
        return await this.get(key);
    }
    async cacheNationalIntelligence(data, ttl = 1800) {
        const key = 'national:intelligence';
        await this.set(key, data, ttl);
    }
    async getCachedNationalIntelligence() {
        const key = 'national:intelligence';
        return await this.get(key);
    }
    async invalidateCenterCache(centerId) {
        await this.deleteByPattern(`center:${centerId}`);
        await this.deleteByPattern(`dashboard:*center:${centerId}*`);
        await this.logAnalyticsEvent('CENTER_CACHE_INVALIDATED', { centerId });
    }
    async invalidatePatientCache(patientId) {
        await this.deleteByPattern(`patient:${patientId}`);
        await this.deleteByPattern(`analytics:*patient:${patientId}*`);
    }
    async invalidateAllAnalyticsCache() {
        await this.deleteByPattern('dashboard:*');
        await this.deleteByPattern('query:*');
        await this.deleteByPattern('trend:*');
        await this.deleteByPattern('center:*:metrics*');
        await this.deleteByPattern('national:*');
        await this.logAnalyticsEvent('ALL_ANALYTICS_CACHE_INVALIDATED', {});
    }
    async getCacheStats() {
        if (!this.redis)
            return null;
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
        }
        catch (error) {
            this.logger.error('Error getting cache stats:', error);
            return null;
        }
    }
    async getCacheMetrics() {
        if (!this.redis)
            return null;
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
        }
        catch (error) {
            this.logger.error('Error getting cache metrics:', error);
            return null;
        }
    }
    async incrementCounter(counterName, value = 1, ttl) {
        if (!this.redis)
            return 0;
        try {
            const key = `counter:${counterName}`;
            const result = await this.redis.incrby(key, value);
            if (ttl) {
                await this.redis.expire(key, ttl);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error incrementing counter ${counterName}:`, error);
            return 0;
        }
    }
    async addToSortedSet(setName, score, member) {
        if (!this.redis)
            return 0;
        try {
            const key = `sorted_set:${setName}`;
            return await this.redis.zadd(key, score, member);
        }
        catch (error) {
            this.logger.error(`Error adding to sorted set ${setName}:`, error);
            return 0;
        }
    }
    async getTopFromSortedSet(setName, count = 10) {
        if (!this.redis)
            return [];
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
        }
        catch (error) {
            this.logger.error(`Error getting top from sorted set ${setName}:`, error);
            return [];
        }
    }
    async isHealthy() {
        if (!this.redis)
            return false;
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        }
        catch (error) {
            this.logger.error('Redis health check failed:', error);
            return false;
        }
    }
    parseRedisInfo(info) {
        const lines = info.split('\r\n');
        const parsed = {};
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
    async logAnalyticsEvent(eventType, data) {
        const eventKey = `analytics:events:${new Date().toISOString().split('T')[0]}`;
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data,
        };
        try {
            await this.redis.lpush(eventKey, JSON.stringify(event));
            await this.redis.expire(eventKey, 86400 * 7);
        }
        catch (error) {
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map