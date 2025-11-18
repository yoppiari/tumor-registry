# Arsitektur INAMSOS - Database Tumor Nasional

**Date:** 2025-11-17
**Author:** Yoppi
**Version:** 1.0
**Deployment:** Docker-based Local Infrastructure

---

## Executive Summary

INAMSOS akan menggunakan arsitektur container-based dengan Next.js + NestJS + PostgreSQL untuk menyediakan database tumor nasional yang scalable, secure, dan compliant dengan regulasi healthcare Indonesia. Arsitektur dirancang untuk deployment lokal dengan Docker, memastikan kedaulatan data tetap di Indonesia dengan performa optimal untuk 95+ centers.

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
│   │   │   │   ├── TumorData.tsx
│   │   │   │   ├── MedicalImage.tsx
│   │   │   │   └── QualityIndicator.tsx
│   │   │   ├── charts/               # Data visualization
│   │   │   │   ├── CancerMap.tsx
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
│   │   ├── centers/                  # Center management
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
│   │   │       ├── tumor-data.entity.ts
│   │   │       └── medical-image.entity.ts
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
│   │       └── schemas/
├── postgres-init/                     # Database initialization
│   ├── 01-create-extensions.sql
│   ├── 02-create-database.sql
│   ├── 03-create-schemas.sql
│   ├── 04-create-base-tables.sql
│   └── 05-seed-data.sql
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

## 4. Epic to Architecture Mapping

### Epic 1: User Management & Security → `/auth`, `/users`, `/centers`
- **Frontend:** `src/app/(auth)/` routes dengan role-based access
- **Backend:** `auth/`, `users/`, `centers/` modules dengan JWT + role guards
- **Database:** Schema `public` dengan user, center, role tables
- **Integration:** Nginx SSL termination + Redis session storage

### Epic 2: Data Entry & Quality Assurance → `/patients` dengan quality workflows
- **Frontend:** Progressive forms dengan WhatsApp-inspired UX di `src/app/(dashboard)/data-entry/`
- **Backend:** `patients/` module dengan real-time validation dan file upload
- **Database:** Schema per-center untuk patient data dengan audit trails
- **Integration:** MinIO storage untuk medical imaging + Redis caching

### Epic 3: Research Discovery & Collaboration → `/research/discovery`
- **Frontend:** Interactive maps dan advanced filtering di `src/app/(dashboard)/research/`
- **Backend:** `research/discovery/` dengan PostGIS geographic queries
- **Database:** Materialized views untuk aggregate data + geographic indexing
- **Integration:** Leaflet maps dengan OpenStreetMap Indonesia data

### Epic 4: Research Request Management → `/research/requests`
- **Frontend:** Request workflows dengan approval tracking
- **Backend:** `research/requests/` dengan notification system
- **Database:** Request tables dengan status tracking dan compliance validation
- **Integration:** Email notifications dengan Nodemailer templates

### Epic 5: Analytics & Intelligence → `/analytics`
- **Frontend:** Real-time dashboards dengan Chart.js visualization
- **Backend:** `analytics/` module dengan Redis caching layers
- **Database:** Materialized views dengan auto-refresh strategies
- **Integration:** WebSocket untuk real-time updates + Chart.js rendering

### Epic 6: Reporting & System Administration → `/admin`
- **Frontend:** Administrative interfaces dengan bulk operations
- **Backend:** `admin/` module dengan system monitoring capabilities
- **Database:** Audit tables dengan immutable logging
- **Integration:** ELK stack untuk comprehensive logging + Prometheus metrics

---

## 5. Integration Points

### API Gateway (Nginx)
- **Frontend Routes:** `http://localhost/` → Next.js frontend
- **Backend API:** `http://localhost/api/` → NestJS backend
- **Health Checks:** `/health` endpoint untuk service monitoring
- **SSL Termination:** HTTPS dengan custom certificates

### Database Integration
- **Multi-tenant Schema:** Schema per-center dengan shared analytics schema
- **Connection Pooling:** Prisma connection management dengan Redis cache
- **Backup Strategy:** Automated daily backups dengan retention policies

