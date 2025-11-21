# 👥 INAMSOS USER ROLES - COMPLETE GUIDE

## 📋 **Overview**
Sistem INAMSOS (Indonesia National Cancer Database System) memiliki **6 (enam) tipe user** dengan tingkatan akses dan tanggung jawab yang berbeda-beda. Setiap user role dirancang untuk memenuhi kebutuhan spesifik dalam pengelolaan data kanker di Indonesia.

---

## 🔐 **DAFTAR LENGKAP USER TYPES & CREDENTIALS**

### **1. SYSTEM_ADMIN** 👑
- **Email**: `admin@inamsos.go.id`
- **Password**: `AdminInamsos123!`
- **Nama**: System Administrator
- **Center**: INAMSOS Headquarters
- **Role Code**: `SYSTEM_ADMIN`

### **2. DOCTOR** 🩺
- **Email**: `doctor@inamsos.go.id`
- **Password**: `DoctorInamsos123!`
- **Nama**: Dr. Siti Nurhaliza
- **Center**: RS Kanker Dharmais
- **Role Code**: `DOCTOR`

### **3. NURSE** 🏥
- **Email**: `nurse@inamsos.go.id`
- **Password**: `NurseInamsos123!`
- **Nama**: Nurse Ahmad Yani
- **Center**: RSUPN Cipto Mangunkusumo
- **Role Code**: `NURSE`

### **4. RESEARCHER** 🔬
- **Email**: `researcher@inamsos.go.id`
- **Password**: `ResearcherInamsos123!`
- **Nama**: Dr. Budi Santoso
- **Center**: RS Kanker Soeharto
- **Role Code**: `RESEARCHER`

### **5. DATA_ENTRY** 📝
- **Role Code**: `data_entry`
- **Fungsi**: Input data pasien
- **Center**: Various hospitals

### **6. NATIONAL_STAKEHOLDER** 🏛️
- **Role Code**: `national_stakeholder`
- **Fungsi**: Monitoring nasional
- **Level**: National level access

---

## 🎯 **PERBEDAAN UTAMA SETIAP USER TYPE**

### **📊 Akses Menu Navigasi**

| Menu | SYSTEM_ADMIN | DOCTOR | NURSE | RESEARCHER | DATA_ENTRY | NATIONAL_STAKEHOLDER |
|------|--------------|--------|-------|------------|-------------|---------------------|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Data Pasien** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Penelitian** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Analytics** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Administrasi** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Laporan** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Pengaturan** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 **DETAILED PERMISSIONS & RESPONSIBILITIES**

### **1. SYSTEM_ADMIN** 👑
**Level**: Tertinggi / Super Admin
**Akses Penuh**: Seluruh sistem

#### **✅ Permissions**:
- **User Management**: Create, edit, delete semua user
- **Center Management**: Manage semua rumah sakit/cancer center
- **System Configuration**: Pengaturan sistem keseluruhan
- **Backup & Restore**: Full backup system access
- **Reports**: Semua jenis laporan
- **Analytics**: Seluruh data analytics
- **Audit Trail**: Access ke semua audit logs
- **Security Management**: SSL, security settings
- **Database Management**: Full database access

#### **🎯 Primary Responsibilities**:
- System maintenance and upgrades
- User account management
- Security oversight
- Performance monitoring
- Backup and disaster recovery
- Integration with external systems

#### **🏥 Center Access**:
INAMSOS Headquarters (National Level)

---

### **2. DOCTOR** 🩺
**Level**: Medical Professional
**Spesialisasi**: Data medis pasien

#### **✅ Permissions**:
- **Patient Records**: View & edit data medis pasien
- **Diagnosis Entry**: Input diagnosis dan staging
- **Treatment Plans**: Create dan edit rencana treatment
- **Medical Reports**: Generate laporan medis
- **Patient Search**: Access ke database pasien
- **Clinical Data**: Input data klinis
- **Referrals**: Create patient referrals

