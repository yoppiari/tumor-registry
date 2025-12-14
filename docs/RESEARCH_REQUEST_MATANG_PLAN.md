# Research Data Request System - RENCANA MATANG (SEDERHANA & EFEKTIF)

**Tanggal:** 2025-12-14
**Priority:** P0 - CRITICAL
**Approach:** Simple, Checklist-Based, Approval-Integrated

---

## 🎯 MASALAH YANG HARUS DIPECAHKAN

### **Current Issue:**
- `/research/requests` hanya form biasa tanpa approval workflow
- Data yang di-request adalah data KRUSIAL (data pasien muskuloskeletal tumor)
- Tidak ada integrasi dengan `/approvals` system
- Form patient (`/patients/new`) punya 9 sections dengan data SANGAT LENGKAP yang bisa di-request

### **Required Solution:**
1. ✅ Form request yang **SEDERHANA** (bukan 9 sections seperti patient form)
2. ✅ Request **HARUS masuk** ke `/approvals` untuk review admin
3. ✅ Researcher bisa **PILIH data fields** spesifik yang mereka butuhkan
4. ✅ **EFEKTIF**: Cukup informasi untuk admin review, tidak berlebihan

---

## 📊 ANALISIS: DATA APA SAJA YANG BISA DI-REQUEST?

### **Berdasarkan Patient Form (9 Sections):**

```
SECTION 1: CENTER & PATHOLOGY TYPE
├── Center Name/Location
├── Pathology Type (Bone Tumor / Soft Tissue Tumor / Metastatic Bone Disease)

SECTION 2: PATIENT DEMOGRAPHICS & IDENTITY
├── NIK (Identitas Nasional) ⚠️ SENSITIVE
├── Name ⚠️ SENSITIVE
├── Date of Birth / Age
├── Place of Birth
├── Gender
├── Blood Type
├── Religion
├── Marital Status
├── Occupation
├── Education Level
├── Phone Number ⚠️ SENSITIVE
├── Email ⚠️ SENSITIVE
├── Address (Province, Regency, District, Village) ⚠️ SEMI-SENSITIVE
├── Emergency Contact ⚠️ SENSITIVE

SECTION 3: CLINICAL DATA
├── Chief Complaint
├── Onset Date
├── Symptom Duration
├── Presenting Symptoms (pain, swelling, mass, fracture, impairment)
├── Tumor Size at Presentation
├── Family History of Cancer
├── Tumor Syndrome (Li-Fraumeni, NF1, Ollier, etc)
├── Karnofsky Performance Score

SECTION 4: DIAGNOSTIC INVESTIGATIONS
├── Biopsy Date, Type, Result
├── Imaging Studies (X-ray, CT, MRI, Bone Scan, PET-CT)
├── Laboratory Results (ALP, LDH, Ca, Phosphate, etc)
├── Radiology Findings
├── Mirrel Score (Pathological Fracture Risk)
├── Pathology Reports
├── HUVOS Grade (Chemotherapy Response)

SECTION 5: DIAGNOSIS & LOCATION
├── WHO Bone Tumor Classification (57 types) ⭐ CORE DATA
├── WHO Soft Tissue Tumor Classification (68 types) ⭐ CORE DATA
├── Bone Location (95 hierarchical locations) ⭐ CORE DATA
├── Soft Tissue Location (36 regions) ⭐ CORE DATA
├── Laterality (Left/Right/Bilateral/Midline)
├── Histopathology Grade
├── Mitosis Count
├── Necrosis Percentage

SECTION 6: STAGING
├── Enneking Staging (IA/IB/IIA/IIB/III) ⭐ CORE DATA
├── AJCC TNM Staging
├── Tumor Size (3D dimensions)
├── Mirrel Score
├── Metastasis Present/Sites

SECTION 7: CPC CONFERENCE
├── CPC Date
├── CPC Recommendation (Multidisciplinary Decision)

SECTION 8: TREATMENT MANAGEMENT
├── Intended Treatment (Curative/Palliative/Supportive)
├── Chemotherapy Records (Neo-adjuvant/Adjuvant, Regimen) ⭐ KEY
├── Surgical Records (Limb Salvage/Amputation, Margins) ⭐ KEY
├── Radiotherapy Records (Dose, Fractions) ⭐ KEY
├── Reconstruction Details (Bone Graft, Joint Replacement, Flap)

SECTION 9: FOLLOW-UP & OUTCOMES
├── Follow-up Visits (14-visit structure over 5 years) ⭐ KEY
├── MSTS Functional Scores (0-30 points) ⭐ KEY
├── Recurrence Tracking (Local/Distant)
├── Complication Tracking
├── Survival Status & Duration
```

### **Data Sensitivity Levels:**

| Level | Data Type | Examples |
|-------|-----------|----------|
| 🔴 **HIGH SENSITIVE** | Direct Identifiers | NIK, Full Name, Phone, Email, Address |
| 🟡 **MEDIUM SENSITIVE** | Quasi-Identifiers | Date of Birth, Place of Birth, Detailed Address |
| 🟢 **LOW SENSITIVE** | Clinical Data | Diagnosis, Staging, Treatment, Outcomes |

