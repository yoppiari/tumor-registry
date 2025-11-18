# User Project Description

## Project: Inamsos - Database Tumor Nasional

**Date:** 2025-11-17
**User:** Yoppi
**Project Type:** Healthcare Information System

### Project Overview
Sistem database tumor nasional internal untuk kolegium yang menghubungkan berbagai center tumor di seluruh Indonesia.

### Key Features
1. **Multi-Center Data Collection**
   - Center-center tumor kolegium bisa input data
   - Data terdistribusi dari berbagai kota di Indonesia

2. **Two-Layer Form System**
   - **Bagian 1:** Close questions → pull ke database nasional
   - **Bagian 2:** Data detail + foto + data kependudukan pasien (lokal)

3. **Real-time Analytics Dashboard**
   - Grafis dan analisa data nasional
   - Filter berdasarkan close questions form bagian 1
   - Real-time visualization

4. **Inter-Center Data Request System**
   - Center bisa request data ke center lain
   - Approval workflow untuk data request
   - Role-based access control untuk approve

5. **Multi-Role Access Control**
   - Data Entry Only (input only, no request)
   - View + Request (see all + can request)
   - Full Access + Approve (everything + approval)
   - National Data Access (access central database)

6. **Rich Media Support**
   - Multiple foto upload per pasien
   - Foto pendukung data medis

### Technical Considerations
- **Security:** Data medis pasien yang sangat sensitif
- **Multi-tenant:** Banyak center dengan akses berbeda
- **Distributed:** Data lokal vs data nasional
- **Real-time:** Analytics dashboard
- **Workflow:** Request/approval system
- **Media:** File upload and storage

### Status
- Form lengkap masih dalam pembuatan
- Need mockup form untuk development
- Project baru dari awal (greenfield)