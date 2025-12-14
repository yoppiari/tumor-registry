import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section3Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const PRESENTING_SYMPTOMS = [
  { value: 'pain', label: 'Pain' },
  { value: 'swelling', label: 'Swelling' },
  { value: 'mass', label: 'Palpable Mass' },
  { value: 'pathological_fracture', label: 'Pathological Fracture' },
  { value: 'functional_impairment', label: 'Functional Impairment' },
  { value: 'restricted_motion', label: 'Restricted Motion' },
  { value: 'neurological_symptoms', label: 'Neurological Symptoms' },
];

const TUMOR_SYNDROMES = [
  'Li-Fraumeni Syndrome',
  'Neurofibromatosis Type 1',
  'Hereditary Retinoblastoma',
  'Multiple Osteochondromas',
  'Ollier Disease',
  'Maffucci Syndrome',
  'Paget Disease',
  'Fibrous Dysplasia',
  'Other',
];

export const Section3ClinicalData: React.FC<Section3Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  const handleSymptomToggle = (symptom: string) => {
    const currentSymptoms = formData.presentingSymptoms
      ? formData.presentingSymptoms.split(',').filter((s) => s.trim())
      : [];

    const symptomIndex = currentSymptoms.indexOf(symptom);

    if (symptomIndex > -1) {
      currentSymptoms.splice(symptomIndex, 1);
    } else {
      currentSymptoms.push(symptom);
    }

    updateFormData('presentingSymptoms', currentSymptoms.join(','));
  };

  const isSymptomSelected = (symptom: string) => {
    return formData.presentingSymptoms?.split(',').includes(symptom) || false;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 3: Clinical Data</h2>
      <p className="text-gray-600 mb-6">
        Clinical presentation and initial assessment information
      </p>

      <div className="space-y-6">
        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint
          </label>
          <textarea
            value={formData.chiefComplaint || ''}
            onChange={(e) => updateFormData('chiefComplaint', e.target.value)}
            placeholder="Describe the patient's main complaint..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Onset Date & Symptom Duration */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Symptom Onset
            </label>
            <input
              type="date"
              value={formData.onsetDate || ''}
              onChange={(e) => updateFormData('onsetDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptom Duration (months)
            </label>
            <input
              type="number"
              value={formData.symptomDuration || ''}
              onChange={(e) => updateFormData('symptomDuration', parseFloat(e.target.value))}
              placeholder="e.g., 6"
              min="0"
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Presenting Symptoms Checklist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Presenting Symptoms
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PRESENTING_SYMPTOMS.map((symptom) => (
              <label
                key={symptom.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isSymptomSelected(symptom.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSymptomSelected(symptom.value)}
                  onChange={() => handleSymptomToggle(symptom.value)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 font-medium">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tumor Size at Presentation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tumor Size at Presentation (cm)
          </label>
          <input
            type="number"
            value={formData.tumorSizeAtPresentation || ''}
            onChange={(e) => updateFormData('tumorSizeAtPresentation', parseFloat(e.target.value))}
            placeholder="e.g., 5.5"
            min="0"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Approximate diameter of the tumor in centimeters
          </p>
        </div>

        {/* Personal Cancer History */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Cancer History (Riwayat Kanker Pribadi)
          </label>
          <textarea
            value={formData.cancerHistory || ''}
            onChange={(e) => updateFormData('cancerHistory', e.target.value)}
            placeholder="Document any previous cancer diagnoses or treatments..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Family History of Cancer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family History of Cancer (Riwayat Kanker Keluarga)
          </label>
          <textarea
            value={formData.familyHistoryCancer || ''}
            onChange={(e) => updateFormData('familyHistoryCancer', e.target.value)}
            placeholder="Document any relevant family history of cancer..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Physical Examination */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Physical Examination (Pemeriksaan Fisik)
          </h3>

          <div className="space-y-4">
            {/* General Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Status (Status Generalisata)
              </label>
              <textarea
                value={formData.physicalExamGeneral || ''}
                onChange={(e) => updateFormData('physicalExamGeneral', e.target.value)}
                placeholder="General appearance, vital signs, nutritional status..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Head & Neck */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Head & Neck (Kepala & Leher)
              </label>
              <textarea
                value={formData.physicalExamHeadNeck || ''}
                onChange={(e) => updateFormData('physicalExamHeadNeck', e.target.value)}
                placeholder="Head and neck examination findings..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Thorax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thorax
              </label>
              <textarea
                value={formData.physicalExamThorax || ''}
                onChange={(e) => updateFormData('physicalExamThorax', e.target.value)}
                placeholder="Thorax examination findings..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Abdomen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abdomen
              </label>
              <textarea
                value={formData.physicalExamAbdomen || ''}
                onChange={(e) => updateFormData('physicalExamAbdomen', e.target.value)}
                placeholder="Abdominal examination findings..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Extremities & Spine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extremities & Spine (Ekstremitas & Tulang Belakang)
              </label>
              <textarea
                value={formData.physicalExamExtremitiesSpine || ''}
                onChange={(e) => updateFormData('physicalExamExtremitiesSpine', e.target.value)}
                placeholder="Extremities and spine examination findings..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Local Tumor Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local Tumor Status (Status Lokalisata)
          </label>
          <textarea
            value={formData.localTumorStatus || ''}
            onChange={(e) => updateFormData('localTumorStatus', e.target.value)}
            placeholder="Detailed description of the tumor location, size, consistency, mobility, surface characteristics, tenderness..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Include detailed local findings: location, dimensions, consistency, mobility, skin changes, etc.
          </p>
        </div>

        {/* Tumor Syndrome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Tumor Syndrome (if applicable)
          </label>
          <select
            value={formData.tumorSyndromeId || ''}
            onChange={(e) => updateFormData('tumorSyndromeId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None / Unknown</option>
            {TUMOR_SYNDROMES.map((syndrome) => (
              <option key={syndrome} value={syndrome}>
                {syndrome}
              </option>
            ))}
          </select>
        </div>

        {/* Karnofsky Performance Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Karnofsky Performance Score
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              value={formData.karnofskysScore || 100}
              onChange={(e) => updateFormData('karnofskysScore', parseInt(e.target.value))}
              min="0"
              max="100"
              step="10"
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-center w-20 h-12 bg-blue-100 border-2 border-blue-500 rounded-lg">
              <span className="text-xl font-bold text-blue-700">
                {formData.karnofskysScore || 100}
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0 (Dead)</span>
            <span>50 (Requires assistance)</span>
            <span>100 (Normal activity)</span>
          </div>
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
                Clinical data helps establish baseline patient condition and provides context
                for treatment planning and outcome assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