---

## 🏗️ SISTEM YANG DIUSULKAN: "CHECKLIST-BASED REQUEST"

### **CORE CONCEPT:**

> **Researcher centang data categories yang mereka butuhkan, bukan isi form panjang**

### **4-STEP REQUEST FORM (Sederhana tapi Lengkap):**

```
┌────────────────────────────────────────────────────────────┐
│  STEP 1: INFORMASI PENELITIAN                              │
└────────────────────────────────────────────────────────────┘

Peneliti:
  Nama: [Auto-fill dari login]
  Institusi: [Auto-fill dari user profile]
  Email: [Auto-fill]
  No. HP: [Input]

Penelitian:
  Judul Penelitian: [Text input] (Required)
  Tipe: [Dropdown]
    • Akademik (Skripsi/Tesis/Disertasi)
    • Clinical Trial
    • Observational Study
    • Systematic Review/Meta-analysis
    • Lainnya

  Abstrak Singkat: [Textarea, max 500 chars] (Required)
  Tujuan Penelitian: [Textarea, max 300 chars] (Required)


┌────────────────────────────────────────────────────────────┐
│  STEP 2: KRITERIA DATA (Filter Pasien)                    │
└────────────────────────────────────────────────────────────┘

Periode Data:
  Dari: [Date Picker]  Sampai: [Date Picker]

Jenis Tumor: [Multi-select]
  ☐ Bone Tumor
    → [Pilih WHO Classification] (opsional untuk filter spesifik)
  ☐ Soft Tissue Tumor
    → [Pilih WHO Classification] (opsional)
  ☐ Metastatic Bone Disease
  ☐ Semua Jenis

Filter Tambahan (Opsional):
  Staging: [Multi-select]
    ☐ Enneking IA  ☐ IB  ☐ IIA  ☐ IIB  ☐ III
    ☐ AJCC Stage I-IV

  Usia: [Range slider] 0 - 100 tahun
  Gender: ☐ Laki-laki  ☐ Perempuan  ☐ Semua
  Center: [Multi-select dropdown dari 21 centers]

  Treatment: [Multi-select]
    ☐ Limb Salvage  ☐ Amputation
    ☐ Chemotherapy  ☐ Radiotherapy

→ Estimasi Jumlah Pasien: [Auto-calculated, e.g., "~45 pasien"]


┌────────────────────────────────────────────────────────────┐
│  STEP 3: DATA FIELDS (Centang yang Dibutuhkan) ⭐ CORE    │
└────────────────────────────────────────────────────────────┘

📋 CHECKLIST DATA CATEGORIES:

┌──────────────────────────────────────────────────────────┐
│ ☐ DEMOGRAPHICS & IDENTITY                                │
│   ├─ ☐ Age/Date of Birth (de-identified)                │
│   ├─ ☐ Gender                                            │
│   ├─ ☐ Province/Region ONLY (tidak include alamat detail)│
│   ├─ ☐ Full Address ⚠️ (requires extra approval)         │
│   └─ ☐ NIK/Name ⚠️ (requires extra approval + IRB)       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ CLINICAL PRESENTATION                                  │
│   ├─ ☐ Chief Complaint                                   │
│   ├─ ☐ Symptom Duration                                  │
│   ├─ ☐ Presenting Symptoms (pain, swelling, mass, etc)   │
│   ├─ ☐ Karnofsky Performance Score                       │
│   └─ ☐ Tumor Size at Presentation                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ DIAGNOSIS & CLASSIFICATION (⭐ Usually Required)       │
│   ├─ ☐ WHO Bone Tumor Classification                     │
│   ├─ ☐ WHO Soft Tissue Tumor Classification              │
│   ├─ ☐ Tumor Location (Bone/Soft Tissue)                 │
│   ├─ ☐ Laterality                                        │
│   ├─ ☐ Histopathology Grade                              │
│   └─ ☐ Pathology Details (mitosis, necrosis)             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ STAGING DATA (⭐ Usually Required)                     │
│   ├─ ☐ Enneking Staging                                  │
│   ├─ ☐ AJCC TNM Staging                                  │
│   ├─ ☐ Tumor Size (Dimensions)                           │
│   ├─ ☐ Mirrel Score                                      │
│   └─ ☐ Metastasis Status & Sites                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ DIAGNOSTIC INVESTIGATIONS                              │
│   ├─ ☐ Biopsy Type & Result                              │
│   ├─ ☐ Imaging Studies (X-ray, MRI, CT, PET)             │
│   ├─ ☐ Laboratory Results (ALP, LDH, Ca, etc)            │
│   ├─ ☐ Radiology Findings                                │
│   └─ ☐ Pathology Reports                                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ TREATMENT MANAGEMENT                                   │
│   ├─ ☐ Treatment Intent (Curative/Palliative)            │
│   ├─ ☐ Surgical Details (Limb Salvage/Amputation)        │
│   ├─ ☐ Surgical Margins                                  │
│   ├─ ☐ Reconstruction Type                               │
│   ├─ ☐ Chemotherapy Regimen & Response (HUVOS)           │
│   └─ ☐ Radiotherapy Details                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ FOLLOW-UP & OUTCOMES (⭐ Key for Outcome Studies)      │
│   ├─ ☐ Follow-up Visit Data (14-visit structure)         │
│   ├─ ☐ MSTS Functional Scores                            │
│   ├─ ☐ Recurrence (Local/Distant)                        │
│   ├─ ☐ Complications                                     │
│   └─ ☐ Survival Status & Duration                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ CLINICAL PHOTOS & IMAGING FILES ⚠️                     │
│   (requires extra approval + specific justification)     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ☐ CPC CONFERENCE RECORDS                                 │
│   ├─ ☐ CPC Date                                          │
│   └─ ☐ CPC Recommendations                               │
└──────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────

💡 QUICK PRESETS (untuk mempercepat):
  [Button: Basic Research Dataset]
    → Auto-check: Demographics (age/gender), Diagnosis, Staging, Treatment

  [Button: Outcome Study Dataset]
    → Auto-check: Diagnosis, Staging, Treatment, Follow-up, MSTS Scores

  [Button: Survival Analysis Dataset]
    → Auto-check: Demographics, Diagnosis, Staging, Treatment, Survival Data

  [Button: Custom Selection] → Manual checklist

─────────────────────────────────────────────────────────────

📝 JUSTIFIKASI (WAJIB untuk setiap category yang dicentang):

Untuk setiap category yang Anda centang, jelaskan KENAPA data ini
diperlukan untuk penelitian Anda:

[Dynamic Textareas muncul sesuai category yang dicentang]

Contoh:
• DIAGNOSIS & CLASSIFICATION:
  "Data klasifikasi WHO diperlukan untuk mengelompokkan pasien
   berdasarkan subtipe tumor tulang untuk analisis survival."

• TREATMENT MANAGEMENT:
  "Data surgical details diperlukan untuk membandingkan outcome
   antara limb salvage vs amputation pada osteosarcoma."

• FOLLOW-UP & OUTCOMES:
  "Data MSTS score diperlukan untuk mengukur functional outcome
   setelah limb salvage surgery pada berbagai subtipe tumor."


┌────────────────────────────────────────────────────────────┐
│  STEP 4: ETHICS & TIMELINE                                │
└────────────────────────────────────────────────────────────┘

IRB/Ethics Approval Status:
  ○ Sudah Disetujui
    → Upload Sertifikat: [File Upload] (Required)
    → No. Approval: [Text Input]
    → Tanggal Approval: [Date Picker]

  ○ Dalam Proses
    → Upload Proposal ke Ethics Committee: [File Upload]
    → Estimasi Tanggal Approval: [Date Picker]

  ○ Belum Ada (akan diajukan setelah request disetujui)

─────────────────────────────────────────────────────────────

Research Timeline:
  Tanggal Mulai: [Date Picker]
  Tanggal Selesai: [Date Picker]
  Durasi Akses Data yang Diminta: [Dropdown]
    • 3 bulan
    • 6 bulan (recommended for most studies)
    • 12 bulan
    • 24 bulan (requires extra justification)

─────────────────────────────────────────────────────────────

Upload Dokumen Pendukung:
  📄 Research Protocol: [File Upload] (Required, PDF/DOCX)
  📄 Research Proposal: [File Upload] (Optional, PDF/DOCX)
  📄 CV Peneliti Utama: [File Upload] (Optional, PDF)

─────────────────────────────────────────────────────────────

Data Protection & Usage Agreement:
  ☐ Saya menyatakan bahwa:
    • Data hanya akan digunakan untuk tujuan penelitian yang disebutkan
    • Data tidak akan dibagikan kepada pihak ketiga tanpa izin INAMSOS
    • Publikasi akan mencantumkan acknowledgment ke INAMSOS
    • Data akan dihapus setelah penelitian selesai
    • Saya akan mengirimkan draft publikasi sebelum submission

  Nama Peneliti: [Auto-fill]
  Tanggal: [Auto-fill]
  Tanda Tangan Digital: [Checkbox agreement]

─────────────────────────────────────────────────────────────

[Button: Save as Draft] [Button: Preview Request] [Button: Submit for Approval]
```

