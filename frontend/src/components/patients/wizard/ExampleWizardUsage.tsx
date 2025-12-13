// @ts-nocheck
/**
 * Example: Complete Wizard Integration
 *
 * This file demonstrates how to integrate the multi-step wizard
 * for the 10-section musculoskeletal tumor registry form.
 *
 * Note: Type checking is disabled for this example file as it references
 * legacy section components with different prop types for demonstration purposes.
 */

import React from 'react';
import { MultiStepWizard, Section } from './MultiStepWizard';
import { FormProvider, useFormContext } from './FormContext';
import {
  validateSection1,
  validateSection2,
  validateSection3,
  validateSection4,
  validateSection5,
  validateSection6,
  validateSection7,
  validateSection8,
  validateSection9,
} from './ValidationUtils';

// Import section components
import { Section1CenterType } from '../form/sections/Section1CenterType';
import { Section2Identity } from '../form/sections/Section2Identity';
import { Section3ClinicalData } from '../form/sections/Section3ClinicalData';
import { Section4Diagnostics } from '../form/sections/Section4Diagnostics';
import { Section5Diagnosis } from '../form/sections/Section5Diagnosis';
import { Section6Staging } from '../form/sections/Section6Staging';
import { Section7CPCConference } from '../form/sections/Section7CPCConference';
import { Section8Treatment } from '../form/sections/Section8Treatment';
import { Section9FollowUp } from '../form/sections/Section9FollowUp';
import { Section10Review } from './sections/Section10Review';

/**
 * Define all 10 sections of the musculoskeletal tumor registry form
 */
const registrySections: Section[] = [
  {
    id: 'section1',
    title: 'Center & Pathology Type',
    description: 'Select your center and define the pathology type for this case',
    component: Section1CenterType,
    isOptional: false,
    validate: async (data) => validateSection1(data),
  },
  {
    id: 'section2',
    title: 'Patient Identity',
    description: 'Enter patient demographic and contact information',
    component: Section2Identity,
    isOptional: false,
    validate: async (data) => validateSection2(data),
  },
  {
    id: 'section3',
    title: 'Clinical Data',
    description: 'Document clinical presentation, symptoms, and physical examination',
    component: Section3ClinicalData,
    isOptional: true, // Clinical data can be added later
    validate: async (data) => validateSection3(data),
  },
  {
    id: 'section4',
    title: 'Diagnostic Investigations',
    description: 'Record biopsy results, imaging studies, and laboratory findings',
    component: Section4Diagnostics,
    isOptional: true,
    validate: async (data) => validateSection4(data),
  },
  {
    id: 'section5',
    title: 'Diagnosis & Location',
    description: 'WHO classification, tumor location, and histopathology details',
    component: Section5Diagnosis,
    isOptional: false,
    // Conditional rendering: only show if pathology type is selected
    shouldRender: (allData) => {
      const pathologyType = allData.section1?.pathologyType;
      return pathologyType !== undefined && pathologyType !== '';
    },
    validate: async (data, allData) => {
      const section1Data = allData?.section1 || {};
      return validateSection5(data, section1Data);
    },
  },
  {
    id: 'section6',
    title: 'Staging',
    description: 'Enneking stage, AJCC stage, tumor grade, and metastasis status',
    component: Section6Staging,
    isOptional: false,
    validate: async (data) => validateSection6(data),
  },
  {
    id: 'section7',
    title: 'CPC Conference',
    description: 'Cancer Patient Conference decisions and treatment recommendations',
    component: Section7CPCConference,
    isOptional: true, // CPC may not have occurred yet
    validate: async (data) => validateSection7(data),
  },
  {
    id: 'section8',
    title: 'Treatment Management',
    description: 'Surgical, chemotherapy, and radiotherapy treatment details',
    component: Section8Treatment,
    isOptional: true, // Treatment may not have started
    validate: async (data) => validateSection8(data),
  },
  {
    id: 'section9',
    title: 'Follow-up Plan',
    description: 'Schedule and plan for longitudinal follow-up visits',
    component: Section9FollowUp,
    isOptional: true,
    validate: async (data) => validateSection9(data),
  },
  {
    id: 'section10',
    title: 'Review & Submit',
    description: 'Review all information before final submission',
    component: Section10Review,
    isOptional: false,
    // No validation needed for review section
  },
];

/**
 * Main wizard component (inner component with context access)
 */
