# Dokumentasi Arsitektur INAMSOS

**Indonesia National Cancer Database System - System Architecture & Design**

[![Architecture](https://img.shields.io/badge/architecture-Microservices-green.svg)](https://docs.inamsos.go.id/architecture)
[![Technology Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20PostgreSQL%20%7C%20Redis-blue.svg)](https://stack.inamsos.go.id)
[![Pattern](https://img.shields.io/badge/pattern-Event_Driven-orange.svg)](https://patterns.inamsos.go.id)

## Daftar Isi

- [Ikhtisar Arsitektur](#ikhtisar-arsitektur)
- [Prinsip Desain](#prinsip-desain)
- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
- [Data Architecture](#data-architecture)
- [Security Architecture](#security-architecture)
- [Integration Architecture](#integration-architecture)
- [Scalability Architecture](#scalability-architecture)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [API Design](#api-design)
- [Database Design](#database-design)
- [Deployment Architecture](#deployment-architecture)
- [Monitoring Architecture](#monitoring-architecture)
- [Future Roadmap](#future-roadmap)

---

## Ikhtisar Arsitektur

### Vision Arsitektural

INAMSOS mengadopsi **microservices architecture** yang scalable, secure, dan maintainable untuk mendukung pertumbuhan data kanker nasional dan penelitian kanker di Indonesia.

### Core Architectural Goals

1. **Scalability**: Handle growth dari ribuan ke jutaan patient records
2. **Security**: Multi-layered security untuk data medis sensitif
3. **Performance**: Sub-2 second response times untuk critical operations
4. **Reliability**: 99.9% uptime dengan fault tolerance
5. **Flexibility**: Adaptasi untuk changing research needs
6. **Compliance**: HIPAA dan Indonesian data protection laws

### Architecture Decision Records (ADRs)

| Decision | Context | Decision | Consequence |
|-----------|---------|-----------|-------------|
| ADR-001 | Multi-center data management | Multi-tenant dengan logical separation | Scalable untuk new centers, complex data isolation |
| ADR-002 | Database choice | PostgreSQL 15+ dengan multi-schema | Reliability, advanced features, healthcare compliance |
| ADR-003 | Application framework | NestJS dengan TypeScript | Maintainability, type safety, rich ecosystem |
| ADR-004 | Authentication strategy | JWT + MFA + Role-based | Secure, flexible, audit-compliant |
| ADR-005 | Data encryption | AES-256 dengan application-level encryption | Strong security, compliance, performance impact |

---

## Prinsip Desain

### 1. Separation of Concerns

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│     Layer       │◄──►│     Layer       │◄──►│     Layer       │
│                 │    │                 │    │                 │
│ - UI Components │    │ - Business      │    │ - Database      │
│ - API Gateway   │    │   Logic         │    │ - File Storage  │
│ - Auth/Session  │    │ - Validation    │    │ - Cache         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Single Responsibility Principle

Setiap microservice memiliki satu well-defined responsibility:

- **Patient Service**: Patient data management
- **Medical Records Service**: Clinical data management
- **Research Service**: Data access untuk research
- **Analytics Service**: Data analysis dan reporting
- **Authentication Service**: User management dan security
- **Audit Service**: Comprehensive audit logging

### 3. Domain-Driven Design (DDD)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Patient Domain │    │ Clinical Domain │    │ Research Domain │
│                 │    │                 │    │                 │
│ - Patient       │    │ - Diagnosis     │    │ - Data Request  │
│ - Demographics  │    │ - Treatment     │    │ - Collaboration │
│ - Consent       │    │ - Outcomes      │    │ - Publication   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 4. Event-Driven Architecture

```
[Patient Created] → [Audit Log] → [Research Notifications] → [Analytics Update]
      ↓                    ↓                    ↓                    ↓
[Patient Updated] → [Data Quality Check] → [Index Update] → [Report Generation]
```

---

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   Web App   │  │  Mobile App │  │   Partners  │  │  External APIs  │   │
│  │ (Next.js)   │  │  (React)    │  │ (HIS/RIS)   │  │  (HL7/FHIR)     │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GATEWAY LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ API Gateway │  │  Load Bal   │  │  WAF/CDN    │  │  Rate Limiter   │   │
│  │ (Kong/Nginx)│  │ (HAProxy)   │  │ (Cloudflare)│  │ (Redis/Redis)   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   Patient   │  │  Clinical   │  │  Research   │  │   Analytics     │   │
│  │   Service   │  │   Service   │  │   Service   │  │   Service       │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │     Auth    │  │    Audit    │  │  Notification│  │   Integration   │   │
│  │   Service   │  │   Service   │  │   Service   │  │    Service      │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ PostgreSQL  │  │    Redis    │  │   MinIO     │  │  ElasticSearch  │   │
│  │  (Primary+  │  │  (Cluster)  │  │  (Storage)  │  │   (Logs)        │   │
│  │   Replica)  │  │             │  │             │  │                 │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │Prometheus   │  │   Grafana   │  │   ELK Stack │  │  Kubernetes     │   │
│  │ (Metrics)   │  │ (Dashboard) │  │ (Logging)   │  │ (Orchestration) │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Communication Patterns

1. **Synchronous Communication**: Direct API calls untuk real-time operations
2. **Asynchronous Communication**: Event-driven messaging untuk background processing
3. **Data Replication**: Read replicas untuk performance improvement
4. **Caching Strategy**: Multi-level caching untuk latency reduction

---

## Component Architecture

### Core Microservices

#### 1. Patient Service

```typescript
// Patient Service Architecture
interface PatientService {
  // Core CRUD Operations
  createPatient(patientData: PatientDto): Promise<Patient>;
  updatePatient(id: string, data: UpdatePatientDto): Promise<Patient>;
  getPatient(id: string): Promise<Patient>;
  searchPatients(criteria: SearchCriteria): Promise<Patient[]>;

  // Quality Assurance
  validatePatientData(data: PatientDto): ValidationResult;
  detectDuplicates(patient: Patient): Promise<Patient[]>;
  enrichPatientData(id: string): Promise<Patient>;

  // Integration Points
  onPatientCreated(patient: Patient): Promise<void>;
  onPatientUpdated(oldData: Patient, newData: Patient): Promise<void>;
}
```

**Responsibilities:**
- Patient registration dan management
- Demographic data maintenance
- Duplicate detection dan resolution
- Quality validation dan enrichment
- Integration dengan external systems

#### 2. Medical Records Service

```typescript
// Medical Records Service Architecture
interface MedicalRecordsService {
  // Clinical Data Management
  createMedicalRecord(record: MedicalRecordDto): Promise<MedicalRecord>;
  updateMedicalRecord(id: string, data: UpdateRecordDto): Promise<MedicalRecord>;
  getMedicalHistory(patientId: string): Promise<MedicalRecord[]>;

  // Treatment Management
  addTreatmentPlan(patientId: string, plan: TreatmentPlanDto): Promise<TreatmentPlan>;
  updateTreatmentProgress(planId: string, progress: TreatmentProgressDto): Promise<void>;

  // Outcomes Tracking
  recordOutcome(patientId: string, outcome: OutcomeDto): Promise<Outcome>;
  generateSurvivalReport(patientId: string): Promise<SurvivalReport>;

  // Data Quality
  validateClinicalData(data: ClinicalDataDto): ValidationResult;
  checkProtocolCompliance(treatment: TreatmentPlan): ComplianceReport;
}
```

#### 3. Research Service

```typescript
// Research Service Architecture
interface ResearchService {
  // Data Access Management
  browseAggregatedData(criteria: BrowseCriteria): Promise<AggregatedData>;
  submitDataRequest(request: ResearchRequestDto): Promise<ResearchRequest>;
  processRequestApproval(requestId: string, decision: ApprovalDecision): Promise<void>;

  // Collaboration Tools
  findCollaborators(expertise: string): Promise<Researcher[]>;
  createCollaborationProject(project: CollaborationDto): Promise<Collaboration>;
  manageProjectAccess(projectId: string, permissions: PermissionDto[]): Promise<void>;

  // Publication Support
  trackCitation(datasetId: string): Promise<Citation[]>;
  generateImpactReport(researcherId: string): Promise<ImpactReport>;
}
```

#### 4. Analytics Service

```typescript
// Analytics Service Architecture
interface AnalyticsService {
  // Real-time Analytics
  generateDashboardMetrics(centerId?: string): Promise<DashboardMetrics>;
  calculateTrends(criteria: TrendCriteria): Promise<TrendData[]>;
  monitorQualityMetrics(): Promise<QualityReport>;

  // Report Generation
  generateEpidemiologicalReport(params: ReportParams): Promise<Report>;
  createPerformanceReport(centerId: string, period: DateRange): Promise<PerformanceReport>;
  exportResearchData(requestId: string): Promise<DataExport>;

  // Predictive Analytics
  predictCancerTrends(region: string, timeframe: number): Promise<Prediction>;
  analyzeTreatmentOutcomes(criteria: OutcomeCriteria): Promise<OutcomeAnalysis];
}
```

### Supporting Services

#### Authentication Service

```typescript
interface AuthenticationService {
  // User Management
  registerUser(userData: RegisterDto): Promise<User>;
  authenticateUser(credentials: LoginDto): Promise<AuthResult>;
  refreshToken(refreshToken: string): Promise<TokenPair>;

  // Multi-Factor Authentication
  setupMFA(userId: string): Promise<MFASetup>;
  verifyMFA(userId: string, code: string): Promise<boolean>;
  regenerateBackupCodes(userId: string): Promise<string[]>;

  // Authorization
  authorizeUser(userId: string, resource: string, action: string): Promise<boolean>;
  getUserPermissions(userId: string): Promise<Permission[]>;

  // Session Management
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session>;
  invalidateSession(sessionId: string): Promise<void>;
  validateSession(sessionId: string): Promise<boolean>;
}
```

#### Audit Service

```typescript
interface AuditService {
  // Event Logging
  logEvent(event: AuditEventDto): Promise<void>;
  logDataChange(change: DataChangeDto): Promise<void>;
  logSystemEvent(systemEvent: SystemEventDto): Promise<void>;

  // Query & Analysis
  getAuditTrail(resourceId: string): Promise<AuditEvent[]>;
  getUserActivity(userId: string, timeRange: DateRange): Promise<AuditEvent[]>;
  generateComplianceReport(timeRange: DateRange): Promise<ComplianceReport>;

  // Monitoring
  detectAnomalousActivity(timeWindow: number): Promise<Anomaly[]>;
  generateSecurityMetrics(): Promise<SecurityMetrics>;
}
```

---

## Data Architecture

### Database Schema Design

#### Multi-Schema Architecture

```sql
-- System Schema
system.centers          -- Hospital/center information
system.users           -- User accounts dan roles
system.roles           -- Role definitions
system.user_roles      -- User-role assignments
system.configurations  -- System settings
system.audit_events    -- Audit trail

-- Medical Schema
medical.patients       -- Patient demographics
medical.medical_records -- Clinical data
medical.diagnoses     -- Diagnosis information
medical.treatments    -- Treatment details
medical.outcomes      -- Treatment outcomes
medical.consent       -- Patient consent records

-- Research Schema
research.requests     -- Research data requests
research.collaborations -- Research partnerships
research.publications -- Publication tracking
research.datasets     -- Research datasets
research.access_logs  -- Data access tracking

-- Analytics Schema
analytics.metrics      -- Performance metrics
analytics.trends      -- Trend analysis data
analytics.reports     -- Generated reports
analytics.dashboards  -- Dashboard configurations
analytics.predictions  -- Predictive model outputs
```

#### Data Relationships

```
system.users ──┐
               ├──► medical.patients ──► medical.medical_records ──► research.datasets
               │        │                     │                           │
               │        │                     ├──► medical.diagnoses      │
               │        │                     ├──► medical.treatments     │
               │        │                     └──► medical.outcomes       │
               │        │
               │        ├──► medical.consent
               │        │
               │        └──► research.requests ◄─┐
               │                                  │
               └──► system.centers ◄──────────────┘
                        │
                        └──► analytics.metrics
```

### Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Data Entry│───►│   Validation│───►│   Storage   │───►│   Indexing  │
│   (Forms)   │    │   (Rules)   │    │  (Database) │    │  (Search)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Quality   │    │   Audit     │    │   Backup    │    │   Sync      │
│   Assurance │    │   Logging   │    │   Storage   │    │   (Replica) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Data Encryption Strategy

#### Encryption Levels

1. **Transport Layer**: TLS 1.3 untuk semua communications
2. **Application Layer**: AES-256 untuk sensitive fields
3. **Database Layer**: Transparent Data Encryption (TDE)
4. **Storage Layer**: Encrypted file systems

#### Encryption Implementation

```typescript
// Encryption Service
class EncryptionService {
  encryptPatientData(data: PatientData): EncryptedPatientData {
    return {
      id: data.id,
      name: this.encrypt(data.name),
      nik: this.encrypt(data.nik),
      phone: this.encrypt(data.phone),
      email: this.encrypt(data.email),
      // Non-sensitive fields remain unencrypted
      birthDate: data.birthDate,
      gender: data.gender,
      createdAt: data.createdAt
    };
  }

  decryptPatientData(encrypted: EncryptedPatientData): PatientData {
    return {
      id: encrypted.id,
      name: this.decrypt(encrypted.name),
      nik: this.decrypt(encrypted.nik),
      phone: this.decrypt(encrypted.phone),
      email: this.decrypt(encrypted.email),
      birthDate: encrypted.birthDate,
      gender: encrypted.gender,
      createdAt: encrypted.createdAt
    };
  }
}
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NETWORK SECURITY                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   Firewall  │  │   DDoS      │  │    IDS/IPS  │  │   VPN Access    │   │
│  │ Protection  │  │ Protection  │  │ Protection  │  │   Management    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION SECURITY                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   AuthN/Z   │  │  Input      │  │   Output    │  │   Session       │   │
│  │   (JWT+MFA) │  │ Validation  │  │ Encryption  │  │   Management    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA SECURITY                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ Encryption  │  │   Access    │  │    Audit    │  │   Backup        │   │
│  │  (AES-256)  │  │  Control    │  │   Logging   │  │   Encryption    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Request → TLS Encryption → API Gateway → JWT Validation → MFA Check
      ↓                                                            ↓
Rate Limiting → IP Whitelist → Service Auth → Permission Check → Resource Access
      ↓                                                            ↓
   WAF Check → Request Logging → Business Logic → Audit Log → Response
```

### Authorization Model

#### Role-Based Access Control (RBAC)

```typescript
interface Role {
  id: string;
  name: string;
  level: number; // 1-4, higher = more privileges
  permissions: Permission[];
}

interface Permission {
  resource: string; // patients, research, analytics, etc.
  action: string; // create, read, update, delete, export
  scope: string; // own, center, national
  conditions?: PermissionCondition[];
}

// Example Permission Definitions
const DATA_ENTRY_PERMISSIONS: Permission[] = [
  { resource: 'patients', action: 'create', scope: 'center' },
  { resource: 'patients', action: 'read', scope: 'center' },
  { resource: 'patients', action: 'update', scope: 'center' }
];

const RESEARCHER_PERMISSIONS: Permission[] = [
  { resource: 'research', action: 'browse', scope: 'national' },
  { resource: 'datasets', action: 'request', scope: 'national' },
  { resource: 'data', action: 'export', scope: 'approved' }
];
```

### Data Access Patterns

#### Multi-Tenant Data Isolation

```sql
-- Row-Level Security Implementation
CREATE POLICY center_isolation ON medical.patients
    FOR ALL
    TO data_entry_role
    USING (center_id = current_setting('app.current_center_id'));

CREATE POLICY researcher_access ON medical.patients
    FOR SELECT
    TO researcher_role
    USING (created_at < NOW() - INTERVAL '2 years' AND is_anonymized = true);
```

---

## Integration Architecture

### External System Integration

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hospital      │    │   Government    │    │   International │
│   Information   │    │   Health        │    │   Cancer        │
│   Systems       │    │   Systems       │    │   Registries    │
│   (HIS/RIS)     │    │   (MOH)         │    │   (IARC)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐             ┌─────▼─────┐             ┌────▼────┐
    │  HL7/   │             │   API    │             │   FHIR  │
    │  DICOM  │             │ Gateway  │             │  API    │
    └────┬────┘             └─────┬─────┘             └────┬────┘
         │                       │                       │
    ┌────▼───────────────────────▼───────────────────────▼────┐
    │                   INAMSOS Integration Layer            │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
    │  │   Message   │  │  Protocol   │  │    Data         │ │
    │  │   Queue     │  │  Adapter    │  │  Transformation│ │
    │  │ (RabbitMQ)  │  │  Layer      │  │    Engine       │ │
    │  └─────────────┘  └─────────────┘  └─────────────────┘ │
    └─────────────────────────────────────────────────────────┘
```

### API Gateway Configuration

```yaml
# Kong API Gateway Configuration
services:
  - name: patient-service
    url: http://patient-service:3000
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
      - name: oauth2
        config:
          scopes: [patients:read, patients:write]
      - name: request-transformer
        config:
          add:
            headers:
              - "X-Service:patient-service"

routes:
  - name: patient-routes
    service: patient-service
    paths:
      - /api/patients
    methods:
      - GET
      - POST
      - PUT
      - DELETE
```

### Healthcare Standards Support

#### HL7 Integration

```typescript
// HL7 Message Parser
class HL7Parser {
  parseADTMessage(hl7Message: string): PatientRegistration {
    const segments = hl7Message.split('\r');
    const patientSegment = segments.find(s => s.startsWith('PID'));

    return {
      medicalRecordNumber: this.extractField(patientSegment, 2),
      name: this.extractField(patientSegment, 5),
      birthDate: this.extractField(patientSegment, 7),
      gender: this.extractField(patientSegment, 8)
    };
  }

  generateORUMessage(patientData: Patient, diagnosis: Diagnosis): string {
    // Generate ORU^R01 message for observation results
  }
}
```

#### FHIR Compatibility

```typescript
// FHIR Resource Converter
class FHIRConverter {
  patientToFHIR(patient: Patient): fhir.Patient {
    return {
      resourceType: 'Patient',
      identifier: [{
        type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR' }] },
        value: patient.medicalRecordNumber
      }],
      name: [{
        family: patient.name.split(' ').slice(1).join(' '),
        given: [patient.name.split(' ')[0]]
      }],
      birthDate: patient.birthDate,
      gender: patient.gender.toLowerCase() as fhir.AdministrativeGender
    };
  }

  observationToFHIR(diagnosis: Diagnosis): fhir.Observation {
    // Convert diagnosis to FHIR Observation resource
  }
}
```

---

## Scalability Architecture

### Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER (Layer 4/7)                                  │
└─────────────────┬───────────────────────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐   ┌───▼────┐   ┌───▼────┐   ┌───▼────┐
│ Pod A  │   │ Pod B  │   │ Pod C  │   │ Pod D  │
│        │   │        │   │        │   │        │
│ API    │   │ API    │   │ API    │   │ API    │
│ Service│   │ Service│   │ Service│   │ Service│
└───┬────┘   └───┬────┘   └───┬────┘   └───┬────┘
    │             │             │             │
    └─────────────┼─────────────┘             │
                  │                           │
    ┌─────────────▼───────────────────────────▼───────┐
    │              DATABASE CLUSTER                    │
    │  ┌─────────┐    ┌─────────┐    ┌─────────────┐   │
    │  │ Primary │    │Replica 1│    │  Replica 2  │   │
    │  │ (Write) │    │ (Read)  │    │   (Read)    │   │
    │  └─────────┘    └─────────┘    └─────────────┘   │
    └───────────────────────────────────────────────────┘
```

### Auto-scaling Configuration

```yaml
# Kubernetes Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: inamsos-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: inamsos-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### Caching Strategy

#### Multi-Level Caching

```typescript
// Caching Architecture
interface CacheStrategy {
  // Level 1: In-Memory Cache (Application)
  applicationCache: {
    userSessions: Map<string, Session>;
    recentPatients: Map<string, Patient>;
    permissionCache: Map<string, Permission[]>;
  };

  // Level 2: Distributed Cache (Redis)
  distributedCache: {
    authenticationTokens: string;
    patientDataIndex: string;
    researchResults: string;
    analyticsCache: string;
  };

  // Level 3: Database Query Cache
  queryCache: {
    commonQueries: Map<string, QueryResult>;
    reportData: Map<string, ReportData>;
    aggregateData: Map<string, AggregateData>;
  };
}
```

---

## Technology Stack

### Backend Technology Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Runtime       │    │   Framework     │    │   Language      │
│                 │    │                 │    │                 │
│ Node.js 18+     │    │   NestJS 10     │    │  TypeScript 5.1 │
│ LTS Runtime     │    │ Microservices   │    │  Type Safety    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐            ┌────▼────┐
    │   ORM   │            │  Auth     │            │  Valid  │
    │ Prisma  │            │ Passport  │            │ Class-  │
    │ 5.6.0   │            │  + JWT    │            │ Validator│
    └─────────┘            └───────────┘            └─────────┘
```

### Database Technology

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Primary DB    │    │    Cache        │    │   Search         │
│                 │    │                 │    │                 │
│ PostgreSQL 15+  │    │   Redis 7.0     │    │ Elasticsearch   │
│ Multi-Schema    │    │   Cluster       │    │   8.x           │
│ JSONB Support   │    │   Pub/Sub       │    │   Full-text     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐            ┌────▼────┐
    │ Backup  │            │ Session  │            │ Logging │
    │ pg_dump │            │ Storage  │            │ ELK     │
    │ WAL-E   │            │   TTL    │            │ Stack   │
    └─────────┘            └───────────┘            └─────────┘
```

### Infrastructure Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Container     │    │  Orchestration  │    │   Monitoring    │
│                 │    │                 │    │                 │
│   Docker 24+    │    │ Kubernetes 1.28+│    │ Prometheus +    │
│   Multi-stage   │    │   Helm Charts   │    │   Grafana       │
│   Builds       │    │   Auto-scaling  │    │   Alerting      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐            ┌────▼────┐
    │   CI/CD │            │   Load   │            │ Security│
    │ GitHub  │            │  Balancer│            │ Scanning│
    │ Actions │            │ HAProxy  │            │  SonarQ │
    │ ArgoCD  │            │ Nginx    │            │  Snyk    │
    └─────────┘            └───────────┘            └─────────┘
```

---

## Design Patterns

### 1. Repository Pattern

```typescript
// Abstract Repository Interface
interface Repository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(criteria: FindCriteria): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(criteria?: CountCriteria): Promise<number>;
}

// Patient Repository Implementation
@Injectable()
export class PatientRepository implements Repository<Patient> {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientDto): Promise<Patient> {
    return this.prisma.patient.create({
      data: {
        ...data,
        id: uuid(),
        createdAt: new Date(),
        isActive: true
      },
      include: { center: true }
    });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        center: true,
        medicalRecords: {
          orderBy: { recordDate: 'desc' },
          take: 10
        }
      }
    });
  }
}
```

### 2. Factory Pattern

```typescript
// Report Factory
interface ReportFactory {
  createReport(type: ReportType, data: any): Report;
}

@Injectable()
export class AnalyticsReportFactory implements ReportFactory {
  createReport(type: ReportType, data: any): Report {
    switch (type) {
      case ReportType.EPIDEMIOLOGICAL:
        return new EpidemiologicalReport(data);
      case ReportType.PERFORMANCE:
        return new PerformanceReport(data);
      case ReportType.RESEARCH_IMPACT:
        return new ResearchImpactReport(data);
      default:
        throw new Error(`Unsupported report type: ${type}`);
    }
  }
}

// Concrete Report Classes
abstract class Report {
  abstract generate(): Promise<ReportData>;
  abstract export(format: ExportFormat): Promise<Buffer>;
}

class EpidemiologicalReport extends Report {
  constructor(private data: EpidemiologicalData) {
    super();
  }

  async generate(): Promise<ReportData> {
    // Generate epidemiological report
  }

  async export(format: ExportFormat): Promise<Buffer> {
    // Export in specified format
  }
}
```

### 3. Observer Pattern

```typescript
// Event System for Patient Updates
interface PatientEventObserver {
  onPatientCreated(patient: Patient): Promise<void>;
  onPatientUpdated(oldData: Patient, newData: Patient): Promise<void>;
  onPatientDeleted(patient: Patient): Promise<void>;
}

// Analytics Observer
@Injectable()
export class AnalyticsObserver implements PatientEventObserver {
  async onPatientCreated(patient: Patient): Promise<void> {
    // Update patient counts
    await this.updatePatientMetrics(patient.centerId, 1);

    // Update demographics
    await this.updateDemographics(patient);

    // Trigger trend analysis
    await this.analyzeTrends(patient.centerId);
  }
}

// Notification Observer
@Injectable()
export class NotificationObserver implements PatientEventObserver {
  async onPatientCreated(patient: Patient): Promise<void> {
    // Notify center administrator
    await this.notifyCenterAdmin(patient.centerId, patient);

    // Send welcome message (if applicable)
    await this.sendWelcomeNotification(patient);
  }
}

// Event Manager
@Injectable()
export class PatientEventManager {
  private observers: PatientEventObserver[] = [];

  constructor(
    private analyticsObserver: AnalyticsObserver,
    private notificationObserver: NotificationObserver
  ) {
    this.observers = [analyticsObserver, notificationObserver];
  }

  async notifyPatientCreated(patient: Patient): Promise<void> {
    await Promise.all(
      this.observers.map(observer => observer.onPatientCreated(patient))
    );
  }
}
```

### 4. Strategy Pattern

```typescript
// Data Export Strategy
interface DataExportStrategy {
  export(data: any[], options: ExportOptions): Promise<ExportResult>;
}

@Injectable()
export class CSVExportStrategy implements DataExportStrategy {
  async export(data: any[], options: ExportOptions): Promise<ExportResult> {
    const csv = await this.convertToCSV(data, options);
    return {
      filename: `export_${Date.now()}.csv`,
      buffer: Buffer.from(csv, 'utf8'),
      mimeType: 'text/csv'
    };
  }
}

@Injectable()
export class ExcelExportStrategy implements DataExportStrategy {
  async export(data: any[], options: ExportOptions): Promise<ExportResult> {
    const workbook = await this.createExcelWorkbook(data, options);
    const buffer = await workbook.xlsx.writeBuffer();

    return {
      filename: `export_${Date.now()}.xlsx`,
      buffer,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }
}

// Export Service
@Injectable()
export class ExportService {
  constructor(
    private csvStrategy: CSVExportStrategy,
    private excelStrategy: ExcelExportStrategy
  ) {}

  async exportData(
    data: any[],
    format: ExportFormat,
    options: ExportOptions
  ): Promise<ExportResult> {
    const strategy = this.getExportStrategy(format);
    return strategy.export(data, options);
  }

  private getExportStrategy(format: ExportFormat): DataExportStrategy {
    switch (format) {
      case ExportFormat.CSV:
        return this.csvStrategy;
      case ExportFormat.EXCEL:
        return this.excelStrategy;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}
```

---

## API Design

### RESTful API Principles

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Resources    │    │   HTTP Methods  │    │  Status Codes   │
│                 │    │                 │    │                 │
│ /patients       │    │ GET (Read)      │    │ 200 (Success)   │
│ /patients/{id}  │    │ POST (Create)   │    │ 201 (Created)   │
│ /medical-records│    │ PUT (Update)    │    │ 400 (Bad Req)   │
│ /research       │    │ DELETE (Delete) │    │ 404 (Not Found) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### API Versioning Strategy

```typescript
// URL Versioning
/api/v1/patients           // Current version
/api/v2/patients           // Future version with breaking changes

// Header Versioning
Accept: application/vnd.inamsos.v1+json
Version: 1.0

// Semantic Versioning
{
  "apiVersion": "1.0.0",
  "data": { ... }
}
```

### Response Format Standards

```typescript
// Standard Response Format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Success Response Example
{
  "success": true,
  "data": {
    "id": "patient_123",
    "name": "John Doe",
    "birthDate": "1980-01-01"
  },
  "meta": {
    "timestamp": "2025-11-19T10:30:00Z",
    "requestId": "req_abc123",
    "version": "1.0.0"
  }
}

// Error Response Example
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid patient data",
    "details": [
      {
        "field": "birthDate",
        "message": "Birth date is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-11-19T10:30:00Z",
    "requestId": "req_def456",
    "version": "1.0.0"
  }
}
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Center      │    │      User       │    │      Role       │
│                 │    │                 │    │                 │
│ - id (PK)       │◄──►│ - id (PK)       │◄──►│ - id (PK)       │
│ - name          │    │ - email (UQ)    │    │ - name (UQ)     │
│ - code (UQ)     │    │ - name          │    │ - level         │
│ - province      │    │ - centerId (FK) │    │ - description   │
│ - isActive      │    │ - isActive      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼─────────┐             │
         │              │   UserRole       │             │
         │              │                 │             │
         │              │ - userId (FK)    │             │
         │              │ - roleId (FK)    │             │
         │              │ - isActive       │             │
         │              └──────────────────┘             │
         │                                              │
         │                                              │
    ┌────▼──────┐                              ┌─────▼─────┐
    │  Patient  │                              │ Permission│
    │           │                              │           │
    │ - id (PK) │                              │ - id (PK) │
    │ - MRN (UQ)│                              │ - resource│
    │ - name    │                              │ - action  │
    │ - centerId│                              │ - scope   │
    │ - ...     │                              └───────────┘
    └─────┬─────┘
          │
          │
    ┌─────▼─────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │  Medical Record   │    │   Research      │    │    Analytics     │
    │                   │    │   Request       │    │    Metrics      │
    │ - id (PK)         │    │                 │    │                 │
    │ - patientId (FK)  │    │ - id (PK)       │    │ - id (PK)       │
    │ - diagnosis       │    │ - researcherId  │    │ - centerId (FK) │
    │ - treatment       │    │ - status        │    │ - metricType    │
    │ - outcomes        │    │ - dataFields    │    │ - value         │
    │ - recordDate      │    │ - timeRange     │    │ - timestamp     │
    └───────────────────┘    └─────────────────┘    └─────────────────┘
```

### Indexing Strategy

```sql
-- Patient Table Indexes
CREATE INDEX CONCURRENTLY idx_patients_center_active
ON medical.patients(center_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY idx_patients_search
ON medical.patients USING gin(to_tsvector('english', name || ' ' || medical_record_number));

CREATE INDEX CONCURRENTLY idx_patients_birth_date
ON medical.patients(birth_date DESC) WHERE is_active = true;

-- Medical Records Indexes
CREATE INDEX CONCURRENTLY idx_medical_records_patient_date
ON medical.medical_records(patient_id, record_date DESC);

CREATE INDEX CONCURRENTLY idx_medical_records_diagnosis
ON medical.medical_records(diagnosis_primary_cancer, diagnosis_stage);

-- Audit Events Indexes
CREATE INDEX CONCURRENTLY idx_audit_events_user_timestamp
ON audit.audit_events(user_id, event_timestamp DESC);

CREATE INDEX CONCURRENTLY idx_audit_events_resource
ON audit.audit_events(resource, resource_id, event_timestamp);
```

### Partitioning Strategy

```sql
-- Time-based Partitioning for Audit Events
CREATE TABLE audit.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (event_timestamp);

-- Monthly Partitions
CREATE TABLE audit.audit_events_2025_01 PARTITION OF audit.audit_events
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE audit.audit_events_2025_02 PARTITION OF audit.audit_events
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automatic Partition Management
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    start_date date;
    end_date date;
    partition_name text;
BEGIN
    start_date := date_trunc('month', CURRENT_DATE + interval '1 month');
    end_date := start_date + interval '1 month';
    partition_name := 'audit.audit_events_' || to_char(start_date, 'YYYY_MM');

    EXECUTE format('CREATE TABLE %I PARTITION OF audit.audit_events FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- Schedule monthly partition creation
SELECT cron.schedule('create-monthly-partition', '0 0 1 * *', 'SELECT create_monthly_partition();');
```

---

## Deployment Architecture

### Kubernetes Deployment

```yaml
# Namespace Configuration
apiVersion: v1
kind: Namespace
metadata:
  name: inamsos-prod
  labels:
    name: inamsos-prod
    environment: production

---
# Application Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inamsos-api
  namespace: inamsos-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: inamsos-api
  template:
    metadata:
      labels:
        app: inamsos-api
    spec:
      containers:
      - name: api
        image: registry.inamsos.go.id/inamsos/api:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: inamsos-secrets
              key: database-url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: uploads
          mountPath: /app/uploads
      volumes:
      - name: uploads
        persistentVolumeClaim:
          claimName: inamsos-uploads-pvc

---
# Service Configuration
apiVersion: v1
kind: Service
metadata:
  name: inamsos-api-service
  namespace: inamsos-prod
spec:
  selector:
    app: inamsos-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# Ingress Configuration
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: inamsos-ingress
  namespace: inamsos-prod
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.inamsos.go.id
    secretName: inamsos-tls
  rules:
  - host: api.inamsos.go.id
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: inamsos-api-service
            port:
              number: 80
```

### Infrastructure as Code (Terraform)

```hcl
# main.tf - Infrastructure Definition

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "inamsos_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "inamsos-vpc"
    Environment = var.environment
  }
}

# EKS Cluster
resource "aws_eks_cluster" "inamsos_cluster" {
  name     = "inamsos-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = [
      aws_subnet.private_subnet_1.id,
      aws_subnet.private_subnet_2.id,
      aws_subnet.public_subnet_1.id,
      aws_subnet.public_subnet_2.id
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# RDS Database
resource "aws_db_instance" "inamsos_db" {
  identifier = "inamsos-postgres"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.m5.xlarge"

  allocated_storage     = 1000
  max_allocated_storage = 2000
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = "inamsos_prod"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.inamsos_db_subnet.name

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "inamsos-final-snapshot"

  tags = {
    Name        = "inamsos-database"
    Environment = var.environment
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "inamsos_cache_subnet" {
  name       = "inamsos-cache-subnet"
  subnet_ids = [
    aws_subnet.private_subnet_1.id,
    aws_subnet.private_subnet_2.id
  ]
}

resource "aws_elasticache_cluster" "inamsos_redis" {
  cluster_id           = "inamsos-redis"
  engine               = "redis"
  node_type            = "cache.m5.large"
  num_cache_nodes      = 3
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.inamsos_cache_subnet.name
  security_group_ids   = [aws_security_group.redis_sg.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  tags = {
    Name        = "inamsos-redis"
    Environment = var.environment
  }
}
```

---

## Monitoring Architecture

### Observability Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Metrics       │    │    Logging      │    │   Tracing       │
│                 │    │                 │    │                 │
│ Prometheus      │    │ ELK Stack       │    │   Jaeger        │
│ + Grafana       │    │ (Logstash,      │    │ + OpenTelemetry │
│   Collection    │    │  Elasticsearch, │    │   Collection    │
│   Dashboard     │    │  Kibana)        │    │   Visualization│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐            ┌────▼────┐
    │ Alerts  │            │   Search  │            │  Trace  │
    │Manager  │            │  Engine  │            │ Analysis│
    │PagerDuty│            │ Full-text│            │Performance│
    │Slack    │            │ Search   │            │ Bottleneck│
    └─────────┘            └───────────┘            └─────────┘
```

### Prometheus Metrics Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "inamsos_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'inamsos-api'
    static_configs:
      - targets: ['inamsos-api:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Custom Application Metrics

```typescript
// Metrics Service
@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal = new prom.Counter({
    name: 'inamsos_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });

  private readonly httpRequestDuration = new prom.Histogram({
    name: 'inamsos_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  });

  private readonly activeUsers = new prom.Gauge({
    name: 'inamsos_active_users_total',
    help: 'Number of currently active users'
  });

  private readonly databaseConnections = new prom.Gauge({
    name: 'inamsos_database_connections_active',
    help: 'Number of active database connections'
  });

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  observeHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }

  setDatabaseConnections(count: number) {
    this.databaseConnections.set(count);
  }
}

// Metrics Middleware
@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;

      this.metricsService.incrementHttpRequests(
        req.method,
        route,
        res.statusCode
      );
      this.metricsService.observeHttpRequestDuration(
        req.method,
        route,
        duration
      );
    });

    next();
  }
}
```

### Health Check Implementation

```typescript
// Health Check Service
@Injectable()
export class HealthService {
  constructor(
    private databaseService: DatabaseService,
    private redisService: RedisService,
    private minioService: MinioService
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMinIO(),
      this.checkDiskSpace(),
      this.checkMemoryUsage()
    ]);

    const results = checks.map((check, index) => ({
      name: ['database', 'redis', 'minio', 'disk', 'memory'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      details: check.status === 'fulfilled' ? check.value : check.reason
    }));

    const overallStatus = results.every(r => r.status === 'healthy')
      ? 'healthy'
      : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date(),
      checks: results,
      uptime: process.uptime(),
      version: process.env.npm_package_version
    };
  }

  private async checkDatabase(): Promise<DatabaseHealth> {
    const start = Date.now();
    await this.databaseService.query('SELECT 1');
    const responseTime = Date.now() - start;

    return {
      connectionPool: await this.databaseService.getConnectionPoolStatus(),
      responseTime,
      status: 'connected'
    };
  }

  private async checkRedis(): Promise<RedisHealth> {
    const start = Date.now();
    await this.redisService.ping();
    const responseTime = Date.now() - start;

    return {
      responseTime,
      memoryUsage: await this.redisService.getMemoryUsage(),
      connectedClients: await this.redisService.getConnectedClients(),
      status: 'connected'
    };
  }
}
```

---

## Future Roadmap

### Phase 2 Architecture Enhancements (Q1 2025)

#### AI/ML Integration
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Science  │    │   Model         │    │   Prediction    │
│   Pipelines     │    │   Training      │    │   APIs          │
│                 │    │                 │    │                 │
│ TensorFlow/Kubeflow│  │  MLflow        │    │   Sagemaker     │
│   Data Lake     │    │  Model Registry│    │   Real-time     │
│   Feature Store │    │  Experiment     │    │   Inference     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Mobile Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Offline       │    │   Sync          │
│   (React Native)│    │   First         │    │   Engine        │
│                 │    │   Architecture  │    │                 │
│ Field Data      │    │ Local Storage  │    │ Conflict        │
│ Collection      │    │ (SQLite)        │    │ Resolution     │
│ Patient Consent │    │ Background Sync │    │ Delta Updates   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Phase 3 Architecture Enhancements (Q3 2025)

#### Edge Computing
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Edge          │    │   Fog           │    │   Cloud         │
│   Computing     │    │   Computing     │    │   Processing    │
│                 │    │                 │    │                 │
│ Local Analytics │    │   Regional      │    │   National      │
│ Real-time       │    │   Aggregation   │    │   Analytics     │
│ Processing      │    │   Pre-processing│    │   ML Training   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### International Integration
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   INAMSOS       │    │   International │    │   Global        │
│   Indonesia     │    │   Cancer        │    │   Research     │
│                 │    │   Registries    │    │   Networks      │
│                 │    │                 │    │                 │
│ FHIR Gateway    │    │   WHO IARC      │    │   SEANODE       │
│ API Standardization│  │   Data Sharing  │    │   Collaborations│
│ Mapping         │    │   Standards     │    │   Publications  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Scalability Targets

**2025 Targets:**
- 50+ centers connected
- 500,000+ patient records
- 10,000+ concurrent users
- <2 second response times
- 99.9% uptime SLA

**2026 Targets:**
- 200+ centers connected
- 2,000,000+ patient records
- 50,000+ concurrent users
- <1 second response times
- 99.95% uptime SLA

**2027 Targets:**
- 500+ centers connected
- 10,000,000+ patient records
- 100,000+ concurrent users
- <500ms response times
- 99.99% uptime SLA

---

## Summary

Arsitektur INAMSOS dirancang untuk:

1. **Scalability**: Microservices dengan horizontal scaling
2. **Security**: Multi-layered security dengan compliance
3. **Performance**: Optimized queries dan caching
4. **Reliability**: High availability dengan fault tolerance
5. **Maintainability**: Clean architecture dengan clear separation of concerns
6. **Flexibility**: Adaptable untuk changing requirements

### Key Architectural Decisions

- **Microservices**: Service isolation dan independent scaling
- **PostgreSQL**: Robust relational database dengan advanced features
- **Kubernetes**: Container orchestration untuk cloud-native deployment
- **Event-Driven**: Loose coupling dan system resilience
- **Multi-tenant**: Scalable multi-center deployment

### Technology Rationale

- **NestJS**: Modern Node.js framework dengan enterprise features
- **TypeScript**: Type safety untuk code maintainability
- **Prisma**: Type-safe database access dengan migrations
- **Redis**: High-performance caching dan session management
- **Prometheus/Grafana**: Comprehensive monitoring stack

### Future Considerations

- **AI/ML Integration**: Advanced analytics dan predictive modeling
- **Edge Computing**: Reduced latency untuk real-time processing
- **International Standards**: Global collaboration capabilities
- **Advanced Security**: Zero-trust architecture implementation

---

**© 2025 INAMSOS - Architecture Team**
*Last Updated: November 19, 2025*
*Version: 1.0*