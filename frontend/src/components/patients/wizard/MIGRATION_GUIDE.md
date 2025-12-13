# Migration Guide: Old Form → New Wizard Infrastructure

This guide helps you transition from the existing `PatientForm.tsx` to the new multi-step wizard infrastructure.

## Overview

**Old System**: `form/PatientForm.tsx` with `usePatientForm` hook
**New System**: `wizard/MultiStepWizard.tsx` with `FormContext` provider

## Benefits of Migration

✅ **Better State Management**: React Context instead of local state
✅ **Auto-Save**: Automatic draft saving every 2 minutes
✅ **Reusable**: Can be used for other multi-step forms
✅ **Better Validation**: Comprehensive validation utilities
✅ **Enhanced UX**: Better progress tracking and navigation
✅ **Type Safety**: Full TypeScript support throughout
✅ **Accessibility**: ARIA labels and keyboard navigation

## Migration Steps

### Step 1: Update Imports

**Before:**
```tsx
import { PatientForm } from '@/components/patients/form/PatientForm';
import { usePatientForm } from '@/components/patients/form/usePatientForm';
```

**After:**
```tsx
import {
  PatientRegistrationWizard,
  FormProvider,
} from '@/components/patients/wizard';
```

### Step 2: Wrap with FormProvider

**Before:**
```tsx
// No provider needed
export default function NewPatientPage() {
  return <PatientForm />;
}
```

**After:**
```tsx
import { FormProvider } from '@/components/patients/wizard';
import { PatientRegistrationWizard } from '@/components/patients/wizard/ExampleWizardUsage';

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

### Step 3: Update Section Components

**Before (Old Section Component):**
```tsx
interface Section1Props {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
}

export const Section1CenterType: React.FC<Section1Props> = ({
  formData,
  errors,
  updateFormData,
}) => {
  return (
    <div>
      <input
        value={formData.centerId || ''}
        onChange={(e) => updateFormData('centerId', e.target.value)}
      />
      {errors.centerId && <p>{errors.centerId}</p>}
    </div>
  );
};
```

**After (New Section Component):**
```tsx
import { SectionProps } from '@/components/patients/wizard/MultiStepWizard';

