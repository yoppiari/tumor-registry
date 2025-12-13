import apiClient, { ApiResponse } from './api.config';

export interface MstsScore {
  id: string;
  patientId: string;
  followUpVisitId?: string;
  pain: number;
  function: number;
  emotionalAcceptance: number;
  supports: number;
  walking: number;
  gait: number;
  totalScore: number;
  assessmentDate: string;
  assessedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    name: string;
    medicalRecordNumber: string;
  };
}

export interface CreateMstsScoreDto {
  patientId: string;
  followUpVisitId?: string;
  pain: number;
  function: number;
  emotionalAcceptance: number;
  supports: number;
  walking: number;
  gait: number;
  assessmentDate: string;
  assessedBy: string;
  notes?: string;
}

export interface UpdateMstsScoreDto {
  pain?: number;
  function?: number;
  emotionalAcceptance?: number;
  supports?: number;
  walking?: number;
  gait?: number;
  assessmentDate?: string;
  assessedBy?: string;
  notes?: string;
}

export interface MstsScoreHistory {
  patientId: string;
  totalScores: number;
  scores: Array<{
    id: string;
    assessmentDate: string;
    totalScore: number;
    assessedBy: string;
  }>;
  latestScore: MstsScore | null;
  averageScore: number | null;
}

class MstsService {
  /**
   * Create a new MSTS score assessment
   */
  async createScore(data: CreateMstsScoreDto): Promise<MstsScore> {
    const response = await apiClient.post<MstsScore>('/msts-scores', data);
    return response.data;
  }

  /**
   * Get all MSTS scores (optionally filtered by patient)
   */
  async getAllScores(patientId?: string): Promise<MstsScore[]> {
    const params = patientId ? { patientId } : {};
    const response = await apiClient.get<MstsScore[]>('/msts-scores', { params });
    return response.data;
  }

  /**
   * Get MSTS score by ID
   */
  async getScoreById(id: string): Promise<MstsScore> {
    const response = await apiClient.get<MstsScore>(`/msts-scores/${id}`);
    return response.data;
  }

  /**
   * Get MSTS scores for a specific patient
   */
  async getScoresByPatient(patientId: string): Promise<MstsScore[]> {
    const response = await apiClient.get<MstsScore[]>(`/msts-scores/patient/${patientId}`);
    return response.data;
  }

  /**
   * Get MSTS score history and statistics for a patient
   */
  async getPatientHistory(patientId: string): Promise<MstsScoreHistory> {
    const response = await apiClient.get<MstsScoreHistory>(
      `/msts-scores/patient/${patientId}/history`
    );
    return response.data;
  }

  /**
   * Update an existing MSTS score
   */
  async updateScore(id: string, data: UpdateMstsScoreDto): Promise<MstsScore> {
    const response = await apiClient.put<MstsScore>(`/msts-scores/${id}`, data);
    return response.data;
  }

  /**
   * Delete an MSTS score
   */
  async deleteScore(id: string): Promise<void> {
    await apiClient.delete(`/msts-scores/${id}`);
  }

  /**
   * Calculate total MSTS score from domain scores (client-side validation)
   */
  calculateTotalScore(scores: {
    pain: number;
    function: number;
    emotionalAcceptance: number;
    supports: number;
    walking: number;
    gait: number;
  }): number {
    return (
      scores.pain +
      scores.function +
      scores.emotionalAcceptance +
      scores.supports +
      scores.walking +
      scores.gait
    );
  }

  /**
   * Get functional status category based on total score
   */
  getFunctionalStatus(totalScore: number): string {
    if (totalScore >= 24) return 'Excellent (24-30)';
    if (totalScore >= 18) return 'Good (18-23)';
    if (totalScore >= 12) return 'Fair (12-17)';
    return 'Poor (<12)';
  }
}

export default new MstsService();
