# Plan: Real Data Seeding untuk Tumor Muskuloskeletal Registry

**Dibuat**: 2025-12-14
**Status**: Planning
**Prioritas**: P0 - CRITICAL

---

## 🎯 Tujuan

Mengganti **SEMUA mock data** dengan **data sample REAL** yang relevan dengan tumor musculoskeletal agar aplikasi bisa di-test secara nyata.

---

## 🔴 Masalah Saat Ini

### 1. Mock Data Tidak Relevan
**Halaman `/research`** menggunakan data kanker umum yang SALAH:
- ❌ Kanker Payudara
- ❌ Kanker Paru
- ❌ Kanker Serviks

**Seharusnya**: Tumor muskuloskeletal (Osteosarcoma, Ewing Sarcoma, Chondrosarcoma, dll)

### 2. Mock Data di 25+ Halaman Frontend
Berikut halaman yang masih pakai mock data:
- `/research` + 3 subpages (requests, collaboration, publications)
- `/analytics` + 5 subpages (limb-salvage, staging, distribution, centers, trends)
- `/dashboard`
- `/patients/quality`
- `/follow-up` + 2 subpages (compliance, reminders)
- `/admin` + 4 subpages (users, centers, audit, config)
- `/approvals` + history
- `/reports` + 3 subpages (export, history, scheduled)
- Media pages (photos, radiology, pathology)

### 3. Database Masih Kosong
Hanya ada **reference data** (WHO classifications, bone locations, centers), tapi **TIDAK ADA patient data**.

---

## 📊 Data Real yang Akan Dibuat

### **Jumlah Target Data Sample**

#### A. **Patients (Pasien)** - 100 patients
Distribusi realistic:
- **Osteosarcoma**: 35 pasien (35%)
- **Ewing Sarcoma**: 20 pasien (20%)
- **Chondrosarcoma**: 15 pasien (15%)
- **Giant Cell Tumor**: 12 pasien (12%)
- **Soft Tissue Sarcoma**: 18 pasien (18%)

**Demografi:**
- Usia: 5-75 tahun (sesuai distribusi tumor muskuloskeletal)
- Gender: Male 60%, Female 40%
- Lokasi: Spread across 21 centers
- Periode diagnosis: 2020-2025

#### B. **Clinical Data per Patient**

**1. Clinical Presentations** (100 records)
- Karnofsky Score: 50-100
- Pain VAS: 0-10
- BMI: 16-35
- Clinical symptoms

**2. Diagnostic Investigations** (100 records per patient)
- Laboratory: ALP, LDH, Ca, Phosphate
- Radiology: X-Ray (100%), MRI (85%), CT (70%), Bone Scan (60%), PET (30%)
- Pathology: FNAB (40%), Core Biopsy (80%), IHK (50%)
- Mirrel Score: For pathological fracture risk
- HUVOS Grade: I-IV for chemotherapy response

**3. Staging Data** (100 records)
- **Enneking Staging** (PRIMARY): IA/IB/IIA/IIB/III distribution
- AJCC Staging: IA/IB/IIA/IIB/III/IVA/IVB
- Tumor grade: Low/High
- Metastasis: Lung (15%), Other (5%), None (80%)

**4. Treatment Records**

**Chemotherapy** (60 patients - mainly osteosarcoma & ewing sarcoma)
- Neo-adjuvant: 50 patients
- Adjuvant: 45 patients
- Regimens: MAP, VAC, IE, AC
- Cycles: 3-12 cycles
- HUVOS Response: I-IV

**Surgery** (85 patients)
- **Limb Salvage**: 68 patients (80%) 🔴 KEY METRIC
- **Limb Ablation**: 17 patients (20%)
- Margins: Wide R0 (70%), Marginal (15%), R1 (10%), R2 (5%)
- Reconstruction: Bone graft (30), Joint replacement (25), Soft tissue flap (20)

**Radiotherapy** (40 patients)
- Neo-adjuvant: 15 patients
- Adjuvant: 25 patients
- Dose: 30-70 Gy
- Fractions: 15-35

**5. Follow-up Visits** (14-visit protocol)
Total visits: ~600-800 visits across all patients
- Year 1-2: Every 3 months (8 visits)
- Year 3-5: Every 6 months (6 visits)

**6. MSTS Scores** (per follow-up visit)
~600-800 scores tracking functional outcomes over time
- Pain: 0-5
- Function: 0-5
- Emotional Acceptance: 0-5
- Hand Positioning: 0-5 (upper limb)
- Manual Dexterity: 0-5 (upper limb)
- Lifting: 0-5 (upper limb)
- Total: 0-30

