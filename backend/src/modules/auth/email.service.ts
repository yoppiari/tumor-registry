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

  async sendNotificationEmail(email: string, title: string, message: string) {
    this.logger.log(`📧 Notification email would be sent to ${email}`);
    this.logger.log(`📌 Title: ${title}`);
    this.logger.log(`📝 Message: ${message}`);

    // In production, send actual notification email
  }

  async sendReportEmail(email: string, reportName: string, filePath: string) {
    this.logger.log(`📧 Report email would be sent to ${email}`);
    this.logger.log(`📊 Report: ${reportName}`);
    this.logger.log(`📎 Attachment: ${filePath}`);

    // In production, send actual report email with attachment
  }
}