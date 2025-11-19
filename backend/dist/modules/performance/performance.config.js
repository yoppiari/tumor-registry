"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performancePresets = exports.defaultPerformanceConfig = void 0;
exports.getPerformanceConfig = getPerformanceConfig;
exports.applyPerformancePreset = applyPerformancePreset;
exports.defaultPerformanceConfig = {
    cache: {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            db: parseInt(process.env.REDIS_DB || '0'),
            keyPrefix: 'inamsos:',
            defaultTTL: 3600,
            connectionPool: {
                min: 5,
                max: 20,
                acquireTimeoutMillis: 10000,
                idleTimeoutMillis: 30000,
            },
        },
        api: {
            enabled: true,
            defaultTTL: 300,
            maxEntries: 1000,
            checkPeriod: 600,
        },
    },
    monitoring: {
        enabled: true,
        prometheus: {
            enabled: true,
            port: 9090,
            path: '/metrics',
        },
        metrics: {
            retention: {
                hours: 24,
                maxRecords: 10000,
            },
            collection: {
                interval: 30000,
                batchSize: 100,
            },
        },
        alerts: {
            slowQueryThreshold: 2000,
            memoryThreshold: 80,
            errorRateThreshold: 5,
            cpuThreshold: 85,
        },
    },
    database: {
        connectionPool: {
            min: 5,
            max: 50,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        },
        query: {
            timeout: 30000,
            enableStats: true,
            slowQueryLog: true,
            slowQueryThreshold: 1000,
        },
        maintenance: {
            autoAnalyze: true,
            autoVacuum: true,
            reindexSchedule: '0 2 * * 0',
            statisticsUpdateSchedule: '0 1 * * *',
        },
    },
    streaming: {
        enabled: true,
        defaultBatchSize: 1000,
        maxConcurrentStreams: 10,
        memoryThreshold: 512,
        timeout: 300000,
        compression: {
            enabled: true,
            level: 6,
            threshold: 1024,
        },
    },
    api: {
        rateLimiting: {
            enabled: true,
            windowMs: 900000,
            maxRequests: 1000,
            skipSuccessfulRequests: false,
            skipFailedRequests: false,
        },
        compression: {
            enabled: true,
            level: 6,
            threshold: 1024,
        },
        timeout: {
            connection: 10000,
            read: 30000,
            write: 30000,
        },
        cors: {
            enabled: true,
            origins: ['http://localhost:3000', 'http://localhost:4200'],
            credentials: true,
        },
    },
};
function getPerformanceConfig() {
    const config = { ...exports.defaultPerformanceConfig };
    if (process.env.NODE_ENV === 'production') {
        config.database.connectionPool.max = parseInt(process.env.DB_POOL_MAX || '100');
        config.database.connectionPool.min = parseInt(process.env.DB_POOL_MIN || '20');
        config.monitoring.alerts.slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000');
        config.streaming.memoryThreshold = parseInt(process.env.STREAMING_MEMORY_THRESHOLD || '1024');
        config.api.rateLimiting.maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '5000');
    }
    if (process.env.NODE_ENV === 'development') {
        config.cache.redis.defaultTTL = 300;
        config.monitoring.metrics.collection.interval = 10000;
        config.api.rateLimiting.maxRequests = 10000;
    }
    return config;
}
exports.performancePresets = {
    highThroughput: {
        description: 'Optimized for high throughput with large data volumes',
        config: {
            cache: {
                redis: {
                    defaultTTL: 1800,
                    connectionPool: { min: 20, max: 100 },
                },
                api: {
                    defaultTTL: 600,
                    maxEntries: 5000,
                },
            },
            database: {
                connectionPool: { min: 20, max: 200 },
                query: { timeout: 60000 },
            },
            streaming: {
                defaultBatchSize: 5000,
                maxConcurrentStreams: 50,
                memoryThreshold: 2048,
            },
            api: {
                rateLimiting: { maxRequests: 10000 },
                timeout: { read: 60000, write: 60000 },
            },
        },
    },
    lowLatency: {
        description: 'Optimized for minimal latency and real-time responses',
        config: {
            cache: {
                redis: {
                    defaultTTL: 300,
                    connectionPool: { min: 10, max: 50 },
                },
                api: {
                    defaultTTL: 60,
                    maxEntries: 2000,
                },
            },
            monitoring: {
                alerts: {
                    slowQueryThreshold: 500,
                    memoryThreshold: 70,
                },
            },
            database: {
                connectionPool: { min: 10, max: 100 },
                query: { timeout: 5000, slowQueryThreshold: 200 },
            },
            streaming: {
                defaultBatchSize: 100,
                timeout: 30000,
            },
        },
    },
    memoryOptimized: {
        description: 'Optimized for minimal memory usage',
        config: {
            cache: {
                redis: {
                    defaultTTL: 600,
                    connectionPool: { min: 2, max: 10 },
                },
                api: {
                    defaultTTL: 120,
                    maxEntries: 500,
                },
            },
            monitoring: {
                metrics: {
                    retention: { hours: 6, maxRecords: 1000 },
                    collection: { interval: 60000 },
                },
            },
            database: {
                connectionPool: { min: 2, max: 20 },
                query: { timeout: 15000 },
            },
            streaming: {
                defaultBatchSize: 100,
                memoryThreshold: 256,
                maxConcurrentStreams: 3,
            },
        },
    },
    development: {
        description: 'Optimized for development and testing',
        config: {
            cache: {
                redis: {
                    defaultTTL: 60,
                    connectionPool: { min: 1, max: 5 },
                },
                api: {
                    defaultTTL: 30,
                    maxEntries: 100,
                },
            },
            monitoring: {
                alerts: {
                    slowQueryThreshold: 5000,
                    memoryThreshold: 90,
                },
            },
            database: {
                connectionPool: { min: 1, max: 10 },
                query: { timeout: 10000 },
            },
            api: {
                rateLimiting: { maxRequests: 1000 },
                compression: { enabled: false },
            },
        },
    },
};
function applyPerformancePreset(presetName) {
    const preset = exports.performancePresets[presetName];
    if (!preset) {
        throw new Error(`Performance preset '${presetName}' not found`);
    }
    const baseConfig = getPerformanceConfig();
    return deepMerge(baseConfig, preset.config);
}
function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
}
//# sourceMappingURL=performance.config.js.map