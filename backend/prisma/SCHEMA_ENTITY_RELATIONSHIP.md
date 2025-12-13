# Entity Relationship Diagram - Musculoskeletal Tumor Models

## Visual Schema Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                              PATIENT                                 │
│  Core patient demographics, WHO classification, tumor location       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ (1:1 or 1:N)
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌───────────────────┐    ┌──────────────────┐
│   SECTION 3   │      │    SECTION 4      │    │   SECTION 6      │
│   Clinical    │      │   Diagnostics     │    │   Staging        │
└───────────────┘      └───────────────────┘    └──────────────────┘
        │                        │                        │
        │                        │                        │
        ├─► ClinicalPresentation │                StagingData (1:1)
        │   (1:1)                │                   │
        │                        │                   ├─► ennekingStage
        ├─► ClinicalPhoto        │                   ├─► ajccStage
        │   (1:N)                │                   └─► tumorGrade
        │                        │
        │                        ├─► LaboratoryResult_Extended (1:N)
        │                        │   ├─► ALP, LDH
        │                        │   └─► Calcium, Phosphate
        │                        │
        │                        ├─► RadiologyFinding (1:N)
        │                        │   ├─► XRAY, MRI, CT
        │                        │   └─► BONE_SCAN, PET_CT
        │                        │
        │                        ├─► MirrelScore (1:N) ⭐ FRACTURE RISK
        │                        │   ├─► Site, Pain, Lesion, Size
        │                        │   └─► Total Score → Fracture Risk
        │                        │
        │                        ├─► PathologyReport_Extended (1:N)
        │                        │   ├─► FNAB, Core Biopsy, IHK
        │                        │   └─► IHC & Molecular Markers
        │                        │
        │                        └─► HuvosGrade (1:N) ⭐ CHEMO RESPONSE
        │                            ├─► Grade I/II/III/IV
        │                            └─► Necrosis %
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                        SECTION 7 & 8                              │
│                  CPC & Treatment Management                       │
└──────────────────────────────────────────────────────────────────┘
        │
        ├─► CpcRecord (1:N)
        │   └─► Multidisciplinary Decisions
        │
        ├─► ChemotherapyRecord (1:N)
        │   ├─► NEO_ADJUVANT
        │   └─► ADJUVANT
        │
        ├─► SurgicalRecord (1:N) ⭐⭐⭐ PRIMARY METRIC
        │   ├─► LIMB_SALVAGE (GOAL)
        │   ├─► LIMB_ABLATION (Amputation)
        │   ├─► Surgical Margin (Wide R0/R1/R2)
        │   └─► Reconstruction Method
        │
        └─► RadiotherapyRecord (1:N)
            ├─► NEO_ADJUVANT
            └─► ADJUVANT
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                        SECTION 9                                  │
│                  Follow-up Management (5 Years)                   │
└──────────────────────────────────────────────────────────────────┘
        │
        └─► FollowUpVisit_Enhanced (1:N - 14 visits)
            ├─► Visit 1-8: Every 3 months (Year 1-2)
            ├─► Visit 9-14: Every 6 months (Year 3-5)
            │
            ├───► MstsScore_Enhanced (1:N) ⭐ FUNCTIONAL OUTCOME
            │     ├─► 6 Domains (0-5 each)
            │     ├─► Total Score (0-30)
            │     └─► Upper vs Lower Extremity
            │
            ├───► RecurrenceTracking (1:N)
            │     ├─► LOCAL
            │     ├─► DISTANT_METASTASIS
            │     └─► REGIONAL
            │
            └───► ComplicationTracking (1:N)
                  ├─► MILD
                  ├─► MODERATE
                  ├─► SEVERE
                  └─► LIFE_THREATENING
```

---

## Data Flow Diagram

```
┌─────────────┐
│   Patient   │
│   Entry     │
└──────┬──────┘
       │
       ├──► Section 3: Clinical Presentation
       │    ├─► Performance Status (Karnofsky)
       │    ├─► Pain Assessment (VAS 0-10)
       │    └─► Clinical Photos
       │
       ├──► Section 4: Diagnostics
       │    ├─► Labs (ALP, LDH, Ca, PO4)
       │    ├─► Imaging (X-ray, MRI, CT, PET)
       │    ├─► Mirrel Score → Fracture Risk
       │    ├─► Pathology (FNAB, Biopsy, IHK)
       │    └─► Huvos Grade (if osteosarcoma)
       │
       ├──► Section 5: Diagnosis & Location
       │    ├─► WHO Bone Tumor Classification
       │    ├─► WHO Soft Tissue Classification
       │    ├─► Bone Location (Hierarchical)
       │    └─► Soft Tissue Location
       │
       ├──► Section 6: Staging
       │    ├─► Enneking Stage (IA/IB/IIA/IIB/III)
       │    ├─► AJCC Stage (IA-IVB)
       │    └─► Tumor Grade (1/2/3)
       │
       ├──► Section 7: CPC Conference
       │    └─► Treatment Decision
       │
       ├──► Section 8: Treatment
       │    ├─► Chemotherapy (Neo-adjuvant/Adjuvant)
       │    ├─► Surgery ⭐ LIMB SALVAGE vs ABLATION
       │    └─► Radiotherapy
       │
       └──► Section 9: Follow-up (5 years)
            ├─► 14 Visits (Q3M → Q6M)
            ├─► MSTS Score (Functional Outcome)
            ├─► Recurrence Monitoring
            └─► Complication Tracking
