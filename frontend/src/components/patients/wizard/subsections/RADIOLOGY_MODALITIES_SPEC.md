# RadiologyModalities Component - Feature Specification

**Component:** RadiologyModalities.tsx
**Location:** `/frontend/src/components/patients/wizard/subsections/RadiologyModalities.tsx`
**Purpose:** Comprehensive radiology investigation tracker with separate sections for each imaging modality
**Status:** ✅ Complete
**Lines of Code:** 471

---

## Component Architecture

```
RadiologyModalities
├── Guidance Panel (blue info box)
├── X-Ray Section (REQUIRED - Blue theme)
│   ├── Study Date Input
│   ├── File Upload Zone (Drag & Drop)
│   ├── Uploaded Files List
│   └── Findings Textarea
├── MRI Section (Collapsible - Gray theme)
│   ├── Study Date Input
│   ├── File Upload Zone
│   ├── Uploaded Files List
│   └── Findings Textarea
├── CT Scan Section (Collapsible - Gray theme)
│   ├── Study Date Input
│   ├── File Upload Zone
│   ├── Uploaded Files List
│   └── Findings Textarea
├── Bone Scan Section (Collapsible - Gray theme)
│   ├── Study Date Input
│   ├── File Upload Zone
│   ├── Uploaded Files List
│   └── Findings Textarea
├── PET Scan Section (Collapsible - Gray theme)
│   ├── Study Date Input
│   ├── File Upload Zone
│   ├── Uploaded Files List
│   └── Findings Textarea
└── Summary Panel (completion status grid)
```

---

## Feature Matrix

| Feature | X-Ray | MRI | CT | Bone Scan | PET |
|---------|-------|-----|----|-----------|----- |
| **Required** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Background Color** | Blue (bg-blue-50) | White | White | White | White |
| **Border Color** | Blue (border-blue-300) | Gray | Gray | Gray | Gray |
| **Header Color** | Blue (bg-blue-100) | Gray (bg-gray-50) | Gray | Gray | Gray |
| **Icon** | 📷 | 🧲 | 🔬 | ☢️ | ⚡ |
| **Collapsible** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Default State** | Expanded | Collapsed | Collapsed | Collapsed | Collapsed |
| **Study Date** | Required | Optional | Optional | Optional | Optional |
| **Findings** | Required | Optional | Optional | Optional | Optional |
| **Images** | Optional | Optional | Optional | Optional | Optional |

---

## UI States

### 1. X-Ray Section (Required - Always Visible)

```
┌─────────────────────────────────────────────────────────────┐
│ 📷 Conventional X-ray (Rontgen)               *WAJIB        │ ← Blue header (bg-blue-100)
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Tanggal Pemeriksaan *                                        │
│ [____________________]  (date picker, max=today)            │
│                                                               │
│ Upload Gambar *                                              │
│ ┌───────────────────────────────────────────────────────┐  │
│ │         📤                                             │  │
│ │   Klik untuk upload atau drag & drop file             │  │
│ │   PNG, JPG, DICOM (.dcm) - Max 10MB per file         │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                               │
│ Temuan dan Interpretasi *                                    │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Contoh: Lesi litik di distal femur kanan dengan...    │  │
│ │                                                        │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2. MRI Section (Optional - Collapsed)

```
┌─────────────────────────────────────────────────────────────┐
│ 🧲 MRI (Magnetic Resonance Imaging)                    ⌄   │ ← Gray header (bg-gray-50)
└─────────────────────────────────────────────────────────────┘
```

### 3. MRI Section (Expanded)

```
┌─────────────────────────────────────────────────────────────┐
│ 🧲 MRI (Magnetic Resonance Imaging)                    ⌃   │
├─────────────────────────────────────────────────────────────┤
│ Tanggal Pemeriksaan                                          │
│ [____________________]                                       │
│                                                               │
│ Upload Gambar                                                │
│ ┌───────────────────────────────────────────────────────┐  │
│ │         📤                                             │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                               │
│ Temuan dan Interpretasi                                      │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Contoh: Massa intramedular di distal femur dengan...  │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Uploaded Files Display

