# Musculoskeletal Tumor Clinical Data Schema Documentation

**Date Created:** 2025-12-12
**Schema Version:** 1.0
**Database:** PostgreSQL
**ORM:** Prisma
**Schema:** `medical`

---

## Overview

This document describes the comprehensive Prisma schema models created for the Indonesian Musculoskeletal Tumor Registry (INAMSOS). The schema supports a 10-section clinical data entry form and includes all specialized models required for musculoskeletal tumor patient management, treatment tracking, and long-term follow-up.

---

## Schema Models Summary

### 16 New Clinical Data Models:

1. **ClinicalPresentation** - Section 3: Clinical data and performance scores
2. **ClinicalPhoto** - Section 3: Clinical photo uploads with anatomical tagging
3. **LaboratoryResult_Extended** - Section 4: Tumor-specific lab markers (ALP, LDH, Ca, Phosphate)
4. **RadiologyFinding** - Section 4: Radiology findings (X-ray, MRI, CT, Bone Scan, PET-CT)
5. **MirrelScore** - Section 4: Pathological fracture risk assessment
6. **PathologyReport_Extended** - Section 4: Enhanced pathology reports (FNAB, Core Biopsy, IHK)
7. **HuvosGrade** - Section 4: Chemotherapy response grading for osteosarcoma
8. **StagingData** - Section 6: Enneking and AJCC staging
9. **CpcRecord** - Section 7: Cancer Patient Conference documentation
10. **ChemotherapyRecord** - Section 8: Chemotherapy tracking (neo-adjuvant/adjuvant)
11. **SurgicalRecord** - Section 8: **CRITICAL** - Limb salvage vs ablation tracking
12. **RadiotherapyRecord** - Section 8: Radiotherapy tracking
13. **FollowUpVisit_Enhanced** - Section 9: 14-visit longitudinal follow-up structure
14. **MstsScore_Enhanced** - Section 9: Musculoskeletal Tumor Society functional scoring
15. **RecurrenceTracking** - Section 9: Local and distant recurrence tracking
16. **ComplicationTracking** - Section 9: Complication severity and management tracking

### 16 New Enums:

1. **RadiologyModality** - Imaging modalities
2. **MirrelLesionType** - Lesion characteristics (Blastic/Mixed/Lytic)
3. **FractureRisk** - Risk levels (LOW/MODERATE/HIGH)
4. **PathologyReportType** - Biopsy types
5. **TumorGrade** - Tumor grading system
6. **HuvosGradeType** - Chemotherapy response grades (I/II/III/IV)
7. **EnnekingStage** - Enneking staging (IA/IB/IIA/IIB/III)
8. **AjccStage** - AJCC staging (IA/IB/IIA/IIB/III/IVA/IVB)
9. **TumorDepth** - Superficial vs Deep
10. **ChemotherapyTiming** - Neo-adjuvant/Adjuvant/Palliative/Concurrent
11. **SurgeryType** - **CRITICAL** - LIMB_SALVAGE vs LIMB_ABLATION
12. **SurgicalMargin** - Margin assessment (Wide R0/Marginal R0/R1/R2/Intralesional)
13. **RadiotherapyTiming** - Neo-adjuvant/Adjuvant/Palliative/Definitive
14. **FollowUpVisitType** - 14-visit structure types
15. **FollowUpStatus** - Visit status tracking
16. **RecurrenceType** - Local/Distant/Regional
17. **ComplicationSeverity** - Mild/Moderate/Severe/Life-threatening

---

## Detailed Model Specifications

### 1. ClinicalPresentation

**Purpose:** Captures initial clinical presentation and performance status

