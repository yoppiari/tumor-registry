# Research Request Flow - SIMPLIFIED BUT EFFECTIVE

**Tanggal:** 2025-12-14
**Priority:** HIGH
**Approach:** Minimal complexity, maximum effectiveness

---

## 🎯 PRINSIP DESIGN: "SIMPLE BUT SECURE"

### Core Philosophy:
1. ✅ **Sederhana**: 3 langkah saja (bukan 9 sections)
2. ✅ **Efektif**: Tetap ada approval workflow yang ketat
3. ✅ **Auto-populate**: Kurangi manual entry sebisa mungkin
4. ✅ **Integration**: Seamless dengan /approvals yang sudah ada
5. ✅ **Audit trail**: Logging lengkap tanpa kompleksitas berlebihan

---

## 📋 3-STEP WIZARD (Instead of 9 Sections)

### **STEP 1: Peneliti & Penelitian** (Who & What)
```
┌─────────────────────────────────────────────────┐
│ 📝 Informasi Penelitian                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ Nama Peneliti: [Auto-fill dari user login]     │
│ Institusi: [Dropdown: Universitas/Hospital]    │
│ Email: [Auto-fill dari user login]             │
│ No. HP: [Input]                                 │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Judul Penelitian: [Text input]                 │
│                                                 │
│ Tipe Penelitian: [Radio buttons]               │
│   ○ Akademik (Skripsi/Tesis/Disertasi)         │
│   ○ Clinical Trial                             │
│   ○ Observational Study                        │
│   ○ Systematic Review/Meta-analysis            │
│                                                 │
│ Deskripsi Singkat (Abstract): [Textarea, max 500 chars] │
│                                                 │
│ Tujuan Penelitian: [Textarea, max 300 chars]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **STEP 2: Data Request** (What data + Why)
```
┌─────────────────────────────────────────────────┐
│ 📊 Data yang Dibutuhkan                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ Periode Data:                                   │
│ Dari: [Date picker] → Sampai: [Date picker]    │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Jenis Tumor: [Multi-select dropdown]           │
│ ☐ Bone Tumor → [Pilih WHO classification]      │
│ ☐ Soft Tissue Tumor → [Pilih WHO classification]│
│ ☐ Bone Metastasis                              │
│ ☐ Semua jenis                                  │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Data Fields yang Diperlukan:                   │
│ [Smart Preset Buttons:]                        │
│ • Basic Demographics                           │
│ • Clinical + Treatment                         │
│ • Full Dataset (requires extra approval)       │
│                                                 │
│ [Atau pilih manual:]                           │
│ ☐ Demographics (NIK, Age, Gender)              │
│ ☐ Clinical Data (Karnofsky, Pain Score)        │
│ ☐ Diagnosis (WHO Classification, Staging)      │
│ ☐ Treatment (Surgery, Chemotherapy, Radio)     │
│ ☐ Surgical Details (Limb Salvage, Margins)     │
│ ☐ Follow-up Data (MSTS Scores, Recurrence)     │
│ ☐ Clinical Photos/Imaging                      │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Justifikasi Penggunaan Data: [Textarea, REQUIRED] │
│ "Jelaskan kenapa data ini diperlukan untuk     │
│  penelitian Anda (min. 100 karakter)"          │
│                                                 │
│ Estimasi Jumlah Pasien: [Auto-calculated dari filter] │
│ ~ 45 pasien sesuai kriteria                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **STEP 3: Ethics & Timeline** (Compliance + Schedule)
```
┌─────────────────────────────────────────────────┐
│ ✅ Ethical Clearance & Timeline                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ IRB/Ethics Approval: [Radio buttons]           │
│   ○ Sudah ada → Upload sertifikat [File upload]│
│   ○ Dalam proses → Est. tanggal: [Date picker] │
│   ○ Belum ada (akan diajukan setelah approval) │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Timeline Penelitian:                            │
│ Mulai: [Date picker]                           │
│ Selesai: [Date picker]                         │
│                                                 │
│ Durasi Akses Data: [Dropdown]                  │
│   • 3 bulan                                    │
│   • 6 bulan (recommended)                      │
│   • 12 bulan                                   │
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ Upload Dokumen Pendukung:                      │
│ 📄 Research Protocol (Required): [File upload]  │
│ 📄 Proposal Penelitian (Optional): [File upload]│
│                                                 │
│ ────────────────────────────────────────────────│
│                                                 │
│ ☐ Saya setuju untuk:                           │
│   • Hanya menggunakan data untuk tujuan yang disebutkan │
│   • Tidak membagikan data ke pihak ketiga      │
│   • Mencantumkan INAMSOS dalam publikasi       │
│   • Menghapus data setelah penelitian selesai  │
│                                                 │
│ [Button: Preview Request] [Button: Submit]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔄 APPROVAL WORKFLOW (SIMPLIFIED)

### Status Flow (3 status inti saja):
```
DRAFT ──────────→ PENDING ──────────→ APPROVED ─────→ COMPLETED
         submit          admin review         ↓
                                             REJECTED
                                                ↓
                                            [END with reason]
