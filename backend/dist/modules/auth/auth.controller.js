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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_guard_1 = require("./guards/jwt.guard");
const mfa_service_1 = require("./mfa.service");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService, mfaService) {
        this.authService = authService;
        this.mfaService = mfaService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyMFA(tempToken, mfaCode) {
        return this.authService.verifyMFA(tempToken, mfaCode);
    }
    async verifyEmail(token) {
        return this.authService.verifyEmail(token);
    }
    async refreshToken(refreshToken) {
        return this.authService.refreshToken(refreshToken);
    }
    async getProfile(req) {
        return req.user;
    }
    async logout(req) {
        return { message: 'Logged out successfully' };
    }
    async setupMfa(req) {
        const user = req.user;
        return await this.mfaService.generateSecret(user.id);
    }
    async enableMfa(req, secret, token) {
        const user = req.user;
        return await this.mfaService.enableMfa(user.id, secret, token);
    }
    async disableMfa(req, password, token) {
        const user = req.user;
        await this.mfaService.disableMfa(user.id, password, token);
        return { message: 'MFA disabled successfully' };
    }
    async verifyMfaToken(req, token) {
        const user = req.user;
        const isValid = await this.mfaService.verifyToken(user.id, token);
        return { valid: isValid };
    }
    async regenerateBackupCodes(req, token) {
        const user = req.user;
        const backupCodes = await this.mfaService.regenerateBackupCodes(user.id, token);
        return { backupCodes };
    }
    async verifyBackupCode(req, backupCode) {
        const user = req.user;
        const isValid = await this.mfaService.verifyBackupCode(user.id, backupCode);
        return { valid: isValid };
    }
    async getMfaStatus(req) {
        const user = req.user;
        const isRequired = await this.mfaService.isMfaRequired(user.id);
        return {
            mfaEnabled: user.mfaEnabled,
            mfaRequired: isRequired,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-mfa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('tempToken')),
    __param(1, (0, common_1.Body)('mfaCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMFA", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('mfa/setup'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Generate MFA secret and QR code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MFA secret generated successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupMfa", null);
__decorate([
    (0, common_1.Post)('mfa/enable'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Enable MFA with verification code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MFA enabled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid verification code' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('secret')),
    __param(2, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableMfa", null);
__decorate([
    (0, common_1.Post)('mfa/disable'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Disable MFA' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MFA disabled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid verification code or password' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableMfa", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify MFA token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MFA token verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid MFA token' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfaToken", null);
__decorate([
    (0, common_1.Post)('mfa/backup-codes/regenerate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Regenerate backup codes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup codes regenerated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid verification code' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "regenerateBackupCodes", null);
__decorate([
    (0, common_1.Post)('mfa/backup-codes/verify'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify backup code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup code verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid backup code' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('backupCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyBackupCode", null);
__decorate([
    (0, common_1.Get)('mfa/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get MFA status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MFA status retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMfaStatus", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mfa_service_1.MfaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map