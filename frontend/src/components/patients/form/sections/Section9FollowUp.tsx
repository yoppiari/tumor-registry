import React from 'react';
import { PatientFormData } from '../usePatientForm';

interface Section9Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

const FOLLOW_UP_SCHEDULES = [
  { value: 'q3mo_2yr', label: 'Every 3 months for 2 years' },
  { value: 'q4mo_3yr', label: 'Every 4 months for 3 years' },
  { value: 'q6mo_5yr', label: 'Every 6 months for 5 years' },
  { value: 'annual', label: 'Annual follow-up' },
  { value: 'custom', label: 'Custom schedule (specify below)' },
];

const SURVIVAL_STATUS = [
  { value: 'alive_no_disease', label: 'Alive - No Evidence of Disease (NED)' },
  { value: 'alive_with_disease', label: 'Alive - With Disease' },
  { value: 'alive_recurrence', label: 'Alive - Recurrence' },
  { value: 'deceased_disease', label: 'Deceased - Disease Related' },
  { value: 'deceased_other', label: 'Deceased - Other Cause' },
  { value: 'lost_to_followup', label: 'Lost to Follow-up' },
  { value: 'unknown', label: 'Unknown' },
];

const FUNCTIONAL_STATUS_LEVELS = [
  { value: 'msts_excellent', label: 'MSTS Excellent (24-30)' },
  { value: 'msts_good', label: 'MSTS Good (18-23)' },
  { value: 'msts_fair', label: 'MSTS Fair (12-17)' },
  { value: 'msts_poor', label: 'MSTS Poor (<12)' },
  { value: 'not_assessed', label: 'Not Yet Assessed' },
];

const QOL_SCORES = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'not_assessed', label: 'Not Assessed' },
];

export const Section9FollowUp: React.FC<Section9Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">Section 9: Follow-up Plan</h2>
      <p className="text-gray-600 mb-6">
        Post-treatment surveillance and long-term outcome monitoring
      </p>

      <div className="space-y-6">
        {/* Follow-up Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Follow-up Schedule
          </label>
          <div className="space-y-2">
            {FOLLOW_UP_SCHEDULES.map((schedule) => (
              <label
                key={schedule.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.followUpSchedule === schedule.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="followUpSchedule"
                  value={schedule.value}
                  checked={formData.followUpSchedule === schedule.value}
                  onChange={(e) => updateFormData('followUpSchedule', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{schedule.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Next Follow-up Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Scheduled Follow-up Date
          </label>
          <input
            type="date"
            value={formData.nextFollowUpDate || ''}
            onChange={(e) => updateFormData('nextFollowUpDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Monitoring Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monitoring Plan Details
          </label>
          <textarea
            value={formData.monitoringPlan || ''}
            onChange={(e) => updateFormData('monitoringPlan', e.target.value)}
            placeholder="Describe the overall monitoring plan, including clinical assessments, frequency, and any special considerations..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Imaging Follow-up */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Imaging Surveillance</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imaging Follow-up Protocol
            </label>
            <textarea
              value={formData.imagingFollowUp || ''}
              onChange={(e) => updateFormData('imagingFollowUp', e.target.value)}
              placeholder="e.g., Chest X-ray every 3 months for 2 years, then every 6 months. Local MRI every 6 months for 2 years..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Specify imaging modalities, frequency, and duration for local and metastatic surveillance
            </p>
          </div>
        </div>

        {/* Laboratory Follow-up */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Laboratory Surveillance</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Laboratory Follow-up Protocol
            </label>
            <textarea
              value={formData.labFollowUp || ''}
              onChange={(e) => updateFormData('labFollowUp', e.target.value)}
              placeholder="e.g., ALP and LDH every 3 months for osteosarcoma patients. CBC and metabolic panel as needed..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Specify tumor markers, lab tests, and frequency
            </p>
          </div>
        </div>

        {/* Functional Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Functional Status (MSTS Score)
          </label>
          <div className="space-y-2">
            {FUNCTIONAL_STATUS_LEVELS.map((status) => (
              <label
                key={status.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.functionalStatus === status.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="functionalStatus"
                  value={status.value}
                  checked={formData.functionalStatus === status.value}
                  onChange={(e) => updateFormData('functionalStatus', e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <span className="ml-3 font-medium">{status.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            MSTS = Musculoskeletal Tumor Society Functional Rating System
          </p>
        </div>

        {/* Quality of Life */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quality of Life Assessment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {QOL_SCORES.map((qol) => (
              <label
                key={qol.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.qualityOfLife === qol.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="qualityOfLife"
                  value={qol.value}
                  checked={formData.qualityOfLife === qol.value}
                  onChange={(e) => updateFormData('qualityOfLife', e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 font-medium">{qol.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Survival Status */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Survival Status</h3>
          <div className="space-y-2 mb-4">
            {SURVIVAL_STATUS.map((status) => (
              <label
                key={status.value}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.survivalStatus === status.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="survivalStatus"
                  value={status.value}
                  checked={formData.survivalStatus === status.value}
                  onChange={(e) => updateFormData('survivalStatus', e.target.value)}
                  className="w-5 h-5 text-purple-600"
                />
                <span className="ml-3 font-medium">{status.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Last Contact
            </label>
            <input
              type="date"
              value={formData.dateOfLastContact || ''}
              onChange={(e) => updateFormData('dateOfLastContact', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
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
              <p className="text-sm text-green-700">
                <strong>Long-term Follow-up:</strong> Regular surveillance is critical for early
                detection of recurrence or metastasis. Follow-up protocols should be individualized
                based on tumor type, grade, stage, and treatment response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
