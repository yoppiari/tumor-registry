# GAP ANALYSIS & TRANSFORMATION PLAN
## INAMSOS - Indonesian Musculoskeletal Tumor Registry

**Date:** 2025-12-12
**Status:** CRITICAL - Major Gap Identified
**Priority:** HIGHEST

---

## 🚨 CRITICAL ISSUES IDENTIFIED

### 1. **Blank Page Error**
- **Location:** `http://localhost:3000/patients/new`
- **Issue:** Page displays completely blank (white screen)
- **Impact:** Critical - Users cannot enter new patient data
- **Root Cause:** PatientEntryForm component likely has errors or missing dependencies

### 2. **MAJOR SCOPE MISMATCH** ⚠️
- **Current Implementation:** Generic cancer registry form
- **Required Implementation:** Specialized Musculoskeletal Tumor Registry
- **Gap Severity:** CRITICAL - Fundamental mismatch between planned and implemented features

---

## 📊 COMPREHENSIVE GAP ANALYSIS

### A. DATA ENTRY FORM GAPS

#### **PLANNED: 10-Section Musculoskeletal Tumor Registry Form**

**Section 1 - Center & Pathology Type:**
- ❌ 21 designated musculoskeletal centers dropdown
- ❌ Pathology type selector: Bone Tumor / Soft Tissue Tumor / Bone Metastasis / Tumor-like Lesion
- ❌ Subspecialist and PPDS (resident) name capture

**Section 2 - Patient Identity:**
- ⚠️ Basic demographics likely present but not specialized
- ❌ Hierarchical Indonesian address (Province > Regency > District > Village)
- ❌ Medical Record Number with center prefix

**Section 3 - Clinical Data:**
- ❌ Karnofsky Performance Score (0-100)
- ❌ Pain Scale (0-10 VAS)
- ❌ Clinical photo upload with anatomical tagging
- ❌ BMI auto-calculation
- ❌ Structured anamnesis for tumor history
- ❌ Family cancer history specific to musculoskeletal tumors

**Section 4 - Diagnostic Investigations:**
- ❌ Laboratory results: ALP, LDH, Ca, Phosphate (tumor-specific markers)
- ❌ Radiology entry: X-ray, MRI, CT, Bone Scan, PET-CT
- ❌ **Mirrel Score calculator** for pathological fracture risk
- ❌ Pathology report: FNAB, Core biopsy, Open biopsy, IHK
- ❌ **HUVOS grade** for chemotherapy response (I/II/III/IV)

**Section 5 - Diagnosis & Location:** 🔴 **MOST CRITICAL GAP**
- ❌ **WHO Classification tree for BONE tumors** (57 classifications)
- ❌ **WHO Classification tree for SOFT TISSUE tumors** (68 classifications)
- ❌ **Hierarchical bone location picker**:
  - Upper/Lower extremity/Axial skeleton
  - Specific bone (Femur, Tibia, Humerus, etc.)
  - Proximal/Midshaft/Distal thirds
- ❌ **Soft tissue anatomical location picker** (36 locations)
- ❌ Tumor side: Right/Left/Midline
- ❌ **Tumor syndrome checklist** (Li-Fraumeni, NF1, Ollier, Maffucci, etc.)

**Section 6 - Staging:**
- ❌ **Enneking staging** (IA/IB/IIA/IIB/III) - CRITICAL for musculoskeletal tumors
- ❌ **AJCC staging** (IA/IB/IIA/IIB/III/IVA/IVB)
- ❌ Tumor grade: Benign/Grade 1/2/3/X
- ❌ Tumor size with categorical breakdown
- ❌ Tumor depth: Superficial/Deep
- ❌ Metastasis status at diagnosis

**Section 7 - CPC (Cancer Patient Conference):**
- ❌ CPC date and attending consultants
- ❌ Multidisciplinary treatment decision documentation

**Section 8 - Treatment Management:** 🔴 **SPECIALIZED ORTHOPEDIC ONCOLOGY**
- ❌ Treatment intention: Curative/Palliative
- ❌ **Neo-adjuvant chemotherapy** tracking (regimen, cycles)
- ❌ **Adjuvant chemotherapy** tracking
- ❌ **Surgical management**:
  - **Limb salvage** vs **Limb ablation** (amputation) 🔴 CRITICAL
  - Surgical margin: Wide R0/Marginal R0/R1/R2/Intralesional
  - Reconstruction method: Bone graft/Joint replacement/Soft tissue flap
  - Operative details: Duration, blood loss, complications
