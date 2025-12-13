import apiClient from './api.config';

export enum MedicalImageType {
  HISTOLOGY = 'HISTOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  CLINICAL_PHOTO = 'CLINICAL_PHOTO',
  PATHOLOGY = 'PATHOLOGY',
  ENDOSCOPY = 'ENDOSCOPY',
  ULTRASOUND = 'ULTRASOUND',
  CT_SCAN = 'CT_SCAN',
  MRI = 'MRI',
  XRAY = 'XRAY',
  PET_SCAN = 'PET_SCAN',
  MAMMOGRAPHY = 'MAMMOGRAPHY',
  OTHER = 'OTHER',
}

export enum ImageCategory {
  HISTOLOGY = 'HISTOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  CLINICAL = 'CLINICAL',
  PATHOLOGY = 'PATHOLOGY',
  DIAGNOSTIC = 'DIAGNOSTIC',
  SURGICAL = 'SURGICAL',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  OTHER = 'OTHER',
}

export interface MedicalImage {
  id: string;
  patientId: string;
  recordId?: string;
  imageType: MedicalImageType;
  category: ImageCategory;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  description?: string;
  findings?: string;
  bodyPart?: string;
  modality?: string;
  studyDate?: string;
  seriesNumber?: string;
  instanceNumber?: string;
  tags?: string[];
  isDicom?: boolean;
  width?: number;
  height?: number;
  thumbnailPath?: string;
  compressedPath?: string;
  isCompressed?: boolean;
  compressionRatio?: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadImageDto {
  patientId: string;
  recordId?: string;
  imageType: MedicalImageType;
  category: ImageCategory;
  description?: string;
  findings?: string;
  bodyPart?: string;
  modality?: string;
  studyDate?: string;
  seriesNumber?: string;
  instanceNumber?: string;
  tags?: string[];
  isDicom?: boolean;
  dicomMetadata?: any;
  annotations?: any;
}

class MedicalImagingService {
  /**
   * Upload a medical image file with metadata
   */
  async uploadImage(
    file: File,
    metadata: UploadImageDto,
    onProgress?: (progress: number) => void
  ): Promise<MedicalImage> {
    const formData = new FormData();
    formData.append('file', file);

    // Append metadata fields
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<MedicalImage>(
      '/medical-imaging/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  }

  /**
   * Get all medical images with optional filters
   */
  async getAllImages(params?: {
    patientId?: string;
    imageType?: MedicalImageType;
    category?: ImageCategory;
    page?: number;
    limit?: number;
  }): Promise<MedicalImage[]> {
    const response = await apiClient.get<MedicalImage[]>('/medical-imaging', { params });
    return response.data;
  }

  /**
   * Get medical image by ID
   */
  async getImageById(id: string): Promise<MedicalImage> {
    const response = await apiClient.get<MedicalImage>(`/medical-imaging/${id}`);
    return response.data;
  }

  /**
   * Get images for a specific patient
   */
  async getImagesByPatient(patientId: string): Promise<MedicalImage[]> {
    const response = await apiClient.get<MedicalImage[]>(
      `/medical-imaging/patient/${patientId}`
    );
    return response.data;
  }

  /**
   * Download image file
   */
  async downloadImage(id: string): Promise<Blob> {
    const response = await apiClient.get(`/medical-imaging/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get image thumbnail
   */
  getThumbnailUrl(id: string): string {
    return `${apiClient.defaults.baseURL}/medical-imaging/${id}/thumbnail`;
  }

  /**
   * Update image metadata
   */
  async updateImage(
    id: string,
    updateData: Partial<UploadImageDto>
  ): Promise<MedicalImage> {
    const response = await apiClient.put<MedicalImage>(
      `/medical-imaging/${id}`,
      updateData
    );
    return response.data;
  }

  /**
   * Delete an image
   */
  async deleteImage(id: string): Promise<void> {
    await apiClient.delete(`/medical-imaging/${id}`);
  }

  /**
   * Validate file type for medical imaging
   */
  isValidImageFile(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'application/dicom',
      'image/dicom',
    ];
    return validTypes.includes(file.type);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default new MedicalImagingService();