export const Section1CenterType: React.FC<SectionProps> = ({
  data,
  updateField,
  errors,
  isActive,
}) => {
  return (
    <div>
      <input
        value={data.centerId || ''}
        onChange={(e) => updateField('centerId', e.target.value)}
      />
      {errors.find(e => e.field === 'centerId') && (
        <p>{errors.find(e => e.field === 'centerId')?.message}</p>
      )}
    </div>
  );
};
```

**Key Changes:**
- Props changed from `formData` → `data`
- Update method changed from `updateFormData(field, value)` → `updateField(field, value)`
- Errors changed from `Record<string, string>` → `ValidationError[]`
- Added `isActive` prop (boolean)

### Step 4: Update Validation

**Before (Old Validation):**
```tsx
const validateSection = (sectionNumber: number): boolean => {
  const newErrors: Record<string, string> = {};

  if (!formData.centerId) {
    newErrors.centerId = 'Center is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**After (New Validation):**
```tsx
import { validateSection1 } from '@/components/patients/wizard/ValidationUtils';

// In section definition
{
  id: 'section1',
  title: 'Center & Pathology Type',
  component: Section1CenterType,
  validate: async (data) => validateSection1(data),
}

// Or custom validation
const validateCustom = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  if (!data.centerId) {
    errors.push({
      field: 'centerId',
      message: 'Center is required',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### Step 5: Update Form Submission

**Before:**
```tsx
const handleSubmit = async () => {
  const { patientService } = await import('../../../services');
  const createdPatient = await patientService.createPatient(formData);
  resetForm();
};
```

**After:**
```tsx
import { useFormContext } from '@/components/patients/wizard';

const { clearDraft, getAllData } = useFormContext();

const handleComplete = async (data: any) => {
  const { patientService } = await import('../../../services');

  // Transform wizard data to API format
  const apiData = transformWizardDataToAPI(data);

  const createdPatient = await patientService.createPatient(apiData);

  // Clear draft after successful submission
  clearDraft();
};

// Helper function
function transformWizardDataToAPI(wizardData: any): any {
  const apiData: any = {};
  Object.keys(wizardData).forEach((sectionId) => {
    const sectionData = wizardData[sectionId];
    Object.keys(sectionData).forEach((field) => {
      apiData[field] = sectionData[field];
    });
  });
  return apiData;
}
```

## Data Structure Comparison

### Old Structure (Flat)
```tsx
{
  centerId: 'rsup-cipto',
  pathologyType: 'bone_tumor',
  medicalRecordNumber: '123456',
  name: 'John Doe',
  // ... all fields at root level
}
```

### New Structure (Section-Based)
```tsx
{
  section1: {
    centerId: 'rsup-cipto',
    pathologyType: 'bone_tumor',
  },
  section2: {
    medicalRecordNumber: '123456',
    name: 'John Doe',
  },
  // ... organized by section
}
```

## Updating Section Props Interface

### Old Interface
```tsx
interface SectionProps {
  formData: PatientFormData;
  errors: Record<string, string>;
  updateFormData: (field: string, value: any) => void;
  updateMultipleFields?: (updates: Partial<PatientFormData>) => void;
}
```

### New Interface
```tsx
interface SectionProps {
  data: SectionData;
  updateData: (data: SectionData) => void;
  updateField: (field: string, value: any) => void;
  errors: ValidationError[];
  isActive: boolean;
}
```

## Common Migration Issues

### Issue 1: Accessing Other Section's Data

**Problem**: In old form, all data was in one flat object.

**Solution**: Use `getAllData()` from context or pass `allData` in validation:

```tsx
// In section component
import { useFormContext } from '@/components/patients/wizard';

const { getAllData } = useFormContext();
const allData = getAllData();
const section1Data = allData.section1;

// Or in validation
const validate = (data: SectionData, allData: any) => {
  const pathologyType = allData.section1?.pathologyType;
  // Use pathologyType for conditional validation
};
```

### Issue 2: Error Display

**Problem**: Errors structure changed from object to array.

**Old Way:**
```tsx
{errors.centerId && <p>{errors.centerId}</p>}
```

**New Way:**
```tsx
{errors.find(e => e.field === 'centerId') && (
  <p>{errors.find(e => e.field === 'centerId')?.message}</p>
)}
```

**Better Way (helper function):**
```tsx
const getError = (fieldName: string) => {
  return errors.find(e => e.field === fieldName)?.message;
};

{getError('centerId') && <p>{getError('centerId')}</p>}
```

### Issue 3: Multi-Field Updates

**Problem**: Need to update multiple fields at once.

**Old Way:**
```tsx
updateMultipleFields({
  field1: value1,
  field2: value2,
});
```

**New Way:**
```tsx
updateData({
  ...data,
  field1: value1,
  field2: value2,
});
```

## Gradual Migration Strategy

You can migrate gradually:

### Option 1: Keep Both Systems
- Keep old `PatientForm.tsx` as-is
- Create new pages using wizard
- Migrate section by section

### Option 2: Adapter Pattern
Create an adapter to use old sections in new wizard:

```tsx
// adapter.tsx
import { SectionProps as NewSectionProps } from '@/components/patients/wizard';
import { SectionProps as OldSectionProps } from '@/components/patients/form';

export function adaptOldSection(
  OldComponent: React.FC<OldSectionProps>
): React.FC<NewSectionProps> {
  return ({ data, updateField, errors, isActive }) => {
    // Convert new props to old format
    const oldErrors: Record<string, string> = {};
    errors.forEach(err => {
      oldErrors[err.field] = err.message;
    });

    const updateFormData = (field: string, value: any) => {
      updateField(field, value);
    };

    return (
      <OldComponent
        formData={data}
        errors={oldErrors}
        updateFormData={updateFormData}
      />
    );
  };
}

// Usage
const sections = [
  {
    id: 'section1',
    title: 'Center & Type',
    component: adaptOldSection(OldSection1Component),
  },
];
```

## Testing After Migration

### Checklist
- [ ] All sections render correctly
- [ ] Form data persists between sections
- [ ] Validation works for all sections
- [ ] Auto-save works (check localStorage)
- [ ] Submit creates patient successfully
- [ ] Draft can be loaded and resumed
- [ ] Navigation works (Next/Previous/Sidebar)
- [ ] Errors display properly
- [ ] Conditional sections show/hide correctly
- [ ] Mobile responsive layout works

### Test Scenarios
1. **Happy Path**: Fill all sections and submit
2. **Validation**: Try to proceed with missing required fields
3. **Auto-Save**: Fill some data, wait 2 minutes, refresh page
4. **Navigation**: Jump between sections using sidebar
5. **Conditional**: Change pathology type, verify section 5 updates
6. **Draft**: Partially fill form, reload, verify data persists

## Rollback Plan

If you need to rollback:

1. Keep old `form/` directory intact during migration
2. Use feature flags to toggle between old/new form
3. Database schema should be compatible (same field names)

```tsx
// Feature flag approach
const useNewWizard = process.env.NEXT_PUBLIC_USE_NEW_WIZARD === 'true';

export default function NewPatientPage() {
  if (useNewWizard) {
    return <PatientRegistrationWizard />;
  }
  return <PatientForm />;
}
```

## Support

If you encounter issues during migration:

1. Check the wizard README.md for detailed documentation
2. Review ExampleWizardUsage.tsx for complete examples
3. Test validation with ValidationUtils.ts functions
4. Check browser console for errors
5. Verify FormProvider wraps your wizard component

## Next Steps

After successful migration:

1. ✅ Remove old `usePatientForm` hook (optional)
2. ✅ Update all references to use new wizard
3. ✅ Add custom validation rules as needed
4. ✅ Implement backend auto-save (optional)
5. ✅ Add analytics/tracking (optional)
6. ✅ Consider adding more progress indicators
7. ✅ Implement field-level auto-save (future enhancement)

---

**Migration Version**: 1.0
**Last Updated**: December 2025
**Compatibility**: Works alongside existing form
