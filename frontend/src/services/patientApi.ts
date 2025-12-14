/**
 * Patient API Service
 * Handles all patient-related API calls for the INAMSOS registry
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Types matching backend DTOs
export interface CreatePatientPayload {
  // Section 1: Center & Pathology Type
  centerId: string;
  pathologyType?: string;

  // Section 2: Patient Identity
  medicalRecordNumber: string;
  nik: string;
  name: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  gender: string;
  bloodType?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
  postalCode?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Section 3: Clinical Data
  chiefComplaint?: string;
  symptomOnset?: string;
  symptomDuration?: number;
  symptomDurationUnit?: string;
  presentingSymptoms?: string[];
  tumorSize?: number;
  familyHistory?: boolean;
  tumorSyndromeId?: string;
  karnofskyScore?: number;
  height?: number;
  weight?: number;
  bmi?: number;

  // Section 4: Diagnostic Investigations
  biopsyType?: string;
  biopsyDate?: string;
  biopsyLocation?: string;
  biopsySite?: string;
  imagingStudies?: string[];
  imagingDate?: string;
  imagingFindings?: string;
  mirrelScore?: {
    siteScore: number;
    painScore: number;
    lesionType: string;
    sizeScore: number;
    totalScore: number;
    fractureRisk: string;
  };

  // Section 5: Diagnosis & Location
  diagnosisDate?: string;
  whoClassificationId?: string;
  boneLocationId?: string;
  softTissueLocationId?: string;
  tumorGrade?: string;
  histopathology?: string;

  // Section 6: Staging
  stagingSystem?: string;
  enneking?: {
    grade: string;
    site: string;
    metastasis: string;
    stage: string;
    description: string;
  };
  ajcc?: {
    tCategory: string;
    nCategory: string;
    mCategory: string;
    grade: string;
    edition: string;
    overallStage: string;
  };

  // Section 7: CPC Conference
  cpc?: {
    held: boolean;
    date?: string;
    location?: string;
    participants?: Array<{
      name: string;
      specialty: string;
      role: string;
    }>;
    presentation?: {
      presentedBy?: string;
      presentedByRole?: string;
      chiefComplaint?: string;
      clinicalFindings?: string;
      imagingFindings?: string;
      pathologyFindings?: string;
    };
    recommendations?: {
      primaryTreatment?: string;
      surgicalApproach?: string;
      neoadjuvantTherapy?: boolean;
      adjuvantTherapy?: boolean;
      radiationIndicated?: boolean;
      followUpPlan?: string;
    };
    consensus?: {
      reached?: boolean;
      finalDecision?: string;
      minorityOpinion?: string;
    };
    notes?: string;
  };

  // Section 8: Treatment
  treatment?: {
    surgery?: {
      limbSalvageStatus?: string;
      limbSalvageTechnique?: string;
      amputationLevel?: string;
      surgicalMargin?: string;
      complications?: string[];
      surgeryDate?: string;
    };
    chemotherapy?: {
      neoadjuvant?: boolean;
      adjuvant?: boolean;
      regimen?: string;
      cycles?: number;
      startDate?: string;
      endDate?: string;
      response?: string;
    };
    radiotherapy?: {
      given?: boolean;
      timing?: string;
      technique?: string;
      totalDose?: number;
      fractions?: number;
    };
    overallResponse?: string;
  };

  // Section 9: Follow-up
  followUp?: {
    visits?: Array<{
      visitNumber: number;
      scheduledMonth: number;
      completed: boolean;
      visitDate?: string;
      diseaseStatus?: {
        status: string;
        localRecurrence?: boolean;
        recurrenceDate?: string;
        distantMetastasis?: boolean;
        metastasisSites?: string[];
        deathDate?: string;
      };
      mstsScore?: {
        extremityType: string;
        pain?: number;
        function?: number;
        emotionalAcceptance?: number;
        handPositioning?: number;
        manualDexterity?: number;
        liftingAbility?: number;
        supports?: number;
        walkingAbility?: number;
        gait?: number;
        totalScore?: number;
        percentage?: number;
      };
      imagingResults?: string;
      labResults?: string;
      clinicalNotes?: string;
    }>;
  };
}

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  nik: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  centerId: string;
  // ... other fields
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  patients: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Base API call function with auth header
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Create a new patient record
 */
