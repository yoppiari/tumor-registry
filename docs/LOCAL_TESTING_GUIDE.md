# INAMSOS Local Testing Guide
Indonesian Musculoskeletal Tumor Registry - Local Development & Testing

**Version**: 1.0.0
**Last Updated**: December 12, 2025

---

## 🚀 Quick Start

### Step 1: Start Development Environment

```bash
# From project root directory
cd /home/yopi/Projects/tumor-registry

# Start all services with Docker Compose
docker compose up -d

# Wait for services to be ready (30-60 seconds)
docker compose logs -f

# Press Ctrl+C to stop following logs
```

### Step 2: Run Database Migrations & Seed Data

```bash
# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed database with demo data
docker compose exec backend npx prisma db seed
```

### Step 3: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api/docs

---

## 🔑 Login Credentials

The system includes 6 demo users with different role levels for comprehensive testing:

### 1. System Administrator (Full Access)
- **Email**: `admin@inamsos.go.id`
- **Password**: `admin123`
- **Role**: System Administrator
- **Permissions**: All system permissions
- **Use For**: System configuration, user management, full oversight

### 2. National Administrator
- **Email**: `national.admin@inamsos.go.id`
- **Password**: `national123`
- **Role**: National Administrator
- **Permissions**: Cross-center access, analytics, monitoring
- **Use For**: National-level oversight, cross-center reports

### 3. Center Administrator
- **Email**: `center.admin@inamsos.go.id`
- **Password**: `center123`
- **Role**: Center Administrator
- **Permissions**: Center-level management, local user management
- **Use For**: Center operations, local analytics

### 4. Researcher
- **Email**: `researcher@inamsos.go.id`
- **Password**: `research123`
- **Role**: Researcher
- **Permissions**: Research protocols, analytics, data export
- **Use For**: Research data access, analytics dashboards

### 5. Medical Officer
- **Email**: `medical.officer@inamsos.go.id`
- **Password**: `medical123`
- **Role**: Medical Officer
- **Permissions**: Clinical data, patient records, medical validation
- **Use For**: Patient data entry, clinical workflows, MSTS calculator

### 6. Data Entry Staff
- **Email**: `staff@inamsos.go.id`
- **Password**: `staff123`
- **Role**: Data Entry Staff
- **Permissions**: Patient data entry (create, read, update)
- **Use For**: Basic patient registration and data entry

---

## 🌐 Access URLs

### Frontend Application
- **URL**: http://localhost:3000
- **Description**: Next.js 14 application with App Router
- **Features**: Patient management, analytics, MSTS calculator, follow-up tracker

### Backend API
- **Base URL**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/api/v1/health
- **Description**: NestJS REST API with `/api/v1` prefix

### API Documentation (Swagger)
- **URL**: http://localhost:3001/api/docs
- **Description**: Interactive API documentation
- **Features**: Test all API endpoints, view request/response schemas

### MinIO Object Storage Console
- **URL**: http://localhost:9001
- **Username**: `minioadmin`
- **Password**: `minioadmin2025`
- **Description**: S3-compatible file storage for patient documents and images

### PostgreSQL Database (Direct Access)
- **Host**: `localhost`
- **Port**: `5433` (mapped from container port 5432)
- **Database**: `inamsos`
- **Username**: `inamsos`
- **Password**: `inamsos_dev_2025`
- **Connection String**: `postgresql://inamsos:inamsos_dev_2025@localhost:5433/inamsos`

### Redis Cache (Direct Access)
- **Host**: `localhost`
- **Port**: `6379`
- **Password**: `redis_dev_2025`
- **Description**: In-memory cache for sessions and performance

---

## 📋 Testing Workflows

### 1. Authentication & Authorization Testing

```bash
# Test login via API
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inamsos.go.id",
    "password": "admin123"
  }'

# Expected response: accessToken, refreshToken, and user info
```

**UI Testing**:
1. Go to http://localhost:3000
2. Click "Login"
3. Enter credentials from section above
4. Verify dashboard access based on role

### 2. Patient Registration Testing

**Login as**: Medical Officer or Data Entry Staff

