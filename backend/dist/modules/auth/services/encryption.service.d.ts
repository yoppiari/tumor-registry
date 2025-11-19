import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private readonly configService;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly tagLength;
    private readonly encryptionKey;
    private readonly hashKey;
    constructor(configService: ConfigService);
    encryptSensitiveData(data: string): {
        encrypted: string;
        iv: string;
        tag: string;
    };
    decryptSensitiveData(encryptedData: {
        encrypted: string;
        iv: string;
        tag: string;
    }): string;
    hashSensitiveData(data: string, salt?: string): {
        hash: string;
        salt: string;
    };
    verifyHashedData(data: string, hash: string, salt: string): boolean;
    generateSecureToken(length?: number): string;
    encryptPHI(data: any): string;
    decryptPHI(encryptedData: string): any;
    anonymizePatientData(patientData: any): any;
    generateAccessFingerprint(userId: string, resourceType: string, resourceId: string): string;
    validateDataIntegrity(data: string, expectedHmac: string): boolean;
    generateDataHmac(data: string): string;
    encryptBulkData(data: any[]): string;
    decryptBulkData(encryptedData: string): any[];
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generateTenantKey(tenantId: string): Buffer;
    encryptTenantData(data: string, tenantId: string): {
        encrypted: string;
        iv: string;
        tag: string;
    };
    decryptTenantData(encryptedData: {
        encrypted: string;
        iv: string;
        tag: string;
    }, tenantId: string): string;
    rotateKey(newMasterKey: string): void;
}