---

## 🔄 APPROVAL WORKFLOW INTEGRATION

### **Flow Lengkap:**

```
1. RESEARCHER: Submit Request di /research/requests/new
   ↓
2. SYSTEM: Auto-create approval entry di database
   ↓
3. /approvals PAGE: Request muncul di queue admin
   Status: PENDING_REVIEW
   ↓
4. ADMIN: Review request di /approvals
   - Lihat detail penelitian
   - Lihat data fields yang di-request
   - Download research protocol
   - Check IRB status
   - Review justification untuk setiap data category
   ↓
5. ADMIN ACTION:
   ┌─────────────────────────────────────────┐
   │ ○ APPROVE                               │
   │   → Grant access for specified duration │
   │   → Generate data export                │
   │   → Send notification to researcher     │
   │                                         │
   │ ○ APPROVE WITH CONDITIONS               │
   │   → Specify conditions                  │
   │   → Reduced data fields                 │
   │   → Shorter duration                    │
   │                                         │
   │ ○ REJECT                                │
   │   → Specify reason                      │
   │   → Send notification to researcher     │
   │                                         │
   │ ○ REQUEST MORE INFO                     │
   │   → Ask for clarification               │
   │   → Status: NEED_MORE_INFO              │
   │   → Researcher revise & resubmit        │
   └─────────────────────────────────────────┘
   ↓
6. IF APPROVED:
   - Status: APPROVED
   - Generate CSV/Excel export sesuai data fields yang di-request
   - Create download link dengan expiration
   - Send email notification
   - Set auto-revoke date
   ↓
7. RESEARCHER: Download data dari /research/requests
   - See download link
   - Access until expiration date
   - Can request extension before expiration
   ↓
8. AUTO-EXPIRATION:
   - System auto-revoke access setelah duration habis
   - Status: COMPLETED
   - Researcher diminta upload publication draft (optional)
```

