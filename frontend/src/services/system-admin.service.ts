import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface SystemDashboard {
  totalUsers: number;
  activeUsers: number;
  totalCenters: number;
  activeCenters: number;
  totalPatients: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export interface SystemOverview {
  version: string;
  uptime: number;
  environment: string;
  databaseStatus: string;
  cacheStatus: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: {
    status: string;
    responseTime: number;
  };
  cache: {
    status: string;
    responseTime: number;
  };
  storage: {
    status: string;
    usedSpace: number;
    totalSpace: number;
  };
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
  environment?: string;
  centerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfigDto {
  key: string;
  value: string;
  category: string;
  description?: string;
  environment?: string;
  centerId?: string;
  isActive?: boolean;
}

class SystemAdminService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getDashboard(centerId?: string): Promise<SystemDashboard> {
    const params = centerId ? `?centerId=${centerId}` : '';
    const response = await axios.get(
      `${API_URL}/system-administration/dashboard${params}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getOverview(): Promise<SystemOverview> {
    const response = await axios.get(
      `${API_URL}/system-administration/overview`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getHealth(): Promise<SystemHealth> {
    const response = await axios.get(
      `${API_URL}/system-administration/health`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getConfigurations(filters?: {
    category?: string;
    environment?: string;
    centerId?: string;
    isActive?: boolean;
  }): Promise<SystemConfiguration[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.environment) params.append('environment', filters.environment);
    if (filters?.centerId) params.append('centerId', filters.centerId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const queryString = params.toString();
    const url = `${API_URL}/system-administration/configurations${queryString ? '?' + queryString : ''}`;

    const response = await axios.get(url, this.getAuthHeaders());
    return response.data;
  }

  async getConfiguration(id: string): Promise<SystemConfiguration> {
    const response = await axios.get(
      `${API_URL}/system-administration/configurations/${id}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async createConfiguration(data: CreateConfigDto): Promise<SystemConfiguration> {
    const response = await axios.post(
      `${API_URL}/system-administration/configurations`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async updateConfiguration(id: string, data: Partial<CreateConfigDto>): Promise<SystemConfiguration> {
    const response = await axios.put(
      `${API_URL}/system-administration/configurations/${id}`,
      data,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async deleteConfiguration(id: string): Promise<void> {
    await axios.delete(
      `${API_URL}/system-administration/configurations/${id}`,
      this.getAuthHeaders()
    );
  }
}

export const systemAdminService = new SystemAdminService();
