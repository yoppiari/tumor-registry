# Multi-Step Wizard Infrastructure

Comprehensive multi-step form wizard framework for the Indonesian Musculoskeletal Tumor Registry.

## Features

- **Reusable Architecture**: Flexible section-based wizard that can be adapted to any multi-step form
- **Auto-Save**: Automatic draft saving every 2 minutes (configurable) with localStorage backup
- **Smart Validation**: Field-level, section-level, and cross-section validation
- **Progress Tracking**: Visual progress indicators with completion status
- **Section Navigation**: Sidebar navigation with status indicators (completed ✓, current →, error ⚠️)
- **Conditional Rendering**: Sections can be shown/hidden based on previous answers
- **Draft Management**: Load and resume incomplete forms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Mobile Responsive**: Works seamlessly on all device sizes
- **TypeScript**: Full type safety throughout

## Architecture

```
wizard/
├── FormContext.tsx              # State management for entire form
├── MultiStepWizard.tsx          # Main wizard container component
├── ProgressIndicator.tsx        # Visual progress tracking
├── SectionNavigator.tsx         # Sidebar navigation
├── ValidationUtils.ts           # Validation functions
├── sections/
│   └── Section10Review.tsx      # Review section component
└── README.md                    # This file
```

## Quick Start

### 1. Wrap your app with FormProvider

```tsx
import { FormProvider } from '@/components/patients/wizard/FormContext';

function App() {
  return (
    <FormProvider
      autoSaveInterval={120000}  // 2 minutes
      draftKey="patient-form-draft"
      onAutoSave={async (data) => {
        // Optional: Save to backend API
        await api.saveDraft(data);
      }}
    >
      <YourWizardComponent />
    </FormProvider>
  );
}
```

### 2. Create Section Components

Each section component receives these props:

```tsx
interface SectionProps {
  data: SectionData;              // Section's data
  updateData: (data) => void;     // Update entire section
  updateField: (field, value) => void;  // Update single field
  errors: ValidationError[];      // Validation errors
  isActive: boolean;              // Whether section is currently shown
}
```

Example section:

```tsx
import React from 'react';
import { SectionProps } from '../MultiStepWizard';

export const Section1CenterType: React.FC<SectionProps> = ({
  data,
  updateField,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Center
        </label>
        <select
          value={data.centerId || ''}
          onChange={(e) => updateField('centerId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Center</option>
          <option value="rsup-cipto">RSUP Cipto Mangunkusumo</option>
          {/* More options */}
        </select>
        {errors.find(e => e.field === 'centerId') && (
          <p className="text-red-600 text-sm mt-1">
            {errors.find(e => e.field === 'centerId')?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pathology Type
        </label>
        <select
          value={data.pathologyType || ''}
          onChange={(e) => updateField('pathologyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Type</option>
          <option value="bone_tumor">Bone Tumor</option>
          <option value="soft_tissue_tumor">Soft Tissue Tumor</option>
        </select>
      </div>
    </div>
  );
};
```

### 3. Define Sections and Validation

```tsx
import { Section } from '@/components/patients/wizard/MultiStepWizard';
import {
  validateSection1,
  validateSection2,
  // ... import other validators
} from '@/components/patients/wizard/ValidationUtils';

const sections: Section[] = [
  {
    id: 'section1',
    title: 'Center & Pathology Type',
    description: 'Select your center and pathology type',
    component: Section1CenterType,
    isOptional: false,
    validate: (data, allData) => validateSection1(data),
  },
  {
    id: 'section2',
    title: 'Patient Identity',
    description: 'Enter patient demographic information',
    component: Section2Identity,
    validate: (data) => validateSection2(data),
  },
  {
    id: 'section3',
    title: 'Clinical Data',
    description: 'Clinical presentation and examination',
    component: Section3ClinicalData,
    isOptional: true,  // Optional section
    validate: (data) => validateSection3(data),
  },
  {
    id: 'section5',
    title: 'Diagnosis & Location',
    component: Section5Diagnosis,
    // Conditional rendering - only show if pathology type is selected
    shouldRender: (allData) => {
      return allData.section1?.pathologyType !== undefined;
    },
    validate: (data, allData) => validateSection5(data, allData.section1),
  },
  // ... more sections
  {
    id: 'section10',
    title: 'Review & Submit',
    component: Section10Review,
    isOptional: false,
  },
];
```

### 4. Use MultiStepWizard

