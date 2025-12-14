# Research Request Flow - Rencana Perbaikan

**Tanggal:** 2025-12-14
**Priority:** HIGH - Flow saat ini SALAH dan tidak sesuai Epic 4

---

## 🔴 MASALAH YANG DITEMUKAN

### 1. **Flow Saat Ini (SALAH)**
```
/research/requests
└── Hanya menampilkan list permintaan
└── Tidak ada form wizard yang proper
└── Langsung submit (tidak masuk approval workflow)
└── TIDAK ADA integrasi dengan /approvals
```

**MASALAH UTAMA:**
- ❌ Permintaan data penelitian adalah **data krusial** yang perlu approval ketat
- ❌ Tidak ada form wizard seperti patient entry
- ❌ Tidak masuk ke antrian approval di /approvals
- ❌ Tidak ada tracking status yang transparan
- ❌ TIDAK mengikuti Epic 4 requirements sama sekali

### 2. **Bukti dari UI:**
- ✅ `/approvals` - Sudah ada workflow proper: Menunggu → Review → Disetujui/Ditolak
- ✅ `/patients/new` - Sudah ada wizard 9-section yang sangat terstruktur
- ❌ `/research/requests` - Hanya list kosong, tidak ada wizard form

---

## ✅ FLOW YANG BENAR (Epic 4)

### **Berdasarkan Epic 4: Research Request Management**

**Story 4.1: Structured Musculoskeletal Data Request**
```
Researcher harus mengisi form wizard dengan:
1. Research protocol upload
2. Dataset selection (WHO classification, staging, treatment filters)
3. Justification untuk setiap data element
4. Timeline specification (berapa lama butuh akses)
5. Ethics approval documentation (IRB)
6. Collaboration partners
```

**Story 4.3: Multi-Level Approval Workflow**
```
Request masuk ke antrian approval dengan:
- Priority sorting
- Review dashboard
- Conditional approval capabilities
- Delegation ke orthopedic oncology specialists
- Approval audit trail
```

**Story 4.4: Transparent Status Tracking**
```
Status progression:
Submitted → Under Review → Ethics Review → Approved/Rejected →
Data Preparation → Access Granted
```

---

## 📋 RENCANA IMPLEMENTASI

### **FASE 1: Research Request Wizard Form** (Priority: P0)

#### **Struktur Form (Multi-Step Wizard - seperti Patient Entry)**

```
/research/requests/new - NEW PAGE

SECTION 1: Informasi Peneliti & Institusi
- Nama lengkap peneliti
- Institusi/Universitas
- Email & Phone
- ORCID ID (optional)
- Peran dalam penelitian (Principal Investigator, Co-Investigator, etc)

SECTION 2: Detail Penelitian
- Judul penelitian (Indonesia & English)
- Tipe penelitian (Academic, Clinical Trial, Thesis, Dissertation, etc)
- Deskripsi singkat (abstract)
- Tujuan penelitian
- Metodologi penelitian
- Expected outcomes

SECTION 3: Data yang Diminta
- Periode data (dari tanggal - sampai tanggal)
- Jenis tumor yang diminta:
  ✓ Bone Tumor (pilih WHO classifications)
  ✓ Soft Tissue Tumor (pilih WHO classifications)
  ✓ Metastatic Bone Disease
- Filter staging (Enneking, AJCC)
- Filter treatment modality
- Filter age range, gender, center

SECTION 4: Data Fields yang Diperlukan
Checklist dengan justifikasi untuk setiap field:
✓ Demographics (NIK, DOB, Gender) → Justification required
✓ Clinical presentation (symptoms, Karnofsky)
✓ Diagnostic data (biopsy, imaging)
✓ WHO Classification
✓ Staging (Enneking, AJCC)
✓ Treatment data (surgery, chemo, radio)
✓ Surgical details (limb salvage, margins)
✓ Follow-up data (14 visits, MSTS scores)
✓ Outcome data (recurrence, survival)
✓ Clinical photos/imaging
✓ Pathology reports

→ Setiap field yang dicentang WAJIB ada justification text

SECTION 5: Timeline & Akses
- Tanggal mulai penelitian
- Tanggal selesai penelitian
- Durasi akses data yang diminta (3 months, 6 months, 1 year, 2 years)
- Rencana publikasi (journal target, estimated submission date)

SECTION 6: Ethics & Compliance
- IRB/Ethics Committee approval status
  ○ Already Approved → Upload sertifikat
  ○ In Progress → Upload proposal + estimated approval date
  ○ Will Submit After Data Request Approval
- Patient consent consideration
- Data privacy plan
- Data security measures

SECTION 7: Collaboration & Funding
- Collaboration partners (nama, institusi, role)
- Funding source (if any)
- Budget allocated for data usage
- Conflict of interest declaration

SECTION 8: Document Upload
- Research protocol (PDF)
- IRB approval letter (PDF)
- Proposal lengkap (PDF)
- CV peneliti (PDF)
- Supporting documents (optional)

SECTION 9: Review & Submit
- Preview semua informasi
- Declaration & Agreement:
  ✓ Data will be used only for stated research purpose
  ✓ Will not share data with third parties without permission
  ✓ Will acknowledge INAMSOS in publications
  ✓ Will submit publication draft before submission
  ✓ Will delete data after research completion
- Submit button
```

