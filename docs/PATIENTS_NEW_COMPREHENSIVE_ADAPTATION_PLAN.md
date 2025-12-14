# 📋 RENCANA ADAPTASI COMPREHENSIVE FORM /patients/new
## Berdasarkan Dokumen INAMSOS Resmi - TIDAK ADA YANG TERTINGGAL

**Tanggal**: 2025-12-14
**Status**: Planning Phase
**Target**: Form entry pasien yang 100% sesuai dokumen INAMSOS

---

## 📊 CURRENT STATUS ASSESSMENT

### ✅ **SECTIONS YANG SUDAH AKTIF** (6/10)

Sections yang sudah terdaftar di `/frontend/src/app/patients/new/page.tsx`:

1. ✅ **Section 1**: Center & Pathology
2. ✅ **Section 2**: Patient Identity
3. ✅ **Section 3**: Clinical Data
4. ✅ **Section 4**: Diagnostic Investigations
5. ✅ **Section 5**: Diagnosis & Location
6. ✅ **Section 10**: Review & Submit

### ⚠️ **SECTIONS YANG ADA TAPI BELUM AKTIF** (3/10)

Component files sudah ada di `/frontend/src/components/patients/wizard/sections/` tapi **BELUM DIGUNAKAN**:

- ⚠️ **Section6Staging.tsx** - ADA tapi tidak di-import
- ⚠️ **Section7CPCConference.tsx** - ADA tapi tidak di-import
- ⚠️ **Section8TreatmentManagement.tsx** - ADA tapi tidak di-import

### ❌ **SECTIONS YANG DIABAIKAN** (1/10)

- ❌ **Section 9**: Follow-up Management - Sudah ada di `/follow-up` (SKIP per user request)

---

## 🔍 DETAIL ANALISIS PER SECTION

---

## **SECTION 1: CENTER & PATHOLOGY TYPE**

### ✅ Sudah Diimplementasikan:
- [x] Dropdown 21 designated centers
- [x] Pathology type selector (BONE/SOFT_TISSUE/METASTATIC)

### ❌ Missing dari Dokumen INAMSOS:
1. **Metadata Entry Fields**:
   - [ ] `namaSub.SpCF` - Nama consultant/subspecialist
   - [ ] `namaPPDS` - Nama residen
   - [ ] `tanggalInput` - Auto-generated timestamp (sudah ada di backend)

### 🔧 Action Required:
```typescript
// File: Section1CenterPathology.tsx
// ADD AFTER pathologyType selector:

interface Section1Data {
  centerId: string;
  pathologyType: string;
  // NEW FIELDS:
  consultantName?: string;      // Nama Sub.Sp/CF
  residentName?: string;         // Nama PPDS
  inputDate: Date;               // Auto-generated
}

// UI:
<div>
  <label>Nama Subspecialist/CF</label>
  <input type="text" name="consultantName" />
</div>
<div>
  <label>Nama PPDS (Residen)</label>
  <input type="text" name="residentName" />
</div>
<div className="text-sm text-gray-500">
  Tanggal Input: {new Date().toLocaleDateString('id-ID')}
</div>
```

**Priority**: P2 (LOW - metadata fields)

---

## **SECTION 2: PATIENT IDENTITY**

### ✅ Sudah Diimplementasikan:
- [x] Nama
- [x] No RM (Medical Record Number)
- [x] NIK (National ID)
- [x] Date of Birth
- [x] Gender
- [x] Hierarchical address (Province → Regency → District → Village)
- [x] Phone number
- [x] Emergency contact phone

### ❌ Missing dari Dokumen INAMSOS:
1. **No TR (Tumor Registry Number)** - Auto-generated unique identifier
2. **Pendidikan (Education Level)** - Dropdown with 7 levels

### 🔧 Action Required:
```typescript
// File: Section2PatientIdentity.tsx

interface Section2Data {
  // Existing fields...

  // NEW FIELDS:
  tumorRegistryNumber?: string;  // Auto-generated format: "TR-YYYY-XXXX"
  education?: 'NONE' | 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2_S3';
}

// UI - ADD Education Dropdown:
<div>
  <label>Pendidikan</label>
  <select name="education">
    <option value="">Pilih Tingkat Pendidikan</option>
    <option value="NONE">Tidak Sekolah</option>
    <option value="SD">SD</option>
    <option value="SMP">SMP</option>
    <option value="SMA">SMA</option>
    <option value="D3">D3</option>
    <option value="S1">S1</option>
    <option value="S2_S3">S2/S3</option>
  </select>
</div>

// Auto-generate Tumor Registry Number on form load:
useEffect(() => {
  if (!sectionData.tumorRegistryNumber) {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    updateField('tumorRegistryNumber', `TR-${year}-${randomSuffix}`);
  }
}, []);
```

**Priority**: P1 (HIGH - Tumor Registry Number is critical for tracking)

---

## **SECTION 3: CLINICAL DATA**

### ✅ Sudah Diimplementasikan:
- [x] Karnofsky Performance Score (0-100, increments of 10)
- [x] Pain Scale VAS (0-10)
- [x] BMI Calculation (height + weight)
- [x] Chief Complaint
- [x] Comorbidities
- [x] Physical exam (swelling, skin changes, neurovascular status, ROM)
- [x] Clinical photos upload

### ❌ Missing dari Dokumen INAMSOS:

#### 1. **Anamnesa - Expanded Fields**:
- [ ] `riwayatKanker` - Personal cancer history
- [ ] `riwayatKankerKeluarga` - Family cancer history (ADA DI PATIENT MODEL!)

#### 2. **Pemeriksaan Fisik - Structured Format**:
Dokumen INAMSOS memerlukan pemeriksaan fisik yang terstruktur:
- [ ] `statusGeneralisata` - General physical condition
- [ ] `kepalaLeher` - Head & neck examination
- [ ] `thoraks` - Thorax examination
- [ ] `abdomen` - Abdominal examination
- [ ] `ekstremitasTulangBelakang` - Extremities & spine examination

