import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section4Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const BIOPSY_TYPES = [
  { value: 'Incisional', label: 'Incisional Biopsy' },
  { value: 'Excisional', label: 'Excisional Biopsy' },
  { value: 'Core needle', label: 'Core Needle Biopsy' },
  { value: 'Fine needle aspiration', label: 'Fine Needle Aspiration (FNA)' },
  { value: 'Bone biopsy', label: 'Bone Biopsy' },
  { value: 'Soft tissue biopsy', label: 'Soft Tissue Biopsy' },
];

const IMAGING_MODALITIES = [
  { value: 'xray', label: 'X-Ray' },
  { value: 'ct', label: 'CT Scan' },
  { value: 'mri', label: 'MRI' },
  { value: 'pet_ct', label: 'PET-CT' },
  { value: 'bone_scan', label: 'Bone Scan' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'angiography', label: 'Angiography' },
];

export const Section4Diagnostics: React.FC<Section4Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  const handleImagingToggle = (modality: string) => {
    const currentImaging = formData.imagingStudies
      ? formData.imagingStudies.split(',').filter((s) => s.trim())
      : [];

    const modalityIndex = currentImaging.indexOf(modality);

    if (modalityIndex > -1) {
      currentImaging.splice(modalityIndex, 1);
    } else {
      currentImaging.push(modality);
    }

    updateFormData('imagingStudies', currentImaging.join(','));
  };

  const isImagingSelected = (modality: string) => {
    return formData.imagingStudies?.split(',').includes(modality) || false;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 4: Diagnostic Investigations</h2>
      <p className="text-gray-600 mb-6">
        Biopsy information and imaging studies performed
      </p>

      <div className="space-y-6">
        {/* Biopsy Information */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Biopsy Information</h3>

          <div className="space-y-4">
            {/* Biopsy Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biopsy Date
              </label>
              <input
                type="date"
                value={formData.biopsyDate || ''}
                onChange={(e) => updateFormData('biopsyDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Biopsy Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biopsy Type
              </label>
              <select
                value={formData.biopsyType || ''}
                onChange={(e) => updateFormData('biopsyType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select biopsy type...</option>
                {BIOPSY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Biopsy Result */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biopsy Result / Preliminary Findings
              </label>
              <textarea
                value={formData.biopsyResult || ''}
                onChange={(e) => updateFormData('biopsyResult', e.target.value)}
                placeholder="Document the biopsy findings and preliminary diagnosis..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Include preliminary histopathological findings if available
              </p>
            </div>
          </div>
        </div>

        {/* Imaging Studies */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Imaging Studies Performed</h3>

          <div className="grid grid-cols-2 gap-3">
            {IMAGING_MODALITIES.map((modality) => (
              <label
                key={modality.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isImagingSelected(modality.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isImagingSelected(modality.value)}
                  onChange={() => handleImagingToggle(modality.value)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 font-medium">{modality.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imaging Findings Summary
            </label>
            <textarea
              value={formData.imagingStudies || ''}
              onChange={(e) => updateFormData('imagingStudies', e.target.value)}
              placeholder="Summarize key findings from imaging studies..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Describe tumor characteristics, size, location, and any notable features
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Detailed pathology reports and imaging files can be
                uploaded separately after initial patient registration. This section
                captures preliminary diagnostic information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