```
File yang diupload (3):

┌───────────────────────────────────────────────────────────┐
│ 📄 xray-femur-ap.jpg                              🗑️      │
│    2.3 MB • 14/12/2025, 18:30                            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 📄 xray-femur-lateral.jpg                         🗑️      │
│    1.8 MB • 14/12/2025, 18:31                            │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ 📄 xray-chest.dcm                                 🗑️      │
│    4.5 MB • 14/12/2025, 18:32                            │
└───────────────────────────────────────────────────────────┘
```

### 5. Drag Over State

```
┌───────────────────────────────────────────────────────┐
│         📤                                             │ ← Blue border & background
│   DROP FILES HERE                                     │    (border-blue-500, bg-blue-50)
│   PNG, JPG, DICOM (.dcm) - Max 10MB per file         │
└───────────────────────────────────────────────────────┘
```

### 6. Summary Panel

```
Ringkasan Pemeriksaan

┌──────────┬──────────┬──────────┬──────────┬──────────┐
│📷 X-Ray  │🧲 MRI    │🔬 CT     │☢️ Bone   │⚡ PET    │
│✓ Lengkap │⚠ Wajib   │○ Kosong  │○ Kosong  │✓ Lengkap │
│ GREEN    │ YELLOW   │ GRAY     │ GRAY     │ GREEN    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## Data Flow Diagram

```
User Interaction
    │
    ├─ Select File (Click/Drag)
    │   └─> handleFileUpload()
    │       └─> updateModalityField('images', [...existing, ...new])
    │           └─> updateFormData()
    │               └─> FormContext.updateSection('section4', {...})
    │                   └─> localStorage (auto-save after 2min)
    │
    ├─ Enter Study Date
    │   └─> updateModalityField('studyDate', value)
    │
    ├─ Enter Findings
    │   └─> updateModalityField('findings', value)
    │
    └─ Remove File
        └─> removeFile(modality, index)
            └─> updateModalityField('images', filtered)
