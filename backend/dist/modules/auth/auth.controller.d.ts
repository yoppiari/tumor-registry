import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
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
        mfaSecret: any;
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
    getProfile(req: Request): Promise<Express.User>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    setupMfa(req: Request): Promise<{
        secret: string;
        manualEntryKey: string;
    }>;
    enableMfa(req: Request, secret: string, token: string): Promise<{
        success: boolean;
        backupCodes: string[];
    }>;
    disableMfa(req: Request, password: string, token?: string): Promise<{
        message: string;
    }>;
    verifyMfaToken(req: Request, token: string): Promise<{
        valid: boolean;
    }>;
    regenerateBackupCodes(req: Request, token: string): Promise<{
        backupCodes: string[];
    }>;
    verifyBackupCode(req: Request, backupCode: string): Promise<{
        valid: boolean;
    }>;
    getMfaStatus(req: Request): Promise<{
        mfaEnabled: any;
        mfaRequired: boolean;
    }>;
}