#### 3. **Status Lokalisata**:
- [ ] `statusLokalisata` - Local tumor-specific status description

### 🔧 Action Required:
```typescript
// File: Section3ClinicalData.tsx

interface Section3Data {
  // Existing fields...

  // EXPANDED ANAMNESA:
  cancerHistory?: string;          // Riwayat kanker pribadi
  familyCancerHistory?: string;    // Riwayat kanker keluarga

  // STRUCTURED PHYSICAL EXAMINATION:
  physicalExamGeneral?: string;    // Status Generalisata
  physicalExamHeadNeck?: string;   // Kepala leher
  physicalExamThorax?: string;     // Thoraks
  physicalExamAbdomen?: string;    // Abdomen
  physicalExamExtremitiesSpine?: string; // Ekstremitas & Tulang belakang

  // LOCAL TUMOR STATUS:
  localTumorStatus?: string;       // Status Lokalisata
}

// UI - REORGANIZE AS SUBSECTIONS:

// Subsection A: Anamnesa
<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
  <h3>Anamnesa</h3>

  <div>
    <label>Keluhan Utama *</label>
    <textarea name="chiefComplaint" rows={3} />
  </div>

  <div>
    <label>Komorbid</label>
    <textarea name="comorbidities" rows={2} />
  </div>

  <div>
    <label>Riwayat Kanker Pribadi</label>
    <textarea name="cancerHistory" rows={2}
      placeholder="Apakah pasien pernah menderita kanker sebelumnya?" />
  </div>

  <div>
    <label>Riwayat Kanker Keluarga</label>
    <textarea name="familyCancerHistory" rows={2}
      placeholder="Apakah ada anggota keluarga yang menderita kanker?" />
  </div>
</div>

// Subsection B: Pemeriksaan Fisik
<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
  <h3>Pemeriksaan Fisik</h3>

  <div>
    <label>Status Generalisata</label>
    <textarea name="physicalExamGeneral" rows={2}
      placeholder="Kesan umum, kesadaran, gizi, vital signs" />
  </div>

  <div>
    <label>Kepala & Leher</label>
    <textarea name="physicalExamHeadNeck" rows={2} />
  </div>

  <div>
    <label>Thoraks</label>
    <textarea name="physicalExamThorax" rows={2} />
  </div>

  <div>
    <label>Abdomen</label>
    <textarea name="physicalExamAbdomen" rows={2} />
  </div>

  <div>
    <label>Ekstremitas & Tulang Belakang</label>
    <textarea name="physicalExamExtremitiesSpine" rows={2} />
  </div>
</div>

// Subsection C: Status Lokalisata
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h3>Status Lokalisata Tumor</h3>
  <textarea name="localTumorStatus" rows={4}
    placeholder="Deskripsi detil kondisi lokal tumor (lokasi, ukuran, konsistensi, batas, mobilitas, nyeri tekan, dll)" />
</div>
```

**Priority**: P1 (HIGH - Critical for complete clinical assessment)

---

## **SECTION 4: PEMERIKSAAN PENUNJANG (DIAGNOSTIC INVESTIGATIONS)**

### ✅ Sudah Diimplementasikan:
- [x] Biopsy type (FNAB/Core/Open)
- [x] Biopsy date
- [x] Biopsy result
- [x] Imaging studies (generic text)
- [x] Mirrel Score calculator (for pathological fracture risk)

### ❌ Missing dari Dokumen INAMSOS:

#### 1. **Laboratory Tests** - CRITICAL GAP!
Dokumen memerlukan lab values yang SANGAT SPECIFIC:

**Hematology:**
- [ ] `cbc` - Complete Blood Count
- [ ] `esr` - LED (Erythrocyte Sedimentation Rate)
- [ ] `crp` - C-Reactive Protein

**Tumor Markers (CRITICAL):**
- [ ] `alp` - Alkaline Phosphatase *
- [ ] `ldh` - Lactate Dehydrogenase *
- [ ] `calcium` - Calcium *
- [ ] `phosphate` - Phosphate *

**Organ Function:**
- [ ] `rft` - Renal Function Test
- [ ] `lft` - Liver Function Test

**Specialized:**
- [ ] `sep` - Serum Electrophoresis
- [ ] `benceJonesProtein` - Bence Jones Protein
- [ ] `tumorMarkers` - CEA, PSA, Ca 125, Ca 19-9, AFP

#### 2. **Radiology - Separated by Modality**:
Saat ini hanya ada `imagingStudies` generic. Dokumen memerlukan TERPISAH:
- [ ] `xray` - Conventional X-ray (upload + findings) *
- [ ] `mri` - MRI (upload + findings)
- [ ] `ctScan` - CT Scan (upload + findings)
- [ ] `boneScan` - Bone Scan (upload + findings)
- [ ] `petScan` - PET Scan (upload + findings)

#### 3. **Pathology - Extended**:
- [ ] `immunohistochemistry` - IHK markers (key-value pairs)
- [ ] `huvosGrade` - HUVOS Grade I/II/III/IV (for chemo response)

### 🔧 Action Required:

**Step 1: Create LaboratoryTests Sub-Component**