### **Status Progression:**

```
DRAFT → (researcher sedang isi form)

SUBMITTED → (researcher submit, masuk approval queue)

PENDING_REVIEW → (admin belum mulai review)

UNDER_REVIEW → (admin sedang review)

NEED_MORE_INFO → (admin minta info tambahan, kembali ke researcher)

APPROVED → (admin approve, data preparation)

APPROVED_WITH_CONDITIONS → (approve dengan syarat tertentu)

REJECTED → (admin reject dengan reason)

DATA_READY → (export file siap download)

ACTIVE → (researcher sedang akses data, belum expired)

COMPLETED → (research selesai/access expired)

WITHDRAWN → (researcher batalkan request)
```

---

## 🗄️ DATABASE ENHANCEMENTS

### **Modifikasi ResearchRequest Model:**

```prisma
model ResearchRequest {
  // ... existing fields ...

  // NEW: Data fields yang di-request (JSON)
  requestedDataFields Json? // {demographics: {selected: true, justification: "..."}, ...}

  // NEW: Data filters
  dataFilters Json? // {tumorTypes: [...], ennekingStages: [...], ageRange: {min: 0, max: 100}, ...}

  // NEW: Estimated patient count
  estimatedPatientCount Int?

  // NEW: Auto-approval eligibility
  isAutoApprovalEligible Boolean @default(false) // Based on sensitivity assessment

  // NEW: Data sensitivity score (0-100)
  dataSensitivityScore Int? // Auto-calculated based on fields requested

  // ENHANCED: More detailed status tracking
  needsEthicsReview Boolean @default(true)
  needsDataProtectionReview Boolean @default(false)

  // NEW: Data access tracking
  dataExportGeneratedAt DateTime?
  dataExportUrl String?
  dataExportFileSize Int? // in bytes
  dataDownloadedAt DateTime?
  dataDownloadCount Int @default(0)

  // ... existing relations ...
}
```

### **NEW: ResearchRequestActivity Model (Audit Trail):**

```prisma
model ResearchRequestActivity {
  id                String   @id @default(cuid())
  researchRequestId String
  actorId           String
  action            String   // SUBMITTED, REVIEWED, APPROVED, REJECTED, DOWNLOADED, etc
  statusFrom        String?
  statusTo          String?
  notes             String?
  metadata          Json?    // Additional context
  createdAt         DateTime @default(now())

  researchRequest   ResearchRequest @relation(fields: [researchRequestId], references: [id])
  actor             User            @relation(fields: [actorId], references: [id])

  @@map("research_request_activities")
  @@schema("medical")
}
```

---

## 🎨 UI COMPONENTS

### **1. /research/requests (Dashboard untuk Researcher)**

