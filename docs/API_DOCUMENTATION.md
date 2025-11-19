# Dokumentasi API INAMSOS

**Indonesia National Cancer Database System - API Reference**

[![API Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://api.inamsos.go.id)
[![Base URL](https://img.shields.io/badge/base_url-https://api.inamsos.go.id-green.svg)](https://api.inamsos.go.id)
[![Format](https://img.shields.io/badge/format-JSON-orange.svg)](https://www.json.org/)
[![Authentication](https://img.shields.io/badge/auth-JWT-red.svg)](https://jwt.io/)

## Daftar Isi

- [Ringkasan](#ringkasan)
- [Authentication](#authentication)
- [Base URL & Headers](#base-url--headers)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Patients](#patients)
  - [Medical Records](#medical-records)
  - [Research](#research)
  - [Analytics](#analytics)
  - [Centers](#centers)
  - [Users](#users)
  - [Reports](#reports)
  - [System Administration](#system-administration)
- [Data Models](#data-models)
- [Examples](#examples)
- [SDK & Libraries](#sdk--libraries)

---

## Ringkasan

INAMSOS API menyediakan akses programatik ke Indonesia National Cancer Database System. API ini dirancang untuk mendukung:

- **Entry Data Pasien**: Input data tumor dan medis pasien
- **Akses Penelitian**: Browse data agregat dan request data penelitian
- **Analytics**: Generate insights dan laporan kanker
- **System Administration**: Manajemen pengguna dan konfigurasi sistem

### Key Features

- ✅ **RESTful API**: Mengikuti standar REST
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-based Access Control**: Multi-level permissions
- ✅ **Real-time Validation**: Input validation server-side
- ✅ **Comprehensive Audit Trails**: Complete activity logging
- ✅ **Healthcare Standards**: Support HL7/FHIR formats
- ✅ **Multi-tenant Support**: Center-based data isolation

---

## Authentication

### JWT Token Setup

Semua API requests (kecuali public endpoints) memerlukan JWT token:

```http
Authorization: Bearer <your_jwt_token>
```

### Mendapatkan Token

1. **Login** untuk mendapatkan access token dan refresh token
2. **Verify MFA** jika multi-factor authentication diaktifkan
3. **Use Access Token** untuk API requests
4. **Refresh Token** sebelum expiry

### Token Structure

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Token Refresh

Refresh access token sebelum expiry:

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

---

## Base URL & Headers

### Base URLs

- **Production**: `https://api.inamsos.go.id/v1`
- **Staging**: `https://staging-api.inamsos.go.id/v1`
- **Development**: `http://localhost:3000/v1`

### Required Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
X-API-Version: 1.0
X-Center-ID: <center_id>  // Multi-tenant requests
```

### Optional Headers

```http
X-Request-ID: <unique_request_id>
Accept-Language: id-ID, en-US
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "patient.name",
        "message": "Name is required"
      }
    ],
    "timestamp": "2025-11-19T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes

| Status | Code | Description |
|--------|------|-------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

| Code | Category | Examples |
|------|----------|----------|
| `AUTH_*` | Authentication | `AUTH_INVALID_TOKEN`, `AUTH_MFA_REQUIRED` |
| `PERM_*` | Permissions | `PERM_INSUFFICIENT_ROLE`, `PERM_CENTER_ACCESS` |
| `VALIDATION_*` | Input Validation | `VALIDATION_REQUIRED_FIELD`, `VALIDATION_INVALID_FORMAT` |
| `BUSINESS_*` | Business Logic | `BUSINESS_DUPLICATE_PATIENT`, `BUSINESS_APPROVAL_REQUIRED` |
| `SYSTEM_*` | System Errors | `SYSTEM_DATABASE_ERROR`, `SYSTEM_EXTERNAL_SERVICE` |

---

## Rate Limiting

### Rate Limits

- **Authenticated Users**: 1000 requests/hour
- **Research Users**: 5000 requests/hour
- **Admin Users**: 10000 requests/hour
- **Burst Limit**: 100 requests/minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## API Endpoints

## Authentication Endpoints

### User Registration

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "Dr. John Doe",
  "password": "SecurePassword123!",
  "kolegiumId": "KOL123456",
  "centerId": "center_123",
  "phone": "+628123456789",
  "roles": ["DATA_ENTRY"]
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Dr. John Doe",
    "isActive": false,
    "isEmailVerified": false
  },
  "verificationToken": "verify_token_here"
}
```

### User Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (MFA Disabled):**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Dr. John Doe",
    "roles": ["DATA_ENTRY"],
    "centerId": "center_123"
  }
}
```

**Response (MFA Required):**
```json
{
  "tempToken": "temp_mfa_token",
  "mfaRequired": true,
  "mfaMethods": ["TOTP", "SMS"],
  "message": "MFA verification required"
}
```

### Verify MFA

```http
POST /auth/verify-mfa
```

**Request Body:**
```json
{
  "tempToken": "temp_mfa_token",
  "mfaCode": "123456"
}
```

**Response:**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "Dr. John Doe"
  }
}
```

### Get User Profile

```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "Dr. John Doe",
  "kolegiumId": "KOL123456",
  "phone": "+628123456789",
  "isActive": true,
  "isEmailVerified": true,
  "mfaEnabled": true,
  "center": {
    "id": "center_123",
    "name": "RSUP Dr. Cipto Mangunkusumo",
    "code": "RSCM"
  },
  "roles": [
    {
      "id": "role_123",
      "name": "Data Entry Staff",
      "code": "DATA_ENTRY",
      "level": 1
    }
  ]
}
```

---

## Patients

### Get Patients List

```http
GET /patients?page=1&limit=50&search=john&centerId=center_123
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 50, max: 100)
- `search` (string): Search by name, NIK, MRN, or phone
- `centerId` (string): Filter by center
- `includeInactive` (boolean): Include inactive patients
- `gender` (string): Filter by gender (MALE, FEMALE)
- `ageMin` (integer): Minimum age
- `ageMax` (integer): Maximum age

**Response:**
```json
{
  "data": [
    {
      "id": "patient_123",
      "medicalRecordNumber": "MRN2025001",
      "nik": "3201011234567890",
      "name": "John Doe",
      "gender": "MALE",
      "birthDate": "1980-01-01",
      "age": 45,
      "bloodType": "A",
      "maritalStatus": "MARRIED",
      "phone": "+628123456789",
      "address": "Jakarta, Indonesia",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "center": {
        "id": "center_123",
        "name": "RSUP Dr. Cipto Mangunkusumo"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Create New Patient

```http
POST /patients
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "medicalRecordNumber": "MRN2025002",
  "nik": "3201011234567891",
  "name": "Jane Smith",
  "gender": "FEMALE",
  "birthDate": "1985-05-15",
  "bloodType": "O",
  "maritalStatus": "SINGLE",
  "phone": "+628987654321",
  "email": "jane.smith@example.com",
  "address": {
    "street": "Jl. Sudirman No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345",
    "country": "Indonesia"
  },
  "emergencyContact": {
    "name": "Bob Smith",
    "relationship": "Husband",
    "phone": "+6281122334455"
  }
}
```

**Response:**
```json
{
  "id": "patient_124",
  "medicalRecordNumber": "MRN2025002",
  "nik": "3201011234567891",
  "name": "Jane Smith",
  "gender": "FEMALE",
  "birthDate": "1985-05-15",
  "age": 40,
  "isActive": true,
  "createdAt": "2025-11-19T11:00:00Z",
  "createdBy": {
    "id": "user_123",
    "name": "Dr. John Doe"
  }
}
```

### Get Patient Details

```http
GET /patients/{patientId}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "patient_123",
  "medicalRecordNumber": "MRN2025001",
  "nik": "3201011234567890",
  "name": "John Doe",
  "gender": "MALE",
  "birthDate": "1980-01-01",
  "age": 45,
  "bloodType": "A",
  "maritalStatus": "MARRIED",
  "phone": "+628123456789",
  "email": "john.doe@example.com",
  "address": {
    "street": "Jl. Thamrin No. 45",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Wife",
    "phone": "+628987654321"
  },
  "medicalRecords": [
    {
      "id": "record_123",
      "recordDate": "2025-01-15",
      "diagnosis": "Lung Cancer",
      "stage": "Stage IIIA",
      "physician": "Dr. Sarah Wilson"
    }
  ],
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-11-18T15:45:00Z"
}
```

### Update Patient Information

```http
PUT /patients/{patientId}
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "phone": "+628123456780",
  "email": "new.email@example.com",
  "address": {
    "street": "Jl. Sudirman No. 100",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12346"
  }
}
```

---

## Medical Records

### Create Medical Record

```http
POST /medical-records
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "patientId": "patient_123",
  "recordDate": "2025-11-19",
  "diagnosis": {
    "primaryCancer": "Lung Cancer",
    "histology": "Adenocarcinoma",
    "grade": "Moderately Differentiated",
    "stage": "Stage IIIA",
    "tnm": {
      "t": "T2a",
      "n": "N2",
      "m": "M0"
    },
    "icd10Code": "C78.0"
  },
  "clinicalPresentation": {
    "symptoms": ["Persistent cough", "Weight loss", "Chest pain"],
    "symptomDuration": "3 months",
    "ecogStatus": 1
  },
  "diagnosticProcedures": [
    {
      "type": "Biopsy",
      "date": "2025-10-15",
      "result": "Positive for adenocarcinoma",
      "location": "Left upper lobe"
    }
  ],
  "treatmentPlan": {
    "modality": ["Chemotherapy", "Radiation"],
    "regimen": "Carboplatin + Paclitaxel",
    "cycles": 6,
    "targetDose": "60 Gy"
  },
  "physician": "Dr. Sarah Wilson",
  "notes": "Patient presented with stage IIIA lung adenocarcinoma"
}
```

**Response:**
```json
{
  "id": "record_456",
  "patientId": "patient_123",
  "recordDate": "2025-11-19",
  "diagnosis": {
    "primaryCancer": "Lung Cancer",
    "stage": "Stage IIIA",
    "icd10Code": "C78.0"
  },
  "createdAt": "2025-11-19T12:00:00Z",
  "createdBy": {
    "id": "user_123",
    "name": "Dr. John Doe"
  }
}
```

### Get Medical Records

```http
GET /medical-records?patientId=patient_123&page=1&limit=20
Authorization: Bearer <jwt_token>
```

---

## Research

### Browse Aggregated Data

```http
GET /research/data?cancerType=Lung%20Cancer&year=2024&province=DKI%20Jakarta
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `cancerType` (string): Filter by cancer type
- `year` (integer): Filter by year
- `province` (string): Filter by province
- `ageGroup` (string): Filter by age group
- `gender` (string): Filter by gender
- `stage` (string): Filter by cancer stage

**Response:**
```json
{
  "metadata": {
    "totalCases": 1250,
    "dataFreshness": "2025-11-18",
    "anonymizationLevel": "AGGREGATE_ONLY"
  },
  "demographics": {
    "genderDistribution": {
      "MALE": 65.2,
      "FEMALE": 34.8
    },
    "ageDistribution": {
      "0-19": 2.1,
      "20-39": 12.5,
      "40-59": 45.8,
      "60+": 39.6
    }
  },
  "geographicDistribution": [
    {
      "province": "DKI Jakarta",
      "cases": 425,
      "percentage": 34.0
    },
    {
      "province": "Jawa Barat",
      "cases": 312,
      "percentage": 25.0
    }
  ],
  "stageDistribution": {
    "Stage I": 15.2,
    "Stage II": 22.8,
    "Stage III": 38.4,
    "Stage IV": 23.6
  }
}
```

### Submit Data Request

```http
POST /research/requests
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Lung Cancer Treatment Outcomes in Indonesia",
  "researchType": "CLINICAL_OUTCOME",
  "description": "Analysis of treatment outcomes for lung cancer patients across Indonesian hospitals",
  "dataRequirements": {
    "cancerTypes": ["Lung Cancer"],
    "timeRange": {
      "start": "2020-01-01",
      "end": "2024-12-31"
    },
    "dataFields": [
      "demographics",
      "diagnosis",
      "treatment",
      "outcomes"
    ],
    "anonymizationLevel": "PSEUDO_ANONYMIZED"
  },
  "methodology": "Retrospective cohort study",
  "expectedOutcomes": "Treatment effectiveness analysis",
  "collaborators": [
    {
      "name": "Dr. Jane Smith",
      "institution": "Universitas Indonesia",
      "email": "jane.smith@ui.ac.id"
    }
  ]
}
```

**Response:**
```json
{
  "id": "request_789",
  "status": "PENDING_CENTER_APPROVAL",
  "submittedAt": "2025-11-19T13:00:00Z",
  "referenceNumber": "REQ-2025-00123",
  "estimatedReviewTime": "14 working days"
}
```

---

## Analytics

### Get Dashboard Metrics

```http
GET /analytics/dashboard?centerId=center_123&period=monthly&year=2024
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "overview": {
    "totalPatients": 15420,
    "newPatientsThisMonth": 342,
    "activeResearchProjects": 45,
    "dataQualityScore": 94.2
  },
  "trends": {
    "patientGrowth": [
      {
        "month": "Jan-2024",
        "count": 1280,
        "growth": 5.2
      }
    ],
    "cancerTypeTrends": [
      {
        "cancerType": "Lung Cancer",
        "cases": 3420,
        "percentageChange": 12.5
      }
    ]
  },
  "qualityMetrics": {
    "dataCompleteness": 94.2,
    "validationScore": 96.8,
    "auditCompliance": 99.1
  }
}
```

### Generate Reports

```http
POST /analytics/reports
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "reportType": "EPIDEMIOLOGICAL_SUMMARY",
  "parameters": {
    "timeRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    },
    "cancerTypes": ["Breast Cancer", "Lung Cancer"],
    "geographicScope": "NATIONAL",
    "includeTrends": true,
    "includeProjections": false
  },
  "format": "PDF",
  "deliveryMethod": "EMAIL"
}
```

**Response:**
```json
{
  "reportId": "report_456",
  "status": "GENERATING",
  "estimatedCompletion": "2025-11-19T14:30:00Z",
  "deliveryInfo": {
    "email": "user@example.com",
    "format": "PDF"
  }
}
```

---

## Centers

### Get Centers List

```http
GET /centers?province=DKI%20Jakarta&isActive=true
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "center_123",
      "name": "RSUP Dr. Cipto Mangunkusumo",
      "code": "RSCM",
      "province": "DKI Jakarta",
      "regency": "Jakarta Pusat",
      "address": "Jl. Diponegoro No. 71",
      "isActive": true,
      "patientCount": 5420,
      "lastDataUpdate": "2025-11-18T16:00:00Z"
    }
  ]
}
```

---

## Data Models

### Patient Model

```typescript
interface Patient {
  id: string;
  medicalRecordNumber: string;
  nik: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  age: number;
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  phone?: string;
  email?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Medical Record Model

```typescript
interface MedicalRecord {
  id: string;
  patientId: string;
  recordDate: string;
  diagnosis: Diagnosis;
  clinicalPresentation?: ClinicalPresentation;
  diagnosticProcedures?: DiagnosticProcedure[];
  treatmentPlan?: TreatmentPlan;
  physician: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}
```

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  kolegiumId?: string;
  phone?: string;
  nik?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  centerId: string;
  roles: Role[];
  createdAt: string;
  lastLoginAt?: string;
}
```

---

## Examples

### Complete Patient Registration Workflow

```javascript
// 1. Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@hospital.com',
    password: 'password123'
  })
});

const { accessToken } = await loginResponse.json();

// 2. Create Patient
const patientResponse = await fetch('/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    medicalRecordNumber: 'MRN2025003',
    name: 'New Patient',
    gender: 'FEMALE',
    birthDate: '1990-05-20',
    // ... other patient data
  })
});

const patient = await patientResponse.json();

// 3. Add Medical Record
const recordResponse = await fetch('/medical-records', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    patientId: patient.id,
    recordDate: '2025-11-19',
    diagnosis: {
      primaryCancer: 'Breast Cancer',
      stage: 'Stage II'
    },
    physician: 'Dr. Smith'
  })
});
```

### Research Data Analysis

```javascript
// Browse cancer trends
const trendsResponse = await fetch('/research/data?' + new URLSearchParams({
  cancerType: 'Breast Cancer',
  year: '2024',
  province: 'DKI Jakarta'
}), {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const trends = await trendsResponse.json();

// Submit research request
const requestResponse = await fetch('/research/requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'Breast Cancer Patterns in Jakarta',
    researchType: 'EPIDEMIOLOGICAL',
    dataRequirements: {
      cancerTypes: ['Breast Cancer'],
      timeRange: {
        start: '2020-01-01',
        end: '2024-12-31'
      }
    }
  })
});
```

---

## SDK & Libraries

### Official SDKs

- **JavaScript/TypeScript**: `npm install @inamsos/api-client`
- **Python**: `pip install inamsos-python`
- **Java**: Maven dependency `com.inamsos:api-client`

### Usage Examples

#### JavaScript SDK

```javascript
import { INAMSOSClient } from '@inamsos/api-client';

const client = new INAMSOSClient({
  baseURL: 'https://api.inamsos.go.id/v1',
  apiKey: 'your-api-key'
});

// Login and get token
await client.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Create patient
const patient = await client.patients.create({
  name: 'John Doe',
  gender: 'MALE',
  birthDate: '1980-01-01'
});
```

#### Python SDK

```python
from inamosos import INAMSOSClient

client = INAMSOSClient(
    base_url='https://api.inamsos.go.id/v1',
    api_key='your-api-key'
)

# Login
client.auth.login(
    email='user@example.com',
    password='password123'
)

# Get patients
patients = client.patients.list(
    search='john',
    page=1,
    limit=50
)
```

---

## Support

### Documentation
- **API Reference**: https://docs.inamsos.go.id/api
- **SDK Documentation**: https://docs.inamsos.go.id/sdk
- **Postman Collection**: [Download](https://api.inamsos.go.id/postman-collection)

### Contact
- **Technical Support**: api-support@inamsos.go.id
- **Documentation Issues**: docs@inamsos.go.id
- **Status Page**: https://status.inamsos.go.id

### Community
- **Developer Forum**: https://community.inamsos.go.id
- **GitHub Issues**: https://github.com/inamsos/api/issues
- **Stack Overflow**: Tag dengan `inamsos-api`

---

**© 2025 INAMSOS - Indonesia National Cancer Database System**
*API Version 1.0.0 - Last Updated: November 19, 2025*