```typescript
// File: /components/patients/wizard/subsections/LaboratoryTests.tsx

interface LabResults {
  // Hematology
  cbc?: string;
  esr?: number;          // mm/hr
  crp?: number;          // mg/L

  // Tumor Markers (CRITICAL)
  alp?: number;          // U/L *
  ldh?: number;          // U/L *
  calcium?: number;      // mg/dL *
  phosphate?: number;    // mg/dL *

  // Organ Function
  creatinine?: number;   // RFT
  bun?: number;          // RFT
  sgot?: number;         // LFT
  sgpt?: number;         // LFT
  albumin?: number;

  // Specialized
  serumElectrophoresis?: string;
  benceJonesProtein?: boolean;
  cea?: number;
  psa?: number;
  ca125?: number;
  ca199?: number;
  afp?: number;

  testDate: Date;
}

export function LaboratoryTests() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Laboratorium</h3>

      {/* Hematology */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>LED (ESR) <span className="text-sm text-gray-500">mm/hr</span></label>
          <input type="number" name="esr" />
        </div>
        <div>
          <label>CRP <span className="text-sm text-gray-500">mg/L</span></label>
          <input type="number" name="crp" />
        </div>
      </div>

      {/* Tumor Markers - CRITICAL */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-3">Tumor Markers (Critical for Musculoskeletal Tumors)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>ALP * <span className="text-sm text-gray-500">U/L</span></label>
            <input type="number" step="0.1" name="alp" required />
          </div>
          <div>
            <label>LDH * <span className="text-sm text-gray-500">U/L</span></label>
            <input type="number" step="0.1" name="ldh" required />
          </div>
          <div>
            <label>Calcium * <span className="text-sm text-gray-500">mg/dL</span></label>
            <input type="number" step="0.01" name="calcium" required />
          </div>
          <div>
            <label>Phosphate * <span className="text-sm text-gray-500">mg/dL</span></label>
            <input type="number" step="0.01" name="phosphate" required />
          </div>
        </div>
      </div>

      {/* Organ Function */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label>Creatinine <span className="text-sm text-gray-500">mg/dL</span></label>
          <input type="number" step="0.1" name="creatinine" />
        </div>
        <div>
          <label>BUN <span className="text-sm text-gray-500">mg/dL</span></label>
          <input type="number" step="0.1" name="bun" />
        </div>
        <div>
          <label>SGOT <span className="text-sm text-gray-500">U/L</span></label>
          <input type="number" name="sgot" />
        </div>
        <div>
          <label>SGPT <span className="text-sm text-gray-500">U/L</span></label>
          <input type="number" name="sgpt" />
        </div>
      </div>

      {/* Specialized Markers */}
      <details>
        <summary className="cursor-pointer text-sm font-medium text-blue-600">
          Advanced Tumor Markers (Optional)
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div>
            <label>CEA <span className="text-sm text-gray-500">ng/mL</span></label>
            <input type="number" step="0.1" name="cea" />
          </div>
          <div>
            <label>PSA <span className="text-sm text-gray-500">ng/mL</span></label>
            <input type="number" step="0.1" name="psa" />
          </div>
          <div>
            <label>CA 125 <span className="text-sm text-gray-500">U/mL</span></label>
            <input type="number" step="0.1" name="ca125" />
          </div>
          <div>
            <label>CA 19-9 <span className="text-sm text-gray-500">U/mL</span></label>
            <input type="number" step="0.1" name="ca199" />
          </div>
          <div>
            <label>AFP <span className="text-sm text-gray-500">ng/mL</span></label>
            <input type="number" step="0.1" name="afp" />
          </div>
        </div>
      </details>
    </div>
  );
}
```

**Step 2: Create RadiologyModalities Sub-Component**

```typescript
// File: /components/patients/wizard/subsections/RadiologyModalities.tsx

interface RadiologyStudy {
  modality: 'XRAY' | 'MRI' | 'CT' | 'BONE_SCAN' | 'PET';
  studyDate: Date;
  findings: string;
  images?: File[];
}

export function RadiologyModalities() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Radiologi</h3>

      {/* X-ray - REQUIRED */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3">Conventional X-ray *</h4>
        <div className="space-y-3">
          <div>
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*,.dcm" />
          </div>
          <div>
            <label>Findings *</label>
            <textarea rows={3} name="xrayFindings" required
              placeholder="Deskripsi radiologi: lokasi lesi, karakteristik (litik/blastik), batas (tegas/tidak), korteks, periosteal reaction, soft tissue mass, dll" />
          </div>
        </div>
      </div>

      {/* MRI */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">MRI</h4>
        <div className="space-y-3">
          <div>
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*,.dcm" />
          </div>
          <div>
            <label>Findings</label>
            <textarea rows={3} name="mriFindings"
              placeholder="T1, T2, STIR, contrast enhancement, ukuran tumor, hubungan dengan struktur neurovascular, bone marrow involvement, dll" />
          </div>
        </div>
      </div>

      {/* CT Scan */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">CT Scan</h4>
        <div className="space-y-3">
          <div>
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*,.dcm" />
          </div>
          <div>
            <label>Findings</label>
            <textarea rows={3} name="ctFindings"
              placeholder="Ukuran tumor, mineralisasi, korteks destruction, soft tissue extension, adenopati regional, dll" />
          </div>
        </div>
      </div>

      {/* Bone Scan */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Bone Scan</h4>
        <div className="space-y-3">
          <div>
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*,.dcm" />
          </div>
          <div>
            <label>Findings</label>
            <textarea rows={3} name="boneScanFindings"
              placeholder="Lokasi uptake, intensitas, skip lesions, metastasis tulang, dll" />
          </div>
        </div>
      </div>

      {/* PET Scan */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">PET Scan</h4>
        <div className="space-y-3">
          <div>
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*,.dcm" />
          </div>
          <div>
            <label>Findings</label>
            <textarea rows={3} name="petFindings"
              placeholder="SUV max, lokasi FDG uptake, staging, response assessment, dll" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Add Pathology Extensions**

```typescript
// File: Section4DiagnosticInvestigations.tsx
// ADD AFTER biopsy fields:

interface PathologyExtended {
  // Existing:
  biopsyType?: 'FNAB' | 'CORE' | 'OPEN';
  biopsyDate?: Date;
  biopsyResult?: string;

  // NEW:
  immunohistochemistry?: Record<string, string>; // IHK markers
  huvosGrade?: 'I' | 'II' | 'III' | 'IV';         // Chemo response
}

// UI - Immunohistochemistry:
<div>
  <h4>Immunohistokimia (IHK)</h4>
  <div className="space-y-2">
    <div className="grid grid-cols-2 gap-4">
      <input placeholder="Marker (e.g., S100)" name="ihkMarker[]" />
      <input placeholder="Result (e.g., Positive)" name="ihkResult[]" />
    </div>
    <button type="button" onClick={addIHKMarker}>+ Add Marker</button>
  </div>
</div>