**Steps**:
1. Navigate to "Patients" → "Register New Patient"
2. Fill out multi-step form:
   - **Step 1**: Personal Information (NIK, name, DOB, gender)
   - **Step 2**: Contact Information (address, phone, emergency contact)
   - **Step 3**: Clinical Information (pathology type, diagnosis)
3. Submit and verify patient creation
4. Check patient appears in patient list

### 3. MSTS Score Calculator Testing

**Login as**: Medical Officer or Center Administrator

**Steps**:
1. Navigate to registered patient
2. Go to "MSTS Score" tab
3. Fill out 6 domains (each 0-5 points):
   - Pain
   - Function
   - Emotional Acceptance
   - Hand Positioning
   - Manual Dexterity
   - Lifting Ability
4. Verify automatic calculation (total out of 30)
5. Save assessment

### 4. Follow-up Tracker Testing

**Login as**: Medical Officer or Center Administrator

**Steps**:
1. Navigate to registered patient
2. Go to "Follow-up" tab
3. View 14-visit schedule (6 weeks to 10 years)
4. Record visit:
   - Select visit number
   - Enter vital signs, lab results
   - Add clinical notes
   - Upload documents (if applicable)
5. Mark visit as completed
6. Verify visit appears in timeline

### 5. Analytics Dashboard Testing

**Login as**: Researcher, National Admin, or Center Admin

**Steps**:
1. Navigate to "Analytics" menu
2. Test each dashboard tab:
   - **Overview**: Key metrics and trends
   - **Cancer Registry**: Tumor distribution charts
   - **Treatment Outcomes**: Success rates
   - **Population Health**: Demographics
   - **Survival Analysis**: Kaplan-Meier curves
   - **Center Performance**: Benchmarking
   - **Research**: Study data
3. Use date range filters
4. Export data (CSV/Excel)

### 6. File Upload Testing

**Login as**: Medical Officer

**Steps**:
1. Navigate to patient record
2. Go to "Documents" tab
3. Upload test files:
   - Medical images (JPEG, PNG)
   - Lab reports (PDF)
   - Radiology reports (PDF)
4. Verify files appear in MinIO console (http://localhost:9001)
5. Download and verify file integrity

### 7. Role-Based Access Control (RBAC) Testing

**Test Permission Isolation**:
1. Login as Data Entry Staff
2. Verify CANNOT access:
   - User management
   - System settings
   - Analytics dashboards
   - Patient deletion
3. Login as Researcher
4. Verify CAN access:
   - Analytics dashboards
   - Research protocols
   - Data export
5. Verify CANNOT access:
   - Patient data entry
   - User management

---

## 🔧 Service Management

### View Service Status
```bash
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Stop Services
```bash
docker compose down
```

### Complete Rebuild
```bash
# Stop and remove all containers
docker compose down

# Rebuild and start
docker compose up -d --build
```

---

## 🗄️ Database Management

### Access PostgreSQL CLI
```bash
docker compose exec postgres psql -U inamsos -d inamsos
```

### View Tables
```sql
\dt

-- View specific table data
SELECT * FROM "User" LIMIT 5;
SELECT * FROM "Center" LIMIT 5;
SELECT * FROM "Patient" LIMIT 5;
```

### Reset Database (Fresh Start)
```bash
# Stop backend
docker compose stop backend

# Drop and recreate database
docker compose exec postgres psql -U inamsos -d postgres -c "DROP DATABASE IF EXISTS inamsos;"
docker compose exec postgres psql -U inamsos -d postgres -c "CREATE DATABASE inamsos;"

# Run migrations
docker compose exec backend npx prisma migrate deploy

# Seed data
docker compose exec backend npx prisma db seed

# Restart backend
docker compose start backend
```

### Generate Prisma Client
```bash
docker compose exec backend npx prisma generate
```

### View Database Schema
```bash
docker compose exec backend npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 📊 Seeded Data Summary

When you run `npx prisma db seed`, the following data is created:

- ✅ **21 Musculoskeletal Tumor Centers** (across Indonesia)
- ✅ **3 Pathology Types** (Bone, Soft Tissue, Metastatic)
- ✅ **57 WHO Bone Tumor Classifications**
- ✅ **68 WHO Soft Tissue Tumor Classifications**
- ✅ **95 Bone Locations** (3-level anatomical hierarchy)
- ✅ **36 Soft Tissue Locations**
- ✅ **15 Tumor Syndromes**
- ✅ **6 User Roles** with granular permissions
- ✅ **6 Demo Users** (credentials listed above)

**Default Center for Demo Users**:
- **Name**: RSUPN Dr. Cipto Mangunkusumo
- **Code**: DKI001
- **Location**: Jakarta
- **Type**: National Referral Center

---

## 🧪 API Testing with cURL

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inamsos.go.id",
    "password": "admin123"
  }' | jq
