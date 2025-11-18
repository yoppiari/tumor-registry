import { ConsentService } from './consent.service';
import { ConsentType } from '@prisma/client';
export declare class ConsentController {
    private readonly consentService;
    constructor(consentService: ConsentService);
    createConsent(createConsentDto: {
        patientId: string;
        consentType: ConsentType;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    findByPatientId(patientId: string, consentType?: ConsentType, includeExpired?: string, page?: string, limit?: string): Promise<{
        consents: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStatistics(centerId?: string): Promise<any>;
    getExpiringConsents(days?: string, centerId?: string): Promise<any[]>;
    checkConsent(patientId: string, consentType: ConsentType, requireActive?: string): Promise<{
        hasConsent: boolean;
        consent?: any;
    }>;
    findById(id: string): Promise<any>;
    updateConsent(id: string, updateConsentDto: {
        description?: string;
        isConsented?: boolean;
        consentDate?: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    revokeConsent(id: string, reason: string): Promise<PatientConsent>;
    createTreatmentConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createSurgeryConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createAnesthesiaConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createBloodTransfusionConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createResearchConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createPhotographyConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createTelehealthConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
    createPrivacyConsent(createConsentDto: {
        patientId: string;
        description: string;
        isConsented: boolean;
        consentDate: string;
        expiredDate?: string;
        guardianName?: string;
        guardianRelation?: string;
        notes?: string;
    }): Promise<PatientConsent>;
}
