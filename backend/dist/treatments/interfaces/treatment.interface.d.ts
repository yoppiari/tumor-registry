import { Patient } from '../patients/interfaces/patient.interface';
export interface TreatmentPlan {
    id: string;
    patientId: string;
    patient?: Patient;
    planName: string;
    planCode: string;
    primaryCancerSite: string;
    cancerStage: string;
    histology?: string;
    modalities: TreatmentModality[];
    intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';
    protocol?: TreatmentProtocol;
    protocolName?: string;
    protocolVersion?: string;
    protocolCategory?: 'standard' | 'clinical_trial' | 'modified' | 'compassionate_use';
    primaryOncologist: ClinicalTeamMember;
    multidisciplinaryTeam: ClinicalTeamMember[];
    startDate: Date;
    expectedEndDate?: Date;
    actualEndDate?: Date;
    totalCycles?: number;
    completedCycles?: number;
    status: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';
    phase: 'initial' | 'consolidation' | 'maintenance' | 'follow_up';
    adherence: TreatmentAdherence;
    baselineAssessment: BaselineAssessment;
    responseAssessment?: ResponseAssessment;
    toxicities?: TreatmentToxicity[];
    isActive: boolean;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TreatmentModality {
    id: string;
    type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';
    name: string;
    priority: 'primary' | 'secondary' | 'adjuvant';
    sequence?: number;
    description?: string;
    settings?: ModalitySettings;
}
export interface ModalitySettings {
    surgeryType?: string;
    surgicalApproach?: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic';
    plannedDate?: Date;
    regimen?: string;
    cycleLength: number;
    numberOfCycles: number;
    doseModifications?: DoseModification[];
    technique?: string;
    dose?: number;
    fractions?: number;
    targetVolume?: string;
    agent?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
}
export interface DoseModification {
    cycle: number;
    reason: string;
    originalDose: number;
    modifiedDose: number;
    percentage: number;
    date: Date;
    modifiedBy: string;
}
export interface TreatmentProtocol {
    id: string;
    name: string;
    code: string;
    version: string;
    category: 'standard' | 'clinical_trial' | 'modified' | 'compassionate_use';
    cancerType: string;
    stage: string;
    lineOfTherapy: number;
    description?: string;
    eligibility: string[];
    exclusion: string[];
    regimen: ProtocolRegimen[];
    expectedDuration: number;
    evidenceLevel?: string;
    references?: string[];
}
export interface ProtocolRegimen {
    modality: string;
    agent: string;
    dosage: string;
    route: string;
    schedule: string;
    day: string;
    duration?: string;
}
export interface ClinicalTeamMember {
    id: string;
    userId: string;
    name: string;
    role: 'medical_oncologist' | 'radiation_oncologist' | 'surgical_oncologist' | 'pathologist' | 'radiologist' | 'nurse' | 'pharmacist' | 'nutritionist' | 'social_worker' | 'palliative_care';
    department: string;
    institution: string;
    email?: string;
    phone?: string;
    isActive: boolean;
    isPrimary?: boolean;
}
export interface TreatmentSession {
    id: string;
    treatmentPlanId: string;
    treatmentPlan?: TreatmentPlan;
    sessionNumber: number;
    sessionDate: Date;
    modality: string;
    duration: number;
    preAssessment: PreSessionAssessment;
    postAssessment?: PostSessionAssessment;
    medications: SessionMedication[];
    procedures: SessionProcedure[];
    performedBy: ClinicalTeamMember;
    supervisedBy?: ClinicalTeamMember;
    complications?: string[];
    nursingNotes?: string;
    physicianNotes?: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed' | 'postponed';
    cancellationReason?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PreSessionAssessment {
    vitalSigns: VitalSigns;
    performanceStatus: PerformanceStatus;
    symptoms: SymptomAssessment[];
    labs: LabAssessment[];
    clearance: 'cleared' | 'cleared_with_modifications' | 'delayed' | 'cancelled';
    clearanceNotes?: string;
    assessedBy: string;
    assessedAt: Date;
}
export interface PostSessionAssessment {
    vitalSigns: VitalSigns;
    tolerance: 'excellent' | 'good' | 'fair' | 'poor';
    immediateToxicities?: ToxicityAssessment[];
    complications?: string[];
    observations?: string;
    nextSessionScheduled?: Date;
    assessedBy: string;
    assessedAt: Date;
}
export interface VitalSigns {
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
    weight: number;
    height?: number;
    bmi?: number;
    oxygenSaturation?: number;
    painScore?: number;
}
export interface PerformanceStatus {
    scale: 'ECOG' | 'KARNOFSKY';
    score: number;
    description?: string;
}
export interface SymptomAssessment {
    symptom: string;
    severity: number;
    duration?: string;
    impactOnActivities: 'none' | 'mild' | 'moderate' | 'severe';
    notes?: string;
}
export interface LabAssessment {
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low' | 'critical';
    date: Date;
}
export interface SessionMedication {
    id: string;
    medicationName: string;
    dosage: string;
    route: string;
    administrationTime?: Date;
    administeredBy: string;
    notes?: string;
}
export interface SessionProcedure {
    id: string;
    procedureName: string;
    startTime: Date;
    endTime: Date;
    performedBy: string;
    complications?: string[];
    notes?: string;
}
export interface TreatmentAdherence {
    overallAdherence: number;
    missedSessions: number;
    postponedSessions: number;
    doseModifications: number;
    delays: number[];
    adherenceScore: 'excellent' | 'good' | 'fair' | 'poor';
    notes?: string;
}
export interface BaselineAssessment {
    date: Date;
    diseaseAssessment: DiseaseAssessment;
    laboratoryValues: LabValue[];
    imagingStudies: ImagingStudy[];
    functionalStatus: FunctionalStatus;
    comorbidities: Comorbidity[];
}
export interface DiseaseAssessment {
    lesionMeasurements: LesionMeasurement[];
    diseaseBurden: 'minimal' | 'moderate' | 'extensive';
    biomarkers?: BiomarkerResult[];
    date: Date;
    assessmentMethod: 'RECIST' | 'WHO' | 'PERCIST' | 'clinical';
}
export interface LesionMeasurement {
    id: string;
    site: string;
    lesionType: 'target' | 'non_target' | 'new';
    baselineSize: number;
    measurementMethod: 'CT' | 'MRI' | 'PET' | 'clinical' | 'ultrasound';
    notes?: string;
}
export interface LabValue {
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
    category: 'hematology' | 'chemistry' | 'tumor_marker' | 'hormone' | 'other';
    date: Date;
}
export interface ImagingStudy {
    id: string;
    studyType: string;
    date: Date;
    findings: string;
    impression?: string;
    radiologist?: string;
    reportUrl?: string;
}
export interface FunctionalStatus {
    adlScore: number;
    iadlScore: number;
    nutritionalStatus: 'well_nourished' | 'moderately_malnourished' | 'severely_malnourished';
    performanceScore: number;
}
export interface Comorbidity {
    condition: string;
    severity: 'mild' | 'moderate' | 'severe';
    controlled: boolean;
    treatment: string;
    impactOnCancerTreatment: 'none' | 'minimal' | 'moderate' | 'significant';
}
export interface ResponseAssessment {
    assessmentDate: Date;
    responseCriteria: 'RECIST_1.1' | 'WHO' | 'PERCIST' | 'clinical';
    overallResponse: 'CR' | 'PR' | 'SD' | 'PD';
    targetLesionResponse: string;
    nonTargetLesionResponse: string;
    newLesions: boolean;
    progressionDate?: Date;
    timeToProgression?: number;
    notes?: string;
    assessedBy: string;
}
export interface BiomarkerResult {
    markerName: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    interpretation?: string;
    date: Date;
    assayMethod?: string;
}
export interface TreatmentToxicity {
    id: string;
    toxicityType: string;
    grade: number;
    onsetDate: Date;
    resolutionDate?: Date;
    status: 'active' | 'resolved' | 'ongoing';
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening' | 'fatal';
    management: string;
    affectedOrgan: string;
    ctcaeTerm: string;
    reportedBy: string;
}
export interface ToxicityAssessment {
    toxicityType: string;
    grade: number;
    ctcaeTerm: string;
    managementAction?: string;
}
export interface MedicalRecord {
    id: string;
    patientId: string;
    patient?: Patient;
    recordType: 'progress_note' | 'consultation' | 'discharge_summary' | 'procedure_note' | 'imaging_report' | 'lab_report' | 'pathology_report';
    title: string;
    content: string;
    summary?: string;
    serviceType: string;
    department: string;
    encounterType: 'outpatient' | 'inpatient' | 'emergency' | 'day_care';
    primaryProvider: ClinicalTeamMember;
    consultingProviders?: ClinicalTeamMember[];
    serviceDate: Date;
    documentationDate: Date;
    lastUpdated: Date;
    diagnosis: Diagnosis[];
    medications?: MedicationRecord[];
    procedures?: ProcedureRecord[];
    vitals?: VitalSigns;
    labs?: LabResult[];
    imaging?: ImagingResult[];
    assessment: string;
    plan: string;
    followUp?: FollowUpPlan;
    coded: boolean;
    codedDiagnoses?: string[];
    codedProcedures?: string[];
    reviewed: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
    version: number;
    status: 'draft' | 'final' | 'amended' | 'corrected' | 'deleted';
    source: 'manual_entry' | 'dictation' | 'template' | 'import' | 'interface';
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Diagnosis {
    code: string;
    description: string;
    type: 'primary' | 'secondary' | 'admitting' | 'discharge';
    status: 'active' | 'resolved' | 'chronic';
    onsetDate?: Date;
    resolvedDate?: Date;
    clinicalStatus: 'confirmed' | 'provisional' | 'differential' | 'ruled_out';
    verificationStatus: 'confirmed' | 'unconfirmed' | 'refuted';
}
export interface MedicationRecord {
    id: string;
    medicationName: string;
    dosage: string;
    route: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    prescribedBy: string;
    indication: string;
    status: 'active' | 'discontinued' | 'completed';
    prn: boolean;
    notes?: string;
}
export interface ProcedureRecord {
    id: string;
    procedureName: string;
    code: string;
    date: Date;
    performedBy: string;
    location: string;
    indication: string;
    technique: string;
    complications?: string[];
    findings?: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}
export interface LabResult {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    abnormalFlag: 'high' | 'low' | 'critical' | 'normal';
    specimen: string;
    collectionDate: Date;
    resultDate: Date;
    performingLab: string;
    orderingProvider: string;
}
export interface ImagingResult {
    studyType: string;
    date: Date;
    findings: string;
    impression: string;
    radiologist: string;
    accessionNumber?: string;
    imagesAvailable: boolean;
    comparison?: string;
}
export interface FollowUpPlan {
    type: 'clinic_visit' | 'phone_call' | 'imaging' | 'lab_work' | 'other';
    timing: string;
    details: string;
    responsibleParty: string;
    scheduledDate?: Date;
    completed: boolean;
}
export interface QualityMetrics {
    id: string;
    treatmentPlanId: string;
    metricDate: Date;
    timeToTreatment: number;
    guidelineConcordance: number;
    multidisciplinaryReview: boolean;
    clinicalTrialDiscussion: boolean;
    treatmentCompletion: boolean;
    doseIntensity: number;
    toxicityRate: number;
    emergencyVisits: number;
    hospitalizations: number;
    progressionFreeSurvival?: number;
    overallSurvival?: number;
    timeToTreatmentFailure?: number;
    qualityOfLifeScore?: number;
    patientSatisfactionScore?: number;
    treatmentCost?: number;
    costEffectiveness?: number;
    calculatedBy: string;
    createdAt: Date;
}
export interface TreatmentReport {
    id: string;
    reportType: 'treatment_summary' | 'progress_report' | 'outcome_analysis' | 'quality_metrics' | 'adverse_events';
    title: string;
    description?: string;
    patientIds?: string[];
    treatmentPlanIds?: string[];
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    data: any;
    summary: string;
    insights?: string[];
    recommendations?: string[];
    format: 'json' | 'pdf' | 'excel' | 'csv';
    generatedBy: string;
    generatedAt: Date;
    parameters: any;
    fileUrl?: string;
}
