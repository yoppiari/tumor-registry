import React, { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { usePatientForm } from './usePatientForm';
import { Section1CenterType } from './sections/Section1CenterType';
import { Section2Identity } from './sections/Section2Identity';
import { Section3ClinicalData } from './sections/Section3ClinicalData';
import { Section4Diagnostics } from './sections/Section4Diagnostics';
import { Section5Diagnosis } from './sections/Section5Diagnosis';
import { Section6Staging } from './sections/Section6Staging';
import { Section7CPCConference } from './sections/Section7CPCConference';
import { Section8Treatment } from './sections/Section8Treatment';
import { Section9FollowUp } from './sections/Section9FollowUp';

export const PatientForm: React.FC = () => {
  const {
    currentStep,
    formData,
    sections,
    errors,
    updateFormData,
    updateMultipleFields,
    nextStep,
    previousStep,
    goToStep,
    resetForm,
  } = usePatientForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit to backend API using patient service
      const { patientService } = await import('../../../services');

      const createdPatient = await patientService.createPatient(formData);

      console.log('Patient created successfully:', createdPatient);
      alert(`Patient registered successfully!\nMedical Record Number: ${createdPatient.medicalRecordNumber}\nPatient ID: ${createdPatient.id}`);

      // Reset form after successful submission
      resetForm();

      // Optionally redirect to patient detail page
      // router.push(`/patients/${createdPatient.id}`);
    } catch (error: any) {
      console.error('Error submitting form:', error);

      // Handle specific error messages from API
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit form. Please try again.';

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <Section1CenterType
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <Section2Identity
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Section3ClinicalData
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Section4Diagnostics
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <Section5Diagnosis
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            updateMultipleFields={updateMultipleFields}
          />
        );
      case 6:
        return (
          <Section6Staging
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 7:
        return (
          <Section7CPCConference
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 8:
        return (
          <Section8Treatment
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 9:
        return (
          <Section9FollowUp
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />
        );
      case 10:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>
            <p className="text-gray-600 mb-6">
              Please review all information before submitting the patient registration
            </p>

            <div className="space-y-6">
              {/* Section 1 & 2: Basic Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Patient Identity</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Medical Record:</span> {formData.medicalRecordNumber || '-'}</div>
                  <div><span className="font-medium">NIK:</span> {formData.nik || '-'}</div>
                  <div><span className="font-medium">Name:</span> {formData.name || '-'}</div>
                  <div><span className="font-medium">DOB:</span> {formData.dateOfBirth || '-'}</div>
                  <div><span className="font-medium">Gender:</span> {formData.gender || '-'}</div>
                  <div><span className="font-medium">Phone:</span> {formData.phoneNumber || '-'}</div>
                </div>
              </div>

              {/* Section 3: Clinical */}
              {formData.chiefComplaint && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Clinical Data</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Chief Complaint:</span> {formData.chiefComplaint}</div>
                    {formData.karnofskysScore && <div><span className="font-medium">Karnofsky Score:</span> {formData.karnofskysScore}</div>}
                  </div>
                </div>
              )}

              {/* Section 5: Diagnosis */}
              {(formData.whoBoneTumorId || formData.whoSoftTissueTumorId) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Diagnosis</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Pathology Type:</span> {formData.pathologyType?.replace(/_/g, ' ')}</div>
                    {formData.histopathologyGrade && <div><span className="font-medium">Grade:</span> {formData.histopathologyGrade}</div>}
                  </div>
                </div>
              )}

              {/* Section 6: Staging */}
              {(formData.ennekingStage || formData.ajccStage) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Staging</h3>
                  <div className="text-sm space-y-2">
                    {formData.ennekingStage && <div><span className="font-medium">Enneking:</span> {formData.ennekingStage}</div>}
                    {formData.ajccStage && <div><span className="font-medium">AJCC:</span> {formData.ajccStage}</div>}
                    <div><span className="font-medium">Metastasis:</span> {formData.metastasisPresent ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              )}

              {/* Section 7: CPC */}
              {formData.cpcDate && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">CPC Conference</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Date:</span> {formData.cpcDate}</div>
                    {formData.cpcDecision && <div><span className="font-medium">Decision:</span> {formData.cpcDecision}</div>}
                  </div>
                </div>
              )}

              {/* Section 8: Treatment */}
              {formData.treatmentStartDate && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Treatment</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Start Date:</span> {formData.treatmentStartDate}</div>
                    {formData.surgeryType && <div><span className="font-medium">Surgery:</span> {formData.surgeryType}</div>}
                    {formData.treatmentResponse && <div><span className="font-medium">Response:</span> {formData.treatmentResponse}</div>}
                  </div>
                </div>
              )}

              {/* Section 9: Follow-up */}
              {formData.followUpSchedule && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">Follow-up Plan</h3>
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">Schedule:</span> {formData.followUpSchedule}</div>
                    {formData.survivalStatus && <div><span className="font-medium">Status:</span> {formData.survivalStatus}</div>}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Please verify all information is accurate before submitting.
                      You can use the "Previous" button to navigate back and edit any section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={10}
          steps={sections}
        />
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Section Content */}
          <div className="min-h-[500px]">{renderSection()}</div>

          {/* Navigation Buttons */}
          <div className="border-t px-8 py-6 flex justify-between">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200"
              >
                Reset Form
              </button>

              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-2 rounded-lg font-medium ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Patient Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
