import apiClient, { ApiResponse, PaginationParams } from './api.config';

// WHO Bone Tumor Classification
export interface WhoBoneTumor {
  id: string;
  category: string;
  subcategory?: string;
  diagnosis: string;
  icdO3Code?: string;
  isMalignant: boolean;
  sortOrder: number;
}

// WHO Soft Tissue Tumor Classification
export interface WhoSoftTissueTumor {
  id: string;
  category: string;
  subcategory?: string;
  diagnosis: string;
  icdO3Code?: string;
  isMalignant: boolean;
  sortOrder: number;
}

// Bone Location
export interface BoneLocation {
  id: string;
  code: string;
  name: string;
  level: number;
  region?: string;
  bone?: string;
  segment?: string;
  parentId?: string;
  children?: BoneLocation[];
}

// Soft Tissue Location
export interface SoftTissueLocation {
  id: string;
  code: string;
  name: string;
  region: string;
  category: string;
}

// Musculoskeletal Center
export interface Center {
  id: string;
  code: string;
  name: string;
  type: string;
  province: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

// Pathology Type
export interface PathologyType {
  id: string;
  code: string;
  name: string;
  nameIndo: string;
  description?: string;
}

// Tumor Syndrome
export interface TumorSyndrome {
  id: string;
  name: string;
  gene?: string;
  omimId?: string;
  inheritancePattern?: string;
  associatedTumors?: string;
  description?: string;
}

class ReferenceService {
  /**
   * Get all musculoskeletal tumor centers
   */
  async getCenters(params?: PaginationParams): Promise<Center[]> {
    const response = await apiClient.get<ApiResponse<Center[]>>('/centers', {
      params,
    });
    return response.data.data;
  }

  /**
   * Get center by ID
   */
  async getCenterById(id: string): Promise<Center> {
    const response = await apiClient.get<ApiResponse<Center>>(`/centers/${id}`);
    return response.data.data;
  }

  /**
   * Get all pathology types
   */
  async getPathologyTypes(): Promise<PathologyType[]> {
    const response = await apiClient.get<ApiResponse<PathologyType[]>>('/pathology-types');
    return response.data.data;
  }

  /**
   * Get WHO bone tumor classifications
   */
  async getWhoBoneTumors(params?: {
    category?: string;
    isMalignant?: boolean;
  }): Promise<WhoBoneTumor[]> {
    const response = await apiClient.get<WhoBoneTumor[]>(
      '/who-classifications/bone',
      { params }
    );
    return response.data;
  }

  /**
   * Get WHO bone tumor by ID
   */
  async getWhoBoneTumorById(id: string): Promise<WhoBoneTumor> {
    const response = await apiClient.get<WhoBoneTumor>(
      `/who-classifications/bone/${id}`
    );
    return response.data;
  }

  /**
   * Get WHO soft tissue tumor classifications
   */
  async getWhoSoftTissueTumors(params?: {
    category?: string;
    isMalignant?: boolean;
  }): Promise<WhoSoftTissueTumor[]> {
    const response = await apiClient.get<WhoSoftTissueTumor[]>(
      '/who-classifications/soft-tissue',
      { params }
    );
    return response.data;
  }

  /**
   * Get WHO soft tissue tumor by ID
   */
  async getWhoSoftTissueTumorById(id: string): Promise<WhoSoftTissueTumor> {
    const response = await apiClient.get<WhoSoftTissueTumor>(
      `/who-classifications/soft-tissue/${id}`
    );
    return response.data;
  }

  /**
   * Get bone locations (hierarchical)
   */
  async getBoneLocations(params?: {
    level?: number;
    parentId?: string;
  }): Promise<BoneLocation[]> {
    const response = await apiClient.get<BoneLocation[]>(
      '/locations/bone',
      { params }
    );
    return response.data;
  }

  /**
   * Get bone location by ID
   */
  async getBoneLocationById(id: string): Promise<BoneLocation> {
    const response = await apiClient.get<BoneLocation>(
      `/locations/bone/${id}`
    );
    return response.data;
  }

  /**
   * Get soft tissue locations
   */
  async getSoftTissueLocations(params?: {
    region?: string;
    category?: string;
  }): Promise<SoftTissueLocation[]> {
    const response = await apiClient.get<SoftTissueLocation[]>(
      '/locations/soft-tissue',
      { params }
    );
    return response.data;
  }

  /**
   * Get soft tissue location by ID
   */
  async getSoftTissueLocationById(id: string): Promise<SoftTissueLocation> {
    const response = await apiClient.get<SoftTissueLocation>(
      `/locations/soft-tissue/${id}`
    );
    return response.data;
  }

  /**
   * Get tumor syndromes
   */
  async getTumorSyndromes(): Promise<TumorSyndrome[]> {
    const response = await apiClient.get<TumorSyndrome[]>(
      '/tumor-syndromes'
    );
    return response.data;
  }

  /**
   * Get tumor syndrome by ID
   */
  async getTumorSyndromeById(id: string): Promise<TumorSyndrome> {
    const response = await apiClient.get<TumorSyndrome>(
      `/tumor-syndromes/${id}`
    );
    return response.data;
  }
}

export default new ReferenceService();
