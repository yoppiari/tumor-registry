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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("./email.service");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = require("bcrypt");
const speakeasy_1 = require("speakeasy");
let AuthService = class AuthService {
    constructor(usersService, jwtService, emailService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.prisma = prisma;
    }
    async register(registerDto) {
        const { email, name, kolegiumId, password, phone, nik } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (kolegiumId) {
            const isValidKolegium = await this.validateKolegiumId(kolegiumId);
            if (!isValidKolegium) {
                throw new common_1.BadRequestException('Invalid kolegium ID');
            }
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const initialRole = this.determineInitialRole(kolegiumId);
        const user = await this.usersService.create({
            email,
            name,
            kolegiumId,
            passwordHash,
            phone,
            nik,
            role: initialRole,
        });
        const verificationToken = this.jwtService.sign({ userId: user.id, email: user.email }, { expiresIn: '24h' });
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        const mfaSecret = speakeasy_1.speakeasy.generateSecret({
            name: `INAMSOS (${user.email})`,
            issuer: 'INAMSOS',
        });
        await this.usersService.update(user.id, { mfaSecret: mfaSecret.base32 });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isActive: user.isActive,
                isEmailVerified: user.isEmailVerified,
                mfaEnabled: user.mfaEnabled,
                role: initialRole,
            },
            message: 'User registered successfully. Please check your email for verification.',
            verificationToken,
            mfaSecret: mfaSecret.base32,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        if (user.mfaEnabled) {
            const tempToken = this.jwtService.sign({ userId: user.id, requireMFA: true }, { expiresIn: '5m' });
            return {
                requireMFA: true,
                tempToken,
                message: 'MFA code required',
            };
        }
        const tokens = await this.generateTokens(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: await this.usersService.getUserRole(user.id),
                centerId: user.centerId,
            },
            ...tokens,
            requireMFA: false,
        };
    }
    async verifyMFA(tempToken, mfaCode) {
        try {
            const payload = this.jwtService.verify(tempToken);
            if (!payload.requireMFA) {
                throw new common_1.BadRequestException('Invalid MFA request');
            }
            const user = await this.usersService.findById(payload.userId);
            if (!user || !user.mfaSecret) {
                throw new common_1.UnauthorizedException('User not found or MFA not configured');
            }
            const verified = speakeasy_1.speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaCode,
                window: 2,
            });
            if (!verified) {
                throw new common_1.UnauthorizedException('Invalid MFA code');
            }
            const tokens = await this.generateTokens(user);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: await this.usersService.getUserRole(user.id),
                    centerId: user.centerId,
                },
                ...tokens,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired MFA request');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.userId);
            if (!user) {
                throw new common_1.BadRequestException('Invalid verification token');
            }
            if (user.email === payload.email) {
                await this.usersService.update(user.id, { isEmailVerified: true });
                await this.emailService.sendWelcomeEmail(user.email, user.name, await this.usersService.getUserRole(user.id));
                return { message: 'Email verified successfully' };
            }
            else {
                throw new common_1.BadRequestException('Email mismatch');
            }
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            });
            const user = await this.usersService.findById(payload.userId);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const storedToken = await this.prisma.refreshToken.findFirst({
                where: {
                    userId: user.id,
                    token: refreshToken,
                    expiresAt: { gt: new Date() },
                    isRevoked: false,
                },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Refresh token not found or expired');
            }
            const tokens = await this.generateTokens(user);
            await this.prisma.refreshToken.update({
                where: { id: storedToken.id },
                data: { isRevoked: true },
            });
            await this.storeRefreshToken(user.id, tokens.refreshToken);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async validateRefreshToken(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.isActive) {
            return null;
        }
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId,
                token: refreshToken,
                expiresAt: { gt: new Date() },
                isRevoked: false,
            },
        });
        return storedToken ? user : null;
    }
    async logout(userId, refreshToken) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                isRevoked: false,
            },
            data: { isRevoked: true },
        });
        return { message: 'Logged out successfully' };
    }
    async revokeAllUserTokens(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true },
        });
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        return user;
    }
    async generateTokens(user) {
        const userRole = await this.usersService.getUserRole(user.id);
        const userPermissions = await this.usersService.getUserPermissions(user.id);
        const payload = {
            sub: user.id,
            email: user.email,
            role: userRole,
            permissions: userPermissions,
            centerId: user.centerId,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        });
        const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email }, {
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        });
        await this.storeRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt,
            },
        });
    }
    async validateKolegiumId(kolegiumId) {
        return kolegiumId && kolegiumId.length >= 10;
    }
    determineInitialRole(kolegiumId) {
        if (!kolegiumId) {
            return 'STAFF';
        }
        if (kolegiumId.startsWith('ADMIN')) {
            return 'NATIONAL_ADMIN';
        }
        else if (kolegiumId.startsWith('CENTER')) {
            return 'CENTER_ADMIN';
        }
        else if (kolegiumId.startsWith('RESEARCH')) {
            return 'RESEARCHER';
        }
        else {
            return 'DATA_ENTRY';
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map