- ❌ **Radiotherapy tracking**: Neo-adjuvant/Adjuvant with dose and fractions

**Section 9 - Follow-up Management:** 🔴 **UNIQUE TO MUSCULOSKELETAL TUMORS**
- ❌ **14-visit longitudinal structure** over 5 years:
  - Year 1-2: Every 3 months (8 visits)
  - Year 3-5: Every 6 months (6 visits)
- ❌ **MSTS Score calculator** (Musculoskeletal Tumor Society Score, 0-30 points)
- ❌ Recurrence and metastasis tracking
- ❌ Complication tracking
- ❌ Automated follow-up reminders

**Section 10 - Review & Submission:**
- ❌ Comprehensive data summary
- ❌ Data quality validation
- ❌ Auto-save every 2 minutes

#### **CURRENT IMPLEMENTATION STATUS**
- ⚠️ Appears to be generic "Quick Capture vs Full Detail" form
- ⚠️ NO musculoskeletal-specific features
- ❌ Missing ALL 10 specialized sections
- ❌ No WHO classification integration
- ❌ No specialized scoring systems (Enneking, MSTS, Mirrel, HUVOS)

---

### B. DATABASE SCHEMA GAPS

#### **Required Specialized Tables (Missing)**

**1. WHO Classification Tables:**
```
✓ who_bone_tumors (57 entries) - SEEDED
✓ who_soft_tissue_tumors (68 entries) - SEEDED
```

**2. Anatomical Location Tables:**
```
✓ bone_locations (95 hierarchical entries) - SEEDED
✓ soft_tissue_locations (36 entries) - SEEDED
```

**3. Tumor Syndrome Table:**
```
✓ tumor_syndromes (15 entries) - SEEDED
```

**4. Missing Clinical Data Tables:**
```
❌ clinical_presentations (pain, Karnofsky, clinical photos)
❌ diagnostic_investigations (labs, radiology, pathology)
❌ staging_data (Enneking, AJCC, grades)
❌ cpc_records (multidisciplinary decisions)
❌ treatment_chemotherapy (regimens, cycles, response)
❌ treatment_surgery (limb salvage, margins, reconstruction)
❌ treatment_radiotherapy (dose, fractions)
❌ follow_up_visits (14-visit structure)
❌ msts_scores (functional outcomes over time)
❌ recurrence_tracking
❌ complication_tracking
```

**Status:**
- ✅ Reference data seeded (WHO classifications, locations, syndromes)
- ❌ Clinical data capture tables NOT implemented
- ❌ Treatment tracking tables NOT implemented
- ❌ Follow-up system tables NOT implemented

---

### C. HOME PAGE & NAVIGATION GAPS

**REQUIRED (from PRD):**
- Hero section emphasizing "Indonesia's First Musculoskeletal Tumor Registry"
- WHO Classification of Bone and Soft Tissue Tumors mention
- 21 designated centers network showcase
- Bone tumor vs Soft tissue tumor split
- Limb salvage outcome tracking
- MSTS functional scores
- 5-year longitudinal follow-up
- Orthopedic oncology subspecialty focus

**CURRENT:**
- ❌ Generic cancer database branding
- ❌ No musculoskeletal specialization
- ❌ Missing orthopedic oncology context

---

### D. ANALYTICS DASHBOARD GAPS

**REQUIRED Musculoskeletal-Specific Analytics:**
1. ❌ Bone tumor vs Soft tissue tumor distribution map
2. ❌ Enneking staging distribution
3. ❌ **Limb salvage rate by center and tumor type** 🔴 CRITICAL METRIC
4. ❌ MSTS functional outcome trends
5. ❌ 5-year survival by WHO classification
6. ❌ Treatment modality effectiveness (chemotherapy + surgery + radiotherapy)
7. ❌ Surgical margin analysis (Wide/Marginal/Intralesional)
8. ❌ Reconstruction method outcomes
9. ❌ Geographic tumor pattern analysis

