import { PrismaService } from '@/database/prisma.service';
import { PatientDiagnosis, DiagnosisType, DiagnosisSeverity, DiagnosisStatus } from '@prisma/client';
export declare class DiagnosisService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createDiagnosis(diagnosisData: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        diagnosisType: DiagnosisType;
        severity?: DiagnosisSeverity;
        status: DiagnosisStatus;
        onsetDate?: Date;
        resolutionDate?: Date;
        notes?: string;
        isPrimary?: boolean;
        providerId: string;
    }): Promise<PatientDiagnosis>;
    findByPatientId(patientId: string, diagnosisType?: DiagnosisType, status?: DiagnosisStatus, includeInactive?: boolean, page?: number, limit?: number): Promise<{
        diagnoses: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    updateDiagnosis(id: string, updateData: {
        diagnosisName?: string;
        severity?: DiagnosisSeverity;
        status?: DiagnosisStatus;
        onsetDate?: Date;
        resolutionDate?: Date;
        notes?: string;
        isPrimary?: boolean;
    }, providerId: string): Promise<PatientDiagnosis>;
    resolveDiagnosis(id: string, resolutionDate: Date, notes?: string): Promise<PatientDiagnosis>;
    getDiagnosisStatistics(centerId?: string, providerId?: string): Promise<any>;
    searchDiagnoses(query: {
        search?: string;
        patientId?: string;
        providerId?: string;
        diagnosisType?: DiagnosisType;
        severity?: DiagnosisSeverity;
        status?: DiagnosisStatus;
        isPrimary?: boolean;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        diagnoses: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getActiveDiagnosesByPatient(patientId: string): Promise<any[]>;
    getPrimaryDiagnosesByPatient(patientId: string): Promise<any[]>;
    private validateIcd10Code;
    private unmarkPrimaryDiagnoses;
    private calculateDiagnosisDuration;
    private calculatePatientAge;
    private getIcd10Category;
    private getDiagnosesByTypeStatistics;
    private getDiagnosesBySeverityStatistics;
    private getTopDiagnoses;
    private getDiagnosesByMonthStatistics;
}
