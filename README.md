# INAMSOS - Indonesia National Cancer Database System

**Sistem Basis Data Kanker Nasional Indonesia**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.6.0-black.svg)](https://www.prisma.io/)

## Ringkasan Proyek

INAMSOS (Indonesia National Cancer Database System) adalah platform terpadu untuk pengumpulan, manajemen, dan analisis data kanker secara nasional. Sistem ini dirancang khusus untuk mendukung penelitian kanker di Indonesia dengan fitur keamanan tingkat tinggi dan kepatuhan terhadap regulasi kesehatan.

## 🎯 Tujuan Utama

- **Sentralisasi Data**: Mengumpulkan data kanker dari seluruh rumah sakit kolegium di Indonesia
- **Penelitian**: Mendukung peneliti dengan akses data terstandardisasi dan anonim
- **Analisis Prediktif**: Memberikan wawasan tentang tren kanker di Indonesia
- **Kebijakan**: Mendukung pembuatan kebijakan kesehatan berbasis data
- **Kolaborasi**: Memfasilitasi kolaborasi penelitian multi-pusat

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │  Redis  │            │ MinIO   │            │ Elastic │
    │ (Cache) │            │ (Files) │            │ (Logs)  │
    └─────────┘            └─────────┘            └─────────┘
```

## 🚀 Fitur Utama

### 📊 Manajemen Data Pasien
- Pendaftaran pasien tumor yang komprehensif
- Formulir entry data dengan validasi real-time
- Upload gambar medis dan dokumen pendukung
- Quality assurance dan data validation
- Audit trail lengkap untuk semua perubahan

### 🔐 Keamanan & Privasi
- Multi-Factor Authentication (MFA)
- Role-based Access Control (RBAC)
- Enkripsi data end-to-end (AES-256)
- Audit logging yang komprehensif
- Kepatuhan HIPAA dan regulasi kesehatan Indonesia

### 🔍 Akses Penelitian
- Browser data agregat anonim
- Sistem permintaan data dengan approval workflow
- Export data dalam format penelitian standar
- Kolaborasi multi-pusat
- Tracking impact penelitian

### 📈 Analytics & Dashboard
- Real-time cancer distribution mapping
- Trend analysis dengan visualisasi time-series
- Center comparison analytics
- Predictive analytics untuk emerging patterns
- Performance metrics dan KPI tracking

### 👥 Manajemen Pengguna
- 4 tingkat akses pengguna yang berbeda
- Multi-center tenant architecture
- User lifecycle management
- Training dan onboarding workflows

## 🛠️ Teknologi Stack

### Backend
- **Framework**: NestJS 10.0.0
- **Bahasa**: TypeScript 5.1.3
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.6.0
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Queue**: Bull Queue dengan Redis
- **File Storage**: MinIO (S3-compatible)
- **Monitoring**: Winston + Prometheus
- **Security**: Helmet, CORS, Rate Limiting

### Database Architecture
- **Multi-schema**: audit, medical, system schemas
- **Data separation**: Logical separation per center
- **Audit trails**: Complete change tracking
- **Backup strategy**: Automated backups with retention

### Integration & APIs
- **RESTful API**: OpenAPI 3.0 documentation
- **Authentication**: JWT with refresh tokens
- **File handling**: Multer dengan MinIO
- **Email**: Nodemailer dengan templates
- **SMS**: Twilio integration
- **Healthcare standards**: HL7/FHIR ready

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0+ LTS
- **PostgreSQL**: 15+
- **Redis**: 6.0+
- **MinIO**: Latest release
- **Memory**: Minimum 8GB RAM
- **Storage**: Minimum 100GB SSD

### Development Tools
- **Git**: Version control
- **Docker**: Containerization (optional)
- **VS Code**: Recommended IDE
- **Postman**: API testing

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/indonesia-health/inamsos.git
cd inamsos
```

### 2. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Generate Prisma client
npx prisma generate
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Database Setup
```bash
# Run migrations
npx prisma migrate dev

# Seed initial data
npm run db:seed
```

### 5. Start Development Server
```bash
# Start backend
npm run start:dev

# API Documentation available at:
# http://localhost:3000/api-docs
```

## 📚 Dokumentasi

- **[API Documentation](docs/API_DOCUMENTATION.md)**: Referensi API lengkap
- **[Security Guide](docs/SECURITY_GUIDE.md)**: Konfigurasi keamanan
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**: Panduan deployment produksi
- **[User Manual](docs/USER_MANUAL.md)**: Panduan pengguna lengkap
- **[Architecture](docs/ARCHITECTURE.md)**: Dokumentasi arsitektur sistem
- **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Solusi masalah umum

## 🔧 Development

### Available Scripts
```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start with debugging
npm run test               # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Building
npm run build             # Build for production
npm run start:prod        # Start production build

# Database
npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run database migrations
npm run db:seed          # Seed database with initial data

# Code Quality
npm run lint              # Run ESLint
npm run format           # Format code with Prettier
```

### Project Structure
```
inamsos/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration files
│   │   └── main.ts         # Application entry point
│   ├── prisma/            # Database schema and migrations
│   ├── test/              # Test files
│   └── package.json
├── docs/                   # Documentation files
├── scripts/               # Build and deployment scripts
└── docker-compose.yml     # Docker configuration
```

## 🔐 Keamanan

### Data Protection
- ✅ AES-256 encryption untuk data sensitif
- ✅ TLS 1.3 untuk data transmission
- ✅ Multi-factor authentication
- ✅ Role-based access control
- ✅ Audit logging lengkap
- ✅ Regular security patches

### Compliance
- ✅ HIPAA compliance
- ✅ Indonesian data protection laws
- ✅ Medical ethics standards
- ✅ IRB approval workflows
- ✅ Data retention policies

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-mfa` - MFA verification
- `GET /auth/profile` - Get user profile

### Patients
- `GET /patients` - Get patients list
- `POST /patients` - Create new patient
- `GET /patients/:id` - Get patient details
- `PUT /patients/:id` - Update patient data

### Research
- `GET /research/data` - Browse aggregated data
- `POST /research/requests` - Submit data request
- `GET /research/collaborations` - View collaborations

### Analytics
- `GET /analytics/dashboard` - Dashboard metrics
- `GET /analytics/trends` - Cancer trends
- `GET /analytics/reports` - Generate reports

*Untuk dokumentasi API lengkap, lihat [API Documentation](docs/API_DOCUMENTATION.md)*

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas pengembang dan peneliti kesehatan. Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan kontribusi.

### Development Workflow
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📞 Dukungan

### Technical Support
- **Email**: support@inamsos.go.id
- **Documentation**: [docs/](docs/)
- **Issue Tracking**: GitHub Issues

### User Support
- **Training Programs**: Program pelatihan tersedia untuk semua user types
- **User Manuals**: Dokumentasi pengguna lengkap
- **Help Desk**: Dukungan teknis 24/7 untuk critical issues

## 📄 License

Proyek ini dilisensikan under MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🏆 Acknowledgments

- **Kolegium Onkologi Indonesia** - Partner utama
- **Kementerian Kesehatan RI** - Support regulasi
- **Rumah Sakit Kolegium** - Data providers
- **Tim Pengembang INAMSOS** - Development team

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core data collection system
- ✅ Basic authentication & authorization
- ✅ Simple analytics dashboard
- ✅ Research request workflow

### Phase 2 (Q1 2025)
- 🔄 Advanced AI-powered analytics
- 🔄 Mobile applications
- 🔄 Integration dengan international databases
- 🔄 Enhanced collaboration platform

### Phase 3 (Q3 2025)
- 📋 Predictive treatment outcomes
- 📋 Real-time clinical decision support
- 📋 International research partnerships
- 📋 Advanced genetic analysis

---

**INAMSOS** - Membangun masa depan penelitian kanker Indonesia melalui data dan teknologi.

Untuk informasi lebih lanjut, hubungi:
- **Email**: info@inamsos.go.id
- **Website**: https://inamsos.go.id
- **Documentation**: https://docs.inamsos.go.id
