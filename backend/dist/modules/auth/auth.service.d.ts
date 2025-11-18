import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';
import { DatabaseService } from '../../database/database.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private databaseService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, databaseService: DatabaseService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            isActive: any;
            isEmailVerified: any;
            mfaEnabled: any;
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
            id: any;
            email: any;
            name: any;
            role: any;
            centerId: any;
        };
        tempToken?: undefined;
        message?: undefined;
    }>;
    verifyMFA(tempToken: string, mfaCode: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            centerId: any;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    private validateUser;
    private generateTokens;
    private validateKolegiumId;
    private determineInitialRole;
}
