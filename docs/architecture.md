# Arsitektur INAMSOS - Indonesian Musculoskeletal Tumor Registry

**Date:** 2025-12-11
**Author:** Yoppi
**Version:** 2.0 (Transformed)
**Deployment:** Docker-based Local Infrastructure

---

## Executive Summary

INAMSOS (Indonesian Musculoskeletal Tumor Registry) akan menggunakan arsitektur container-based dengan Next.js + NestJS + PostgreSQL untuk menyediakan database tumor muskuloskeletal nasional yang scalable, secure, dan compliant dengan regulasi healthcare Indonesia. Arsitektur dirancang untuk deployment lokal dengan Docker, memastikan kedaulatan data tetap di Indonesia dengan performa optimal untuk 21 designated musculoskeletal tumor centers.

Sistem ini mengintegrasikan WHO Classification of Tumours untuk Bone and Soft Tissue Tumours dengan follow-up protocol 5 tahun (14 kunjungan), Musculoskeletal Tumor Society (MSTS) functional scoring, dan comprehensive surgical reconstruction tracking untuk mendukung Indonesian orthopedic oncology network.

---

## 1. Project Initialization

### Docker Environment Setup

**First implementation story should execute:**
```bash
# Clone and setup project structure
git clone <repository> inamsos
cd inamsos

# Setup Docker environment
docker-compose up -d

# Initialize database schema
npm run db:migrate

# Seed musculoskeletal centers and WHO classifications
npm run seed:musculoskeletal

# Create admin user
npm run seed:admin
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://inamsos:password@postgres:5432/inamsos
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
      - /app/node_modules

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: inamsos
      POSTGRES_USER: inamsos
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres-init:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## 2. Technology Stack Details

### Frontend Stack (Next.js 14)
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5.0+
- **Styling:** Tailwind CSS + Custom Medical Green theme
- **UI Components:** Headless UI + Custom medical components
- **State Management:** Zustand + React Query
- **Form Handling:** React Hook Form with Zod validation
- **Charts:** Chart.js with medical visualization plugins
- **Maps:** Leaflet + OpenStreetMap for Indonesia regions
- **Date Handling:** date-fns-tz for Indonesia timezone (WIB/UTC+7)

### Backend Stack (NestJS 10)
- **Framework:** NestJS 10 with TypeScript
- **Database ORM:** Prisma 5.0+
- **Authentication:** JWT + Custom role-based guards
- **Validation:** Class-validator with medical rules
- **Documentation:** Swagger/OpenAPI 3.0
- **File Upload:** Multer with MinIO integration
- **Email:** Nodemailer with SMTP templates
- **Caching:** Redis with ioredis client
- **Logging:** Winston with structured JSON format
- **WHO Classification Integration:** Seeded reference tables for bone and soft tissue tumor classifications

### Database Stack (PostgreSQL 15)
- **Engine:** PostgreSQL 15 with custom extensions
- **Extensions:** PostGIS (geographic), pg_medical (healthcare), pgcrypto (encryption)
- **Schema:** Multi-tenant with schema-per-center approach
- **Backup:** pg_dump with compression and rotation
- **Monitoring:** pg_stat_statements + custom health checks

### Infrastructure Stack
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx with SSL termination
- **File Storage:** MinIO S3-compatible storage
- **Caching Layer:** Redis 7 with persistence
- **Monitoring:** Custom health dashboard + Prometheus metrics
- **Logging:** ELK stack (Elasticsearch, Logstash, Kibana)

---

## 3. Complete Project Structure

```
inamsos/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── README.md
├── docs/
│   ├── architecture.md
│   ├── prd.md
│   ├── epics.md
│   ├── ux-design-specification.md
│   └── api-documentation.md
├── frontend/                          # Next.js Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── public/
│   │   ├── icons/
│   │   └── medical-theme.css
│   ├── src/
│   │   ├── app/                       # Next.js 13+ App Router
│   │   │   ├── (auth)/               # Authentication routes
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/          # Protected routes
│   │   │   │   ├── data-entry/
│   │   │   │   ├── research/
│   │   │   │   ├── analytics/
│   │   │   │   ├── admin/
│   │   │   │   └── layout.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/               # Reusable components
│   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── index.ts
│   │   │   ├── medical/              # Medical-specific components
│   │   │   │   ├── PatientForm.tsx
│   │   │   │   ├── MusculoskeletalTumorData.tsx
│   │   │   │   ├── MedicalImage.tsx
│   │   │   │   ├── MSTSScoreForm.tsx
│   │   │   │   ├── FollowUpTracker.tsx
│   │   │   │   └── QualityIndicator.tsx
│   │   │   ├── charts/               # Data visualization
│   │   │   │   ├── MusculoskeletalTumorMap.tsx
│   │   │   │   ├── TrendChart.tsx
│   │   │   │   └── CenterComparison.tsx
│   │   │   └── layout/               # Layout components
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── Footer.tsx
│   │   ├── lib/                      # Utilities and helpers
│   │   │   ├── api.ts               # API client
│   │   │   ├── auth.ts              # Authentication helpers
│   │   │   ├── validation.ts        # Zod schemas
│   │   │   ├── utils.ts             # General utilities
│   │   │   └── constants.ts         # Application constants
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useOfflineSync.ts
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── patientStore.ts
│   │   │   └── uiStore.ts
│   │   └── types/                    # TypeScript types
│   │       ├── auth.ts
│   │       ├── patient.ts
│   │       ├── musculoskeletal.ts
│   │       ├── research.ts
│   │       └── api.ts
├── backend/                           # NestJS Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/                   # Configuration
│   │   │   ├── database.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── minio.config.ts
│   │   ├── common/                   # Shared utilities
│   │   │   ├── decorators/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── audit.decorator.ts
│   │   │   ├── filters/
│   │   │   │   ├── http-exception.filter.ts
│   │   │   │   └── validation.filter.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── center-access.guard.ts
│   │   │   ├── pipes/
│   │   │   │   ├── validation.pipe.ts
│   │   │   │   └── file-upload.pipe.ts
│   │   │   └── interceptors/
│   │   │       ├── logging.interceptor.ts
│   │   │       └── response.interceptor.ts
│   │   ├── auth/                     # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/                    # User management
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── centers/                  # Center management (21 musculoskeletal centers)
│   │   │   ├── centers.module.ts
│   │   │   ├── centers.controller.ts
│   │   │   ├── centers.service.ts
│   │   │   └── entities/
│   │   │       └── center.entity.ts
│   │   ├── patients/                 # Patient data management (Epic 2)
│   │   │   ├── patients.module.ts
│   │   │   ├── patients.controller.ts
│   │   │   ├── patients.service.ts
│   │   │   ├── quality/              # Quality assurance
│   │   │   │   ├── quality.service.ts
│   │   │   │   └── quality.controller.ts
│   │   │   └── entities/
│   │   │       ├── patient.entity.ts
│   │   │       ├── musculoskeletal-tumor-data.entity.ts
│   │   │       ├── medical-image.entity.ts
│   │   │       ├── follow-up-visit.entity.ts
│   │   │       ├── msts-score.entity.ts
│   │   │       ├── treatment-management.entity.ts
│   │   │       └── cpc-conference.entity.ts
│   │   ├── classifications/          # WHO Classifications
│   │   │   ├── classifications.module.ts
│   │   │   ├── classifications.controller.ts
│   │   │   ├── classifications.service.ts
│   │   │   └── entities/
│   │   │       ├── pathology-type.entity.ts
│   │   │       ├── who-bone-tumor.entity.ts
│   │   │       ├── who-soft-tissue-tumor.entity.ts
│   │   │       ├── bone-location.entity.ts
│   │   │       ├── soft-tissue-location.entity.ts
│   │   │       └── tumor-syndrome.entity.ts
│   │   ├── research/                 # Research access (Epic 3 & 4)
│   │   │   ├── research.module.ts
│   │   │   ├── research.controller.ts
│   │   │   ├── research.service.ts
│   │   │   ├── discovery/            # Data discovery
│   │   │   │   ├── discovery.service.ts
│   │   │   │   └── discovery.controller.ts
│   │   │   ├── requests/             # Data request management
│   │   │   │   ├── requests.service.ts
│   │   │   │   └── requests.controller.ts
│   │   │   └── entities/
│   │   │       ├── research-request.entity.ts
│   │   │       └── data-access.entity.ts
│   │   ├── analytics/                # Intelligence & analytics (Epic 5)
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── dashboards/
│   │   │   │   ├── dashboard.service.ts
│   │   │   │   └── dashboard.controller.ts
│   │   │   ├── reports/
│   │   │   │   ├── report.service.ts
│   │   │   │   └── report.controller.ts
│   │   │   └── entities/
│   │   │       └── analytics-cache.entity.ts
│   │   ├── admin/                    # System administration (Epic 6)
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── system/
│   │   │   │   ├── system.service.ts
│   │   │   │   └── system.controller.ts
│   │   │   ├── monitoring/
│   │   │   │   ├── monitoring.service.ts
│   │   │   │   └── monitoring.controller.ts
│   │   │   └── entities/
│   │   │       ├── system-config.entity.ts
│   │   │       └── audit-log.entity.ts
│   │   └── database/                 # Database management
│   │       ├── migrations/
│   │       ├── seeds/
│   │       │   ├── who-bone-classifications.seed.ts
│   │       │   ├── who-soft-tissue-classifications.seed.ts
│   │       │   ├── bone-locations.seed.ts
│   │       │   ├── soft-tissue-locations.seed.ts
│   │       │   ├── musculoskeletal-centers.seed.ts
│   │       │   └── tumor-syndromes.seed.ts
│   │       └── schemas/
├── postgres-init/                     # Database initialization
│   ├── 01-create-extensions.sql
│   ├── 02-create-database.sql
│   ├── 03-create-schemas.sql
│   ├── 04-create-base-tables.sql
│   ├── 05-create-musculoskeletal-tables.sql
│   └── 06-seed-data.sql
├── nginx/                            # Reverse proxy configuration
│   ├── nginx.conf
│   ├── ssl/
│   │   └── ssl-certificates.conf
│   └── conf.d/
│       ├── frontend.conf
│       └── backend.conf
├── monitoring/                       # Health checks and monitoring
│   ├── health-checks/
│   │   ├── frontend-health.sh
│   │   ├── backend-health.sh
│   │   └── database-health.sh
│   ├── logs/
│   └── metrics/
├── scripts/                          # Utility scripts
│   ├── setup.sh                      # Initial setup
│   ├── backup.sh                     # Database backup
│   ├── deploy.sh                     # Deployment script
│   └── health-monitor.sh             # Health monitoring
├── tests/                           # Integration tests
│   ├── e2e/
│   ├── integration/
│   └── performance/
└── deployment/                      # Deployment configurations
    ├── production/
    ├── staging/
    └── development/
