# INAMOS Tumor Registry - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the INAMOS (Indonesia National Cancer Monitoring System) tumor registry application to production environments.

## Sprint 5 Implementation Summary

Sprint 5 completes the INAMOS tumor registry with comprehensive system administration and reporting capabilities:

### Key Features Implemented

#### 1. System Administration Module
- **Dashboard**: Real-time system monitoring and overview
- **Configuration Management**: Centralized configuration with encryption support
- **User Activity Monitoring**: Comprehensive audit trails and activity logging
- **System Health Monitoring**: Health checks for all system components
- **Maintenance Operations**: System maintenance and cleanup utilities

#### 2. Report Generation Engine
- **Multi-format Support**: PDF, Excel, CSV, JSON, HTML report generation
- **Drag-and-Drop Builder**: Visual report template creation
- **Scheduled Reports**: Automated report generation and delivery
- **Template Management**: Reusable report templates with access controls
- **Data Export**: Bulk data export with validation

#### 3. Backup & Recovery System
- **Automated Backups**: Scheduled database and file backups
- **Multiple Backup Types**: Full, incremental, differential, and continuous
- **Storage Options**: Local, cloud (S3, Azure, GCP), and network storage
- **Recovery Tools**: Point-in-time recovery and restore verification
- **Retention Policies**: Automated cleanup based on configurable retention rules

#### 4. Production Infrastructure
- **Docker Containerization**: Multi-stage Docker builds for production
- **Load Balancing**: Nginx reverse proxy with SSL termination
- **Monitoring Stack**: Prometheus + Grafana for metrics and visualization
- **Health Checks**: Comprehensive health monitoring and alerting
- **Security Hardening**: SSL/TLS, security headers, rate limiting

## Architecture

### Production Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │            Nginx (SSL)               │
                    │    Load Balancer + Reverse Proxy    │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────┴───────────────────┐
                    │           Application               │
                    │         (NestJS + Node.js)          │
                    └─────────────────┬───────────────────┘
                                      │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
┌─────────▼─────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
│   PostgreSQL      │    │      Redis        │    │   File Storage    │
│   (Database)       │    │     (Cache)        │    │   (Backups,      │
│                   │    │                   │    │    Reports,       │
│                   │    │                   │    │    Uploads)        │
└───────────────────┘    └───────────────────┘    └───────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    │
                    ┌─────────────────▼───────────────────┐
                    │          Monitoring Stack             │
                    │    Prometheus + Grafana + Node      │
                    │         Exporter (Metrics)           │
                    └─────────────────────────────────────┘
```

## Prerequisites

### System Requirements

- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **CPU**: Minimum 4 cores, Recommended 8+ cores
- **Memory**: Minimum 8GB RAM, Recommended 16GB+ RAM
- **Storage**: Minimum 100GB SSD, Recommended 500GB+ SSD
- **Network**: 1Gbps network connection
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Software Dependencies

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
sudo apt-get update
sudo apt-get install -y curl wget git htop
```

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd tumor-registry/backend
```

### 2. Configure Environment

```bash
# Copy production environment template
cp .env.production .env.local

# Edit configuration file
nano .env.local
```

### 3. Generate Prisma Client

```bash
# Install dependencies
npm install

# Generate database client
npx prisma generate

# Run database migrations (if database exists)
npx prisma db push
```

### 4. Deploy Application

```bash
# Run the deployment script
./scripts/deploy.sh
```

### 5. Verify Deployment

```bash
# Check application health
curl https://api.inamsos.go.id/health

# Check services status
docker-compose -f docker-compose.prod.yml ps
```

## Configuration

### Environment Variables

Key production environment variables:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_SSL=true

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# External Services
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
TWILIO_ACCOUNT_SID=your-twilio-sid

# File Storage
STORAGE_PATH=/var/lib/inamsos/uploads
BACKUP_STORAGE_PATH=/var/lib/inamsos/backups

# Monitoring
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=30000
```

### Database Configuration

1. **PostgreSQL Setup**:
```sql
-- Create database
CREATE DATABASE inamsos_prod;

-- Create user
CREATE USER inamsos_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE inamsos_prod TO inamsos_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

2. **Redis Configuration**:
```bash
# Edit redis configuration
sudo nano /etc/redis/redis.conf

# Set password
requirepass your_redis_password

# Enable persistence
save 900 1
save 300 10
save 60 10000
```

### SSL/TLS Configuration

1. **Obtain SSL Certificate**:
```bash
# Using Let's Encrypt
sudo apt-get install certbot
sudo certbot certonly --standalone -d api.inamsos.go.id -d admin.inamsos.go.id
```

2. **Configure Nginx SSL**:
```bash
# Copy certificates
sudo cp /etc/letsencrypt/live/api.inamsos.go.id/fullchain.pem ./ssl/api.inamsos.go.id.crt
sudo cp /etc/letsencrypt/live/api.inamsos.go.id/privkey.pem ./ssl/api.inamsos.go.id.key
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Deploy all services
docker-compose -f docker-compose.prod.yml up -d

# Scale application if needed
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Option 2: Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n inamsos

# Get service URLs
kubectl get ingress -n inamosos
```

### Option 3: Manual Deployment

```bash
# Build application
npm run build

# Start application
npm run start:prod

