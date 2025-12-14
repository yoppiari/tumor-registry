import apiClient, { ApiResponse } from './api.config';

export interface ResearchRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  studyType: string;
  principalInvestigatorId: string;
  objectives: string;
  methodology: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  sampleSize: number;
  duration: number;
  dataRequested: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  principalInvestigator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateResearchRequestDto {
  title: string;
  description: string;
  studyType: 'OBSERVATIONAL' | 'INTERVENTIONAL' | 'CLINICAL_TRIAL';
  objectives: string;
  methodology: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  sampleSize: number;
  duration: number;
  dataRequested: string;
}

class ResearchService {
  /**
   * Get all research requests for current user
   */
  async getResearchRequests(): Promise<ResearchRequest[]> {
    const response = await apiClient.get<ResearchRequest[]>('/research/requests');
    return response.data;
  }

  /**
   * Get research request by ID
   */
  async getResearchRequestById(id: string): Promise<ResearchRequest> {
    const response = await apiClient.get<ResearchRequest>(`/research/requests/${id}`);
    return response.data;
  }

  /**
   * Create new research request
   */
  async createResearchRequest(data: CreateResearchRequestDto): Promise<ResearchRequest> {
    const response = await apiClient.post<ResearchRequest>('/research/requests', data);
    return response.data;
  }

  /**
   * Update research request
   */
  async updateResearchRequest(id: string, data: Partial<CreateResearchRequestDto>): Promise<ResearchRequest> {
    const response = await apiClient.put<ResearchRequest>(`/research/requests/${id}`, data);
    return response.data;
  }

  /**
   * Delete research request
   */
  async deleteResearchRequest(id: string): Promise<void> {
    await apiClient.delete(`/research/requests/${id}`);
  }
}

export default new ResearchService();
