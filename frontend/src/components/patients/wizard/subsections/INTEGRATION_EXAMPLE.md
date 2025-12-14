# RadiologyModalities Integration Example

## Quick Integration into Section4DiagnosticInvestigations

### Step 1: Import the Component

```tsx
// At the top of Section4DiagnosticInvestigations.tsx
import { RadiologyModalities } from './subsections';
```

### Step 2: Add to Section Layout

Replace the existing radiology section with the new component:

```tsx
export function Section4DiagnosticInvestigations() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pemeriksaan Penunjang Diagnostik
        </h2>
        <p className="text-gray-600">
          Hasil laboratorium, radiologi, dan pemeriksaan patologi
        </p>
      </div>

      {/* Laboratory Results - existing component */}
      <LaboratoryTests />

      {/* NEW: Radiology Modalities - Replace old radiology section */}
      <RadiologyModalities />

      {/* Mirrel Score Calculator - existing */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* ... existing Mirrel Score code ... */}
      </div>

      {/* Pathology - existing */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* ... existing pathology code ... */}
      </div>
    </div>
  );
}
```

### Step 3: Remove Old Radiology Code

**Delete this entire section from Section4DiagnosticInvestigations.tsx:**

```tsx
{/* OLD - DELETE THIS */}
<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Temuan Radiologi
  </h3>

  {/* X-Ray */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Hasil X-Ray (Rontgen)
    </label>
    <textarea
      value={sectionData.radiology?.xrayFindings || ''}
      onChange={(e) => updateRadiologyField('xrayFindings', e.target.value)}
      // ... rest of code
    />
  </div>

  {/* CT Scan, MRI, PET - DELETE ALL */}
</div>
```

### Step 4: Update TypeScript Interfaces (Optional)

The old `RadiologyData` interface can be removed if you're only using the new component:

```tsx
// OLD - Can be removed
interface RadiologyData {
  xrayFindings?: string;
  ctFindings?: string;
  mriFindings?: string;
  petScanFindings?: string;
  bonescanFindings?: string;
}

// NEW - Already defined in RadiologyModalities.tsx
interface ModalityData {
  modality: 'X_RAY' | 'MRI' | 'CT_SCAN' | 'BONE_SCAN' | 'PET_SCAN';
  studyDate?: string;
  findings?: string;
  images: RadiologyImage[];
}
```

## Data Access

### Reading Radiology Data from Other Sections

```tsx
import { useFormContext } from './FormContext';

function SomeOtherSection() {
  const { getSection } = useFormContext();
  const section4Data = getSection('section4');

  // Access radiology modalities
  const radiologyData = section4Data.radiologyModalities || [];

  // Find specific modality
  const xrayData = radiologyData.find(m => m.modality === 'X_RAY');
  const mriData = radiologyData.find(m => m.modality === 'MRI');

  // Check if X-ray has findings
  const hasXrayFindings = xrayData?.findings && xrayData.findings.length > 0;

  // Count total uploaded images across all modalities
  const totalImages = radiologyData.reduce((sum, m) => sum + m.images.length, 0);

  return (
    <div>
      <p>X-ray findings: {xrayData?.findings || 'Not entered'}</p>
      <p>Total radiology images: {totalImages}</p>
    </div>
  );
}
```

### Validation Example

```tsx
import { useFormContext } from './FormContext';

function validateSection4() {
  const { getSection, setSectionValidation } = useFormContext();
  const section4Data = getSection('section4');
  const radiologyData = section4Data.radiologyModalities || [];

  const errors = [];

  // Validate X-ray (required)
  const xrayData = radiologyData.find(m => m.modality === 'X_RAY');
  if (!xrayData?.findings) {
    errors.push({ field: 'xrayFindings', message: 'X-ray findings are required' });
  }
  if (!xrayData?.studyDate) {
    errors.push({ field: 'xrayStudyDate', message: 'X-ray study date is required' });
  }

  // Set validation state
  setSectionValidation('section4', {
    isValid: errors.length === 0,
    errors,
  });

  return errors.length === 0;
}
```

## API Submission Format

When submitting to backend:

```tsx
async function submitPatientData() {
  const { getAllData } = useFormContext();
  const formData = getAllData();

  // Transform for API
  const apiPayload = {
    // ... other sections
    diagnosticInvestigations: {
      laboratory: formData.section4.laboratory,
      radiologyModalities: formData.section4.radiologyModalities.map(modality => ({
        modality: modality.modality,
        studyDate: modality.studyDate,
        findings: modality.findings,
        imageCount: modality.images.length,
        images: modality.images.map(img => ({
          fileName: img.fileName,
          fileSize: img.fileSize,
          fileType: img.fileType,
          uploadDate: img.uploadDate,
          // url will be populated after upload to MinIO
        })),
      })),
      mirrelScore: formData.section4.mirrelScore,
      pathology: formData.section4.pathology,
    },
  };

  // Send to API
  const response = await fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload),
  });

  return response.json();
}
```

## File Upload to MinIO (Future Enhancement)

```tsx
async function uploadRadiologyImages(patientId: string, modalityData: ModalityData) {
  const formData = new FormData();

  for (const image of modalityData.images) {
    // Assuming you have access to the actual File objects
    formData.append('files', image.file);
  }

  formData.append('patientId', patientId);
  formData.append('modality', modalityData.modality);

  const response = await fetch('/api/radiology/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

## Testing Checklist

- [ ] X-ray section is visible and has blue background
- [ ] X-ray section is always expanded (not collapsible)
- [ ] Other modality sections are collapsible
- [ ] Click header to expand/collapse non-required sections
- [ ] File upload works via click
- [ ] Drag & drop works for file upload
- [ ] Multiple files can be uploaded per modality
- [ ] File metadata displays correctly (name, size, date)
- [ ] Remove file button works
- [ ] Study date picker works and limits to today
- [ ] Findings textarea accepts input
- [ ] Placeholder text displays helpful examples
- [ ] Summary panel shows correct completion status
- [ ] Data persists in FormContext
- [ ] Auto-save works (localStorage after 2 minutes)
- [ ] Validation marks X-ray as required
- [ ] Icon indicators display correctly

---

**Created:** 2025-12-14