// UI - HUVOS Grade:
<div>
  <label>HUVOS Grade (Post-Chemotherapy Necrosis)</label>
  <select name="huvosGrade">
    <option value="">N/A (No Chemotherapy)</option>
    <option value="I">Grade I (&lt;50% necrosis)</option>
    <option value="II">Grade II (50-89% necrosis)</option>
    <option value="III">Grade III (90-99% necrosis)</option>
    <option value="IV">Grade IV (100% necrosis - complete response)</option>
  </select>
  <p className="text-sm text-gray-500 mt-1">
    Hanya untuk pasien yang sudah mendapat kemoterapi neo-adjuvant
  </p>
</div>
```

**Priority**: P0 (CRITICAL - Laboratory values and radiology separation are essential)

---

## **SECTION 5: DIAGNOSIS & LOCATION**

### ✅ Sudah Diimplementasikan:
- [x] WHO Bone Tumor Classification Tree (57 classifications)
- [x] WHO Soft Tissue Tumor Classification Tree (68 classifications)
- [x] Hierarchical Bone Location Picker (95 locations, 3 levels)
- [x] Soft Tissue Location Picker (36 regions)
- [x] Laterality (Right/Left/Bilateral/Midline)
- [x] Tumor syndrome checklist

### ❌ Missing dari Dokumen INAMSOS:

#### 1. **Tumor Size - Specific Dropdown**:
Saat ini mungkin ada input bebas, tapi dokumen memerlukan DROPDOWN SPECIFIC:
- [ ] `tumorSize` - ≤5cm / >5-10cm / >10-15cm / >15cm / N/A

#### 2. **Tumor Depth** (for soft tissue):
- [ ] `tumorDepth` - Superficial / Deep

#### 3. **Metastasis at Diagnosis**:
- [ ] `metastasisAtDiagnosis` - Yes lung / Yes other / No

#### 4. **Additional Diagnoses**:
- [ ] `diagnosisKomplikasi` - Complication diagnosis
- [ ] `diagnosisKomorbid` - Comorbidity diagnosis

### 🔧 Action Required:
```typescript
// File: Section5DiagnosisLocation.tsx

interface Section5Data {
  // Existing fields...

  // NEW SPECIFIC FIELDS:
  tumorSize: '<=5CM' | '>5_10CM' | '>10_15CM' | '>15CM' | 'NA';
  tumorDepth?: 'SUPERFICIAL' | 'DEEP';  // Only for soft tissue
  metastasisLung: boolean;
  metastasisOther: boolean;
  metastasisOtherSites?: string;
  diagnosisKomplikasi?: string;
  diagnosisKomorbid?: string;
}

// UI:
<div>
  <label>Tumor Size in Greatest Dimension *</label>
  <select name="tumorSize" required>
    <option value="">Pilih Ukuran Tumor</option>
    <option value="<=5CM">≤5 cm</option>
    <option value=">5_10CM">&gt;5 and ≤10 cm</option>
    <option value=">10_15CM">&gt;10 and ≤15 cm</option>
    <option value=">15CM">&gt;15 cm</option>
    <option value="NA">Not applicable</option>
  </select>
</div>

{/* Show only for SOFT_TISSUE pathology */}
{pathologyType === 'SOFT_TISSUE' && (
  <div>
    <label>Tumor Depth</label>
    <div className="flex gap-4">
      <label className="flex items-center">
        <input type="checkbox" name="tumorDepth" value="SUPERFICIAL" />
        <span className="ml-2">Superficial</span>
      </label>
      <label className="flex items-center">
        <input type="checkbox" name="tumorDepth" value="DEEP" />
        <span className="ml-2">Deep</span>
      </label>
    </div>
  </div>
)}

<div>
  <label>Metastasis at Diagnosis</label>
  <div className="space-y-2">
    <label className="flex items-center">
      <input type="checkbox" name="metastasisLung" />
      <span className="ml-2">Yes, lung metastasis</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="metastasisOther" />
      <span className="ml-2">Yes, other than lung</span>
    </label>
    {metastasisOther && (
      <input type="text" name="metastasisOtherSites"
        placeholder="Specify sites (e.g., liver, brain)" />
    )}
    <label className="flex items-center">
      <input type="radio" name="metastasis" value="NO" />
      <span className="ml-2">No metastasis</span>
    </label>
  </div>
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <label>Diagnosis Komplikasi</label>
    <textarea name="diagnosisKomplikasi" rows={2}
      placeholder="Fraktur patologis, kompresi medula spinalis, dll" />
  </div>
  <div>
    <label>Diagnosis Komorbid</label>
    <textarea name="diagnosisKomorbid" rows={2}
      placeholder="DM, hipertensi, penyakit jantung, dll" />
  </div>
</div>
```

**Priority**: P1 (HIGH - Critical for staging and prognosis)

---

## **SECTION 6: STAGING** ⚠️ **BELUM AKTIF - PERLU DIAKTIFKAN!**

### 📁 File Status:
- Component: `/components/patients/wizard/sections/Section6Staging.tsx` ✅ EXISTS
- Import: ❌ **NOT IMPORTED** in `page.tsx`

### ✅ Yang Seharusnya Sudah Ada di Component:
- [x] Enneking Staging (IA/IB/IIA/IIB/III)
- [x] AJCC Staging (IA/IB/IIA/IIB/III/IVA/IVB)
- [x] Histopathology Grade (Benign/Grade 1/2/3/X)

### 🔧 Action Required:
```typescript
// File: /frontend/src/app/patients/new/page.tsx
// LINE 11: ADD IMPORT
import { Section6Staging } from '@/components/patients/wizard/sections/Section6Staging';
import { validateSection6 } from '@/components/patients/wizard/ValidationUtils';