```tsx
import { MultiStepWizard } from '@/components/patients/wizard/MultiStepWizard';
import { useFormContext } from '@/components/patients/wizard/FormContext';

export const PatientRegistrationWizard: React.FC = () => {
  const { clearDraft } = useFormContext();

  const handleComplete = async (data: any) => {
    try {
      // Submit to backend
      const response = await api.createPatient(data);

      // Clear draft after successful submission
      clearDraft();

      // Redirect or show success message
      alert('Patient registered successfully!');
      router.push(`/patients/${response.id}`);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  const handleSaveDraft = async (data: any) => {
    // Optional: Save to backend API
    await api.saveDraft(data);
    console.log('Draft saved to API');
  };

  return (
    <MultiStepWizard
      sections={sections}
      onComplete={handleComplete}
      onSaveDraft={handleSaveDraft}
      autoSaveInterval={120000}  // 2 minutes
      showSidebar={true}
    />
  );
};
```

## Validation System

### Field-Level Validators

```tsx
import {
  validateRequired,
  validateEmail,
  validateNIK,
  validatePhoneNumber,
  validateDate,
  validateDateOfBirth,
  validateNumber,
  validateKarnofskyScore,
} from '@/components/patients/wizard/ValidationUtils';

// In your section component
const errors: ValidationError[] = [];

const nikError = validateNIK(data.nik);
if (nikError) errors.push(nikError);

const emailError = validateEmail(data.email);
if (emailError) errors.push(emailError);
```

### Section-Level Validators

Pre-built validators for all 10 sections:

```tsx
import {
  validateSection1,  // Center & Pathology Type
  validateSection2,  // Patient Identity
  validateSection3,  // Clinical Data
  validateSection4,  // Diagnostic Investigations
  validateSection5,  // Diagnosis & Location (conditional)
  validateSection6,  // Staging
  validateSection7,  // CPC Conference
  validateSection8,  // Treatment Management
  validateSection9,  // Follow-up Plan
} from '@/components/patients/wizard/ValidationUtils';

const validation = validateSection2(sectionData);
// Returns: { isValid: boolean, errors: ValidationError[] }
```

### Cross-Section Validation

```tsx
import { validateCrossSections } from '@/components/patients/wizard/ValidationUtils';

// Validate relationships between sections
const errors = validateCrossSections({
  section3: { onsetDate: '2024-01-15' },
  section4: { biopsyDate: '2024-01-20' },
  section8: { surgeryDate: '2024-01-10' },  // Error: before biopsy
});
```

### Custom Validators

Create custom validation for your sections:

```tsx
const validateCustomSection = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Custom validation logic
  if (data.tumorSize > 20 && !data.metastasisScreening) {
    errors.push({
      field: 'metastasisScreening',
      message: 'Metastasis screening required for tumors > 20cm',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## State Management

### Using FormContext

```tsx
import { useFormContext } from '@/components/patients/wizard/FormContext';

function MyComponent() {
  const {
    formData,           // All form data
    updateSection,      // Update entire section
    updateField,        // Update single field
    getSection,         // Get section data
    getAllData,         // Get all data
    saveDraft,          // Manually save draft
    loadDraft,          // Manually load draft
    clearDraft,         // Clear saved draft
    lastSaved,          // Last save timestamp
    isDirty,            // Has unsaved changes
    hasUnsavedChanges,  // Warning trigger
  } = useFormContext();

  // Update a section
  updateSection('section1', {
    centerId: 'rsup-cipto',
    pathologyType: 'bone_tumor',
  });

  // Update a single field
  updateField('section1', 'centerId', 'rsup-cipto');

  // Get section data
  const section1Data = getSection('section1');

  // Manual save
  await saveDraft();
}
```

### Using Section-Scoped Hook

For cleaner section components:

```tsx
import { useSectionData } from '@/components/patients/wizard/FormContext';

export const Section1: React.FC<SectionProps> = () => {
  const { data, updateField, updateData, validation } = useSectionData('section1');

  return (
    <div>
      <input
        value={data.centerId || ''}
        onChange={(e) => updateField('centerId', e.target.value)}
      />
    </div>
  );
};
```

## Auto-Save

Auto-save is handled automatically:

- **Interval**: Default 2 minutes (configurable)
- **Storage**: localStorage (always) + optional API
- **Trigger**: Only when form data changes (isDirty)
- **Indicator**: Shows last saved timestamp

```tsx
<FormProvider
  autoSaveInterval={120000}  // milliseconds
  draftKey="patient-form-draft"  // localStorage key
  onAutoSave={async (data) => {
    // Optional: Also save to backend
    await api.saveDraft(data);
  }}
>
  <App />
</FormProvider>
```

## Progress Tracking

Multiple progress indicator variants:

```tsx
import {
  ProgressIndicator,      // Full featured
  LinearProgress,         // Simple bar
  StepDots,              // Minimalist dots
} from '@/components/patients/wizard/ProgressIndicator';