#### **❌ Restrictions**:
- Tidak bisa akses administrasi sistem
- Tidak bisa manage user lain
- Tidak bisa akses analytics tingkat nasional
- Tidak bisa delete data permanen

#### **🎯 Primary Responsibilities**:
- Input accurate medical data
- Patient diagnosis and staging
- Treatment planning and monitoring
- Quality control of medical data
- Collaboration with other medical staff

#### **🏥 Center Access**:
RS Kanker Dharmais (Hospital Level)

---

### **3. NURSE** 🏥
**Level**: Medical Support Staff
**Spesialisasi**: Data input dan monitoring pasien

#### **✅ Permissions**:
- **Patient Data Entry**: Input data demografis pasien
- **Vital Signs**: Input data tanda-tanda vital
- **Medication Records**: Input data obat-obatan
- **Progress Notes**: Update catatan perawatan
- **Basic Reports**: Generate laporan perawatan
- **Schedule Management**: Manage jadwal perawatan

#### **❌ Restrictions**:
- Tidak bisa input diagnosis (hanya doctor)
- Tidak bisa akses data sensitif pasien lain
- Tidak bisa delete data medis
- Tidak bisa akses analytics tingkat tinggi

#### **🎯 Primary Responsibilities**:
- Accurate data entry
- Patient care documentation
- Vital signs monitoring
- Medication administration records
- Communication with doctors

#### **🏥 Center Access**:
RSUPN Cipto Mangunkusumo (Hospital Level)

---

### **4. RESEARCHER** 🔬
**Level**: Research Staff
**Spesialisasi**: Data analytics dan penelitian

#### **✅ Permissions**:
- **Research Data Access**: Akses ke data untuk penelitian
- **Analytics Tools**: Advanced analytics dan reporting
- **Research Requests**: Submit research proposals
- **Data Export**: Export data untuk penelitian (anonymized)
- **Collaboration**: Multi-center research collaboration
- **Statistical Analysis**: Tools untuk analisis statistik
- **Publication Support**: Generate laporan untuk publikasi

#### **❌ Restrictions**:
- Tidak bisa akses data identitas pasien tanpa approval
- Tidak bisa edit data medis langsung
- Tidak bisa akses administrative functions
- Data access melalui approval process

#### **🎯 Primary Responsibilities**:
- Conduct cancer research
- Analyze population health data
- Generate research reports
- Collaborate with international researchers
- Publication of research findings

#### **🏥 Center Access**:
RS Kanker Soeharto (Research Hospital Level)

---

### **5. DATA_ENTRY** 📝
**Level**: Data Entry Staff
**Spesialisasi**: Input data dasar

#### **✅ Permissions**:
- **Basic Data Entry**: Input data pasien dasar
- **Form Completion**: Complete standardized forms
- **Data Validation**: Validate data completeness
- **Quality Checks**: Basic quality control
- **Import/Export**: Data import from external sources

#### **❌ Restrictions**:
- Hanya bisa input, tidak bisa edit data medis
- Tidak bisa akses data sensitif
- Tidak bisa generate reports
- Tidak bisa delete data

#### **🎯 Primary Responsibilities**:
- Accurate data transcription
- Form completion
- Data quality assurance
- Following data entry protocols

#### **🏥 Center Access**:
Various hospitals (Assigned per center)

---

### **6. NATIONAL_STAKEHOLDER** 🏛️
**Level**: Government/Policy Level
**Spesialisasi**: Monitoring dan kebijakan

#### **✅ Permissions**:
- **National Analytics**: Akses ke statistik nasional
- **Policy Reports**: Generate laporan untuk kebijakan
- **Trend Analysis**: Analisis trend kanker nasional
- **International Reporting**: Data untuk organisasi internasional
- **Strategic Planning**: Data untuk perencanaan strategis

#### **❌ Restrictions**:
- Tidak bisa akses data individual pasien
- Tidak bisa akses data tingkat hospital
- Hanya aggregated data
- Tidak ada editing capabilities

#### **🎯 Primary Responsibilities**:
- Health policy development
- National cancer program planning
- International reporting (WHO, IARC, etc.)
- Resource allocation planning
- Public health monitoring

