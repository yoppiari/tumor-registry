export declare class EmailService {
    private readonly logger;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string, role: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