**7. Clinical Media**
- **Clinical Photos**: 250 files (2-3 per patient)
  - Anterior, Posterior, Lateral views
  - Pre-op, Post-op, Follow-up
- **Radiology Images**: 400 files
  - X-Ray: 100 studies
  - MRI: 85 studies
  - CT: 70 studies
  - Bone Scan: 60 studies
  - PET: 30 studies
- **Pathology Reports**: 150 files
  - FNAB: 40 reports
  - Core Biopsy: 80 reports
  - IHK: 50 reports

#### C. **User Accounts** - 30 users
Distributed across roles and centers:
- **SYSTEM_ADMIN**: 2 users (national level)
- **NATIONAL_ADMIN**: 3 users
- **CENTER_ADMIN**: 21 users (1 per center)
- **RESEARCHER**: 8 users
- **MEDICAL_OFFICER**: 25 users
- **DATA_ENTRY**: 15 users

---

## 🏗️ Implementasi Plan

### **Phase 1: Database Seeding Script** (Week 1)

**File Structure:**
```
backend/prisma/seeds/
├── realistic-patients.seed.ts       # 100 patients with realistic demographics
├── clinical-presentations.seed.ts   # Karnofsky, Pain, BMI
├── diagnostic-investigations.seed.ts # Labs, Radiology, Pathology, Mirrel, HUVOS
├── staging-data.seed.ts             # Enneking + AJCC staging
├── treatment-chemotherapy.seed.ts   # Chemotherapy regimens & cycles
├── treatment-surgery.seed.ts        # Limb salvage/ablation + margins + reconstruction
├── treatment-radiotherapy.seed.ts   # Radiation therapy data
├── follow-up-visits.seed.ts         # 14-visit protocol per patient
├── msts-scores.seed.ts              # MSTS functional scores per visit
├── users-accounts.seed.ts           # 30 user accounts across roles
└── clinical-media-references.seed.ts # Reference to uploaded files (URLs)
```

**Data Generation Strategy:**
1. **Realistic Demographics**: Age distribution matches tumor epidemiology
2. **Temporal Consistency**: Diagnosis → Treatment → Follow-up timeline makes sense
3. **Clinical Correlation**: Staging correlates with treatment decisions
4. **Outcome Variation**: Mix of good/poor outcomes for realistic analytics

**Example Patient Journey:**
```
Patient: Ahmad, 18 tahun, Laki-laki, Osteosarcoma femur distal kanan

Timeline:
2024-01-15: Diagnosis (Enneking IIB, High grade, No metastasis)
2024-01-20: Clinical presentation (Karnofsky 80, Pain 7/10)
2024-01-25: Diagnostics (ALP high, X-Ray + MRI + CT + Bone Scan)
2024-02-01: Start Neo-adjuvant Chemo (MAP regimen, 3 cycles)
2024-05-15: Surgery - LIMB SALVAGE (Wide R0 margin, Endoprosthesis)
2024-06-01: Start Adjuvant Chemo (3 cycles)
2024-09-01: Follow-up Visit 1 (MSTS: 18/30 - Fair function)
2025-03-01: Follow-up Visit 4 (MSTS: 24/30 - Good function)
2025-12-01: Follow-up Visit 8 (MSTS: 27/30 - Excellent function)
Status: No recurrence, Good functional outcome
```

### **Phase 2: Frontend API Integration** (Week 2)

**Tasks:**
1. ✅ Connect `/research` to real patient data API
2. ✅ Connect `/analytics/*` to real treatment outcome APIs
3. ✅ Connect `/dashboard` to real statistics
4. ✅ Connect `/patients/quality` to real quality scores
5. ✅ Connect `/follow-up/*` to real visit data
6. ✅ Connect `/admin/*` to real user/center data
7. ✅ Remove ALL mock data from frontend components

**API Endpoints Needed:**
```
GET /api/v1/patients?filters=...              # Research data browsing
GET /api/v1/analytics/limb-salvage            # Limb salvage metrics
GET /api/v1/analytics/staging-distribution    # Enneking staging stats
GET /api/v1/analytics/msts-trends             # MSTS functional trends
GET /api/v1/analytics/survival-curves         # Survival analysis
GET /api/v1/follow-ups/compliance             # Visit compliance
GET /api/v1/follow-ups/upcoming               # Upcoming visits
GET /api/v1/quality/dashboard                 # Quality dashboard metrics
GET /api/v1/users                             # User management
GET /api/v1/centers                           # Center management
```

