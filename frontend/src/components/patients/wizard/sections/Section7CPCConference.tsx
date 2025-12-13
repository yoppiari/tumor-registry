'use client';

import React from 'react';
import { useFormContext } from '../FormContext';

// Types
interface Section7Data {
  cpcHeld?: boolean;
  cpcDate?: string;
  cpcLocation?: string;
  participants?: CPCParticipant[];
  casePresentation?: {
    presentedBy?: string;
    presentedByRole?: string;
    chiefComplaint?: string;
    clinicalFindings?: string;
    imagingFindings?: string;
    pathologyFindings?: string;
  };
  discussion?: {
    differentialDiagnosis?: string[];
    stagingDiscussion?: string;
    prognosticFactors?: string[];
    treatmentOptions?: string[];
  };
  recommendations?: {
    primaryTreatment?: string;
    surgicalApproach?: string;
    neoadjuvantTherapy?: boolean;
    adjuvantTherapy?: boolean;
    radiationIndicated?: boolean;
    followUpPlan?: string;
    additionalInvestigations?: string[];
  };
  consensus?: {
    reached?: boolean;
    finalDecision?: string;
    minorityOpinion?: string;
    reasonsForDissent?: string;
  };
  notes?: string;
}

interface CPCParticipant {
  name: string;
  specialty: string;
  role: 'PRESENTER' | 'CHAIR' | 'DISCUSSANT' | 'CONSULTANT';
}

// Specialty options for participants
const MEDICAL_SPECIALTIES = [
  'Orthopedic Oncology',
  'Orthopedic Surgery',
  'Medical Oncology',
  'Radiation Oncology',
  'Pathology',
  'Radiology',
  'Nuclear Medicine',
  'Pediatric Oncology',
  'Surgical Oncology',
  'Plastic Surgery',
  'Anesthesiology',
  'Rehabilitation Medicine',
];

// Common treatment modalities
const TREATMENT_MODALITIES = [
  'Wide Excision',
  'Limb Salvage Surgery',
  'Amputation',
  'Neoadjuvant Chemotherapy',
  'Adjuvant Chemotherapy',
  'Neoadjuvant Radiotherapy',
  'Adjuvant Radiotherapy',
  'Palliative Care',
  'Observation/Active Surveillance',
  'Clinical Trial Enrollment',
];

