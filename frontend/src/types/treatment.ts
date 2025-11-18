// Core Treatment Types
export interface TreatmentPlan {
  id: string;
  patientId: string;
  patient?: any;

  // Plan Information
  planName: string;
  planCode: string;
  primaryCancerSite: string;
  cancerStage: string;
  histology?: string;

  // Treatment Modalities
  modalities: TreatmentModality[];
  intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';

  // Protocol Information
  protocol?: TreatmentProtocol;
  protocolName?: string;
  protocolVersion?: string;
  protocolCategory?: 'standard' | 'clinical_trial' | 'modified' | 'compassionate_use';

  // Clinical Team
  primaryOncologist: ClinicalTeamMember;
  multidisciplinaryTeam: ClinicalTeamMember[];

  // Scheduling
  startDate: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  totalCycles?: number;
  completedCycles?: number;

  // Status and Tracking
  status: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';
  phase: 'initial' | 'consolidation' | 'maintenance' | 'follow_up';
  adherence: TreatmentAdherence;

  // Assessment and Outcomes
  baselineAssessment: BaselineAssessment;
  responseAssessment?: ResponseAssessment;
  toxicities?: TreatmentToxicity[];

  // System Information
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
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
  // Surgery Settings
  surgeryType?: string;
  surgicalApproach?: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic';
  plannedDate?: string;

  // Chemotherapy Settings
  regimen?: string;
  cycleLength?: number; // days
  numberOfCycles?: number;
  doseModifications?: DoseModification[];

  // Radiotherapy Settings
  technique?: string;
  dose?: number; // Gy
  fractions?: number;
  targetVolume?: string;

  // Targeted/Immunotherapy Settings
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
  date: string;
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
  expectedDuration: number; // months
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

  // Session Information
  sessionNumber: number;
  sessionDate: string;
  modality: string;
  duration: number; // minutes

  // Clinical Details
  preAssessment: PreSessionAssessment;
  postAssessment?: PostSessionAssessment;
  medications: SessionMedication[];
  procedures: SessionProcedure[];

  // Staff Information
  performedBy: ClinicalTeamMember;
  supervisedBy?: ClinicalTeamMember;

  // Complications and Notes
  complications?: string[];
  nursingNotes?: string;
  physicianNotes?: string;

  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed' | 'postponed';
  cancellationReason?: string;

  // System Information
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreSessionAssessment {
  vitalSigns: VitalSigns;
  performanceStatus: PerformanceStatus;
  symptoms: SymptomAssessment[];
  labs: LabAssessment[];
  clearance: 'cleared' | 'cleared_with_modifications' | 'delayed' | 'cancelled';
  clearanceNotes?: string;
  assessedBy: string;
  assessedAt: string;
}

export interface PostSessionAssessment {
  vitalSigns: VitalSigns;
  tolerance: 'excellent' | 'good' | 'fair' | 'poor';
  immediateToxicities?: ToxicityAssessment[];
  complications?: string[];
  observations?: string;
  nextSessionScheduled?: string;
  assessedBy: string;
  assessedAt: string;
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
  painScore?: number; // 0-10 scale
}

export interface PerformanceStatus {
  scale: 'ECOG' | 'KARNOFSKY';
  score: number; // 0-4 for ECOG, 0-100 for KARNOFSKY
  description?: string;
}

export interface SymptomAssessment {
  symptom: string;
  severity: number; // 0-10 scale
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
  date: string;
}

export interface SessionMedication {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  administrationTime?: string;
  administeredBy: string;
  notes?: string;
}

export interface SessionProcedure {
  id: string;
  procedureName: string;
  startTime: string;
  endTime: string;
  performedBy: string;
  complications?: string[];
  notes?: string;
}

export interface TreatmentAdherence {
  overallAdherence: number; // percentage
  missedSessions: number;
  postponedSessions: number;
  doseModifications: number;
  delays: string[];
  adherenceScore: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface BaselineAssessment {
  date: string;
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
  date: string;
  assessmentMethod: 'RECIST' | 'WHO' | 'PERCIST' | 'clinical';
}

export interface LesionMeasurement {
  id: string;
  site: string;
  lesionType: 'target' | 'non_target' | 'new';
  baselineSize: number; // mm
  measurementMethod: 'CT' | 'MRI' | 'PET' | 'clinical' | 'ultrasound';
  notes?: string;
}

export interface LabValue {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  category: 'hematology' | 'chemistry' | 'tumor_marker' | 'hormone' | 'other';
  date: string;
}

export interface ImagingStudy {
  id: string;
  studyType: string;
  date: string;
  findings: string;
  impression?: string;
  radiologist?: string;
  reportUrl?: string;
}

export interface FunctionalStatus {
  adlScore: number; // Activities of Daily Living
  iadlScore: number; // Instrumental ADL
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
  assessmentDate: string;
  responseCriteria: 'RECIST_1.1' | 'WHO' | 'PERCIST' | 'clinical';
  overallResponse: 'CR' | 'PR' | 'SD' | 'PD'; // Complete/Partial Response, Stable/Progressive Disease
  targetLesionResponse: string;
  nonTargetLesionResponse: string;
  newLesions: boolean;
  progressionDate?: string;
  timeToProgression?: number; // days
  notes?: string;
  assessedBy: string;
}

export interface BiomarkerResult {
  markerName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: string;
  date: string;
  assayMethod?: string;
}

export interface TreatmentToxicity {
  id: string;
  toxicityType: string;
  grade: number; // 1-5 CTCAE scale
  onsetDate: string;
  resolutionDate?: string;
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

// Medical Records
export interface MedicalRecord {
  id: string;
  patientId: string;
  patient?: any;

