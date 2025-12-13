# INAMSOS - Indonesian Musculoskeletal Tumor Registry

## Project Context (Last Updated: 2025-12-12)

### 🎯 **Project Type**
**Specialized Musculoskeletal Tumor Registry** (NOT generic cancer registry)

- **Subspecialty**: Orthopedic Oncology
- **Registry Type**: Bone Tumors, Soft Tissue Tumors, Bone Metastasis, Tumor-like Lesions
- **Classification Standard**: WHO Classification of Tumours of Soft Tissue and Bone (5th Edition, 2020)
- **Network**: 21 designated Indonesian musculoskeletal tumor centers

### 🚨 **CRITICAL STATUS (2025-12-12)**

**MAJOR GAP IDENTIFIED**: Current implementation is generic cancer registry, NOT the specialized musculoskeletal tumor registry as planned.

**Status**: RE-IMPLEMENTATION IN PROGRESS (Phase 1-5 Parallel Execution)

**Priority**: P0 - CRITICAL

---

## 🔑 **Core Unique Features (Must Have)**

### **10-Section Specialized Data Entry Form**

1. **Section 1**: Center & Pathology Type
   - 21 designated centers dropdown
   - Pathology selector: Bone Tumor / Soft Tissue Tumor / Bone Metastasis / Tumor-like Lesion

2. **Section 2**: Patient Identity
   - Hierarchical Indonesian address (Province > Regency > District > Village)

3. **Section 3**: Clinical Data
   - Karnofsky Performance Score (0-100)
   - Pain Scale VAS (0-10)
   - Clinical photo upload with tagging

4. **Section 4**: Diagnostic Investigations
   - Laboratory: ALP, LDH, Ca, Phosphate
   - Radiology: X-ray, MRI, CT, Bone Scan, PET
   - **Mirrel Score** (pathological fracture risk calculator)
   - Pathology: FNAB, Core biopsy, IHK
   - **HUVOS grade** (chemotherapy response: I/II/III/IV)

5. **Section 5**: Diagnosis & Location 🔴 **MOST COMPLEX**
   - **WHO Bone Tumor Classification Tree** (57 classifications)
   - **WHO Soft Tissue Tumor Classification Tree** (68 classifications)
   - **Hierarchical Bone Location Picker** (95 locations in 3-level hierarchy)
   - **Soft Tissue Location Picker** (36 anatomical regions)
   - Tumor syndrome checklist (Li-Fraumeni, NF1, Ollier, Maffucci, etc.)

6. **Section 6**: Staging
   - **Enneking Staging** (IA/IB/IIA/IIB/III) 🔴 CRITICAL for musculoskeletal
   - AJCC Staging (IA/IB/IIA/IIB/III/IVA/IVB)
   - Tumor grade, size, depth, metastasis

7. **Section 7**: CPC (Cancer Patient Conference)
   - Multidisciplinary team documentation

8. **Section 8**: Treatment Management 🔴 **CORE ORTHOPEDIC ONCOLOGY**
   - **Limb Salvage vs Limb Ablation** (amputation) 🔴 KEY METRIC
   - Surgical margin: Wide R0/Marginal/R1/R2/Intralesional
   - Reconstruction: Bone graft / Joint replacement / Soft tissue flap
   - Chemotherapy: Neo-adjuvant/Adjuvant with regimen tracking
   - Radiotherapy: Dose and fractions

9. **Section 9**: Follow-up Management 🔴 **UNIQUE TO MUSCULOSKELETAL**
   - **14-visit longitudinal structure** over 5 years:
     - Year 1-2: Every 3 months (8 visits)
     - Year 3-5: Every 6 months (6 visits)
   - **MSTS Score Calculator** (Musculoskeletal Tumor Society Score):
     - 6 domains (Pain, Function, Emotional Acceptance, Hand Positioning, Manual Dexterity, Lifting)
     - Each domain 0-5 points
     - Total: 0-30 points
   - Recurrence and complication tracking

10. **Section 10**: Review & Submission
    - Comprehensive data summary
    - Data quality validation
    - Auto-save every 2 minutes

---

## 📊 **Key Specialized Metrics**

### Must Track (Unique to Musculoskeletal Registry)
1. **Limb Salvage Rate** (vs amputation) - by center, tumor type, staging
2. **MSTS Functional Scores** - trend over 5-year follow-up
3. **Enneking Staging Distribution** - IA/IB/IIA/IIB/III
4. **WHO Classification Distribution** - 57 bone + 68 soft tissue types
5. **Surgical Margin Quality** - Wide R0 rates
6. **Reconstruction Outcomes** - by method and tumor type
7. **5-Year Survival** - by WHO classification subtype

---

## 🏥 **21 Designated Centers**