```
┌──────────────────────────────────────────────────────────┐
│  📑 My Research Data Requests                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [+ New Data Request]                      [Filters ▼]  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ RR-2025-003 │ 🟡 PENDING REVIEW                    │ │
│  │ Survival Analysis in Osteosarcoma Patients         │ │
│  │                                                    │ │
│  │ Submitted: Dec 14, 2025                           │ │
│  │ Estimated: 45 patients                            │ │
│  │ Fields: Demographics, Diagnosis, Staging,         │ │
│  │         Treatment, Follow-up                      │ │
│  │                                                    │ │
│  │ [View Details] [Edit] [Withdraw]                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ RR-2025-001 │ ✅ APPROVED                          │ │
│  │ Limb Salvage Outcomes in Chondrosarcoma           │ │
│  │                                                    │ │
│  │ Approved: Dec 10, 2025                            │ │
│  │ Access until: Jun 10, 2026 (178 days left)       │ │
│  │ Dataset: 32 patients, 15 fields                  │ │
│  │                                                    │ │
│  │ [📥 Download Data (CSV)] [View Details]           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ RR-2024-087 │ ⚠️ NEED MORE INFO                    │ │
│  │ Functional Outcomes After Tumor Resection         │ │
│  │                                                    │ │
│  │ Admin feedback: "Perlu klarifikasi IRB approval   │ │
│  │ untuk akses data clinical photos"                 │ │
│  │                                                    │ │
│  │ [Update Request] [View Feedback]                  │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### **2. /approvals (Enhanced untuk Handle Research Requests)**

```
┌──────────────────────────────────────────────────────────┐
│  ⚖️ Approval Queue                                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Tab: All] [Tab: Research Data Requests] [Tab: Other]  │
│                                                          │
│  Filters: Status [All ▼] Priority [All ▼] Type [All ▼]  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🔴 HIGH PRIORITY                                   │ │
│  │ RR-2025-005 │ Dr. Ahmad Rifai                      │ │
│  │ Universitas Indonesia                             │ │
│  │                                                    │ │
│  │ Clinical Trial: Limb Salvage vs Amputation        │ │
│  │ Outcome Comparison                                │ │
│  │                                                    │ │
│  │ Data Requested: 78 patients (2020-2024)           │ │
│  │ Fields: ⚠️ Demographics (with NIK), Diagnosis,     │ │
│  │         Treatment, Follow-up, MSTS Scores         │ │
│  │ IRB: ✅ Approved (UI-2024-12-001, Dec 1 2024)     │ │
│  │ Duration: 12 months                               │ │
│  │ Sensitivity Score: 75/100 (HIGH)                  │ │
│  │                                                    │ │
│  │ Submitted: 2 days ago                             │ │
│  │                                                    │ │
│  │ [Review Request] [Approve] [Reject]               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🟡 MEDIUM PRIORITY                                 │ │
│  │ RR-2025-003 │ Dr. Siti Aminah                      │ │
│  │ RSUP Hasan Sadikin                                │ │
│  │                                                    │ │
│  │ Academic Research (Disertasi):                    │ │
│  │ Survival Analysis Osteosarcoma                    │ │
│  │                                                    │ │
│  │ Data Requested: 45 patients (2018-2023)           │ │
│  │ Fields: Demographics (NO NIK), Diagnosis,         │ │
│  │         Staging, Treatment, Survival              │ │
│  │ IRB: ⏳ In Progress (Est. Dec 20)                 │ │
│  │ Duration: 6 months                                │ │
│  │ Sensitivity Score: 35/100 (MEDIUM)                │ │
│  │                                                    │ │
│  │ Submitted: 1 week ago                             │ │
│  │                                                    │ │
│  │ [Review Request] [Request More Info]              │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### **3. Review Modal (Admin Review Interface)**

