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
        interval: number; // milliseconds
        batchSize: number;
      };
    };
    alerts: {
      slowQueryThreshold: number; // milliseconds
      memoryThreshold: number; // percentage
      errorRateThreshold: number; // percentage
      cpuThreshold: number; // percentage
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
      timeout: number; // milliseconds
      enableStats: boolean;
      slowQueryLog: boolean;
      slowQueryThreshold: number; // milliseconds
    };
    maintenance: {
      autoAnalyze: boolean;
      autoVacuum: boolean;
      reindexSchedule: string; // cron expression
      statisticsUpdateSchedule: string; // cron expression
    };
  };
  streaming: {
    enabled: boolean;
    defaultBatchSize: number;
    maxConcurrentStreams: number;
    memoryThreshold: number; // MB
    timeout: number; // milliseconds
    compression: {
      enabled: boolean;
      level: number;
      threshold: number; // bytes
    };
  };
  api: {
    rateLimiting: {
      enabled: boolean;
      windowMs: number; // milliseconds
      maxRequests: number;
      skipSuccessfulRequests: boolean;
      skipFailedRequests: boolean;
    };
    compression: {
      enabled: boolean;
      level: number;
      threshold: number; // bytes
    };
    timeout: {
      connection: number; // milliseconds
      read: number; // milliseconds
      write: number; // milliseconds
    };
    cors: {
      enabled: boolean;
      origins: string[];
      credentials: boolean;
    };
  };
}

export const defaultPerformanceConfig: PerformanceConfig = {
  cache: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: 'inamsos:',
      defaultTTL: 3600, // 1 hour
      connectionPool: {
        min: 5,
        max: 20,
        acquireTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      },
    },
    api: {
      enabled: true,
      defaultTTL: 300, // 5 minutes
      maxEntries: 1000,
      checkPeriod: 600, // 10 minutes
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
        interval: 30000, // 30 seconds
        batchSize: 100,
      },
    },
    alerts: {
      slowQueryThreshold: 2000, // 2 seconds
      memoryThreshold: 80, // 80%
      errorRateThreshold: 5, // 5%
      cpuThreshold: 85, // 85%
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
      timeout: 30000, // 30 seconds
      enableStats: true,
      slowQueryLog: true,
      slowQueryThreshold: 1000, // 1 second
    },
    maintenance: {
      autoAnalyze: true,
      autoVacuum: true,
      reindexSchedule: '0 2 * * 0', // Sunday 2 AM
      statisticsUpdateSchedule: '0 1 * * *', // Daily 1 AM
    },
  },
  streaming: {
    enabled: true,
    defaultBatchSize: 1000,
    maxConcurrentStreams: 10,
    memoryThreshold: 512, // 512 MB
    timeout: 300000, // 5 minutes
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024, // 1 KB
    },
  },
  api: {
    rateLimiting: {
      enabled: true,
      windowMs: 900000, // 15 minutes
      maxRequests: 1000,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    },
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024, // 1 KB
    },
    timeout: {
      connection: 10000, // 10 seconds
      read: 30000, // 30 seconds
      write: 30000, // 30 seconds
    },
    cors: {
      enabled: true,
      origins: ['http://localhost:3000', 'http://localhost:4200'],
      credentials: true,
    },
  },
};

export function getPerformanceConfig(): PerformanceConfig {
  // In production, this would load from environment variables or config files
  const config = { ...defaultPerformanceConfig };

  // Override with environment variables
  if (process.env.NODE_ENV === 'production') {
    config.database.connectionPool.max = parseInt(process.env.DB_POOL_MAX || '100');
    config.database.connectionPool.min = parseInt(process.env.DB_POOL_MIN || '20');
    config.monitoring.alerts.slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000');
    config.streaming.memoryThreshold = parseInt(process.env.STREAMING_MEMORY_THRESHOLD || '1024');
    config.api.rateLimiting.maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '5000');
  }

  if (process.env.NODE_ENV === 'development') {
    config.cache.redis.defaultTTL = 300; // 5 minutes for dev
    config.monitoring.metrics.collection.interval = 10000; // 10 seconds
    config.api.rateLimiting.maxRequests = 10000; // Relaxed for dev
  }

  return config;
}

// Performance optimization presets
export const performancePresets = {
  highThroughput: {
    description: 'Optimized for high throughput with large data volumes',
    config: {
      cache: {
        redis: {
          defaultTTL: 1800, // 30 minutes
          connectionPool: { min: 20, max: 100 },
        },
        api: {
          defaultTTL: 600, // 10 minutes
          maxEntries: 5000,
        },
      },
      database: {
        connectionPool: { min: 20, max: 200 },
        query: { timeout: 60000 }, // 1 minute
      },
      streaming: {
        defaultBatchSize: 5000,
        maxConcurrentStreams: 50,
        memoryThreshold: 2048, // 2 GB
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
          defaultTTL: 300, // 5 minutes
          connectionPool: { min: 10, max: 50 },
        },
        api: {
          defaultTTL: 60, // 1 minute
          maxEntries: 2000,
        },
      },
      monitoring: {
        alerts: {
          slowQueryThreshold: 500, // 500ms
          memoryThreshold: 70,
        },
      },
      database: {
        connectionPool: { min: 10, max: 100 },
        query: { timeout: 5000, slowQueryThreshold: 200 },
      },
      streaming: {
        defaultBatchSize: 100,
        timeout: 30000, // 30 seconds
      },
    },
  },
  memoryOptimized: {
    description: 'Optimized for minimal memory usage',
    config: {
      cache: {
        redis: {
          defaultTTL: 600, // 10 minutes
          connectionPool: { min: 2, max: 10 },
        },
        api: {
          defaultTTL: 120, // 2 minutes
          maxEntries: 500,
        },
      },
      monitoring: {
        metrics: {
          retention: { hours: 6, maxRecords: 1000 },
          collection: { interval: 60000 }, // 1 minute
        },
      },
      database: {
        connectionPool: { min: 2, max: 20 },
        query: { timeout: 15000 },
      },
      streaming: {
        defaultBatchSize: 100,
        memoryThreshold: 256, // 256 MB
        maxConcurrentStreams: 3,
      },
    },
  },
  development: {
    description: 'Optimized for development and testing',
    config: {
      cache: {
        redis: {
          defaultTTL: 60, // 1 minute
          connectionPool: { min: 1, max: 5 },
        },
        api: {
          defaultTTL: 30, // 30 seconds
          maxEntries: 100,
        },
      },
      monitoring: {
        alerts: {
          slowQueryThreshold: 5000, // 5 seconds (more relaxed)
          memoryThreshold: 90,
        },
      },
      database: {
        connectionPool: { min: 1, max: 10 },
        query: { timeout: 10000 },
      },
      api: {
        rateLimiting: { maxRequests: 1000 },
        compression: { enabled: false }, // Disable for easier debugging
      },
    },
  },
};

export function applyPerformancePreset(presetName: keyof typeof performancePresets): PerformanceConfig {
  const preset = performancePresets[presetName];
  if (!preset) {
    throw new Error(`Performance preset '${presetName}' not found`);
  }

  const baseConfig = getPerformanceConfig();

  // Deep merge preset config with base config
  return deepMerge(baseConfig, preset.config);
}

function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}