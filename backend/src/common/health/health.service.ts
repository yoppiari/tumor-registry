import { Injectable } from '@nestjs/common';

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
}

export interface DetailedHealthCheck extends HealthCheck {
  components: {
    database: ComponentStatus;
    redis: ComponentStatus;
    memory: ComponentStatus;
    disk: ComponentStatus;
  };
}

export interface ComponentStatus {
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
  details?: any;
}

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();
  private readonly version = process.env.APP_VERSION || '1.0.0';
  private readonly environment = process.env.NODE_ENV || 'development';

  checkHealth(): HealthCheck {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      environment: this.environment,
    };
  }

  async checkDetailedHealth(): Promise<DetailedHealthCheck> {
    const baseHealth = this.checkHealth();

    const components = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemory(),
      this.checkDisk(),
    ]);

    const [database, redis, memory, disk] = components;

    const overallStatus = [database, redis, memory, disk].every(
      (c) => c.status === 'healthy',
    )
      ? 'healthy'
      : 'unhealthy';

    return {
      ...baseHealth,
      status: overallStatus,
      components: {
        database,
        redis,
        memory,
        disk,
      },
    };
  }

  checkReadiness(): HealthCheck {
    return this.checkHealth();
  }

  checkLiveness(): HealthCheck {
    return this.checkHealth();
  }

  private async checkDatabase(): Promise<ComponentStatus> {
    const startTime = Date.now();

    try {
      // This would be replaced with actual database connection check
      // For now, simulate a database check
      await new Promise(resolve => setTimeout(resolve, 10));

      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkRedis(): Promise<ComponentStatus> {
    const startTime = Date.now();

    try {
      // This would be replaced with actual Redis connection check
      // For now, simulate a Redis check
      await new Promise(resolve => setTimeout(resolve, 5));

      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  private async checkMemory(): Promise<ComponentStatus> {
    try {
      const memUsage = process.memoryUsage();
      const totalMemory = memUsage.heapTotal;
      const usedMemory = memUsage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      return {
        status: memoryUsagePercent < 90 ? 'healthy' : 'unhealthy',
        details: {
          totalMemory: Math.round(totalMemory / 1024 / 1024), // MB
          usedMemory: Math.round(usedMemory / 1024 / 1024), // MB
          memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  private async checkDisk(): Promise<ComponentStatus> {
    try {
      // This would be replaced with actual disk space check
      // For now, return healthy status
      return {
        status: 'healthy',
        details: {
          // Disk usage details would go here
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }
}