# INAMSOS Server Status

**Date:** 2025-11-18
**Status:** 🟢 OPERATIONAL

## Current Server Status

### ✅ **All Containers Running** (6/6)
- **Frontend (Next.js)**: ✅ Active (Port 3000)
- **Backend (NestJS)**: ✅ Active (Port 3001)
- **PostgreSQL**: ✅ Active & Healthy (Port 5433)
- **Redis**: ✅ Active & Healthy (Port 6379)
- **MinIO**: ✅ Active (Port 9000/9001)
- **Nginx**: ✅ Active (Port 80/443)

### 🌐 **Access Points**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MinIO Console**: http://localhost:9001
- **Database**: localhost:5433

### 📋 **Infrastructure Status**
- **Docker Compose**: All services operational
- **Database**: PostgreSQL 15 with health checks passing
- **Cache**: Redis 7 with persistence enabled
- **File Storage**: MinIO S3-compatible storage ready
- **Reverse Proxy**: Nginx configured and routing properly

### 🔧 **Development Environment**
- **Node.js**: 18-alpine (Frontend & Backend)
- **TypeScript**: Enabled for both frontend and backend
- **Hot Reload**: Configured with volume mounts
- **Environment**: Development mode with debug logging

### 📝 **Notes**
- Frontend has missing dependency: `@tanstack/react-query-devtools`
- Backend health endpoint available after startup sequence
- All containers configured with automatic restart policies
- Project is ready for continued development

---
**Repository**: https://github.com/yoppiari/tumor-registry
**Branch**: main
**Last Updated**: 2025-11-18 16:53 WIB