### File Storage Integration
- **Medical Images:** MinIO S3-compatible storage dengan medical metadata
- **Document Upload:** Secure file upload dengan virus scanning
- **CDN Integration:** Nginx static file serving dengan caching

### Real-time Communication
- **WebSocket Events:** Server-sent updates untuk dashboard notifications
- **Cache Invalidation:** Redis pub/sub untuk cache management
- **Background Jobs:** Queue system untuk heavy processing tasks

---

## 6. Security Architecture

### Authentication & Authorization
```typescript
// JWT Token structure
interface JWTPayload {
  userId: string;
  centerId: string;
  role: 'data_entry' | 'researcher' | 'admin' | 'national_stakeholder';
  permissions: string[];
  centerAccess?: string[]; // For multi-center access
}

// Role-based access control
@Roles('admin', 'national_stakeholder')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('/centers')
async createCenter(@Body() createCenterDto: CreateCenterDto) {
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
-- Schema per-center approach
CREATE SCHEMA center_123 AUTHORIZATION center_123_user;
CREATE SCHEMA center_456 AUTHORIZATION center_456_user;

-- Row Level Security untuk shared tables
CREATE POLICY center_isolation ON patient_records
  FOR ALL TO center_users
  USING (center_id = current_setting('app.current_center_id')::UUID);
```

---

## 7. Performance Considerations

### Database Optimization
- **Indexing Strategy:** Composite indexes untuk common query patterns
- **Materialized Views:** Pre-computed aggregates untuk analytics queries
- **Connection Pooling:** Prisma dengan optimized connection limits
- **Query Optimization:** EXPLAIN ANALYZE monitoring untuk slow queries

### Caching Strategy
- **Redis Caching:** Hot data caching dengan TTL-based invalidation
- **Browser Caching:** Static asset optimization dengan cache headers
- **CDN Ready:** Asset optimization untuk future CDN integration
- **Application Caching:** React Query dengan stale-while-revalidate

### Performance Monitoring
- **Response Time Monitoring:** Custom middleware dengan alert thresholds
- **Database Performance:** pg_stat_statements dengan query analysis
- **Resource Utilization:** Container health monitoring dengan alerting
- **User Experience:** Frontend performance metrics dengan Core Web Vitals

---

## 8. Deployment Architecture

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

## 9. Development Environment Setup

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

# 6. Seed initial data
docker-compose exec backend npm run seed:dev

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

## 10. Architecture Decision Records

### ADR-001: Docker-based Local Deployment
**Decision:** Menggunakan Docker Compose untuk deployment lokal
**Rationale:** Data sovereignty untuk compliance Indonesia, cost control, full custom control
**Consequences:** Additional DevOps complexity, but full control over infrastructure

### ADR-002: Multi-tenant Schema per Center
**Decision:** PostgreSQL schema per-center untuk data isolation
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
**Rationale:** Optimal performance untuk Indonesia-scale deployment, minimal complexity
**Consequences:** Data freshness latency (5-15 minutes), but acceptable untuk healthcare analytics

---

## 11. Testing Strategy

### Unit Testing
- **Frontend:** Jest + React Testing Library untuk component testing
- **Backend:** Jest dengan database mocking untuk service testing
- **Coverage Target:** >80% untuk critical business logic

### Integration Testing
- **API Testing:** Supertest untuk endpoint validation
- **Database Testing:** Test containers dengan isolated test databases
- **E2E Testing:** Playwright untuk critical user journeys

### Performance Testing
- **Load Testing:** K6 untuk API performance validation
- **Database Performance:** pgbench untuk query optimization
- **Frontend Performance:** Lighthouse CI untuk Core Web Vitals

### Security Testing
- **OWASP ZAP:** Automated security scanning
- **Penetration Testing:** Manual security assessment
- **Dependency Scanning:** npm audit untuk vulnerability detection

---

