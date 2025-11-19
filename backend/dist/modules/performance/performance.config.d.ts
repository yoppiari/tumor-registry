export interface PerformanceConfig {
    cache: {
        redis: {
            host: string;
            port: number;
            password?: string;
            db: number;
            keyPrefix: string;
            defaultTTL: number;
            connectionPool: {
                min: number;
                max: number;
                acquireTimeoutMillis: number;
                idleTimeoutMillis: number;
            };
        };
        api: {
            enabled: boolean;
            defaultTTL: number;
            maxEntries: number;
            checkPeriod: number;
        };
    };
    monitoring: {
        enabled: boolean;
        prometheus: {
            enabled: boolean;
            port: number;
            path: string;
        };
        metrics: {
            retention: {
                hours: number;
                maxRecords: number;
            };
            collection: {
                interval: number;
                batchSize: number;
            };
        };
        alerts: {
            slowQueryThreshold: number;
            memoryThreshold: number;
            errorRateThreshold: number;
            cpuThreshold: number;
        };
    };
    database: {
        connectionPool: {
            min: number;
            max: number;
            idleTimeoutMillis: number;
            connectionTimeoutMillis: number;
        };
        query: {
            timeout: number;
            enableStats: boolean;
            slowQueryLog: boolean;
            slowQueryThreshold: number;
        };
        maintenance: {
            autoAnalyze: boolean;
            autoVacuum: boolean;
            reindexSchedule: string;
            statisticsUpdateSchedule: string;
        };
    };
    streaming: {
        enabled: boolean;
        defaultBatchSize: number;
        maxConcurrentStreams: number;
        memoryThreshold: number;
        timeout: number;
        compression: {
            enabled: boolean;
            level: number;
            threshold: number;
        };
    };
    api: {
        rateLimiting: {
            enabled: boolean;
            windowMs: number;
            maxRequests: number;
            skipSuccessfulRequests: boolean;
            skipFailedRequests: boolean;
        };
        compression: {
            enabled: boolean;
            level: number;
            threshold: number;
        };
        timeout: {
            connection: number;
            read: number;
            write: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
            credentials: boolean;
        };
    };
}
export declare const defaultPerformanceConfig: PerformanceConfig;
export declare function getPerformanceConfig(): PerformanceConfig;
export declare const performancePresets: {
    highThroughput: {
        description: string;
        config: {
            cache: {
                redis: {
                    defaultTTL: number;
                    connectionPool: {
                        min: number;
                        max: number;
                    };
                };
                api: {
                    defaultTTL: number;
                    maxEntries: number;
                };
            };
            database: {
                connectionPool: {
                    min: number;
                    max: number;
                };
                query: {
                    timeout: number;
                };
            };
            streaming: {
                defaultBatchSize: number;
                maxConcurrentStreams: number;
                memoryThreshold: number;
            };
            api: {
                rateLimiting: {
                    maxRequests: number;
                };
                timeout: {
                    read: number;
                    write: number;
                };
            };
        };
    };
    lowLatency: {
        description: string;
        config: {
            cache: {
                redis: {
                    defaultTTL: number;
                    connectionPool: {
                        min: number;
                        max: number;
                    };
                };
                api: {
                    defaultTTL: number;
                    maxEntries: number;
                };
            };
            monitoring: {
                alerts: {
                    slowQueryThreshold: number;
                    memoryThreshold: number;
                };
            };
            database: {
                connectionPool: {
                    min: number;
                    max: number;
                };
                query: {
                    timeout: number;
                    slowQueryThreshold: number;
                };
            };
            streaming: {
                defaultBatchSize: number;
                timeout: number;
            };
        };
    };
    memoryOptimized: {
        description: string;
        config: {
            cache: {
                redis: {
                    defaultTTL: number;
                    connectionPool: {
                        min: number;
                        max: number;
                    };
                };
                api: {
                    defaultTTL: number;
                    maxEntries: number;
                };
            };
            monitoring: {
                metrics: {
                    retention: {
                        hours: number;
                        maxRecords: number;
                    };
                    collection: {
                        interval: number;
                    };
                };
            };
            database: {
                connectionPool: {
                    min: number;
                    max: number;
                };
                query: {
                    timeout: number;
                };
            };
            streaming: {
                defaultBatchSize: number;
                memoryThreshold: number;
                maxConcurrentStreams: number;
            };
        };
    };
    development: {
        description: string;
        config: {
            cache: {
                redis: {
                    defaultTTL: number;
                    connectionPool: {
                        min: number;
                        max: number;
                    };
                };
                api: {
                    defaultTTL: number;
                    maxEntries: number;
                };
            };
            monitoring: {
                alerts: {
                    slowQueryThreshold: number;
                    memoryThreshold: number;
                };
            };
            database: {
                connectionPool: {
                    min: number;
                    max: number;
                };
                query: {
                    timeout: number;
                };
            };
            api: {
                rateLimiting: {
                    maxRequests: number;
                };
                compression: {
                    enabled: boolean;
                };
            };
        };
    };
};
export declare function applyPerformancePreset(presetName: keyof typeof performancePresets): PerformanceConfig;
