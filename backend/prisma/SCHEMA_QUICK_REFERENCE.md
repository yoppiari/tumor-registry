# Musculoskeletal Tumor Schema - Quick Reference

## Models at a Glance

| Model | Purpose | Key Field | Critical For |
|-------|---------|-----------|--------------|
| **ClinicalPresentation** | Initial presentation | karnofskyScore (0-100) | Performance status |
| **ClinicalPhoto** | Clinical images | anatomicalLocation | Documentation |
| **LaboratoryResult_Extended** | Tumor markers | alp, ldh, calcium, phosphate | Diagnosis |
| **RadiologyFinding** | Imaging | modalityType, tumorSize | Diagnosis |
| **MirrelScore** | Fracture risk | totalScore (3-12) | **Prophylactic surgery** |
| **PathologyReport_Extended** | Biopsy results | reportType, diagnosis | **Diagnosis** |
| **HuvosGrade** | Chemo response | grade (I/II/III/IV) | **Treatment planning** |
| **StagingData** | Tumor staging | ennekingStage, ajccStage | **Prognosis** |
| **CpcRecord** | MDT decisions | treatmentDecision | Treatment planning |
| **ChemotherapyRecord** | Chemo tracking | regimen, cycles | Treatment |
| **SurgicalRecord** | Surgery tracking | **surgeryType (SALVAGE/ABLATION)** | **PRIMARY METRIC** |
| **RadiotherapyRecord** | RT tracking | totalDose, fractions | Treatment |
| **FollowUpVisit_Enhanced** | 14-visit structure | visitNumber (1-14) | **Long-term outcomes** |
| **MstsScore_Enhanced** | Functional outcome | totalScore (0-30) | **Quality of life** |
| **RecurrenceTracking** | Recurrence | recurrenceType | Outcomes |
| **ComplicationTracking** | Complications | severity | Safety |

---

## Critical Enums

### SurgeryType (MOST IMPORTANT)
```typescript
enum SurgeryType {
  LIMB_SALVAGE    // Limb-sparing surgery - GOAL
  LIMB_ABLATION   // Amputation - Last resort
}
```

### EnnekingStage (Musculoskeletal-specific)
```typescript
enum EnnekingStage {
  IA   // Low grade, intracompartmental
  IB   // Low grade, extracompartmental
  IIA  // High grade, intracompartmental
  IIB  // High grade, extracompartmental
  III  // Metastatic
}
```

### HuvosGradeType (Chemo response)
```typescript
enum HuvosGradeType {
  GRADE_I    // 0-49% necrosis (Poor)
  GRADE_II   // 50-89% necrosis
  GRADE_III  // 90-99% necrosis (Good)
  GRADE_IV   // 100% necrosis (Excellent)
}
```

### SurgicalMargin
```typescript
enum SurgicalMargin {
  WIDE_R0        // Wide margin, no tumor (GOAL)
  MARGINAL_R0    // Marginal margin, no tumor
  R1             // Microscopic residual
  R2             // Macroscopic residual
  INTRALESIONAL  // Tumor violation
}
```

---

## Migration Commands

### Development
```bash
# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Create and apply migration
npx prisma migrate dev --name add_musculoskeletal_clinical_models

# Generate Prisma Client
npx prisma generate
```

### Production
```bash
# Create migration SQL (review before applying)
npx prisma migrate dev --create-only --name add_musculoskeletal_clinical_models

# Apply migration
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## Key Relationships

```
Patient (1) ─── (1) ClinicalPresentation
        (1) ─── (N) ClinicalPhoto
        (1) ─── (N) LaboratoryResult_Extended
        (1) ─── (N) RadiologyFinding
        (1) ─── (N) MirrelScore
        (1) ─── (N) PathologyReport_Extended
        (1) ─── (N) HuvosGrade
        (1) ─── (1) StagingData
        (1) ─── (N) CpcRecord
        (1) ─── (N) ChemotherapyRecord
        (1) ─── (N) SurgicalRecord ⭐ CRITICAL
        (1) ─── (N) RadiotherapyRecord
        (1) ─── (N) FollowUpVisit_Enhanced
                    └── (N) MstsScore_Enhanced
                    └── (N) RecurrenceTracking
                    └── (N) ComplicationTracking