  // Record Information
  recordType: 'progress_note' | 'consultation' | 'discharge_summary' | 'procedure_note' | 'imaging_report' | 'lab_report' | 'pathology_report';
  title: string;
  content: string;
  summary?: string;

  // Clinical Information
  serviceType: string;
  department: string;
  encounterType: 'outpatient' | 'inpatient' | 'emergency' | 'day_care';

  // Healthcare Providers
  primaryProvider: ClinicalTeamMember;
  consultingProviders?: ClinicalTeamMember[];

  // Timestamps
  serviceDate: string;
  documentationDate: string;
  lastUpdated: string;

  // Clinical Data
  diagnosis: Diagnosis[];
  medications?: MedicationRecord[];
  procedures?: ProcedureRecord[];
  vitals?: VitalSigns;
  labs?: LabResult[];
  imaging?: ImagingResult[];

  // Assessment and Plan
  assessment: string;
  plan: string;
  followUp?: FollowUpPlan;

  // Quality and Compliance
  coded: boolean;
  codedDiagnoses?: string[]; // ICD-10 codes
  codedProcedures?: string[]; // ICD-9/10 procedure codes
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;

  // System Information
  version: number;
  status: 'draft' | 'final' | 'amended' | 'corrected' | 'deleted';
  source: 'manual_entry' | 'dictation' | 'template' | 'import' | 'interface';
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  code: string; // ICD-10
  description: string;
  type: 'primary' | 'secondary' | 'admitting' | 'discharge';
  status: 'active' | 'resolved' | 'chronic';
  onsetDate?: string;
  resolvedDate?: string;
  clinicalStatus: 'confirmed' | 'provisional' | 'differential' | 'ruled_out';
  verificationStatus: 'confirmed' | 'unconfirmed' | 'refuted';
}

export interface MedicationRecord {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  indication: string;
  status: 'active' | 'discontinued' | 'completed';
  prn: boolean; // as needed
  notes?: string;
}

export interface ProcedureRecord {
  id: string;
  procedureName: string;
  code: string; // CPT/ICD-10 procedure code
  date: string;
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
  collectionDate: string;
  resultDate: string;
  performingLab: string;
  orderingProvider: string;
}

export interface ImagingResult {
  studyType: string;
  date: string;
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
  scheduledDate?: string;
  completed: boolean;
}

// Quality Metrics and Outcomes
export interface QualityMetrics {
  id: string;
  treatmentPlanId: string;
  metricDate: string;

  // Process Metrics
  timeToTreatment: number; // days from diagnosis to first treatment
  guidelineConcordance: number; // percentage
  multidisciplinaryReview: boolean;
  clinicalTrialDiscussion: boolean;

  // Outcome Metrics
  treatmentCompletion: boolean;
  doseIntensity: number; // relative dose intensity
  toxicityRate: number; // grade 3+ toxicities
  emergencyVisits: number;
  hospitalizations: number;

  // Survival Metrics
  progressionFreeSurvival?: number; // days
  overallSurvival?: number; // days
  timeToTreatmentFailure?: number; // days

  // Patient-Reported Outcomes
  qualityOfLifeScore?: number;
  patientSatisfactionScore?: number;

  // Cost Metrics
  treatmentCost?: number;
  costEffectiveness?: number;

  calculatedBy: string;
  createdAt: string;
}

// Export and Reporting
export interface TreatmentReport {
  id: string;
  reportType: 'treatment_summary' | 'progress_report' | 'outcome_analysis' | 'quality_metrics' | 'adverse_events';
  title: string;
  description?: string;

  // Report Parameters
  patientIds?: string[];
  treatmentPlanIds?: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };

  // Report Content
  data: any;
  summary: string;
  insights?: string[];
  recommendations?: string[];