```

---

## Data Structure

### Storage in FormContext

**Section Key:** `section4`
**Field Key:** `radiologyModalities`
**Type:** `ModalityData[]`

```typescript
// Example stored data
{
  section4: {
    radiologyModalities: [
      {
        modality: 'X_RAY',
        studyDate: '2025-12-14',
        findings: 'Lesi litik di distal femur kanan dengan destruksi korteks anterior...',
        images: [
          {
            fileName: 'xray-femur-ap.jpg',
            fileSize: 2412544, // bytes
            fileType: 'image/jpeg',
            uploadDate: '2025-12-14T18:30:00.000Z',
          },
          {
            fileName: 'xray-femur-lateral.jpg',
            fileSize: 1887232,
            fileType: 'image/jpeg',
            uploadDate: '2025-12-14T18:31:00.000Z',
          },
        ],
      },
      {
        modality: 'MRI',
        studyDate: '2025-12-15',
        findings: 'Massa intramedular dengan ekstensi ekstraosseous...',
        images: [],
      },
      // ... other modalities
    ],
  },
}
```

---

## Placeholder Text by Modality

### X-Ray (Required)
```
Lesi litik di distal femur kanan dengan destruksi korteks anterior, soft tissue mass (+), periosteal reaction sunburst appearance, ukuran lesi 8x6 cm...
```

### MRI
```
Massa intramedular di distal femur dengan ekstensi ekstraosseous, T1 hypointense, T2 hyperintense dengan enhancing septa, invasi ke neurovascular bundle (-), skip lesion (-), joint invasion (-)...
```

### CT Scan
```
Massa jaringan lunak dengan komponen kalsifikasi mineralisasi matriks, ukuran 8x6x5 cm, melibatkan kompartemen anterior thigh, tidak tampak metastasis paru...
```

### Bone Scan
```
Peningkatan uptake Tc-99m MDP di distal femur kanan, tidak tampak hot spot di tulang lain, tidak ada tanda metastasis tulang...
```

### PET Scan
```
Peningkatan uptake FDG dengan SUVmax 8.5 di lesi primer distal femur kanan, tidak tampak lymph node involvement, tidak ada distant metastasis...
```

---

## Color Scheme

| Element | X-Ray (Required) | Other Modalities |
|---------|------------------|------------------|
| **Background** | `bg-blue-50` | `bg-white` |
| **Border** | `border-blue-300` | `border-gray-300` |
| **Header** | `bg-blue-100` | `bg-gray-50` |
| **Text** | `text-gray-900` | `text-gray-900` |
| **Focus Ring** | `ring-blue-500` | `ring-blue-500` |
| **Required Indicator** | `text-red-500` | - |

**Summary Status Colors:**
- Complete: `bg-green-50 border-green-300 text-green-800`
- Required/Empty: `bg-yellow-50 border-yellow-300 text-yellow-800`
- Optional/Empty: `bg-gray-100 border-gray-300 text-gray-600`

---

## File Upload Specifications

**Accepted Formats:**
- Images: `image/*` (JPG, PNG, GIF, BMP, WEBP, etc.)
- DICOM: `.dcm`

**Max File Size:** 10MB per file (recommended)

**Multiple Files:** ✅ Yes, unlimited per modality

**Drag & Drop:** ✅ Supported with visual feedback

**File Metadata Captured:**
- fileName
- fileSize (bytes)
- fileType (MIME type)
- uploadDate (ISO 8601 timestamp)
- url (optional, for MinIO/S3 reference)

---

## Component Dependencies

```typescript
import React, { useState, useCallback } from 'react';
import { useFormContext } from '../FormContext';
```

**No external dependencies** - Uses only built-in React hooks and FormContext.

---

## Validation Rules

### X-Ray (Required)
- Study Date: **REQUIRED**
- Findings: **REQUIRED** (minimum 10 characters recommended)
- Images: Optional (but recommended)

### Other Modalities (MRI, CT, Bone Scan, PET)
- Study Date: Optional
- Findings: Optional
- Images: Optional

### Validation Implementation

```typescript
function validateRadiology(modalitiesData: ModalityData[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const xray = modalitiesData.find(m => m.modality === 'X_RAY');

  if (!xray?.studyDate) {
    errors.push({
      field: 'section4.radiologyModalities.X_RAY.studyDate',
      message: 'Tanggal pemeriksaan X-ray wajib diisi',
    });
  }

  if (!xray?.findings || xray.findings.length < 10) {
    errors.push({
      field: 'section4.radiologyModalities.X_RAY.findings',
      message: 'Temuan X-ray wajib diisi (minimal 10 karakter)',
    });
  }

  return errors;
}
```

---

## Future Enhancements

### Phase 1 (Current) ✅
- [x] Separate sections by modality
- [x] File upload with drag & drop
- [x] Study date tracking
- [x] Findings text input
- [x] File metadata display
- [x] Collapsible sections
- [x] Summary panel

### Phase 2 (Planned)
- [ ] Actual file upload to MinIO/S3
- [ ] Image thumbnails/preview
- [ ] DICOM viewer integration
- [ ] File compression before upload
- [ ] Upload progress indicator
- [ ] File validation (max size enforcement)

### Phase 3 (Future)
- [ ] AI-assisted finding suggestions
- [ ] Template findings by tumor type
- [ ] Compare with previous studies
- [ ] Export findings as PDF report
- [ ] Integration with PACS system

---

## Browser Compatibility

✅ **Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Drag & Drop:** All modern browsers
**File API:** All modern browsers
**Date Input:** All modern browsers (with polyfill for older browsers)

---

## Accessibility

- ✅ **Keyboard Navigation:** Full support
- ✅ **Screen Readers:** Proper labels and ARIA attributes
- ✅ **Focus Management:** Clear focus indicators
- ✅ **Color Contrast:** WCAG AA compliant

---

## Performance

**Component Size:** 471 lines (18KB source)
**Render Performance:** Optimized with `useCallback`
**Re-renders:** Minimized with proper state management
**Memory:** Efficient - only stores file metadata, not file blobs

---

**Document Created:** 2025-12-14
**Last Updated:** 2025-12-14
**Version:** 1.0.0
