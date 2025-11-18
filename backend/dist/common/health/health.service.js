"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
let HealthService = class HealthService {
    constructor() {
        this.startTime = Date.now();
        this.version = process.env.APP_VERSION || '1.0.0';
        this.environment = process.env.NODE_ENV || 'development';
    }
    checkHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
            version: this.version,
            environment: this.environment,
        };
    }
    async checkDetailedHealth() {
        const baseHealth = this.checkHealth();
        const components = await Promise.all([
            this.checkDatabase(),
            this.checkRedis(),
            this.checkMemory(),
            this.checkDisk(),
        ]);
        const [database, redis, memory, disk] = components;
        const overallStatus = [database, redis, memory, disk].every((c) => c.status === 'healthy')
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
    checkReadiness() {
        return this.checkHealth();
    }
    checkLiveness() {
        return this.checkHealth();
    }
    async checkDatabase() {
        const startTime = Date.now();
        try {
            await new Promise(resolve => setTimeout(resolve, 10));
            return {
                status: 'healthy',
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                responseTime: Date.now() - startTime,
                error: error.message,
            };
        }
    }
    async checkRedis() {
        const startTime = Date.now();
        try {
            await new Promise(resolve => setTimeout(resolve, 5));
            return {
                status: 'healthy',
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                responseTime: Date.now() - startTime,
                error: error.message,
            };
        }
    }
    async checkMemory() {
        try {
            const memUsage = process.memoryUsage();
            const totalMemory = memUsage.heapTotal;
            const usedMemory = memUsage.heapUsed;
            const memoryUsagePercent = (usedMemory / totalMemory) * 100;
            return {
                status: memoryUsagePercent < 90 ? 'healthy' : 'unhealthy',
                details: {
                    totalMemory: Math.round(totalMemory / 1024 / 1024),
                    usedMemory: Math.round(usedMemory / 1024 / 1024),
                    memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
            };
        }
    }
    async checkDisk() {
        try {
            return {
                status: 'healthy',
                details: {},
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)()
], HealthService);
//# sourceMappingURL=health.service.js.map