  // Export Details
  format: 'json' | 'pdf' | 'excel' | 'csv';
  generatedBy: string;
  generatedAt: string;
  parameters: any;
  fileUrl?: string;
}

// Create/Update DTOs
export interface CreateTreatmentPlanDto {
  patientId: string;
  planName: string;
  planCode: string;
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
  startDate: string;
  expectedEndDate?: string;
  totalCycles?: number;
  baselineAssessment: CreateBaselineAssessmentDto;
}

export interface CreateTreatmentModalityDto {
  type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';
  name: string;
  priority: 'primary' | 'secondary' | 'adjuvant';
  sequence?: number;
  description?: string;
  settings?: CreateModalitySettingsDto;
}

export interface CreateModalitySettingsDto {
  surgeryType?: string;
  surgicalApproach?: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic';
  plannedDate?: string;
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

export interface CreateClinicalTeamMemberDto {
  userId: string;
  name: string;
  role: 'medical_oncologist' | 'radiation_oncologist' | 'surgical_oncologist' | 'pathologist' | 'radiologist' | 'nurse' | 'pharmacist' | 'nutritionist' | 'social_worker' | 'palliative_care';
  department: string;
  institution: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface CreateBaselineAssessmentDto {
  date: string;
  diseaseAssessment: CreateDiseaseAssessmentDto;
  laboratoryValues?: CreateLabValueDto[];
  imagingStudies?: CreateImagingStudyDto[];
  functionalStatus: CreateFunctionalStatusDto;
  comorbidities?: CreateComorbidityDto[];
}

export interface CreateDiseaseAssessmentDto {
  lesionMeasurements: CreateLesionMeasurementDto[];
  diseaseBurden: 'minimal' | 'moderate' | 'extensive';
  biomarkers?: CreateBiomarkerResultDto[];
  date: string;
  assessmentMethod: 'RECIST' | 'WHO' | 'PERCIST' | 'clinical';
}

export interface CreateLesionMeasurementDto {
  site: string;
  lesionType: 'target' | 'non_target' | 'new';
  baselineSize: number;
  measurementMethod: 'CT' | 'MRI' | 'PET' | 'clinical' | 'ultrasound';
  notes?: string;
}

export interface CreateLabValueDto {
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  category: 'hematology' | 'chemistry' | 'tumor_marker' | 'hormone' | 'other';
  date: string;
}

export interface CreateImagingStudyDto {
  studyType: string;
  date: string;
  findings: string;
  impression?: string;
  radiologist?: string;
  reportUrl?: string;
}

export interface CreateFunctionalStatusDto {
  adlScore: number;
  iadlScore: number;
  nutritionalStatus: 'well_nourished' | 'moderately_malnourished' | 'severely_malnourished';
  performanceScore: number;
}

export interface CreateComorbidityDto {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  controlled: boolean;
  treatment: string;
  impactOnCancerTreatment: 'none' | 'minimal' | 'moderate' | 'significant';
}

export interface CreateBiomarkerResultDto {
  markerName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: string;
  date: string;
  assayMethod?: string;
}

export interface UpdateTreatmentPlanDto {
  planName?: string;
  expectedEndDate?: string;
  totalCycles?: number;
  status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';
  phase?: 'initial' | 'consolidation' | 'maintenance' | 'follow_up';
  actualEndDate?: string;
  responseAssessment?: UpdateResponseAssessmentDto;
}

export interface UpdateResponseAssessmentDto {
  assessmentDate?: string;
  responseCriteria?: 'RECIST_1.1' | 'WHO' | 'PERCIST' | 'clinical';
  overallResponse?: 'CR' | 'PR' | 'SD' | 'PD';
  targetLesionResponse?: string;
  nonTargetLesionResponse?: string;
  newLesions?: boolean;
  progressionDate?: string;
  notes?: string;
  assessedBy?: string;
}

export interface SearchTreatmentDto {
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
    startDate: string;
    endDate: string;
  };
}

// UI State Management
export interface TreatmentContextType {
  treatmentPlans: TreatmentPlan[];
  currentTreatmentPlan: TreatmentPlan | null;
  treatmentSessions: TreatmentSession[];
  medicalRecords: MedicalRecord[];
  qualityMetrics: QualityMetrics | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTreatmentPlans: (plans: TreatmentPlan[]) => void;
  setCurrentTreatmentPlan: (plan: TreatmentPlan | null) => void;
  setTreatmentSessions: (sessions: TreatmentSession[]) => void;
  setMedicalRecords: (records: MedicalRecord[]) => void;
  setQualityMetrics: (metrics: QualityMetrics | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentTreatmentPlan: () => void;

  // Async actions
  fetchTreatmentPlans: (query?: SearchTreatmentDto) => Promise<void>;
  createTreatmentPlan: (plan: CreateTreatmentPlanDto) => Promise<TreatmentPlan>;
  updateTreatmentPlan: (id: string, plan: UpdateTreatmentPlanDto) => Promise<TreatmentPlan>;
  activateTreatmentPlan: (id: string) => Promise<TreatmentPlan>;
  completeTreatmentPlan: (id: string) => Promise<TreatmentPlan>;
  fetchTreatmentSessions: (planId: string) => Promise<void>;
  createTreatmentSession: (session: any) => Promise<TreatmentSession>;
  completeTreatmentSession: (sessionId: string, postAssessment: any) => Promise<TreatmentSession>;
  fetchMedicalRecords: (patientId: string, limit?: number) => Promise<void>;
  createMedicalRecord: (record: any) => Promise<MedicalRecord>;
  calculateQualityMetrics: (planId: string) => Promise<QualityMetrics>;
  generateTreatmentReport: (reportData: any) => Promise<TreatmentReport>;
}

export interface TreatmentListResponse {
  treatmentPlans: TreatmentPlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}