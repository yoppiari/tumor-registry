# INAMSOS - Panduan Alur Kerja Fitur

**Tanggal**: 23 November 2025
**Versi**: 1.0
**Project**: Database Tumor Nasional Indonesia (INAMSOS)

---

## Daftar Isi

1. [Pengantar](#pengantar)
2. [Workflow Utama Sistem](#workflow-utama-sistem)
3. [Modul dan Hubungan Antar Fitur](#modul-dan-hubungan-antar-fitur)
4. [Alur Kerja Per User Role](#alur-kerja-per-user-role)
5. [Integrasi Antar Modul](#integrasi-antar-modul)

---

## Pengantar

INAMSOS adalah sistem database tumor nasional yang menghubungkan berbagai stakeholder: staff data entry, peneliti, administrator, dan policymaker. Dokumen ini menjelaskan bagaimana setiap fitur bekerja dan berhubungan satu sama lain.

---

## Workflow Utama Sistem

### 1. DATA LIFECYCLE

```
INPUT → QUALITY → RESEARCH → INSIGHT → POLICY
```

**Penjelasan**:
1. **INPUT**: Data pasien kanker dimasukkan oleh Staff Data Entry
2. **QUALITY**: Sistem melakukan quality check dan scoring
3. **RESEARCH**: Peneliti mengakses data untuk riset
4. **INSIGHT**: Analytics menghasilkan insight dari data
5. **POLICY**: Policymaker menggunakan insight untuk keputusan

---

## Modul dan Hubungan Antar Fitur

### 🏥 MODUL 1: DATA PASIEN

#### A. Entry Data Baru (`/patients/new`)
**Fungsi**: Input data pasien kanker baru dengan WhatsApp-style chat interface

**Cara Kerja**:
1. Staff membuka halaman Entry Data Baru
2. Chat bot menanyakan satu field per satu (nama, tanggal lahir, jenis kelamin, dll)
3. Sistem validasi real-time setiap jawaban
4. Auto-save setiap langkah (mencegah data loss)
5. Setelah lengkap, data tersimpan ke database Patient

**Berhubungan Dengan**:
- ✅ **Quality Check** → Data otomatis masuk queue quality scoring
- ✅ **Audit Logs** → Setiap entry tercatat di Admin/Audit
- ✅ **Dashboard** → Counter "Total Patients" update
- ✅ **Analytics** → Data masuk ke pool analytics untuk trends
- ✅ **Research Browser** → Data tersedia (anonymized) untuk peneliti

**Database Tables**:
- `patient.Patient` (data utama)
- `patient.PatientAddress`
- `patient.PrimaryCancerDiagnosis`
- `system.AuditLog` (tracking)

---

#### B. Upload Dokumen (`/patients/documents`)
**Fungsi**: Upload dokumen medis, hasil lab, imaging

**Cara Kerja**:
1. Staff pilih pasien (ID atau search)
2. Drag-drop file atau browse
3. Pilih kategori dokumen (Lab Result, Imaging, Pathology, dll)
4. System validasi format dan ukuran
5. Upload ke storage (local/S3)
6. Metadata tersimpan di database

**Berhubungan Dengan**:
- ✅ **Patient Record** → Link ke patient ID
- ✅ **Quality Dashboard** → Kelengkapan dokumen masuk scoring
- ✅ **Research Requests** → Dokumen bisa di-request untuk riset (dengan approval)
- ✅ **Audit Logs** → Track siapa upload apa kapan

**Database Tables**:
- `patient.MedicalDocument`
- `patient.MedicalImage`
- `system.AuditLog`

---

#### C. Quality Check (`/patients/quality`)
**Fungsi**: Monitor kualitas data yang sudah diinput

**Cara Kerja**:
1. **Auto-scoring**: Sistem hitung quality score otomatis setiap patient record
   - Completeness: berapa % field terisi
   - Accuracy: validasi cross-field (mis: stage harus match dengan diagnosis)
   - Timeliness: delay antara diagnosis date vs entry date
   - Consistency: data consistency checks

2. **Staff Leaderboard**: Ranking staff berdasarkan avg quality score

3. **Missing Data Heatmap**: Field apa yang paling sering kosong

4. **Quality Trends**: Chart 30 hari menunjukkan tren kualitas

5. **AI Recommendations**: Sistem kasih rekomendasi improvement

**Berhubungan Dengan**:
- ✅ **Data Entry** → Source data dari entries
- ✅ **Admin/Users** → Performance staff tracking
- ✅ **Reports** → Generate quality reports
- ✅ **Dashboard** → Quality metrics ditampilkan
- ✅ **Center Comparison** → Quality score per center

**Database Tables**:
- `patient.Patient` (calculate metrics from)
- `patient.DataQualityScore`
- `system.User` (staff performance)

---

### 📊 MODUL 2: ANALYTICS

#### A. Main Dashboard (`/analytics`)
**Fungsi**: Overview analytics dengan 4 modul utama

**Cara Kerja**:
- Tampilkan 4 metric cards (Total Patients, New This Month, Active Centers, Research Requests)
- 4 module cards sebagai navigation hub:
  1. **Distribusi Kanker** → Geographic map
  2. **Analisis Tren** → Time series
  3. **Prediksi AI** → ML predictions
  4. **Perbandingan Pusat** → Benchmarking
- Quick Insights: 3 top metrics (jenis kanker terbanyak, rata-rata usia, provinsi tertinggi)

**Berhubungan Dengan**:
- ✅ **Semua Sub-Analytics** → Navigation hub
- ✅ **Dashboard** → Data source sama
- ✅ **Research** → Insight untuk research planning
- ✅ **Reports** → Generate reports dari analytics

---

#### B. Distribusi Kanker (`/analytics/distribution`)
**Fungsi**: Peta geografis distribusi kasus kanker per provinsi

**Cara Kerja**:
1. Fetch data dari database: GROUP BY province
2. Hitung intensity level per province (Very High, High, Medium, Low, Very Low)
3. Color-code map berdasarkan intensity
4. Filter by cancer type dan time period
5. Show Top 5 provinces dengan progress bars
6. Full table semua provinces dengan rankings

**Berhubungan Dengan**:
- ✅ **Research/Browse** → Researcher bisa lihat distribusi sebelum request data
- ✅ **Reports** → Generate distribution reports
- ✅ **Predictions** → Input untuk predictive models
- ✅ **Center Comparison** → Compare by region

**API Endpoint**:
- `GET /api/v1/analytics/geographic-distribution`

**Database Query**:
```sql
SELECT province, COUNT(*) as cases
FROM patient.Patient
JOIN patient.PatientAddress ON ...
GROUP BY province
```

---

#### C. Analisis Tren (`/analytics/trends`)
**Fungsi**: Temporal trends - bagaimana kasus kanker berubah dari waktu ke waktu

**Cara Kerja**:
1. Query data 12 bulan terakhir: GROUP BY month
2. Generate bar chart dengan hover tooltips
3. Calculate metrics:
   - Current month cases
   - Monthly average
   - 12-month total
   - YoY growth %
4. Show monthly breakdown table dengan trend arrows (↑↓)
5. Compare 2024 vs 2023 vs 2022
6. AI Insights: "Peak month November dengan 112 kasus (+8.7%)"

**Berhubungan Dengan**:
- ✅ **Predictions** → Historical trends input untuk ML model
- ✅ **Dashboard** → Trend indicators
- ✅ **Reports** → Trend reports
- ✅ **Research** → Temporal analysis untuk epidemiology studies

**API Endpoint**:
- `GET /api/v1/analytics/v2/predictive/trends`

---

#### D. Prediksi AI (`/analytics/predictions`)
**Fungsi**: Machine learning predictions untuk future cancer patterns

**Cara Kerja**:
1. **3-Month Prediction**: ML model predict 3 bulan ke depan (397 cases estimated)
2. **6-Month Prediction**: Predict 6 bulan (842 cases)
3. **Peak Period Prediction**: Predict kapan peak (November-Januari)
4. **Confidence Scores**: 79-87% confidence
5. **Risk Factors Analysis**: 5 faktor dengan impact scoring
   - Urbanization: 8.5/10
   - Air Pollution: 7.8/10
   - Lifestyle: 7.2/10
   - Genetics: 6.9/10
   - Healthcare Access: 6.5/10
6. **Predicted Hotspots**: Provinsi mana yang akan naik

**Berhubungan Dengan**:
- ✅ **Trends** → Input dari historical data
- ✅ **Distribution** → Geographic patterns
- ✅ **Research** → Research planning based on predictions
- ✅ **Policy** → Resource allocation decisions
- ✅ **Center Planning** → Which centers need expansion

**API Endpoint**:
- `GET /api/v1/analytics/v2/predictive/trends?predictionHorizon=3`

**ML Models** (Infrastructure ready, perlu training):
- Time series forecasting (ARIMA/Prophet)
- Risk factor correlation analysis
- Hotspot detection (clustering)

---

#### E. Perbandingan Pusat (`/analytics/centers`)
**Fungsi**: Benchmarking performance antar cancer centers

**Cara Kerja**:
1. Fetch data semua centers
2. Calculate 4 metrics per center:
   - **Quality Score**: Avg quality dari data mereka (0-100)
   - **Patient Volume**: Total patients treated
   - **Timeliness**: Avg days dari diagnosis ke entry
   - **Data Completeness**: % fields completed
3. Ranking centers (Top 3 dapat medal 🥇🥈🥉)
4. Overall Performance badge:
   - Sangat Baik (90-100)
   - Baik (75-89)
   - Cukup (60-74)
   - Perlu Perbaikan (<60)
5. Filter by region dan evaluation period

**Berhubungan Dengan**:
- ✅ **Admin/Centers** → Center management
- ✅ **Quality Dashboard** → Quality scores source
- ✅ **Reports** → Performance reports
- ✅ **Center Admin** → See their own performance
- ✅ **National Admin** → Compare all centers

**API Endpoint**:
- `GET /api/v1/analytics/v2/performance/benchmark`

---

### 📄 MODUL 3: REPORTS

#### A. Report Generator (`/reports`)
**Fungsi**: Generate berbagai jenis laporan

**Cara Kerja**:
1. User pilih template (6 templates):
   - **Cancer Incidence**: Epidemiology report
   - **Treatment Outcomes**: Clinical outcomes
   - **Center Performance**: Benchmarking
   - **Data Quality**: Quality metrics
   - **Demographics**: Population analysis
   - **Custom**: Build your own
2. Click template → opens configuration
3. Set parameters (date range, filters, format)
4. Click "Generate Report"
5. System query database → process data → generate PDF/Excel
6. Report masuk queue "Recent Reports"

**Berhubungan Dengan**:
- ✅ **Reports/History** → Saved reports
- ✅ **Reports/Scheduled** → Bisa dijadwalkan recurring
- ✅ **Reports/Export** → Export raw data
- ✅ **Analytics** → Data source
- ✅ **Audit Logs** → Track siapa generate apa

**Database Tables**:
- `report.Report`
- `report.ReportTemplate`
- `report.ReportGeneration`

---

#### B. Report History (`/reports/history`)
**Fungsi**: Lihat semua report yang pernah di-generate

**Cara Kerja**:
1. Fetch last 50 reports dari database
2. Display table dengan filters:
   - Search by name
   - Filter by type (Epidemiologi, Klinis, Administrasi, Kualitas)
   - Filter by status (Completed, Processing, Failed, Expired)
   - Date range filter
3. Status badges:
   - **Completed**: Download available
   - **Processing**: Masih generate
   - **Failed**: Error, ada Retry button
   - **Expired**: Sudah auto-delete (retention policy)
4. Actions: View (preview) dan Download

**Berhubungan Dengan**:
- ✅ **Report Generator** → Source reports
- ✅ **Audit Logs** → Track downloads
- ✅ **Scheduled Reports** → Recurring reports muncul di sini

---

#### C. Scheduled Reports (`/reports/scheduled`)
**Fungsi**: Jadwalkan laporan recurring (otomatis)

**Cara Kerja**:
1. **Schedule New Report** button → opens modal
2. Configure:
   - Report name dan type
   - Frequency: Daily, Weekly, Monthly
   - Email recipients (comma-separated)
   - Active/Inactive status
3. System menggunakan cron job untuk auto-generate
4. Table shows:
   - Schedule (Daily/Weekly/Monthly badges)
   - Next run time
   - Recipients list
   - Active status toggle
5. Actions: Run Now, Edit, Delete

**Berhubungan Dengan**:
- ✅ **Report Generator** → Uses same templates
- ✅ **Report History** → Generated reports masuk history
- ✅ **Email Service** → Send reports via email
- ✅ **Audit Logs** → Track automated generations

**Backend Implementation**:
- Cron jobs (Bull Queue atau node-cron)
- Email service integration
- Report storage management

---

#### D. Data Export (`/reports/export`)
**Fungsi**: Export raw data untuk analysis di tools lain

**Cara Kerja**:
1. **Select Export Format** (6 options):
   - CSV: Excel/spreadsheet
   - Excel: .xlsx with formatting
   - PDF: Printable report
   - JSON: API integration
   - SPSS: Statistical analysis
   - Stata: Econometric analysis

2. **Set Filters**:
   - Date range (from-to)
   - Patient filters: Cancer type, Age range, Gender, Province

3. **Select Data Fields** (21 fields di 5 categories):
   - Identitas: ID, Nama, NIK, Tanggal Lahir, Alamat, Telepon
   - Diagnosis: Jenis Kanker, Stadium, Tanggal Diagnosis, Histologi, Laterality
   - Pengobatan: Treatment Type, Start Date, Status, Hospital, Doctor
   - Follow-up: Last Visit, Outcome, Survival Time
   - Administrasi: Entry Date, Entry By

4. **Preview Data**: Toggle untuk lihat first 10 rows

5. **Export**: Click button → progress bar → download file

6. **Export History**: Last 5 exports dengan download links

**Berhubungan Dengan**:
- ✅ **Research Browser** → Sama-sama akses patient data
- ✅ **Research Requests** → Export bisa di-request via formal workflow
- ✅ **Audit Logs** → Track exports untuk compliance
- ✅ **Analytics** → Data source

**Security**:
- Role-based: Only RESEARCHER, CENTER_ADMIN, NATIONAL_ADMIN
- Audit logging semua exports
- Data anonymization untuk certain roles
- Rate limiting untuk prevent bulk download

---

### 👥 MODUL 4: ADMIN

#### A. Admin Dashboard (`/admin`)
**Fungsi**: Overview untuk system administrators

**Cara Kerja**:
- **4 Metric Cards**:
  1. Total Users (87)
  2. Active Users (64)
  3. Total Centers (12)
  4. Active Centers (11)

- **Cancer Centers Table**: Quick view 4 centers
  - City, Active Users, Patient Count, Status
  - Actions: Edit, Detail

- **Recent Users Table**: Last 5 users
  - Name, Email, Role, Center, Status, Last Login
  - Actions: Edit, Delete

- **Add User Button**: Quick access to user creation

**Berhubungan Dengan**:
- ✅ **Admin/Users** → Full user management
- ✅ **Admin/Centers** → Full center management
- ✅ **Admin/Audit** → Activity monitoring
- ✅ **Admin/Config** → System settings

---

#### B. Users Management (`/admin/users`)
**Fungsi**: CRUD users dan manage permissions

**Cara Kerja**:
1. **User Table** dengan filters:
   - Search: Name atau email
   - Role filter: Admin, Registrar, Data Entry, Viewer
   - Status filter: Active, Inactive
   - Center filter: Pilih center

2. **Add User Modal**:
   - Form: Name, Email, Role, Center, Password
   - Validation: Email unique, password strength
   - Click Save → POST `/api/v1/users`

3. **Edit User Modal**:
   - Same form dengan data pre-filled
   - Option to reset password
   - PUT `/api/v1/users/:id`

4. **Status Toggle**:
   - Click status badge → toggle Active/Inactive
   - Inactive users can't login

5. **Bulk Actions**:
   - Select multiple dengan checkboxes
   - Activate All, Deactivate All, Export CSV

6. **Pagination**: 10 users per page

**Berhubungan Dengan**:
- ✅ **Auth System** → Users login dengan credentials ini
- ✅ **Audit Logs** → Track user creation/modification
- ✅ **Center Management** → Users assigned to centers
- ✅ **Quality Dashboard** → Staff performance tracking
- ✅ **Data Entry** → Staff yang input data

**Database Tables**:
- `system.User`
- `system.UserRole`
- `system.Role`
- `system.Permission`

**API Endpoints**:
- `GET /api/v1/users` (list dengan filters)
- `POST /api/v1/users` (create)
- `PUT /api/v1/users/:id` (update)
- `DELETE /api/v1/users/:id` (soft delete)
- `PATCH /api/v1/users/:id/status` (toggle active)

---

#### C. Centers Management (`/admin/centers`)
**Fungsi**: Manage cancer treatment centers

**Cara Kerja**:
1. **Stats Cards**:
   - Total Centers: 10
   - Active Centers: 9
   - Total Patients: 3,178
   - Total Users: 87

2. **Centers Table**:
   - Indonesian hospitals: RSCM, Dharmais, Sardjito, dll
   - Columns: Name, City, Province, Active Users, Total Patients, Status
   - Filter by province
   - Search by name/city

3. **Add Center Modal**:
   - Form: Name, Address, City, Province, Phone, Email
   - Validation: Phone format, email format
   - POST `/api/v1/centers`

4. **Edit Center Modal**:
   - Update center information
   - PUT `/api/v1/centers/:id`

5. **View Details Modal**:
   - Complete center info
   - Contact person
   - Specialties
   - Equipment list
   - Staff count

6. **Status Toggle**: Active/Inactive centers

**Berhubungan Dengan**:
- ✅ **Users** → Users assigned to centers
- ✅ **Patients** → Patients treated at centers
- ✅ **Analytics/Centers** → Performance comparison
- ✅ **Quality Dashboard** → Quality per center
- ✅ **Research** → Data requests per center

**Database Tables**:
- `system.CancerCenter`
- `system.User` (center assignment)
- `patient.Patient` (center link)

---

#### D. Audit Logs (`/admin/audit`)
**Fungsi**: Security dan compliance - track semua aktivitas

**Cara Kerja**:
1. **Auto-Logging**: Setiap action di-log otomatis:
   - Login/Logout
   - Create/Update/Delete (any entity)
   - View sensitive data
   - Export data
   - Permission changes

2. **Audit Table** (100 latest):
   - Timestamp
   - User (who did it)
   - Action (what they did)
   - Resource (pada apa: Patient, User, Center, dll)
   - Details (additional context)
   - IP Address
   - Status (Success/Failed)

3. **Filters**:
   - Search: User atau action
   - Action type: Login, Create, Update, Delete, View, Export
   - Status: Success, Failed
   - Date range: Start date - End date

4. **Auto-Refresh Toggle**: Refresh every 30 seconds

5. **Export Logs**: Download CSV untuk compliance

6. **Color-Coded**:
   - Login: Blue
   - Create: Green
   - Update: Yellow
   - Delete: Red
   - View: Purple
   - Export: Indigo

**Berhubungan Dengan**:
- ✅ **Semua Modul** → Every action logged
- ✅ **Security** → Detect suspicious activities
- ✅ **Compliance** → HIPAA/GDPR compliance
- ✅ **Reports** → Audit reports

**Database Tables**:
- `system.AuditLog`

**API Endpoints**:
- `GET /api/v1/audit/logs` (with filters)
- `GET /api/v1/audit/logs/export`

**Use Cases**:
- Investigate security incidents
- Compliance audits
- User activity monitoring
- Data breach detection
- Performance monitoring

---

#### E. System Configuration (`/admin/config`)
**Fungsi**: Configure system-wide settings

**Cara Kerja - 5 Tabs**:

**1. General Tab**:
- System Name: "INAMSOS"
- Timezone: WIB/WITA/WIT
- Language: Indonesia/English
- Date Format: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
- Click "Save Changes"

**2. Security Tab**:
- Min Password Length: 8-20
- Password Requirements:
  - ☑ Uppercase letters
  - ☑ Lowercase letters
  - ☑ Numbers
  - ☑ Special characters
- Session Timeout: 30 min (Admin) / 120 min (Staff)
- Max Login Attempts: 3-10
- MFA Requirement: Toggle ON/OFF

**3. Email Tab**:
- SMTP Host: smtp.gmail.com
- SMTP Port: 587
- Username: noreply@inamsos.go.id
- Password: ********
- Use TLS/SSL: Toggle
- From Email: noreply@inamsos.go.id
- From Name: INAMSOS System
- **Test Connection** button

**4. Backup Tab**:
- Auto Backup: Toggle ON/OFF
- Schedule: Hourly, Daily, Weekly, Monthly
- Backup Time: 02:00 WIB
- Retention Days: 30
- Include: ☑ Database ☑ Files
- **Backup Now** button

**5. API Tab**:
- Rate Limiting: Toggle ON/OFF
- Requests per minute: 60
- Requests per hour: 1000
- **API Keys Table**:
  - Key Name, Key Value (masked), Created, Active
  - Toggle Active/Inactive
  - Generate New API Key
  - Revoke Key

**Berhubungan Dengan**:
- ✅ **Auth System** → Password policies applied
- ✅ **Email Service** → SMTP settings
- ✅ **Backup Service** → Auto backup schedule
- ✅ **API Gateway** → Rate limiting
- ✅ **All Users** → Settings affect everyone

**Database Tables**:
- `system.SystemConfig`
- `system.ApiKey`

---

### 🔬 MODUL 5: RESEARCH

#### A. Research Browse (`/research`)
**Fungsi**: Browse dan filter anonymized patient data untuk riset

**Cara Kerja**:
1. **Metrics Cards**:
   - Total Records: 8
   - Filtered Records: (dynamic based on filters)
   - Cancer Types: 6
   - Avg Age: 52

2. **Advanced Filters** (collapsible):
   - Cancer Type: Dropdown (Payudara, Serviks, Paru, dll)
   - Stage: I, II, III, IV
   - Gender: Male, Female
   - Age Range: Min-Max sliders
   - Reset Filters button

3. **Research Data Table**:
   - **Anonymized**: Patient ID diganti dengan RID-XXXX
   - Columns: Patient ID, Cancer Type, Stage, Age, Gender, Diagnosis Date, Treatment, Outcome
   - Stage badges (blue)
   - Outcome badges:
     - Complete Remission: Green
     - Partial Response: Yellow
     - Stable Disease: Blue
     - Progressive Disease: Red

4. **Live Filtering**: Table updates saat filter diubah

5. **Empty State**: "No records found" jika tidak ada match

6. **Export Data Button**: Export filtered results

**Berhubungan Dengan**:
- ✅ **Patients** → Source data (anonymized)
- ✅ **Research Requests** → Kalau butuh identified data → formal request
- ✅ **Analytics** → Same data pool
- ✅ **Audit Logs** → Track who viewed what

**Security**:
- Data anonymization automatic
- Patient name → "Patient RID-0001"
- Address removed
- Only aggregate/statistical data

**API Endpoint**:
- `GET /api/v1/research/browse?cancerType=Breast&stage=III`

---

#### B. Research Requests (`/research/requests`)
**Fungsi**: Formal workflow untuk request detailed/identified data

**Cara Kerja - 7 Status Workflow**:

**1. CREATE REQUEST (Draft)**:
- Click "New Request" button → Modal opens
- Form fields:
  - **Title**: "Analisis Survival Rate Kanker Serviks Stadium III"
  - **Research Purpose**: PhD/Master Thesis/Clinical Trial/etc
  - **Data Type**:
    - Aggregate (summary stats)
    - Anonymized (no personal info)
    - Identified (full patient data) ← perlu strong justification
  - **Justification**: Why need this data
  - **Dataset Description**: What fields needed
  - **Timeline**: Expected duration (3 months, 6 months, 1 year)

- Status: **DRAFT** (gray badge)
- Actions: Edit, Submit, Delete

**2. SUBMIT REQUEST**:
- Review draft → Click "Submit"
- Status: **SUBMITTED** (blue badge)
- System sends email notification ke Center Admin
- Actions: View, Withdraw

**3. UNDER REVIEW**:
- Center Admin receives notification
- Goes to Approvals page
- Reviews request details
- Status: **UNDER REVIEW** (yellow badge)
- Actions: View Details

**4. APPROVED / REJECTED**:
- Admin decision:
  - **APPROVED** (green badge):
    - Dataset prepared
    - Access granted for specified timeline
    - Data available for download
    - Actions: Download Data, View Details

  - **REJECTED** (red badge):
    - Reason diberikan (incomplete ethics approval, etc)
    - Researcher bisa revise dan re-submit
    - Actions: View Reason, Revise

**5. IN PROGRESS**:
- For approved requests
- Researcher actively using data
- Status: **IN PROGRESS** (purple badge)
- Actions: Download, View

**6. COMPLETED**:
- Research selesai
- Researcher submit final report/publication
- Status: **COMPLETED** (teal badge)
- Actions: View Publication

**My Requests Table**:
- Request ID: REQ-2024-001
- Title
- Requested Date
- Status (dengan badge)
- Data Type
- Purpose
- Actions (based on status)

**Filter**: By status untuk quick filtering

**Berhubungan Dengan**:
- ✅ **Approvals** → Admin approve/reject di sana
- ✅ **Approvals/History** → History semua decisions
- ✅ **Research/Collaboration** → Collaborate dengan researchers lain
- ✅ **Research/Publications** → Link completed requests ke publications
- ✅ **Audit Logs** → Track access to sensitive data
- ✅ **Email Service** → Notifications

**Database Tables**:
- `research.ResearchRequest`
- `research.ResearchApproval`
- `research.DatasetAccess`

**API Endpoints**:
- `POST /api/v1/research/requests` (create)
- `GET /api/v1/research/requests/my` (list mine)
- `PUT /api/v1/research/requests/:id` (update draft)
- `POST /api/v1/research/requests/:id/submit`
- `DELETE /api/v1/research/requests/:id` (delete draft)
- `GET /api/v1/research/requests/:id/download` (download approved data)

---

#### C. Research Collaboration (`/research/collaboration`)
**Fungsi**: Platform untuk researcher collaboration dan team building

**Cara Kerja**:

**1. ACTIVE PROJECTS Section**:
- Cards untuk each active research project
- Each card shows:
  - **Project Title**: "Studi Epidemiologi Kanker Nasofaring"
  - **Status Badge**: Active, Planning, Completed
  - **Lead Researcher**: Dr. Siti Nurhaliza (UI)
  - **Description**: Brief project description
  - **Members**: 5 members
  - **Datasets**: 3 datasets
  - **Last Activity**: 2 days ago
  - **"Lihat Detail" Button**: View full project

**2. FIND COLLABORATORS Section**:
- **Search Bar**: Search by name, institution, expertise
- **Researcher Profile Cards** (8 Indonesian researchers):

  **Example Card**:
  - **Photo**: Avatar/profile picture
  - **Name**: Dr. Ahmad Hidayat
  - **Institution**: Universitas Indonesia
  - **Expertise Tags**:
    - Onkologi Medis
    - Kanker Payudara
    - Clinical Trials
  - **Publications**: 45 papers
  - **"Kirim Permintaan" Button**: Send collaboration request

- Researchers dari major universities:
  - Universitas Indonesia (UI)
  - Universitas Gadjah Mada (UGM)
  - Institut Teknologi Bandung (ITB)
  - Universitas Airlangga (Unair)
  - Universitas Padjadjaran (Unpad)
  - Universitas Hasanuddin (Unhas)
  - Universitas Diponegoro (Undip)
  - Universitas Brawijaya (UB)

**3. MY TEAM Section**:
- Table of your current team members
- Columns: Name, Institution, Role, Expertise, Projects
- Team roles: Lead, Co-Investigator, Data Analyst, Statistician

**4. SEND COLLABORATION REQUEST**:
- Click "Kirim Permintaan" → Modal opens
- Form:
  - To: Selected researcher
  - Message: Introduce yourself, explain collaboration
  - Project: Which project (if any)
  - Click "Send"
- Researcher receives notification
- They can Accept/Decline

**Stats Cards**:
- Active Projects: 4
- Collaborators: 12
- Shared Datasets: 8

**Berhubungan Dengan**:
- ✅ **Research Requests** → Collaborate on data requests
- ✅ **Research/Publications** → Co-author publications
- ✅ **Research Browse** → Share datasets within team
- ✅ **Email Service** → Collaboration request notifications
- ✅ **User Profiles** → Researcher profiles

**Database Tables**:
- `research.ResearchProject`
- `research.ResearchCollaboration`
- `research.ProjectMember`
- `system.User` (researcher profiles)

**API Endpoints**:
- `GET /api/v1/research/collaborations/projects` (my projects)
- `GET /api/v1/research/collaborations/researchers` (find researchers)
- `POST /api/v1/research/collaborations/invite` (send request)
- `GET /api/v1/research/collaborations/team` (my team)

**Use Cases**:
1. **Scenario 1 - Multi-Center Study**:
   - Dr. Ahmad (UI) butuh data dari multiple centers
   - Find Dr. Siti (UGM) dan Dr. Budi (Unair) untuk collaborate
   - Create project "National Cervical Cancer Study"
   - Each bring data dari center mereka
   - Collaborate on analysis

2. **Scenario 2 - Expertise Needed**:
   - Dr. Ratna punya data tapi butuh statistical expertise
   - Search researcher dengan expertise "Biostatistics"
   - Find Prof. Eko (ITB)
   - Invite untuk collaboration
   - Prof. Eko help dengan statistical analysis

3. **Scenario 3 - PhD Supervision**:
   - PhD student butuh supervisor
   - Browse senior researchers by expertise
   - Send collaboration request
   - Supervisor join sebagai Co-Investigator

---

#### D. Publications Tracker (`/research/publications`)
**Fungsi**: Track publications using INAMSOS data - untuk impact tracking

**Cara Kerja**:

**1. PUBLICATIONS TABLE**:
- 10 publications dari prestigious journals
- Columns:
  - **Title**: Full paper title
  - **Authors**: Dr. Siti Nurhaliza, et al.
  - **Journal**:
    - Asian Pacific Journal of Cancer Prevention (IF: 2.51)
    - The Lancet Regional Health - Western Pacific (IF: 7.23)
    - Journal of Clinical Oncology (IF: 50.71)
    - Nature Communications (IF: 16.6)
    - Journal of Thoracic Oncology (IF: 20.45)
  - **Year**: 2024, 2023, 2022
  - **Citations**: Badge dengan count (15, 23, 45, dll)
  - **INAMSOS Dataset**: Which request ID
  - **Link**: DOI link to journal

**2. FILTERS**:
- **Year Filter**: 2024, 2023, 2022, 2021, All
- **Journal Filter**: Dropdown list of journals
- **Search**: Search by title atau author name

**3. STATS CARDS**:
- **Total Publications**: 10
- **Total Citations**: 353
- **Avg Impact Factor**: 3.45
- **This Year**: 2 publications

**4. ADD PUBLICATION Modal**:
- Click "Add Publication"
- Form:
  - **Title**: Full paper title
  - **Authors**: Comma-separated list
  - **Journal**: Journal name
  - **Year**: Publication year
  - **DOI**: Digital Object Identifier (10.1016/j.xyz)
  - **Abstract**: Paper abstract
  - **Dataset Reference**: Which INAMSOS dataset used (REQ-2024-001)
- Click "Submit"
- POST `/api/v1/research/publications`

**5. DOWNLOAD CITATION**:
- Click "Download Citation"
- Generate formatted citation:
  - APA format
  - MLA format
  - BibTeX format
  - EndNote format

**Berhubungan Dengan**:
- ✅ **Research Requests** → Track which requests led to publications
- ✅ **Research/Collaboration** → Co-authors from collaboration
- ✅ **Analytics** → Research impact metrics
- ✅ **Reports** → Research impact reports
- ✅ **Dashboard** → "Publications This Year" metric

**Database Tables**:
- `research.Publication`
- `research.ResearchRequest` (link)
- `research.PublicationAuthor`

**API Endpoints**:
- `GET /api/v1/research/publications` (list with filters)
- `POST /api/v1/research/publications` (add)
- `GET /api/v1/research/publications/:id/citation` (download citation)

**Impact Tracking**:
- H-index calculation per researcher
- Institution impact ranking
- INAMSOS data usage metrics:
  - How many publications per year
  - Which datasets most used
  - Which cancer types most researched
  - Citation impact

**Why Important**:
- Demonstrates value of INAMSOS
- Justify funding untuk maintain database
- Track scientific impact
- Encourage data sharing
- Recognize contributors

---

### ✓ MODUL 6: APPROVALS

#### A. Approval Queue (`/approvals`)
**Fungsi**: Center Admin approve/reject research data requests

**Cara Kerja**:

**1. STATS CARDS**:
- **Pending**: 3 requests butuh action
- **In Review**: 1 currently reviewing
- **Approved**: 1 this week
- **Rejected**: 1 this week

**2. FILTER BUTTONS**:
- All (6)
- Pending (3)
- Review (1)
- Approved (1)
- Rejected (1)
- Click button → filter table

**3. REQUESTS TABLE**:
- 6 research requests dengan realistic Indonesian data
- Columns:
  - **Request ID**: REQ-2024-001
  - **Title**: "Analisis Survival Rate Kanker Serviks Stadium III"
  - **Requester**: Dr. Siti Nurhaliza
  - **Institution**: Universitas Indonesia
  - **Submitted**: 2024-11-15
  - **Priority**:
    - High (red) - Urgent, time-sensitive
    - Medium (yellow) - Normal priority
    - Low (gray) - Can wait
  - **Status**: Pending/In Review/Approved/Rejected
  - **Actions**:
    - **Detail**: View full request
    - **Approve**: Approve request (green button)
    - **Reject**: Reject with reason (red button)

**4. VIEW DETAIL Modal**:
- Click "Detail" → Full screen modal
- Shows:
  - Research Title
  - Requester Info (name, institution, email)
  - Research Purpose
  - Data Type Requested (Aggregate/Anonymized/Identified)
  - Justification (why need this data)
  - Request Details (specific fields needed)
  - Submitted Date
  - Priority Level
  - **Decision Buttons**:
    - **Approve** (green): Opens approval form
    - **Reject** (red): Opens rejection form
    - **Close**: Close modal

**5. APPROVE Process**:
- Click "Approve"
- Form appears:
  - Approval Notes: "Data tersedia dengan anonymization"
  - Access Duration: 3 months, 6 months, 1 year
  - Conditions: Any special conditions
  - Click "Confirm Approval"
- Status → **APPROVED**
- Email sent to researcher
- Dataset prepared untuk download
- Entry created in Approvals History

**6. REJECT Process**:
- Click "Reject"
- Form appears:
  - Rejection Reason: Required field
    - "Dokumen ethics approval tidak lengkap"
    - "Justification tidak memadai"
    - "Data sensitif memerlukan persetujuan lebih tinggi"
  - Suggestions: Apa yang perlu diperbaiki
  - Click "Confirm Rejection"
- Status → **REJECTED**
- Email sent dengan reason
- Researcher bisa revise dan resubmit

**Priority System**:
- **High Priority**:
  - PhD/Master thesis dengan deadline
  - Clinical trials time-sensitive
  - Government research urgent

- **Medium Priority**:
  - Regular academic research
  - Publication-driven studies

- **Low Priority**:
  - Exploratory research
  - Student projects
  - Internal analysis

**Berhubungan Dengan**:
- ✅ **Research/Requests** → Source requests
- ✅ **Approvals/History** → Approved/rejected masuk history
- ✅ **Audit Logs** → Decision tracking
- ✅ **Email Service** → Notifications
- ✅ **Research/Collaboration** → Approved researchers bisa collaborate

**Database Tables**:
- `research.ResearchRequest`
- `research.ResearchApproval`
- `system.AuditLog`

**API Endpoints**:
- `GET /api/v1/approvals/queue` (pending requests)
- `POST /api/v1/approvals/:requestId/approve`
- `POST /api/v1/approvals/:requestId/reject`
- `GET /api/v1/approvals/:requestId/details`

**Decision Criteria** (Admin considerations):
1. **Ethics Compliance**:
   - IRB approval attached?
   - Informed consent addressed?
   - Data privacy plan?

2. **Research Quality**:
   - Clear research question?
   - Appropriate methodology?
   - Qualified researcher?

3. **Data Sensitivity**:
   - Identified vs anonymized?
   - Justification adequate?
   - Risk assessment?

4. **Resource Impact**:
   - Dataset size reasonable?
   - Timeline reasonable?
   - System load impact?

---

#### B. Approvals History (`/approvals/history`)
**Fungsi**: Historical record semua approval decisions untuk compliance

**Cara Kerja**:

**1. STATS CARDS**:
- **Total Diproses**: 10 requests
- **Disetujui**: 6 (green)
- **Ditolak**: 2 (red)
- **Rata-rata Waktu**: 5 hari (decision time)

**2. ADVANCED FILTERS**:
- **Status Filter**: All, Approved, Rejected, Expired, Revoked
- **Decision Maker**: Dropdown (Dr. Ahmad, Dr. Ratna, dll)
- **Date Range**: Last 7 days, 30 days, 3 months, 1 year, All
- **Search**: By title, requester, institution
- **Reset Filters** button

**3. HISTORY TABLE** (10 records per page):
- Columns:
  - **Request ID**: REQ-2024-001
  - **Title**: Research title
  - **Requester**: Researcher name
  - **Institution**: University
  - **Submitted Date**: When requested
  - **Decision Date**: When decided
  - **Status**:
    - **Approved** (green)
    - **Rejected** (red)
    - **Expired** (gray) - No response to clarification
    - **Revoked** (orange) - Approval revoked due to violation
  - **Decided By**: Admin who decided
  - **Actions**: Detail, Export

**4. DETAIL MODAL dengan TIMELINE**:
- Click "Detail" → Opens comprehensive modal
- **Request Information**:
  - Title, Purpose, Requester, Institution
  - Data Type, Request Details
  - Submitted Date, Decision Date
  - Decision Maker

- **Decision Notes**:
  - **IF APPROVED** (green box):
    - "Data approved dengan anonymization penuh. Access granted untuk 6 bulan."
    - Conditions applied
    - Dataset reference

  - **IF REJECTED** (red box):
    - "Dokumen persetujuan etik tidak lengkap. Researcher diminta melengkapi IRB approval dari institusi."
    - Specific issues
    - Recommendations

  - **IF REVOKED** (orange box):
    - "Access dicabut karena pelanggaran protokol data sharing."
    - Violation details
    - Date revoked

- **COMPLETE TIMELINE Visualization**:

  **Example Timeline** (4-7 events):

  ```
  1. ⚪ REQUEST SUBMITTED
     Nov 15, 2024 10:30
     by Dr. Siti Nurhaliza
     "Research request submitted untuk review"

  2. 🔵 IN REVIEW
     Nov 16, 2024 14:20
     by Dr. Ahmad Hidayat (Admin)
     "Request sedang direview untuk compliance"

  3. 🟡 CLARIFICATION REQUESTED
     Nov 17, 2024 09:15
     by Dr. Ahmad Hidayat
     "Diminta tambahan: IRB approval letter"

  4. 🟢 DOCUMENTS SUBMITTED
     Nov 18, 2024 16:45
     by Dr. Siti Nurhaliza
     "IRB approval letter dilampirkan"

  5. 🟢 APPROVED
     Nov 20, 2024 11:30
     by Dr. Ahmad Hidayat
     "Request disetujui. Data tersedia untuk download dengan anonymization."
  ```

  **Timeline Visual**:
  - Vertical line connecting events
  - Color-coded circles:
    - Gray: Neutral/Info
    - Blue: Process step
    - Yellow: Clarification/Warning
    - Green: Approved/Success
    - Red: Rejected/Failed
  - Timestamp (Indonesian format)
  - Actor name
  - Event description
  - Optional notes

**5. PAGINATION**:
- 10 items per page
- Page numbers (1, 2, 3, ... )
- Previous/Next buttons
- "Showing 1-10 of 50 records"

**6. EXPORT HISTORY**:
- Click "Export History" button
- Downloads CSV file: `approvals_history_2025-11-23.csv`
- Includes all columns dari filtered results
- For compliance audits

**Status Details**:

1. **APPROVED**:
   - Normal approval
   - Access granted
   - Timeline shows approval event

2. **REJECTED**:
   - Not approved
   - Reason provided
   - Researcher can revise

3. **EXPIRED**:
   - Request submitted
   - Clarification requested
   - Researcher tidak respond dalam 14 hari
   - Auto-expired

4. **REVOKED**:
   - Initially approved
   - Later revoked because:
     - Data sharing violation
     - Misuse of data
     - Timeline exceeded
     - Ethics violation

**Berhubungan Dengan**:
- ✅ **Approvals Queue** → Source of new entries
- ✅ **Research/Requests** → Link to request details
- ✅ **Audit Logs** → Compliance tracking
- ✅ **Reports** → Approval metrics reports
- ✅ **Analytics** → Approval rate analysis

**Database Tables**:
- `research.ResearchApproval`
- `research.ApprovalHistory`
- `research.ApprovalTimeline`

**API Endpoints**:
- `GET /api/v1/approvals/history` (with filters)
- `GET /api/v1/approvals/history/:id/timeline`
- `GET /api/v1/approvals/history/export`

**Compliance Use Cases**:
1. **Audit Trail**: Prove who approved what when
2. **Decision Review**: Review past decisions untuk consistency
3. **Performance Metrics**: Avg decision time per admin
4. **Trend Analysis**: Approval rate trends
5. **Researcher History**: Track researcher's past requests

---

## Alur Kerja Per User Role

### 🔹 DATA ENTRY STAFF (Role: DATA_ENTRY)

**Daily Workflow**:
```
1. LOGIN
   ↓
2. DASHBOARD
   - Lihat "New Patients This Month"
   - Check assigned tasks
   ↓
3. PATIENTS → ENTRY DATA BARU
   - Input patient baru via chat interface
   - Real-time validation
   - Auto-save progress
   ↓
4. PATIENTS → UPLOAD DOKUMEN
   - Upload lab results, imaging
   - Categorize documents
   ↓
5. PATIENTS → QUALITY CHECK
   - Monitor quality score
   - Check missing data recommendations
   - Review leaderboard (gamification)
   ↓
6. LOGOUT
```

**Accessible Menus**:
- ✅ Dashboard
- ✅ Patients (all sub-menus)
- ❌ Analytics (limited)
- ❌ Research (tidak akses)
- ❌ Reports (limited)
- ❌ Admin (tidak akses)
- ❌ Approvals (tidak akses)

---

### 🔹 RESEARCHER (Role: RESEARCHER)

**Research Workflow**:
```
1. LOGIN
   ↓
2. RESEARCH → BROWSE DATA
   - Lihat aggregate data
   - Apply filters (cancer type, stage, dll)
   - Explore patterns
   ↓
3. Butuh Detailed Data?
   YES → RESEARCH → REQUESTS
       - Create new request
       - Fill form (title, purpose, justification)
       - Attach ethics approval
       - Submit request
       ↓
       - Wait for approval
       ↓
       - APPROVED? → Download dataset

   NO → Use aggregate data
   ↓
4. RESEARCH → COLLABORATION
   - Find collaborators by expertise
   - Send collaboration requests
   - Build research team
   ↓
5. ANALYTICS
   - View trends, distributions
   - Get insights for research planning
   ↓
6. After Research Complete:
   RESEARCH → PUBLICATIONS
   - Add publication
   - Link to INAMSOS dataset
   - Track citations
```

**Accessible Menus**:
- ✅ Dashboard
- ✅ Analytics (full access)
- ✅ Research (full access)
- ✅ Reports (limited - generate reports)
- ❌ Patients (tidak bisa lihat identified data)
- ❌ Admin (tidak akses)
- ❌ Approvals (tidak akses)

---

### 🔹 CENTER ADMIN (Role: CENTER_ADMIN)

**Admin Workflow**:
```
1. LOGIN
   ↓
2. DASHBOARD
   - Overview metrics
   - Monitor center performance
   ↓
3. ADMIN → USERS
   - Manage staff accounts
   - Add new data entry staff
   - Assign roles
   - Deactivate users
   ↓
4. APPROVALS → QUEUE
   - Review pending research requests
   - Check ethics compliance
   - APPROVE or REJECT
   ↓
5. ANALYTICS → CENTERS
   - Compare performance vs other centers
   - Identify improvement areas
   ↓
6. PATIENTS → QUALITY
   - Monitor data quality dari center
   - Staff performance tracking
   - Address quality issues
   ↓
7. REPORTS
   - Generate center performance reports
   - Schedule monthly reports
   - Export data for analysis
   ↓
8. ADMIN → AUDIT
   - Monitor user activities
   - Investigate suspicious activities
```

**Accessible Menus**:
- ✅ Dashboard
- ✅ Patients (full access untuk center mereka)
- ✅ Analytics (full access)
- ✅ Research (limited - approve requests)
- ✅ Reports (full access)
- ✅ Admin (Users, Audit - limited to center)
- ✅ Approvals (full access)

---

### 🔹 NATIONAL ADMIN (Role: NATIONAL_ADMIN)

**National Oversight Workflow**:
```
1. LOGIN
   ↓
2. DASHBOARD
   - National metrics
   - All centers overview
   ↓
3. ANALYTICS
   - Distribution → National geographic patterns
   - Trends → National trends over time
   - Predictions → Forecast national burden
   - Centers → Compare all centers
   ↓
4. ADMIN → CENTERS
   - Onboard new centers
   - Monitor center status
   - Manage center admins
   ↓
5. ADMIN → CONFIG
   - System-wide settings
   - Security policies
   - Email configuration
   - Backup settings
   ↓
6. REPORTS
   - National reports
   - Policy briefs
   - Export national datasets
   ↓
7. RESEARCH → PUBLICATIONS
   - Track research impact
   - Monitor citation metrics
   - Demonstrate INAMSOS value
```

**Accessible Menus**:
- ✅ **SEMUA MENU FULL ACCESS**

---

## Integrasi Antar Modul

### 🔄 CONTOH INTEGRASI 1: Research Collaboration Workflow

**Scenario**: Dr. Siti (UI) want to collaborate dengan Dr. Ahmad (UGM) untuk multi-center breast cancer study

```
Step 1: RESEARCH/COLLABORATION
- Dr. Siti browse researchers
- Find Dr. Ahmad (expertise: Breast Cancer, Biostatistics)
- Click "Kirim Permintaan"
- Message: "Hi Dr. Ahmad, saya sedang research breast cancer survival rate. Butuh bantuan statistical analysis. Tertarik collaborate?"

Step 2: EMAIL NOTIFICATION
- Dr. Ahmad receive email
- Link to collaboration platform

Step 3: RESEARCH/COLLABORATION
- Dr. Ahmad login
- See collaboration request
- Accept request
- Join as "Statistician"

Step 4: RESEARCH/REQUESTS
- Dr. Siti create formal data request:
  - Title: "Multi-Center Breast Cancer Survival Analysis"
  - Purpose: Academic Publication
  - Data Type: Anonymized
  - Justification: Need data dari UI dan UGM centers
  - Timeline: 6 months
  - Team: Dr. Siti (Lead), Dr. Ahmad (Statistician)

Step 5: APPROVALS
- Center Admin UI review request
- Check ethics approval ✓
- Check team qualifications ✓
- APPROVE with 6-month access

- Center Admin UGM review same request
- APPROVE

Step 6: RESEARCH/REQUESTS
- Dr. Siti see status: APPROVED
- Download datasets dari both centers
- Dataset merged dan anonymized

Step 7: RESEARCH/COLLABORATION
- Dr. Siti dan Dr. Ahmad work together
- Use platform untuk communication
- Share analysis results

Step 8: RESEARCH/PUBLICATIONS
- Research complete
- Paper published in journal
- Dr. Siti add publication:
  - Title: "Survival Outcomes in Multi-Center Breast Cancer Study"
  - Authors: Siti Nurhaliza, Ahmad Hidayat
  - Journal: Asian Pacific Journal of Cancer Prevention
  - Dataset: REQ-2024-001
  - Citations: 0 (will update)

Step 9: ANALYTICS
- Publication tracked
- Research impact metrics updated
- INAMSOS demonstrates value
```

**Modules Involved**:
- Research/Collaboration
- Research/Requests
- Approvals
- Research/Publications
- Analytics
- Email Service
- Audit Logs

---

### 🔄 CONTOH INTEGRASI 2: Quality Improvement Workflow

**Scenario**: Center Admin notice kualitas data menurun

```
Step 1: PATIENTS/QUALITY
- Center Admin login
- Dashboard shows quality score dropped: 85 → 78
- Missing data heatmap shows: "Stadium TNM Detail" 35% missing

Step 2: ANALYTICS/CENTERS
- Check performance vs other centers
- Center ranking turun dari #3 ke #5
- Identify problem

Step 3: PATIENTS/QUALITY
- Check staff leaderboard
- See: Staff "Eko Prasetyo" quality score: 65 (lowest)
- Identify: Eko sering skip stadium detail

Step 4: ADMIN/USERS
- View Eko's user profile
- See: Last login 2 days ago, 98 entries this month
- Check audit logs

Step 5: ADMIN/AUDIT
- Filter: User = Eko Prasetyo, Action = Create Patient
- Review entries
- Notice pattern: Entries sangat cepat (< 2 min per patient)
- Conclusion: Rushing, skipping validation

Step 6: ACTION
- Center Admin contact Eko
- Refresher training on stadium classification
- Set target: Quality score > 85

Step 7: PATIENTS/QUALITY (2 weeks later)
- Monitor Eko's improvement
- Quality score: 65 → 82 (better!)
- Missing data heatmap: "Stadium TNM" 35% → 18%
- Overall center score: 78 → 87
- Center ranking: #5 → #2

Step 8: REPORTS
- Generate quality improvement report
- Show before/after metrics
- Share best practices dengan centers lain
```

**Modules Involved**:
- Patients/Quality
- Analytics/Centers
- Admin/Users
- Admin/Audit
- Reports

---

### 🔄 CONTOH INTEGRASI 3: Policy Decision Workflow

**Scenario**: Health Ministry ingin alokasi resources untuk cancer screening program

```
Step 1: ANALYTICS/DISTRIBUTION
- National Admin view geographic distribution
- Hotspot detected: Jawa Barat (highest cases)
- Cancer type: Cervical cancer

Step 2: ANALYTICS/TRENDS
- View 12-month trends
- Cervical cancer increasing: +12% YoY
- Peak months: November-January

Step 3: ANALYTICS/PREDICTIONS
- View AI predictions
- 6-month forecast: +15% increase expected
- Risk factors:
  - Low screening rate (8.2/10 impact)
  - Healthcare access (7.5/10 impact)

Step 4: ANALYTICS/CENTERS
- Check which centers handle cervical cancer
- Capacity analysis:
  - RSCM: 89% capacity (high load)
  - Dharmais: 76% capacity
  - Need: 2 new centers in Jawa Barat

Step 5: RESEARCH/PUBLICATIONS
- Review research publications
- Find: "Early Detection Programs Reduce Mortality by 40%"
- Evidence for screening program

Step 6: REPORTS
- Generate comprehensive policy report:
  - Current situation (distribution map)
  - Trend analysis (increasing cases)
  - Predictions (future burden)
  - Center capacity (need expansion)
  - Evidence (research publications)
  - Recommendations:
    1. Launch screening program in Jawa Barat
    2. Establish 2 new centers
    3. Train 50 healthcare workers
    4. Budget: Rp 50 Miliar

Step 7: REPORTS/EXPORT
- Export detailed dataset untuk policy analysis
- Format: Excel dengan charts
- Share dengan Health Ministry

Step 8: DECISION
- Ministry approve program
- Resource allocated
- Program launched

Step 9: ANALYTICS/TRENDS (1 year later)
- Monitor impact
- Cervical cancer trend: +12% → -5% (decreased!)
- Screening rate: 25% → 65%
- Early stage detection: 30% → 70%
- SUCCESS!

Step 10: RESEARCH/PUBLICATIONS
- Publish impact evaluation:
  - "National Cervical Cancer Screening Program Impact in Indonesia"
  - Journal: The Lancet Regional Health
  - Citations: 45
  - INAMSOS demonstrates policy impact
```

**Modules Involved**:
- Analytics (all sub-pages)
- Research/Publications
- Reports
- Dashboard

---

## Summary: Bagaimana Semua Modul Bekerja Bersama

**CENTRAL CONCEPT**:
INAMSOS adalah **Data Lifecycle Management System** dari input → quality → research → insight → policy

**COLLABORATION as Central Theme**:

1. **Data Entry Staff** collaborate dengan **Quality System** → ensure high-quality data

2. **Researchers** collaborate dengan **Other Researchers** via **Collaboration Platform** → multi-institutional studies

3. **Researchers** collaborate dengan **Center Admins** via **Approval Workflow** → secure data access

4. **Center Admins** use **Analytics** → improve center performance

5. **National Admins** use **Analytics + Reports + Research Impact** → inform policy decisions

6. **Everyone** tracked via **Audit Logs** → compliance dan security

7. **System** sends **Email Notifications** → keep everyone informed

8. **All activities** flow to **Dashboard** → unified view

**KEY SUCCESS METRICS**:
- Data Quality Score: Target > 90
- Research Publications: Target 50+ per year
- Approval Time: Target < 7 days
- System Uptime: Target 99.9%
- User Satisfaction: Target > 4.5/5
- Policy Impact: Measurable health outcomes improvement

---

**Document End**

*Untuk pertanyaan lebih lanjut, refer to BMad Method Workflow Status atau contact system administrator.*