# Configure reverse proxy (Nginx/Apache)
# Set up SSL certificates
# Configure monitoring
```

## Monitoring and Alerting

### Prometheus Metrics

The application exposes metrics at `/metrics` endpoint:

- **Application Metrics**: Request count, response time, error rate
- **Database Metrics**: Connection pool, query performance
- **Business Metrics**: Active users, patient registrations, report generation
- **System Metrics**: CPU, memory, disk usage via node-exporter

### Grafana Dashboards

Pre-configured dashboards:

1. **Application Overview**: HTTP requests, response times, error rates
2. **Database Performance**: Connection pool, query performance, deadlocks
3. **System Resources**: CPU, memory, disk, network usage
4. **Business Metrics**: User activity, data volume, report generation

### Alerting Rules

Key alerts configured:

- **Application Down**: Service unavailable > 5 minutes
- **High Error Rate**: Error rate > 5% for 5 minutes
- **Database Issues**: Connection failures, high query time
- **Resource Usage**: CPU > 80%, Memory > 90%, Disk > 85%
- **Backup Failures**: Backup jobs not completing successfully

## Backup and Recovery

### Automated Backups

```bash
# Configure backup schedules via API
curl -X POST https://admin.inamsos.go.id/backup/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Full Backup",
    "backupType": "FULL",
    "dataSource": "database:inamsos_prod",
    "schedule": "0 2 * * *",
    "retentionDays": 30,
    "compression": true,
    "encryption": true,
    "storageLocation": "s3://inamsos-backups"
  }'
```

### Manual Backup

```bash
# Create backup via API
curl -X POST https://admin.inamsos.go.id/backup/jobs/{jobId}/execute \
  -H "Authorization: Bearer <token>"

# Or via command line
docker exec -it inamosos-postgres pg_dump -U inamsos_user inamsos_prod > backup.sql
```

### Recovery Procedures

1. **Database Recovery**:
```bash
# Stop application
docker-compose -f docker-compose.prod.yml stop app

# Restore database
docker exec -i inamosos-postgres psql -U inamsos_user -d inamsos_prod < backup.sql

# Restart application
docker-compose -f docker-compose.prod.yml start app
```

2. **Application Recovery**:
```bash
# Restore from backup via API
curl -X POST https://admin.inamosos.go.id/backup/executions/{executionId}/restore \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "targetDatabase": "inamsos_prod",
    "overwriteExisting": true,
    "verifyIntegrity": true
  }'
```

## Security Hardening

### Network Security

1. **Firewall Configuration**:
```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3000/tcp  # Direct app access
```

2. **SSL/TLS**:
- Force HTTPS redirection
- Use strong cipher suites
- Enable HSTS headers
- Regular certificate renewal

### Application Security

1. **Authentication**:
- Multi-factor authentication (MFA)
- Session management
- Password complexity requirements
- Account lockout policies

2. **Authorization**:
- Role-based access control (RBAC)
- Center-based data isolation
- API rate limiting
- Request validation

3. **Data Protection**:
- Encryption at rest (database, files)
- Encryption in transit (HTTPS)
- Sensitive data masking
- Audit logging

## Performance Optimization

### Database Optimization

1. **Indexing Strategy**:
```sql
-- Patient table indexes
CREATE INDEX CONCURRENTLY idx_patients_center_id ON patients(center_id);
CREATE INDEX CONCURRENTLY idx_patients_created_at ON patients(created_at);
CREATE INDEX CONCURRENTLY idx_patients_is_active ON patients(is_active);

-- Audit log indexes
CREATE INDEX CONCURRENTLY idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON audit_logs(user_id);
```

2. **Connection Pooling**:
```javascript
// Prisma connection pool configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 20
  pool_timeout = 30
  connect_timeout = 60
}
```

### Application Caching

1. **Redis Caching**:
```javascript
// Cache frequent queries
const cacheKey = `patients:center:${centerId}:page:${page}`;
const cachedResult = await redis.get(cacheKey);

if (!cachedResult) {
  const result = await this.prisma.patient.findMany({...});
  await redis.setex(cacheKey, 300, JSON.stringify(result)); // 5 minutes
}
```

2. **CDN for Static Files**:
```nginx
# Nginx static file serving
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-CDN-Cache "HIT";
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
```bash
# Check database connectivity
docker exec -it inamosos-postgres pg_isready -U inamsos_user

# Check connection pool status
docker logs inamosos-backend | grep "database"
```

2. **High Memory Usage**:
```bash
# Check memory usage by service
docker stats

# Monitor application memory
docker exec -it inamosos-backend npm run health:memory
```

3. **Backup Failures**:
```bash
# Check backup logs
docker logs inamosos-backend | grep "backup"

# Verify storage connectivity
curl -I https://s3.amazonaws.com/inamsos-backups
```

### Health Checks

```bash
# Application health
curl https://api.inamsos.go.id/health

# Database health
curl https://api.inamsos.go.id/health/database

# System health
curl https://api.inamsos.go.id/health/system
```

## Maintenance

### Regular Maintenance Tasks

1. **Daily**:
- Monitor system performance
- Check backup status
- Review security logs
- Update security patches

2. **Weekly**:
- Database maintenance (VACUUM, ANALYZE)
- Log rotation
- Performance tuning
- Capacity planning

3. **Monthly**:
- Security audit
- Backup testing
- SSL certificate renewal
- Performance benchmarking

### Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/inamsos

# Log rotation configuration
/var/log/inamosos/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /path/to/docker-compose.prod.yml restart app
    endscript
}
```

## Support and Documentation

### Contact Information

- **Technical Support**: support@inamsos.go.id
- **Security Issues**: security@inamsos.go.id
- **Documentation**: https://docs.inamsos.go.id

### Additional Resources

- [API Documentation](https://api.inamsos.go.id/docs)
- [Admin Guide](./ADMIN_GUIDE.md)
- [User Manual](./USER_MANUAL.md)
- [Development Guide](./DEVELOPMENT.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Deployment Status**: Production Ready