**CURRENT:**
- ⚠️ Generic cancer analytics
- ❌ No musculoskeletal-specific metrics
- ❌ No limb salvage tracking
- ❌ No MSTS scoring analytics

---

## 🎯 TRANSFORMATION ROADMAP

### **PHASE 1: CRITICAL FOUNDATION** (Week 1-2)

#### Sprint 1.1 - Fix Immediate Issues + Database Schema
**Priority:** P0 - CRITICAL
**Duration:** 3-4 days

1. **Fix Blank Page Error**
   - Debug PatientEntryForm component
   - Fix import/dependency issues
   - Ensure basic rendering works

2. **Create Musculoskeletal Clinical Schema**
   ```typescript
   // Clinical Presentation
   - ClinicalPresentation model
   - KarnofskyScore, PainScale, BMI
   - ClinicalPhoto upload tracking

   // Diagnostic Investigations
   - LaboratoryResults (ALP, LDH, Ca, Phosphate)
   - RadiologyFindings (X-ray, MRI, CT, Bone Scan, PET)
   - MirrelScore calculation
   - PathologyReport (FNAB, Core biopsy, IHK)
   - HuvosGrade

   // Staging
   - EnnekingStaging model
   - AjccStaging model
   - TumorGrade, TumorSize, TumorDepth
   - MetastasisStatus
   ```

3. **Implement Treatment Tracking Schema**
   ```typescript
   // Treatment tables
   - TreatmentIntention (Curative/Palliative)
   - ChemotherapyRecord (Neo-adjuvant, Adjuvant, regimen)
   - SurgicalRecord (LimbSalvage vs Ablation)
   - SurgicalMargin, ReconstructionMethod
   - RadiotherapyRecord
   ```

4. **Implement Follow-up Schema**
   ```typescript
   - FollowUpVisit (14-visit structure)
   - MstsScore tracking
   - RecurrenceTracking
   - ComplicationTracking
   ```

#### Sprint 1.2 - Core Form Infrastructure
**Priority:** P0
**Duration:** 3-4 days

1. **Build 10-Section Form Framework**
   - Multi-step wizard component
   - Section navigation
   - Progress indicator
   - Auto-save mechanism
   - Validation framework

2. **Implement Conditional Rendering**
   - Based on pathology type (Bone/Soft Tissue/Metastasis)
   - Dynamic field showing/hiding
   - Context-aware validation

---

### **PHASE 2: SPECIALIZED SECTIONS** (Week 3-4)

#### Sprint 2.1 - Sections 1-3
**Priority:** P0
**Duration:** 4-5 days

1. **Section 1: Center & Pathology Type**
   - 21 centers dropdown
   - Pathology type selector with icons
   - Subspecialist/PPDS entry

2. **Section 2: Patient Identity**
   - Enhanced demographics
   - Hierarchical address picker (Indonesia-specific)
   - Contact validation

3. **Section 3: Clinical Data**
   - Karnofsky Score dropdown
   - Pain Scale VAS
   - Clinical photo upload with cropping
   - BMI auto-calculator
   - Tumor history forms

#### Sprint 2.2 - Sections 4-5 (Most Complex)
**Priority:** P0 - CRITICAL
**Duration:** 5-7 days

1. **Section 4: Diagnostic Investigations**
   - Laboratory result entry grid
   - Radiology findings structured form
   - **Mirrel Score auto-calculator**
   - Pathology report structured entry
   - HUVOS grade selector

2. **Section 5: Diagnosis & Location** 🔴 **MOST COMPLEX**
   - **WHO Bone Tumor Classification Tree**
     - Hierarchical tree component
     - 57 bone tumor classifications
     - Search and filter
   - **WHO Soft Tissue Tumor Classification Tree**
     - 68 soft tissue classifications
   - **Hierarchical Bone Location Picker**
     - 3-level hierarchy (Region > Bone > Third)
     - Visual bone anatomy selector
   - **Soft Tissue Location Picker**
     - 36 anatomical regions
   - Tumor syndrome multi-select

#### Sprint 2.3 - Sections 6-7
**Priority:** P0
**Duration:** 3-4 days

