import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section1Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const PATHOLOGY_TYPES = [
  { value: 'bone_tumor', label: 'Bone Tumor' },
  { value: 'soft_tissue_tumor', label: 'Soft Tissue Tumor' },
  { value: 'metastatic_bone_disease', label: 'Metastatic Bone Disease' },
];

// Sample centers - in production, fetch from API
const CENTERS = [
  { id: '1', name: 'RSUP Dr. Sardjito', city: 'Yogyakarta' },
  { id: '2', name: 'RSUP Dr. Cipto Mangunkusumo', city: 'Jakarta' },
  { id: '3', name: 'RSUP Dr. Hasan Sadikin', city: 'Bandung' },
  { id: '4', name: 'RSUP Dr. Soetomo', city: 'Surabaya' },
  { id: '5', name: 'RSUP Sanglah', city: 'Denpasar' },
];

export const Section1CenterType: React.FC<Section1Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  // Auto-generate input date on mount
  React.useEffect(() => {
    if (!formData.inputDate) {
      const today = new Date().toISOString().split('T')[0];
      updateFormData('inputDate', today);
    }
  }, [formData.inputDate, updateFormData]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 1: Center & Pathology Type</h2>
      <p className="text-gray-600 mb-6">
        Select the treatment center and type of musculoskeletal pathology
      </p>

      <div className="space-y-6">
        {/* Center Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Center <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.centerId}
            onChange={(e) => updateFormData('centerId', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.centerId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a center...</option>
            {CENTERS.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name} - {center.city}
              </option>
            ))}
          </select>
          {errors.centerId && (
            <p className="mt-1 text-sm text-red-500">{errors.centerId}</p>
          )}
        </div>

        {/* Consultant and Resident Names */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultant Name (Nama Sub.Sp/CF)
            </label>
            <input
              type="text"
              value={formData.consultantName || ''}
              onChange={(e) => updateFormData('consultantName', e.target.value)}
              placeholder="Dr. Specialist Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resident Name (Nama PPDS)
            </label>
            <input
              type="text"
              value={formData.residentName || ''}
              onChange={(e) => updateFormData('residentName', e.target.value)}
              placeholder="Dr. Resident Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Input Date (Auto-generated, Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Entry Date
          </label>
          <input
            type="date"
            value={formData.inputDate || ''}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Auto-generated date when this form was created
          </p>
        </div>

        {/* Pathology Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pathology Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {PATHOLOGY_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.pathologyType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="pathologyType"
                  value={type.value}
                  checked={formData.pathologyType === type.value}
                  onChange={(e) => updateFormData('pathologyType', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.pathologyType && (
            <p className="mt-1 text-sm text-red-500">{errors.pathologyType}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                The pathology type selection will determine which classification system
                and location options are available in later sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