1. RSUD Dr. Zainoel Abidin (Banda Aceh, Aceh)
2. RSUP H Adam Malik (Medan, Sumatera Utara)
3. RSUP Dr. M. Djamil (Padang, Sumatera Barat)
4. RSUP Dr. Mohammad Hoesin (Palembang, Sumatera Selatan)
5. RSUD Arifin Achmad (Pekanbaru, Riau)
6. RSUPN Dr. Cipto Mangunkusumo (Jakarta) - National Referral
7. RSUP Fatmawati (Jakarta)
8. RSUP Kanker Dharmais (Jakarta)
9. RSUP Persahabatan (Jakarta)
10. RS Universitas Indonesia (Depok, Jawa Barat)
11. RSUD Provinsi Banten (Serang)
12. RSUP Dr. Hasan Sadikin (Bandung, Jawa Barat)
13. RSUP Dr. Sardjito (Yogyakarta)
14. RSOP Prof. Dr. Soeharso (Surakarta, Jawa Tengah)
15. RSUD Dr. Moewardhi (Surakarta)
16. RSUD Dr. Soetomo (Surabaya, Jawa Timur)
17. RS Universitas Airlangga (Surabaya)
18. RSUD Dr. Syaiful Anwar (Malang, Jawa Timur)
19. RSUD Ulin (Banjarmasin, Kalimantan Selatan)
20. RSUP Prof. Dr. I.G.N.G. Ngoerah (Denpasar, Bali)
21. RSUP Dr. Wahidin Sudirohusodo (Makassar, Sulawesi Selatan)

---

## 🗂️ **Database - Reference Data (SEEDED)**

✅ **Already Seeded:**
- `who_bone_tumors` - 57 WHO bone tumor classifications
- `who_soft_tissue_tumors` - 68 WHO soft tissue tumor classifications
- `bone_locations` - 95 hierarchical bone locations (3 levels)
- `soft_tissue_locations` - 36 anatomical regions
- `tumor_syndromes` - 15 hereditary tumor syndromes
- `centers` - 21 designated musculoskeletal tumor centers
- `roles` - 6 user roles (SYSTEM_ADMIN, NATIONAL_ADMIN, CENTER_ADMIN, RESEARCHER, MEDICAL_OFFICER, DATA_ENTRY)

❌ **Clinical Data Models (TO BE IMPLEMENTED):**
- Clinical presentations (Karnofsky, Pain, BMI, photos)
- Diagnostic investigations (labs, radiology, Mirrel, pathology, HUVOS)
- Staging data (Enneking, AJCC, grades)
- CPC records
- Treatment tracking (chemotherapy, surgery, radiotherapy)
- Surgical details (limb salvage, margins, reconstruction)
- Follow-up visits (14-visit structure)
- MSTS scores over time
- Recurrence and complication tracking

---

## 📁 **Key Documents**

### Core Requirements
- **PRD**: `/docs/prd.md` - 97 Functional Requirements (Transformed v2.0)
- **Architecture**: `/docs/architecture.md` - System design (Transforming v2.0)
- **UX Design**: `/docs/ux-design-specification.md` - UI/UX specs (Transforming v2.0)
- **Epics**: `/docs/epics.md` - User stories (Transforming v2.0)

### Transformation Planning
- **Gap Analysis**: `/docs/GAP_ANALYSIS_AND_TRANSFORMATION_PLAN.md` - Critical gaps & 8-week roadmap
- **BMAD Status**: `/docs/bmm-workflow-status.yaml` - Project tracking
- **Phase 9 Deployment**: `/docs/phase-9-deployment-summary.md` - Production readiness (Completed)

### Testing & Local Access
- **Local Testing Guide**: `/docs/LOCAL_TESTING_GUIDE.md` - Access URLs & credentials
- **Login Fix Summary**: `/docs/LOGIN_FIX_SUMMARY.md` - Auth issues resolved

---

## 🔧 **Tech Stack**

### Backend
- **Runtime**: Bun (Fast JavaScript runtime)
- **Framework**: NestJS (TypeScript, Fastify adapter)
- **Database**: PostgreSQL 15
- **ORM**: Prisma (with multi-schema: system, clinical, reference)
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible for clinical photos/radiology)

### Frontend
- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State**: React Context API + SWR

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (SSL/TLS, rate limiting)
- **CI/CD**: GitHub Actions (5-stage pipeline)
- **Deployment**: Production docker-compose (7 services)

---

## 🚀 **Current Transformation Status**

### ✅ Completed (Phases 0-9 Original Implementation)
- Phase 0: Discovery (Brainstorming, Product Brief)
- Phase 1: Planning (PRD v2.0, UX Design, Epics)
- Phase 2: Solutioning (Architecture v2.0, Test Design)
- Phase 3: Implementation Readiness
- Phase 4-6: Core Implementation (Auth, RBAC, Basic Patient Module)
- Phase 7: Advanced Clinical Features (MSTS Calculator stub, Follow-up tracker stub)
- Phase 8: Analytics Dashboard (Generic cancer analytics)
- Phase 9: Deployment & Production Readiness (Docker, CI/CD, Scripts, Docs)

