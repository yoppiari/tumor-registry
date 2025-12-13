import apiClient from './api.config';

export interface FollowUpVisit {
  id: string;
  patientId: string;
  visitNumber: number;
  scheduledDate: string;
  actualDate?: string;
  visitType: string;
  status: string;
  clinicalStatus?: string;
  localRecurrence?: boolean;
  distantMetastasis?: boolean;
  metastasisSites?: string;
  currentTreatment?: string;
  mstsScoreId?: string;
  karnofskyScore?: number;
  imagingPerformed?: string;
  imagingFindings?: string;
  labResults?: string;
  complications?: string;
  nextVisitDate?: string;
  completedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    name: string;
    medicalRecordNumber: string;
  };
}

export interface CreateFollowUpVisitDto {
  patientId: string;
  visitNumber: number;
  scheduledDate: string;
  actualDate?: string;
  visitType: string;
  status?: string;
  clinicalStatus?: string;
  localRecurrence?: boolean;
  distantMetastasis?: boolean;
  metastasisSites?: string;
  currentTreatment?: string;
  mstsScoreId?: string;
  karnofskyScore?: number;
  imagingPerformed?: string;
  imagingFindings?: string;
  labResults?: string;
  complications?: string;
  nextVisitDate?: string;
  completedBy?: string;
  notes?: string;
}

export interface UpdateFollowUpVisitDto {
  scheduledDate?: string;
  actualDate?: string;
  visitType?: string;
  status?: string;
  clinicalStatus?: string;
  localRecurrence?: boolean;
  distantMetastasis?: boolean;
  metastasisSites?: string;
  currentTreatment?: string;
  mstsScoreId?: string;
  karnofskyScore?: number;
  imagingPerformed?: string;
  imagingFindings?: string;
  labResults?: string;
  complications?: string;
  nextVisitDate?: string;
  completedBy?: string;
  notes?: string;
}

export interface GenerateFollowUpScheduleDto {
  patientId: string;
  treatmentCompletionDate: string;
}

export interface FollowUpSummary {
  patientId: string;
  totalVisits: number;
  completed: number;
  scheduled: number;
  missed: number;
  cancelled: number;
  upcomingVisit?: FollowUpVisit;
  lastCompletedVisit?: FollowUpVisit;
  recurrence: {
    local: boolean;
    distant: boolean;
  };
}

class FollowUpService {
  /**
   * Generate 14-visit follow-up schedule for a patient
   * Year 1-2: Every 3 months (8 visits)
   * Year 3-5: Every 6 months (6 visits)
   */
  async generateSchedule(data: GenerateFollowUpScheduleDto): Promise<{
    patientId: string;
    totalVisits: number;
    message: string;
  }> {
    const response = await apiClient.post('/follow-ups/generate-schedule', data);
    return response.data;
  }

  /**
   * Create a single follow-up visit
   */
  async createVisit(data: CreateFollowUpVisitDto): Promise<FollowUpVisit> {
    const response = await apiClient.post<FollowUpVisit>('/follow-ups', data);
    return response.data;
  }

  /**
   * Get all follow-up visits (with optional filters)
   */
  async getAllVisits(patientId?: string, status?: string): Promise<FollowUpVisit[]> {
    const params: any = {};
    if (patientId) params.patientId = patientId;
    if (status) params.status = status;
    const response = await apiClient.get<FollowUpVisit[]>('/follow-ups', { params });
    return response.data;
  }

  /**
   * Get follow-up visit by ID
   */
  async getVisitById(id: string): Promise<FollowUpVisit> {
    const response = await apiClient.get<FollowUpVisit>(`/follow-ups/${id}`);
    return response.data;
  }

  /**
   * Get all follow-up visits for a patient
   */
  async getVisitsByPatient(patientId: string): Promise<FollowUpVisit[]> {
    const response = await apiClient.get<FollowUpVisit[]>(`/follow-ups/patient/${patientId}`);
    return response.data;
  }

  /**
   * Get follow-up summary for a patient
   */
  async getPatientSummary(patientId: string): Promise<FollowUpSummary> {
    const response = await apiClient.get<FollowUpSummary>(
      `/follow-ups/patient/${patientId}/summary`
    );
    return response.data;
  }

  /**
   * Update a follow-up visit
   */
  async updateVisit(id: string, data: UpdateFollowUpVisitDto): Promise<FollowUpVisit> {
    const response = await apiClient.put<FollowUpVisit>(`/follow-ups/${id}`, data);
    return response.data;
  }

  /**
   * Delete a follow-up visit
   */
  async deleteVisit(id: string): Promise<void> {
    await apiClient.delete(`/follow-ups/${id}`);
  }

  /**
   * Get visit status badge color
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'blue',
      completed: 'green',
      missed: 'red',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  }

  /**
   * Get clinical status badge color
   */
  getClinicalStatusColor(clinicalStatus?: string): string {
    const colors: Record<string, string> = {
      NED: 'green',
      AWD: 'yellow',
      DOD: 'red',
      DOC: 'gray',
    };
    return colors[clinicalStatus || ''] || 'gray';
  }
}

export default new FollowUpService();
