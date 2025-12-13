'use client';

import React from 'react';
import { MedicalImageUploader } from './MedicalImageUploader';
import { MedicalImageType, ImageCategory, MedicalImage } from '@/services/medical-imaging.service';

interface PathologyReportUploaderProps {
  patientId: string;
  onUploadComplete?: (image: MedicalImage) => void;
}

/**
 * Specialized uploader for pathology reports
 * Uses the Medical Imaging infrastructure with pathology-specific defaults
 */
export const PathologyReportUploader: React.FC<PathologyReportUploaderProps> = ({
  patientId,
  onUploadComplete,
}) => {
  return (
    <div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-purple-900 mb-2">Pathology Report Upload</h3>
        <p className="text-sm text-purple-700">
          Upload pathology reports including histology slides, microscopy images, and pathology
          documents. Supported formats: JPG, PNG, TIFF, PDF, DICOM.
        </p>
      </div>

      <MedicalImageUploader
        patientId={patientId}
        onUploadComplete={onUploadComplete}
        allowedTypes={[
          MedicalImageType.PATHOLOGY,
          MedicalImageType.HISTOLOGY,
        ]}
        category={ImageCategory.PATHOLOGY}
      />
    </div>
  );
};