```

---

## 4. Musculoskeletal-Specific Database Schema

### Core Musculoskeletal Tables

```sql
-- Pathology Types
CREATE TABLE pathology_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Bone Tumor, Soft Tissue Tumor, Bone Metastasis, Tumor-like Lesion
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WHO Bone Tumor Classification (WHO Classification of Tumours - Bone)
CREATE TABLE who_bone_tumor_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL, -- e.g., "Osteogenic tumors", "Chondrogenic tumors", "Fibrogenic tumors"
  subcategory VARCHAR(200),
  diagnosis VARCHAR(300) NOT NULL,
  icd_o_3_code VARCHAR(20),
  page_reference VARCHAR(20), -- Reference to WHO book page
  is_malignant BOOLEAN NOT NULL DEFAULT false,
  grading_applicable BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WHO Soft Tissue Tumor Classification (WHO Classification of Tumours - Soft Tissue)
CREATE TABLE who_soft_tissue_tumor_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL, -- e.g., "Adipocytic tumors", "Fibroblastic/myofibroblastic tumors"
  subcategory VARCHAR(200),
  diagnosis VARCHAR(300) NOT NULL,
  icd_o_3_code VARCHAR(20),
  page_reference VARCHAR(20),
  is_malignant BOOLEAN NOT NULL DEFAULT false,
  grading_applicable BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bone Locations (Hierarchical Structure)
CREATE TABLE bone_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES bone_locations(id),
  level INT NOT NULL, -- 1=region, 2=bone, 3=segment/part
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50), -- Upper Extremity, Lower Extremity, Axial Skeleton
  description TEXT,
  display_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT level_check CHECK (level IN (1, 2, 3))
);

CREATE INDEX idx_bone_locations_parent_id ON bone_locations(parent_id);
CREATE INDEX idx_bone_locations_region ON bone_locations(region);

-- Soft Tissue Locations
CREATE TABLE soft_tissue_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES soft_tissue_locations(id),
  anatomical_region VARCHAR(100) NOT NULL, -- Upper extremity, Lower extremity, Trunk, Head/Neck
  specific_location VARCHAR(200) NOT NULL,
  description TEXT,
  display_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_soft_tissue_locations_parent_id ON soft_tissue_locations(parent_id);
CREATE INDEX idx_soft_tissue_locations_region ON soft_tissue_locations(anatomical_region);

-- Tumor Syndromes
CREATE TABLE tumor_syndromes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- Li-Fraumeni, NF1, Ollier, Maffucci, etc.
  description TEXT,
  genetic_marker VARCHAR(100),
  associated_tumors TEXT[], -- Array of commonly associated tumors
  inheritance_pattern VARCHAR(50), -- Autosomal dominant, recessive, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MSTS (Musculoskeletal Tumor Society) Functional Scores
CREATE TABLE msts_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  follow_up_visit_id UUID REFERENCES follow_up_visits(id) ON DELETE SET NULL,
  pain SMALLINT NOT NULL CHECK (pain BETWEEN 0 AND 5),
  function SMALLINT NOT NULL CHECK (function BETWEEN 0 AND 5),
  emotional_acceptance SMALLINT NOT NULL CHECK (emotional_acceptance BETWEEN 0 AND 5),
  supports SMALLINT NOT NULL CHECK (supports BETWEEN 0 AND 5),
  walking SMALLINT NOT NULL CHECK (walking BETWEEN 0 AND 5),
  gait SMALLINT NOT NULL CHECK (gait BETWEEN 0 AND 5),
  total_score SMALLINT GENERATED ALWAYS AS (pain + function + emotional_acceptance + supports + walking + gait) STORED,
  percentage_score DECIMAL(5,2) GENERATED ALWAYS AS ((pain + function + emotional_acceptance + supports + walking + gait) * 100.0 / 30.0) STORED,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_msts_scores_patient_id ON msts_scores(patient_id);
CREATE INDEX idx_msts_scores_visit_id ON msts_scores(follow_up_visit_id);

-- Follow-up Visits (5-year protocol: 14 visits total)
CREATE TABLE follow_up_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_number SMALLINT NOT NULL CHECK (visit_number BETWEEN 1 AND 14),
  scheduled_date DATE NOT NULL,
  actual_date DATE,
  visit_year SMALLINT NOT NULL CHECK (visit_year BETWEEN 1 AND 5),
  visit_interval VARCHAR(20) NOT NULL, -- "3 months", "6 months", "12 months"
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, completed, missed, cancelled
  -- Clinical findings
  recurrence_detected BOOLEAN DEFAULT false,
  recurrence_type VARCHAR(50), -- local, regional, distant
  metastasis_detected BOOLEAN DEFAULT false,
  metastasis_sites TEXT[],
  complications TEXT,
  -- Imaging performed
  xray_performed BOOLEAN DEFAULT false,
  ct_performed BOOLEAN DEFAULT false,
  mri_performed BOOLEAN DEFAULT false,
  bone_scan_performed BOOLEAN DEFAULT false,
  pet_scan_performed BOOLEAN DEFAULT false,
  -- Functional assessment
  msts_score_id UUID REFERENCES msts_scores(id),
  -- Additional notes
  clinician_notes TEXT,
  next_visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, visit_number)
);