**Key Fields:**
- `karnofskyScore`: Int (0-100) - Karnofsky Performance Score
- `painScale`: Int (0-10) - Visual Analog Scale
- `bmi`: Decimal(5,2) - Body Mass Index
- `chiefComplaint`: Text - Primary complaint
- `comorbidities`: Text - Associated conditions
- `cancerHistory`: Text - Prior cancer history
- `familyCancerHistory`: Text - Family cancer history
- `physicalExamination`: Json - Structured exam findings
- `presentingSymptoms`: Json - Structured symptoms (pain, swelling, mass, fracture)
- `tumorSizeAtPresentation`: Decimal(6,2) - Size in cm

**Relation:** One-to-one with Patient (unique patientId)

**Indexes:**
- `patientId`
- `karnofskyScore`

---

### 2. ClinicalPhoto

**Purpose:** Manages clinical photography with anatomical location tracking

**Key Fields:**
- `fileUrl`: String - Storage URL
- `fileName`: String - Original filename
- `fileSize`: Int - Bytes
- `mimeType`: String - Image format
- `anatomicalLocation`: String - e.g., "Right femur", "Left shoulder"
- `viewType`: String - e.g., "Anterior", "Posterior", "Lateral"
- `uploadDate`: DateTime - Auto-set on upload

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `uploadDate`

---

### 3. LaboratoryResult_Extended

**Purpose:** Tumor-specific laboratory markers

**Key Fields:**
- `testDate`: DateTime
- `alp`: Decimal(10,2) - Alkaline Phosphatase (U/L)
- `ldh`: Decimal(10,2) - Lactate Dehydrogenase (U/L)
- `calcium`: Decimal(6,2) - Calcium (mg/dL)
- `phosphate`: Decimal(6,2) - Phosphate (mg/dL)
- `tumorMarkers`: Json - Additional markers
- `hemoglobin`: Decimal(5,2) - g/dL
- `albumin`: Decimal(5,2) - g/dL
- `esr`: Int - ESR (mm/hr)
- `crp`: Decimal(8,2) - C-Reactive Protein (mg/L)

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `testDate`

---

### 4. RadiologyFinding

**Purpose:** Radiology imaging findings and interpretations

**Key Fields:**
- `modalityType`: RadiologyModality enum (XRAY, MRI, CT, BONE_SCAN, PET_CT, ULTRASOUND, ANGIOGRAPHY)
- `studyDate`: DateTime
- `findings`: Text - Detailed findings
- `impression`: Text - Radiologist impression
- `imageUrls`: String[] - Array of image URLs
- `reportDate`: DateTime
- `tumorSize`: Decimal(6,2) - Largest dimension in cm
- `tumorVolume`: Decimal(10,2) - Volume in cm³
- `corticalBreakthrough`: Boolean
- `softTissueExtension`: Boolean
- `neurovascularInvolvement`: Boolean
- `skipLesions`: Boolean
- `pathologicalFracture`: Boolean

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `modalityType`
- `studyDate`

---

### 5. MirrelScore

**Purpose:** Pathological fracture risk assessment (Critical for bone metastases)

**Scoring Components:**
- `siteScore`: Int (1-3) - Upper limb=1, Lower limb=2, Peritrochanteric=3
- `painScore`: Int (1-3) - Mild=1, Moderate=2, Functional=3
- `lesionType`: MirrelLesionType - BLASTIC=1, MIXED=2, LYTIC=3
- `sizeScore`: Int (1-3) - <1/3=1, 1/3-2/3=2, >2/3=3
- `totalScore`: Int (3-12) - Auto-calculated sum
- `fractureRisk`: FractureRisk enum - LOW (≤7), MODERATE (8-10), HIGH (≥11)

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `fractureRisk`
- `assessmentDate`

**Clinical Significance:** Mirrel score ≥9 indicates prophylactic fixation

---

### 6. PathologyReport_Extended

**Purpose:** Enhanced pathology reporting with IHC and molecular markers

