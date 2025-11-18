export declare class SearchTreatmentDto {
    patientId?: string;
    status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';
    modality?: string;
    intent?: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';
    primaryOncologist?: string;
    primaryCancerSite?: string;
    cancerStage?: string;
    protocolCategory?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    dateRange?: {
        startDate: Date;
        endDate: Date;
    };
}
export declare class CreateMedicalRecordDto {
    patientId: string;
    recordType: 'progress_note' | 'consultation' | 'discharge_summary' | 'procedure_note' | 'imaging_report' | 'lab_report' | 'pathology_report';
    title: string;
    content: string;
    summary?: string;
    serviceType: string;
    department: string;
    encounterType: 'outpatient' | 'inpatient' | 'emergency' | 'day_care';
    primaryProvider: any;
    consultingProviders?: any[];
    serviceDate: Date;
    documentationDate?: Date;
    diagnosis?: any[];
    medications?: any[];
    procedures?: any[];
    vitals?: any;
    labs?: any[];
    imaging?: any[];
    assessment: string;
    plan: string;
    followUp?: any;
}
export declare class GenerateReportDto {
    reportType: 'treatment_summary' | 'progress_report' | 'outcome_analysis' | 'quality_metrics' | 'adverse_events';
    title: string;
    description?: string;
    patientIds?: string[];
    treatmentPlanIds?: string[];
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    parameters?: any;
    format?: 'json' | 'pdf' | 'excel' | 'csv';
}
