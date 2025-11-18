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
var MfaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
let MfaService = MfaService_1 = class MfaService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MfaService_1.name);
    }
    async generateSecret(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    center: true,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const secret = speakeasy.generateSecret({
                name: `INAMSOS (${user.email})`,
                issuer: 'INAMSOS - Indonesia National Cancer Database',
                length: 32,
            });
            const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
            this.logger.log(`MFA secret generated for user ${user.email}`);
            return {
                secret: secret.base32,
                qrCode: qrCodeUrl,
            };
        }
        catch (error) {
            this.logger.error(`Error generating MFA secret for user ${userId}`, error);
            throw error;
        }
    }
    async verifyToken(userId, token) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.mfaSecret) {
                throw new common_1.NotFoundException('MFA not set up for user');
            }
            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token,
                window: 2,
            });
            if (!verified) {
                this.logger.warn(`Invalid MFA token for user ${user.email}`);
            }
            return verified;
        }
        catch (error) {
            this.logger.error(`Error verifying MFA token for user ${userId}`, error);
            throw error;
        }
    }
    async enableMfa(userId, secret, token) {
        try {
            const verified = speakeasy.totp.verify({
                secret,
                encoding: 'base32',
                token,
                window: 2,
            });
            if (!verified) {
                throw new common_1.BadRequestException('Invalid verification token');
            }
            const backupCodes = await this.generateBackupCodes();
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaSecret: secret,
                    mfaEnabled: true,
                },
            });
            this.logger.log(`MFA enabled for user ${userId}`);
            return {
                success: true,
                backupCodes,
            };
        }
        catch (error) {
            this.logger.error(`Error enabling MFA for user ${userId}`, error);
            throw error;
        }
    }
    async disableMfa(userId, password, token) {
        try {
            if (token) {
                const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (user?.mfaSecret) {
                    const verified = speakeasy.totp.verify({
                        secret: user.mfaSecret,
                        encoding: 'base32',
                        token,
                        window: 2,
                    });
                    if (!verified) {
                        throw new common_1.BadRequestException('Invalid verification token');
                    }
                }
            }
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    mfaSecret: null,
                    mfaEnabled: false,
                },
            });
            this.logger.log(`MFA disabled for user ${userId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error disabling MFA for user ${userId}`, error);
            throw error;
        }
    }
    async verifyBackupCode(userId, backupCode) {
        try {
            return false;
        }
        catch (error) {
            this.logger.error(`Error verifying backup code for user ${userId}`, error);
            throw error;
        }
    }
    async generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase());
        }
        return codes;
    }
    async isMfaRequired(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    mfaEnabled: true,
                    lastLoginAt: true,
                },
            });
            if (!user || !user.mfaEnabled) {
                return false;
            }
            const timeSinceLastLogin = user.lastLoginAt
                ? Date.now() - user.lastLoginAt.getTime()
                : Infinity;
            return timeSinceLastLogin > 24 * 60 * 60 * 1000;
        }
        catch (error) {
            this.logger.error(`Error checking MFA requirement for user ${userId}`, error);
            return false;
        }
    }
    async regenerateBackupCodes(userId, token) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.mfaSecret) {
                throw new common_1.NotFoundException('MFA not set up for user');
            }
            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token,
                window: 2,
            });
            if (!verified) {
                throw new common_1.BadRequestException('Invalid verification token');
            }
            const backupCodes = await this.generateBackupCodes();
            this.logger.log(`Backup codes regenerated for user ${userId}`);
            return backupCodes;
        }
        catch (error) {
            this.logger.error(`Error regenerating backup codes for user ${userId}`, error);
            throw error;
        }
    }
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = MfaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map