#### **UI/UX Features (sama seperti Patient Entry)**
- Progress indicator (1 of 9, 2 of 9, etc)
- Auto-save setiap 2 menit
- Validation per section
- Previous/Next navigation
- Save as Draft
- Section completion indicators

---

### **FASE 2: Approval Integration** (Priority: P0)

#### **Flow Integration dengan /approvals**

```
1. Researcher submit request di /research/requests/new
   ↓
2. Request masuk ke queue di /approvals (auto-assign ke CENTER_ADMIN)
   ↓
3. CENTER_ADMIN review di /approvals
   - Lihat detail lengkap request
   - Download research protocol & IRB documents
   - Check data sensitivity
   - Opsi:
     ✓ APPROVE (langsung atau dengan kondisi)
     ✓ REJECT (dengan alasan)
     ✓ REQUEST MORE INFO (kirim kembali ke researcher)
     ✓ DELEGATE (assign ke orthopedic specialist untuk technical review)
   ↓
4. Status update otomatis ke researcher
   ↓
5. Jika APPROVED:
   - Data preparation (export sesuai request)
   - Generate time-limited access token
   - Send notification dengan download link
   - Set expiration date (auto-revoke setelah timeline habis)
```

#### **Status Workflow:**
```
DRAFT → (researcher belum submit)
SUBMITTED → (baru masuk, belum di-review)
UNDER_REVIEW → (admin sedang review)
NEED_MORE_INFO → (admin minta informasi tambahan, kembali ke researcher)
ETHICS_REVIEW → (menunggu IRB approval jika belum ada)
APPROVED → (admin setujui, mulai data preparation)
REJECTED → (admin tolak dengan alasan)
DATA_PREPARATION → (system export data sesuai request)
ACCESS_GRANTED → (researcher dapat akses data)
COMPLETED → (research selesai, data access expired)
```

---

### **FASE 3: Status Tracking Dashboard** (Priority: P1)

#### **/research/requests - Dashboard untuk Researcher**

```
Tab 1: My Requests
- List semua request researcher
- Status badge (color-coded)
- Progress indicator
- Actions:
  - View Details
  - Edit (jika masih DRAFT atau NEED_MORE_INFO)
  - Withdraw Request
  - Upload Additional Documents
  - View Approval History

Tab 2: Active Access
- List approved requests dengan status ACCESS_GRANTED
- Download data button
- Expiration date countdown
- Request extension button
- Upload publication draft

Tab 3: Completed Research
- Archive completed research
- Publication tracking
- Citation data
```

#### **/approvals - Dashboard untuk Admin (sudah ada, perlu enhance)**

```
Enhancement yang diperlukan:
1. Filter by request type:
   - Research Data Request
   - Patient Data Access Request
   - Center Collaboration Request

2. Priority sorting:
   - High priority: Clinical trials, IRB approved
   - Medium: Academic research with funding
   - Low: Thesis/dissertation

3. Batch actions:
   - Bulk approve for similar standardized requests
   - Bulk reject with same reason

4. Delegation:
   - Assign to orthopedic oncology specialist for technical review
   - Assign to ethics committee member
```

---

## 🗂️ DATABASE SCHEMA

