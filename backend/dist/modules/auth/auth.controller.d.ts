import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { FastifyRequest } from 'fastify';
import { MfaService } from './mfa.service';
export declare class AuthController {
    private readonly authService;
    private readonly mfaService;
    constructor(authService: AuthService, mfaService: MfaService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            isActive: boolean;
            isEmailVerified: boolean;
            mfaEnabled: boolean;
            role: string;
        };
        message: string;
        verificationToken: string;
        mfaSecret: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        requireMFA: boolean;
        tempToken: string;
        message: string;
    } | {
        requireMFA: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            centerId: string;
        };
        tempToken?: undefined;
        message?: undefined;
    }>;
    verifyMFA(tempToken: string, mfaCode: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            centerId: string;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: FastifyRequest): Promise<any>;
    logout(req: FastifyRequest): Promise<{
        message: string;
    }>;
    setupMfa(req: FastifyRequest): Promise<{
        secret: string;
        manualEntryKey: string;
    }>;
    enableMfa(req: FastifyRequest, secret: string, token: string): Promise<{
        success: boolean;
        backupCodes: string[];
    }>;
    disableMfa(req: FastifyRequest, password: string, token?: string): Promise<{
        message: string;
    }>;
    verifyMfaToken(req: FastifyRequest, token: string): Promise<{
        valid: boolean;
    }>;
    regenerateBackupCodes(req: FastifyRequest, token: string): Promise<{
        backupCodes: string[];
    }>;
    verifyBackupCode(req: FastifyRequest, backupCode: string): Promise<{
        valid: boolean;
    }>;
    getMfaStatus(req: FastifyRequest): Promise<{
        mfaEnabled: any;
        mfaRequired: boolean;
    }>;
}
