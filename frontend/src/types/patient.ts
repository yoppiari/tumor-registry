export interface Patient {
  id: string;
  medicalRecordNumber: string;
  identityNumber?: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  rhFactor?: 'positive' | 'negative';
  phone?: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;

  // Medical Information
  occupation?: string;
  educationLevel?: 'SD' | 'SMP' | 'SMA' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu' | 'other';

  // Cancer Specific Information
  primaryCancerDiagnosis?: CancerDiagnosis;
  cancerStage?: 'I' | 'II' | 'III' | 'IV';
  cancerGrade?: 'G1' | 'G2' | 'G3' | 'G4';
  tnmClassification?: TNMClassification;
  histology?: string;
  molecularMarkers?: MolecularMarker[];

  // Treatment Information
  treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
  dateOfDiagnosis?: string;
  dateOfFirstVisit?: string;
  lastVisitDate?: string;
  treatmentCenter: string;
  treatmentCenterName?: string;

  // System Information
  isActive: boolean;
  isDeceased: boolean;
  dateOfDeath?: string;
  causeOfDeath?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}

export interface Address {
  street?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other' | 'friend';
  phone: string;
  address?: string;
}

export interface CancerDiagnosis {
  primarySite: string;
  laterality: 'left' | 'right' | 'bilateral' | 'midline' | 'unknown';
  morphology: string;
  behavior: 'benign' | 'borderline' | 'invasive' | 'in_situ';
  grade?: string;
}

export interface TNMClassification {
  t: string;
  n: string;
  m: string;
  clinicalStage?: string;
  pathologicalStage?: string;
}

export interface MolecularMarker {
  name: string;
  result: 'positive' | 'negative' | 'unknown';
  testDate?: string;
  methodology?: string;
}

// Create/Update DTOs
export interface CreatePatientDto {
  medicalRecordNumber: string;
  identityNumber?: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  rhFactor?: 'positive' | 'negative';
  phone?: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  occupation?: string;
  educationLevel?: 'SD' | 'SMP' | 'SMA' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu' | 'other';
  primaryCancerDiagnosis?: CancerDiagnosis;
  cancerStage?: 'I' | 'II' | 'III' | 'IV';
  cancerGrade?: 'G1' | 'G2' | 'G3' | 'G4';
  tnmClassification?: TNMClassification;
  histology?: string;
  molecularMarkers?: MolecularMarker[];
  treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
  dateOfDiagnosis?: string;
  dateOfFirstVisit?: string;
  treatmentCenter: string;
}

export interface UpdatePatientDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  occupation?: string;
  educationLevel?: 'SD' | 'SMP' | 'SMA' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  religion?: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu' | 'other';
  primaryCancerDiagnosis?: CancerDiagnosis;
  cancerStage?: 'I' | 'II' | 'III' | 'IV';
  cancerGrade?: 'G1' | 'G2' | 'G3' | 'G4';
  tnmClassification?: TNMClassification;
  histology?: string;
  molecularMarkers?: MolecularMarker[];
  treatmentStatus?: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
  isDeceased?: boolean;
  dateOfDeath?: string;
  causeOfDeath?: string;
}

export interface PatientSearchDto {
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

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PatientStatistics {
  total: number;
  active: number;
  deceased: number;
  lostToFollowUp: number;
  newCases: number;
  byGender: {
    male: number;
    female: number;
  };
  byAgeGroup: {
    '0-17': number;
    '18-35': number;
    '36-50': number;
    '51-65': number;
    '65+': number;
  };
  byCancerStage: Record<string, number>;
  byTreatmentStatus: Record<string, number>;
  byPrimarySite: Record<string, number>;
  byProvince: Record<string, number>;
  monthlyRegistrations: {
    month: string;
    count: number;
  }[];
  recentRegistrations: Patient[];
}

// WhatsApp-inspired Data Entry Interfaces
export interface QuickPatientEntry {
  name: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  medicalRecordNumber?: string;
  primarySite?: string;
  cancerStage?: 'I' | 'II' | 'III' | 'IV';
  treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'form';
  content: string;
  timestamp: string | Date;
  fieldName?: string;
  validation?: {
    isValid: boolean;
    errors?: string[];
  };
  options?: string[];
  completed?: boolean;
}

export interface PatientEntrySession {
  id: string;
  patientId?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  totalSteps: number;
  messages: ChatMessage[];
  formData: Partial<Patient>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// UI State Management
export interface PatientContextType {
  patients: Patient[];
  currentPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: PatientSearchDto;
  statistics: PatientStatistics | null;

  // Actions
  setPatients: (patients: Patient[]) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: PatientSearchDto) => void;
  clearCurrentPatient: () => void;

  // Async actions
  fetchPatients: (query?: PatientSearchDto) => Promise<void>;
  createPatient: (patient: CreatePatientDto) => Promise<Patient>;
  updatePatient: (id: string, patient: UpdatePatientDto) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  searchPatients: (query: PatientSearchDto) => Promise<PatientListResponse>;
  getPatientById: (id: string) => Promise<Patient>;
  getStatistics: () => Promise<void>;
  quickEntry: (quickEntry: QuickPatientEntry) => Promise<Patient>;

  // Chat session actions
  createChatSession: () => Promise<PatientEntrySession>;
  sendChatMessage: (sessionId: string, message: string, fieldName?: string, formData?: any) => Promise<PatientEntrySession>;
  getChatSession: (sessionId: string) => Promise<PatientEntrySession>;
}

// Form Steps for WhatsApp-inspired entry
export interface FormStep {
  id: string;
  title: string;
  fieldName: string;
  type: 'text' | 'select' | 'date' | 'phone' | 'options';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: (value: any) => { isValid: boolean; errors: string[] };
}