```

---

## Critical Scoring Systems

### 1. Mirrel Score (Fracture Risk)

```
┌─────────────────────────────────────┐
│  Component 1: Site (1-3 points)    │
│    Upper limb        = 1            │
│    Lower limb        = 2            │
│    Peritrochanteric  = 3            │
├─────────────────────────────────────┤
│  Component 2: Pain (1-3 points)    │
│    Mild              = 1            │
│    Moderate          = 2            │
│    Functional        = 3            │
├─────────────────────────────────────┤
│  Component 3: Lesion (1-3 points)  │
│    Blastic           = 1            │
│    Mixed             = 2            │
│    Lytic             = 3            │
├─────────────────────────────────────┤
│  Component 4: Size (1-3 points)    │
│    < 1/3 diameter    = 1            │
│    1/3 - 2/3         = 2            │
│    > 2/3             = 3            │
└─────────────────────────────────────┘
         │
         ▼
    Total Score (3-12)
         │
         ▼
┌─────────────────────────────────────┐
│     Fracture Risk Assessment        │
│                                     │
│  ≤ 7  = LOW                         │
│  8-10 = MODERATE                    │
│  ≥ 11 = HIGH (Prophylactic fixation)│
└─────────────────────────────────────┘
```

### 2. MSTS Score (Functional Outcome)

```
┌─────────────────────────────────────┐
│     6 Domains (0-5 each)            │
│                                     │
│  Upper Extremity:                   │
│    1. Pain                 (0-5)    │
│    2. Function             (0-5)    │
│    3. Emotional Acceptance (0-5)    │
│    4. Hand Positioning     (0-5)    │
│    5. Manual Dexterity     (0-5)    │
│    6. Lifting Ability      (0-5)    │
│                                     │
│  Lower Extremity:                   │
│    1. Pain                 (0-5)    │
│    2. Function             (0-5)    │
│    3. Emotional Acceptance (0-5)    │
│    4. Supports             (0-5)    │
│    5. Walking              (0-5)    │
│    6. Gait                 (0-5)    │
└─────────────────────────────────────┘
         │
         ▼
    Total Score (0-30)
         │
         ▼
┌─────────────────────────────────────┐
│     Functional Outcome              │
│                                     │
│  > 21 (>70%) = Excellent            │
│  15-21 (50-70%) = Good              │
│  < 15 (<50%) = Fair/Poor            │
└─────────────────────────────────────┘
```

### 3. Huvos Grade (Chemo Response)

```
┌─────────────────────────────────────┐
│  Post-Neoadjuvant Specimen Analysis │
├─────────────────────────────────────┤
│  Grade I:   0-49% necrosis (Poor)   │
│  Grade II:  50-89% necrosis         │
│  Grade III: 90-99% necrosis (Good)  │
│  Grade IV:  100% necrosis (Excellent)│
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Treatment Decision                 │
│                                     │
│  Grade III-IV → Continue protocol   │
│  Grade I-II   → Modify adjuvant     │
└─────────────────────────────────────┘
```

### 4. Enneking Staging (Musculoskeletal)

```
┌─────────────────────────────────────┐
│  Grade (G) + Site (T) + Metastasis (M)│
├─────────────────────────────────────┤
│  IA:  Low grade (G1)                │
│       Intracompartmental (T1)       │
│       No metastasis (M0)            │
├─────────────────────────────────────┤
│  IB:  Low grade (G1)                │
│       Extracompartmental (T2)       │
│       No metastasis (M0)            │
├─────────────────────────────────────┤
│  IIA: High grade (G2)               │
│       Intracompartmental (T1)       │
│       No metastasis (M0)            │
├─────────────────────────────────────┤
│  IIB: High grade (G2)               │
│       Extracompartmental (T2)       │
│       No metastasis (M0)            │
├─────────────────────────────────────┤
│  III: Any grade                     │
│       Any site                      │
│       Metastasis present (M1)       │
└─────────────────────────────────────┘
```

---

## Key Analytics Relationships

### Limb Salvage Rate (Primary Outcome)

```
SurgicalRecord.surgeryType
         │
         ├─► LIMB_SALVAGE ──┐
         │                   │
         └─► LIMB_ABLATION ──┤
                             ▼
                    Salvage Rate =
                    LIMB_SALVAGE / Total
                             │
                             ▼
                    ┌─────────────────┐
                    │ Stratify By:    │
                    ├─────────────────┤
                    │ • Center        │
                    │ • Tumor Type    │
                    │ • Enneking Stage│
                    │ • Year          │
                    └─────────────────┘
