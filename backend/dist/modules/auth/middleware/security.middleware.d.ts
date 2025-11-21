import { NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
export declare class SecurityMiddleware implements NestMiddleware {
    private readonly configService;
    constructor(configService: ConfigService);
    use(req: FastifyRequest, reply: FastifyReply, next: () => void): void;
    private setSecurityHeaders;
    private validateRequest;
    private checkRateLimit;
    private validateRequestSize;
    private preventSqlInjection;
    private preventXss;
}