```

### Integration dengan /approvals:

**Dashboard Admin di /approvals:**
```
┌────────────────────────────────────────────────┐
│ [Tab: Research Data Requests]                  │
├────────────────────────────────────────────────┤
│                                                │
│ Filters:                                       │
│ Status: [All] Priority: [All]                  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ RR-2025-001 │ Dr. Budi Santoso           │  │
│ │ PENDING     │ Universitas Indonesia      │  │
│ │ Judul: Survival Analysis Osteosarcoma    │  │
│ │ Data: 45 patients, 2020-2024             │  │
│ │ IRB: ✅ Approved                          │  │
│ │                                          │  │
│ │ [Review] [Approve] [Reject]              │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ RR-2025-002 │ Dr. Siti Aminah            │  │
│ │ PENDING     │ RSUP Hasan Sadikin         │  │
│ │ Judul: Limb Salvage Outcomes Study       │  │
│ │ Data: 78 patients, 2018-2023             │  │
│ │ IRB: ⏳ In Progress (Est. Dec 20)        │  │
│ │                                          │  │
│ │ [Review] [Approve] [Reject]              │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Review Modal (ketika admin klik "Review"):**
```
┌──────────────────────────────────────────────┐
│ 📋 Review Research Request: RR-2025-001      │
├──────────────────────────────────────────────┤
│                                              │
│ [Tab: Request Info] [Tab: Data Details] [Tab: Documents] │
│                                              │
│ Peneliti: Dr. Budi Santoso                  │
│ Institusi: Universitas Indonesia            │
│ Tipe: Academic Research (Disertasi)         │
│                                              │
│ Judul: Survival Analysis Osteosarcoma       │
│ Periode Data: 2020-2024                     │
│ Estimasi: 45 patients                       │
│                                              │
│ Data Fields:                                │
│ ✓ Demographics, Diagnosis, Treatment        │
│ ✓ Follow-up Data, Survival Outcomes         │
│                                              │
│ Justifikasi:                                │
│ "Data ini diperlukan untuk menganalisis..."  │
│                                              │
│ IRB Status: ✅ Approved (uploaded)           │
│ Timeline: 6 months access                   │
│                                              │
│ ────────────────────────────────────────────│
│                                              │
│ Admin Action:                               │
│                                              │
│ Decision: [Radio buttons]                   │
│   ○ APPROVE (grant access)                  │
│   ○ REJECT (deny request)                   │
│                                              │
│ Notes/Conditions: [Textarea]                │
│                                              │
│ [Cancel] [Submit Decision]                  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 📊 RESEARCHER DASHBOARD: /research/requests

### Simple 2-Tab Layout:
```
┌────────────────────────────────────────────────┐
│ 📑 My Research Requests                        │
├────────────────────────────────────────────────┤
│                                                │
│ [Tab: Active Requests] [Tab: Completed]        │
│                                                │
│ [+ New Request]                                │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ RR-2025-003                              │  │
│ │ Limb Salvage Outcomes in Chondrosarcoma  │  │
│ │                                          │  │
│ │ Status: 🟡 PENDING REVIEW                │  │
│ │ Submitted: Dec 10, 2025                  │  │
│ │ Estimated patients: 32                   │  │
│ │                                          │  │
│ │ [View Details] [Withdraw]                │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ RR-2025-001                              │  │
│ │ Survival Analysis Osteosarcoma           │  │
│ │                                          │  │
│ │ Status: ✅ APPROVED                       │  │
│ │ Access until: Jun 14, 2026               │  │
│ │ Datasets: 45 patients                    │  │
│ │                                          │  │
│ │ [Download Data] [View Details]           │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA (MINIMAL)