```

### Functional Outcome Trends

```
Patient ──► FollowUpVisit_Enhanced (Visit 1-14)
                      │
                      └─► MstsScore_Enhanced
                          ├─► Visit 1 (3 months)
                          ├─► Visit 2 (6 months)
                          ├─► Visit 3 (9 months)
                          ├─► ...
                          └─► Visit 14 (5 years)
                               │
                               ▼
                    Longitudinal MSTS Trend
                    (Function over time)
```

### Recurrence-Free Survival

```
Patient ──► SurgicalRecord.surgeryDate
                      │
                      └─► RecurrenceTracking.detectionDate
                               │
                               ▼
                    Time to Recurrence
                    ├─► LOCAL
                    ├─► DISTANT_METASTASIS
                    └─► REGIONAL
                               │
                               ▼
                    Stratify by:
                    • Surgical Margin (R0/R1/R2)
                    • Enneking Stage
                    • Tumor Grade
```

---

## Index Strategy for Performance

### Primary Indexes (Foreign Keys)
```
All models:
  @@index([patientId])

Follow-up related:
  @@index([followUpVisitId])
```

### Analytics Indexes
```
SurgicalRecord:
  @@index([surgeryType])      // Limb salvage rate
  @@index([surgicalMargin])   // Margin analysis
  @@index([surgeryDate])      // Temporal analysis

StagingData:
  @@index([ennekingStage])    // Stage distribution
  @@index([ajccStage])        // AJCC analysis

MirrelScore:
  @@index([fractureRisk])     // Risk stratification

HuvosGrade:
  @@index([grade])            // Response analysis

FollowUpVisit_Enhanced:
  @@index([visitType])        // Visit scheduling
  @@index([status])           // Compliance tracking
  @@index([scheduledDate])    // Calendar integration
```

### Temporal Indexes
```
All models with date fields:
  @@index([assessmentDate])
  @@index([testDate])
  @@index([studyDate])
  @@index([reportDate])
  @@index([surgeryDate])
  @@index([startDate])
  @@index([detectionDate])
  @@index([onsetDate])
```

---

## Unique Constraints

```
ClinicalPresentation:
  patientId @unique              // One per patient

StagingData:
  patientId @unique              // One per patient

FollowUpVisit_Enhanced:
  @@unique([patientId, visitNumber])  // No duplicate visit numbers
```

---

## Cascade Delete Strategy

```
Patient (deleted)
    │
    └─► CASCADE DELETE ALL:
        ├─► ClinicalPresentation
        ├─► ClinicalPhoto
        ├─► LaboratoryResult_Extended
        ├─► RadiologyFinding
        ├─► MirrelScore
        ├─► PathologyReport_Extended
        ├─► HuvosGrade
        ├─► StagingData
        ├─► CpcRecord
        ├─► ChemotherapyRecord
        ├─► SurgicalRecord
        ├─► RadiotherapyRecord
        ├─► FollowUpVisit_Enhanced
        │   └─► CASCADE DELETE:
        │       ├─► MstsScore_Enhanced
        │       ├─► RecurrenceTracking
        │       └─► ComplicationTracking
        ├─► MstsScore_Enhanced (orphaned)
        ├─► RecurrenceTracking (orphaned)
        └─► ComplicationTracking (orphaned)
```

---

## Json Field Structures

### ClinicalPresentation.physicalExamination
```json
{
  "inspection": "...",
  "palpation": "...",
  "movement": "...",
  "neurovascular": "...",
  "measurements": {
    "circumference": 40.5,
    "length": 85.0
  }
}
```

### LaboratoryResult_Extended.tumorMarkers
```json
{
  "CEA": 2.5,
  "AFP": 3.2,
  "custom_marker": "value"
}
```

### PathologyReport_Extended.ihcMarkers
```json
{
  "Ki67": "20%",
  "p53": "Positive",
  "CD99": "Strongly positive",
  "S100": "Negative"
}
```

### ChemotherapyRecord.adverseEvents
```json
[
  {
    "event": "Nausea",
    "grade": 2,
    "action": "Antiemetic given"
  },
  {
    "event": "Neutropenia",
    "grade": 3,
    "action": "G-CSF started"
  }
]
```

---

**Diagram Version:** 1.0
**Last Updated:** 2025-12-12
