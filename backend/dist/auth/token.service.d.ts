import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class TokenService {
    private readonly nestJwtService;
    private readonly configService;
    constructor(nestJwtService: NestJwtService, configService: ConfigService);
    generateAccessToken(payload: JwtPayload): string;
    generateRefreshToken(payload: JwtPayload): string;
    verifyAccessToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
    decodeToken(token: string): any;
    generateTokenPair(user: any, centerId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
