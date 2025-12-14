# Wizard Subsections

Reusable sub-components for the multi-step patient entry wizard.

## Directory Structure

```
subsections/
├── index.ts                     # Exports for clean imports
├── LaboratoryTests.tsx          # Laboratory investigations sub-component
├── RadiologyModalities.tsx      # Radiology modalities sub-component
└── README.md                    # This file
```

## Components

### RadiologyModalities

Comprehensive radiology investigation tracker separated by modality.

**File:** `RadiologyModalities.tsx`

**Features:**
- ✅ **5 Separate Modality Sections:**
  1. Conventional X-ray (REQUIRED - blue background)
  2. MRI
  3. CT Scan
  4. Bone Scan
  5. PET Scan

- ✅ **File Upload:**
  - Multi-file upload support
  - Drag & drop interface
  - Accepts: image/*, .dcm (DICOM)
  - File preview with metadata (name, size, upload date)
  - Individual file removal

- ✅ **Data Capture per Modality:**
  - Study date (required for X-ray)
  - Findings textarea with example placeholders
  - Multiple image uploads

- ✅ **UI/UX:**
  - X-ray section: Blue background (bg-blue-50), required indicator
  - Other sections: Collapsible (click header to expand/collapse)
  - Drag-over visual feedback
  - File size formatting (B, KB, MB)
  - Visual summary panel showing completion status
  - Icon indicators for each modality (📷 🧲 🔬 ☢️ ⚡)

**Data Structure:**

```typescript
interface RadiologyImage {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  url?: string;
}

interface ModalityData {
  modality: 'X_RAY' | 'MRI' | 'CT_SCAN' | 'BONE_SCAN' | 'PET_SCAN';
  studyDate?: string;
  findings?: string;
  images: RadiologyImage[];
}

interface RadiologyModalitiesData {
  radiologyModalities: ModalityData[];
}
```

**Storage in FormContext:**
- Section: `section4`
- Key: `radiologyModalities`
- Type: `ModalityData[]`

**Usage Example:**

```tsx
import { RadiologyModalities } from '@/components/patients/wizard/subsections';

export function Section4DiagnosticInvestigations() {
  return (
    <div className="space-y-8">
      <h2>Pemeriksaan Penunjang Diagnostik</h2>

      {/* Radiology Modalities Sub-component */}
      <RadiologyModalities />

      {/* Other subsections... */}
    </div>
  );
}
```

**Placeholder Examples by Modality:**

- **X-ray:** "Lesi litik di distal femur kanan dengan destruksi korteks anterior, soft tissue mass (+), periosteal reaction sunburst appearance..."

- **MRI:** "Massa intramedular di distal femur dengan ekstensi ekstraosseous, T1 hypointense, T2 hyperintense dengan enhancing septa..."

- **CT Scan:** "Massa jaringan lunak dengan komponen kalsifikasi mineralisasi matriks, ukuran 8x6x5 cm, melibatkan kompartemen anterior thigh..."

- **Bone Scan:** "Peningkatan uptake Tc-99m MDP di distal femur kanan, tidak tampak hot spot di tulang lain..."

- **PET Scan:** "Peningkatan uptake FDG dengan SUVmax 8.5 di lesi primer distal femur kanan, tidak tampak lymph node involvement..."

---

### LaboratoryTests

Laboratory investigations sub-component (existing).

**File:** `LaboratoryTests.tsx`

---

## Import Path

```tsx
// Import all subsections
import { LaboratoryTests, RadiologyModalities } from '@/components/patients/wizard/subsections';

// Or import individually
import { RadiologyModalities } from '@/components/patients/wizard/subsections/RadiologyModalities';
```

## Integration with FormContext

All subsections use the `useFormContext` hook to:
1. Read saved data: `getSection('section4')`
2. Update data: `updateSection('section4', newData)`
3. Auto-save triggered every 2 minutes (configured in FormProvider)

## Validation

Subsections can set validation state:

```tsx
const { setSectionValidation } = useFormContext();

setSectionValidation('section4', {
  isValid: true,
  errors: [],
});
```

## File Upload Notes

**Accepted Formats:**
- Images: PNG, JPG, JPEG, GIF, BMP, WEBP
- DICOM: .dcm

**Recommendations:**
- Max file size: 10MB per file
- Multiple files allowed per modality
- Files stored as metadata (fileName, size, type, date)
- Actual file upload to MinIO/S3 happens on form submission

**Future Enhancement:**
- Connect to MinIO backend for actual file storage
- Add file preview/thumbnail generation
- Implement progress bar for large files
- Add image viewer/DICOM viewer integration

---

## Component Guidelines

When creating new subsections:

1. **Use FormContext:** Always integrate with `useFormContext` for state management
2. **TypeScript:** Define clear interfaces for data structures
3. **Validation:** Implement field-level and section-level validation
4. **Accessibility:** Use proper labels, ARIA attributes, keyboard navigation
5. **Responsive:** Support mobile and desktop layouts
6. **Auto-save:** Data automatically saved to localStorage via FormContext
7. **Clear Placeholders:** Provide helpful examples in Indonesian
8. **Visual Hierarchy:** Use consistent spacing, colors, borders
9. **Error Handling:** Display validation errors near relevant fields
10. **Performance:** Optimize for large datasets, debounce expensive operations

---

**Last Updated:** 2025-12-14
