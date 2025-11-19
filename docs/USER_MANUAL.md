# Panduan Pengguna INAMSOS

**Indonesia National Cancer Database System - Manual Pengguna Lengkap**

[![User Manual](https://img.shields.io/badge/user_manual-v1.0-blue.svg)](https://inamsos.go.id/docs)
[![Bahasa](https://img.shields.io/badge/language-Indonesia-green.svg)](https://id.wikipedia.org/wiki/Bahasa_Indonesia)
[![Training](https://img.shields.io/badge/training-Required-orange.svg)](https://training.inamsos.go.id)

## Daftar Istilah

- [Pengantar INAMSOS](#pengantar-inamsos)
- [Struktur Pengguna](#struktur-pengguna)
- [Getting Started](#getting-started)
- [Data Entry & Management](#data-entry--management)
- [Research & Analytics](#research--analytics)
- [Administration](#administration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting-untuk-pengguna)
- [FAQ](#faq)
- [Glossary](#glossary)

---

## Pengantar INAMSOS

### Apa itu INAMSOS?

INAMSOS (Indonesia National Cancer Database System) adalah platform nasional terpadu untuk pengumpulan, manajemen, dan analisis data kanker di seluruh Indonesia. Sistem ini dikembangkan untuk mendukung penelitian kanker dan pembuatan kebijakan kesehatan berbasis data.

### Tujuan Utama

1. **Sentralisasi Data**: Mengumpulkan data kanker dari seluruh rumah sakit kolegium
2. **Standardisasi Data**: Memastikan konsistensi data seluruh Indonesia
3. **Penelitian**: Mendukung peneliti dengan akses data berkualitas
4. **Analisis**: Memberikan insights tentang tren kanker
5. **Kebijakan**: Mendukung pembuatan kebijakan kesehatan

### Manfaat bagi Pengguna

**Untuk Rumah Sakit:**
- 📊 Dashboard komprehensif data kanker
- 🔄 Streamlined workflow data entry
- 📈 Quality metrics dan performance tracking
- 🤝 Kolaborasi penelitian multi-pusat

**Untuk Peneliti:**
- 🔍 Akses data agregat nasional
- 📋 Request data penelitian terstandardisasi
- 📊 Analisis trends dan patterns
- 🤝 Platform kolaborasi penelitian

**Untuk Policy Makers:**
- 📈 Real-time cancer statistics
- 🗺️ Geographic distribution mapping
- 📋 Policy impact analysis
- 🎯 Evidence-based decision making

---

## Struktur Pengguna

### Tipe Pengguna dan Hak Akses

#### 1. Data Entry Staff (Staf Entry Data)
**Role:** Input dan verifikasi data pasien
**Hak Akses:**
- ✅ Create dan edit patient data (center mereka sendiri)
- ✅ Upload medical images dan dokumen
- ✅ View local center data
- ❌ Akses national database
- ❌ Request data penelitian

#### 2. Researchers (Peneliti)
**Role:** Analisis data dan penelitian
**Hak Akses:**
- ✅ Browse aggregate national data (anonymized)
- ✅ Submit data request dengan justification
- ✅ Access approved datasets
- ✅ Export data untuk research
- ❌ Akses raw patient data identifying

#### 3. Center Administrators (Administrator Pusat)
**Role:** Manajemen rumah sakit/kolegium
**Hak Akses:**
- ✅ Full access ke center data
- ✅ Approve/deny data requests
- ✅ Manage user accounts di center
- ✅ View analytics dan reports
- ✅ Configure local settings

#### 4. National Stakeholders (Stakeholder Nasional)
**Role:** Policy making dan strategic planning
**Hak Akses:**
- ✅ Access ke complete anonymized national database
- ✅ Advanced analytics dan reporting
- ✅ International data sharing
- ✅ Policy influence tools
- ✅ System-wide configuration

### Hierarki Akses

```
National Stakeholders
    ↓
Center Administrators
    ↓
Researchers
    ↓
Data Entry Staff
```

---

## Getting Started

### Pendaftaran Akun

#### Langkah 1: Registrasi

1. Kunjungi https://app.inamsos.go.id
2. Klik tombol **"Daftar"**
3. Lengkapi form registrasi:

```
Informasi Personal:
- Nama Lengkap: Dr. Sarah Johnson
- Email: sarah.johnson@rumahsakit.co.id
- Nomor Telepon: +628123456789
- Nomor Kolegium: KOL2025123

Informasi Institusi:
- Rumah Sakit/Kolegium: RSUP Dr. Cipto Mangunkusumo
- Kode Institusi: RSCM-JKT001
- Provinsi: DKI Jakarta

Keamanan:
- Password: Minimal 12 karakter, kombinasi huruf, angka, dan simbol
- Konfirmasi Password: Ulangi password
- Enable MFA: Rekomendasi untuk keamanan
```

#### Langkah 2: Verifikasi Email

1. Check email untuk verification link
2. Klik link dalam 24 jam
3. Email akan terverifikasi otomatis

#### Langkah 3: Setup Multi-Factor Authentication

1. Install Google Authenticator atau Authy
2. Scan QR code yang ditampilkan
3. Masukkan 6-digit verification code
4. Simpan backup codes di tempat aman

#### Langkah 4: Approval Administrator

1. Tunggu approval dari center administrator
2. Biasanya memakan waktu 1-2 hari kerja
3. Notifikasi approval dikirim via email

### Login Pertama

1. Kunjungi https://app.inamsos.go.id/login
2. Masukkan email dan password
3. Masukkan MFA code dari authenticator app
4. Dashboard akan muncul sesuai role Anda

### Dashboard Overview

**Data Entry Staff Dashboard:**
- Quick Add Patient button
- Recent Patients list
- Data Quality Score
- Pending Tasks
- Center Statistics

**Researcher Dashboard:**
- Browse Data interface
- My Research Requests
- Available Datasets
- Analytics Tools
- Collaboration Opportunities

**Center Administrator Dashboard:**
- Center Overview
- Pending Requests
- User Management
- Quality Reports
- Performance Metrics

**National Stakeholder Dashboard:**
- National Overview
- Policy Insights
- Trend Analysis
- International Reports
- System Configuration

---

## Data Entry & Management

### Pendaftaran Pasien Baru

#### Akses Menu Patient Registration

1. Login ke INAMSOS
2. Klik menu **"Patients"** → **"Add New Patient"**
3. Form akan muncul dalam 2 tahap:

#### Tahap 1: Informasi Dasar (Quick Registration)

```
Field Wajib:
- Nomor Rekam Medis (MRN): RMN2025001234
- Nama Lengkap: Budi Santoso
- Tanggal Lahir: 15/05/1980
- Jenis Kelamin: Laki-laki
- Nomor NIK: 3201011505800001
- Nomor Telepon: +628123456789

Field Opsional:
- Email: budi.santoso@email.com
- Alamat: Jl. Sudirman No. 123, Jakarta
- Kontak Darurat: Ibu Budi (+628987654321)
```

#### Tahap 2: Informasi Detail (Complete Registration)

```
Demografi Lengkap:
- Status Pernikahan: Menikah
- Pendidikan: S1
- Pekerjaan: Swasta
- Suku: Jawa
- Agama: Islam

Riwayat Kesehatan:
- Riwayat Keluarga dengan Kanker: Ayah (Kanker Paru)
- Riwayat Merokok: Ya, 20 batang/hari selama 15 tahun
- Riwayat Alkohol: Tidak
- Komorbiditas: Diabetes Mellitus, Hipertensi
```

### Medical Record Entry

#### Form Diagnosis

1. Dari patient profile, klik **"Add Medical Record"**
2. Isi form diagnosis:

```
Informasi Diagnosis:
- Tanggal Diagnosis: 19/11/2025
- Kanker Primer: Kanker Paru
- Lokasi Primer: Paru Kanan
- Histologi: Adenocarsinoma
- Grading: Moderately Differentiated (G2)
- Staging: Stage IIIA (T2aN2M0)
- Kode ICD-10: C78.0

Presentasi Klinis:
- Gejala Utama: Batuk persisten, penurunan berat badan
- Durasi Gejala: 3 bulan
- ECOG Performance Status: 1
- Comorbidities: Diabetes tipe 2

Prosedur Diagnostik:
- Biopsi: 15/10/2025 - Positif adenocarcinoma
- CT Scan Thorax: 10/10/2025 - Massa 3x4 cm
- PET-CT: 12/10/2025 - Tidak ada metastasis jauh
```

#### Form Treatment Plan

```
Modalitas Treatment:
- Kemoterapi: Ya
- Radiasi: Ya
- Bedah: Tidak (inoperabel)
- Targeted Therapy: Tidak
- Immunotherapy: Tidak

Regimen Kemoterapi:
- Skema: Karboplatin + Paklitaksel
- Jumlah Siklus: 6
- Frekuensi: Setiap 3 minggu
- Dosis Target: Karboplatin AUC 5, Paklitaksel 175 mg/m2

Radioterapi:
- Total Dose: 60 Gy
- Fraksi: 2 Gy per fraksi (30 fraksi)
- Target Volume: Tumor + margin 2 cm
- Teknik: IMRT

Follow-up Plan:
- Imaging Follow-up: CT Scan setelah 2 bulan
- Clinical Follow-up: Setiap 3 bulan
- Survivorship Care Plan: Ya
```

### Quality Assurance

#### Automated Validation

System otomatis melakukan validasi:

1. **Format Validation**: Email, phone number, NIK format
2. **Clinical Validation**: Staging consistency, treatment appropriateness
3. **Completeness Check**: Required fields completion
4. **Logic Validation**: Date consistency, age-appropriate data

#### Manual Review Process

Data yang memerlukan manual review:

1. **Unusual Patterns**: Age < 18 atau > 100 untuk cancer types tertentu
2. **Staging Inconsistency**: Stage tidak sesuai dengan tumor size
3. **Treatment Mismatch**: Treatment tidak sesuai dengan guidelines
4. **Missing Critical Data**: Essential diagnosis information missing

#### Quality Metrics

Dashboard menunjukkan:

```
Kualitas Data Center Anda:
- Completeness: 94.5%
- Accuracy: 96.2%
- Timeliness: 91.8%
- Consistency: 89.4%

Total Score: 93.0% (Baik)
```

### File Upload

#### Supported File Types

**Medical Images:**
- DICOM files (.dcm)
- JPEG/PNG untuk radiology reports
- PDF untuk scan documents

**Documents:**
- PDF (max 10MB)
- Word Documents (.doc, .docx)
- Excel Spreadsheets (.xls, .xlsx)
- Images (.jpg, .png, .gif - max 5MB)

#### Upload Procedure

1. Di patient profile, klik **"Upload Documents"**
2. Pilih document type:
   - Pathology Report
   - Radiology Images
   - Laboratory Results
   - Consent Forms
   - Other Medical Documents
3. Drag & drop files atau click to browse
4. Add description (wajib)
5. Click **"Upload"**

#### File Security

- ✅ Files di-encrypt saat storage
- ✅ Access log untuk setiap file access
- ✅ Automatic virus scanning
- ✅ HIPAA-compliant file handling

---

## Research & Analytics

### Browse Aggregated Data

#### Access Interface

1. Login sebagai Researcher
2. Klik menu **"Research"** → **"Browse Data"**
3. Interface menampilkan aggregated data tanpa identifying information

#### Available Filters

```
Demografi Filters:
- Jenis Kelamin: Laki-laki, Perempuan
- Kelompok Umur: <20, 20-39, 40-59, 60+
- Provinsi: Semua provinsi di Indonesia
- Tahun: 2020-2025

Klinis Filters:
- Jenis Kanker: 50+ cancer types
- Staging: Stage I-IV
- Histologi: Berbagai subtype
- Treatment Modality: Surgery, Chemo, Radiation, dll

Geografis Filters:
- Regional: Sumatra, Jawa, Kalimantan, dll
- Provinsi: DKI Jakarta, Jawa Barat, dll
- Urban/Rural: Classification berdasarkan data
```

#### Data Visualization

1. **Distribution Maps**: Geographic cancer distribution
2. **Trend Charts**: Time-series cancer trends
3. **Age Pyramid**: Age-specific cancer patterns
4. **Survival Curves**: Kaplan-Meier survival analysis

#### Export Options

- **PDF Report**: Complete analysis report
- **Excel Data**: Raw data for further analysis
- **JSON**: For integration with research tools
- **Image**: High-resolution charts and maps

### Submit Research Request

#### Request Types

**1. Epidemiological Study**
- Cancer incidence and prevalence
- Geographic distribution studies
- Time trend analysis
- Risk factor analysis

**2. Clinical Outcome Study**
- Treatment effectiveness
- Survival analysis
- Quality of life studies
- Treatment pattern analysis

**3. Health Services Research**
- Healthcare utilization patterns
- Treatment guideline adherence
- Resource allocation studies
- Access to care analysis

#### Request Process

**Step 1: Prepare Research Proposal**

```
Informasi Proposal:
- Judul Penelitian: "Trend Kanker Paru di Indonesia: Analisis 5 Tahun Terakhir"
- Peneliti Utama: Dr. Sarah Johnson
- Institusi: Universitas Indonesia
- Email Peneliti: sarah.j@ui.ac.id
- Durasi Penelitian: 12 bulan

Methodology:
- Study Design: Retrospective cohort study
- Population: All lung cancer patients 2020-2024
- Sample Size: ~10,000 patients
- Statistical Analysis: Survival analysis, trend analysis

Ethical Considerations:
- IRB Approval: Terlampir
- Patient Consent: Waivered (de-identified data)
- Data Security: Compliance dengan regulations
- Publication Plan: 2 journal articles + conference presentation
```

**Step 2: Submit Request**

1. Klik **"Research"** → **"New Request"**
2. Upload proposal documents:
   - Research protocol
   - IRB approval letter
   - CV peneliti utama
   - Data use agreement
3. Specify data requirements:
   ```
   Data Requirements:
   - Time Period: 2020-2024
   - Cancer Types: Lung cancer (all subtypes)
   - Data Fields: Demographics, diagnosis, treatment, outcomes
   - Geographic Scope: National
   - Anonymization Level: Pseudonymized
   - Format: CSV + SAS dataset
   ```

**Step 3: Review Process**

1. **Initial Review**: Automated compliance check (2-3 hari)
2. **Scientific Review**: Expert panel review (5-7 hari)
3. **Center Approval**: Individual center approvals (7-14 hari)
4. **Final Approval**: National committee (2-3 hari)

**Step 4: Data Access**

- Approved data disediakan di secure FTP
- Access berlaku untuk 6 bulan
- Data harus dihapus setelah penelitian selesai
- Progress report diperlukan setiap 3 bulan

### Collaboration Platform

#### Find Collaborators

1. **Expert Directory**: Cari peneliti dengan expertise tertentu
2. **Active Projects**: Lihat ongoing research projects
3. **Institution Profiles**: Profile institutions dengan data availability

#### Collaboration Features

- **Secure Messaging**: Encrypted communication platform
- **Document Sharing**: Secure document repository
- **Project Management**: Research project tracking
- **Publication Tools**: Co-authorship management

---

## Administration

### User Management

#### Create New User (Center Administrator)

1. Klik **"Administration"** → **"Users"** → **"Add User"**
2. Isi user information:

```
Informasi User:
- Nama: Dr. John Doe
- Email: john.doe@rumahsakit.co.id
- Phone: +628123456789
- Role: Data Entry Staff
- Department: Oncology
- Active Status: Yes

Permissions:
- Can Add Patients: Yes
- Can Edit Patients: Yes
- Can Delete Patients: No
- Can Export Data: No
- Can View Reports: Yes
```

3. Set user permissions sesuai job role
4. Click **"Create User"**

#### Manage User Roles

**Role Assignment:**

- **Data Entry**: Patient management only
- **Researcher**: Data access dan analysis
- **Administrator**: Full center management
- **Auditor**: Read-only access untuk audit

**Permission Matrix:**

| Feature | Data Entry | Researcher | Administrator | Auditor |
|---------|------------|------------|---------------|---------|
| Add Patients | ✅ | ❌ | ✅ | ❌ |
| Edit Patients | ✅ | ❌ | ✅ | ❌ |
| Delete Patients | ❌ | ❌ | ✅ | ❌ |
| Browse Research Data | ❌ | ✅ | ✅ | ✅ |
| Export Data | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ |
| System Configuration | ❌ | ❌ | ✅ | ❌ |

### Center Configuration

#### General Settings

1. Klik **"Administration"** → **"Settings"** → **"Center Profile"**

```
Center Information:
- Nama Lengkap: RSUP Dr. Cipto Mangunkusumo
- Kode Center: RSCM-JKT001
- Alamat: Jl. Diponegoro No. 71, Jakarta Pusat
- Telepon: +62213921355
- Email: info@rscm.co.id
- Website: www.rscm.co.id

Operational Details:
- Kolegium ID: KOL123456
- Akreditasi: A (Paripurna)
- Kapasitas Tempat Tidar: 1000
- Jumlah Oncologist: 15
- Fasilitas: Yes (Chemo, Radiation, Surgery)
```

#### Data Quality Standards

```
Quality Thresholds:
- Completeness Target: 95%
- Accuracy Target: 98%
- Timeliness Target: 90%
- Consistency Target: 95%

Validation Rules:
- Required Fields: Patient demographics, diagnosis, staging
- Validation Logic: Age-appropriate diagnosis, staging consistency
- Automated Checks: Format validation, range checking
- Manual Review: Complex cases, outlier detection
```

### Reports and Analytics

#### Standard Reports

**Monthly Reports:**
- Patient Registration Summary
- Quality Metrics Dashboard
- Research Request Status
- System Usage Statistics

**Quarterly Reports:**
- Center Performance Analysis
- Cancer Trend Analysis
- Research Impact Report
- Compliance Audit Report

**Annual Reports:**
- Comprehensive Center Performance
- National Contribution Analysis
- Research Publication Impact
- System Utilization Summary

#### Custom Reports

1. Klik **"Reports"** → **"Create Custom Report"**
2. Configure report parameters:
   ```
   Report Configuration:
   - Title: "Quarterly Oncology Performance Report"
   - Data Source: Patient Registry
   - Time Period: Q4 2025
   - Metrics: Patient volume, quality scores, research output
   - Format: PDF + Excel
   - Schedule: Quarterly
   - Recipients: Center Director, Department Heads
   ```

3. Save template untuk penggunaan berulang

### System Monitoring

#### Health Dashboard

Real-time system metrics:
```
System Health: ✅ Optimal
- Server Response Time: 245ms
- Database Performance: 98%
- Active Users: 47/150
- Queue Processing: Normal
- Error Rate: 0.1%

Data Quality: ✅ Good
- Completeness: 94.2%
- Accuracy: 96.8%
- Timeliness: 91.5%
- Consistency: 89.9%
```

#### Alert Management

**Alert Types:**
- **Critical**: System down, data breach
- **Warning**: Performance degradation, quality threshold breach
- **Info**: New features, maintenance schedule

**Notification Channels:**
- Email alerts
- SMS notifications (critical only)
- Dashboard notifications
- Slack integration (optional)

---

## Best Practices

### Data Entry Best Practices

#### Before Entry
1. **Verify Patient Identity**: Double-check NIK dan medical record number
2. **Prepare Documentation**: Kumpulkan semua documents sebelum entry
3. **Check for Duplicates**: Cari existing patient records
4. **Stabilized Diagnosis**: Entry diagnosis setelah konfirmasi pathology

#### During Entry
1. **Complete All Required Fields**: Hindari pending data
2. **Use Standard Terminology**: Ikut ICD-10 dan standard coding
3. **Accurate Staging**: Gunakan TNM classification terbaru
4. **Document Everything**: Catat semua relevant clinical information

#### After Entry
1. **Review for Errors**: Double-check all entries
2. **Upload Supporting Documents**: Attach semua relevant scans
3. **Update Regularly**: Keep records current
4. **Quality Check**: Run self-audit periodically

### Security Best Practices

#### Account Security
- ✅ Use strong, unique passwords
- ✅ Enable MFA/Two-factor authentication
- ✅ Regular password changes (setiap 90 hari)
- ✅ Never share credentials
- ✅ Logout setelah selesai

#### Data Security
- ✅ Access only necessary data
- ✅ Use secure networks (avoid public WiFi)
- ✅ Report suspicious activities
- ✅ Follow data handling protocols
- ✅ Regular security training

#### Compliance
- ✅ Follow HIPAA guidelines
- ✅ Maintain patient confidentiality
- ✅ Proper data disposal procedures
- ✅ Documentation of all accesses
- ✅ Regular compliance audits

### Research Best Practices

#### Study Design
1. **Clear Research Question**: Spesifik dan measurable
2. **Appropriate Methodology**: Sesuai dengan research objectives
3. **Sample Size Calculation**: Statistical power consideration
4. **Ethical Considerations**: IRB approval, patient consent
5. **Data Management Plan**: Secure storage dan handling

#### Data Request
1. **Complete Documentation**: Semua required forms dan approvals
2. **Justified Need**: Clear rationale untuk data access
3. **Anonymization Preference**: Request minimal identifying data
4. **Timeline**: Realistic project timeline
5. **Publication Plan**: Dissemination plan untuk results

#### Collaboration
1. **Clear Agreements**: MOU untuk collaborations
2. **Authorship Guidelines**: Fair credit assignment
3. **Data Sharing**: Transparent data sharing policies
4. **Communication**: Regular progress updates
5. **Conflict Resolution**: Predefined conflict resolution process

---

## Troubleshooting untuk Pengguna

### Common Issues

#### Login Issues

**Problem:** Tidak bisa login
**Solutions:**
1. Check username dan password
2. Clear browser cache dan cookies
3. Verify MFA code (cek waktu di authenticator app)
4. Reset password jika diperlukan
5. Hubungi administrator jika account terkunci

**Problem:** MFA code tidak works
**Solutions:**
1. Sync waktu device (auto-sync ke network time)
2. Gunakan backup code (jika ada)
3. Re-setup MFA dengan administrator
4. Cek authenticator app updates

#### Data Entry Issues

**Problem:** Error saat save patient data
**Solutions:**
1. Check required fields (marked with *)
2. Verify data format (date, phone, email)
3. Check for duplicate medical record numbers
4. Verify NIK validity (16 digits)
5. Check internet connection stability

**Problem:** Cannot upload files
**Solutions:**
1. Check file size (max 10MB untuk PDF)
2. Verify file type (supported formats only)
3. Check internet connection speed
4. Try different browser (Chrome/Firefox recommended)
5. Compress large files sebelum upload

#### Data Access Issues

**Problem:** Cannot see patient records
**Solutions:**
1. Verify user role dan permissions
2. Check center assignment
3. Verify account approval status
4. Check active user status
5. Contact administrator untuk permission adjustment

**Problem:** Research request rejected
**Solutions:**
1. Review rejection reason
2. Complete missing documentation
3. Clarify research methodology
4. Get IRB approval if missing
5. Revise data justification

### Performance Issues

#### Slow Loading

**Solutions:**
1. Check internet connection speed
2. Close unnecessary browser tabs
3. Clear browser cache
4. Try different browser
5. Access during off-peak hours

#### System Errors

**Solutions:**
1. Refresh page (F5 or Ctrl+R)
2. Clear browser cache dan cookies
3. Try incognito/private browsing
4. Check service status page
5. Report dengan screenshot error

### Contact Support

#### When to Contact Support

- System outage atau critical errors
- Security concerns atau data breach
- Account access issues
- Bug reports dengan reproduction steps
- Feature requests dan suggestions

#### Support Channels

**IT Help Desk:**
- Email: support@inamsos.go.id
- Phone: (021) 12345678 ext. 999
- Available: Senin - Jumat, 08:00 - 17:00 WIB
- Emergency: 24/7 untuk critical issues

**Local Administrator:**
- Center-specific issues
- User management requests
- Permission adjustments
- Local configuration

**Regional Support:**
- Regional training sessions
- On-site support requests
- Multi-center coordination
- Regional policy questions

---

## FAQ (Pertanyaan yang Sering Diajukan)

### General Questions

**Q: Apa persyaratan untuk menggunakan INAMSOS?**
A: Anda harus:
- Bekerja di rumah sakit kolegium yang terdaftar
- Memiliki nomor kolegium yang valid
- Menyelesaikan training wajib
- Mendapatkan approval dari center administrator

**Q: Berapa lama proses approval akun?**
A: Biasanya 1-2 hari kerja setelah:
- Email verification complete
- MFA setup done
- Documentation submitted

**Q: Apakah INAMSOS tersedia dalam bahasa Indonesia?**
A: Ya, system mendukung penuh Bahasa Indonesia dan English.

### Data Entry Questions

**Q: Bagaimana cara menangani pasien tanpa NIK?**
A: Gunakan temporary identifier dan update dengan NIK secepatnya. System akan mengirim reminder untuk update.

**Q: Apa yang terjadi jika saya membuat kesalahan saat entry data?**
A: Anda bisa edit data kapan saja. Semua perubahan tercatat di audit trail.

**Q: Bagaimana cara meng-handle duplicate patient records?**
A: System otomatis detect potential duplicates. Anda bisa merge records dengan admin approval.

### Research Questions

**Q: Berapa lama proses approval research request?**
A: Rata-rata 14-21 hari, tergantung pada:
- Completeness documentation
- Number of centers involved
- Complexity request
- IRB approval status

**Q: Apa jenis data yang tersedia untuk researchers?**
A: Tersedia:
- Aggregated anonymous data (immediate access)
- Pseudonymized data (with approval)
- Limited re-identified data (special approval)
- Clinical trial data (specific approval)

**Q: Bagaimana cara mendapatkan technical support untuk research data?**
A: Contact research support team dengan:
- Project details
- Specific technical questions
- Data format preferences
- Timeline requirements

### Security Questions

**Q: Apakah data pasien aman di INAMSOS?**
A: Ya, kami menggunakan:
- AES-256 encryption
- Secure data centers
- Regular security audits
- HIPAA compliance
- Indonesian data protection laws

**Q: Siapa yang bisa akses data pasien?**
A: Hanya authorized personnel dengan:
- Appropriate user role
- Need-to-know basis
- Proper training
- Active audit monitoring

**Q: Bagaimana cara report security concerns?**
A: Contact security team immediately:
- Email: security@inamsos.go.id
- Phone: (021) 12345678 ext. 888
- 24/7 availability untuk critical issues

---

## Glossary

### Istilah Teknis

**API (Application Programming Interface):** Interface untuk komunikasi antar sistem

**Audit Trail:** Record dari semua system activities dan data changes

**Authentication:** Proses verifikasi user identity

**Authorization:** Proses menentukan user permissions

**Encryption:** Proses mengamankan data menggunakan cryptographic algorithms

**HIPAA (Health Insurance Portability and Accountability Act):** US federal law untuk patient privacy protection

**MFA (Multi-Factor Authentication):** Security process menggunakan multiple authentication methods

**RBAC (Role-Based Access Control):** Access control berdasarkan user roles

**TLS (Transport Layer Security):** Protocol untuk secure communication over network

### Istilah Klinis

**Adenocarcinoma:** Tipe cancer yang berasal dari glandular cells

**Histology:** Study dari tissue structure dan composition

**ICD-10 (International Classification of Diseases):** Standard coding system untuk diseases

**Staging:** Process menentukan extent of cancer dalam body

**TNM Classification:** System untuk cancer staging (Tumor, Node, Metastasis)

### Istilah System

**Dashboard:** Visual interface menampilkan key metrics dan information

**Data Quality:** Measure dari data accuracy, completeness, consistency

**Export Process:** Menyalin data dari system ke format lain

**User Interface:** Point of interaction antara user dan system

**Workflow:** Sequence dari steps untuk menyelesaikan task tertentu

---

## Resource Links

### Training Resources

- [Video Tutorial Series](https://training.inamsos.go.id/videos)
- [User Manual PDF](https://docs.inamsos.go.id/manual.pdf)
- [Best Practices Guide](https://docs.inamsos.go.id/best-practices)
- [Security Training Module](https://training.inamsos.go.id/security)

### Support Resources

- [Help Center](https://help.inamsos.go.id)
- [Knowledge Base](https://kb.inamsos.go.id)
- [Community Forum](https://community.inamsos.go.id)
- [Video Tutorials](https://tutorials.inamsos.go.id)

### Reference Resources

- [ICD-10 Coding Reference](https://icd.who.int)
- [TNM Staging Manual](https://www.uicc.org)
- [Clinical Practice Guidelines](https://guidelines.inamsos.go.id)
- [Research Protocols](https://research.inamsos.go.id/protocols)

---

## Conclusion

INAMSOS dirancang untuk mendukung penelitian kanker di Indonesia dengan menyediakan:

- 🔐 **Data Security:** Highest standards untuk patient data protection
- 📊 **Quality Data:** Standardized, validated medical data
- 🔍 **Research Support:** Tools untuk cancer research
- 🤝 **Collaboration:** Platform untuk multi-center studies
- 📈 **Analytics:** Insights untuk cancer trends

### Next Steps

1. **Complete Training:** Selesaikan semua required training modules
2. **Practice in Sandbox:** Gunakan training environment untuk practice
3. **Start Small:** Mulai dengan basic data entry tasks
4. **Expand Usage:** Pelajari advanced features gradually
5. **Provide Feedback:** Bantu kami improve system

### Stay Connected

- **Updates:** Subscribe untuk system updates dan announcements
- **Training:** Ikuti ongoing training sessions
- **Community:** Join user community untuk best practices
- **Support:** Don't hesitate untuk contact support

---

**Terima kasih telah menjadi bagian dari INAMSOS!**
*Together, we can advance cancer research in Indonesia.*

**© 2025 INAMSOS - User Experience Team**
*Last Updated: November 19, 2025*
*Version: 1.0*