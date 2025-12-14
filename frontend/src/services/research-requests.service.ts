import apiClient from './index';

export interface DataFieldCategory {
  selected: boolean;
  justification?: string;
  subFields?: Record<string, boolean>;
}

export interface DataFieldsSelection {
  demographics?: DataFieldCategory;
  demographicsIdentifiable?: DataFieldCategory;
  clinicalPresentation?: DataFieldCategory;
  diagnosisClassification?: DataFieldCategory;
  stagingData?: DataFieldCategory;
  diagnosticInvestigations?: DataFieldCategory;
  treatmentManagement?: DataFieldCategory;
  followUpOutcomes?: DataFieldCategory;
  clinicalPhotosImaging?: DataFieldCategory;
  cpcRecords?: DataFieldCategory;
}

export interface DataFilters {
  periodStart?: string;
  periodEnd?: string;
  tumorTypes?: string[];
  whoClassifications?: string[];
  ennekingStages?: string[];
  ajccStages?: string[];
  ageMin?: number;
  ageMax?: number;
  genders?: string[];
  centerIds?: string[];
  treatmentTypes?: string[];
}

export interface CreateResearchRequestDto {
  // Step 1: Research Info
  title: string;
  researchType: 'ACADEMIC' | 'CLINICAL_TRIAL' | 'OBSERVATIONAL' | 'SYSTEMATIC_REVIEW' | 'META_ANALYSIS' | 'OTHER';
  researchAbstract: string;
  objectives: string;
  researcherPhone?: string;
  researcherInstitution?: string;

  // Step 2: Data Criteria
  dataFilters: DataFilters;
  estimatedPatientCount?: number;

  // Step 3: Data Fields
  requestedDataFields: DataFieldsSelection;

  // Step 4: Ethics & Timeline
  irbStatus: 'APPROVED' | 'IN_PROGRESS' | 'PENDING';
  ethicsApprovalNumber?: string;
  ethicsApprovalDate?: string;
  irbCertificateUrl?: string;
  protocolUrl?: string;
  proposalUrl?: string;
  cvUrl?: string;
  researchStart: string;
  researchEnd: string;
  accessDurationMonths: number;
  agreementSigned: boolean;
  agreementDate?: string;
}

export interface ResearchRequest {
  id: string;
  requestNumber: string;
  title: string;
  status: string;
  priority: string;
  dataSensitivityScore: number;
  estimatedPatientCount: number;
  submittedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  requestedDataFields?: DataFieldsSelection;
  dataFilters?: DataFilters;
}

export interface ApprovalDecision {
  decision: 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT' | 'REQUEST_MORE_INFO';
  notes?: string;
  conditions?: string;
  reducedAccessDuration?: number;
  excludedFields?: string[];
}

class ResearchRequestsService {
  /**
   * Create new research request (draft)
   */
  async create(data: CreateResearchRequestDto): Promise<ResearchRequest> {
    const response = await apiClient.post('/research-requests', data);
    return response.data;
  }

  /**
   * Update draft research request
   */
  async update(id: string, data: Partial<CreateResearchRequestDto>): Promise<ResearchRequest> {
    const response = await apiClient.patch(`/research-requests/${id}`, data);
    return response.data;
  }

  /**
   * Submit research request for approval
   */
  async submit(id: string): Promise<ResearchRequest> {
    const response = await apiClient.post(`/research-requests/${id}/submit`);
    return response.data;
  }

  /**
   * Get all research requests for current user
   */
  async getAll(filters?: any): Promise<ResearchRequest[]> {
    const response = await apiClient.get('/research-requests', { params: filters });
    return response.data;
  }

  /**
   * Get pending requests for admin review
   */
  async getPending(): Promise<ResearchRequest[]> {
    const response = await apiClient.get('/research-requests/pending');
    return response.data;
  }

  /**
   * Estimate patient count based on filters
   */
  async estimatePatients(filters: DataFilters): Promise<{ estimatedCount: number; message: string }> {
    const response = await apiClient.post('/research-requests/estimate', filters);
    return response.data;
  }

  /**
   * Get single research request
   */
  async getOne(id: string): Promise<ResearchRequest> {
    const response = await apiClient.get(`/research-requests/${id}`);
    return response.data;
  }

  /**
   * Admin approve/reject research request
   */
  async approveOrReject(id: string, decision: ApprovalDecision): Promise<ResearchRequest> {
    const response = await apiClient.post(`/research-requests/${id}/approve`, decision);
    return response.data;
  }

  /**
   * Delete draft research request
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/research-requests/${id}`);
  }

  /**
   * Get preset data fields for quick selection
   */
  getPresetDataFields(preset: 'basic_research' | 'outcome_study' | 'survival_analysis' | 'treatment_comparison'): DataFieldsSelection {
    const presets = {
      basic_research: {
        demographics: {
          selected: true,
          justification: 'Basic demographics for patient characterization',
          subFields: { age: true, gender: true, region: true },
        },
        diagnosisClassification: {
          selected: true,
          justification: 'Diagnosis and classification for tumor type analysis',
        },
        stagingData: {
          selected: true,
          justification: 'Staging data for disease severity assessment',
        },
      },
      outcome_study: {
        diagnosisClassification: {
          selected: true,
          justification: 'Diagnosis for outcome stratification',
        },
        stagingData: {
          selected: true,
          justification: 'Staging for baseline disease severity',
        },
        treatmentManagement: {
          selected: true,
          justification: 'Treatment details for outcome correlation',
        },
        followUpOutcomes: {
          selected: true,
          justification: 'Follow-up data and MSTS scores for outcome measurement',
        },
      },
      survival_analysis: {
        demographics: {
          selected: true,
          justification: 'Age and demographics as survival predictors',
          subFields: { age: true, gender: true },
        },
        diagnosisClassification: {
          selected: true,
          justification: 'Tumor type and grade for survival analysis',
        },
        stagingData: {
          selected: true,
          justification: 'Stage is primary survival predictor',
        },
        treatmentManagement: {
          selected: true,
          justification: 'Treatment modality affects survival',
        },
        followUpOutcomes: {
          selected: true,
          justification: 'Survival status and duration',
          subFields: { survivalStatus: true, survivalDuration: true },
        },
      },
      treatment_comparison: {
        diagnosisClassification: {
          selected: true,
          justification: 'Diagnosis for treatment stratification',
        },
        stagingData: {
          selected: true,
          justification: 'Baseline staging for comparison groups',
        },
        treatmentManagement: {
          selected: true,
          justification: 'Treatment details for comparison',
        },
        followUpOutcomes: {
          selected: true,
          justification: 'Outcomes for treatment effectiveness comparison',
        },
      },
    };

    return presets[preset] || {};
  }
}

export const researchRequestsService = new ResearchRequestsService();
export default researchRequestsService;