```

---

## Key Indexes for Performance

### Primary Indexes (Foreign Keys)
- All `patientId` fields
- All `followUpVisitId` fields

### Analytics Indexes
- `SurgicalRecord.surgeryType` - Limb salvage rate
- `SurgicalRecord.surgicalMargin` - Margin analysis
- `StagingData.ennekingStage` - Staging distribution
- `StagingData.ajccStage` - Staging distribution
- `MirrelScore.fractureRisk` - Fracture risk analysis
- `HuvosGrade.grade` - Chemo response tracking

### Temporal Indexes
- All date fields (surgeryDate, assessmentDate, testDate, etc.)
- `FollowUpVisit_Enhanced.scheduledDate`

---

## Auto-Calculated Fields

### MirrelScore.totalScore
```typescript
totalScore = siteScore + painScore + lesionTypeScore + sizeScore
// Range: 3-12
// ≥9 indicates prophylactic fixation needed
```

### MstsScore_Enhanced.totalScore
```typescript
// Upper Extremity:
totalScore = pain + function + emotionalAcceptance +
             handPositioning + manualDexterity + liftingAbility

// Lower Extremity:
totalScore = pain + function + emotionalAcceptance +
             supports + walking + gait

// Range: 0-30
// >21 (70%) considered excellent
```

---

## Data Validation Rules

### Clinical Presentation
- `karnofskyScore`: 0-100 (multiples of 10)
- `painScale`: 0-10
- `bmi`: Auto-calculated or manual entry

### Mirrel Score
- All component scores: 1-3
- Total score: 3-12
- Fracture risk auto-determined from total score

### MSTS Score
- All domain scores: 0-5
- Total score: 0-30 (sum of 6 domains)

### Huvos Grade
- `tumorNecrosisPercentage`: 0-100
- Grade determines prognosis and treatment

---

## Common Queries

### Limb Salvage Rate
```typescript
const limbSalvageRate = await prisma.surgicalRecord.groupBy({
  by: ['surgeryType'],
  _count: true,
  where: {
    surgeryDate: { gte: startDate, lte: endDate }
  }
});
```

### MSTS Score Trends
```typescript
const mstsScores = await prisma.mstsScore_Enhanced.findMany({
  where: { patientId: 'xxx' },
  orderBy: { assessmentDate: 'asc' },
  include: { followUpVisit: true }
});
```

### Enneking Staging Distribution
```typescript
const stagingDistribution = await prisma.stagingData.groupBy({
  by: ['ennekingStage'],
  _count: true
});
```

---

## Critical Metrics Dashboard

### 1. Limb Salvage Rate
```sql
SELECT
  surgery_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM medical.surgical_records
GROUP BY surgery_type;
```

### 2. MSTS Score Distribution
```sql
SELECT
  CASE
    WHEN total_score >= 21 THEN 'Excellent (>70%)'
    WHEN total_score >= 15 THEN 'Good (50-70%)'
    ELSE 'Fair (<50%)'
  END as outcome_category,
  COUNT(*) as count
FROM medical.msts_scores_enhanced
GROUP BY outcome_category;
```

### 3. Enneking Stage Distribution
```sql
SELECT
  enneking_stage,
  COUNT(*) as count
FROM medical.staging_data
WHERE enneking_stage IS NOT NULL
GROUP BY enneking_stage
ORDER BY enneking_stage;
```

---

## File Locations

| File | Location |
|------|----------|
| Schema | `/home/yopi/Projects/tumor-registry/backend/prisma/schema.prisma` |
| Documentation | `/home/yopi/Projects/tumor-registry/backend/prisma/MUSCULOSKELETAL_SCHEMA_DOCUMENTATION.md` |
| Migrations | `/home/yopi/Projects/tumor-registry/backend/prisma/migrations/` |
| Seed Data | `/home/yopi/Projects/tumor-registry/backend/prisma/seed.ts` |

---

## Next Steps Checklist

- [ ] Review schema with medical team
- [ ] Run migration in development
- [ ] Test all models with sample data
- [ ] Create API endpoints
- [ ] Build frontend forms
- [ ] Implement auto-calculation logic
- [ ] Create analytics dashboards
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Production deployment

---

**Last Updated:** 2025-12-12