#### **🏥 Center Access**:
National Level (All centers aggregated)

---

## 🔒 **SECURITY LEVELS**

| Level | User Types | Access Scope | Data Sensitivity |
|-------|------------|--------------|------------------|
| **Level 1 - Highest** | SYSTEM_ADMIN | Complete System | Full Access |
| **Level 2 - Medical** | DOCTOR, NURSE | Patient Records | Medical Data |
| **Level 3 - Research** | RESEARCHER | Research Data | Anonymized Data |
| **Level 4 - Operations** | DATA_ENTRY | Basic Operations | Limited Data |
| **Level 5 - Government** | NATIONAL_STAKEHOLDER | National Stats | Aggregated Data |

---

## 🏥 **CENTER HIERARCHY**

### **National Level**
- **INAMSOS Headquarters** (SYSTEM_ADMIN)
- Coordinate all cancer centers nationally
- Policy and standard setting

### **Regional/Cancer Center Level**
- **RS Kanker Dharmais** (DOCTOR)
- **RS Kanker Soeharto** (RESEARCHER)
- **RSUPN Cipto Mangunkusumo** (NURSE)
- Hospital-level data management
- Direct patient care

### **Multi-Center Access**
- **DATA_ENTRY** - Assigned to specific centers
- **NATIONAL_STAKEHOLDER** - Access to all centers (aggregated)

---

## 📊 **WORKFLOW EXAMPLES**

### **Patient Data Entry Workflow**
```
1. DATA_ENTRY: Input patient demographics
2. NURSE: Add vital signs and basic care data
3. DOCTOR: Input diagnosis and treatment plan
4. RESEARCHER: Analyze anonymized data for research
5. NATIONAL_STAKEHOLDER: Review national statistics
6. SYSTEM_ADMIN: Monitor system performance
```

### **Research Request Workflow**
```
1. RESEARCHER: Submit research proposal
2. DOCTOR: Provide medical expertise (consultation)
3. SYSTEM_ADMIN: Approve data access request
4. RESEARCHER: Access anonymized data
5. RESEARCHER: Generate research report
6. NATIONAL_STAKEHOLDER: Review research outcomes
```

---

## 🚀 **TECHNICAL IMPLEMENTATION**

### **Authentication Flow**
```javascript
// JWT Token contains:
{
  sub: 'user-id',
  email: 'user@inamsos.go.id',
  role: 'SYSTEM_ADMIN', // atau role lainnya
  centerId: 'center-001',
  iat: 1234567890,
  exp: 1234567890
}
```

### **Role-Based Access Control (RBAC)**
```typescript
// Example route protection
@Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
@Get('/admin/users')
getUsers() {
  // Only SYSTEM_ADMIN and CENTER_DIRECTOR can access
}

@Roles('DOCTOR', 'NURSE')
@Get('/patients')
getPatients() {
  // Medical staff can access patient data
}
```

### **Navigation Filtering**
```typescript
// Dynamic menu based on user role
const filteredNavigation = navigation.filter(item => {
  if (!item.roles) return true;
  return item.roles.includes(user.role);
});
```

---

## 📱 **DASHBOARD DIFFERENCES PER ROLE**

### **SYSTEM_ADMIN Dashboard**
- System health metrics
- User activity monitoring
- Performance analytics
- Security alerts
- Backup status

### **DOCTOR Dashboard**
- Patient statistics
- Diagnosis trends
- Treatment outcomes
- Referral analytics
- Quality metrics

### **NURSE Dashboard**
- Patient care load
- Medication schedules
- Vital sign trends
- Care completion rates
- Shift statistics

### **RESEARCHER Dashboard**
- Research project status
- Data analysis tools
- Publication tracking
- Collaboration requests
- Statistical insights

### **NATIONAL_STAKEHOLDER Dashboard**
- National cancer statistics
- Regional comparisons
- Trend analysis
- International benchmarking
- Policy impact metrics

---

## 🎯 **USAGE EXAMPLES**