## 12. Disaster Recovery & Business Continuity

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
- **Communication Plan:** Stakeholder notification procedures
- **Rollback Strategy:** Automated rollback capabilities
- **Documentation:** Incident reports dengan lessons learned

---

## 13. Novel Pattern Designs

### Pattern 1: WhatsApp-Inspired Medical Data Entry Flow
**Purpose:** Reduces cognitive load untuk medical staff dengan familiar interaction patterns
**Components:**
- **StatusFlow Component:** Real-time indicators (✓✓✓) untuk completion tracking
- **ProgressiveForm Component:** Two-layer data capture (quick + detailed)
- **MediaPriority Component:** Image upload dengan auto-categorization
- **DraftAutoSave Service:** Prevent data loss dengan background persistence
**Affects Epics:** Epic 2 (Data Entry & Quality Assurance)
**Implementation Guide:**
```typescript
// WhatsApp status flow implementation
const DataEntryStatus = {
  DRAFT: { icon: '✈️', color: 'gray', text: 'Sedang diedit' },
  VALIDATING: { icon: '⏳', color: 'yellow', text: 'Dalam validasi' },
  COMPLETE: { icon: '✅', color: 'green', text: 'Tervalidasi' },
  NEEDS_REVIEW: { icon: '⚠️', color: 'orange', text: 'Perlu review' }
};

// Progressive disclosure form pattern
const PatientDataCapture = {
  quickFields: ['patientName', 'idNumber', 'tumorType', 'diagnosisDate'],
  detailedFields: ['medicalHistory', 'familyHistory', 'previousTreatments', 'geneticMarkers'],
  images: ['histology', 'radiology', 'clinicalPhotos', 'laboratory']
};
```

### Pattern 2: Multi-Tenant Geographic Cancer Intelligence
**Purpose:** Real-time nationwide cancer pattern detection dengan center-level data isolation
**Components:**
- **SchemaDiscovery Service:** Dynamic tenant schema detection dan registration
- **AggregationEngine:** Multi-level data aggregation dengan privacy thresholds
- **GeographicProcessor:** PostGIS spatial queries untuk Indonesia provinces/regencies
- **IntelligenceCache:** Redis-based caching layer untuk real-time dashboard
**Affects Epics:** Epic 3 (Research Discovery) & Epic 5 (Analytics)
**Implementation Guide:**
```sql
-- Dynamic schema union untuk nationwide analytics
CREATE OR REPLACE FUNCTION aggregate_national_data()
RETURNS TABLE (
  province_id UUID,
  tumor_type VARCHAR,
  incidence_count BIGINT,
  confidence_interval NUMRANGE
) AS $$
DECLARE
  center_schema RECORD;
BEGIN
  FOR center_schema IN
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name LIKE 'center_%'
  LOOP
    RETURN QUERY EXECUTE format(
      'SELECT province_id, tumor_type, COUNT(*),
              percentile_cont(0.95) WITHIN GROUP (ORDER BY age)
       FROM %I.patient_records GROUP BY province_id, tumor_type',
      center_schema.schema_name
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Pattern 3: Automated HIPAA Compliance Framework
**Purpose:** Ensure research data access compliance dengan minimal manual oversight
**Components:**
- **ConsentTracker:** Patient consent level validation untuk setiap data request
- **DataAnonymizer:** Dynamic redaction berdasarkan approval level dan sensitivity
- **ComplianceValidator:** Automated checking against privacy regulations
- **AuditLogger:** Immutable logging untuk compliance reporting
**Affects Epics:** Epic 1 (User Management), Epic 4 (Research Requests), Epic 6 (System Administration)
**Implementation Guide:**
```typescript
// Automated compliance checking
interface ComplianceEngine {
  validateRequest(request: ResearchRequest): Promise<ComplianceResult>;
  generateDataPackage(approvedRequest: ApprovedRequest): Promise<AnonymizedDataset>;
  trackAccess(userId: string, dataPackageId: string): Promise<void>;
}