export function Section7CPCConference() {
  const { getSection, updateSection } = useFormContext();
  const sectionData: Partial<Section7Data> = (getSection('section7') as Section7Data) || {
    cpcHeld: true,
    participants: [],
    casePresentation: {},
    discussion: {
      differentialDiagnosis: [],
      prognosticFactors: [],
      treatmentOptions: [],
    },
    recommendations: {
      additionalInvestigations: [],
    },
    consensus: {},
  };

  // Update helpers
  const updateCPC = (field: string, value: any) => {
    updateSection('section7', {
      ...sectionData,
      [field]: value,
    });
  };

  const updateCasePresentation = (field: string, value: any) => {
    updateSection('section7', {
      ...sectionData,
      casePresentation: {
        ...sectionData.casePresentation,
        [field]: value,
      },
    });
  };

  const updateDiscussion = (field: string, value: any) => {
    updateSection('section7', {
      ...sectionData,
      discussion: {
        ...sectionData.discussion,
        [field]: value,
      },
    });
  };

  const updateRecommendations = (field: string, value: any) => {
    updateSection('section7', {
      ...sectionData,
      recommendations: {
        ...sectionData.recommendations,
        [field]: value,
      },
    });
  };

  const updateConsensus = (field: string, value: any) => {
    updateSection('section7', {
      ...sectionData,
      consensus: {
        ...sectionData.consensus,
        [field]: value,
      },
    });
  };

  // Participant management
  const addParticipant = () => {
    const newParticipant: CPCParticipant = {
      name: '',
      specialty: '',
      role: 'DISCUSSANT',
    };
    updateSection('section7', {
      ...sectionData,
      participants: [...(sectionData.participants || []), newParticipant],
    });
  };

  const updateParticipant = (index: number, field: keyof CPCParticipant, value: any) => {
    const updatedParticipants = [...(sectionData.participants || [])];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    updateSection('section7', {
      ...sectionData,
      participants: updatedParticipants,
    });
  };

  const removeParticipant = (index: number) => {
    const updatedParticipants = [...(sectionData.participants || [])];
    updatedParticipants.splice(index, 1);
    updateSection('section7', {
      ...sectionData,
      participants: updatedParticipants,
    });
  };

  // Array field toggles
  const toggleArrayItem = (field: 'differentialDiagnosis' | 'prognosticFactors' | 'treatmentOptions' | 'additionalInvestigations', value: string) => {
    const currentArray = field === 'additionalInvestigations'
      ? (sectionData.recommendations?.[field] || [])
      : (sectionData.discussion?.[field] || []);

    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    if (field === 'additionalInvestigations') {
      updateRecommendations(field, newArray);
    } else {
      updateDiscussion(field, newArray);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-300">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-purple-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-purple-900">Section 7: CPC Conference Documentation</h3>
            <p className="text-sm text-purple-800">Clinico-Pathological Conference - Multidisciplinary Team Discussion</p>
          </div>
        </div>
      </div>

      {/* CPC Held Toggle */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sectionData.cpcHeld ?? true}
            onChange={(e) => updateCPC('cpcHeld', e.target.checked)}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-lg font-semibold text-gray-900">
            CPC Conference Held for This Case
          </span>
        </label>
        <p className="text-sm text-gray-600 mt-1 ml-8">
          Toggle if a multidisciplinary Clinico-Pathological Conference was conducted
        </p>
      </div>

      {sectionData.cpcHeld && (
        <>
          {/* Conference Details */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Conference Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPC Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={sectionData.cpcDate || ''}
                  onChange={(e) => updateCPC('cpcDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location/Venue
                </label>
                <input
                  type="text"
                  value={sectionData.cpcLocation || ''}
                  onChange={(e) => updateCPC('cpcLocation', e.target.value)}
                  placeholder="e.g., Conference Room A, Main Hospital"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Conference Participants
              </h4>
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                + Add Participant
              </button>
            </div>

            {sectionData.participants && sectionData.participants.length > 0 ? (
              <div className="space-y-4">
                {sectionData.participants.map((participant, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                          placeholder="Dr. Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Specialty</label>
                        <select
                          value={participant.specialty}
                          onChange={(e) => updateParticipant(index, 'specialty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select...</option>
                          {MEDICAL_SPECIALTIES.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                          <select
                            value={participant.role}
                            onChange={(e) => updateParticipant(index, 'role', e.target.value as CPCParticipant['role'])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="PRESENTER">Presenter</option>
                            <option value="CHAIR">Chair</option>
                            <option value="DISCUSSANT">Discussant</option>
                            <option value="CONSULTANT">Consultant</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No participants added yet. Click "Add Participant" to add conference attendees.
              </p>
            )}
          </div>

          {/* Case Presentation */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Case Presentation
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Presented By</label>
                  <input
                    type="text"
                    value={sectionData.casePresentation?.presentedBy || ''}
                    onChange={(e) => updateCasePresentation('presentedBy', e.target.value)}
                    placeholder="Presenting physician name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                  <input
                    type="text"
                    value={sectionData.casePresentation?.presentedByRole || ''}
                    onChange={(e) => updateCasePresentation('presentedByRole', e.target.value)}
                    placeholder="e.g., Resident, Fellow, Consultant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint Summary</label>
                <textarea
                  value={sectionData.casePresentation?.chiefComplaint || ''}
                  onChange={(e) => updateCasePresentation('chiefComplaint', e.target.value)}
                  rows={2}
                  placeholder="Brief summary of the patient's chief complaint..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Findings</label>
                <textarea
                  value={sectionData.casePresentation?.clinicalFindings || ''}
                  onChange={(e) => updateCasePresentation('clinicalFindings', e.target.value)}
                  rows={3}
                  placeholder="Physical examination findings, tumor characteristics, functional limitations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imaging Findings</label>
                <textarea
                  value={sectionData.casePresentation?.imagingFindings || ''}
                  onChange={(e) => updateCasePresentation('imagingFindings', e.target.value)}
                  rows={3}
                  placeholder="X-ray, MRI, CT, PET findings summary..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pathology Findings</label>
                <textarea
                  value={sectionData.casePresentation?.pathologyFindings || ''}
                  onChange={(e) => updateCasePresentation('pathologyFindings', e.target.value)}
                  rows={3}
                  placeholder="Biopsy results, histology, immunohistochemistry findings..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Discussion */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              CPC Discussion
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staging Discussion</label>
                <textarea
                  value={sectionData.discussion?.stagingDiscussion || ''}
                  onChange={(e) => updateDiscussion('stagingDiscussion', e.target.value)}
                  rows={2}
                  placeholder="Discussion points about tumor staging (Enneking, AJCC)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Treatment Recommendations */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
            <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Treatment Recommendations (CPC Decision)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">
                  Primary Treatment Modality <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={sectionData.recommendations?.primaryTreatment || ''}
                  onChange={(e) => updateRecommendations('primaryTreatment', e.target.value)}
                  rows={2}
                  placeholder="e.g., Wide excision with limb salvage reconstruction..."
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Surgical Approach (if applicable)</label>
                <textarea
                  value={sectionData.recommendations?.surgicalApproach || ''}
                  onChange={(e) => updateRecommendations('surgicalApproach', e.target.value)}
                  rows={2}
                  placeholder="Detailed surgical plan, margin requirements, reconstruction method..."
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 p-3 bg-white rounded-md border border-green-300 cursor-pointer hover:bg-green-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={sectionData.recommendations?.neoadjuvantTherapy || false}
                    onChange={(e) => updateRecommendations('neoadjuvantTherapy', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Neoadjuvant Therapy</span>
                </label>

                <label className="flex items-center space-x-2 p-3 bg-white rounded-md border border-green-300 cursor-pointer hover:bg-green-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={sectionData.recommendations?.adjuvantTherapy || false}
                    onChange={(e) => updateRecommendations('adjuvantTherapy', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Adjuvant Therapy</span>
                </label>

                <label className="flex items-center space-x-2 p-3 bg-white rounded-md border border-green-300 cursor-pointer hover:bg-green-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={sectionData.recommendations?.radiationIndicated || false}
                    onChange={(e) => updateRecommendations('radiationIndicated', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Radiation Indicated</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-900 mb-1">Follow-up Plan</label>
                <textarea
                  value={sectionData.recommendations?.followUpPlan || ''}
                  onChange={(e) => updateRecommendations('followUpPlan', e.target.value)}
                  rows={2}
                  placeholder="Recommended follow-up schedule, imaging protocols..."
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Consensus */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Consensus & Final Decision
            </h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionData.consensus?.reached || false}
                  onChange={(e) => updateConsensus('reached', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-base font-semibold text-gray-900">
                  Consensus Reached
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Decision/Conclusion</label>
                <textarea
                  value={sectionData.consensus?.finalDecision || ''}
                  onChange={(e) => updateConsensus('finalDecision', e.target.value)}
                  rows={3}
                  placeholder="Summary of the final agreed-upon treatment plan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {!sectionData.consensus?.reached && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minority Opinion (if any)</label>
                    <textarea
                      value={sectionData.consensus?.minorityOpinion || ''}
                      onChange={(e) => updateConsensus('minorityOpinion', e.target.value)}
                      rows={2}
                      placeholder="Alternative viewpoints or dissenting opinions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reasons for Dissent</label>
                    <textarea
                      value={sectionData.consensus?.reasonsForDissent || ''}
                      onChange={(e) => updateConsensus('reasonsForDissent', e.target.value)}
                      rows={2}
                      placeholder="Explanation of why consensus was not reached..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Additional Notes
            </h4>
            <textarea
              value={sectionData.notes || ''}
              onChange={(e) => updateCPC('notes', e.target.value)}
              rows={4}
              placeholder="Any additional notes, action items, or important discussion points not captured above..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </>
      )}

      {/* Summary if CPC not held */}
      {!sectionData.cpcHeld && (
        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-yellow-900 mb-1">CPC Not Held</h4>
              <p className="text-sm text-yellow-800">
                No multidisciplinary conference was held for this case. Treatment decisions were made through alternative means.
                You can enable CPC documentation above if a conference was conducted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