CREATE INDEX idx_follow_up_visits_patient_id ON follow_up_visits(patient_id);
CREATE INDEX idx_follow_up_visits_scheduled_date ON follow_up_visits(scheduled_date);
CREATE INDEX idx_follow_up_visits_status ON follow_up_visits(status);

-- Treatment Management (Comprehensive surgical and medical management)
CREATE TABLE treatment_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  treatment_intention VARCHAR(20) NOT NULL, -- Curative, Palliative

  -- Systemic Therapy
  neo_adjuvant_chemo BOOLEAN DEFAULT false,
  neo_adjuvant_chemo_start_date DATE,
  neo_adjuvant_chemo_end_date DATE,
  adjuvant_chemo BOOLEAN DEFAULT false,
  adjuvant_chemo_start_date DATE,
  adjuvant_chemo_end_date DATE,
  chemo_regimen VARCHAR(200),
  chemo_cycles INT,
  chemo_response VARCHAR(50), -- Complete, Partial, Stable, Progressive

  -- Surgical Management
  surgery_performed BOOLEAN DEFAULT false,
  surgery_type VARCHAR(50), -- Limb Salvage, Limb Ablation (Amputation/Disarticulation)
  surgery_date DATE,
  surgical_approach TEXT,
  margin_type VARCHAR(50), -- Wide, Marginal, Intralesional, Radical
  margin_status VARCHAR(20), -- R0 (negative), R1 (microscopic positive), R2 (macroscopic positive)

  -- Limb Salvage Reconstruction
  reconstruction_method VARCHAR(200), -- Endoprosthesis, Allograft, Biological reconstruction, etc.
  endoprosthesis_type VARCHAR(100),
  bone_graft_type VARCHAR(100), -- Autograft, Allograft, Synthetic
  soft_tissue_coverage VARCHAR(100), -- Primary closure, Flap, Graft

  -- Surgical Outcomes
  operative_duration_minutes INT,
  blood_loss_ml INT,
  transfusion_required BOOLEAN DEFAULT false,
  transfusion_units INT,
  complications TEXT,
  complication_grade VARCHAR(20), -- Clavien-Dindo classification

  -- Radiotherapy
  neo_adjuvant_radio BOOLEAN DEFAULT false,
  neo_adjuvant_radio_start_date DATE,
  neo_adjuvant_radio_end_date DATE,
  adjuvant_radio BOOLEAN DEFAULT false,
  adjuvant_radio_start_date DATE,
  adjuvant_radio_end_date DATE,
  radiotherapy_dose_gy DECIMAL(5,2),
  radiotherapy_fractions INT,
  radiotherapy_technique VARCHAR(100), -- IMRT, 3D-CRT, Brachytherapy, etc.

  -- Additional treatments
  targeted_therapy BOOLEAN DEFAULT false,
  targeted_therapy_agent VARCHAR(100),
  immunotherapy BOOLEAN DEFAULT false,
  immunotherapy_agent VARCHAR(100),

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_treatment_management_patient_id ON treatment_management(patient_id);
CREATE INDEX idx_treatment_management_surgery_date ON treatment_management(surgery_date);

-- CPC (Cancer Patient Conference / Multidisciplinary Team Meeting)
CREATE TABLE cpc_conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  cpc_date DATE NOT NULL,
  conference_type VARCHAR(50) DEFAULT 'Preoperative', -- Preoperative, Postoperative, Recurrence, Follow-up
  attending_consultants TEXT[], -- Array of consultant names/specialties
  orthopedic_oncologist TEXT,
  medical_oncologist TEXT,
  radiation_oncologist TEXT,
  pathologist TEXT,
  radiologist TEXT,
  other_specialists TEXT[],

  -- Discussion points
  case_presentation TEXT,
  imaging_review TEXT,
  pathology_review TEXT,

  -- Treatment decision
  treatment_decision TEXT NOT NULL,
  rationale TEXT,
  alternative_options_discussed TEXT,

  -- Follow-up plan
  follow_up_plan TEXT,
  additional_investigations TEXT,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cpc_conferences_patient_id ON cpc_conferences(patient_id);
CREATE INDEX idx_cpc_conferences_date ON cpc_conferences(cpc_date);

