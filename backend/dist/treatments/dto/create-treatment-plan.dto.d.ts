export declare class CreateTreatmentPlanDto {
    planName: string;
    planCode: string;
    patientId: string;
    primaryCancerSite: string;
    cancerStage: string;
    histology?: string;
    modalities: CreateTreatmentModalityDto[];
    intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';
    protocolId?: string;
    protocolName?: string;
    protocolVersion?: string;
    protocolCategory?: 'standard' | 'clinical_trial' | 'modified' | 'compassionate_use';
    primaryOncologist: CreateClinicalTeamMemberDto;
    multidisciplinaryTeam?: CreateClinicalTeamMemberDto[];
    startDate: Date;
    expectedEndDate?: Date;
    totalCycles?: number;
    baselineAssessment: CreateBaselineAssessmentDto;
}
export declare class CreateTreatmentModalityDto {
    type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';
    name: string;
    priority: 'primary' | 'secondary' | 'adjuvant';
    sequence?: number;
    description?: string;
    settings?: CreateModalitySettingsDto;
}
export declare class CreateModalitySettingsDto {
    surgeryType?: string;
    surgicalApproach?: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic';
    plannedDate?: Date;
    regimen?: string;
    cycleLength?: number;
    numberOfCycles?: number;
    technique?: string;
    dose?: number;
    fractions?: number;
    targetVolume?: string;
    agent?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
}
export declare class CreateClinicalTeamMemberDto {
    userId: string;
    name: string;
    role: 'medical_oncologist' | 'radiation_oncologist' | 'surgical_oncologist' | 'pathologist' | 'radiologist' | 'nurse' | 'pharmacist' | 'nutritionist' | 'social_worker' | 'palliative_care';
    department: string;
    institution: string;
    email?: string;
    phone?: string;
    isPrimary?: boolean;
}
export declare class CreateBaselineAssessmentDto {
    date: Date;
    diseaseAssessment: CreateDiseaseAssessmentDto;
    laboratoryValues?: CreateLabValueDto[];
    imagingStudies?: CreateImagingStudyDto[];
    functionalStatus: CreateFunctionalStatusDto;
    comorbidities?: CreateComorbidityDto[];
}
export declare class CreateDiseaseAssessmentDto {
    lesionMeasurements: CreateLesionMeasurementDto[];
    diseaseBurden: 'minimal' | 'moderate' | 'extensive';
    biomarkers?: CreateBiomarkerResultDto[];
    date: Date;
    assessmentMethod: 'RECIST' | 'WHO' | 'PERCIST' | 'clinical';
}
export declare class CreateLesionMeasurementDto {
    site: string;
    lesionType: 'target' | 'non_target' | 'new';
    baselineSize: number;
    measurementMethod: 'CT' | 'MRI' | 'PET' | 'clinical' | 'ultrasound';
    notes?: string;
}
export declare class CreateLabValueDto {
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
    category: 'hematology' | 'chemistry' | 'tumor_marker' | 'hormone' | 'other';
    date: Date;
}
export declare class CreateImagingStudyDto {
    studyType: string;
    date: Date;
    findings: string;
    impression?: string;
    radiologist?: string;
    reportUrl?: string;
}
export declare class CreateFunctionalStatusDto {
    adlScore: number;
    iadlScore: number;
    nutritionalStatus: 'well_nourished' | 'moderately_malnourished' | 'severely_malnourished';
    performanceScore: number;
}
export declare class CreateComorbidityDto {
    condition: string;
    severity: 'mild' | 'moderate' | 'severe';
    controlled: boolean;
    treatment: string;
    impactOnCancerTreatment: 'none' | 'minimal' | 'moderate' | 'significant';
}
export declare class CreateBiomarkerResultDto {
    markerName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    interpretation?: string;
    date: Date;
    assayMethod?: string;
}