**Key Fields:**
- `reportType`: PathologyReportType enum (FNAB, CORE_BIOPSY, OPEN_BIOPSY, IHK, EXCISIONAL, FROZEN_SECTION)
- `biopsyDate`: DateTime
- `reportDate`: DateTime
- `grossDescription`: Text
- `microscopicFindings`: Text
- `diagnosis`: Text
- `ihcMarkers`: Json - Immunohistochemistry results
- `molecularMarkers`: Json - Genetic/molecular testing
- `tumorGrade`: TumorGrade enum (BENIGN, GRADE_1, GRADE_2, GRADE_3, GRADE_X)
- `mitosisCount`: Int - Per 10 HPF
- `necrosisPercentage`: Decimal(5,2) - 0-100%

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `reportType`
- `reportDate`

---

### 7. HuvosGrade

**Purpose:** Chemotherapy response grading for osteosarcoma (CRITICAL for treatment planning)

**Grading System:**
- **GRADE_I**: 0-49% necrosis (Poor response)
- **GRADE_II**: 50-89% necrosis (Moderate response)
- **GRADE_III**: 90-99% necrosis (Good response)
- **GRADE_IV**: 100% necrosis (Excellent response)

**Key Fields:**
- `grade`: HuvosGradeType enum
- `tumorNecrosisPercentage`: Decimal(5,2) - 0-100%
- `viableTumorPercentage`: Decimal(5,2) - 0-100%
- `assessmentDate`: DateTime
- `specimenType`: String - "Post-neoadjuvant surgical specimen"

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `grade`
- `assessmentDate`

**Clinical Significance:** Grades III-IV indicate good response; may modify adjuvant therapy

---

### 8. StagingData

**Purpose:** Comprehensive tumor staging (Enneking and AJCC systems)

**Enneking Staging (Musculoskeletal-specific):**
- **IA**: Low grade, intracompartmental, no metastasis
- **IB**: Low grade, extracompartmental, no metastasis
- **IIA**: High grade, intracompartmental, no metastasis
- **IIB**: High grade, extracompartmental, no metastasis
- **III**: Any grade, any compartment, with metastasis

**AJCC Staging:**
- **IA/IB/IIA/IIB/III**: Primary tumor staging
- **IVA**: Distant metastasis (single site)
- **IVB**: Multiple distant metastases

**Key Fields:**
- `ennekingStage`: EnnekingStage enum
- `ajccStage`: AjccStage enum
- `tumorGrade`: TumorGrade enum
- `tumorSize`: Decimal(6,2) - Largest dimension in cm
- `tumorDepth`: TumorDepth enum (SUPERFICIAL, DEEP)
- `compartmentStatus`: String - "Intracompartmental" or "Extracompartmental"
- `metastasisAtDiagnosis`: Boolean
- `metastasisSites`: String[] - Array of sites
- `regionalLymphNodes`: Boolean

**Relation:** One-to-one with Patient (unique patientId)

**Indexes:**
- `patientId`
- `ennekingStage`
- `ajccStage`

---

### 9. CpcRecord

**Purpose:** Cancer Patient Conference documentation (multidisciplinary decision-making)

**Key Fields:**
- `cpcDate`: DateTime
- `attendingConsultants`: String[] - Names/roles of attendees
- `presentation`: Text - Case presentation
- `treatmentDecision`: Text - Final treatment plan
- `treatmentIntent`: String - "Curative", "Palliative", "Supportive"
- `recommendationType`: String - "Surgery", "Chemotherapy", "Radiotherapy", "Combination"
- `rationale`: Text - Decision rationale
- `alternativeOptions`: Text - Other considered options
- `consensus`: Boolean - Default true
- `dissent`: Text - If not unanimous
- `documentedBy`: String - Meeting documenter

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `cpcDate`

---

### 10. ChemotherapyRecord

**Purpose:** Chemotherapy regimen tracking

