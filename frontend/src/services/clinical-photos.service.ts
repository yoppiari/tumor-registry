import apiClient from './api.config';

export interface ClinicalPhoto {
  file: File;
  preview: string;
  description?: string;
  viewAngle?: 'ANTERIOR' | 'POSTERIOR' | 'LATERAL_LEFT' | 'LATERAL_RIGHT' | 'OTHER';
}

export interface UploadClinicalPhotoParams {
  patientId: string;
  file: File;
  viewType?: string;
  anatomicalLocation?: string;
  description?: string;
}

class ClinicalPhotosService {
  /**
   * Upload a single clinical photo
   */
  async uploadPhoto(params: UploadClinicalPhotoParams) {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('patientId', params.patientId);

    if (params.viewType) {
      formData.append('viewType', params.viewType);
    }
    if (params.anatomicalLocation) {
      formData.append('anatomicalLocation', params.anatomicalLocation);
    }
    if (params.description) {
      formData.append('description', params.description);
    }

    const response = await apiClient.post('/clinical-photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Upload multiple clinical photos for a patient
   */
  async uploadMultiplePhotos(patientId: string, photos: ClinicalPhoto[]) {
    const uploadPromises = photos.map((photo) =>
      this.uploadPhoto({
        patientId,
        file: photo.file,
        viewType: photo.viewAngle,
        description: photo.description,
      })
    );

    const results = await Promise.all(uploadPromises);
    return results;
  }

  /**
   * Get all clinical photos for a patient
   */
  async getPhotosByPatient(patientId: string) {
    const response = await apiClient.get(`/clinical-photos/patient/${patientId}`);
    return response.data;
  }

  /**
   * Delete a clinical photo
   */
  async deletePhoto(id: string) {
    const response = await apiClient.delete(`/clinical-photos/${id}`);
    return response.data;
  }
}

export default new ClinicalPhotosService();
