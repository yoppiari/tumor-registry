import { PrismaService } from '@/common/database/prisma.service';
export declare class MfaService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateSecret(userId: string): Promise<{
        secret: string;
        manualEntryKey: string;
    }>;
    verifyToken(userId: string, token: string): Promise<boolean>;
    enableMfa(userId: string, secret: string, token: string): Promise<{
        success: boolean;
        backupCodes: string[];
    }>;
    disableMfa(userId: string, password: string, token?: string): Promise<boolean>;
    verifyBackupCode(userId: string, backupCode: string): Promise<boolean>;
    private generateBackupCodes;
    isMfaRequired(userId: string): Promise<boolean>;
    regenerateBackupCodes(userId: string, token: string): Promise<string[]>;
}
