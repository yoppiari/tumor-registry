export declare class EmailService {
    private readonly logger;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string, role: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendNotificationEmail(email: string, title: string, message: string): Promise<void>;
    sendReportEmail(email: string, reportName: string, filePath: string): Promise<void>;
}
