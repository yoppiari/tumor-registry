import apiClient, { ApiResponse, PaginationParams } from './api.config';
import { PatientFormData } from '../components/patients/form/usePatientForm';

export interface Patient {
  id: string;
  centerId: string;
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
  phoneNumber?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
  postalCode?: string;
  emergencyContact?: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto extends Omit<PatientFormData, 'id'> {
  // Transformation from form data to API format if needed
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export interface PatientListParams extends PaginationParams {
  centerId?: string;
  search?: string;
  status?: string;
  pathologyType?: string;
}

class PatientService {
  /**
   * Create a new patient record
   */
  async createPatient(data: PatientFormData): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  }

  /**
   * Get all patients with pagination and filters
   */
  async getPatients(params?: PatientListParams): Promise<{
    data: Patient[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        data: Patient[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>
    >('/patients', { params });
    return response.data.data;
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  }

  /**
   * Get patient by medical record number
   */
  async getPatientByMRN(mrn: string, centerId: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(
      `/patients/mrn/${mrn}`,
      {
        params: { centerId },
      }
    );
    return response.data.data;
  }

  /**
   * Update patient record
   */
  async updatePatient(id: string, data: UpdatePatientDto): Promise<Patient> {
    const response = await apiClient.patch<ApiResponse<Patient>>(
      `/patients/${id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete patient record
   */
  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  }

  /**
   * Search patients
   */
  async searchPatients(query: string, centerId?: string): Promise<Patient[]> {
    const response = await apiClient.get<ApiResponse<Patient[]>>('/patients/search', {
      params: { q: query, centerId },
    });
    return response.data.data;
  }

  /**
   * Get patient statistics
   */
  async getPatientStatistics(centerId?: string): Promise<{
    total: number;
    byPathologyType: Record<string, number>;
    byGender: Record<string, number>;
    byAgeGroup: Record<string, number>;
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total: number;
        byPathologyType: Record<string, number>;
        byGender: Record<string, number>;
        byAgeGroup: Record<string, number>;
      }>
    >('/patients/statistics', {
      params: { centerId },
    });
    return response.data.data;
  }

  /**
   * Export patients to CSV/Excel
   */
  async exportPatients(
    format: 'csv' | 'excel',
    filters?: PatientListParams
  ): Promise<Blob> {
    const response = await apiClient.get(`/patients/export/${format}`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new PatientService();
