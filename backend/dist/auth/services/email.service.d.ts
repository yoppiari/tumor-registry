import { ConfigService } from '@nestjs/config';
import { EmailOptions } from '../interfaces/email.interface';
export declare class EmailService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendVerificationEmail(email: string, verificationToken: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>;
}
