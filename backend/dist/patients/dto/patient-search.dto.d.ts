export declare class PatientSearchDto {
    query?: string;
    medicalRecordNumber?: string;
    identityNumber?: string;
    name?: string;
    phone?: string;
    cancerStage?: 'I' | 'II' | 'III' | 'IV';
    treatmentStatus?: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
    primarySite?: string;
    treatmentCenter?: string;
    dateOfBirthFrom?: string;
    dateOfBirthTo?: string;
    dateOfDiagnosisFrom?: string;
    dateOfDiagnosisTo?: string;
    isDeceased?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'createdAt' | 'dateOfDiagnosis' | 'lastVisitDate';
    sortOrder?: 'asc' | 'desc';
}
