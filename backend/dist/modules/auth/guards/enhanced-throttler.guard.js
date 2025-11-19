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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
let EnhancedThrottlerGuard = class EnhancedThrottlerGuard {
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const throttleOptions = this.reflector.get('throttle', context.getHandler()) || this.reflector.get('throttle', context.getClass());
        const limits = this.getLimits(request, throttleOptions);
        const isAllowed = await this.checkRateLimit(request, limits);
        if (!isAllowed) {
            this.setRateLimitHeaders(response, limits);
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'TOO_MANY_REQUESTS',
                    message: 'Too many requests. Please try again later.',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    retryAfter: limits.ttl,
                },
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        this.setRateLimitHeaders(response, limits);
        return true;
    }
    getLimits(request, customOptions) {
        const user = request.user;
        const role = user?.role || 'ANONYMOUS';
        const endpoint = this.getEndpointType(request);
        const limitsConfig = {
            ANONYMOUS: {
                auth: { ttl: 900, limit: 5 },
                public: { ttl: 60, limit: 10 },
                search: { ttl: 60, limit: 20 },
            },
            STAFF: {
                auth: { ttl: 900, limit: 20 },
                data: { ttl: 60, limit: 100 },
                search: { ttl: 60, limit: 200 },
                export: { ttl: 3600, limit: 5 },
            },
            DATA_ENTRY: {
                auth: { ttl: 900, limit: 30 },
                data: { ttl: 60, limit: 200 },
                search: { ttl: 60, limit: 300 },
                export: { ttl: 3600, limit: 10 },
            },
            RESEARCHER: {
                auth: { ttl: 900, limit: 25 },
                analytics: { ttl: 60, limit: 150 },
                research: { ttl: 60, limit: 100 },
                export: { ttl: 3600, limit: 15 },
            },
            CENTER_ADMIN: {
                auth: { ttl: 900, limit: 40 },
                data: { ttl: 60, limit: 300 },
                admin: { ttl: 60, limit: 200 },
                export: { ttl: 3600, limit: 20 },
            },
            NATIONAL_ADMIN: {
                auth: { ttl: 900, limit: 50 },
                data: { ttl: 60, limit: 500 },
                admin: { ttl: 60, limit: 400 },
                analytics: { ttl: 60, limit: 300 },
                export: { ttl: 3600, limit: 50 },
            },
        };
        const roleLimits = limitsConfig[role] || limitsConfig.ANONYMOUS;
        const endpointLimits = roleLimits[endpoint] || roleLimits.data;
        return customOptions || endpointLimits;
    }
    getEndpointType(request) {
        const path = request.path.toLowerCase();
        const method = request.method.toLowerCase();
        if (path.includes('/auth/') || path.includes('/login') || path.includes('/register')) {
            return 'auth';
        }
        if (path.includes('/public/') || path.includes('/health')) {
            return 'public';
        }
        if (path.includes('/analytics/') || path.includes('/dashboard')) {
            return 'analytics';
        }
        if (path.includes('/research/')) {
            return 'research';
        }
        if (path.includes('/search') || method === 'get' && (path.includes('/patients') || path.includes('/centers'))) {
            return 'search';
        }
        if (path.includes('/export') || path.includes('/download')) {
            return 'export';
        }
        if (path.includes('/admin/') || path.includes('/system-administration/')) {
            return 'admin';
        }
        return 'data';
    }
    async checkRateLimit(request, limits) {
        const clientIp = this.getClientIp(request);
        const user = request.user;
        const key = user ? `user:${user.sub}` : `ip:${clientIp}`;
        const endpoint = this.getEndpointType(request);
        const storage = this.getRateLimitStorage();
        const storageKey = `rate_limit:${key}:${endpoint}`;
        try {
            const current = await storage.increment(storageKey, limits.ttl);
            return current <= limits.limit;
        }
        catch (error) {
            return this.checkInMemoryRateLimit(storageKey, limits);
        }
    }
    getRateLimitStorage() {
        return new InMemoryRateLimitStorage();
    }
    checkInMemoryRateLimit(key, limits) {
        if (!global.rateLimitStorage) {
            global.rateLimitStorage = new Map();
        }
        const storage = global.rateLimitStorage;
        const now = Date.now();
        const existing = storage.get(key);
        if (!existing || now > existing.resetTime) {
            storage.set(key, {
                count: 1,
                resetTime: now + (limits.ttl * 1000),
            });
            return true;
        }
        existing.count++;
        return existing.count <= limits.limit;
    }
    setRateLimitHeaders(response, limits) {
        response.setHeader('X-RateLimit-Limit', limits.limit);
        response.setHeader('X-RateLimit-Window', limits.ttl);
        response.setHeader('X-RateLimit-Remaining', Math.max(0, limits.limit - 1));
    }
    getClientIp(request) {
        return (request.headers['x-forwarded-for']?.split(',')[0] ||
            request.headers['x-real-ip'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            '127.0.0.1');
    }
};
exports.EnhancedThrottlerGuard = EnhancedThrottlerGuard;
exports.EnhancedThrottlerGuard = EnhancedThrottlerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService])
], EnhancedThrottlerGuard);
class InMemoryRateLimitStorage {
    constructor() {
        this.storage = new Map();
    }
    async increment(key, ttlSeconds) {
        const now = Date.now();
        const existing = this.storage.get(key);
        if (!existing || now > existing.resetTime) {
            this.storage.set(key, {
                count: 1,
                resetTime: now + (ttlSeconds * 1000),
            });
            return 1;
        }
        existing.count++;
        this.cleanupExpired();
        return existing.count;
    }
    cleanupExpired() {
        const now = Date.now();
        for (const [key, value] of this.storage.entries()) {
            if (now > value.resetTime) {
                this.storage.delete(key);
            }
        }
    }
}
//# sourceMappingURL=enhanced-throttler.guard.js.map