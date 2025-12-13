import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section6Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

// Enneking Staging System for Musculoskeletal Sarcomas
const ENNEKING_STAGES = [
  {
    value: 'IA',
    label: 'Stage IA',
    description: 'Low-grade, intracompartmental',
  },
  {
    value: 'IB',
    label: 'Stage IB',
    description: 'Low-grade, extracompartmental',
  },
  {
    value: 'IIA',
    label: 'Stage IIA',
    description: 'High-grade, intracompartmental',
  },
  {
    value: 'IIB',
    label: 'Stage IIB',
    description: 'High-grade, extracompartmental',
  },
  {
    value: 'III',
    label: 'Stage III',
    description: 'Any grade with metastasis',
  },
];

// AJCC TNM Staging (8th Edition)
const AJCC_STAGES = [
  { value: 'Stage IA', label: 'Stage IA (T1, N0, M0, G1/GX)' },
  { value: 'Stage IB', label: 'Stage IB (T2-T4, N0, M0, G1/GX)' },
  { value: 'Stage II', label: 'Stage II (T1, N0, M0, G2/G3)' },
  { value: 'Stage IIIA', label: 'Stage IIIA (T2, N0, M0, G2/G3)' },
  { value: 'Stage IIIB', label: 'Stage IIIB (T3-T4, N0, M0, G2/G3)' },
  { value: 'Stage IVA', label: 'Stage IVA (Any T, N0, M1a, Any G)' },
  { value: 'Stage IVB', label: 'Stage IVB (Any T, N1, Any M, Any G or Any T, Any N, M1b, Any G)' },
];

// Common metastasis sites
const METASTASIS_SITES = [
  { value: 'lung', label: 'Lung' },
  { value: 'liver', label: 'Liver' },
  { value: 'bone', label: 'Bone (distant)' },
  { value: 'brain', label: 'Brain' },
  { value: 'lymph_nodes', label: 'Lymph Nodes' },
  { value: 'skin', label: 'Skin' },
  { value: 'other', label: 'Other' },
];

export const Section6Staging: React.FC<Section6Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  const handleMetastasisSiteToggle = (site: string) => {
    const currentSites = formData.metastasisSites
      ? formData.metastasisSites.split(',').filter((s) => s.trim())
      : [];

    const siteIndex = currentSites.indexOf(site);

    if (siteIndex > -1) {
      currentSites.splice(siteIndex, 1);
    } else {
      currentSites.push(site);
    }

    updateFormData('metastasisSites', currentSites.join(','));
  };

  const isMetastasisSiteSelected = (site: string) => {
    return formData.metastasisSites?.split(',').includes(site) || false;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 6: Staging</h2>
      <p className="text-gray-600 mb-6">
        Tumor staging using Enneking and AJCC systems
      </p>

      <div className="space-y-6">
        {/* Enneking Staging System */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Enneking Staging System</h3>
          <p className="text-sm text-gray-600 mb-4">
            Surgical staging system for musculoskeletal sarcomas
          </p>

          <div className="space-y-3">
            {ENNEKING_STAGES.map((stage) => (
              <label
                key={stage.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.ennekingStage === stage.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="ennekingStage"
                  value={stage.value}
                  checked={formData.ennekingStage === stage.value}
                  onChange={(e) => updateFormData('ennekingStage', e.target.value)}
                  className="w-5 h-5 text-blue-600 mt-0.5"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">{stage.label}</div>
                  <div className="text-sm text-gray-600">{stage.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* AJCC Staging System */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">AJCC Staging System (8th Edition)</h3>
          <p className="text-sm text-gray-600 mb-4">
            TNM-based staging for soft tissue and bone sarcomas
          </p>

          <div className="space-y-3">
            {AJCC_STAGES.map((stage) => (
              <label
                key={stage.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.ajccStage === stage.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="ajccStage"
                  value={stage.value}
                  checked={formData.ajccStage === stage.value}
                  onChange={(e) => updateFormData('ajccStage', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium text-sm">{stage.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Metastasis Information */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Metastasis Assessment</h3>

          {/* Metastasis Present */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Is metastasis present?
            </label>
            <div className="flex space-x-4">
              <label
                className={`flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.metastasisPresent === true
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="metastasisPresent"
                  value="true"
                  checked={formData.metastasisPresent === true}
                  onChange={() => updateFormData('metastasisPresent', true)}
                  className="w-5 h-5 text-red-600"
                />
                <span className="ml-3 font-medium">Yes</span>
              </label>

              <label
                className={`flex items-center px-6 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.metastasisPresent === false
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="metastasisPresent"
                  value="false"
                  checked={formData.metastasisPresent === false}
                  onChange={() => updateFormData('metastasisPresent', false)}
                  className="w-5 h-5 text-green-600"
                />
                <span className="ml-3 font-medium">No</span>
              </label>
            </div>
          </div>

          {/* Metastasis Sites (conditional) */}
          {formData.metastasisPresent === true && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Metastasis Sites
              </label>
              <div className="grid grid-cols-2 gap-3">
                {METASTASIS_SITES.map((site) => (
                  <label
                    key={site.value}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      isMetastasisSiteSelected(site.value)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isMetastasisSiteSelected(site.value)}
                      onChange={() => handleMetastasisSiteToggle(site.value)}
                      className="w-5 h-5 text-red-600 rounded"
                    />
                    <span className="ml-3 font-medium">{site.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Metastasis Details
                </label>
                <textarea
                  value={formData.metastasisSites || ''}
                  onChange={(e) => updateFormData('metastasisSites', e.target.value)}
                  placeholder="Provide additional details about metastatic sites, size, number of lesions, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-purple-400"
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
              <p className="text-sm text-purple-700">
                <strong>Staging Systems:</strong> The Enneking system is primarily used for surgical
                planning, while the AJCC TNM system is used for prognostic assessment and treatment
                planning. Both staging systems should be documented when applicable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
