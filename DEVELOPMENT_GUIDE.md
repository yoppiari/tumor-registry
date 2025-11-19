# INAMSOS Development Guide

**Indonesian National Cancer Database - Local Development Environment**

## 🎯 Overview

This guide provides complete instructions for setting up and running the INAMSOS tumor registry system locally for development and testing purposes.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   Database      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                       │
                              ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │      Redis      │    │     MinIO       │
                       │     Cache       │    │  File Storage   │
                       │   Port: 6379    │    │  Port: 9000     │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:

```bash
# Check Docker installation
docker --version

# Check Docker Compose installation
docker-compose --version

# Check Node.js installation (v18+ recommended)
node --version

# Check NPM installation
npm --version
```

### 2. Initial Setup

```bash
# Clone or navigate to the project directory
cd /home/yopi/Projects/tumor-registry

# Test your environment setup
./scripts/test-setup.sh

# Start the development environment
./scripts/start-dev.sh
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
- **MinIO Console**: http://localhost:9000 (minioadmin/minioadmin2025)
- **pgAdmin**: http://localhost:5050 (admin@inamsos.dev/admin123)

## 🔐 Login Credentials

All sample users use the password: `password123`

| Role | Email | Access Level |
|------|-------|--------------|
| Super Admin | admin@inamsos.dev | Full system access |
| Hospital Admin | hospital@siloam.dev | Hospital management |
| Data Manager | datamanager@dharmais.dev | Patient data management |
| Oncologist | dr.santoso@cancer.dev | Clinical access |
| Researcher | researcher@ui.dev | Research data access |

## 🗄️ Database Setup

### Sample Data

The development environment includes:

- **5 User roles** with different permission levels
- **15 Medical centers** across Indonesian provinces
- **20 Sample patients** with realistic Indonesian names
- **10 Sample diagnoses** with various cancer types
- **3 Sample treatment plans**
- **3 Sample research requests**

### Database Management

```bash
# Reset database to initial state
./scripts/reset-database.sh

# View database logs
docker-compose -f docker-compose.dev.yml logs postgres -f

# Access PostgreSQL directly
docker-compose -f docker-compose.dev.yml exec postgres psql -U inamsos -d inamsos_dev
```

## 🛠️ Development Commands

### Start/Stop Services

```bash
# Start all development services
./scripts/start-dev.sh

# Stop all development services
./scripts/stop-dev.sh

# Restart only database services
docker-compose -f docker-compose.dev.yml restart postgres redis
```

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run in development mode with auto-reload
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run tests
npm run test
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors

```bash
# Fix script permissions
chmod +x scripts/*.sh

# Fix directory permissions
sudo chown -R $USER:$USER backend/dist frontend/node_modules
```

#### 2. Docker Issues

```bash
# Check if Docker is running
docker info

# Clean up Docker containers and volumes
docker-compose -f docker-compose.dev.yml down -v
docker system prune -f

# Restart Docker service
sudo systemctl restart docker
```

#### 3. Port Conflicts

```bash
# Check what's using ports 3000, 3001
lsof -i :3000
lsof -i :3001

# Kill processes using those ports
kill -9 <PID>
```

#### 4. Database Connection Issues

```bash
# Reset database
./scripts/reset-database.sh

# Check database status
docker-compose -f docker-compose.dev.yml ps postgres

# View database logs
docker-compose -f docker-compose.dev.yml logs postgres -f
```

#### 5. Build Errors

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend TypeScript errors (common during development)
# The application can run in development mode despite some build errors
npm run start:dev
```

### Environment Variables

#### Backend (.env.development)

```env
DATABASE_URL=postgresql://inamsos:dev_password@localhost:5432/inamsos_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
PORT=3001
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=INAMSOS Dev
NODE_ENV=development
```

## 📊 Feature Testing Guide

### 1. User Authentication

1. Navigate to http://localhost:3000
2. Login with any sample user credentials
3. Test role-based access controls
4. Verify password reset functionality

### 2. Patient Management

1. Login as Data Manager or Oncologist
2. Create new patient records
3. Search and filter patients
4. Update patient information
5. Upload patient documents

### 3. Diagnosis & Treatment

1. Login as Oncologist
2. Create diagnoses for patients
3. Create treatment plans
4. Update treatment progress
5. Generate treatment reports

### 4. Research Requests

1. Login as Researcher
2. Submit research requests
3. Track request status
4. Access approved data

### 5. Analytics Dashboard

1. Login as any user with analytics access
2. View patient statistics
3. Generate reports
4. Export data

### 6. System Administration

1. Login as Super Admin
2. Manage user accounts
3. Configure system settings
4. Monitor system health
5. View audit logs

## 🔍 Testing Checklist

### Environment Setup

- [ ] Docker and Docker Compose installed
- [ ] Node.js v18+ installed
- [ ] All scripts executable
- [ ] Database services running
- [ ] Application servers accessible

### User Authentication

- [ ] Login works for all user roles
- [ ] Password reset functions correctly
- [ ] Role-based permissions enforced
- [ ] Session management works

### Core Functionality

- [ ] Patient CRUD operations
- [ ] Diagnosis management
- [ ] Treatment planning
- [ ] Research request workflow
- [ ] Analytics and reporting

### Data Management

- [ ] Sample data loaded correctly
- [ ] File uploads working
- [ ] Data export functions
- [ ] Search and filtering

### System Health

- [ ] API endpoints responding
- [ ] Database connectivity stable
- [ ] Cache system working
- [ ] Error handling functional
- [ ] Logging system active

## 📚 Additional Resources

### API Documentation

- **Swagger UI**: http://localhost:3001/api
- **API Endpoint List**: Available in Swagger documentation

### Database Schema

- **Schema Definition**: `/database/init.sql`
- **Sample Data**: `/database/seed.sql`

### Configuration Files

- **Backend Config**: `backend/.env.development`
- **Frontend Config**: `frontend/.env.local`
- **Docker Services**: `docker-compose.dev.yml`

## 🤝 Contributing

When working on the development environment:

1. Always run `./scripts/test-setup.sh` before starting development
2. Use the provided sample data for testing
3. Follow the existing code patterns and conventions
4. Test all functionality across different user roles
5. Update this documentation when making changes

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the test output: `./scripts/test-setup.sh`
3. Check application logs: `docker-compose -f docker-compose.dev.yml logs -f`
4. Verify all prerequisites are installed

---

**INAMSOS Development Team**
*Indonesian National Cancer Database*