```

### 2. Get User Profile
```bash
# Replace YOUR_TOKEN with accessToken from login response
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

### 3. List Centers
```bash
curl -X GET http://localhost:3001/api/v1/centers \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

### 4. Get Analytics Overview
```bash
curl -X GET http://localhost:3001/api/v1/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

---

## 🐛 Troubleshooting

### Issue: "Connection Refused" Errors

**Solution**:
```bash
# Check if all services are running
docker compose ps

# Restart services
docker compose restart

# Check backend logs for errors
docker compose logs backend
```

### Issue: "Database Connection Failed"

**Solution**:
```bash
# Check PostgreSQL is healthy
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Verify connection string in .env matches docker-compose.yml
```

### Issue: "Migration Failed"

**Solution**:
```bash
# Reset Prisma migrations
docker compose exec backend npx prisma migrate reset --force

# Re-run migrations
docker compose exec backend npx prisma migrate deploy
```

### Issue: "Port Already in Use"

**Solution**:
```bash
# Check what's using the port (e.g., 3000)
sudo lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Issue: Frontend Shows "API Connection Error"

**Solution**:
1. Verify backend is running: http://localhost:3001/health
2. Check NEXT_PUBLIC_API_URL in frontend/.env.local
3. Check CORS settings in backend

---

## 📈 Performance Monitoring

### View Container Resource Usage
```bash
docker stats
```

### Check Database Performance
```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U inamsos -d inamsos

# Run performance queries
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

### Monitor Redis
```bash
# Connect to Redis CLI
docker compose exec redis redis-cli -a redis_dev_2025

# View stats
INFO stats

# View memory usage
INFO memory
```

---

## 🔐 Security Notes

⚠️ **IMPORTANT**: These credentials are for **LOCAL DEVELOPMENT ONLY**

- **NEVER** use these credentials in production
- **NEVER** commit `.env` files with real credentials to version control
- **ALWAYS** use strong, unique passwords for production
- **ALWAYS** enable SSL/TLS for production deployments

---

## 📞 Need Help?

### Common Resources
- **Project Documentation**: `/docs` folder
- **Deployment Guide**: `/docs/deployment-guide.md`
- **API Documentation**: http://localhost:3001/api/docs (when running)
- **Prisma Schema**: `/backend/prisma/schema.prisma`

### Logs Location
- **Backend Logs**: `docker compose logs backend`
- **Frontend Logs**: `docker compose logs frontend`
- **Database Logs**: `docker compose logs postgres`
- **All Logs**: `docker compose logs`

---

## ✅ Test Checklist

Use this checklist to ensure comprehensive end-to-end testing:

- [ ] All services start successfully (`docker compose up -d`)
- [ ] Database migrations complete (`npx prisma migrate deploy`)
- [ ] Seed data loads successfully (`npx prisma db seed`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:3001
- [ ] Swagger docs accessible at http://localhost:3001/api/docs
- [ ] Login works with all 6 demo users
- [ ] Patient registration workflow completes
- [ ] MSTS calculator computes scores correctly
- [ ] Follow-up tracker displays 14-visit schedule
- [ ] File upload/download works
- [ ] Analytics dashboards load with charts
- [ ] Role-based access control enforced
- [ ] MinIO console accessible at http://localhost:9001
- [ ] No console errors in browser developer tools
- [ ] API responses are properly formatted

---

**Happy Testing! 🎉**

For production deployment, refer to `/docs/deployment-guide.md`.