### **Phase 3: Media Files Seeding** (Week 2)

**Strategy:**
- Use **placeholder images** for clinical photos (realistic medical imaging style)
- Use **sample DICOM files** or converted JPEGs for radiology
- Use **PDF templates** for pathology reports
- Store in MinIO S3 bucket
- Reference in database

**Folder Structure in MinIO:**
```
inamsos-bucket/
├── clinical-photos/
│   ├── patient-001/
│   │   ├── anterior-2024-01-20.jpg
│   │   ├── posterior-2024-01-20.jpg
│   │   └── lateral-2024-01-20.jpg
│   └── ...
├── radiology/
│   ├── patient-001/
│   │   ├── xray-femur-2024-01-25.jpg
│   │   ├── mri-femur-2024-01-26.jpg
│   │   └── ct-chest-2024-01-27.jpg
│   └── ...
└── pathology/
    ├── patient-001/
    │   ├── core-biopsy-2024-01-28.pdf
    │   └── ihk-report-2024-02-01.pdf
    └── ...
```

---

## 📋 Execution Checklist

### **Week 1: Database Seeding**
- [ ] Write realistic patients seed (100 patients)
- [ ] Write clinical presentations seed
- [ ] Write diagnostic investigations seed
- [ ] Write staging data seed
- [ ] Write chemotherapy seed
- [ ] Write surgery seed (limb salvage tracking)
- [ ] Write radiotherapy seed
- [ ] Write follow-up visits seed (14-visit protocol)
- [ ] Write MSTS scores seed
- [ ] Write user accounts seed
- [ ] Write clinical media references seed
- [ ] Test seeding script
- [ ] Run seeding: `bun prisma db seed`

### **Week 2: Frontend Integration**
- [ ] Update Research page to use real API
- [ ] Update Analytics pages (all 5 subpages)
- [ ] Update Dashboard to use real stats
- [ ] Update Quality page to use real quality scores
- [ ] Update Follow-up pages to use real visit data
- [ ] Update Admin pages to use real user/center data
- [ ] Remove ALL mock data arrays from frontend
- [ ] Test all pages with real data
- [ ] Upload sample media files to MinIO
- [ ] Verify media display in patient tabs

---

## 🎯 Success Criteria

✅ **Zero mock data** in frontend components
✅ **100 realistic patients** in database
✅ **600-800 follow-up visits** with MSTS scores
✅ **All analytics** show real metrics (limb salvage rate, staging distribution, survival)
✅ **Research page** shows musculoskeletal tumor data (not breast/lung cancer)
✅ **Media files** (photos, radiology, pathology) accessible via patient tabs
✅ **Quality dashboard** shows real data quality scores
✅ **Follow-up compliance** shows real visit adherence

---

## 🚨 Risk & Mitigation

**Risk 1: Data generation complexity**
- Mitigation: Use helper functions for random but realistic data

**Risk 2: Database performance with large dataset**
- Mitigation: Add proper indexes on frequently queried fields

**Risk 3: Media file storage size**
- Mitigation: Use compressed images, limit to essential files

**Risk 4: Inconsistent timelines**
- Mitigation: Validate date sequences (diagnosis → treatment → follow-up)

---

## 📊 Data Volume Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Patients | 100 | Across 5 tumor types |
| Clinical Presentations | 100 | 1 per patient |
| Diagnostic Investigations | 100 | Comprehensive workup |
| Staging Records | 100 | Enneking + AJCC |
| Chemotherapy Records | 60 | Osteosarcoma, Ewing mostly |
| Surgery Records | 85 | 80% limb salvage |
| Radiotherapy Records | 40 | Various indications |
| Follow-up Visits | 600-800 | 14-visit protocol |
| MSTS Scores | 600-800 | Per visit |
| Clinical Photos | 250 | 2-3 per patient |
| Radiology Studies | 400 | Multiple modalities |
| Pathology Reports | 150 | FNAB, Core, IHK |
| User Accounts | 30 | Across 6 roles |

**Total Database Records**: ~2,500-3,000 records
**Total Media Files**: ~800 files (~2-5 GB storage)

---

## 💡 Next Steps

1. **Review & Approve Plan** - User approval needed
2. **Start Week 1** - Database seeding script development
3. **Start Week 2** - Frontend API integration
4. **Testing & Validation** - Comprehensive data validation
5. **Documentation Update** - Update user guide with real data examples

---

**Status**: ⏳ Awaiting User Approval
