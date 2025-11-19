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
exports.SecurityMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SecurityMiddleware = class SecurityMiddleware {
    constructor(configService) {
        this.configService = configService;
    }
    use(req, res, next) {
        this.setSecurityHeaders(res);
        this.validateRequest(req);
        this.checkRateLimit(req);
        this.validateRequestSize(req);
        this.preventSqlInjection(req);
        this.preventXss(req);
        next();
    }
    setSecurityHeaders(res) {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        if (this.configService.get('NODE_ENV') === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
            "font-src 'self'; connect-src 'self'; frame-ancestors 'none';");
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), usb=(), magnetometer=(), ' +
            'gyroscope=(), ambient-light-sensor=(), accelerometer=(), payment=()');
    }
    validateRequest(req) {
        const userAgent = req.headers['user-agent'];
        if (!userAgent || userAgent.length < 10) {
            throw new common_1.HttpException('Invalid or missing User-Agent', common_1.HttpStatus.BAD_REQUEST);
        }
        const suspiciousPatterns = [
            /bot/i,
            /crawler/i,
            /scraper/i,
            /curl/i,
            /wget/i,
        ];
        if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
            console.warn(`Suspicious User-Agent detected: ${userAgent} from IP: ${req.ip}`);
        }
    }
    checkRateLimit(req) {
        const clientIp = req.ip || req.connection.remoteAddress;
        const currentTime = Date.now();
        const windowMs = 60 * 1000;
        const maxRequests = 100;
        if (!global.rateLimitStore) {
            global.rateLimitStore = {};
        }
        const key = `rate_limit_${clientIp}`;
        const requests = global.rateLimitStore[key] || [];
        const validRequests = requests.filter((timestamp) => currentTime - timestamp < windowMs);
        if (validRequests.length >= maxRequests) {
            throw new common_1.HttpException('Too many requests. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        validRequests.push(currentTime);
        global.rateLimitStore[key] = validRequests;
    }
    validateRequestSize(req) {
        const contentLength = parseInt(req.headers['content-length'] || '0');
        const maxSize = 10 * 1024 * 1024;
        if (contentLength > maxSize) {
            throw new common_1.HttpException('Request too large. Maximum size is 10MB.', common_1.HttpStatus.PAYLOAD_TOO_LARGE);
        }
    }
    preventSqlInjection(req) {
        const sqlPatterns = [
            /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
            /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
            /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
            /((\%27)|(\'))union/ix,
            /exec(\s|\+)+(s|x)p\w+/ix,
            /UNION[^a-zA-Z]/i,
            /SELECT[^a-zA-Z]/i,
            /INSERT[^a-zA-Z]/i,
            /DELETE[^a-zA-Z]/i,
            /UPDATE[^a-zA-Z]/i,
            /DROP[^a-zA-Z]/i,
        ];
        const checkValue = (value) => {
            if (typeof value === 'string') {
                return sqlPatterns.some(pattern => pattern.test(value));
            }
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(checkValue);
            }
            return false;
        };
        for (const [key, value] of Object.entries(req.query)) {
            if (checkValue(value)) {
                console.warn(`SQL injection attempt detected in query parameter: ${key}`);
                throw new common_1.HttpException('Invalid request parameters detected', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (req.body && checkValue(req.body)) {
            console.warn(`SQL injection attempt detected in request body`);
            throw new common_1.HttpException('Invalid request data detected', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    preventXss(req) {
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /<iframe[^>]*>.*?<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<img[^>]*src[^>]*javascript:/gi,
            /<\s*script/gi,
            /<\s*object/gi,
            /<\s*embed/gi,
            /<\s*link/gi,
        ];
        const sanitizeValue = (value) => {
            if (typeof value === 'string') {
                let sanitized = value;
                xssPatterns.forEach(pattern => {
                    sanitized = sanitized.replace(pattern, '');
                });
                return sanitized;
            }
            if (typeof value === 'object' && value !== null) {
                const sanitized = {};
                for (const [key, val] of Object.entries(value)) {
                    sanitized[key] = sanitizeValue(val);
                }
                return sanitized;
            }
            return value;
        };
        if (req.body) {
            req.body = sanitizeValue(req.body);
        }
        req.query = sanitizeValue(req.query);
    }
};
exports.SecurityMiddleware = SecurityMiddleware;
exports.SecurityMiddleware = SecurityMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityMiddleware);
//# sourceMappingURL=security.middleware.js.map