-- Extended Patient Table for Musculoskeletal Data
-- Note: This extends the base patients table with musculoskeletal-specific fields
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pathology_type_id UUID REFERENCES pathology_types(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS who_bone_classification_id UUID REFERENCES who_bone_tumor_classifications(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS who_soft_tissue_classification_id UUID REFERENCES who_soft_tissue_tumor_classifications(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS bone_location_id UUID REFERENCES bone_locations(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS soft_tissue_location_id UUID REFERENCES soft_tissue_locations(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tumor_syndrome_id UUID REFERENCES tumor_syndromes(id);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tumor_size_cm DECIMAL(6,2);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tumor_grade VARCHAR(20); -- G1, G2, G3, GX
ALTER TABLE patients ADD COLUMN IF NOT EXISTS enneking_stage VARCHAR(20); -- IA, IB, IIA, IIB, III
ALTER TABLE patients ADD COLUMN IF NOT EXISTS pathologic_fracture BOOLEAN DEFAULT false;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS skip_lesions BOOLEAN DEFAULT false;

-- Update Centers table for 21 Musculoskeletal Centers
-- Add musculoskeletal designation flag
ALTER TABLE centers ADD COLUMN IF NOT EXISTS is_musculoskeletal_center BOOLEAN DEFAULT false;
ALTER TABLE centers ADD COLUMN IF NOT EXISTS accreditation_date DATE;
ALTER TABLE centers ADD COLUMN IF NOT EXISTS center_capabilities TEXT[];
```

### Seed Data for 21 Musculoskeletal Centers

```sql
-- Indonesia's 21 Designated Musculoskeletal Tumor Centers
-- Each center will have schema: center_001, center_002, etc.

INSERT INTO centers (id, name, code, province, city, hospital_name, is_musculoskeletal_center, accreditation_date) VALUES
-- Java Region
(gen_random_uuid(), 'RSCM Jakarta', 'MSK001', 'DKI Jakarta', 'Jakarta Pusat', 'RS Cipto Mangunkusumo', true, '2020-01-15'),
(gen_random_uuid(), 'RS Fatmawati Jakarta', 'MSK002', 'DKI Jakarta', 'Jakarta Selatan', 'RS Fatmawati', true, '2021-03-20'),
(gen_random_uuid(), 'RSHS Bandung', 'MSK003', 'Jawa Barat', 'Bandung', 'RS Hasan Sadikin', true, '2020-05-10'),
(gen_random_uuid(), 'RSUD Dr. Soetomo Surabaya', 'MSK004', 'Jawa Timur', 'Surabaya', 'RSUD Dr. Soetomo', true, '2020-02-28'),
(gen_random_uuid(), 'RSUP Dr. Kariadi Semarang', 'MSK005', 'Jawa Tengah', 'Semarang', 'RSUP Dr. Kariadi', true, '2021-01-15'),
(gen_random_uuid(), 'RSUP Dr. Sardjito Yogyakarta', 'MSK006', 'DI Yogyakarta', 'Yogyakarta', 'RSUP Dr. Sardjito', true, '2020-08-12'),

-- Sumatra Region
(gen_random_uuid(), 'RSUP H. Adam Malik Medan', 'MSK007', 'Sumatera Utara', 'Medan', 'RSUP H. Adam Malik', true, '2021-06-01'),
(gen_random_uuid(), 'RSUP Dr. M. Djamil Padang', 'MSK008', 'Sumatera Barat', 'Padang', 'RSUP Dr. M. Djamil', true, '2021-09-15'),
(gen_random_uuid(), 'RSUP Dr. Mohammad Hoesin Palembang', 'MSK009', 'Sumatera Selatan', 'Palembang', 'RSUP Dr. Mohammad Hoesin', true, '2022-01-10'),

-- Kalimantan Region
(gen_random_uuid(), 'RSUD Ulin Banjarmasin', 'MSK010', 'Kalimantan Selatan', 'Banjarmasin', 'RSUD Ulin', true, '2022-03-20'),
(gen_random_uuid(), 'RSUD Abdul Wahab Sjahranie Samarinda', 'MSK011', 'Kalimantan Timur', 'Samarinda', 'RSUD Abdul Wahab Sjahranie', true, '2022-05-15'),

-- Sulawesi Region
(gen_random_uuid(), 'RSUP Dr. Wahidin Sudirohusodo Makassar', 'MSK012', 'Sulawesi Selatan', 'Makassar', 'RSUP Dr. Wahidin Sudirohusodo', true, '2021-11-01'),
(gen_random_uuid(), 'RSUP Prof. Dr. R. D. Kandou Manado', 'MSK013', 'Sulawesi Utara', 'Manado', 'RSUP Prof. Dr. R. D. Kandou', true, '2022-07-20'),

-- Bali & Nusa Tenggara
(gen_random_uuid(), 'RSUP Sanglah Denpasar', 'MSK014', 'Bali', 'Denpasar', 'RSUP Sanglah', true, '2021-04-15'),
(gen_random_uuid(), 'RSUD Prof. Dr. W. Z. Johannes Kupang', 'MSK015', 'Nusa Tenggara Timur', 'Kupang', 'RSUD Prof. Dr. W. Z. Johannes', true, '2022-09-01'),

-- Maluku & Papua
(gen_random_uuid(), 'RSUD Dr. M. Haulussy Ambon', 'MSK016', 'Maluku', 'Ambon', 'RSUD Dr. M. Haulussy', true, '2022-11-10'),
(gen_random_uuid(), 'RSUD Jayapura', 'MSK017', 'Papua', 'Jayapura', 'RSUD Jayapura', true, '2023-02-01'),

-- Additional Java Centers
(gen_random_uuid(), 'RS Kanker Dharmais Jakarta', 'MSK018', 'DKI Jakarta', 'Jakarta Barat', 'RS Kanker Dharmais', true, '2020-03-15'),
(gen_random_uuid(), 'RS Orthopaedi Prof. Dr. R. Soeharso Surakarta', 'MSK019', 'Jawa Tengah', 'Surakarta', 'RS Orthopaedi Prof. Dr. R. Soeharso', true, '2021-07-20'),
(gen_random_uuid(), 'RSUD Dr. Saiful Anwar Malang', 'MSK020', 'Jawa Timur', 'Malang', 'RSUD Dr. Saiful Anwar', true, '2022-04-05'),
(gen_random_uuid(), 'RS Persahabatan Jakarta', 'MSK021', 'DKI Jakarta', 'Jakarta Timur', 'RS Persahabatan', true, '2021-12-10');
```

---

## 5. Epic to Architecture Mapping

### Epic 1: User Management & Security → `/auth`, `/users`, `/centers`
- **Frontend:** `src/app/(auth)/` routes dengan role-based access
- **Backend:** `auth/`, `users/`, `centers/` modules dengan JWT + role guards
- **Database:** Schema `public` dengan user, center (21 musculoskeletal centers), role tables
- **Integration:** Nginx SSL termination + Redis session storage

### Epic 2: Musculoskeletal Data Entry & Quality Assurance → `/patients` dengan quality workflows
- **Frontend:** Progressive 10-section musculoskeletal tumor form dengan WhatsApp-inspired UX di `src/app/(dashboard)/data-entry/`
  - Section 1: Demographics
  - Section 2: Presentation & Clinical Findings
  - Section 3: Imaging (X-ray, CT, MRI, Bone Scan, PET)
  - Section 4: Biopsy & Pathology (WHO Classification integration)
  - Section 5: Tumor Location (Hierarchical bone/soft tissue selection)
  - Section 6: Staging (Enneking staging system)
  - Section 7: CPC Multidisciplinary Meeting
  - Section 8: Treatment Plan (Surgery/Chemotherapy/Radiotherapy)
  - Section 9: Surgical Details & Reconstruction
  - Section 10: Follow-up Schedule (5-year protocol)
- **Backend:** `patients/` module dengan real-time validation, WHO classification lookup, dan file upload
- **Database:** Schema per-center untuk patient data dengan musculoskeletal-specific tables dan audit trails
- **Integration:** MinIO storage untuk medical imaging + Redis caching

### Epic 3: Research Discovery & Collaboration → `/research/discovery`
- **Frontend:** Interactive maps dan advanced filtering untuk musculoskeletal tumor patterns di `src/app/(dashboard)/research/`
- **Backend:** `research/discovery/` dengan PostGIS geographic queries untuk 21 musculoskeletal centers
- **Database:** Materialized views untuk aggregate bone/soft tissue tumor data + geographic indexing
- **Integration:** Leaflet maps dengan OpenStreetMap Indonesia data

### Epic 4: Research Request Management → `/research/requests`
- **Frontend:** Request workflows dengan approval tracking
- **Backend:** `research/requests/` dengan notification system
- **Database:** Request tables dengan status tracking dan compliance validation
- **Integration:** Email notifications dengan Nodemailer templates

### Epic 5: Musculoskeletal Tumor Analytics & Intelligence → `/analytics`
- **Frontend:** Real-time dashboards dengan Chart.js visualization untuk:
  - Bone vs Soft Tissue tumor distribution
  - WHO classification trending
  - Surgical reconstruction outcomes
  - 5-year survival analysis
  - MSTS functional score tracking
  - Geographic distribution across 21 centers
- **Backend:** `analytics/` module dengan Redis caching layers untuk musculoskeletal-specific metrics
- **Database:** Materialized views dengan auto-refresh strategies untuk tumor pattern analysis
- **Integration:** WebSocket untuk real-time updates + Chart.js rendering

### Epic 6: Reporting & System Administration → `/admin`
- **Frontend:** Administrative interfaces dengan bulk operations untuk 21 musculoskeletal centers
- **Backend:** `admin/` module dengan system monitoring capabilities
- **Database:** Audit tables dengan immutable logging
- **Integration:** ELK stack untuk comprehensive logging + Prometheus metrics

---

## 6. Musculoskeletal API Endpoints

### Core Musculoskeletal Endpoints
```
POST   /api/v1/patients/musculoskeletal        # Create musculoskeletal tumor patient
GET    /api/v1/patients/musculoskeletal/:id    # Get patient with full musculoskeletal data
PUT    /api/v1/patients/musculoskeletal/:id    # Update musculoskeletal patient data
DELETE /api/v1/patients/musculoskeletal/:id    # Delete patient record

# WHO Classifications
GET    /api/v1/classifications/bone-tumors              # Get all WHO bone tumor classifications
GET    /api/v1/classifications/bone-tumors/search       # Search bone tumors by keyword
GET    /api/v1/classifications/soft-tissue-tumors       # Get all WHO soft tissue classifications
GET    /api/v1/classifications/soft-tissue-tumors/search # Search soft tissue tumors

# Anatomical Locations
GET    /api/v1/locations/bone                  # Get hierarchical bone location tree
GET    /api/v1/locations/bone/:id/children     # Get child locations for specific bone
GET    /api/v1/locations/soft-tissue           # Get soft tissue locations
GET    /api/v1/locations/soft-tissue/search    # Search soft tissue locations

# Pathology Types
GET    /api/v1/pathology-types                 # Get all pathology types

# Tumor Syndromes
GET    /api/v1/tumor-syndromes                 # Get all tumor syndromes
GET    /api/v1/tumor-syndromes/:id             # Get specific syndrome details

# Follow-up Management
POST   /api/v1/follow-ups                      # Create follow-up visit record
GET    /api/v1/follow-ups/patient/:patientId   # Get all follow-ups for patient
GET    /api/v1/follow-ups/:id                  # Get specific follow-up visit
PUT    /api/v1/follow-ups/:id                  # Update follow-up visit
GET    /api/v1/follow-ups/upcoming             # Get upcoming scheduled visits (center-wide)
GET    /api/v1/follow-ups/overdue              # Get overdue follow-ups

# MSTS Functional Scoring
POST   /api/v1/scores/msts                     # Create MSTS score
GET    /api/v1/scores/msts/patient/:patientId  # Get all MSTS scores for patient
GET    /api/v1/scores/msts/:id                 # Get specific MSTS score
PUT    /api/v1/scores/msts/:id                 # Update MSTS score
GET    /api/v1/scores/msts/trends/:patientId   # Get functional score trends over time

# Treatment Management
POST   /api/v1/treatment-management            # Create treatment plan
GET    /api/v1/treatment-management/patient/:patientId  # Get treatment for patient
PUT    /api/v1/treatment-management/:id        # Update treatment details
GET    /api/v1/treatment-management/outcomes   # Get treatment outcome statistics

# CPC (Multidisciplinary Conferences)
POST   /api/v1/cpc                             # Create CPC record
GET    /api/v1/cpc/patient/:patientId          # Get all CPCs for patient
GET    /api/v1/cpc/:id                         # Get specific CPC record
PUT    /api/v1/cpc/:id                         # Update CPC record
GET    /api/v1/cpc/upcoming                    # Get upcoming scheduled CPCs

# Analytics (Musculoskeletal-specific)
GET    /api/v1/analytics/bone-vs-soft-tissue   # Distribution analysis
GET    /api/v1/analytics/who-classification-trends  # Trending diagnoses
GET    /api/v1/analytics/surgical-outcomes     # Reconstruction outcomes
GET    /api/v1/analytics/survival-analysis     # 5-year survival data
GET    /api/v1/analytics/geographic-distribution  # Tumor distribution across 21 centers
GET    /api/v1/analytics/msts-score-analysis   # Functional outcome analysis

# Musculoskeletal Centers
GET    /api/v1/centers/musculoskeletal         # Get all 21 designated centers
GET    /api/v1/centers/musculoskeletal/:id     # Get specific center details
GET    /api/v1/centers/musculoskeletal/:id/statistics  # Get center statistics
```

---

## 7. Integration Points

### API Gateway (Nginx)
- **Frontend Routes:** `http://localhost/` → Next.js frontend
- **Backend API:** `http://localhost/api/` → NestJS backend
- **Health Checks:** `/health` endpoint untuk service monitoring
- **SSL Termination:** HTTPS dengan custom certificates

### Database Integration
- **Multi-tenant Schema:** Schema per-center untuk 21 musculoskeletal centers dengan shared analytics schema
- **Connection Pooling:** Prisma connection management dengan Redis cache
- **Backup Strategy:** Automated daily backups dengan retention policies

### File Storage Integration
- **Medical Images:** MinIO S3-compatible storage dengan medical metadata
- **Document Upload:** Secure file upload dengan virus scanning
- **CDN Integration:** Nginx static file serving dengan caching

### Real-time Communication
- **WebSocket Events:** Server-sent updates untuk dashboard notifications
- **Cache Invalidation:** Redis pub/sub untuk cache management
- **Background Jobs:** Queue system untuk heavy processing tasks (follow-up reminders, analytics refresh)

---

## 8. Security Architecture

### Authentication & Authorization
```typescript
// JWT Token structure for musculoskeletal registry
interface JWTPayload {
  userId: string;
  centerId: string;
  role: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder' | 'orthopedic_surgeon';
  permissions: string[];
  centerAccess?: string[]; // For multi-center access
  specialization?: string; // orthopedic_oncology, medical_oncology, pathology, etc.
}

// Role-based access control
@Roles('admin', 'national_stakeholder')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('/centers/musculoskeletal')
async createMusculoskeletalCenter(@Body() createCenterDto: CreateCenterDto) {
  return this.centersService.create(createCenterDto);
}
```

### Data Encryption Strategy
- **At Rest:** PostgreSQL encryption dengan custom keys
- **In Transit:** TLS 1.3 untuk semua communications
- **Application Level:** Sensitive fields encrypted dengan AES-256
- **Key Management:** Environment-based key rotation policies

### HIPAA Compliance Framework
- **Audit Trails:** Semua data access tercatat dengan user, timestamp, action
- **Access Control:** Minimum privilege principle dengan role-based permissions
- **Data Retention:** Automated archival dengan configurable retention periods
- **Business Associate:** Custom BAAs untuk internal deployments

### Multi-Tenant Data Isolation
```sql
-- Schema per-center approach for 21 musculoskeletal centers
CREATE SCHEMA center_msk001 AUTHORIZATION center_msk001_user;
CREATE SCHEMA center_msk002 AUTHORIZATION center_msk002_user;
-- ... (all 21 centers)

-- Row Level Security untuk shared tables
CREATE POLICY center_isolation ON patient_records
  FOR ALL TO center_users
  USING (center_id = current_setting('app.current_center_id')::UUID);
```

---

## 9. Performance Considerations

### Database Optimization
- **Indexing Strategy:** Composite indexes untuk common query patterns (WHO classification lookups, bone location searches, follow-up scheduling)
- **Materialized Views:** Pre-computed aggregates untuk musculoskeletal tumor analytics
- **Connection Pooling:** Prisma dengan optimized connection limits
- **Query Optimization:** EXPLAIN ANALYZE monitoring untuk slow queries

### Caching Strategy
- **Redis Caching:** Hot data caching (WHO classifications, bone locations) dengan TTL-based invalidation
- **Browser Caching:** Static asset optimization dengan cache headers
- **CDN Ready:** Asset optimization untuk future CDN integration
- **Application Caching:** React Query dengan stale-while-revalidate

### Performance Monitoring
- **Response Time Monitoring:** Custom middleware dengan alert thresholds
- **Database Performance:** pg_stat_statements dengan query analysis
- **Resource Utilization:** Container health monitoring dengan alerting
- **User Experience:** Frontend performance metrics dengan Core Web Vitals

---

## 10. Deployment Architecture

### Local Docker Deployment
```yaml
# Development environment
docker-compose -f docker-compose.yml up -d

# Production environment with optimizations
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Production Optimizations
- **Multi-stage Docker builds:** Optimized image sizes
- **Health Checks:** Custom health check endpoints
- **Resource Limits:** CPU dan memory limits per container
- **Log Rotation:** Automated log management dengan retention
- **Backup Automation:** Scheduled database backup dengan cloud storage

### Monitoring & Observability
- **Health Check Endpoints:** `/health`, `/ready`, `/live` endpoints
- **Structured Logging:** JSON logs dengan correlation IDs
- **Metrics Collection:** Custom metrics dengan Prometheus compatibility
- **Alert Management:** Email/SMS alerts untuk critical failures

---

## 11. Development Environment Setup

### Prerequisites
```bash
# Required tools
- Docker & Docker Compose
- Node.js 18+
- Git
- VS Code (recommended)
```

### Development Workflow
```bash
# 1. Clone repository
git clone <repository> inamsos
cd inamsos

# 2. Setup environment
cp .env.example .env
# Edit .env with local configuration

# 3. Start development environment
docker-compose up -d

# 4. Install dependencies (first time)
docker-compose exec frontend npm install
docker-compose exec backend npm install

# 5. Run database migrations
docker-compose exec backend npm run migration:run

# 6. Seed musculoskeletal data (WHO classifications, 21 centers, locations)
docker-compose exec backend npm run seed:musculoskeletal

# 7. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# MinIO Console: http://localhost:9001
```

### Development Tools
- **Hot Reloading:** Both frontend dan backend dengan volume mounts
- **Database Studio:** pgAdmin integration untuk database management
- **API Documentation:** Swagger UI otomatis di development
- **Testing Environment:** Jest test suites dengan container isolation

---

## 12. Architecture Decision Records

### ADR-001: Docker-based Local Deployment
**Decision:** Menggunakan Docker Compose untuk deployment lokal
**Rationale:** Data sovereignty untuk compliance Indonesia, cost control, full custom control
**Consequences:** Additional DevOps complexity, but full control over infrastructure

### ADR-002: Multi-tenant Schema per Center
**Decision:** PostgreSQL schema per-center untuk data isolation (21 musculoskeletal centers)
**Rationale:** Better security boundaries, simplified backup/restore, clear data ownership
**Consequences:** Increased schema management complexity, but superior isolation

### ADR-003: Next.js + NestJS Technology Stack
**Decision:** Frontend Next.js, backend NestJS dengan PostgreSQL
**Rationale:** TypeScript consistency, strong ecosystem, good healthcare community
**Consequences:** Learning curve jika team tidak familiar dengan stack

### ADR-004: MinIO untuk File Storage
**Decision:** Self-hosted S3-compatible storage dengan MinIO
**Rationale:** Local control atas medical images, no external dependencies, cost-effective
**Consequences:** Self-managed infrastructure dan maintenance responsibility

### ADR-005: Materialized Views untuk Analytics
**Decision:** PostgreSQL materialized views dengan auto-refresh untuk real-time analytics
**Rationale:** Optimal performance untuk Indonesia-scale deployment (21 centers), minimal complexity
**Consequences:** Data freshness latency (5-15 minutes), but acceptable untuk healthcare analytics

### ADR-006: WHO Classification Integration
**Decision:** Seeded database tables untuk WHO Bone and Soft Tissue Tumor Classifications
**Rationale:** Standardized nomenclature, ICD-O-3 code consistency, international comparability
**Consequences:** Initial seeding complexity, but ensures diagnostic consistency across all 21 centers

### ADR-007: 5-Year Follow-up Protocol Implementation
**Decision:** Structured 14-visit follow-up system dengan automated scheduling
**Rationale:** Evidence-based surveillance for recurrence detection, standardized across network
**Consequences:** Requires disciplined visit tracking, but improves patient outcomes and data completeness

---

## 13. Testing Strategy

### Unit Testing
- **Frontend:** Jest + React Testing Library untuk component testing
- **Backend:** Jest dengan database mocking untuk service testing
- **Coverage Target:** >80% untuk critical business logic (WHO classification lookups, follow-up scheduling, MSTS scoring)

### Integration Testing
- **API Testing:** Supertest untuk endpoint validation
- **Database Testing:** Test containers dengan isolated test databases
- **E2E Testing:** Playwright untuk critical user journeys (10-section musculoskeletal form submission)

### Performance Testing
- **Load Testing:** K6 untuk API performance validation (21 centers concurrent access)
- **Database Performance:** pgbench untuk query optimization
- **Frontend Performance:** Lighthouse CI untuk Core Web Vitals

### Security Testing
- **OWASP ZAP:** Automated security scanning
- **Penetration Testing:** Manual security assessment
- **Dependency Scanning:** npm audit untuk vulnerability detection

---

## 14. Disaster Recovery & Business Continuity

### Backup Strategy
- **Database Backup:** Daily automated backups dengan 30-day retention
- **File Storage Backup:** Incremental backup untuk medical images
- **Configuration Backup:** Git-based configuration management
- **Recovery Testing:** Monthly recovery drill validation

### High Availability
- **Database Streaming:** Read replicas untuk query distribution
- **Load Balancing:** Nginx upstream configuration
- **Health Monitoring:** Automated failover untuk critical services
- **Data Replication:** Geographic distribution untuk disaster recovery

### Incident Response
- **Monitoring Alerts:** Real-time alerting untuk critical failures
- **Communication Plan:** Stakeholder notification procedures (21 centers)
- **Rollback Strategy:** Automated rollback capabilities
- **Documentation:** Incident reports dengan lessons learned

---

## 15. Novel Pattern Designs

### Pattern 1: WhatsApp-Inspired Musculoskeletal Data Entry Flow
**Purpose:** Reduces cognitive load untuk orthopedic surgeons dengan familiar interaction patterns untuk 10-section musculoskeletal form
**Components:**
- **StatusFlow Component:** Real-time indicators (✓✓✓) untuk completion tracking across 10 sections
- **ProgressiveForm Component:** Two-layer data capture (quick demographics + detailed tumor data)
- **MediaPriority Component:** Image upload dengan auto-categorization (X-ray, CT, MRI, Bone Scan, PET, Histology)
- **DraftAutoSave Service:** Prevent data loss dengan background persistence
- **WHOClassificationLookup Component:** Autocomplete search untuk WHO bone/soft tissue classifications
- **AnatomicalLocationPicker Component:** Hierarchical bone location selector dengan visual anatomy reference
**Affects Epics:** Epic 2 (Musculoskeletal Data Entry & Quality Assurance)
**Implementation Guide:**
```typescript
// WhatsApp status flow implementation for musculoskeletal form
const MusculoskeletalDataEntryStatus = {
  DRAFT: { icon: '✈️', color: 'gray', text: 'Sedang diedit' },
  VALIDATING: { icon: '⏳', color: 'yellow', text: 'Dalam validasi' },
  COMPLETE: { icon: '✅', color: 'green', text: 'Tervalidasi' },
  NEEDS_REVIEW: { icon: '⚠️', color: 'orange', text: 'Perlu review multidisciplinary' }
};

// Progressive disclosure form pattern - 10 sections
const MusculoskeletalPatientDataCapture = {
  section1_demographics: ['patientName', 'idNumber', 'dateOfBirth', 'gender'],
  section2_presentation: ['chiefComplaint', 'symptomDuration', 'painScore', 'pathologicFracture'],
  section3_imaging: ['xray', 'ct', 'mri', 'boneScan', 'petScan'],
  section4_pathology: ['biopsyDate', 'whoDiagnosis', 'icdO3Code', 'grade'],
  section5_location: ['pathologyType', 'boneLocation', 'softTissueLocation', 'tumorSize'],
  section6_staging: ['ennekingStage', 'tnmStage', 'metastaticSites'],
  section7_cpc: ['cpcDate', 'attendingConsultants', 'treatmentDecision'],
  section8_treatment: ['treatmentIntention', 'neoadjuvantChemo', 'surgeryType', 'adjuvantTherapy'],
  section9_surgical: ['surgeryDate', 'marginType', 'reconstructionMethod', 'complications'],
  section10_followup: ['followUpSchedule', 'baselineMSTSScore']
};

// WHO Classification autocomplete
interface WHOClassificationLookup {
  searchBoneTumor(keyword: string): Promise<WHOBoneTumorClassification[]>;
  searchSoftTissueTumor(keyword: string): Promise<WHOSoftTissueTumorClassification[]>;
  getICD_O3_Code(diagnosisId: string): Promise<string>;
}
```

### Pattern 2: Multi-Tenant Geographic Musculoskeletal Tumor Intelligence
**Purpose:** Real-time nationwide musculoskeletal tumor pattern detection dengan center-level data isolation untuk 21 designated centers
**Components:**
- **SchemaDiscovery Service:** Dynamic tenant schema detection untuk 21 musculoskeletal centers
- **MusculoskeletalAggregationEngine:** Multi-level data aggregation dengan privacy thresholds untuk bone vs soft tissue tumors
- **GeographicProcessor:** PostGIS spatial queries untuk Indonesia provinces dengan 21-center overlay
- **WHOClassificationAnalyzer:** Trending diagnosis analysis berdasarkan WHO classification categories
- **SurvivalAnalysisEngine:** 5-year survival computation dengan follow-up data integration
- **IntelligenceCache:** Redis-based caching layer untuk real-time musculoskeletal dashboard
**Affects Epics:** Epic 3 (Research Discovery) & Epic 5 (Musculoskeletal Analytics)
**Implementation Guide:**
```sql
-- Dynamic schema union untuk nationwide musculoskeletal analytics
CREATE OR REPLACE FUNCTION aggregate_musculoskeletal_data()
RETURNS TABLE (
  center_id UUID,
  province_id UUID,
  pathology_type VARCHAR,
  bone_tumor_count BIGINT,
  soft_tissue_tumor_count BIGINT,
  limb_salvage_rate DECIMAL,
  average_msts_score DECIMAL,
  five_year_survival_rate DECIMAL
) AS $$
DECLARE
  center_schema RECORD;
BEGIN
  FOR center_schema IN
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name LIKE 'center_msk%'
  LOOP
    RETURN QUERY EXECUTE format(
      'SELECT
        center_id,
        province_id,
        pathology_type,
        COUNT(*) FILTER (WHERE pathology_type = ''Bone Tumor''),
        COUNT(*) FILTER (WHERE pathology_type = ''Soft Tissue Tumor''),
        AVG(CASE WHEN surgery_type = ''Limb Salvage'' THEN 1.0 ELSE 0.0 END),
        AVG(latest_msts_percentage),
        survival_analysis(diagnosis_date, last_contact_date, status)
       FROM %I.patients p
       LEFT JOIN %I.treatment_management tm ON p.id = tm.patient_id
       LEFT JOIN %I.msts_scores ms ON p.id = ms.patient_id
       GROUP BY center_id, province_id, pathology_type',
      center_schema.schema_name,
      center_schema.schema_name,
      center_schema.schema_name
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Pattern 3: Automated HIPAA Compliance Framework for Musculoskeletal Research
**Purpose:** Ensure research data access compliance dengan minimal manual oversight untuk sensitive orthopedic oncology data
**Components:**
- **ConsentTracker:** Patient consent level validation untuk setiap data request
- **MusculoskeletalDataAnonymizer:** Dynamic redaction berdasarkan approval level dan sensitivity (preserve tumor characteristics, remove identifiers)
- **ComplianceValidator:** Automated checking against privacy regulations
- **AuditLogger:** Immutable logging untuk compliance reporting
- **ImageDeidenfitication:** DICOM tag removal untuk shared medical imaging
**Affects Epics:** Epic 1 (User Management), Epic 4 (Research Requests), Epic 6 (System Administration)
**Implementation Guide:**
```typescript
// Automated compliance checking for musculoskeletal research
interface MusculoskeletalComplianceEngine {
  validateRequest(request: ResearchRequest): Promise<ComplianceResult>;
  generateDataPackage(approvedRequest: ApprovedRequest): Promise<AnonymizedDataset>;
  trackAccess(userId: string, dataPackageId: string): Promise<void>;
  anonymizeDICOM(imageId: string): Promise<DeidenfitiedImage>;
}

// Dynamic anonymization based on approval level
const MusculoskeletalAnonymizationLevels = {
  AGGREGATE: {
    minGroupSize: 11, // HIPAA safe harbor
    fieldsToRemove: ['patientId', 'exactBirthdate', 'address', 'medicalRecordNumber'],
    fieldsToPreserve: ['whoClassification', 'boneLocation', 'tumorSize', 'surgeryType', 'mstsScore'],
    allowedAggregations: ['count', 'median', 'percentile', 'survivalRate']
  },
  PSEUDO_ANONYMIZED: {
    minGroupSize: 5,
    fieldsToRemove: ['patientId', 'contactInfo', 'medicalRecordNumber'],
    fieldsToPreserve: ['ageGroup', 'gender', 'whoClassification', 'completePathologyData', 'imagingFindings'],
    allowedAggregations: ['all aggregates', 'correlation', 'regressionAnalysis']
  },
  FULL_ACCESS: {
    requiresEthics: true,
    requiresIRB: true,
    auditFrequency: 'monthly',
    dataRetention: '3 years'
  }
};
```

---

## 16. Implementation Patterns (Agent Consistency Rules)

### Naming Patterns
**Database Naming:**
- **Tables:** snake_case plural (`musculoskeletal_patients`, `who_bone_tumor_classifications`, `msts_scores`, `follow_up_visits`)
- **Columns:** snake_case (`patient_id`, `created_at`, `who_classification_id`, `bone_location_id`)
- **Foreign Keys:** `<table>_id` (`patient_id`, `center_id`, `who_bone_classification_id`)
- **Indexes:** `idx_<table>_<columns>` (`idx_follow_up_visits_scheduled_date`, `idx_msts_scores_patient_id`)

**API Endpoint Naming:**
- **REST Endpoints:** `/api/v1/{resource}` (plural resource names)
- **Nested Resources:** `/api/v1/centers/musculoskeletal/{centerId}/patients`
- **Action Endpoints:** `/api/v1/patients/{id}/calculate-msts-score`

**Frontend Component Naming:**
- **Components:** PascalCase (`MusculoskeletalPatientForm`, `WHOClassificationPicker`, `MSTSScoreCalculator`, `FollowUpScheduler`)
- **Files:** kebab-case (`musculoskeletal-patient-form.tsx`, `who-classification-picker.tsx`)
- **Hooks:** camelCase dengan `use` prefix (`useMusculoskeletalPatientData`, `useWHOClassification`, `useMSTSScore`)

**File Organization:**
- **By Feature:** `/patients/`, `/classifications/`, `/follow-ups/`, `/analytics/`
- **Tests:** Co-located dengan `*.test.ts` atau `*.spec.ts`
- **Types:** `types/` subdirectory dalam setiap feature
- **Constants:** `constants/` root directory untuk shared constants (WHO classifications, bone locations)

### Structure Patterns
**Project Structure:**
- **Feature-based Organization:** Group by business capability (musculoskeletal-specific grouping)
- **Shared Code:** `common/` atau `shared/` directory untuk reusable components
- **Configuration:** Centralized di root dengan environment-specific files
- **Documentation:** `docs/` directory dengan comprehensive API documentation

**Database Schema Organization:**
- **Schema per Center:** `center_msk001`, `center_msk002`, ... `center_msk021` (21 musculoskeletal centers)
- **Shared Analytics Schema:** `analytics` untuk aggregated musculoskeletal tumor data
- **System Schema:** `system` untuk users, centers, configurations
- **Audit Schema:** `audit` untuk compliance logging

### Format Patterns
**API Response Format:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
  meta?: {
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
```

**Error Response Format:**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // INTERNAL_ERROR, VALIDATION_ERROR, AUTH_ERROR, WHO_CLASSIFICATION_NOT_FOUND
    message: string;        // User-friendly message
    field?: string;         // For validation errors
    details?: any;          // Additional context
    timestamp: string;      // ISO 8601 format
    requestId: string;      // For debugging
  };
}
```

**Date/Time Format:**
- **Database Storage:** UTC timestamps dengan `TIMESTAMP WITH TIME ZONE`
- **API Response:** ISO 8601 strings (`2025-12-11T10:30:00Z`)
- **Frontend Display:** Indonesia timezone (WIB/UTC+7) dengan `date-fns-tz`

### Communication Patterns
**Database Connection Patterns:**
- **Connection Pooling:** Prisma dengan optimized pool size untuk 21 concurrent centers
- **Transaction Management:** Explicit transactions untuk data consistency (especially follow-up scheduling)
- **Retry Logic:** Exponential backoff untuk connection failures
- **Health Checks:** Connection validation dengan periodic pings

**Cache Strategy:**
- **Redis Key Naming:** `app:module:entity:id` (e.g., `app:who:bone:123`, `app:msts:patient:456`)
- **Cache Invalidation:** Cache tags untuk related cache invalidation
- **TTL Policies:** Long TTL untuk reference data (WHO classifications, bone locations), short TTL untuk patient data
- **Cache Warming:** Background jobs untuk pre-computed aggregates (21 center statistics)

**API Communication:**
- **Request Correlation:** `X-Request-ID` header untuk distributed tracing
- **Rate Limiting:** User-based dan IP-based rate limiting
- **Response Compression:** Gzip compression untuk API responses
- **Version Strategy:** URL versioning (`/api/v1/`, `/api/v2/`)

### Lifecycle Patterns
**Loading States:**
```typescript
interface LoadingState {
  isLoading: boolean;
  isInitialLoad: boolean;
  isRefreshing: boolean;
  error?: string;
}
```

**Error Recovery:**
- **Retry Mechanism:** Automatic retry dengan exponential backoff
- **Error Boundaries:** React error boundaries untuk graceful degradation
- **Fallback UI:** Skeleton screens dan placeholder content
- **User Feedback:** Clear error messages dengan recovery options

**Data Synchronization:**
- **Offline First:** Service worker untuk offline data entry (important for remote musculoskeletal centers)
- **Sync Queue:** Background synchronization dengan conflict resolution
- **Conflict Resolution:** Last-write-wins dengan manual override options
- **Optimistic Updates:** Immediate UI updates dengan rollback on failure

### Location Patterns
**API Route Structure:**
```
/api/v1/
├── auth/                    # Authentication endpoints
│   ├── login
│   ├── logout
│   └── refresh
├── users/                   # User management
├── centers/                 # Center management
│   └── musculoskeletal/    # 21 musculoskeletal centers
├── patients/                # Patient data (Epic 2)
│   ├── musculoskeletal/    # Musculoskeletal tumor patients
│   ├── {id}/validate        # Quality validation
│   ├── {id}/images          # Medical imaging
│   └── {id}/audit           # Change history
├── classifications/         # WHO Classifications
│   ├── bone-tumors/        # WHO bone tumor classifications
│   ├── soft-tissue-tumors/ # WHO soft tissue classifications
│   └── search              # Classification search
├── locations/              # Anatomical locations
│   ├── bone/               # Hierarchical bone locations
│   └── soft-tissue/        # Soft tissue locations
├── follow-ups/             # 5-year follow-up protocol
│   ├── patient/{id}        # Patient follow-ups
│   ├── upcoming            # Upcoming visits
│   └── overdue             # Missed appointments
├── scores/                 # Functional scoring
│   └── msts/               # MSTS scores
├── treatment-management/   # Treatment tracking
├── cpc/                    # Multidisciplinary conferences
├── research/               # Research access (Epic 3 & 4)
│   ├── discovery/          # Data browsing
│   ├── requests/           # Access requests
│   └── collaborations/     # Expert matching
├── analytics/              # Intelligence (Epic 5)
│   ├── bone-vs-soft-tissue/
│   ├── surgical-outcomes/
│   ├── survival-analysis/
│   └── geographic-distribution/
└── admin/                  # System admin (Epic 6)
    ├── system/             # Configuration
    ├── monitoring/         # Health checks
    └── backup/             # Data management
```

**Static Asset Organization:**
```
/public/
├── icons/                   # Medical icons and symbols
│   ├── bone-anatomy/       # Bone location icons
│   └── tumor-types/        # Tumor classification icons
├── images/                  # Static images
├── documents/              # Templates and forms
│   └── who-reference/      # WHO classification PDFs
└── medical-theme/          # Custom CSS theme files
```

**Configuration File Locations:**
```
/config/
├── database.yml            # Database configurations
├── redis.yml               # Cache configurations
├── minio.yml               # File storage configs
├── auth.yml                # Authentication settings
├── logging.yml             # Log configurations
└── musculoskeletal.yml     # Musculoskeletal-specific configs (21 centers, WHO classifications)
```

### Consistency Patterns
**User-Facing Messages:**
- **Success:** Konfirmasi dengan clear next steps ("Data pasien tumor muskuloskeletal berhasil disimpan. Lanjut ke jadwal follow-up?")
- **Errors:** Actionable error messages dengan recovery options ("Klasifikasi WHO tidak ditemukan. Pilih dari daftar atau hubungi admin.")
- **Warnings:** Informative warnings tanpa blocking actions ("Data lengkap, tapi skor MSTS belum diisi. Rekomendasikan pengisian pada kunjungan follow-up.")

**Logging Format:**
```typescript
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  userId?: string;
  centerId?: string; // One of 21 musculoskeletal centers
  action: string;
  resource?: string;
  message: string;
  metadata?: Record<string, any>;
  requestId: string;
}
```

**Date Display Format:**
- **Short Display:** `11/12/2025` (DD/MM/YYYY)
- **Full Display:** `11 Desember 2025, 14:30 WIB`
- **International:** `2025-12-11T07:30:00Z` (UTC untuk API)
- **Input Format:** Flexible parsing dengan user-friendly hints

**Implementation Enforcement:**
- **Linting Rules:** ESLint untuk naming conventions
- **TypeScript:** Strict mode untuk type consistency
- **Code Reviews:** Checklist untuk pattern compliance
- **Automated Testing:** CI/CD validation untuk architectural rules

---

## 17. Consistency Rules Summary

**Critical Rules yang HARUS diikuti semua AI agents:**

1. **Naming Convention:** Semua entities menggunakan established patterns (snake_case DB, PascalCase components, camelCase variables)
2. **API Response:** Standardized ApiResponse format untuk semua endpoints
3. **Error Handling:** Structured error responses dengan actionable messages
4. **Date/Time:** UTC storage, Indonesia timezone display, ISO 8601 API format
5. **Authentication:** JWT tokens dengan role-based guards untuk semua protected routes
6. **Database Transactions:** Explicit transactions untuk multi-table operations (especially patient + follow-up + treatment)
7. **Audit Logging:** Comprehensive logging untuk semua data access dan modifications
8. **File Naming:** Consistent kebab-case file names dengan descriptive musculoskeletal-specific names
9. **Component Organization:** Feature-based structure dengan clear boundaries (musculoskeletal-focused modules)
10. **Cache Strategy:** Redis dengan established key naming dan TTL policies (long TTL for WHO classifications)
11. **Musculoskeletal Specificity:** Always use WHO classification IDs, hierarchical bone locations, and structured follow-up scheduling
12. **21 Centers:** All queries must respect center isolation untuk 21 designated musculoskeletal centers

**Enforcement Mechanism:**
- **Automated Linting:** Pre-commit hooks untuk naming consistency
- **TypeScript Strict Mode:** Compile-time validation
- **Integration Tests:** API contract testing untuk response formats
- **Database Constraints:** Check constraints untuk data integrity (MSTS score ranges, follow-up visit numbers)
- **Security Scanning:** Automated vulnerability detection

---

## Conclusion

Arsitektur INAMSOS Indonesian Musculoskeletal Tumor Registry ini menyediakan foundation yang solid untuk specialized orthopedic oncology database dengan focus pada:

1. **Data Sovereignty:** Local deployment dengan full control atas infrastructure
2. **Healthcare Compliance:** HIPAA-level security dengan audit trails
3. **Scalability:** Docker-based deployment yang dapat diskalakan untuk 21 designated musculoskeletal tumor centers
4. **Clinical Relevance:** WHO Classification integration, 5-year follow-up protocol (14 visits), MSTS functional scoring
5. **Orthopedic Oncology Focus:** Specialized bone and soft tissue tumor tracking dengan comprehensive surgical reconstruction management
6. **Performance:** Optimized untuk real-time analytics dan geographic visualization across Indonesia
7. **Maintainability:** Clean architecture dengan clear separation of concerns
8. **Developer Experience:** Modern development tools dengan TypeScript consistency
9. **Agent Consistency:** Comprehensive patterns untuk prevent AI agent conflicts dengan musculoskeletal-specific rules
10. **Novel Patterns:** WhatsApp-inspired UX untuk 10-section form, intelligent geographic aggregation untuk 21 centers, automated compliance framework

Arsitektur ini siap untuk implementasi dengan foundation yang kuat untuk pertumbuhan jangka panjang sistem INAMSOS Indonesian Musculoskeletal Tumor Registry di Indonesia, supporting the national network of orthopedic oncology centers untuk improved patient outcomes dan collaborative research.