**Key Fields:**
- `timing`: ChemotherapyTiming enum (NEO_ADJUVANT, ADJUVANT, PALLIATIVE, CONCURRENT)
- `regimen`: String - e.g., "MAP", "HDMTX", "Doxorubicin + Cisplatin"
- `cycles`: Int - Total planned cycles
- `cyclesCompleted`: Int - Default 0
- `startDate`: DateTime
- `endDate`: DateTime (nullable)
- `response`: Text - Response assessment
- `complications`: Text
- `adverseEvents`: Json - Structured AE data
- `doseModifications`: Json - Dose adjustments

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `timing`
- `startDate`

---

### 11. SurgicalRecord (CRITICAL MODEL)

**Purpose:** **Limb salvage vs ablation tracking** - Core outcome metric for musculoskeletal oncology

**Key Fields:**
- `surgeryDate`: DateTime
- `surgeryType`: **SurgeryType enum** - **LIMB_SALVAGE** or **LIMB_ABLATION** (CRITICAL)
- `surgicalProcedure`: String - Detailed procedure name
- `surgicalMargin`: SurgicalMargin enum (WIDE_R0, MARGINAL_R0, R1, R2, INTRALESIONAL)
- `marginDistance`: Decimal(6,2) - Distance in mm
- `reconstructionMethod`: String - "Megaprosthesis", "Bone graft", "Soft tissue flap"
- `amputationLevel`: String - If LIMB_ABLATION
- `operativeDuration`: Int - Minutes
- `bloodLoss`: Decimal(8,2) - ml
- `complications`: Text
- `surgeonName`: String
- `assistantSurgeons`: String[] - Array of names

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `surgeryType` - **CRITICAL for limb salvage rate analytics**
- `surgicalMargin`
- `surgeryDate`

**Clinical Significance:**
- Limb salvage rate is the PRIMARY outcome metric for musculoskeletal tumor centers
- Surgical margin (R0 vs R1/R2) predicts local recurrence risk

---

### 12. RadiotherapyRecord

**Purpose:** Radiotherapy tracking

**Key Fields:**
- `timing`: RadiotherapyTiming enum (NEO_ADJUVANT, ADJUVANT, PALLIATIVE, DEFINITIVE)
- `totalDose`: Decimal(7,2) - Total dose in Gy
- `fractions`: Int - Number of fractions
- `fractionsCompleted`: Int - Default 0
- `dosePerFraction`: Decimal(6,2) - Gy per fraction
- `technique`: String - "IMRT", "3D-CRT", "Brachytherapy"
- `targetVolume`: String - "Primary tumor bed", "Whole limb"
- `startDate`: DateTime
- `endDate`: DateTime (nullable)

**Relation:** Many-to-one with Patient

**Indexes:**
- `patientId`
- `timing`
- `startDate`

---

### 13. FollowUpVisit_Enhanced

**Purpose:** 14-visit longitudinal follow-up structure over 5 years

**Visit Schedule:**
- **Year 1-2**: Every 3 months (Visits 1-8) - YEAR_1_2_Q3M
- **Year 3-5**: Every 6 months (Visits 9-14) - YEAR_3_5_Q6M

**Key Fields:**
- `visitNumber`: Int (1-14)
- `visitType`: FollowUpVisitType enum
- `scheduledDate`: DateTime
- `actualDate`: DateTime (nullable)
- `status`: FollowUpStatus enum (SCHEDULED, COMPLETED, MISSED, CANCELLED, RESCHEDULED)
- `clinicalStatus`: String - "NED", "AWD", "DOD", "DOC"
- `karnofskyScore`: Int (0-100)
- `painScale`: Int (0-10)
- `imagingPerformed`: String[] - Array of modalities
- `imagingFindings`: Text
- `nextVisitDate`: DateTime

**Relations:**
- Many-to-one with Patient
- One-to-many with MstsScore_Enhanced
- One-to-many with RecurrenceTracking
- One-to-many with ComplicationTracking

**Unique Constraint:** [patientId, visitNumber]

