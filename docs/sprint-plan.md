# Sprint Plan: INAMSOS Database Tumor Nasional

**Date:** 2025-11-17
**Project Track:** BMad Method - Phase 3 Implementation
**Sprint Duration:** 2 weeks per sprint
**Development Approach:** Agile dengan Docker-based deployment

---

## 🎯 Sprint Planning Overview

### **Total Epics:** 6 dengan 58 user stories
### **Implementation Approach:** Incremental dengan focus pada core value delivery
### **Deployment Strategy:** Local Docker deployment dengan progressive feature rollout

### **Sprint Roadmap:**
1. **Sprint 0:** Foundation Setup (2 weeks)
2. **Sprint 1:** User Management & Authentication (2 weeks)
3. **Sprint 2:** Data Entry & Quality Assurance (2 weeks)
4. **Sprint 3:** Research Discovery & Collaboration (2 weeks)
5. **Sprint 4:** Analytics & Intelligence (2 weeks)
6. **Sprint 5:** System Administration & Reporting (2 weeks)

---

## 🏗️ Sprint 0: Foundation Setup (Week 1-2)

**Sprint Goal:** Establish complete development environment dan core infrastructure

### **Backend Setup (NestJS):**
```bash
# Initialize backend structure
mkdir backend && cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @prisma/client prisma
npm install class-validator class-transformer
npm install @supabase/supabase-js
npm install redis ioredis
npm install winston nest-winston
```

**Frontend Setup (Next.js):**
```bash
# Initialize frontend structure
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir
cd frontend
npm install @headlessui/react @heroicons/react
npm install @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install date-fns-tz
npm install leaflet react-leaflet
npm install chart.js react-chartjs-2
```

**Docker Environment Setup:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: inamsos
      POSTGRES_USER: inamsos
      POSTGRES_PASSWORD: inamsos_dev_2025
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

volumes:
  postgres_data:
  redis_data:
```

### **Database Schema Initialization:**
```sql
-- 01-create-extensions.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 02-create-system-schema.sql
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics;

-- 03-create-base-tables.sql
-- System tables
CREATE TABLE system.centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  province VARCHAR(100),
  regency VARCHAR(100),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE system.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID REFERENCES system.centers(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('data_entry', 'researcher', 'admin', 'national_stakeholder')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Definition of Done Sprint 0:**
- ✅ Docker environment running dengan PostgreSQL + Redis
- ✅ Backend API accessible di http://localhost:3001
- ✅ Frontend running di http://localhost:3000
- ✅ Database connection established
- ✅ Basic health check endpoints working
- ✅ Development environment documentation complete

---

## 👥 Sprint 1: User Management & Authentication (Week 3-4)

**Sprint Goal:** Implement complete user authentication system dengan role-based access control

### **Stories dari Epic 1 (User Stories 1.1-1.8):**

**Story 1.1: User Registration & Login**
- **Frontend:** Registration form dengan kolegium verification
- **Backend:** JWT authentication dengan password hashing
- **Database:** User creation dengan role assignment
- **Acceptance Criteria:** User can register, verify email, login dengan JWT token

**Story 1.2: Role-Based Access Control**
- **Frontend:** Role-based navigation dan UI
- **Backend:** JWT guards dengan role validation
- **Database:** Permission mapping per role
- **Acceptance Criteria:** 4 user roles dengan appropriate access restrictions

**Story 1.3: Center Management**
- **Frontend:** Center CRUD interface untuk admins
- **Backend:** Center management API
- **Database:** Multi-center data model
- **Acceptance Criteria:** Admin can create/edit centers with proper validation

**Story 1.4: Profile Management**
- **Frontend:** User profile update interface
- **Backend:** User profile management API
- **Acceptance Criteria:** Users can update profile dengan proper validation

### **Technical Implementation:**

**Authentication Service (NestJS):**
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    // Hash password, create user dengan kolegium verification
    // Send verification email
    // Return JWT token
  }

  async login(loginDto: LoginDto) {
    // Validate credentials
    // Generate JWT token dengan role information
    // Return user data dengan permissions
  }
}
```

**Role Guards (NestJS):**
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.some(role => user.role?.includes(role));
  }
}
```