export async function createPatient(
  data: CreatePatientPayload
): Promise<ApiResponse<Patient>> {
  return apiCall<ApiResponse<Patient>>('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing patient record
 */
export async function updatePatient(
  id: string,
  data: Partial<CreatePatientPayload>
): Promise<ApiResponse<Patient>> {
  return apiCall<ApiResponse<Patient>>(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Get a single patient by ID
 */
export async function getPatient(id: string): Promise<ApiResponse<Patient>> {
  return apiCall<ApiResponse<Patient>>(`/patients/${id}`);
}

/**
 * Get all patients with pagination
 */
export async function getPatients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  centerId?: string;
}): Promise<PaginatedResponse<Patient>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.centerId) searchParams.append('centerId', params.centerId);

  return apiCall<PaginatedResponse<Patient>>(
    `/patients?${searchParams.toString()}`
  );
}

/**
 * Delete a patient record
 */
export async function deletePatient(id: string): Promise<ApiResponse<void>> {
  return apiCall<ApiResponse<void>>(`/patients/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Transform wizard form data to CreatePatientPayload
 */
export function transformWizardDataToPayload(formData: any): CreatePatientPayload {
  const section1 = formData.section1 || {};
  const section2 = formData.section2 || {};
  const section3 = formData.section3 || {};
  const section4 = formData.section4 || {};
  const section5 = formData.section5 || {};
  const section6 = formData.section6 || {};
  const section7 = formData.section7 || {};
  const section8 = formData.section8 || {};
  const section9 = formData.section9 || {};

  return {
    // Section 1
    centerId: section1.centerId || '',
    pathologyType: section1.pathologyTypeId,

    // Section 2
    medicalRecordNumber: section2.medicalRecordNumber || `MR-${Date.now()}`,
    nik: section2.nik || '',
    name: section2.name || '',
    dateOfBirth: section2.dateOfBirth || '',
    placeOfBirth: section2.placeOfBirth,
    gender: section2.gender || '',
    bloodType: section2.bloodType,
    religion: section2.religion,
    maritalStatus: section2.maritalStatus,
    occupation: section2.occupation,
    education: section2.education,
    phone: section2.phone,
    email: section2.email,
    address: section2.address,
    province: section2.province,
    regency: section2.regency,
    district: section2.district,
    village: section2.village,
    postalCode: section2.postalCode,
    emergencyContact: section2.emergencyContact,

    // Section 3
    chiefComplaint: section3.chiefComplaint,
    symptomOnset: section3.symptomOnset,
    symptomDuration: section3.symptomDuration,
    symptomDurationUnit: section3.symptomDurationUnit,
    presentingSymptoms: section3.presentingSymptoms,
    tumorSize: section3.tumorSize,
    familyHistory: section3.familyHistory,
    tumorSyndromeId: section3.tumorSyndromeId,
    karnofskyScore: section3.karnofskyScore,
    height: section3.height,
    weight: section3.weight,
    bmi: section3.bmi,

    // Section 4
    biopsyType: section4.biopsyType,
    biopsyDate: section4.biopsyDate,
    biopsyLocation: section4.biopsyLocation,
    biopsySite: section4.biopsySite,
    imagingStudies: section4.imagingStudies,
    imagingDate: section4.imagingDate,
    imagingFindings: section4.imagingFindings,
    mirrelScore: section4.mirrelScore,

    // Section 5
    diagnosisDate: section5.diagnosisDate,
    whoClassificationId: section5.whoClassificationId,
    boneLocationId: section5.boneLocationId,
    softTissueLocationId: section5.softTissueLocationId,
    tumorGrade: section5.tumorGrade,
    histopathology: section5.histopathology,

    // Section 6
    stagingSystem: section6.stagingSystem,
    enneking: section6.enneking,
    ajcc: section6.ajcc,

    // Section 7
    cpc: section7.cpcHeld ? {
      held: section7.cpcHeld,
      date: section7.cpcDate,
      location: section7.cpcLocation,
      participants: section7.participants,
      presentation: section7.casePresentation,
      recommendations: section7.recommendations,
      consensus: section7.consensus,
      notes: section7.notes,
    } : undefined,

    // Section 8
    treatment: {
      surgery: section8.surgery,
      chemotherapy: section8.chemotherapy,
      radiotherapy: section8.radiotherapy,
      overallResponse: section8.overallResponse,
    },

    // Section 9
    followUp: {
      visits: section9.visits,
    },
  };
}
