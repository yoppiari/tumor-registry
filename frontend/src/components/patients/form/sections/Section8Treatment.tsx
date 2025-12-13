import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section8Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const SURGERY_TYPES = [
  { value: 'wide_excision', label: 'Wide Excision' },
  { value: 'marginal_excision', label: 'Marginal Excision' },
  { value: 'intralesional_curettage', label: 'Intralesional Curettage' },
  { value: 'limb_salvage', label: 'Limb-Salvage Surgery' },
  { value: 'amputation', label: 'Amputation' },
  { value: 'rotationplasty', label: 'Rotationplasty' },
  { value: 'endoprosthesis', label: 'Endoprosthetic Reconstruction' },
  { value: 'allograft', label: 'Allograft Reconstruction' },
  { value: 'autograft', label: 'Autograft Reconstruction' },
  { value: 'debulking', label: 'Debulking Surgery' },
  { value: 'palliative', label: 'Palliative Surgery' },
];

const TREATMENT_RESPONSES = [
  { value: 'complete_response', label: 'Complete Response (CR)' },
  { value: 'partial_response', label: 'Partial Response (PR)' },
  { value: 'stable_disease', label: 'Stable Disease (SD)' },
  { value: 'progressive_disease', label: 'Progressive Disease (PD)' },
  { value: 'not_evaluable', label: 'Not Evaluable' },
];

const CHEMOTHERAPY_PROTOCOLS = [
  'MAP (Methotrexate, Doxorubicin, Cisplatin)',
  'AP (Doxorubicin, Cisplatin)',
  'IE (Ifosfamide, Etoposide)',
  'VAC (Vincristine, Actinomycin D, Cyclophosphamide)',
  'AI (Doxorubicin, Ifosfamide)',
  'Gemcitabine + Docetaxel',
  'Pazopanib',
  'Other (specify in details)',
];

export const Section8Treatment: React.FC<Section8Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 8: Treatment Management</h2>
      <p className="text-gray-600 mb-6">
        Detailed documentation of treatment delivery and outcomes
      </p>

      <div className="space-y-6">
        {/* Treatment Timeline */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Treatment Timeline</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Start Date
              </label>
              <input
                type="date"
                value={formData.treatmentStartDate || ''}
                onChange={(e) => updateFormData('treatmentStartDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment End Date (if completed)
              </label>
              <input
                type="date"
                value={formData.treatmentEndDate || ''}
                onChange={(e) => updateFormData('treatmentEndDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Surgery Details */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Surgery</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surgery Date
              </label>
              <input
                type="date"
                value={formData.surgeryDate || ''}
                onChange={(e) => updateFormData('surgeryDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Surgery
              </label>
              <select
                value={formData.surgeryType || ''}
                onChange={(e) => updateFormData('surgeryType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select surgery type...</option>
                {SURGERY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surgery Details
              </label>
              <textarea
                value={formData.surgeryDetails || ''}
                onChange={(e) => updateFormData('surgeryDetails', e.target.value)}
                placeholder="Detailed surgical procedure, margins, resection extent, reconstruction method, complications, etc..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Chemotherapy */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Chemotherapy</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chemotherapy Protocol
              </label>
              <select
                value={formData.chemotherapyProtocol || ''}
                onChange={(e) => updateFormData('chemotherapyProtocol', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select protocol...</option>
                {CHEMOTHERAPY_PROTOCOLS.map((protocol) => (
                  <option key={protocol} value={protocol}>
                    {protocol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cycles Planned/Completed
              </label>
              <input
                type="number"
                value={formData.chemotherapyCycles || ''}
                onChange={(e) => updateFormData('chemotherapyCycles', parseInt(e.target.value))}
                placeholder="e.g., 6"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Radiotherapy */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Radiotherapy</h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Dose (Gy)
              </label>
              <input
                type="number"
                value={formData.radiotherapyDose || ''}
                onChange={(e) => updateFormData('radiotherapyDose', parseFloat(e.target.value))}
                placeholder="e.g., 50"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Fractions
              </label>
              <input
                type="number"
                value={formData.radiotherapyFractions || ''}
                onChange={(e) => updateFormData('radiotherapyFractions', parseInt(e.target.value))}
                placeholder="e.g., 25"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Treatment Response */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Treatment Response (RECIST Criteria)
          </label>
          <div className="space-y-2">
            {TREATMENT_RESPONSES.map((response) => (
              <label
                key={response.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.treatmentResponse === response.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="treatmentResponse"
                  value={response.value}
                  checked={formData.treatmentResponse === response.value}
                  onChange={(e) => updateFormData('treatmentResponse', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{response.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Complications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complications
          </label>
          <textarea
            value={formData.complications || ''}
            onChange={(e) => updateFormData('complications', e.target.value)}
            placeholder="Document any surgical or treatment-related complications..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Adverse Events */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adverse Events (Chemotherapy/Radiotherapy)
          </label>
          <textarea
            value={formData.adverseEvents || ''}
            onChange={(e) => updateFormData('adverseEvents', e.target.value)}
            placeholder="Document adverse events related to chemotherapy or radiotherapy (grade, management, etc.)..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Use CTCAE grading system when applicable
          </p>
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
                <strong>Note:</strong> Detailed treatment records, surgical reports, and chemotherapy
                regimens can be uploaded separately. This section captures the summary of treatment delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