// LINE 116: ADD TO SECTIONS ARRAY (AFTER Section5)
{
  id: 'section6',
  title: 'Staging',
  description: 'Enneking, AJCC, dan grading tumor',
  component: Section6Staging,
  validate: validateSection6,
},
```

**Verification Steps:**
1. Check if `Section6Staging.tsx` includes all 3 required fields
2. Ensure validation function exists in `ValidationUtils.ts`
3. Test navigation between Section 5 → Section 6 → Section 7

**Priority**: P0 (CRITICAL - Staging is mandatory for all cancer registries!)

---

## **SECTION 7: CPC (CANCER PATIENT CONFERENCE)** ⚠️ **BELUM AKTIF - PERLU DIAKTIFKAN!**

### 📁 File Status:
- Component: `/components/patients/wizard/sections/Section7CPCConference.tsx` ✅ EXISTS
- Import: ❌ **NOT IMPORTED** in `page.tsx`

### ✅ Yang Seharusnya Sudah Ada di Component:
- [x] CPC Date
- [x] CPC Recommendation

### ❌ Missing dari Dokumen INAMSOS:
1. **Attending Consultants Checklist**:
   - [ ] Orthopedic Oncology
   - [ ] Medical Oncology
   - [ ] Radiation Oncology
   - [ ] Radiology
   - [ ] Pathology
   - [ ] Rehabilitation
   - [ ] Palliative Care

### 🔧 Action Required:

**Step 1: Activate Section**
```typescript
// File: /frontend/src/app/patients/new/page.tsx
// LINE 12: ADD IMPORT
import { Section7CPCConference } from '@/components/patients/wizard/sections/Section7CPCConference';
import { validateSection7 } from '@/components/patients/wizard/ValidationUtils';

// ADD TO SECTIONS ARRAY (AFTER Section6)
{
  id: 'section7',
  title: 'CPC Conference',
  description: 'Multidisciplinary team decision',
  component: Section7CPCConference,
  validate: validateSection7,
},
```

**Step 2: Add Consultants Checklist**
```typescript
// File: Section7CPCConference.tsx

interface Section7Data {
  cpcDate?: Date;
  cpcRecommendation?: string;

  // NEW:
  attendingConsultants: {
    orthopedicOncology: boolean;
    medicalOncology: boolean;
    radiationOncology: boolean;
    radiology: boolean;
    pathology: boolean;
    rehabilitation: boolean;
    palliativeCare: boolean;
  };
}

// UI:
<div>
  <label>Konsultan Hadir</label>
  <div className="grid grid-cols-2 gap-3">
    <label className="flex items-center">
      <input type="checkbox" name="consultants.orthopedicOncology" />
      <span className="ml-2">Orthopedic Oncology</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.medicalOncology" />
      <span className="ml-2">Medical Oncology</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.radiationOncology" />
      <span className="ml-2">Radiation Oncology</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.radiology" />
      <span className="ml-2">Radiology</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.pathology" />
      <span className="ml-2">Pathology</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.rehabilitation" />
      <span className="ml-2">Rehabilitation</span>
    </label>
    <label className="flex items-center">
      <input type="checkbox" name="consultants.palliativeCare" />
      <span className="ml-2">Palliative Care</span>
    </label>
  </div>
</div>

<div>
  <label>Keputusan CPC</label>
  <textarea name="cpcRecommendation" rows={4}
    placeholder="Ringkasan diskusi multidisiplin dan rekomendasi treatment plan" />
</div>
```

**Priority**: P1 (HIGH - CPC is standard of care for tumor management)

---

## **SECTION 8: TREATMENT MANAGEMENT** ⭐ **CRITICAL - BELUM AKTIF!**

### 📁 File Status:
- Component: `/components/patients/wizard/sections/Section8TreatmentManagement.tsx` ✅ EXISTS
- Import: ❌ **NOT IMPORTED** in `page.tsx`

### 🔥 **THE MOST CRITICAL SECTION - CONTAINS LIMB SALVAGE METRIC!**

Dokumen INAMSOS memerlukan tracking yang SANGAT DETAIL untuk treatment:

### Required Treatment Fields:

#### **8.1 Treatment Intention** *
- [ ] `treatmentIntention` - Curative / Palliative

#### **8.2 Systemic Therapy**

**Analgesia:**
- [ ] `analgesiaGiven` - Yes/No
- [ ] `analgesiaStartDate` - Date

**Chemotherapy Neo-Adjuvant:**
- [ ] `chemoNeoAdjuvant` - Yes/No
- [ ] `chemoNeoStartDate` - Date
- [ ] `chemoNeoSeries` - Number of cycles
- [ ] `chemoNeoRegimen` - e.g., "MAP", "HDMTX"
- [ ] `chemoNeoDose` - Dosing details

**Chemotherapy Adjuvant:**
- [ ] `chemoAdjuvant` - Yes/No
- [ ] `chemoAdjStartDate` - Date
- [ ] `chemoAdjSeries` - Number of cycles
- [ ] `chemoAdjRegimen` - Regimen name
- [ ] `chemoAdjDose` - Dosing details

**Targeted Therapy:**
- [ ] `targetedTherapy` - Yes/No
- [ ] `targetedTherapyDate` - Date
- [ ] `targetedTherapyRegimen` - e.g., "Imatinib", "Pazopanib"

#### **8.3 Surgery** ⭐⭐⭐ **THE MOST CRITICAL SECTION!**

**Basic:**
- [ ] `surgeryPerformed` - Yes/No *
- [ ] `surgeryDate` - Date

**CRITICAL - Limb Salvage:**
- [ ] `surgeryType` - **LIMB_SALVAGE / LIMB_ABLATION** ⭐⭐⭐
- [ ] `amputationLevel` - If LIMB_ABLATION

**Surgical Margin:**
- [ ] `surgicalMarginIntent` - Intralesional/Marginal/Wide/Radical
- [ ] `finalSurgicalMargin` - Wide R0 (≥1mm) / Marginal R0 (<1mm) / R1 / R2 / Intralesional

**Reconstruction:**
- [ ] `boneReconstruction` - Yes/No
- [ ] `boneReconstructionMethod` - Autograft/Allograft/Megaprosthesis/Bone cement/Custom
- [ ] `jointReconstruction` - Yes/No
- [ ] `jointReconstructionMethod` - Total joint/Hemiarthroplasty/Arthrodesis
- [ ] `softTissueReconstruction` - Yes/No
- [ ] `softTissueReconstructionMethod` - Local flap/Free flap/Skin graft/Primary closure

**Surgical Details:**
- [ ] `bloodLoss` - Volume in mL
- [ ] `operativeDuration` - Minutes
- [ ] `complications` - Text
- [ ] `intraoperativeContamination` - Yes/No

#### **8.4 Radiotherapy**

**Neo-Adjuvant:**
- [ ] `radioNeoAdjuvant` - Yes/No
- [ ] `radioNeoDate` - Date
- [ ] `radioNeoSeries` - Number of fractions
- [ ] `radioNeoDose` - Total dose in Gy

**Adjuvant:**
- [ ] `radioAdjuvant` - Yes/No
- [ ] `radioAdjDate` - Date
- [ ] `radioAdjSeries` - Number of fractions
- [ ] `radioAdjDose` - Total dose in Gy

### 🔧 Action Required:

**Step 1: Activate Section**
```typescript
// File: /frontend/src/app/patients/new/page.tsx
// LINE 13: ADD IMPORT
import { Section8TreatmentManagement } from '@/components/patients/wizard/sections/Section8TreatmentManagement';
import { validateSection8 } from '@/components/patients/wizard/ValidationUtils';

