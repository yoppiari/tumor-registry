export declare class QuickPatientEntryDto {
    name: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
    medicalRecordNumber?: string;
    primarySite?: string;
    cancerStage?: 'I' | 'II' | 'III' | 'IV';
    treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative';
}
export declare class ChatMessageDto {
    content: string;
    fieldName?: string;
    sessionId?: string;
}
export declare class PatientEntrySessionDto {
    sessionId: string;
    patientId?: string;
    status?: 'in_progress' | 'completed' | 'abandoned';
    currentStep?: number;
}