**Overall Progress**: 100% of original plan, BUT not matching specialized musculoskeletal requirements

### 🔄 **RE-IMPLEMENTATION IN PROGRESS (Phases 1-5 Transformation)**

**Started**: 2025-12-12

**Phase 1: Critical Foundation** (Week 1-2) - IN PROGRESS
- Sprint 1.1: Fix blank page error + Database schema for clinical data
- Sprint 1.2: 10-section form wizard infrastructure

**Phase 2: Specialized Sections** (Week 3-4) - QUEUED
- Sprint 2.1: Sections 1-3 (Center, Patient, Clinical Data)
- Sprint 2.2: Sections 4-5 (Diagnostics, WHO Classification Trees, Locations)
- Sprint 2.3: Sections 6-7 (Staging, CPC)

**Phase 3: Treatment & Follow-up** (Week 5-6) - QUEUED
- Sprint 3.1: Section 8 - Treatment Management (Limb Salvage!)
- Sprint 3.2: Section 9 - Follow-up & MSTS Score Calculator
- Sprint 3.3: Section 10 - Review & Submit

**Phase 4: Home & Branding** (Week 7) - QUEUED
- Sprint 4.1: Musculoskeletal-specific home page & navigation

**Phase 5: Analytics Transformation** (Week 8) - QUEUED
- Sprint 5.1: Limb salvage analytics, MSTS trends, Enneking distribution

---

## 🎯 **Top Priority Features (P0)**

1. ✅ Fix `/patients/new` blank page error
2. ✅ 10-section form wizard framework
3. ✅ WHO Classification trees (Bone + Soft Tissue) with search
4. ✅ Hierarchical bone/soft tissue location pickers
5. ✅ Enneking staging selector
6. ✅ **Limb Salvage vs Ablation** tracking and analytics
7. ✅ **MSTS Score calculator** (6 domains, 0-30 points)
8. ✅ **14-visit follow-up system** (Year 1-2: Q3M, Year 3-5: Q6M)
9. ✅ Database schema for all clinical data models

---

## 📝 **Development Notes**

### When Working on This Project:

1. **ALWAYS refer to PRD v2.0** - This is a SPECIALIZED musculoskeletal tumor registry, NOT generic cancer registry
2. **Focus on Orthopedic Oncology** - Bone tumors, soft tissue tumors, limb salvage outcomes
3. **WHO Classification is CRITICAL** - 57 bone + 68 soft tissue tumor types must be integrated
4. **Enneking Staging** - Standard for musculoskeletal tumors (different from TNM)
5. **MSTS Score** - Functional outcome measurement unique to musculoskeletal oncology
6. **Limb Salvage Rate** - THE key metric for surgical outcome success
7. **14-Visit Follow-up** - Longitudinal tracking over 5 years is core differentiator

### Key Differentiators from Generic Cancer Registry:

- ❌ NOT for breast, lung, colon, or other solid organ cancers
- ✅ FOR bone and soft tissue tumors (orthopedic oncology subspecialty)
- ✅ Hierarchical anatomical locations (specific bones, proximal/middle/distal thirds)
- ✅ Limb salvage vs amputation tracking (NOT applicable to other cancer types)
- ✅ MSTS functional scores (musculoskeletal-specific outcome measure)
- ✅ Enneking staging (different from TNM staging used in other cancers)
- ✅ Mirrel score for pathological fracture risk (bone tumor specific)
- ✅ Reconstruction methods (bone grafts, joint replacements - orthopedic surgery)

---

## 🔗 **Local Development Access**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin2025)
- **PostgreSQL**: localhost:5433 (inamsos / inamsos_dev_2025)

**Demo Credentials:**
- System Admin: `admin@inamsos.go.id` / `admin123`
- Medical Officer: `medical.officer@inamsos.go.id` / `medical123`
- Researcher: `researcher@inamsos.go.id` / `research123`

---

## ⚠️ **Common Pitfalls to Avoid**

1. ❌ Building generic cancer forms - THIS IS SPECIALIZED MUSCULOSKELETAL ONLY
2. ❌ Using TNM staging - USE ENNEKING STAGING for musculoskeletal tumors
3. ❌ Ignoring limb salvage tracking - THIS IS THE #1 OUTCOME METRIC
4. ❌ Forgetting MSTS Score calculator - CORE FUNCTIONAL OUTCOME MEASURE
5. ❌ Skipping WHO classification integration - REQUIRED FOR RESEARCH VALIDITY
6. ❌ Generic anatomical locations - MUST USE HIERARCHICAL BONE/SOFT TISSUE TAXONOMY

---

**Document Owner**: Claude (AI Assistant)
**Last Updated**: 2025-12-12
**Review Frequency**: After each major phase completion
