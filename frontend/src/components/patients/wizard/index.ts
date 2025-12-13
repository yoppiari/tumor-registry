/**
 * Multi-Step Wizard Infrastructure - Public API
 *
 * Export all public components, hooks, and utilities for the wizard framework.
 */

// Main Components
export { MultiStepWizard } from './MultiStepWizard';
export type { Section, SectionProps, MultiStepWizardProps } from './MultiStepWizard';

// State Management
export { FormProvider, useFormContext, useSectionData } from './FormContext';
export type {
  SectionData,
  FormState,
  ValidationError,
  SectionValidation,
  FormContextValue,
} from './FormContext';

// Navigation Components
export { SectionNavigator, CompactSectionNavigator } from './SectionNavigator';
export type { NavigatorSection, SectionNavigatorProps } from './SectionNavigator';

// Progress Indicators
export {
  ProgressIndicator,
  StepDots,
  LinearProgress,
} from './ProgressIndicator';
export type { ProgressStep, ProgressIndicatorProps } from './ProgressIndicator';

// Validation Utilities
export {
  // Field validators
  validateRequired,
  validateEmail,
  validateNIK,
  validatePhoneNumber,
  validateDate,
  validateDateOfBirth,
  validateNumber,
  validateLength,
  validateKarnofskyScore,
  validateMedicalRecordNumber,
  // Section validators
  validateSection1,
  validateSection2,
  validateSection3,
  validateSection4,
  validateSection5,
  validateSection6,
  validateSection7,
  validateSection8,
  validateSection9,
  // Cross-section validation
  validateCrossSections,
  validateAllSections,
} from './ValidationUtils';

// Section Components
export { Section10Review } from './sections/Section10Review';

// Example Integration (commented out due to type incompatibility with old section components)
// export { PatientRegistrationWizard } from './ExampleWizardUsage';
