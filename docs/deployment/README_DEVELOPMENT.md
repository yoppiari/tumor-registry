# 🏥 INAMSOS - Development Environment Ready!

**Indonesian National Cancer Database - Local Development Setup**

## 🚀 Quick Start

The development environment has been configured for immediate testing.

### 1. Start Services

```bash
# Start all development services
./scripts/start-dev.sh

# Or start manually:
docker-compose -f docker-compose.dev.yml up -d postgres redis minio
cd backend && npm run start:dev &
cd frontend && npm run dev &
```

### 2. Access Application

- **🌐 Frontend**: http://localhost:3000
- **🔌 Backend API**: http://localhost:3001
- **📚 API Docs**: http://localhost:3001/api
- **🗄️ pgAdmin**: http://localhost:5050 (admin@inamsos.dev/admin123)
- **💾 MinIO**: http://localhost:9000 (minioadmin/minioadmin2025)

### 3. Login Credentials

**Password for all users**: `password123`

| Role | Email | Description |
|------|-------|-------------|
| 🔧 Super Admin | admin@inamsos.dev | Full system access |
| 🏥 Hospital Admin | hospital@siloam.dev | Hospital management |
| 📊 Data Manager | datamanager@dharmais.dev | Patient data management |
| 👨‍⚕️ Oncologist | dr.santoso@cancer.dev | Clinical access |
| 🔬 Researcher | researcher@ui.dev | Research data access |

## 📋 What's Included

### Database (PostgreSQL + Redis + MinIO)
- **PostgreSQL 15** with complete schema
- **Redis 7** for caching and sessions
- **MinIO** for file storage
- **pgAdmin** for database management

### Sample Data
- **15 Medical centers** across Indonesian provinces
- **20 Sample patients** with realistic Indonesian names
- **10 Sample diagnoses** (various cancer types)
- **3 Sample treatment plans**
- **3 Sample research requests**

### Development Configuration
- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js 14 with TypeScript
- **Environment files** configured for local development
- **Auto-reload** for both backend and frontend

## 🛠️ Management Commands

```bash
# Stop all services
./scripts/stop-dev.sh

# Reset database to initial state
./scripts/reset-database.sh

# Test environment setup
./scripts/test-setup.sh

# View service logs
docker-compose -f docker-compose.dev.yml logs -f

# Access database directly
docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev
```

## 🧪 Testing Features

### Authentication Testing
1. ✅ Login with different user roles
2. ✅ Test role-based access controls
3. ✅ Verify permission enforcement

### Patient Management
1. ✅ Create new patient records
2. ✅ Search and filter patients
3. ✅ Update patient information
4. ✅ Upload patient documents

### Clinical Features
1. ✅ Create diagnoses
2. ✅ Plan treatments
3. ✅ Update treatment progress
4. ✅ Generate clinical reports

### Research Portal
1. ✅ Submit research requests
2. ✅ Track approval workflow
3. ✅ Access approved datasets

### Analytics Dashboard
1. ✅ View patient statistics
2. ✅ Generate cancer reports
3. ✅ Export data for analysis

## ⚠️ Known Issues

### Backend Build Issues
- TypeScript compilation errors exist due to missing method implementations
- Development mode works despite build errors
- Focus on functionality testing rather than build perfection

### Frontend Build Issues
- Missing component files causing build failures
- Development server runs with warnings
- Core functionality accessible in dev mode

### Permission Issues
- Some directories may have permission restrictions
- Scripts handle most permission scenarios
- Run with appropriate user permissions when possible

## 🔧 Environment Files

### Backend Configuration
`backend/.env.development` - All backend settings including:
- Database connections
- JWT secrets
- Email configuration (mocked for dev)
- File upload settings

### Frontend Configuration
`frontend/.env.local` - All frontend settings including:
- API endpoints
- Feature flags
- Development tools

## 📚 Documentation

- **📖 Development Guide**: `DEVELOPMENT_GUIDE.md`
- **🗄️ Database Schema**: `database/init.sql`
- **📊 Sample Data**: `database/seed.sql`
- **🐳 Docker Config**: `docker-compose.dev.yml`

## 🎯 Next Steps

1. **Run the application**: `./scripts/start-dev.sh`
2. **Test all user roles** with provided credentials
3. **Explore features** using the sample data
4. **Check API documentation** at `/api`
5. **Monitor system health** through pgAdmin

## 🤝 Support

For development issues:
1. Check `DEVELOPMENT_GUIDE.md` for detailed troubleshooting
2. Review service logs with `docker-compose logs -f`
3. Verify all prerequisites are installed
4. Test environment with `./scripts/test-setup.sh`

---

**INAMOS Development Team**
*Indonesian National Cancer Database*