```
┌──────────────────────────────────────────────────────────┐
│  📋 Review Research Data Request: RR-2025-003            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Tab: Overview] [Tab: Data Fields] [Tab: Documents]    │
│  [Tab: Timeline] [Tab: Ethics]                          │
│                                                          │
│  ═══════════════════════════════════════════════════    │
│  OVERVIEW                                                │
│  ═══════════════════════════════════════════════════    │
│                                                          │
│  Peneliti: Dr. Siti Aminah                              │
│  Institusi: RSUP Hasan Sadikin, Bandung                 │
│  Email: siti.aminah@unpad.ac.id                         │
│  Phone: +62 812-3456-7890                               │
│                                                          │
│  Judul: Survival Analysis in Osteosarcoma Patients      │
│  Tipe: Academic Research (Disertasi)                    │
│                                                          │
│  Abstrak:                                                │
│  "Penelitian ini bertujuan untuk menganalisis faktor-   │
│   faktor yang mempengaruhi survival rate pada pasien    │
│   osteosarcoma yang menjalani limb salvage surgery..."  │
│                                                          │
│  ═══════════════════════════════════════════════════    │
│  DATA REQUEST SUMMARY                                    │
│  ═══════════════════════════════════════════════════    │
│                                                          │
│  Periode Data: Jan 1, 2018 - Dec 31, 2023              │
│  Estimated Patients: 45 patients                        │
│                                                          │
│  Filter Kriteria:                                        │
│  • Tumor Type: Bone Tumor (Osteosarcoma only)           │
│  • Enneking Stage: IIA, IIB, III                        │
│  • Treatment: Include Limb Salvage cases                │
│  • Age: 10-40 years                                     │
│                                                          │
│  Data Fields Requested (7 categories):                  │
│  ✓ Demographics (age/gender/region only - NO NIK)       │
│    Justification: "Untuk analisis distribusi demografi  │
│    pasien osteosarcoma..."                              │
│                                                          │
│  ✓ Diagnosis & Classification                           │
│    Justification: "Klasifikasi WHO diperlukan untuk     │
│    subgroup analysis berdasarkan subtipe histologi..."  │
│                                                          │
│  ✓ Staging Data (Enneking, AJCC, Tumor Size)           │
│    Justification: "Staging adalah predictor utama       │
│    survival..."                                         │
│                                                          │
│  ✓ Treatment Management                                 │
│    Justification: "Data surgical details dan chemo      │
│    regimen diperlukan untuk analisis treatment          │
│    response..."                                         │
│                                                          │
│  ✓ Follow-up & Outcomes                                 │
│    Justification: "Data survival duration dan status    │
│    adalah outcome utama penelitian..."                  │
│                                                          │
│  ✓ MSTS Functional Scores                               │
│    Justification: "Untuk assess functional outcome      │
│    setelah limb salvage..."                             │
│                                                          │
│  ✗ Clinical Photos (NOT requested)                      │
│  ✗ NIK/Full Address (NOT requested)                     │
│                                                          │
│  Sensitivity Score: 35/100 (MEDIUM) ✅                  │
│  Auto-approval Eligible: NO (requires manual review)    │
│                                                          │
│  ═══════════════════════════════════════════════════    │
│  ETHICS & COMPLIANCE                                     │
│  ═══════════════════════════════════════════════════    │
│                                                          │
│  IRB Status: ⏳ In Progress                             │
│  Estimated IRB Approval: Dec 20, 2025                   │
│  Proposal Uploaded: ✅ unpad-osteosarcoma-proposal.pdf  │
│                                                          │
│  Research Protocol: ✅ research-protocol-v1.pdf          │
│  Researcher CV: ✅ cv-dr-siti-aminah.pdf                │
│                                                          │
│  Timeline:                                               │
│  Start: Jan 1, 2026                                     │
│  End: Jun 30, 2026                                      │
│  Access Duration: 6 months                              │
│                                                          │
│  Data Protection Agreement: ✅ Signed                    │
│                                                          │
│  ═══════════════════════════════════════════════════    │
│  ADMIN DECISION                                          │
│  ═══════════════════════════════════════════════════    │
│                                                          │
│  Decision: [Radio buttons]                              │
│    ○ APPROVE (grant full access as requested)           │
│    ○ APPROVE WITH CONDITIONS                            │
│    ○ REQUEST MORE INFO                                  │
│    ○ REJECT                                             │
│                                                          │
│  [If APPROVE WITH CONDITIONS:]                          │
│  Conditions/Modifications:                              │
│  ☐ Reduce access duration to: [3 months ▼]             │
│  ☐ Exclude specific data fields:                        │
│    [Multi-select dari fields yang di-request]           │
│  ☐ Require IRB approval before data release             │
│  ☐ Other conditions: [Textarea]                         │
│                                                          │
│  [If REQUEST MORE INFO:]                                │
│  Questions/Clarifications needed:                       │
│  [Textarea]                                             │
│                                                          │
│  [If REJECT:]                                           │
│  Rejection Reason: [Textarea, Required]                 │
│                                                          │
│  Admin Notes (Internal): [Textarea]                     │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  [Cancel] [Save Draft] [Submit Decision]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **SPRINT 1: Database & Backend API (2-3 days)**

**Backend Tasks:**
```
✓ Enhance ResearchRequest model in schema.prisma
  - Add requestedDataFields (Json)
  - Add dataFilters (Json)
  - Add estimatedPatientCount
  - Add dataSensitivityScore
  - Add data export fields

✓ Create ResearchRequestActivity model (audit trail)

✓ Run migration

✓ Create ResearchRequestsModule:
  - research-requests.controller.ts
  - research-requests.service.ts
  - research-requests-approval.service.ts
  - research-requests-export.service.ts

✓ API Endpoints (7 endpoints):
  POST   /api/v1/research-requests (create/update draft)
  GET    /api/v1/research-requests (list my requests)
  GET    /api/v1/research-requests/:id (detail)
  POST   /api/v1/research-requests/:id/submit (submit for approval)
  DELETE /api/v1/research-requests/:id (delete draft)
  GET    /api/v1/research-requests/:id/export (download data)
  GET    /api/v1/research-requests/estimate (estimate patient count)

✓ Admin approval endpoints:
  GET    /api/v1/research-requests/pending (for admin)
  POST   /api/v1/research-requests/:id/approve
  POST   /api/v1/research-requests/:id/reject
  POST   /api/v1/research-requests/:id/request-more-info

✓ Auto-calculate data sensitivity score logic
✓ Auto-estimate patient count based on filters
✓ Email notification service
```

**Files to Create:**
```
backend/src/modules/research-requests/
  ├── research-requests.module.ts
  ├── research-requests.controller.ts (400 lines)
  ├── research-requests.service.ts (600 lines)
  ├── research-requests-approval.service.ts (300 lines)
  ├── research-requests-export.service.ts (400 lines)
  ├── dto/
  │   ├── create-research-request.dto.ts (150 lines)
  │   ├── update-research-request.dto.ts
  │   ├── approve-research-request.dto.ts
  │   └── data-fields-selection.dto.ts (200 lines)
  └── helpers/
      ├── sensitivity-scorer.ts (150 lines)
      └── patient-estimator.ts (200 lines)
