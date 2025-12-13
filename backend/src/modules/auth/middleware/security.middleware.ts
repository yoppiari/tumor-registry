import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: FastifyRequest, reply: FastifyReply, next: () => void) {
    // Security headers
    this.setSecurityHeaders(reply);

    // Request validation
    this.validateRequest(req);

    // Rate limiting per IP
    this.checkRateLimit(req);

    // Request size validation
    this.validateRequestSize(req);

    // SQL injection prevention
    this.preventSqlInjection(req);

    // XSS prevention
    this.preventXss(req);

    next();
  }

  private setSecurityHeaders(reply: FastifyReply) {
    // Prevent clickjacking
    reply.header('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    reply.header('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection
    reply.header('X-XSS-Protection', '1; mode=block');

    // Strict Transport Security
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      reply.header(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    // Content Security Policy
    reply.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
      "font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
    );

    // Referrer Policy
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy
    reply.header(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), usb=(), magnetometer=(), ' +
      'gyroscope=(), ambient-light-sensor=(), accelerometer=(), payment=()'
    );
  }

  private validateRequest(req: FastifyRequest) {
    // Validate user agent to prevent basic bot attacks
    const userAgent = req.headers['user-agent'];
    if (!userAgent || userAgent.length < 10) {
      throw new HttpException(
        'Invalid or missing User-Agent',
        HttpStatus.BAD_REQUEST
      );
    }

    // Check for suspicious patterns in user agent
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /scraper/i,
      /curl/i,
      /wget/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      // Log suspicious request but don't block legitimate tools
      console.warn(`Suspicious User-Agent detected: ${userAgent} from IP: ${req.ip}`);
    }
  }

  private checkRateLimit(req: FastifyRequest) {
    // This is a simple in-memory rate limit
    // In production, use Redis or other distributed cache
    const clientIp = req.ip || req.socket?.remoteAddress;
    const currentTime = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    // Store in a simple object (use Redis in production)
    if (!global.rateLimitStore) {
      global.rateLimitStore = {};
    }

    const key = `rate_limit_${clientIp}`;
    const requests = global.rateLimitStore[key] || [];

    // Clean old requests
    const validRequests = requests.filter((timestamp: number) =>
      currentTime - timestamp < windowMs
    );

    if (validRequests.length >= maxRequests) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Add current request
    validRequests.push(currentTime);
    global.rateLimitStore[key] = validRequests;
  }

  private validateRequestSize(req: FastifyRequest) {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      throw new HttpException(
        'Request too large. Maximum size is 10MB.',
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }
  }

  private preventSqlInjection(req: FastifyRequest) {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i,
      /exec(\s|\+)+(s|x)p\w+/i,
      /UNION[^a-zA-Z]/i,
      /SELECT[^a-zA-Z]/i,
      /INSERT[^a-zA-Z]/i,
      /DELETE[^a-zA-Z]/i,
      /UPDATE[^a-zA-Z]/i,
      /DROP[^a-zA-Z]/i,
    ];

    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return sqlPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(checkValue);
      }
      return false;
    };

    // Check query parameters
    for (const [key, value] of Object.entries(req.query)) {
      if (checkValue(value)) {
        console.warn(`SQL injection attempt detected in query parameter: ${key}`);
        throw new HttpException(
          'Invalid request parameters detected',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Check request body
    if (req.body && checkValue(req.body)) {
      console.warn(`SQL injection attempt detected in request body`);
      throw new HttpException(
        'Invalid request data detected',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private preventXss(req: FastifyRequest) {
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

    const sanitizeValue = (value: any): any => {
      if (typeof value === 'string') {
        let sanitized = value;
        xssPatterns.forEach(pattern => {
          sanitized = sanitized.replace(pattern, '');
        });
        return sanitized;
      }
      if (typeof value === 'object' && value !== null) {
        const sanitized: any = {};
        for (const [key, val] of Object.entries(value)) {
          sanitized[key] = sanitizeValue(val);
        }
        return sanitized;
      }
      return value;
    };

    // Sanitize request body
    if (req.body) {
      req.body = sanitizeValue(req.body);
    }

    // Sanitize query parameters
    req.query = sanitizeValue(req.query);
  }
}