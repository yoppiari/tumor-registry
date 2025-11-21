import { DiagnosisService } from './diagnosis.service';
import { DiagnosisType, DiagnosisSeverity, DiagnosisStatus } from '@prisma/client';
export declare class DiagnosisController {
    private readonly diagnosisService;
    constructor(diagnosisService: DiagnosisService);
    createDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: DiagnosisType;
        severity?: DiagnosisSeverity;
        status: DiagnosisStatus;
        onsetDate?: string;
        resolutionDate?: string;
        notes?: string;
        isPrimary?: boolean;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    searchDiagnoses(searchQuery: any): Promise<{
        diagnoses: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStatistics(centerId?: string, providerId?: string): Promise<any>;
    findByPatientId(patientId: string, diagnosisType?: DiagnosisType, status?: DiagnosisStatus, includeInactive?: string, page?: string, limit?: string): Promise<{
        diagnoses: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getActiveDiagnosesByPatient(patientId: string): Promise<any[]>;
    getPrimaryDiagnosesByPatient(patientId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    updateDiagnosis(id: string, updateDiagnosisDto: {
        diagnosisName?: string;
        severity?: DiagnosisSeverity;
        status?: DiagnosisStatus;
        onsetDate?: string;
        resolutionDate?: string;
        notes?: string;
        isPrimary?: boolean;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    resolveDiagnosis(id: string, resolveDto: {
        resolutionDate: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    createPrimaryCancerDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    createMetastasisDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    createComplicationDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    createAdmittingDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    createDischargeDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<{
        id: string;
        patientId: string;
        providerId: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: import(".prisma/client").$Enums.DiagnosisType;
        severity: import(".prisma/client").$Enums.DiagnosisSeverity | null;
        status: import(".prisma/client").$Enums.DiagnosisStatus;
        onsetDate: Date | null;
        resolutionDate: Date | null;
        isPrimary: boolean;
    }>;
    searchIcd10ByCategory(category: string): Promise<{
        category: string;
        description: any;
        note: string;
    }>;
    getIcd10Categories(): Promise<{
        categories: {
            code: string;
            name: string;
        }[];
        note: string;
    }>;
}