**Frontend Auth Context (Next.js):**
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const { data: user, isLoading } = useQuery(['user'], fetchUser);
  const loginMutation = useMutation(login);
  const logoutMutation = useMutation(logout);

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated: !!user
  };
};
```

### **Definition of Done Sprint 1:**
- ✅ User registration dan login working
- ✅ 4 role types implemented dengan proper access control
- ✅ JWT tokens dengan refresh mechanism
- ✅ Center management functional
- ✅ Role-based UI navigation
- ✅ Email verification working
- ✅ Security best practices implemented (rate limiting, password policies)

---

## 📝 Sprint 2: Data Entry & Quality Assurance (Week 5-6)

**Sprint Goal:** Implement WhatsApp-inspired medical data entry dengan quality validation

### **Stories dari Epic 2 (User Stories 2.1-2.8):**

**Story 2.1: Progressive Patient Data Entry**
- **Frontend:** WhatsApp-style progressive forms dengan real-time validation
- **Backend:** Patient data API dengan medical accuracy checks
- **Database:** Patient records dengan structured tumor data
- **Acceptance Criteria:** Two-layer form design (quick + detailed) dengan auto-save

**Story 2.2: Medical Imaging Management**
- **Frontend:** Drag-and-drop image upload dengan categorization
- **Backend:** File handling dengan MinIO integration
- **Database:** Image metadata dengan medical tagging
- **Acceptance Criteria:** Support DICOM, JPEG, PNG dengan auto-categorization

**Story 2.3: Quality Assurance Workflow**
- **Frontend:** Quality score dashboard dengan drill-down
- **Backend:** Automated quality scoring algorithms
- **Database:** Quality metrics dengan trend tracking
- **Acceptance Criteria:** Real-time quality scoring >90% target

**Story 2.4: Data Entry Staff Interface**
- **Frontend:** Mobile-optimized entry interface
- **Backend:** Offline sync capabilities
- **Acceptance Criteria:** Tablet-friendly interface dengan offline support

### **Technical Implementation:**

**WhatsApp-Inspired Form Component:**
```typescript
// components/PatientDataForm.tsx
interface PatientDataFormProps {
  onSave: (data: PatientData) => void;
  initialMode: 'quick' | 'detailed';
}