**Indexes:**
- `patientId`
- `visitType`
- `status`
- `scheduledDate`

---

### 14. MstsScore_Enhanced

**Purpose:** Musculoskeletal Tumor Society functional outcome scoring (0-30 points)

**6 Domains (0-5 points each):**

**Upper Extremity:**
1. Pain (0-5)
2. Function (0-5)
3. Emotional Acceptance (0-5)
4. Hand Positioning (0-5)
5. Manual Dexterity (0-5)
6. Lifting Ability (0-5)

**Lower Extremity:**
1. Pain (0-5)
2. Function (0-5)
3. Emotional Acceptance (0-5)
4. Supports (0-5)
5. Walking (0-5)
6. Gait (0-5)

**Key Fields:**
- `pain`: Int (0-5)
- `function`: Int (0-5)
- `emotionalAcceptance`: Int (0-5)
- `handPositioning`: Int (0-5) - Upper extremity
- `manualDexterity`: Int (0-5) - Upper extremity
- `liftingAbility`: Int (0-5) - Upper extremity
- `supports`: Int (0-5) - Lower extremity (nullable)
- `walking`: Int (0-5) - Lower extremity (nullable)
- `gait`: Int (0-5) - Lower extremity (nullable)
- `totalScore`: Int (0-30) - **Auto-calculated sum**
- `extremityType`: String - "Upper" or "Lower"

**Relations:**
- Many-to-one with Patient
- Many-to-one with FollowUpVisit_Enhanced (nullable)

**Indexes:**
- `patientId`
- `followUpVisitId`
- `assessmentDate`

**Clinical Significance:** MSTS score >70% (21/30) considered excellent outcome

---

### 15. RecurrenceTracking

**Purpose:** Local and distant recurrence monitoring

**Key Fields:**
- `recurrenceType`: RecurrenceType enum (LOCAL, DISTANT_METASTASIS, REGIONAL)
- `detectionDate`: DateTime
- `location`: String - Anatomical location
- `diagnosticMethod`: String - "Imaging", "Biopsy", "Clinical examination"
- `treatment`: Text - Recurrence treatment
- `outcome`: Text - Treatment outcome

**Relations:**
- Many-to-one with Patient
- Many-to-one with FollowUpVisit_Enhanced (nullable)

**Indexes:**
- `patientId`
- `followUpVisitId`
- `recurrenceType`
- `detectionDate`

---

### 16. ComplicationTracking

**Purpose:** Complication severity and management tracking