### **research_requests** table:
```typescript
model ResearchRequest {
  id                String   @id @default(uuid())
  requestNumber     String   @unique // RR-2025-001

  // Researcher (auto-fill dari user login)
  researcherId      String
  researcher        User     @relation(fields: [researcherId], references: [id])
  institution       String
  phone             String?

  // Research Info
  title             String
  researchType      String   // ACADEMIC, CLINICAL_TRIAL, OBSERVATIONAL, etc
  abstract          String   @db.Text
  objectives        String   @db.Text
  justification     String   @db.Text

  // Data Request
  periodStart       DateTime
  periodEnd         DateTime
  tumorTypes        Json     // {bone: [...], softTissue: [...]}
  dataFields        Json     // [demographics, clinical, treatment, etc]
  estimatedCount    Int?     // auto-calculated

  // Timeline
  researchStart     DateTime
  researchEnd       DateTime
  accessDuration    Int      // in months

  // Ethics
  irbStatus         String   // APPROVED, IN_PROGRESS, PENDING
  irbDate           DateTime?
  irbCertificateUrl String?
  protocolUrl       String?
  proposalUrl       String?

  // Agreement
  agreementSigned   Boolean  @default(false)

  // Status & Approval
  status            String   @default("DRAFT") // DRAFT, PENDING, APPROVED, REJECTED, COMPLETED
  priority          String   @default("MEDIUM") // HIGH, MEDIUM, LOW

  // Admin review
  reviewedBy        String?
  reviewedAt        DateTime?
  reviewNotes       String?  @db.Text

  // Data access (if approved)
  dataExportUrl     String?
  accessGrantedAt   DateTime?
  accessExpiresAt   DateTime?

  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  submittedAt       DateTime?
  completedAt       DateTime?

  @@map("research_requests")
  @@schema("research")
}
```

### **research_request_history** (untuk audit trail):
```typescript
model ResearchRequestHistory {
  id              String   @id @default(uuid())
  requestId       String
  request         ResearchRequest @relation(fields: [requestId], references: [id])

  statusFrom      String?
  statusTo        String
  action          String   // SUBMITTED, REVIEWED, APPROVED, REJECTED, etc

  actorId         String
  actor           User     @relation(fields: [actorId], references: [id])
  notes           String?  @db.Text

  createdAt       DateTime @default(now())

  @@map("research_request_history")
  @@schema("research")
}
```

---

## 🚀 IMPLEMENTATION PLAN (SIMPLIFIED)

### **Sprint 1: 3-Step Wizard + Database** (2-3 days)
```
Backend:
✓ Prisma schema: research_requests + research_request_history
✓ Migration
✓ ResearchRequestsModule
✓ CRUD API (5 endpoints):
  - POST /research-requests (create/update draft)
  - GET /research-requests (list my requests)
  - GET /research-requests/:id (detail)
  - POST /research-requests/:id/submit (submit for review)
  - DELETE /research-requests/:id (delete draft)

Frontend:
✓ /research/requests/new - 3-step wizard
✓ Step1ResearcherInfo.tsx (200 lines)
✓ Step2DataRequest.tsx (300 lines)
✓ Step3EthicsTimeline.tsx (250 lines)
✓ research-requests.service.ts (150 lines)
```

### **Sprint 2: Approval Integration** (1-2 days)
```
Backend:
✓ Approval endpoints:
  - GET /research-requests/pending (for admin)
  - POST /research-requests/:id/approve (admin action)
  - POST /research-requests/:id/reject (admin action)
✓ Email notifications

Frontend:
✓ Modify /approvals/page.tsx - add "Research Requests" tab
✓ ResearchRequestReviewModal.tsx (300 lines)
✓ Integration dengan existing approval system
```

### **Sprint 3: Dashboard & Data Export** (1-2 days)
```
Backend:
✓ Data export service:
  - POST /research-requests/:id/export (generate CSV/Excel)
✓ Auto-expiration cron job

Frontend:
✓ /research/requests - Dashboard with 2 tabs
✓ MyRequestsTab.tsx (200 lines)
✓ CompletedTab.tsx (150 lines)
✓ Download functionality
```

**Total: 4-7 days** (vs 7-10 days untuk versi kompleks)

---

