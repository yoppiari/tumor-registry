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
    }): Promise<PatientDiagnosis>;
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
    }): Promise<PatientDiagnosis>;
    resolveDiagnosis(id: string, resolveDto: {
        resolutionDate: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
    createPrimaryCancerDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
    createMetastasisDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
    createComplicationDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
    createAdmittingDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
    createDischargeDiagnosis(createDiagnosisDto: {
        patientId: string;
        diagnosisCode: string;
        diagnosisName: string;
        severity?: DiagnosisSeverity;
        onsetDate?: string;
        notes?: string;
    }): Promise<PatientDiagnosis>;
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
