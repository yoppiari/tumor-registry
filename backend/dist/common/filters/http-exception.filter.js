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
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = this.buildErrorResponse(exception, request);
        const sanitizedResponse = this.sanitizeErrorResponse(errorResponse);
        this.logError(exception, request, status);
        response.status(status).json(sanitizedResponse);
    }
    buildErrorResponse(exception, request) {
        const timestamp = new Date().toISOString();
        const path = request.url;
        const requestId = request.headers['x-request-id'] || this.generateRequestId();
        if (exception instanceof common_1.HttpException) {
            const exceptionResponse = exception.getResponse();
            const message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message || exception.message;
            return {
                success: false,
                error: {
                    code: this.getErrorCode(exception),
                    message: Array.isArray(message) ? message.join(', ') : message,
                    details: this.extractDetails(exceptionResponse),
                    timestamp,
                    path,
                    requestId,
                },
                metadata: {
                    version: process.env.APP_VERSION || '1.0.0',
                    environment: this.configService.get('NODE_ENV', 'development'),
                    correlationId: request.headers['x-correlation-id'],
                },
            };
        }
        return {
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: this.getGenericErrorMessage(),
                timestamp,
                path,
                requestId,
            },
            metadata: {
                version: process.env.APP_VERSION || '1.0.0',
                environment: this.configService.get('NODE_ENV', 'development'),
                correlationId: request.headers['x-correlation-id'],
            },
        };
    }
    sanitizeErrorResponse(errorResponse) {
        const isDevelopment = this.configService.get('NODE_ENV') === 'development';
        if (!isDevelopment) {
            delete errorResponse.error.details;
            delete errorResponse.metadata.correlationId;
            if (errorResponse.error.code === 'INTERNAL_SERVER_ERROR') {
                errorResponse.error.message = this.getGenericErrorMessage();
            }
        }
        return errorResponse;
    }
    logError(exception, request, status) {
        const requestId = request.headers['x-request-id'] || 'unknown';
        const userId = request.user?.sub || 'anonymous';
        const ip = request.ip || request.connection.remoteAddress;
        const logContext = {
            requestId,
            userId,
            ip,
            method: request.method,
            url: request.url,
            userAgent: request.headers['user-agent'],
            statusCode: status,
            timestamp: new Date().toISOString(),
        };
        if (exception instanceof common_1.HttpException) {
            const level = status >= 500 ? 'error' : 'warn';
            this.logger[level](`HTTP Exception: ${exception.message}`, {
                ...logContext,
                exception: exception.getResponse(),
            });
        }
        else {
            this.logger.error('Unhandled Exception', {
                ...logContext,
                exception: exception instanceof Error ? {
                    name: exception.name,
                    message: exception.message,
                    stack: exception.stack,
                } : exception,
            });
        }
    }
    getErrorCode(exception) {
        const status = exception.getStatus();
        const errorCodeMap = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_SERVER_ERROR',
            502: 'BAD_GATEWAY',
            503: 'SERVICE_UNAVAILABLE',
            504: 'GATEWAY_TIMEOUT',
        };
        return errorCodeMap[status] || 'HTTP_ERROR';
    }
    extractDetails(exceptionResponse) {
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const { message, ...details } = exceptionResponse;
            return Object.keys(details).length > 0 ? details : undefined;
        }
        return undefined;
    }
    getGenericErrorMessage() {
        return 'An unexpected error occurred. Please try again later or contact support if the problem persists.';
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HttpExceptionFilter);
class ValidationExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(ValidationExceptionFilter.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = common_1.HttpStatus.BAD_REQUEST;
        const validationErrors = this.extractValidationErrors(exception);
        const errorResponse = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed',
                details: validationErrors,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
            metadata: {
                version: process.env.APP_VERSION || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
            },
        };
        this.logger.warn(`Validation Error: ${JSON.stringify(validationErrors)}`, {
            method: request.method,
            url: request.url,
            body: request.body,
            query: request.query,
        });
        response.status(status).json(errorResponse);
    }
    extractValidationErrors(exception) {
        if (exception && typeof exception === 'object' && 'message' in exception) {
            const errors = exception.message;
            if (Array.isArray(errors)) {
                return errors.map((error) => {
                    if (typeof error === 'string') {
                        return { field: 'unknown', message: error };
                    }
                    if (typeof error === 'object' && error !== null) {
                        const constraints = error.constraints || {};
                        const messages = Object.values(constraints);
                        return {
                            field: error.property || 'unknown',
                            messages: messages.length > 0 ? messages : ['Invalid value'],
                        };
                    }
                    return { field: 'unknown', message: 'Validation error' };
                });
            }
            return [{ field: 'unknown', message: errors }];
        }
        return [{ field: 'unknown', message: 'Unknown validation error' }];
    }
}
exports.ValidationExceptionFilter = ValidationExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map