## ✅ COMPARISON: Complex vs Simplified

| Aspect | Complex (9 Sections) | **Simplified (3 Steps)** |
|--------|---------------------|------------------------|
| **Form Steps** | 9 sections | **3 steps** |
| **Fields Count** | ~60 fields | **~25 essential fields** |
| **Auto-populate** | Minimal | **Heavy (researcher info from login)** |
| **Presets** | None | **Smart presets for data fields** |
| **Status States** | 9 states | **4 states (DRAFT, PENDING, APPROVED, REJECTED)** |
| **Documents** | 5 required uploads | **2 uploads (protocol + IRB)** |
| **Implementation** | 7-10 days | **4-7 days** |
| **User Friction** | High (banyak form) | **Low (quick to complete)** |
| **Approval Integration** | Complex multi-level | **Simple approve/reject** |
| **Database Tables** | 3 tables | **2 tables** |

**TETAP MEMENUHI EPIC 4:**
- ✅ Story 4.1: Structured request ✓
- ✅ Story 4.3: Approval workflow ✓
- ✅ Story 4.4: Status tracking ✓
- ✅ Story 4.5: Time-limited access ✓

---

## 🎯 SUCCESS CRITERIA

1. ✅ Researcher dapat submit request dalam **< 10 menit**
2. ✅ Request masuk ke /approvals untuk admin review
3. ✅ Admin dapat approve/reject dengan 1 klik
4. ✅ Status tracking real-time (PENDING → APPROVED/REJECTED)
5. ✅ Approved request = download data + auto-expire
6. ✅ Complete audit trail di research_request_history
7. ✅ Zero manual admin untuk access revocation (auto-expire)

---

## 💡 KEY SIMPLIFICATIONS

### 1. **Auto-populate from login**
- Researcher name, email → dari user yang login
- Institusi → dari user profile

### 2. **Smart Data Field Presets**
```
[Quick Select Buttons:]
• Basic Demographics → auto-check: NIK, Age, Gender
• Clinical + Treatment → auto-check: Diagnosis, Staging, Treatment
• Full Dataset → check semua + require extra approval
```

### 3. **Status workflow minimal**
```
BEFORE (complex):
DRAFT → SUBMITTED → UNDER_REVIEW → NEED_MORE_INFO →
ETHICS_REVIEW → APPROVED → DATA_PREPARATION →
ACCESS_GRANTED → COMPLETED

AFTER (simple):
DRAFT → PENDING → APPROVED/REJECTED → COMPLETED
```

### 4. **Single approval action**
- Admin hanya perlu: APPROVE atau REJECT (dengan notes optional)
- No delegation, no multi-level, no "request more info" state
- Jika butuh info tambahan → reject dengan notes, researcher buat request baru

### 5. **Automatic data export**
- Approved request → system auto-generate CSV export
- No manual "data preparation" step
- Download link langsung available

---

## 📝 NOTES

**Kenapa versi simplified tetap efektif?**

1. **Core security tetap terjaga**:
   - Approval workflow masih ada
   - IRB requirement tetap enforced
   - Time-limited access tetap auto-expire
   - Audit trail lengkap

2. **User experience jauh lebih baik**:
   - 3 steps vs 9 sections = 66% reduction
   - Auto-populate = less typing
   - Smart presets = faster selection
   - Submit dalam < 10 menit vs 30+ menit

3. **Admin workflow lebih cepat**:
   - Review modal: all info in 1 page
   - Approve/Reject: 1-click action
   - No complex delegation/escalation

4. **Implementation lebih cepat**:
   - 4-7 days vs 7-10 days
   - Less code = easier maintenance
   - Less database complexity

**Trade-offs yang acceptable:**
- ❌ No collaboration tracking (bisa tambahkan nanti jika perlu)
- ❌ No publication tracking (bisa manual via email)
- ❌ No multi-level delegation (admin bisa konsultasi offline)
- ❌ No "request more info" status (reject + resubmit)

**Bottom line:**
- ✅ 80% functionality dengan 40% effort
- ✅ Memenuhi semua core requirements Epic 4
- ✅ Fast to implement, easy to use, secure by design

---

**Prepared by:** Claude (AI Assistant)
**Date:** 2025-12-14
**Status:** READY FOR IMPLEMENTATION
**Approach:** SIMPLIFIED BUT EFFECTIVE
