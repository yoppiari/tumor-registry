"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
        this.logger.log(`📧 Verification email would be sent to ${email}`);
        this.logger.log(`🔗 Verification URL: ${verificationUrl}`);
    }
    async sendWelcomeEmail(email, name, role) {
        this.logger.log(`📧 Welcome email would be sent to ${email}`);
        this.logger.log(`👤 Name: ${name}, Role: ${role}`);
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        this.logger.log(`📧 Password reset email would be sent to ${email}`);
        this.logger.log(`🔗 Reset URL: ${resetUrl}`);
    }
    async sendNotificationEmail(email, title, message) {
        this.logger.log(`📧 Notification email would be sent to ${email}`);
        this.logger.log(`📌 Title: ${title}`);
        this.logger.log(`📝 Message: ${message}`);
    }
    async sendReportEmail(email, reportName, filePath) {
        this.logger.log(`📧 Report email would be sent to ${email}`);
        this.logger.log(`📊 Report: ${reportName}`);
        this.logger.log(`📎 Attachment: ${filePath}`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map