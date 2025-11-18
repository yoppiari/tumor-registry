export interface PatientData {
    id: string;
    name: string;
    nik: string;
    birthDate: string;
    phone: string;
    address: string;
}
export interface PrivacyResult {
    isCompliant: boolean;
    violations: string[];
    score: number;
    details: any;
}
export interface LeakageResult {
    hasLeakage: boolean;
    leakedFields: string[];
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    details: any;
}
export interface ComplianceResult {
    overallScore: number;
    auditTrailComplete: boolean;
    encryptionUsed: boolean;
    anonymizationApplied: boolean;
    violations: string[];
}
export declare class PrivacyValidator {
    private readonly logger;
    private readonly SENSITIVE_FIELDS;
    validateAnonymization(patientData: PatientData): Promise<PrivacyResult>;
    checkDataLeakage(query: string, centerId: string): Promise<LeakageResult>;
    auditAccessLogs(accessLogs: any[]): Promise<ComplianceResult>;
    private containsRealData;
    private containsValidNIK;
    private containsRealPhone;
    private containsRealAddress;
    private isReversibleAnonymization;
    private containsSensitiveFields;
    private extractSensitiveFields;
    private calculateSeverity;
    private hasCrossCenterJoin;
    private containsExportKeywords;
    private validateAuditTrail;
    private checkEncryptionUsage;
    private checkAnonymizationLogs;
    private checkUnauthorizedAccess;
}
