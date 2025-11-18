export declare class UpdateTreatmentPlanDto {
    planName?: string;
    expectedEndDate?: Date;
    totalCycles?: number;
    status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';
    phase?: 'initial' | 'consolidation' | 'maintenance' | 'follow_up';
    actualEndDate?: Date;
    responseAssessment?: UpdateResponseAssessmentDto;
}
export declare class UpdateResponseAssessmentDto {
    assessmentDate?: Date;
    responseCriteria?: 'RECIST_1.1' | 'WHO' | 'PERCIST' | 'clinical';
    overallResponse?: 'CR' | 'PR' | 'SD' | 'PD';
    targetLesionResponse?: string;
    nonTargetLesionResponse?: string;
    newLesions?: boolean;
    progressionDate?: Date;
    notes?: string;
    assessedBy?: string;
}