// ADD TO SECTIONS ARRAY (AFTER Section7)
{
  id: 'section8',
  title: 'Management',
  description: 'Treatment plan: surgery, chemotherapy, radiotherapy',
  component: Section8TreatmentManagement,
  validate: validateSection8,
},
```

**Step 2: Verify Component Has All Fields**

The component **MUST** include this structure:

```typescript
// File: Section8TreatmentManagement.tsx

interface Section8Data {
  // Treatment Intention
  treatmentIntention: 'CURATIVE' | 'PALLIATIVE';

  // Systemic Therapy
  analgesiaGiven: boolean;
  analgesiaStartDate?: Date;

  chemoNeoAdjuvant: boolean;
  chemoNeoStartDate?: Date;
  chemoNeoSeries?: number;
  chemoNeoRegimen?: string;
  chemoNeoDose?: string;

  chemoAdjuvant: boolean;
  chemoAdjStartDate?: Date;
  chemoAdjSeries?: number;
  chemoAdjRegimen?: string;
  chemoAdjDose?: string;

  targetedTherapy: boolean;
  targetedTherapyDate?: Date;
  targetedTherapyRegimen?: string;

  // Surgery ⭐ CRITICAL
  surgeryPerformed: boolean;
  surgeryDate?: Date;

  // THE MOST IMPORTANT FIELD!
  surgeryType?: 'LIMB_SALVAGE' | 'LIMB_ABLATION';
  amputationLevel?: string;

  surgicalMarginIntent?: 'INTRALESIONAL' | 'MARGINAL' | 'WIDE' | 'RADICAL';
  finalSurgicalMargin?: 'WIDE_R0_GTE1MM' | 'MARGINAL_R0_LT1MM' | 'R1' | 'R2' | 'INTRALESIONAL';

  boneReconstruction: boolean;
  boneReconstructionMethod?: string;
  jointReconstruction: boolean;
  jointReconstructionMethod?: string;
  softTissueReconstruction: boolean;
  softTissueReconstructionMethod?: string;

  bloodLoss?: number;
  operativeDuration?: number;
  complications?: string;
  intraoperativeContamination?: boolean;

  // Radiotherapy
  radioNeoAdjuvant: boolean;
  radioNeoDate?: Date;
  radioNeoSeries?: number;
  radioNeoDose?: number;

  radioAdjuvant: boolean;
  radioAdjDate?: Date;
  radioAdjSeries?: number;
  radioAdjDose?: number;
}
```

**Step 3: Critical UI Element - Limb Salvage Selector**

```typescript
// HIGHLIGHT THIS AS THE PRIMARY OUTCOME METRIC

{surgeryPerformed && (
  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
    <h3 className="text-xl font-bold text-red-900 mb-4">
      ⭐ PRIMARY OUTCOME: Limb Salvage vs Ablation
    </h3>
    <p className="text-sm text-red-700 mb-4">
      This is THE MOST IMPORTANT metric for musculoskeletal tumor registry!
    </p>

    <div className="space-y-3">
      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
        <input type="radio" name="surgeryType" value="LIMB_SALVAGE" required />
        <div className="ml-3">
          <div className="font-semibold text-lg">Limb Salvage (Limb-Sparing Surgery)</div>
          <div className="text-sm text-gray-600">Tumor removal with limb preservation</div>
        </div>
      </label>

      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-red-50 has-[:checked]:border-red-600 has-[:checked]:bg-red-50">
        <input type="radio" name="surgeryType" value="LIMB_ABLATION" required />
        <div className="ml-3">
          <div className="font-semibold text-lg">Limb Ablation (Amputation/Disarticulation)</div>
          <div className="text-sm text-gray-600">Limb removal due to tumor extent or complications</div>
        </div>
      </label>
    </div>

    {surgeryType === 'LIMB_ABLATION' && (
      <div className="mt-4">
        <label>Amputation Level</label>
        <select name="amputationLevel" required>
          <option value="">Select Level</option>
          <option value="HEMIPELVECTOMY">Hemipelvectomy</option>
          <option value="HIP_DISARTICULATION">Hip Disarticulation</option>
          <option value="ABOVE_KNEE">Above Knee (AKA)</option>
          <option value="KNEE_DISARTICULATION">Knee Disarticulation</option>
          <option value="BELOW_KNEE">Below Knee (BKA)</option>
          <option value="FOREQUARTER">Forequarter Amputation</option>
          <option value="SHOULDER_DISARTICULATION">Shoulder Disarticulation</option>
          <option value="ABOVE_ELBOW">Above Elbow</option>
          <option value="ELBOW_DISARTICULATION">Elbow Disarticulation</option>
          <option value="BELOW_ELBOW">Below Elbow</option>
          <option value="WRIST_DISARTICULATION">Wrist Disarticulation</option>
        </select>
      </div>
    )}
  </div>
)}
```

**Priority**: P0 (CRITICAL - THE MOST IMPORTANT SECTION!)

---

## **SECTION 9: FOLLOW-UP MANAGEMENT** ✅ **SKIP - ALREADY EXISTS AT /follow-up**

Per user request, section ini diabaikan karena sudah ada halaman terpisah di `/follow-up`.

**Note**: Verifikasi bahwa `/follow-up` sudah include:
- 14-visit structure (Year 1-2: Q3M, Year 3-5: Q6M)
- MSTS Score calculator (0-30 points, 6 domains)
- Recurrence tracking
- Complication tracking

---

## **SECTION 10: REVIEW & SUBMIT**

### ✅ Sudah Diimplementasikan:
- [x] Data summary view
- [x] Save as draft
- [x] Submit for review

### ❌ Possible Enhancements dari Dokumen:
1. **Data Quality Validation**:
   - [ ] Check all required fields (*)
   - [ ] Logical consistency (e.g., if BONE tumor → must have Bone Location)
   - [ ] Warning for missing optional but recommended fields

2. **Export/Print**:
   - [ ] PDF export of summary
   - [ ] Print-friendly view

### 🔧 Action Required:
```typescript
// File: Section10Review.tsx