const PatientDataForm: React.FC<PatientDataFormProps> = ({ onSave, initialMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [status, setStatus] = useState<DataEntryStatus>('draft');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Auto-save logic dengan debouncing
  const debouncedSave = useDebouncedCallback(async (data: Partial<PatientData>) => {
    setAutoSaveStatus('saving');
    await saveDraft(data);
    setAutoSaveStatus('saved');
    setTimeout(() => setAutoSaveStatus('idle'), 2000);
  }, 1000);

  return (
    <div className="whatsapp-inspired-form">
      <div className="status-indicators">
        <StatusIcon status={status} />
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>

      {mode === 'quick' ? (
        <QuickCaptureForm onChange={debouncedSave} />
      ) : (
        <DetailedForm onChange={debouncedSave} />
      )}

      <WhatsAppStyleActions
        onSave={() => onSave(formData)}
        onExpand={() => setMode('detailed')}
      />
    </div>
  );
};
```

**Quality Scoring Service:**
```typescript
// services/quality.service.ts
@Injectable()
export class QualityService {
  async calculateQualityScore(patientId: UUID): Promise<QualityScore> {
    const patient = await this.patientService.findById(patientId);

    let score = 0;
    const maxScore = 100;

    // Required fields check (50 points)
    const requiredFields = ['patientName', 'idNumber', 'tumorType', 'diagnosisDate'];
    const completedRequired = requiredFields.filter(field => patient[field]).length;
    score += (completedRequired / requiredFields.length) * 50;

    // Optional fields bonus (30 points)
    const optionalFields = ['medicalHistory', 'familyHistory', 'previousTreatments'];
    const completedOptional = optionalFields.filter(field => patient[field]).length;
    score += (completedOptional / optionalFields.length) * 30;

    // Image upload bonus (20 points)
    const imageCount = await this.imageService.countByPatient(patientId);
    score += Math.min(imageCount * 5, 20);

    return {
      score: Math.round(score),
      completeness: completedRequired / requiredFields.length,
      imageCount,
      recommendations: this.generateRecommendations(patient, score)
    };
  }
}
```

### **Definition of Done Sprint 2:**
- ✅ WhatsApp-inspired data entry interface working
- ✅ Progressive disclosure (quick → detailed) functional
- ✅ Auto-save dengan draft recovery
- ✅ Medical imaging upload dengan categorization
- ✅ Real-time quality scoring dashboard
- ✅ Mobile-optimized interface
- ✅ Offline sync capabilities
- ✅ Medical validation rules implemented

---

## 🔍 Sprint 3: Research Discovery & Collaboration (Week 7-8)

**Sprint Goal:** Enable researchers to discover cancer patterns dan request data access

### **Stories dari Epic 3 & 4 (User Stories 3.1-4.5):**

**Story 3.1: Aggregate Data Discovery**
- **Frontend:** Interactive cancer statistics browser
- **Backend:** Aggregate data API dengan privacy controls
- **Database:** Materialized views untuk performance
- **Acceptance Criteria:** Browse anonymized aggregate data without approval

**Story 3.2: Geographic Cancer Visualization**
- **Frontend:** Interactive Indonesia map dengan cancer hotspots
- **Backend:** PostGIS geographic queries
- **Database:** Geographic indexing dengan province/regency data
- **Acceptance Criteria:** Real-time cancer distribution mapping

**Story 4.1: Research Data Requests**
- **Frontend:** Structured request form dengan compliance checking
- **Backend:** Request workflow dengan approval process
- **Database:** Request tracking dengan audit trails
- **Acceptance Criteria:** Multi-level approval system dengan time-limited access

### **Technical Implementation:**

**Geographic Visualization Component:**
```typescript
// components/CancerMap.tsx
const CancerMap: React.FC = () => {
  const { data: cancerData } = useQuery(['cancer-distribution'], fetchCancerDistribution);

  return (
    <div className="cancer-map-container">
      <MapContainer
        center={[-2.5, 118]} // Indonesia center
        zoom={5}
        style={{ height: '600px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {cancerData?.map((province) => (
          <GeoJSON
            key={province.provinceId}
            data={province.geometry}
            style={{
              fillColor: getHeatmapColor(province.incidenceRate),
              weight: 1,
              opacity: 1,
              fillOpacity: 0.7
            }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <strong>${province.name}</strong><br/>
                Cancer Incidence: ${province.incidenceRate}<br/>
                Total Cases: ${province.totalCases}
              `);
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
```

**Research Request Workflow:**
```typescript
// services/research-request.service.ts
@Injectable()
export class ResearchRequestService {
  async submitRequest(request: CreateResearchRequestDto, userId: UUID) {
    // Automated compliance checking
    const complianceCheck = await this.validateCompliance(request);

    if (complianceCheck.requiresManualReview) {
      // Route to center administrators for approval
      return this.createPendingRequest(request, userId, 'pending_review');
    }

    // Auto-approve for low-risk aggregate data requests
    return this.createApprovedRequest(request, userId, complianceCheck.dataLevel);
  }

  private async validateCompliance(request: CreateResearchRequestDto) {
    // Check IRB approval status
    // Validate patient consent levels
    // Apply data minimization principles
    // Generate appropriate anonymization level
  }
}
```

### **Definition of Done Sprint 3:**
- ✅ Aggregate data browsing functional
- ✅ Interactive geographic cancer map working
- ✅ Research request workflow implemented
- ✅ Compliance automation working
- ✅ Multi-level approval system functional
- ✅ Time-limited data access controls
- ✅ Research collaboration tools ready

---

## 📊 Sprint 4: Analytics & Intelligence (Week 9-10)

**Sprint Goal:** Provide real-time cancer intelligence dashboard untuk national stakeholders

### **Stories dari Epic 5 (User Stories 5.1-5.5):**

**Story 5.1: Real-time Cancer Intelligence Dashboard**
- **Frontend:** Executive dashboard dengan key metrics
- **Backend:** Real-time aggregation dengan Redis caching
- **Database:** Materialized views dengan auto-refresh
- **Acceptance Criteria:** Real-time cancer distribution maps dengan trend analysis

**Story 5.2: Center Performance Analytics**
- **Frontend:** Benchmarking dashboard dengan performance metrics
- **Backend:** Center comparison analytics dengan risk adjustment
- **Acceptance Criteria:** Multi-center performance tracking dengan recommendations

### **Technical Implementation:**

**Real-time Analytics Service:**
```typescript
// services/analytics.service.ts
@Injectable()
export class AnalyticsService {
  async getNationalCancerIntelligence(): Promise<CancerIntelligence> {
    const cacheKey = 'national:cancer:intelligence';

    // Try cache first for performance
    const cached = await this.redisService.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Generate real-time intelligence
    const intelligence = await this.generateIntelligence();

    // Cache for 5 minutes
    await this.redisService.setex(cacheKey, 300, JSON.stringify(intelligence));

    return intelligence;
  }

  private async generateIntelligence() {
    // Aggregate from all center schemas
    // Calculate trends dan patterns
    // Generate predictive indicators
    // Compile benchmarking data
  }
}
```

### **Definition of Done Sprint 4:**
- ✅ Real-time cancer intelligence dashboard
- ✅ National metrics dengan drill-down capabilities
- ✅ Center performance benchmarking
- ✅ Trend analysis dengan predictive indicators
- ✅ Research impact tracking
- ✅ Executive reporting ready

---

## ⚙️ Sprint 5: System Administration & Reporting (Week 11-12)

**Sprint Goal:** Complete system administration capabilities dan comprehensive reporting

### **Stories dari Epic 6 (User Stories 6.1-6.15):**

**Story 6.1: Custom Report Generation**
- **Frontend:** Report builder dengan drag-and-drop interface
- **Backend:** Report generation engine dengan multiple formats
- **Acceptance Criteria:** Customizable reports dengan scheduling capabilities

**Story 6.2: System Administration Dashboard**
- **Frontend:** Admin interface untuk system management
- **Backend:** System monitoring dengan health checks
- **Acceptance Criteria:** Complete system administration capabilities

**Story 6.3: Backup & Disaster Recovery**
- **Infrastructure:** Automated backup strategies
- **Monitoring:** Health check dengan alerting
- **Acceptance Criteria:** Production-ready deployment dengan disaster recovery

### **Definition of Done Sprint 5:**
- ✅ Custom report generation working
- ✅ System administration dashboard complete
- ✅ Backup dan monitoring systems operational
- ✅ Production deployment ready
- ✅ All 58 user stories implemented
- ✅ Complete end-to-end testing passed

---

## 🚀 Deployment Strategy

### **Development Environment:**
- **Local Docker:** Setup di development machines
- **Git Workflow:** Feature branches dengan pull requests
- **CI/CD:** Automated testing dan deployment validation

### **Production Deployment:**
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Health checks
curl http://localhost:3001/health
curl http://localhost:3000

# Database backup
docker-compose exec postgres pg_dump -U inamsos inamsos > backup_$(date +%Y%m%d).sql
```

### **Monitoring & Maintenance:**
- **Health Checks:** Automated endpoint monitoring
- **Performance Monitoring:** Response time dan resource usage tracking
- **Backup Strategy:** Daily automated backups dengan 30-day retention
- **Security Updates:** Regular dependency updates dan security patches

---

## 📈 Success Metrics

### **Development Metrics:**
- **Velocity:** Target 8-10 story points per sprint
- **Quality:** <5 bugs per sprint, automated testing coverage >80%
- **Technical Debt:** Code review acceptance rate >95%

### **Business Metrics (per PRD):**
- **Research Publication Velocity:** 50+ papers annually
- **Researcher Engagement:** 80% active within 6 months
- **Data Quality:** >90% completeness across centers
- **System Adoption:** 95% centers feeding real-time data

---

## 🎉 Sprint Completion Checklist

**Sprint Completion Criteria:**
- ✅ All stories meet Definition of Done
- ✅ Automated testing passes
- ✅ Code review completed
- ✅ Documentation updated
- ✅ Stakeholder demo conducted
- ✅ Retrospective completed
- ✅ Next sprint planning ready

**Product Release Readiness:**
- ✅ All 6 epics implemented
- ✅ End-to-end user journeys tested
- ✅ Performance benchmarks met
- ✅ Security audit completed
- ✅ Production deployment ready
- ✅ User training materials prepared

---

## 📝 Conclusion

Sprint plan ini menyediakan roadmap yang jelas untuk mengimplementasikan INAMSOS dalam 10 weeks (5 sprints). Dengan focus pada incremental value delivery dan continuous feedback, proyek akan menghasilkan database tumor nasional yang scalable, secure, dan memberikan impact signifikan bagi cancer research di Indonesia.