import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    this.logger.log(`📧 Verification email would be sent to ${email}`);
    this.logger.log(`🔗 Verification URL: ${verificationUrl}`);

    // In development, we just log instead of sending actual emails
    // In production, integrate with an email service like SendGrid, AWS SES, etc.
  }

  async sendWelcomeEmail(email: string, name: string, role: string) {
    this.logger.log(`📧 Welcome email would be sent to ${email}`);
    this.logger.log(`👤 Name: ${name}, Role: ${role}`);

    // In production, send actual welcome email
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    this.logger.log(`📧 Password reset email would be sent to ${email}`);
    this.logger.log(`🔗 Reset URL: ${resetUrl}`);

    // In production, send actual password reset email
  }
}