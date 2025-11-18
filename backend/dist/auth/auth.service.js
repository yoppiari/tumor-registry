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
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const token_service_1 = require("./token.service");
const email_service_1 = require("./services/email.service");
let AuthService = class AuthService {
    constructor(configService, tokenService, emailService) {
        this.configService = configService;
        this.tokenService = tokenService;
        this.emailService = emailService;
        this.users = [
            {
                id: '00000000-0000-0000-0000-000000000001',
                email: 'admin@inamsos.id',
                passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
                name: 'System Administrator',
                role: 'national_stakeholder',
                centerId: '00000000-0000-0000-0000-000000000001',
                is_active: true,
                email_verified: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '00000000-0000-0000-0000-000000000002',
                email: 'dataentry@rscm.co.id',
                passwordHash: '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iKVjzieMwkOmANgNOgKQNNBDvAGK',
                name: 'Dr. Ahmad Wijaya',
                role: 'data_entry',
                centerId: '00000000-0000-0000-0000-000000000001',
                is_active: true,
                email_verified: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];
        this.emailVerificationTokens = [];
    }
    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async validateUser(email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user || !user.is_active) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        if (!user.email_verified) {
            throw new common_1.UnauthorizedException('Silakan verifikasi email Anda terlebih dahulu');
        }
        const tokens = await this.tokenService.generateTokenPair(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                centerId: user.centerId,
                email_verified: user.email_verified,
            },
            ...tokens,
        };
    }
    async register(registerDto) {
        const existingUser = this.users.find(u => u.email === registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const newUser = {
            id: `user_${Date.now()}`,
            email: registerDto.email,
            passwordHash,
            name: registerDto.name,
            role: registerDto.role,
            centerId: registerDto.centerId,
            is_active: true,
            email_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.users.push(newUser);
        const verificationToken = this.generateVerificationToken();
        const emailToken = {
            token: verificationToken,
            userId: newUser.id,
            email: newUser.email,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isUsed: false,
            createdAt: new Date(),
        };
        this.emailVerificationTokens.push(emailToken);
        try {
            await this.emailService.sendVerificationEmail(newUser.email, verificationToken);
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
        }
        const tokens = await this.tokenService.generateTokenPair(newUser);
        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                centerId: newUser.centerId,
                email_verified: newUser.email_verified,
            },
            ...tokens,
            message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
        };
    }
    async refreshToken(refreshTokenDto) {
        try {
            const payload = this.tokenService.verifyRefreshToken(refreshTokenDto.refreshToken);
            const user = this.users.find(u => u.id === payload.sub);
            if (!user || !user.is_active) {
                throw new common_1.UnauthorizedException('User tidak ditemukan atau tidak aktif');
            }
            const tokens = await this.tokenService.generateTokenPair(user);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    centerId: user.centerId,
                    email_verified: user.email_verified,
                },
                ...tokens,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token invalid atau expired');
        }
    }
    async logout(userId) {
        return { message: 'Logout successful' };
    }
    async verifyEmail(token) {
        const verificationToken = this.emailVerificationTokens.find(vt => vt.token === token && !vt.isUsed && vt.expiresAt > new Date());
        if (!verificationToken) {
            throw new common_1.BadRequestException('Token verifikasi invalid atau sudah kadaluarsa');
        }
        const user = this.users.find(u => u.id === verificationToken.userId);
        if (!user) {
            throw new common_1.BadRequestException('User tidak ditemukan');
        }
        verificationToken.isUsed = true;
        user.email_verified = true;
        user.updated_at = new Date();
        return {
            message: 'Email berhasil diverifikasi. Sekarang Anda dapat login.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                email_verified: user.email_verified,
            }
        };
    }
    async resendVerificationEmail(email) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new common_1.BadRequestException('Email tidak terdaftar');
        }
        if (user.email_verified) {
            throw new common_1.BadRequestException('Email sudah terverifikasi');
        }
        this.emailVerificationTokens
            .filter(vt => vt.email === email && !vt.isUsed)
            .forEach(vt => {
            vt.isUsed = true;
        });
        const verificationToken = this.generateVerificationToken();
        const emailToken = {
            token: verificationToken,
            userId: user.id,
            email: user.email,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isUsed: false,
            createdAt: new Date(),
        };
        this.emailVerificationTokens.push(emailToken);
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
        return {
            message: 'Email verifikasi telah dikirim ulang. Silakan cek inbox Anda.'
        };
    }
    async getCurrentUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User tidak ditemukan');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            centerId: user.centerId,
            email_verified: user.email_verified,
            is_active: user.is_active,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        token_service_1.TokenService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map