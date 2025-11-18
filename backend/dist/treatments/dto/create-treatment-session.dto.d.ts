import { CreateClinicalTeamMemberDto } from './create-treatment-plan.dto';
export declare class CreateTreatmentSessionDto {
    treatmentPlanId: string;
    sessionDate: Date;
    modality: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';
    duration?: number;
    preAssessment: CreatePreSessionAssessmentDto;
    medications?: CreateSessionMedicationDto[];
    procedures?: CreateSessionProcedureDto[];
    performedBy: CreateClinicalTeamMemberDto;
    supervisedBy?: CreateClinicalTeamMemberDto;
}
export declare class CreatePreSessionAssessmentDto {
    vitalSigns: CreateVitalSignsDto;
    performanceStatus: CreatePerformanceStatusDto;
    symptoms?: CreateSymptomAssessmentDto[];
    labs?: CreateLabAssessmentDto[];
    clearance: 'cleared' | 'cleared_with_modifications' | 'delayed' | 'cancelled';
    clearanceNotes?: string;
    assessedBy: string;
}
export declare class CreateVitalSignsDto {
    bloodPressure: CreateBloodPressureDto;
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
    weight: number;
    height?: number;
    bmi?: number;
    oxygenSaturation?: number;
    painScore?: number;
}
export declare class CreateBloodPressureDto {
    systolic: number;
    diastolic: number;
}
export declare class CreatePerformanceStatusDto {
    scale: 'ECOG' | 'KARNOFSKY';
    score: number;
    description?: string;
}
export declare class CreateSymptomAssessmentDto {
    symptom: string;
    severity: number;
    duration?: string;
    impactOnActivities: 'none' | 'mild' | 'moderate' | 'severe';
    notes?: string;
}
export declare class CreateLabAssessmentDto {
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    date: Date;
}
export declare class CreateSessionMedicationDto {
    medicationName: string;
    dosage: string;
    route: string;
    administrationTime?: Date;
    administeredBy: string;
    notes?: string;
}
export declare class CreateSessionProcedureDto {
    procedureName: string;
    startTime: Date;
    endTime: Date;
    performedBy: string;
    complications?: string[];
    notes?: string;
}