```

---

### **SPRINT 2: Frontend - Request Form (3-4 days)**

**Frontend Tasks:**
```
✓ Create /research/requests/new page (4-step wizard)

✓ Step 1: Research Info Component
  - Auto-fill researcher data from auth context
  - Research title, type, abstract, objectives

✓ Step 2: Data Criteria Component
  - Date range picker
  - Tumor type multi-select with WHO classification filter
  - Filter options (staging, age, gender, center, treatment)
  - Real-time patient count estimator (API call)

✓ Step 3: Data Fields Checklist Component ⭐ CORE
  - 9 category checkboxes with expandable sub-fields
  - Quick preset buttons (Basic/Outcome/Survival/Custom)
  - Dynamic justification textareas
  - Sensitivity warning for high-sensitive fields

✓ Step 4: Ethics & Timeline Component
  - IRB status selector
  - File upload (protocol, proposal, CV)
  - Timeline & duration selector
  - Data protection agreement checkbox

✓ Progress indicator & navigation
✓ Auto-save every 2 minutes
✓ Form validation per step
✓ Preview modal before submit
```

**Files to Create:**
```
frontend/src/app/research/requests/new/page.tsx (300 lines)
frontend/src/components/research/
  ├── ResearchRequestWizard.tsx (500 lines)
  ├── steps/
  │   ├── Step1ResearchInfo.tsx (250 lines)
  │   ├── Step2DataCriteria.tsx (400 lines)
  │   ├── Step3DataFieldsChecklist.tsx (600 lines) ⭐ KEY
  │   └── Step4EthicsTimeline.tsx (300 lines)
  ├── DataFieldCategory.tsx (200 lines)
  ├── QuickPresetButtons.tsx (150 lines)
  ├── SensitivityWarning.tsx (100 lines)
  └── PatientCountEstimator.tsx (150 lines)

frontend/src/services/research-requests.service.ts (250 lines)
```

---

### **SPRINT 3: Frontend - Dashboard & Approval Integration (2-3 days)**

**Frontend Tasks:**
```
✓ Enhance /research/requests (dashboard)
  - List all researcher's requests
  - Status badges (color-coded)
  - Download button for approved requests
  - Action buttons (view/edit/withdraw)

✓ Enhance /approvals (admin)
  - Add "Research Data Requests" tab
  - Request cards with summary info
  - Sensitivity score display
  - Priority sorting

✓ Create ResearchRequestReviewModal
  - 5 tabs (Overview, Data Fields, Documents, Timeline, Ethics)
  - Admin decision form (approve/reject/request-more-info)
  - Conditions specification for conditional approval

✓ Status tracking & notifications
✓ Download data export functionality
```

**Files to Create/Modify:**
```
frontend/src/app/research/requests/page.tsx (400 lines - replace existing)
frontend/src/app/approvals/page.tsx (enhance existing, +200 lines)
frontend/src/components/research/
  ├── MyRequestsDashboard.tsx (350 lines)
  ├── RequestCard.tsx (200 lines)
  ├── StatusBadge.tsx (100 lines)
  └── DownloadDataButton.tsx (150 lines)

frontend/src/components/approvals/
  ├── ResearchRequestReviewModal.tsx (600 lines) ⭐ KEY
  ├── DataFieldsSummary.tsx (250 lines)
  ├── AdminDecisionForm.tsx (300 lines)
  └── SensitivityScoreIndicator.tsx (100 lines)
```

---

### **SPRINT 4: Data Export & Auto-Expiration (1-2 days)**

**Backend Tasks:**
```
✓ Implement data export service:
  - Query patients based on filters
  - Select only requested data fields
  - De-identify data (exclude NIK if not requested)
  - Generate CSV/Excel file
  - Store in MinIO with signed URL

✓ Implement auto-expiration cron job:
  - Run daily at midnight
  - Check for expired research requests
  - Revoke data access
  - Delete export files from MinIO
  - Send expiration notification email

✓ Implement access extension workflow:
  - Researcher can request extension
  - Admin approve extension
  - Update expiration date
```

**Files to Create:**
```
backend/src/modules/research-requests/
  ├── data-export/
  │   ├── data-export.service.ts (500 lines)
  │   ├── data-anonymizer.ts (200 lines)
  │   └── export-generator.ts (300 lines)
  └── cron/
      └── auto-expiration.cron.ts (150 lines)
