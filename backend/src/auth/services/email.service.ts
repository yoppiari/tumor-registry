import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailOptions } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Mock email service - di production akan menggunakan service seperti SendGrid, AWS SES, atau Nodemailer
    console.log('📧 [MOCK] Sending email:', {
      to: options.to,
      subject: options.subject,
      template: options.template,
      data: options.data,
      timestamp: new Date().toISOString(),
    });

    // Simulasi email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock selalu berhasil
    return true;
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/verify-email?token=${verificationToken}`;

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

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;

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
}