// Full featured
<ProgressIndicator
  steps={steps}
  currentStep={3}
  totalSteps={10}
  variant="default"  // or "compact" or "minimal"
/>

// Simple linear
<LinearProgress
  currentStep={3}
  totalSteps={10}
  showPercentage={true}
/>

// Minimalist dots
<StepDots
  currentStep={3}
  totalSteps={10}
  completedSteps={[1, 2]}
/>
```

## Navigation

### Sidebar Navigation

Built into MultiStepWizard, or use standalone:

```tsx
import { SectionNavigator } from '@/components/patients/wizard/SectionNavigator';

<SectionNavigator
  sections={navigatorSections}
  currentSectionId="section3"
  onNavigate={(sectionId) => goToSection(sectionId)}
  allowNavigation={true}
/>
```

### Programmatic Navigation

Within MultiStepWizard, navigation is handled automatically.
Custom navigation hooks are available if needed.

## Conditional Sections

Sections can be conditionally rendered:

```tsx
{
  id: 'section5-bone',
  title: 'Bone Tumor Details',
  component: BoneTumorDetails,
  // Only show if pathology type is bone tumor
  shouldRender: (allData) => {
    return allData.section1?.pathologyType === 'bone_tumor';
  },
}
```

## Styling

Uses Tailwind CSS utility classes. Key styles:

- **Colors**: Blue (primary), Green (success), Red (error), Gray (neutral)
- **Spacing**: Consistent 4px grid (space-4, p-6, etc.)
- **Responsive**: Mobile-first with md: and lg: breakpoints
- **Accessibility**: Focus rings, ARIA labels, semantic HTML

### Customization

Override styles via className props:

```tsx
<MultiStepWizard
  className="custom-wizard"
  // ... other props
/>
```

## Accessibility

- **Keyboard Navigation**: Tab through fields, Enter to submit
- **ARIA Labels**: All form controls properly labeled
- **Focus Management**: Auto-focus on validation errors
- **Screen Readers**: Semantic HTML, status announcements
- **Color Contrast**: WCAG AA compliant

## TypeScript Types

Key interfaces:

```tsx
// Section definition
interface Section {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<SectionProps>;
  isOptional?: boolean;
  validate?: (data: SectionData, allData?: any) => Promise<SectionValidation> | SectionValidation;
  shouldRender?: (allData: any) => boolean;
}

// Section component props
interface SectionProps {
  data: SectionData;
  updateData: (data: SectionData) => void;
  updateField: (field: string, value: any) => void;
  errors: ValidationError[];
  isActive: boolean;
}

// Validation result
interface SectionValidation {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
}
```

## Best Practices

### 1. Keep Sections Focused
Each section should handle one logical group of fields.

### 2. Use Validation
Always provide validation functions for required sections.

### 3. Handle Errors Gracefully
Display inline errors near the relevant fields.

### 4. Progressive Disclosure
Use conditional rendering to show/hide sections based on context.

### 5. Auto-Save Wisely
Balance between data safety and API load (default 2 minutes is good).

### 6. Clear Drafts After Submit
Always clear the draft after successful submission.

### 7. Loading States
Show loading indicators during async operations.

## Example: Complete Integration

```tsx
// app/patients/new/page.tsx
import { FormProvider } from '@/components/patients/wizard/FormContext';
import { PatientRegistrationWizard } from '@/components/patients/wizard/PatientRegistrationWizard';

export default function NewPatientPage() {
  return (
    <FormProvider
      autoSaveInterval={120000}
      draftKey="patient-form-draft"
    >
      <PatientRegistrationWizard />
    </FormProvider>
  );
}
```

## Troubleshooting

### Form Not Saving
- Check browser localStorage is enabled
- Verify onAutoSave function if provided
- Check console for errors

### Validation Not Working
- Ensure validate function returns `{ isValid, errors }`
- Check that section IDs match between definition and validation

### Navigation Issues
- Verify section IDs are unique
- Check shouldRender logic for conditional sections
- Ensure FormProvider wraps the wizard

### Auto-Save Too Frequent
- Increase autoSaveInterval (in milliseconds)
- Default is 120000ms (2 minutes)

## Future Enhancements

- [ ] Multi-language support
- [ ] Field-level auto-save
- [ ] Offline mode with sync
- [ ] Analytics integration
- [ ] PDF export of review section
- [ ] Email draft link
- [ ] Collaborative editing

## Support

For issues or questions:
1. Check this documentation
2. Review example implementations
3. Check TypeScript types
4. Review validation utilities

---

**Last Updated**: December 2025
**Version**: 1.0.0