// Dynamic anonymization based on approval level
const AnonymizationLevels = {
  AGGREGATE: {
    minGroupSize: 11, // HIPAA safe harbor
    fieldsToRemove: ['patientId', 'exactBirthdate', 'address'],
    allowedAggregations: ['count', 'median', 'percentile']
  },
  PSEUDO_ANONYMIZED: {
    minGroupSize: 5,
    fieldsToRemove: ['patientId', 'contactInfo'],
    allowedAggregations: ['all aggregates', 'correlation']
  }
};
```

---

## 14. Implementation Patterns (Agent Consistency Rules)

### Naming Patterns
**Database Naming:**
- **Tables:** snake_case plural (`patient_records`, `tumor_data`, `medical_images`)
- **Columns:** snake_case (`patient_id`, `created_at`, `tumor_type_code`)
- **Foreign Keys:** `<table>_id` (`patient_id`, `center_id`, `user_id`)
- **Indexes:** `idx_<table>_<columns>` (`idx_patient_records_center_id_created_at`)

**API Endpoint Naming:**
- **REST Endpoints:** `/api/v1/{resource}` (plural resource names)
- **Nested Resources:** `/api/v1/centers/{centerId}/patients`
- **Action Endpoints:** `/api/v1/patients/{id}/validate-quality`

**Frontend Component Naming:**
- **Components:** PascalCase (`PatientForm`, `TumorDataEntry`, `QualityIndicator`)
- **Files:** kebab-case (`patient-form.tsx`, `tumor-data-entry.tsx`)
- **Hooks:** camelCase dengan `use` prefix (`usePatientData`, `useQualityValidation`)

**File Organization:**
- **By Feature:** `/patients/`, `/research/`, `/analytics/`
- **Tests:** Co-located dengan `*.test.ts` atau `*.spec.ts`
- **Types:** `types/` subdirectory dalam setiap feature
- **Constants:** `constants/` root directory untuk shared constants

### Structure Patterns
**Project Structure:**
- **Feature-based Organization:** Group by business capability, not by technical layer
- **Shared Code:** `common/` atau `shared/` directory untuk reusable components
- **Configuration:** Centralized di root dengan environment-specific files
- **Documentation:** `docs/` directory dengan comprehensive API documentation

**Database Schema Organization:**
- **Schema per Center:** `center_001`, `center_002`, etc.
- **Shared Analytics Schema:** `analytics` untuk aggregated data
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
    code: string;           // INTERNAL_ERROR, VALIDATION_ERROR, AUTH_ERROR
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
- **API Response:** ISO 8601 strings (`2025-11-17T10:30:00Z`)
- **Frontend Display:** Indonesia timezone (WIB/UTC+7) dengan `date-fns-tz`

### Communication Patterns
**Database Connection Patterns:**
- **Connection Pooling:** Prisma dengan optimized pool size
- **Transaction Management:** Explicit transactions untuk data consistency
- **Retry Logic:** Exponential backoff untuk connection failures
- **Health Checks:** Connection validation dengan periodic pings

**Cache Strategy:**
- **Redis Key Naming:** `app:module:entity:id` (e.g., `app:patients:123`)
- **Cache Invalidation:** Cache tags untuk related cache invalidation
- **TTL Policies:** Short TTL untuk real-time data, long TTL untuk reference data
- **Cache Warming:** Background jobs untuk pre-computed aggregates

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
- **Offline First:** Service worker untuk offline data entry
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
├── patients/                # Patient data (Epic 2)
│   ├── {id}/validate        # Quality validation
│   ├── {id}/images          # Medical imaging
│   └── {id}/audit           # Change history
├── research/                # Research access (Epic 3 & 4)
│   ├── discovery/           # Data browsing
│   ├── requests/            # Access requests
│   └── collaborations/      # Expert matching
├── analytics/               # Intelligence (Epic 5)
│   ├── dashboards/          # Real-time views
│   ├── trends/              # Pattern analysis
│   └── reports/             # Generated reports
└── admin/                   # System admin (Epic 6)
    ├── system/              # Configuration
    ├── monitoring/          # Health checks
    └── backup/              # Data management
```

