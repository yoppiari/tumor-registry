import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { EmailService } from './services/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    centerId?: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare class AuthService {
    private readonly configService;
    private readonly tokenService;
    private readonly emailService;
    constructor(configService: ConfigService, tokenService: TokenService, emailService: EmailService);
    private users;
    private emailVerificationTokens;
    private generateVerificationToken;
    validateUser(email: string, password: string): Promise<User | null>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            centerId: string;
            email_verified: true;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            centerId: string;
            email_verified: boolean;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            centerId: string;
            email_verified: boolean;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            email_verified: boolean;
        };
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        centerId: string;
        email_verified: boolean;
        is_active: boolean;
    }>;
}
export {};