// ADD Validation Summary
const validationSummary = {
  section1: { required: 2, filled: 2, optional: 3, filled: 1 },
  section2: { required: 5, filled: 5, optional: 2, filled: 2 },
  section3: { required: 1, filled: 1, optional: 14, filled: 8 },
  section4: { required: 6, filled: 4, optional: 20, filled: 5 },
  section5: { required: 4, filled: 4, optional: 5, filled: 3 },
  section6: { required: 2, filled: 2, optional: 1, filled: 1 },
  section7: { required: 0, filled: 0, optional: 3, filled: 2 },
  section8: { required: 3, filled: 3, optional: 25, filled: 15 },
};

// Display Completeness Indicator
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <h3 className="font-semibold mb-2">Data Completeness</h3>
  <div className="space-y-2">
    {Object.entries(validationSummary).map(([section, stats]) => (
      <div key={section} className="flex items-center justify-between">
        <span>Section {section.replace('section', '')}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Required: {stats.filled}/{stats.required}
          </span>
          <span className="text-sm text-gray-500">
            Optional: {stats.optionalFilled}/{stats.optional}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${(stats.filled / stats.required) * 100}%` }}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

// ADD PDF Export
<button type="button" onClick={exportToPDF}>
  <PrinterIcon className="w-5 h-5 mr-2" />
  Export to PDF
</button>
```

**Priority**: P2 (MEDIUM - Nice to have for data quality assurance)

---

## 📊 IMPLEMENTATION ROADMAP

### **PHASE 1: ACTIVATE EXISTING SECTIONS** (Week 1)
**Priority: P0 - CRITICAL**

#### Day 1-2: Section 6 (Staging)
- [x] Import Section6Staging in page.tsx
- [x] Add to sections array
- [x] Create/verify validateSection6
- [x] Test navigation
- [x] Verify Enneking + AJCC + Grade fields

#### Day 3-5: Section 8 (Treatment Management) ⭐
- [x] Import Section8TreatmentManagement in page.tsx
- [x] Add to sections array
- [x] Create/verify validateSection8
- [x] **CRITICAL**: Verify Limb Salvage vs Ablation selector
- [x] Verify all chemotherapy fields
- [x] Verify all radiotherapy fields
- [x] Verify surgical details (margins, reconstruction, blood loss, etc.)
- [x] Test complete workflow Section 1 → Section 8 → Section 10

#### Day 6-7: Section 7 (CPC)
- [x] Import Section7CPCConference in page.tsx
- [x] Add to sections array
- [x] Add consultants checklist
- [x] Create/verify validateSection7
- [x] Test navigation

**Deliverable**: 9/10 sections active (excluding Section 9 Follow-up)

---

### **PHASE 2: ADD MISSING CRITICAL FIELDS** (Week 2)
**Priority: P0 - CRITICAL**

#### Section 4: Laboratory Tests
- [ ] Create LaboratoryTests sub-component
- [ ] Add ALP, LDH, Calcium, Phosphate fields (REQUIRED)
- [ ] Add CBC, ESR, CRP fields
- [ ] Add organ function tests
- [ ] Add optional tumor markers

#### Section 4: Radiology Modalities
- [ ] Create RadiologyModalities sub-component
- [ ] Separate X-ray (REQUIRED)
- [ ] Separate MRI, CT, Bone Scan, PET
- [ ] Add image upload for each modality
- [ ] Add findings textarea for each

#### Section 4: Pathology Extended
- [ ] Add IHK (Immunohistochemistry) key-value fields
- [ ] Add HUVOS Grade selector (I/II/III/IV)

#### Section 5: Tumor Characteristics
- [ ] Add tumor size dropdown (specific ranges)
- [ ] Add tumor depth (Superficial/Deep)
- [ ] Add metastasis at diagnosis checkboxes
- [ ] Add diagnosis komplikasi & komorbid

**Deliverable**: All P0 fields implemented

---

### **PHASE 3: ADD MISSING HIGH-PRIORITY FIELDS** (Week 3)
**Priority: P1 - HIGH**

#### Section 1: Metadata
- [ ] Add consultant name field
- [ ] Add resident name field

#### Section 2: Identity Extended
- [ ] Add tumor registry number auto-generation
- [ ] Add education level dropdown

#### Section 3: Clinical Data Extended
- [ ] Add anamnesa fields (cancer history, family history)
- [ ] Add structured physical examination (5 sections)
- [ ] Add status lokalisata field

**Deliverable**: All P1 fields implemented

---

### **PHASE 4: BACKEND API INTEGRATION** (Week 4)
**Priority: P0 - CRITICAL**

#### Create Backend Controllers/Services:
- [ ] LaboratoryResult_Extended CRUD
- [ ] RadiologyFinding CRUD (by modality)
- [ ] HuvosGrade CRUD
- [ ] SurgicalRecord CRUD ⭐
- [ ] ChemotherapyRecord CRUD
- [ ] RadiotherapyRecord CRUD
- [ ] CpcRecord CRUD

#### Update Patient Creation API:
- [ ] Accept extended Section 3 fields
- [ ] Accept extended Section 4 fields
- [ ] Accept extended Section 5 fields
- [ ] Accept Section 6 data
- [ ] Accept Section 7 data
- [ ] Accept Section 8 data ⭐

**Deliverable**: Complete backend support for all sections

---

### **PHASE 5: VALIDATION & TESTING** (Week 5)
**Priority: P0 - CRITICAL**

#### Unit Tests:
- [ ] Test each section component
- [ ] Test validation functions
- [ ] Test data flow FormContext → API

#### Integration Tests:
- [ ] Test complete workflow Section 1 → 10
- [ ] Test save draft functionality
- [ ] Test auto-save (every 2 minutes)
- [ ] Test submit and create patient

#### User Acceptance Testing:
- [ ] Test with real medical officers
- [ ] Test with different pathology types (BONE vs SOFT_TISSUE)
- [ ] Test all conditional fields (e.g., tumor depth only for soft tissue)
- [ ] Test limb salvage workflow
- [ ] Test reconstruction options

**Deliverable**: Production-ready patient entry form

---

## 🎯 CRITICAL SUCCESS METRICS

### **Form Completeness:**
- ✅ 10/10 sections active (excluding Follow-up at /follow-up)
- ✅ 100% of INAMSOS document fields implemented
- ✅ **Limb Salvage vs Ablation tracking** (THE MOST IMPORTANT!)
- ✅ Laboratory values (ALP, LDH, Ca, Phosphate)
- ✅ HUVOS grade tracking
- ✅ Surgical details (margins, reconstruction, blood loss)
- ✅ Chemotherapy & Radiotherapy tracking

### **Data Quality:**
- ✅ All required fields (*) enforced
- ✅ Logical validation (e.g., BONE → Bone Location required)
- ✅ Auto-calculation (BMI, Mirrel Score)
- ✅ Data consistency checks

### **User Experience:**
- ✅ Auto-save every 2 minutes
- ✅ Section-by-section navigation
- ✅ Progress indicator
- ✅ Conditional fields (show/hide based on context)
- ✅ Helper text and tooltips

---

## 📝 IMPLEMENTATION CHECKLIST

### **Immediate Actions (This Week):**

- [ ] **DAY 1**: Import and activate Section 6 (Staging)
- [ ] **DAY 2**: Import and activate Section 7 (CPC)
- [ ] **DAY 3-4**: Import and activate Section 8 (Treatment Management) ⭐
- [ ] **DAY 5**: Test complete workflow Section 1 → 10

### **Next Week:**

- [ ] Implement Laboratory Tests subsection
- [ ] Implement Radiology Modalities subsection
- [ ] Add HUVOS grade to pathology
- [ ] Add tumor size/depth/metastasis to Section 5

### **Week 3:**

- [ ] Add all missing P1 fields to Sections 1-3, 5
- [ ] Create backend API endpoints
- [ ] Test API integration

### **Week 4:**

- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Documentation

---

## 🚨 BLOCKERS & RISKS

### **Known Issues:**
1. ⚠️ Section 6, 7, 8 components exist but not imported - **EASY FIX**
2. ⚠️ Backend API may need schema updates for extended fields - **CHECK SCHEMA**
3. ⚠️ Laboratory tests require precise units and normal ranges - **NEEDS MEDICAL REVIEW**

### **Questions for Stakeholders:**
1. Should HUVOS grade be REQUIRED if chemotherapy was given?
2. Should we enforce CPC date BEFORE surgery date?
3. What is the minimum required laboratory panel? (Currently assuming ALP/LDH/Ca/Phosphate)

---

## 📚 APPENDIX: FIELD MAPPING

### **Complete Field Count:**

| Section | Doc Fields | Implemented | Missing | Priority |
|---------|------------|-------------|---------|----------|
| 1. Center & Pathology | 5 | 2 | 3 | P2 |
| 2. Patient Identity | 13 | 11 | 2 | P1 |
| 3. Clinical Data | 15 | 8 | 7 | P1 |
| 4. Diagnostic Inv. | 30 | 6 | 24 | **P0** |
| 5. Diagnosis & Location | 16 | 12 | 4 | P1 |
| 6. Staging | 3 | **0** | 3 | **P0** |
| 7. CPC | 3 | **0** | 3 | P1 |
| 8. Management | 30 | **0** | 30 | **P0** |
| 9. Follow-up | 84 | **N/A** | N/A | SKIP |
| 10. Review | 3 | 3 | 0 | ✅ |
| **TOTAL** | **202** | **42** | **76** | - |

**Current Coverage**: 42/202 fields = **20.8%**
**Target Coverage**: 118/202 fields = **58.4%** (excluding Follow-up + P2 fields)
**Critical Gap**: **76 missing fields, 37 are P0/P1 priority**

---

## ✅ NEXT IMMEDIATE STEPS

**Mulai dari yang paling mudah dan paling berdampak:**

1. **TODAY** (2 hours):
   - Import Section6Staging, Section7CPCConference, Section8TreatmentManagement di page.tsx
   - Test navigation 1 → 10
   - Verify Limb Salvage selector works

2. **TOMORROW** (4 hours):
   - Add missing fields to Section 7 (consultants checklist)
   - Verify all Section 8 fields match INAMSOS document
   - Create validation functions for Sections 6, 7, 8

3. **NEXT WEEK** (20 hours):
   - Implement Laboratory Tests subsection
   - Implement Radiology Modalities subsection
   - Add HUVOS grade + IHK fields
   - Add tumor characteristics to Section 5

---

**Total Estimated Effort**: 120 hours (3 weeks full-time development)

**Critical Path**: Activate Sections 6-8 → Add P0 fields → Backend API → Testing

**Risk Level**: **MEDIUM** (Components exist, need integration + field additions)

---

END OF COMPREHENSIVE ADAPTATION PLAN
