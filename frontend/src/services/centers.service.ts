import apiClient from './api.config';

// TypeScript interfaces matching backend response
export interface Center {
  id: string;
  name: string;
  code: string;
  province: string;
  regency?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

export interface CenterStatistics {
  totalCenters: number;
  activeCenters: number;
  inactiveCenters: number;
  centerUserStats: {
    id: string;
    name: string;
    code: string;
    userCount: number;
  }[];
}

export interface CreateCenterDto {
  name: string;
  code: string;
  province: string;
  regency?: string;
  address?: string;
}

export interface UpdateCenterDto {
  name?: string;
  province?: string;
  regency?: string;
  address?: string;
  isActive?: boolean;
}

class CentersService {
  /**
   * Get all centers
   */
  async fetchCenters(includeInactive = false): Promise<Center[]> {
    const response = await apiClient.get<Center[]>('/centers', {
      params: { includeInactive: includeInactive.toString() },
    });
    return response.data;
  }

  /**
   * Get center by ID
   */
  async fetchCenterById(id: string, includeUsers = false): Promise<Center> {
    const response = await apiClient.get<Center>(`/centers/${id}`, {
      params: { includeUsers: includeUsers.toString() },
    });
    return response.data;
  }

  /**
   * Get center statistics
   */
  async fetchStatistics(): Promise<CenterStatistics> {
    const response = await apiClient.get<CenterStatistics>('/centers/statistics');
    return response.data;
  }

  /**
   * Create new center
   */
  async createCenter(data: CreateCenterDto): Promise<Center> {
    const response = await apiClient.post<Center>('/centers', data);
    return response.data;
  }

  /**
   * Update center
   */
  async updateCenter(id: string, data: UpdateCenterDto): Promise<Center> {
    const response = await apiClient.put<Center>(`/centers/${id}`, data);
    return response.data;
  }

  /**
   * Activate center
   */
  async activateCenter(id: string): Promise<Center> {
    const response = await apiClient.put<Center>(`/centers/${id}/activate`);
    return response.data;
  }

  /**
   * Deactivate center
   */
  async deactivateCenter(id: string): Promise<Center> {
    const response = await apiClient.put<Center>(`/centers/${id}/deactivate`);
    return response.data;
  }

  /**
   * Delete center
   */
  async deleteCenter(id: string): Promise<void> {
    await apiClient.delete(`/centers/${id}`);
  }

  /**
   * Get users for a specific center
   */
  async getCenterUsers(centerId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/centers/${centerId}/users`);
    return response.data;
  }
}

export default new CentersService();