1. **Section 6: Staging**
   - Enneking staging selector (IA/IB/IIA/IIB/III)
   - AJCC staging selector
   - Tumor grade, size, depth
   - Metastasis checkboxes

2. **Section 7: CPC Documentation**
   - CPC date picker
   - Consultant multi-select
   - Treatment decision text area
   - Upload CPC notes

---

### **PHASE 3: TREATMENT & FOLLOW-UP** (Week 5-6)

#### Sprint 3.1 - Section 8: Treatment Management
**Priority:** P0 - CRITICAL for Orthopedic Oncology
**Duration:** 5-6 days

1. **Chemotherapy Module**
   - Neo-adjuvant tracking (regimen, cycles, dates)
   - Adjuvant tracking
   - Response assessment (HUVOS)

2. **Surgical Management Module** 🔴 **CORE FEATURE**
   - **Limb Salvage vs Limb Ablation** toggle
   - Surgical margin selector (Wide R0/Marginal/R1/R2)
   - Reconstruction method (Bone graft/Joint/Soft tissue)
   - Operative details (duration, blood loss)
   - Complication tracking

3. **Radiotherapy Module**
   - Neo-adjuvant/Adjuvant selector
   - Dose and fractions entry
   - Treatment dates

#### Sprint 3.2 - Section 9: Follow-up Management
**Priority:** P0 - UNIQUE FEATURE
**Duration:** 4-5 days

1. **14-Visit Follow-up System**
   - Schedule generator (auto-create 14 visits)
   - Visit type indicators (Year 1-2: Q3M, Year 3-5: Q6M)
   - Visit status tracking (Scheduled/Completed/Missed)

2. **MSTS Score Calculator** 🔴 **CRITICAL**
   - 6-domain assessment (0-5 each):
     - Pain
     - Function
     - Emotional Acceptance
     - Hand Positioning
     - Manual Dexterity
     - Lifting Ability
   - Auto-calculate total (0-30)
   - Trend visualization over time

3. **Recurrence & Complication Tracking**
   - Local recurrence
   - Metastasis detection
   - Complication documentation

#### Sprint 3.3 - Section 10: Review & Submit
**Priority:** P1
**Duration:** 2-3 days

1. **Comprehensive Summary View**
   - All 10 sections collapsible review
   - Edit buttons for each section
   - Completeness indicators

2. **Validation & Quality**
   - Mandatory field validation
   - Cross-field validation
   - Data quality score calculation
   - Warning for unusual values

---

### **PHASE 4: HOME PAGE & BRANDING** (Week 7)

#### Sprint 4.1 - Rebranding
**Priority:** P1
**Duration:** 2-3 days

1. **Home Page Transformation**
   - Hero: "Indonesia's First Musculoskeletal Tumor Registry"
   - WHO Classification mention
   - 21 designated centers map
   - Orthopedic oncology focus
   - Limb salvage statistics
   - MSTS score tracking highlight

2. **Navigation Update**
   - Musculoskeletal-specific menu items
   - Bone Tumor vs Soft Tissue Tumor sections
   - Follow-up Management menu
   - MSTS Score Tracker

---

### **PHASE 5: ANALYTICS TRANSFORMATION** (Week 8)

#### Sprint 5.1 - Musculoskeletal Analytics
**Priority:** P1
**Duration:** 4-5 days

1. **Specialized Dashboards**
   - Bone vs Soft Tissue tumor distribution
   - Enneking staging analytics
   - **Limb salvage rate dashboard** 🔴 KEY METRIC
   - MSTS score trends
   - 5-year survival by WHO classification
   - Treatment effectiveness comparison

2. **Geographic Visualization**
   - Tumor distribution map across 21 centers
   - Center performance benchmarking
   - Regional pattern analysis

---

## 📋 IMPLEMENTATION PRIORITIES

### **P0 - CRITICAL (Must Have for MVP)**
1. ✅ Fix blank page error
2. ✅ 10-section form framework
3. ✅ WHO classification trees (Bone + Soft Tissue)
4. ✅ Hierarchical location pickers
5. ✅ Enneking staging
6. ✅ Limb salvage vs ablation tracking
7. ✅ MSTS Score calculator
8. ✅ 14-visit follow-up system
9. ✅ Database schema for all clinical data