**Key Fields:**
- `complicationType`: String
- `severity`: ComplicationSeverity enum (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- `onsetDate`: DateTime
- `description`: Text
- `management`: Text
- `resolution`: String - "Resolved", "Ongoing", "Worsened"
- `resolutionDate`: DateTime (nullable)

**Relations:**
- Many-to-one with Patient
- Many-to-one with FollowUpVisit_Enhanced (nullable)

**Indexes:**
- `patientId`
- `followUpVisitId`
- `severity`
- `onsetDate`

---

## Migration Instructions

### Step 1: Backup Database (CRITICAL)

```bash
# Backup PostgreSQL database
pg_dump -h localhost -U your_username -d tumor_registry > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Validate Schema

```bash
cd /home/yopi/Projects/tumor-registry/backend
npx prisma validate
npx prisma format
```

### Step 3: Generate Migration

```bash
npx prisma migrate dev --name add_musculoskeletal_clinical_models
```

This will:
- Create migration SQL file
- Apply migration to database
- Regenerate Prisma Client with new models

### Step 4: Verify Migration

```bash
# Check migration status
npx prisma migrate status

# Verify tables created
psql -U your_username -d tumor_registry -c "\dt medical.*"
```

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

---

## Production Migration

For production deployment:

```bash
# 1. Review migration SQL first
npx prisma migrate dev --create-only --name add_musculoskeletal_clinical_models

# 2. Review the generated SQL file in prisma/migrations/

# 3. Apply migration
npx prisma migrate deploy
```

---

## Key Design Decisions

### 1. Schema Selection
- All models use `@@schema("medical")` to organize clinical data separately from system/audit schemas
- Follows existing multi-schema pattern in the codebase

### 2. Naming Convention
- Models use PascalCase (e.g., `ClinicalPresentation`)
- Table names use snake_case via `@@map()` (e.g., `clinical_presentations`)
- "_Extended" suffix used to avoid conflicts with existing models

### 3. Cascading Deletes
- All foreign key relations use `onDelete: Cascade` to ensure data integrity
- When a Patient is deleted, all related clinical data is automatically removed

### 4. Indexing Strategy
- Primary indexes: All foreign keys (patientId, followUpVisitId)
- Secondary indexes: Frequently queried fields (dates, enums, risk scores)
- Optimized for analytics queries (surgeryType, ennekingStage, ajccStage)

### 5. Data Types
- Decimal for medical measurements (precise, not Float)
- Json for flexible structured data (tumorMarkers, adverseEvents)
- String[] arrays for multi-value fields (metastasisSites, imagingPerformed)
- Text (@db.Text) for long-form content (findings, notes)

### 6. Nullable Fields
- Most clinical fields are nullable to support progressive data entry
- Required fields: IDs, dates, core classification fields
- Supports incomplete forms with auto-save

### 7. Timestamp Tracking
- All models include `createdAt` and `updatedAt` for audit trail
- Separate business date fields (assessmentDate, surgeryDate, etc.)

---

## Critical Fields for Analytics

### Limb Salvage Rate (PRIMARY METRIC)
```prisma
SurgicalRecord.surgeryType: SurgeryType
// LIMB_SALVAGE vs LIMB_ABLATION
```

### Staging Distribution
```prisma
StagingData.ennekingStage: EnnekingStage
StagingData.ajccStage: AjccStage
```

### Functional Outcomes
```prisma
MstsScore_Enhanced.totalScore: Int (0-30)
// Track over 14 follow-up visits
```

### Treatment Response
```prisma
HuvosGrade.grade: HuvosGradeType
// Chemotherapy response for osteosarcoma
```

### Recurrence Rates
```prisma
RecurrenceTracking.recurrenceType: RecurrenceType
RecurrenceTracking.detectionDate: DateTime
```

---

## Next Steps

### 1. API Development
- Create CRUD endpoints for all 16 models
- Implement business logic (auto-calculation of scores)
- Add validation middleware

### 2. Frontend Forms
- Build 10-section multi-step form
- Implement auto-save mechanism
- Add client-side validation

### 3. Analytics Dashboards
- Limb salvage rate by center and tumor type
- Enneking staging distribution
- MSTS score trends over time
- 5-year survival by WHO classification

### 4. Data Quality
- Implement data completeness checks
- Add validation rules for related fields
- Create data quality dashboard

---

## Schema Maintenance

### Adding New Fields
1. Update schema in `schema.prisma`
2. Run `npx prisma format`
3. Create migration: `npx prisma migrate dev --name <descriptive_name>`
4. Update API endpoints and frontend forms

### Modifying Enums
1. Add new values at the end of enum (never remove)
2. Create migration
3. Update seed data if applicable
4. Update frontend dropdowns

### Performance Optimization
1. Monitor query performance
2. Add indexes for slow queries
3. Consider materialized views for complex analytics
4. Implement caching for frequently accessed data

---

## Support & References

### Documentation
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- INAMSOS Project: `/home/yopi/Projects/tumor-registry/docs/`

### Schema File Location
```
/home/yopi/Projects/tumor-registry/backend/prisma/schema.prisma
```

### Migration History
```
/home/yopi/Projects/tumor-registry/backend/prisma/migrations/
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-12
**Author:** Claude AI Assistant
**Review Status:** Ready for Review
