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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
    }
    async sendEmail(options) {
        console.log('📧 [MOCK] Sending email:', {
            to: options.to,
            subject: options.subject,
            template: options.template,
            data: options.data,
            timestamp: new Date().toISOString(),
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    }
    async sendVerificationEmail(email, verificationToken) {
        const verificationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token=${verificationToken}`;
        return this.sendEmail({
            to: email,
            subject: 'Verifikasi Email INAMSOS Anda',
            template: 'verification',
            data: {
                verificationUrl,
                email,
                expiresIn: '24 jam',
            },
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: email,
            subject: 'Reset Password INAMSOS Anda',
            template: 'reset_password',
            data: {
                resetUrl,
                email,
                expiresIn: '1 jam',
            },
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map