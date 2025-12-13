'use client';

import React, { useState } from 'react';
import { useFormContext } from '../FormContext';
import { createPatient, transformWizardDataToPayload } from '@/services/patientApi';

export function Section10ReviewSubmit() {
  const { formData, clearDraft } = useFormContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Extract section data
  const section1 = formData.section1 || {};
  const section2 = formData.section2 || {};
  const section3 = formData.section3 || {};
  const section4 = formData.section4 || {};
  const section5 = formData.section5 || {};
  const section6 = formData.section6 || {};
  const section7 = formData.section7 || {};
  const section8 = formData.section8 || {};
  const section9 = formData.section9 || {};

  // Validation checks
  const validateSection1 = () => {
    return !!(section1.centerId && section1.pathologyTypeId);
  };

  const validateSection2 = () => {
    return !!(section2.nik && section2.name && section2.dateOfBirth && section2.gender);
  };

  const validateSection3 = () => {
    return !!(section3.chiefComplaint && section3.symptomOnset);
  };

  const validateSection5 = () => {
    return !!(section5.diagnosisDate && section5.whoClassificationId);
  };

  const sections = [
    {
      number: 1,
      title: 'Center & Pathology Type',
      isValid: validateSection1(),
      summary: `${section1.centerName || 'Not selected'} - ${section1.pathologyTypeName || 'Not selected'}`,
    },
    {
      number: 2,
      title: 'Patient Identity',
      isValid: validateSection2(),
      summary: `${section2.name || 'Not provided'} (NIK: ${section2.nik || 'N/A'})`,
    },
    {
      number: 3,
      title: 'Clinical Data',
      isValid: validateSection3(),
      summary: `${section3.chiefComplaint || 'Not provided'}`,
    },
    {
      number: 4,
      title: 'Diagnostic Investigations',
      isValid: true,
      summary: section4.biopsyType ? `Biopsy: ${section4.biopsyType}` : 'Not completed',
    },
    {
      number: 5,
      title: 'Diagnosis & Location',
      isValid: validateSection5(),
      summary: section5.whoClassificationName || 'Not selected',
    },
    {
      number: 6,
      title: 'Staging',
      isValid: true,
      summary: section6.enneking?.stage || section6.ajcc?.overallStage || 'Not staged',
    },
    {
      number: 7,
      title: 'CPC Conference',
      isValid: true,
      summary: section7.cpcHeld ? `CPC held on ${section7.cpcDate || 'date not set'}` : 'No CPC',
    },
    {
      number: 8,
      title: 'Treatment Management',
      isValid: true,
      summary: section8.surgery?.limbSalvageStatus || 'Not started',
    },
    {
      number: 9,
      title: 'Follow-up Management',
      isValid: true,
      summary: section9.visits?.length ? `${section9.visits.length} visits scheduled` : 'Not configured',
    },
  ];

  const allValid = sections.every(s => s.isValid);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Transform wizard data to API payload
      const payload = transformWizardDataToPayload(formData);

      console.log('Submitting patient data:', payload);

      // Call API to create patient
      const response = await createPatient(payload);

      console.log('Patient created successfully:', response);

      // Clear draft from localStorage
      if (clearDraft) {
        clearDraft();
      }

      // Show success state
      setSubmitSuccess(true);
      setShowConfirmDialog(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/patients';
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit patient record. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 border-2 border-blue-300">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-blue-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-blue-900">Section 10: Review & Submit</h3>
            <p className="text-sm text-blue-800">Review all entered data before final submission</p>
          </div>
        </div>
      </div>

      {/* Validation Status Banner */}
      {allValid ? (
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-green-900">All Required Fields Complete</h4>
              <p className="text-sm text-green-700">Form is ready for submission</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-yellow-900">Incomplete Required Fields</h4>
              <p className="text-sm text-yellow-700">Please complete all required sections marked below</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Summary Cards */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.number}
            className={`bg-white rounded-lg p-5 border-2 transition-all ${
              section.isValid
                ? 'border-green-200 hover:border-green-400'
                : 'border-red-200 hover:border-red-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Section Number Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    section.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {section.number}
                </div>

                {/* Section Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    {section.isValid ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{section.summary}</p>
                </div>
              </div>

              {/* Edit Button - Navigation handled by wizard */}
              <button
                type="button"
                onClick={() => console.log('Navigate to section', section.number)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium text-sm"
                title="Navigation will be implemented by wizard component"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Data Review */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detailed Data Preview
        </h4>

        <div className="space-y-6">
          {/* Section 1 Details */}
          <div className="border-l-4 border-blue-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 1: Center & Pathology Type</h5>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">Center:</dt>
                <dd className="font-medium text-gray-900">{section1.centerName || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Pathology Type:</dt>
                <dd className="font-medium text-gray-900">{section1.pathologyTypeName || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Section 2 Details */}
          <div className="border-l-4 border-green-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 2: Patient Identity</h5>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">NIK:</dt>
                <dd className="font-medium text-gray-900">{section2.nik || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Name:</dt>
                <dd className="font-medium text-gray-900">{section2.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Date of Birth:</dt>
                <dd className="font-medium text-gray-900">{section2.dateOfBirth || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Gender:</dt>
                <dd className="font-medium text-gray-900">{section2.gender || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Phone:</dt>
                <dd className="font-medium text-gray-900">{section2.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Email:</dt>
                <dd className="font-medium text-gray-900">{section2.email || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Section 3 Details */}
          <div className="border-l-4 border-purple-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 3: Clinical Data</h5>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">Chief Complaint:</dt>
                <dd className="font-medium text-gray-900">{section3.chiefComplaint || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Symptom Onset:</dt>
                <dd className="font-medium text-gray-900">{section3.symptomOnset || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Karnofsky Score:</dt>
                <dd className="font-medium text-gray-900">{section3.karnofskyScore || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Section 5 Details */}
          <div className="border-l-4 border-orange-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 5: Diagnosis & Location</h5>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">WHO Classification:</dt>
                <dd className="font-medium text-gray-900">{section5.whoClassificationName || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Diagnosis Date:</dt>
                <dd className="font-medium text-gray-900">{section5.diagnosisDate || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Tumor Grade:</dt>
                <dd className="font-medium text-gray-900">{section5.tumorGrade || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Section 6 Details */}
          <div className="border-l-4 border-pink-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 6: Staging</h5>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {section6.enneking?.stage && (
                <div>
                  <dt className="text-gray-600">Enneking Stage:</dt>
                  <dd className="font-medium text-gray-900">{section6.enneking.stage}</dd>
                </div>
              )}
              {section6.ajcc?.overallStage && (
                <div>
                  <dt className="text-gray-600">AJCC Stage:</dt>
                  <dd className="font-medium text-gray-900">{section6.ajcc.overallStage}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Section 7 Details */}
          <div className="border-l-4 border-indigo-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 7: CPC Conference</h5>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">CPC Held:</dt>
                <dd className="font-medium text-gray-900">{section7.cpcHeld ? 'Yes' : 'No'}</dd>
              </div>
              {section7.cpcHeld && (
                <>
                  <div>
                    <dt className="text-gray-600">CPC Date:</dt>
                    <dd className="font-medium text-gray-900">{section7.cpcDate || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Participants:</dt>
                    <dd className="font-medium text-gray-900">
                      {section7.participants?.length || 0} members
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600">Consensus Reached:</dt>
                    <dd className="font-medium text-gray-900">
                      {section7.consensus?.reached ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Section 8 Details */}
          <div className="border-l-4 border-yellow-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 8: Treatment Management</h5>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {section8.surgery?.limbSalvageStatus && (
                <div>
                  <dt className="text-gray-600">Limb Salvage Status:</dt>
                  <dd className="font-medium text-gray-900">{section8.surgery.limbSalvageStatus}</dd>
                </div>
              )}
              {section8.chemotherapy && (
                <div>
                  <dt className="text-gray-600">Chemotherapy:</dt>
                  <dd className="font-medium text-gray-900">
                    {section8.chemotherapy.neoadjuvant ? 'Neoadjuvant' : ''}
                    {section8.chemotherapy.neoadjuvant && section8.chemotherapy.adjuvant ? ' + ' : ''}
                    {section8.chemotherapy.adjuvant ? 'Adjuvant' : ''}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Section 9 Details */}
          <div className="border-l-4 border-teal-400 pl-4">
            <h5 className="font-semibold text-gray-900 mb-2">Section 9: Follow-up Management</h5>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <dt className="text-gray-600">Follow-up Visits:</dt>
                <dd className="font-medium text-gray-900">
                  {section9.visits?.length || 0} visits scheduled
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Completed Visits:</dt>
                <dd className="font-medium text-gray-900">
                  {section9.visits?.filter((v: any) => v.completed).length || 0} completed
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Ready to Submit?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Please review all sections carefully before final submission
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmDialog(true)}
            disabled={!allValid}
            className={`px-8 py-3 rounded-md font-semibold text-white transition-all ${
              allValid
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Patient Record
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-700 mb-4">
              Patient record has been successfully submitted to the INAMSOS registry.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to patients list...
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-lg font-semibold text-red-900 mb-1">Submission Error</h4>
              <p className="text-sm text-red-800">{submitError}</p>
              <button
                onClick={() => setSubmitError(null)}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Submission</h3>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to submit this patient record to the INAMSOS registry?
              This action will save all entered data and register the case.
            </p>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