```

---

## ⏱️ TOTAL TIMELINE ESTIMATE

| Sprint | Tasks | Duration |
|--------|-------|----------|
| **Sprint 1** | Database & Backend API | **2-3 days** |
| **Sprint 2** | Frontend - Request Form (4-step wizard) | **3-4 days** |
| **Sprint 3** | Frontend - Dashboard & Approval | **2-3 days** |
| **Sprint 4** | Data Export & Auto-Expiration | **1-2 days** |
| **TOTAL** | **Full Implementation** | **8-12 days** |

---

## ✅ SUCCESS CRITERIA

### **Functional Requirements:**

1. ✅ Researcher dapat submit research data request via 4-step wizard
2. ✅ Researcher dapat **CENTANG data fields spesifik** yang mereka butuhkan (bukan isi form panjang)
3. ✅ System auto-estimate jumlah pasien berdasarkan filter
4. ✅ System auto-calculate sensitivity score
5. ✅ Request **MASUK ke /approvals** untuk admin review
6. ✅ Admin dapat review request dengan detail lengkap
7. ✅ Admin dapat approve/reject/request-more-info
8. ✅ Approved request → auto-generate data export (CSV/Excel)
9. ✅ Researcher dapat download data dari dashboard
10. ✅ System auto-revoke access setelah duration habis
11. ✅ Complete audit trail untuk semua actions

### **User Experience:**

1. ✅ **SEDERHANA**: 4 steps (bukan 9 sections)
2. ✅ **EFEKTIF**: Cukup informasi untuk admin decision
3. ✅ **CEPAT**: Researcher bisa submit dalam **< 15 menit**
4. ✅ **JELAS**: Justification wajib untuk setiap data category
5. ✅ **TRANSPARAN**: Real-time status tracking
6. ✅ **SECURE**: Data sensitivity warning untuk high-risk fields

### **Data Protection:**

1. ✅ Justification WAJIB untuk setiap data category
2. ✅ Extra approval untuk high-sensitive data (NIK, clinical photos)
3. ✅ IRB requirement enforcement
4. ✅ Time-limited access dengan auto-revocation
5. ✅ Data anonymization untuk non-identifiable data
6. ✅ Audit trail lengkap

---

## 🎯 KEY DIFFERENTIATORS (Kenapa Ini SEDERHANA tapi EFEKTIF)

### **1. Checklist-Based (bukan Form Panjang)**
```
❌ SEBELUM: Researcher harus isi form panjang untuk setiap field
✅ SEKARANG: Researcher tinggal CENTANG category yang dibutuhkan
```

### **2. Smart Presets**
```
❌ SEBELUM: Manual select semua fields satu per satu
✅ SEKARANG: Klik "Outcome Study Dataset" → auto-check relevant fields
```

### **3. Auto-Calculation**
```
❌ SEBELUM: Admin harus manual count berapa pasien yang match
✅ SEKARANG: System auto-estimate: "~45 pasien sesuai kriteria"
```

### **4. Sensitivity Scoring**
```
❌ SEBELUM: Admin harus manual assess risk level
✅ SEKARANG: System auto-calculate: "Sensitivity Score: 35/100 (MEDIUM)"
```

### **5. Justification-Driven**
```
❌ SEBELUM: Request tanpa alasan jelas
✅ SEKARANG: Justification WAJIB untuk SETIAP data category
```

### **6. Seamless Approval Integration**
```
❌ SEBELUM: Request tidak masuk approval system
✅ SEKARANG: Auto-create approval entry, muncul di /approvals queue
```

---

## 📝 FINAL NOTES

### **Kenapa ini LEBIH BAIK dari rencana sebelumnya?**

| Aspek | Rencana Sebelumnya (9 sections) | **Rencana Ini (4 steps)** |
|-------|-------------------------------|--------------------------|
| **Complexity** | HIGH (mirip patient form) | **LOW (checklist-based)** |
| **Time to Complete** | 30+ minutes | **< 15 minutes** |
| **User Friction** | Banyak form fields | **Minimal (mostly checkboxes)** |
| **Flexibility** | Rigid structure | **Flexible (pilih fields sesuai kebutuhan)** |
| **Data Mapping** | Manual | **Auto-mapped dari patient schema** |
| **Admin Review** | Complex 9-section review | **Clear category-based summary** |
| **Implementation** | 7-10 days | **8-12 days (tapi lebih sustainable)** |

### **Kenapa tetap EFEKTIF?**

1. ✅ **Complete Data Coverage**: Semua 9 sections patient form ter-cover dalam 9 data categories
2. ✅ **Granular Control**: Researcher bisa pilih spesifik fields yang dibutuhkan
3. ✅ **Justification Required**: Setiap category harus ada justification
4. ✅ **Risk Assessment**: Auto-calculate sensitivity score
5. ✅ **Admin Transparency**: Admin bisa lihat PERSIS data apa yang di-request + justificationnya
6. ✅ **Compliance**: IRB requirement, data protection agreement, time-limited access

### **Trade-offs yang ACCEPTABLE:**

- ❌ Tidak ada collaboration tracking (bisa tambah nanti if needed)
- ❌ Tidak ada publication auto-tracking (bisa manual via email)
- ✅ Tapi CORE functionality semua ada dan JAUH lebih user-friendly

---

**Prepared by:** Claude (AI Assistant)
**Date:** 2025-12-14
**Status:** READY FOR REVIEW & IMPLEMENTATION
**Approach:** CHECKLIST-BASED, SIMPLE, EFFECTIVE, APPROVAL-INTEGRATED