### **research_requests table**
```sql
CREATE TABLE research.research_requests (
  id UUID PRIMARY KEY,
  request_number VARCHAR(20) UNIQUE, -- RR-2025-001

  -- Researcher Info
  researcher_id UUID REFERENCES system.users(id),
  researcher_name VARCHAR(255),
  institution VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  orcid_id VARCHAR(100),
  role_in_research VARCHAR(100), -- PI, Co-Investigator, etc

  -- Research Details
  title_id TEXT,
  title_en TEXT,
  research_type VARCHAR(100), -- Academic, Clinical Trial, Thesis, etc
  abstract TEXT,
  objectives TEXT,
  methodology TEXT,
  expected_outcomes TEXT,

  -- Data Request
  data_period_start DATE,
  data_period_end DATE,
  tumor_types JSONB, -- {bone: [WHO codes], soft_tissue: [WHO codes]}
  staging_filters JSONB, -- {enneking: [...], ajcc: [...]}
  treatment_filters JSONB,
  age_range JSONB,
  gender_filter VARCHAR(20),
  center_filter JSONB,

  -- Data Fields (dengan justification)
  requested_fields JSONB, -- {demographics: {checked: true, justification: "..."}, ...}

  -- Timeline
  research_start_date DATE,
  research_end_date DATE,
  access_duration_months INTEGER,
  publication_plan TEXT,
  target_journal VARCHAR(255),

  -- Ethics & Compliance
  irb_status VARCHAR(50), -- APPROVED, IN_PROGRESS, PENDING
  irb_approval_date DATE,
  irb_certificate_url TEXT,
  patient_consent_plan TEXT,
  data_privacy_plan TEXT,
  data_security_measures TEXT,

  -- Collaboration
  collaborators JSONB, -- [{name, institution, role}, ...]
  funding_source VARCHAR(255),
  budget DECIMAL,
  conflict_of_interest TEXT,

  -- Documents
  protocol_url TEXT,
  irb_letter_url TEXT,
  proposal_url TEXT,
  cv_url TEXT,
  supporting_docs JSONB,

  -- Agreement
  agreement_signed BOOLEAN,
  agreement_date TIMESTAMP,

  -- Status & Workflow
  status VARCHAR(50), -- DRAFT, SUBMITTED, UNDER_REVIEW, etc
  priority VARCHAR(20), -- HIGH, MEDIUM, LOW
  assigned_to UUID REFERENCES system.users(id),

  -- Approval
  reviewed_by UUID REFERENCES system.users(id),
  reviewed_at TIMESTAMP,
  approval_decision VARCHAR(50), -- APPROVED, REJECTED, NEED_MORE_INFO
  approval_conditions TEXT,
  rejection_reason TEXT,

  -- Data Access
  data_export_url TEXT,
  access_token VARCHAR(255),
  access_granted_at TIMESTAMP,
  access_expires_at TIMESTAMP,

  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

### **research_request_history table**
```sql
CREATE TABLE research.research_request_history (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES research.research_requests(id),
  status_from VARCHAR(50),
  status_to VARCHAR(50),
  action VARCHAR(100), -- SUBMITTED, REVIEWED, APPROVED, etc
  actor_id UUID REFERENCES system.users(id),
  actor_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **research_publications table**
```sql
CREATE TABLE research.research_publications (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES research.research_requests(id),
  title TEXT,
  authors TEXT[],
  journal VARCHAR(255),
  publication_date DATE,
  doi VARCHAR(255),
  citation_count INTEGER,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 IMPLEMENTATION PLAN

### **Sprint 1: Research Request Wizard Form** (3-4 days)
**Files to Create:**
```
frontend/src/app/research/requests/new/page.tsx (500 lines)
frontend/src/components/research/ResearchRequestWizard.tsx (800 lines)
frontend/src/components/research/sections/Section1ResearcherInfo.tsx (150 lines)
frontend/src/components/research/sections/Section2ResearchDetails.tsx (200 lines)
frontend/src/components/research/sections/Section3DataRequest.tsx (300 lines)
frontend/src/components/research/sections/Section4DataFields.tsx (400 lines)
frontend/src/components/research/sections/Section5Timeline.tsx (150 lines)
frontend/src/components/research/sections/Section6Ethics.tsx (250 lines)
frontend/src/components/research/sections/Section7Collaboration.tsx (200 lines)
frontend/src/components/research/sections/Section8Documents.tsx (200 lines)
frontend/src/components/research/sections/Section9ReviewSubmit.tsx (300 lines)
frontend/src/services/research-requests.service.ts (200 lines)
```

**Backend API:**
```
backend/src/modules/research-requests/research-requests.module.ts
backend/src/modules/research-requests/research-requests.controller.ts (300 lines)
backend/src/modules/research-requests/research-requests.service.ts (500 lines)
backend/src/modules/research-requests/dto/create-research-request.dto.ts (200 lines)
```

**Database:**
```
backend/prisma/schema.prisma (add research schema)
backend/prisma/migrations/xxx_create_research_requests.sql
```

### **Sprint 2: Approval Integration** (2-3 days)
**Files to Modify:**
```
frontend/src/app/approvals/page.tsx (enhance untuk handle research requests)
backend/src/modules/approvals/approvals.service.ts (add research request handling)
```

**Files to Create:**
```
frontend/src/components/approvals/ResearchRequestReviewModal.tsx (400 lines)
backend/src/modules/research-requests/research-requests-approval.service.ts (300 lines)
```

### **Sprint 3: Status Tracking & Data Export** (2-3 days)
**Files to Modify:**
```
frontend/src/app/research/requests/page.tsx (replace dengan proper dashboard)
```

**Files to Create:**
```
frontend/src/components/research/MyRequestsTab.tsx (300 lines)
frontend/src/components/research/ActiveAccessTab.tsx (250 lines)
frontend/src/components/research/CompletedResearchTab.tsx (200 lines)
backend/src/modules/research-requests/data-export.service.ts (400 lines)
```

---

## 📊 COMPARISON: Before vs After

### **BEFORE (SALAH):**
```
/research/requests
  └── Simple list page
  └── "+ Permintaan Baru" button → Langsung form biasa (no wizard)
  └── Submit → Langsung tersimpan (NO APPROVAL)
  └── Tidak ada tracking
  └── Tidak integrasi dengan /approvals
```

### **AFTER (BENAR):**
```
/research/requests
  └── Dashboard dengan 3 tabs:
      1. My Requests (list + status tracking)
      2. Active Access (approved requests)
      3. Completed Research (archive)
  └── "+ Permintaan Baru" button → Multi-step wizard (9 sections)

/research/requests/new
  └── 9-Section Wizard (seperti patient entry)
  └── Auto-save every 2 minutes
  └── Validation per section
  └── Submit → Masuk ke /approvals queue

/approvals
  └── Queue permintaan penelitian
  └── Review → Approve/Reject/Request More Info
  └── Delegation ke specialist
  └── Audit trail lengkap

Flow Integration:
Researcher Submit → Approval Queue → Admin Review →
Approve/Reject → Data Export → Time-Limited Access →
Publication Tracking → Completed
```

---

## ✅ CHECKLIST IMPLEMENTASI

### **Phase 1: Wizard Form**
- [ ] Create research_requests schema in Prisma
- [ ] Create backend ResearchRequestsModule
- [ ] Create backend CRUD API (7 endpoints)
- [ ] Create frontend wizard components (9 sections)
- [ ] Implement auto-save functionality
- [ ] Implement file upload for documents
- [ ] Add validation for each section
- [ ] Test wizard flow end-to-end

### **Phase 2: Approval Integration**
- [ ] Modify approvals backend to handle research requests
- [ ] Create ResearchRequestReviewModal component
- [ ] Implement approval workflow (approve/reject/delegate)
- [ ] Add status transition logic
- [ ] Create notification system for status changes
- [ ] Test approval flow

### **Phase 3: Status Tracking**
- [ ] Replace /research/requests with dashboard
- [ ] Implement My Requests tab
- [ ] Implement Active Access tab
- [ ] Implement Completed Research tab
- [ ] Add real-time status updates
- [ ] Test tracking functionality

### **Phase 4: Data Export & Access**
- [ ] Implement data export service
- [ ] Create time-limited access token system
- [ ] Implement auto-revocation on expiration
- [ ] Add download functionality
- [ ] Test data access flow

---

## 🎯 SUCCESS CRITERIA

1. ✅ Researcher dapat mengisi form wizard 9-section untuk request data
2. ✅ Request otomatis masuk ke /approvals queue
3. ✅ Admin dapat review dan approve/reject di /approvals
4. ✅ Researcher dapat tracking status request secara real-time
5. ✅ Approved request mendapat time-limited data access
6. ✅ Akses otomatis di-revoke setelah timeline habis
7. ✅ Complete audit trail untuk semua approval decisions
8. ✅ Publication tracking untuk setiap completed research

---

## 📝 NOTES

**Kenapa harus wizard form seperti patient entry?**
1. **Data krusial**: Research request melibatkan akses data pasien yang sensitif
2. **Kompleksitas tinggi**: Banyak informasi yang perlu dikumpulkan (9 sections)
3. **Structured data**: Memudahkan review dan approval
4. **User experience**: Tidak overwhelming, step-by-step guidance
5. **Validation**: Setiap section bisa divalidasi sebelum lanjut
6. **Auto-save**: Researcher tidak kehilangan data jika belum selesai

**Perbedaan dengan patient entry:**
- Patient entry: Data medis pasien → Langsung tersimpan (no approval needed)
- Research request: Request akses data → Harus approval dulu → Baru dapat akses

**Timeline estimasi:**
- Sprint 1 (Wizard Form): 3-4 days
- Sprint 2 (Approval Integration): 2-3 days
- Sprint 3 (Status Tracking): 2-3 days
- **Total**: 7-10 days untuk complete implementation

---

**Prepared by:** Claude (AI Assistant)
**Date:** 2025-12-14
**Status:** READY FOR IMPLEMENTATION
