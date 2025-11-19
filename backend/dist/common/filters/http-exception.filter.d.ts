import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
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
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    catch(exception: unknown, host: ArgumentsHost): void;
    private buildErrorResponse;
    private sanitizeErrorResponse;
    private logError;
    private getErrorCode;
    private extractDetails;
    private getGenericErrorMessage;
    private generateRequestId;
}
export declare class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private extractValidationErrors;
}