**Static Asset Organization:**
```
/public/
├── icons/                   # Medical icons and symbols
├── images/                  # Static images
├── documents/              # Templates and forms
└── medical-theme/          # Custom CSS theme files
```

**Configuration File Locations:**
```
/config/
├── database.yml            # Database configurations
├── redis.yml               # Cache configurations
├── minio.yml               # File storage configs
├── auth.yml                # Authentication settings
└── logging.yml             # Log configurations
```

### Consistency Patterns
**User-Facing Messages:**
- **Success:** Konfirmasi dengan clear next steps ("Data berhasil disimpan. Lanjut ke form berikutnya?")
- **Errors:** Actionable error messages dengan recovery options ("Format tanggal salah. Gunakan DD/MM/YYYY.")
- **Warnings:** Informative warnings tanpa blocking actions ("Data lengkap, tapi memerlukan review medis.")

**Logging Format:**
```typescript
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  userId?: string;
  centerId?: string;
  action: string;
  resource?: string;
  message: string;
  metadata?: Record<string, any>;
  requestId: string;
}
```

**Date Display Format:**
- **Short Display:** `17/11/2025` (DD/MM/YYYY)
- **Full Display:** `17 November 2025, 14:30 WIB`
- **International:** `2025-11-17T07:30:00Z` (UTC untuk API)
- **Input Format:** Flexible parsing dengan user-friendly hints

**Implementation Enforcement:**
- **Linting Rules:** ESLint untuk naming conventions
- **TypeScript:** Strict mode untuk type consistency
- **Code Reviews:** Checklist untuk pattern compliance
- **Automated Testing:** CI/CD validation untuk architectural rules

---

## 15. Consistency Rules Summary

**Critical Rules yang HARUS diikuti semua AI agents:**

1. **Naming Convention:** Semua entities menggunakan established patterns (snake_case DB, PascalCase components, camelCase variables)
2. **API Response:** Standardized ApiResponse format untuk semua endpoints
3. **Error Handling:** Structured error responses dengan actionable messages
4. **Date/Time:** UTC storage, Indonesia timezone display, ISO 8601 API format
5. **Authentication:** JWT tokens dengan role-based guards untuk semua protected routes
6. **Database Transactions:** Explicit transactions untuk multi-table operations
7. **Audit Logging:** Comprehensive logging untuk semua data access dan modifications
8. **File Naming:** Consistent kebab-case file names dengan descriptive names
9. **Component Organization:** Feature-based structure dengan clear boundaries
10. **Cache Strategy:** Redis dengan established key naming dan TTL policies

**Enforcement Mechanism:**
- **Automated Linting:** Pre-commit hooks untuk naming consistency
- **TypeScript Strict Mode:** Compile-time validation
- **Integration Tests:** API contract testing untuk response formats
- **Database Constraints:** Check constraints untuk data integrity
- **Security Scanning:** Automated vulnerability detection

---

## Conclusion

Arsitektur INAMSOS ini menyediakan foundation yang solid untuk database tumor nasional dengan focus pada:

1. **Data Sovereignty:** Local deployment dengan full control atas infrastructure
2. **Healthcare Compliance:** HIPAA-level security dengan audit trails
3. **Scalability:** Docker-based deployment yang dapat diskalakan untuk 95+ centers
4. **Performance:** Optimized untuk real-time analytics dan geographic visualization
5. **Maintainability:** Clean architecture dengan clear separation of concerns
6. **Developer Experience:** Modern development tools dengan TypeScript consistency
7. **Agent Consistency:** Comprehensive patterns untuk prevent AI agent conflicts
8. **Novel Patterns:** WhatsApp-inspired UX dan intelligent geographic aggregation

Arsitektur ini siap untuk implementasi dengan foundation yang kuat untuk pertumbuhan jangka panjang sistem INAMSOS di Indonesia.