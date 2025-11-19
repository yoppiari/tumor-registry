import { OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit {
    private configService;
    private readonly logger;
    private redis;
    private readonly keyPrefix;
    private readonly defaultTTL;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private initializeRedis;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    flushPattern(pattern: string): Promise<number>;
    hget(key: string, field: string): Promise<string | null>;
    hset(key: string, field: string, value: string): Promise<number>;
    hmset(key: string, data: Record<string, string>): Promise<string>;
    hgetall(key: string): Promise<Record<string, string>>;
    lpush(key: string, ...values: string[]): Promise<number>;
    rpush(key: string, ...values: string[]): Promise<number>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    warmCache(cacheConfig: Array<{
        key: string;
        data: any;
        ttl: number;
    }>): Promise<void>;
    getWithStampedeProtection<T>(key: string, fetcher: () => Promise<T>, ttl?: number, lockTimeout?: number): Promise<T>;
    getWithMultiLevelCache<T>(key: string, l1Fetcher: () => Promise<T | null>, l2Fetcher: () => Promise<T | null>, dbFetcher: () => Promise<T>, ttl?: number): Promise<T>;
    invalidatePattern(pattern: string): Promise<number>;
    invalidateRelatedKeys(baseKey: string, relations: string[]): Promise<number>;
    getCacheInfo(): Promise<{
        connected: boolean;
        memory: string;
        keys: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
    isHealthy(): Promise<boolean>;
    onModuleDestroy(): Promise<void>;
    getClient(): Redis;
}
