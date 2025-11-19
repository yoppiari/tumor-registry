import { NestGuard, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare class EnhancedThrottlerGuard implements NestGuard {
    private readonly reflector;
    private readonly configService;
    constructor(reflector: Reflector, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getLimits;
    private getEndpointType;
    private checkRateLimit;
    private getRateLimitStorage;
    private checkInMemoryRateLimit;
    private setRateLimitHeaders;
    private getClientIp;
}
