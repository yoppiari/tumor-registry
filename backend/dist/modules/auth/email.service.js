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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'localhost',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const mailOptions = {
            from: `"INAMSOS" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Email Verification - INAMSOS',
            html: `
        <h2>Selamat Datang di INAMSOS</h2>
        <p>Terima kasih telah mendaftar di Indonesia National Cancer Database System.</p>
        <p>Silakan klik link berikut untuk verifikasi email Anda:</p>
        <a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Verifikasi Email
        </a>
        <p>Link ini akan kadaluarsa dalam 24 jam.</p>
        <p>Jika Anda tidak merasa mendaftar, silakan abaikan email ini.</p>
        <br>
        <p>Terima kasih,<br>Tim INAMSOS</p>
      `,
        };
        try {
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification email sent to ${email}: ${result.messageId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${email}`, error);
            throw error;
        }
    }
    async sendWelcomeEmail(email, name, role) {
        const mailOptions = {
            from: `"INAMSOS" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Selamat Datang di INAMSOS - Akun Anda Sudah Aktif',
            html: `
        <h2>Selamat Datang di INAMSOS, ${name}!</h2>
        <p>Account Anda telah berhasil diverifikasi dan sekarang aktif.</p>
        <p><strong>Peran Anda:</strong> ${role}</p>
        <p>Silakan login ke dashboard untuk memulai penggunaan sistem:</p>
        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Login ke Dashboard
        </a>
        <br><br>
        <p>Informasi kontak:<br>
        Email: support@inamsos.go.id<br>
        Website: https://inamsos.go.id
        </p>
        <br>
        <p>Terima kasih,<br>Tim INAMSOS</p>
      `,
        };
        try {
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Welcome email sent to ${email}: ${result.messageId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}`, error);
        }
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailOptions = {
            from: `"INAMSOS" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Reset Password - INAMSOS',
            html: `
        <h2>Reset Password - INAMSOS</h2>
        <p>Anda menerima permintaan untuk reset password akun INAMSOS Anda.</p>
        <p>Silakan klik link berikut untuk reset password:</p>
        <a href="${resetUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, silakan abaikan email ini.</p>
        <br>
        <p>Terima kasih,<br>Tim INAMSOS</p>
      `,
        };
        try {
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Password reset email sent to ${email}: ${result.messageId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}`, error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map