### **P1 - HIGH (Core Features)**
1. ⬜ Mirrel Score calculator
2. ⬜ HUVOS grading
3. ⬜ Clinical photo upload
4. ⬜ Chemotherapy tracking
5. ⬜ Radiotherapy tracking
6. ⬜ Home page rebranding
7. ⬜ Musculoskeletal analytics dashboard

### **P2 - MEDIUM (Enhanced Features)**
1. ⬜ Advanced radiology integration
2. ⬜ Tumor syndrome genetics
3. ⬜ Multi-center research coordination
4. ⬜ International registry integration (ISOLS)

---

## 🔥 IMMEDIATE NEXT STEPS (Next 48 Hours)

### DAY 1 (Today)
**Morning:**
1. ✅ Complete this gap analysis
2. ⬜ Fix PatientEntryForm blank page error
3. ⬜ Create Prisma schema for clinical data models

**Afternoon:**
4. ⬜ Implement 10-section form wizard framework
5. ⬜ Build Section 1 (Center & Pathology Type)
6. ⬜ Build Section 2 (Patient Identity)

### DAY 2 (Tomorrow)
**Morning:**
1. ⬜ Build Section 3 (Clinical Data with Karnofsky, Pain Scale)
2. ⬜ Start Section 4 (Diagnostic Investigations)

**Afternoon:**
3. ⬜ Build WHO Classification tree component (CRITICAL)
4. ⬜ Build hierarchical bone location picker
5. ⬜ Complete Section 5 (Diagnosis & Location)

---

## 🎯 SUCCESS METRICS

### Technical Completion
- [ ] All 10 sections implemented and tested
- [ ] WHO classification trees fully integrated
- [ ] MSTS Score calculator functional
- [ ] 14-visit follow-up system operational
- [ ] Limb salvage tracking working
- [ ] Data validation 100% coverage

### User Experience
- [ ] <5 minutes to complete essential sections
- [ ] <2 second response time for classification lookups
- [ ] Auto-save prevents data loss
- [ ] Mobile-responsive for bedside data entry
- [ ] Zero training needed for PPDS residents

### Data Quality
- [ ] >90% completeness on mandatory fields
- [ ] <1% validation errors
- [ ] 100% WHO classification accuracy
- [ ] Complete audit trail for all entries

---

## 🚀 TRANSFORMATION TIMELINE SUMMARY

| Phase | Duration | Completion |
|-------|----------|------------|
| Phase 1: Foundation | Week 1-2 | Sprint 1.1-1.2 |
| Phase 2: Specialized Sections | Week 3-4 | Sprint 2.1-2.3 |
| Phase 3: Treatment & Follow-up | Week 5-6 | Sprint 3.1-3.3 |
| Phase 4: Home & Branding | Week 7 | Sprint 4.1 |
| Phase 5: Analytics | Week 8 | Sprint 5.1 |

**Total Timeline:** 8 weeks to complete transformation
**Critical Path:** Sections 5 (WHO classification) and 8 (Limb salvage) and 9 (MSTS/Follow-up)

---

## ⚠️ RISKS & MITIGATION

### High Risk Items
1. **WHO Classification Tree Complexity**
   - Risk: 57 bone + 68 soft tissue classifications difficult to navigate
   - Mitigation: Hierarchical tree with search, favorites, recent selections

2. **Anatomical Location Picker UX**
   - Risk: 95 bone locations + 36 soft tissue locations overwhelming
   - Mitigation: Visual anatomy selector, autocomplete, anatomical diagrams

3. **MSTS Score Calculation Accuracy**
   - Risk: Incorrect scoring impacts research validity
   - Mitigation: Reference implementation from MSTS Society, validation tests

4. **14-Visit Follow-up Complexity**
   - Risk: Users confused by multi-year schedule
   - Mitigation: Clear timeline visualization, automated reminders

### Medium Risk Items
1. Data migration from existing centers
2. Training 21 centers on new specialized form
3. Integration with hospital PACS/RIS systems

---

**Document Owner:** Claude (AI Assistant)
**Review Date:** 2025-12-12
**Next Update:** After Phase 1 completion