const PatientRegistrationWizardInner: React.FC = () => {
  const { clearDraft, getAllData } = useFormContext();

  /**
   * Handle final form submission
   */
  const handleComplete = async (data: any) => {
    try {
      console.log('Submitting patient data:', data);

      // Import patient service
      const { patientService } = await import('../../../services');

      // Transform wizard data to API format
      const patientData = transformWizardDataToAPI(data);

      // Submit to backend
      const createdPatient = await patientService.createPatient(patientData);

      console.log('Patient created successfully:', createdPatient);

      // Clear draft after successful submission
      clearDraft();

      // Show success message
      alert(
        `Patient registered successfully!\n\n` +
        `Medical Record Number: ${createdPatient.medicalRecordNumber}\n` +
        `Patient ID: ${createdPatient.id}\n\n` +
        `You can now view the patient details or add follow-up data.`
      );

      // Redirect to patient detail page
      // Note: You'll need to implement routing based on your setup
      // router.push(`/patients/${createdPatient.id}`);
    } catch (error: any) {
      console.error('Error submitting form:', error);

      // Handle specific error messages from API
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit patient registration. Please try again.';

      alert(`Submission Error:\n\n${errorMessage}`);
    }
  };

  /**
   * Handle draft saving (optional API integration)
   */
  const handleSaveDraft = async (data: any) => {
    try {
      console.log('Saving draft to API:', data);

      // Optional: Save to backend API
      // await api.saveDraft(data);

      console.log('Draft saved successfully (localStorage + API)');
    } catch (error) {
      console.error('Error saving draft to API:', error);
      // LocalStorage save still works even if API fails
    }
  };

  return (
    <MultiStepWizard
      sections={registrySections}
      onComplete={handleComplete}
      onSaveDraft={handleSaveDraft}
      autoSaveInterval={120000} // 2 minutes
      showSidebar={true}
      className="min-h-screen"
    />
  );
};

/**
 * Main wizard component with FormProvider wrapper
 */
export const PatientRegistrationWizard: React.FC = () => {
  return (
    <FormProvider
      autoSaveInterval={120000} // 2 minutes
      draftKey="tumor-registry-patient-form"
      onAutoSave={async (data) => {
        console.log('Auto-saving form data...');
        // Optional: Implement API auto-save here
      }}
    >
      <PatientRegistrationWizardInner />
    </FormProvider>
  );
};

/**
 * Helper function to transform wizard data structure to API format
 */
function transformWizardDataToAPI(wizardData: any): any {
  // Flatten the section-based structure into a flat object
  const apiData: any = {};

  Object.keys(wizardData).forEach((sectionId) => {
    const sectionData = wizardData[sectionId];
    Object.keys(sectionData).forEach((field) => {
      apiData[field] = sectionData[field];
    });
  });

  return apiData;
}

/**
 * Example: Standalone page component
 */
export default function NewPatientPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PatientRegistrationWizard />
    </div>
  );
}

/**
 * Example: Using with Next.js App Router
 *
 * File: app/patients/new/page.tsx
 *
 * import { PatientRegistrationWizard } from '@/components/patients/wizard/ExampleWizardUsage';
 *
 * export default function Page() {
 *   return <PatientRegistrationWizard />;
 * }
 */

/**
 * Example: Custom Section with Wizard Integration
 */
/*
import React from 'react';
import { SectionProps } from './MultiStepWizard';
import { useSectionData } from './FormContext';

export const CustomSection: React.FC<SectionProps> = ({
  data,
  updateField,
  errors,
  isActive,
}) => {
  // Alternative: Use scoped hook
  // const { data, updateField, validation } = useSectionData('section1');

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Custom Section Title
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Label
        </label>
        <input
          type="text"
          value={data.fieldName || ''}
          onChange={(e) => updateField('fieldName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.find(e => e.field === 'fieldName') && (
          <p className="text-red-600 text-sm mt-1">
            {errors.find(e => e.field === 'fieldName')?.message}
          </p>
        )}
      </div>
    </div>
  );
};
*/

/**
 * Example: Custom Validation
 */
/*
import { SectionData, SectionValidation, ValidationError } from './FormContext';
import { validateRequired, validateEmail } from './ValidationUtils';

export const validateCustomSection = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Use built-in validators
  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(data.email, 'Email');
  if (emailError) errors.push(emailError);

  // Custom validation logic
  if (data.tumorSize > 20 && !data.metastasisScreening) {
    errors.push({
      field: 'metastasisScreening',
      message: 'Metastasis screening is required for tumors larger than 20cm',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
*/