### **Scenario 1: New Patient Registration**
```bash
# DATA_ENTRY logs in and inputs basic patient data
curl -X POST http://localhost:8888/api/auth/login \
  -d '{"email":"data_entry@hospital.id","password":"password"}'

# NURSE adds vital signs and care data
curl -X POST http://localhost:8888/api/vitals \
  -H "Authorization: Bearer NURSE_TOKEN"

# DOCTOR adds diagnosis and treatment plan
curl -X POST http://localhost:8888/api/diagnosis \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

### **Scenario 2: Research Data Request**
```bash
# RESEARCHER requests data access
curl -X POST http://localhost:8888/api/research/request \
  -H "Authorization: Bearer RESEARCHER_TOKEN" \
  -d '{"researchType":"epidemiology","timeRange":"2020-2024"}'

# SYSTEM_ADMIN approves request
curl -X PUT http://localhost:8888/api/research/approve/123 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔄 **ROLE TRANSITIONS & PROMOTIONS**

### **Career Progression Path**
```
DATA_ENTRY → NURSE/DOCTOR → CENTER_DIRECTOR → SYSTEM_ADMIN
DATA_ENTRY → RESEARCHER → RESEARCH_DIRECTOR → NATIONAL_STAKEHOLDER
```

### **Cross-Role Collaboration**
- **Medical + Research**: Clinical research projects
- **Admin + Medical**: Operational efficiency improvements
- **Research + National**: Policy development support
- **All Roles**: Quality improvement initiatives

---

## 📋 **COMPLIANCE & REGULATIONS**

### **Data Protection**
- **HIPAA Compliance**: Medical data protection
- **GDPR Considerations**: EU data standards (if applicable)
- **Indonesian Health Regulations**: Local compliance requirements
- **Research Ethics**: IRB approval for research access

### **Audit Requirements**
- **Access Logging**: All data access logged
- **Change Tracking**: Track semua perubahan data
- **Role Certification**: Regular role verification
- **Security Training**: Mandatory security awareness

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Role Access Problems**
```bash
# Check user role
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8888/api/auth/profile

# Verify role permissions
grep -r "ROLE_NAME" backend/src/
```

### **Permission Errors**
- Check role mapping in guards
- Verify database role assignments
- Review navigation filtering logic
- Confirm JWT token contents

---

## 🎯 **BEST PRACTICES**

### **For Users**
1. **Secure Password Management**: Use strong, unique passwords
2. **Role Awareness**: Understand your specific permissions
3. **Data Quality**: Input accurate, complete data
4. **Security Protocol**: Follow security procedures
5. **Regular Training**: Stay updated on system changes

### **For Administrators**
1. **Principle of Least Privilege**: Assign minimum necessary access
2. **Regular Audits**: Review access logs and permissions
3. **Role Reviews**: Periodic role justification review
4. **Security Monitoring**: Monitor for suspicious activity
5. **User Training**: Ensure proper user education

---

## 🏆 **SUMMARY**

Sistem INAMSOS memiliki **6 user types** dengan peran yang jelas dan terstruktur:

1. **SYSTEM_ADMIN** - Administrator sistem tertinggi
2. **DOCTOR** - Staf medis dengan akses data pasien
3. **NURSE** - Perawat dengan fokus data input dan monitoring
4. **RESEARCHER** - Peneliti dengan akses data analytics
5. **DATA_ENTRY** - Staf input data dasar
6. **NATIONAL_STAKEHOLDER** - Pemangku kepentingan tingkat nasional

Setiap role memiliki **akses, tanggung jawab, dan batasan** yang spesifik untuk memastikan:
- **Data Security** melalui role-based access control
- **Operational Efficiency** dengan distribusi tugas yang jelas
- **Regulatory Compliance** dengan audit trail dan logging
- **Scalability** untuk menambah users dan centers baru

**Semua user credentials telah diuji dan berfungsi dengan baik!** ✅

---

*Last Updated: November 20, 2025*
*System Version: INAMSOS v1.0*