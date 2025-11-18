import { PrismaService } from '@/database/prisma.service';
import { PatientConsent, ConsentType } from '@prisma/client';
export declare class ConsentService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createConsent(consentData: {
        patientId: string;
        consentType: ConsentType;
        description: string;
        isConsented: boolean;
        consentDate: Date;
        expiredDate?: Date;
        guardianName?: string;
        guardianRelation?: string;
        providerId: string;
        notes?: string;
    }): Promise<PatientConsent>;
    findByPatientId(patientId: string, consentType?: ConsentType, includeExpired?: boolean, page?: number, limit?: number): Promise<{
        consents: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    updateConsent(id: string, updateData: {
        description?: string;
        isConsented?: boolean;
        consentDate?: Date;
        expiredDate?: Date;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }, providerId: string): Promise<PatientConsent>;
    revokeConsent(id: string, reason: string, providerId: string): Promise<PatientConsent>;
    checkConsent(patientId: string, consentType: ConsentType, requireActive?: boolean): Promise<{
        hasConsent: boolean;
        consent?: any;
    }>;
    getConsentStatistics(centerId?: string): Promise<any>;
    getExpiringConsents(days?: number, centerId?: string): Promise<any[]>;
    private validateConsentRequirements;
    private isConsentActive;
    private calculateAge;
    private requiresGuardian;
    private getActiveConsentsCount;
    private getExpiredConsentsCount;
    private getConsentsByTypeStatistics;
    private getConsentsByMonthStatistics;
    private getGuardianRequiredConsentsCount;
}
