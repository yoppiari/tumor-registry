import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section7Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const TREATMENT_MODALITIES = [
  { value: 'surgery', label: 'Surgery' },
  { value: 'chemotherapy', label: 'Chemotherapy' },
  { value: 'radiotherapy', label: 'Radiotherapy' },
  { value: 'targeted_therapy', label: 'Targeted Therapy' },
  { value: 'immunotherapy', label: 'Immunotherapy' },
  { value: 'palliative_care', label: 'Palliative Care' },
  { value: 'observation', label: 'Observation/Watchful Waiting' },
];

const CONFERENCE_DECISIONS = [
  { value: 'proceed_recommended', label: 'Proceed with Recommended Treatment' },
  { value: 'further_investigation', label: 'Further Investigation Required' },
  { value: 'refer_specialist', label: 'Refer to Specialist Center' },
  { value: 'palliative_approach', label: 'Palliative Approach' },
  { value: 'patient_declined', label: 'Patient Declined Treatment' },
  { value: 'other', label: 'Other (specify in notes)' },
];

const CONSULTANT_SPECIALTIES = [
  { value: 'orthopedic_oncology', label: 'Orthopedic Oncology' },
  { value: 'medical_oncology', label: 'Medical Oncology' },
  { value: 'radiation_oncology', label: 'Radiation Oncology' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'rehabilitation', label: 'Rehabilitation' },
  { value: 'palliative_care', label: 'Palliative Care' },
];

export const Section7CPCConference: React.FC<Section7Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  const handleModalityToggle = (modality: string) => {
    const currentModalities = formData.cpcRecommendedTreatment
      ? formData.cpcRecommendedTreatment.split(',').filter((s) => s.trim())
      : [];

    const modalityIndex = currentModalities.indexOf(modality);

    if (modalityIndex > -1) {
      currentModalities.splice(modalityIndex, 1);
    } else {
      currentModalities.push(modality);
    }

    updateFormData('cpcRecommendedTreatment', currentModalities.join(','));
  };

  const isModalitySelected = (modality: string) => {
    return formData.cpcRecommendedTreatment?.split(',').includes(modality) || false;
  };

  const handleConsultantToggle = (specialty: string) => {
    const currentConsultants = formData.attendingConsultants || [];
    const consultantIndex = currentConsultants.indexOf(specialty);

    if (consultantIndex > -1) {
      const newConsultants = [...currentConsultants];
      newConsultants.splice(consultantIndex, 1);
      updateFormData('attendingConsultants', newConsultants);
    } else {
      updateFormData('attendingConsultants', [...currentConsultants, specialty]);
    }
  };

  const isConsultantSelected = (specialty: string) => {
    return formData.attendingConsultants?.includes(specialty) || false;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 7: CPC Conference</h2>
      <p className="text-gray-600 mb-6">
        Cancer Patient Conference (CPC) - Multidisciplinary team discussion and treatment planning
      </p>

      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
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
                <strong>CPC Conference</strong> brings together orthopedic surgeons, medical oncologists,
                radiation oncologists, pathologists, radiologists, and other specialists to review each
                case and develop an optimal treatment plan.
              </p>
            </div>
          </div>
        </div>

        {/* CPC Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPC Conference Date
          </label>
          <input
            type="date"
            value={formData.cpcDate || ''}
            onChange={(e) => updateFormData('cpcDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attending Consultants Checklist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Attending Consultants
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CONSULTANT_SPECIALTIES.map((specialty) => (
              <label
                key={specialty.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isConsultantSelected(specialty.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isConsultantSelected(specialty.value)}
                  onChange={() => handleConsultantToggle(specialty.value)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 font-medium">{specialty.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Attending Team Members - Additional Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Attendees & Details
          </label>
          <textarea
            value={formData.cpcAttendees || ''}
            onChange={(e) => updateFormData('cpcAttendees', e.target.value)}
            placeholder="List specific names and any additional team members who attended the conference..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            e.g., Dr. John Smith (Orthopedic Surgeon), Dr. Jane Doe (Medical Oncologist), etc.
          </p>
        </div>

        {/* Case Presentation Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Presentation Summary
          </label>
          <textarea
            value={formData.cpcCaseSummary || ''}
            onChange={(e) => updateFormData('cpcCaseSummary', e.target.value)}
            placeholder="Brief summary of how the case was presented to the conference..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Recommended Treatment Modalities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Recommended Treatment Modalities
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TREATMENT_MODALITIES.map((modality) => (
              <label
                key={modality.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  isModalitySelected(modality.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isModalitySelected(modality.value)}
                  onChange={() => handleModalityToggle(modality.value)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 font-medium">{modality.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Treatment Plan Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Treatment Plan
          </label>
          <textarea
            value={formData.cpcTreatmentPlan || ''}
            onChange={(e) => updateFormData('cpcTreatmentPlan', e.target.value)}
            placeholder="Detailed description of the recommended treatment plan, including sequence, dosing, timing, surgical approach, etc..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Conference Decision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Conference Decision
          </label>
          <div className="space-y-2">
            {CONFERENCE_DECISIONS.map((decision) => (
              <label
                key={decision.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.cpcDecision === decision.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="cpcDecision"
                  value={decision.value}
                  checked={formData.cpcDecision === decision.value}
                  onChange={(e) => updateFormData('cpcDecision', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{decision.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes & Considerations
          </label>
          <textarea
            value={formData.cpcNotes || ''}
            onChange={(e) => updateFormData('cpcNotes', e.target.value)}
            placeholder="Any additional notes, concerns, or special considerations discussed during the conference..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Next Review Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Review/Follow-up Date
          </label>
          <input
            type="date"
            value={formData.cpcNextReviewDate || ''}
            onChange={(e) => updateFormData('cpcNextReviewDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            When should this case be reviewed again by the CPC team?
          </p>
        </div>
      </div>
    </div>
  );
};
