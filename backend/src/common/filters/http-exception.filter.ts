import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

export interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
    requestId?: string;
  };
  metadata?: {
    version: string;
    environment: string;
    correlationId?: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = this.buildErrorResponse(exception, request);
    const sanitizedResponse = this.sanitizeErrorResponse(errorResponse);

    // Log the error with contextual information
    this.logError(exception, request, status);

    // Send sanitized response
    response.status(status).json(sanitizedResponse);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const requestId = request.headers['x-request-id'] as string || this.generateRequestId();

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

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
          environment: this.configService.get<string>('NODE_ENV', 'development'),
          correlationId: request.headers['x-correlation-id'] as string,
        },
      };
    }

    // Handle unknown exceptions
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
        environment: this.configService.get<string>('NODE_ENV', 'development'),
        correlationId: request.headers['x-correlation-id'] as string,
      },
    };
  }

  private sanitizeErrorResponse(errorResponse: ErrorResponse): ErrorResponse {
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';

    if (!isDevelopment) {
      // Remove sensitive information in production
      delete errorResponse.error.details;
      delete errorResponse.metadata.correlationId;

      // Sanitize stack traces and internal errors
      if (errorResponse.error.code === 'INTERNAL_SERVER_ERROR') {
        errorResponse.error.message = this.getGenericErrorMessage();
      }
    }

    return errorResponse;
  }

  private logError(exception: unknown, request: Request, status: number): void {
    const requestId = request.headers['x-request-id'] as string || 'unknown';
    const userId = (request as any).user?.sub || 'anonymous';
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

    if (exception instanceof HttpException) {
      const level = status >= 500 ? 'error' : 'warn';
      this.logger[level](`HTTP Exception: ${exception.message}`, {
        ...logContext,
        exception: exception.getResponse(),
      });
    } else {
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

  private getErrorCode(exception: HttpException): string {
    const status = exception.getStatus();

    const errorCodeMap: { [key: number]: string } = {
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

  private extractDetails(exceptionResponse: any): any {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const { message, ...details } = exceptionResponse;
      return Object.keys(details).length > 0 ? details : undefined;
    }
    return undefined;
  }

  private getGenericErrorMessage(): string {
    return 'An unexpected error occurred. Please try again later or contact support if the problem persists.';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Validation Exception Filter for DTO validation errors
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;

    const validationErrors = this.extractValidationErrors(exception);

    const errorResponse: ErrorResponse = {
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

  private extractValidationErrors(exception: unknown): any {
    if (exception && typeof exception === 'object' && 'message' in exception) {
      const errors = (exception as any).message;
      if (Array.isArray(errors)) {
        return errors.map((error: any) => {
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