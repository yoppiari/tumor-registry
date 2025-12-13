# INAMSOS Production Deployment Guide
Indonesian Musculoskeletal Tumor Registry - Deployment & Operations Manual

**Version**: 1.0.0  
**Last Updated**: December 12, 2025  
**Target Environment**: Production

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [SSL/TLS Configuration](#ssltls-configuration)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Process](#deployment-process)
6. [Health Checks](#health-checks)
7. [Backup & Recovery](#backup--recovery)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## 1. Prerequisites

### System Requirements

**Minimum Server Specifications**:
- **CPU**: 4 cores (8+ recommended)
- **RAM**: 8GB (16GB+ recommended)
- **Storage**: 100GB SSD (500GB+ recommended)
- **OS**: Ubuntu 22.04 LTS or CentOS 8+
- **Network**: Static IP with ports 80, 443, 22 open

**Software Requirements**:
- Docker Engine 24.0+
- Docker Compose 2.20+
- Git 2.30+
- OpenSSL 1.1+
- curl, wget, jq

### Installation

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

---

## 2. Initial Setup

### Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/inamsos
sudo chown -R $USER:$USER /opt/inamsos
cd /opt/inamsos

# Clone repository
git clone https://github.com/kemenkes/inamsos.git .
git checkout main
```

### Directory Structure

```
/opt/inamsos/
├── backend/                 # Backend application
├── frontend/                # Frontend application
├── nginx/                   # Nginx configuration
├── scripts/                 # Deployment scripts
├── ssl/                     # SSL certificates (create this)
├── docker-compose.production.yml
├── .env.production          # Production environment (create this)
└── docs/                    # Documentation
```

---

## 3. SSL/TLS Configuration

### Option A: Let's Encrypt (Recommended for production)

```bash
# Run SSL setup script
./scripts/setup-ssl.sh

# Or manual setup:
sudo certbot certonly \
    --standalone \
    --agree-tos \
    --email admin@inamsos.kemenkes.go.id \
    -d inamsos.kemenkes.go.id \
    -d www.inamsos.kemenkes.go.id \
    -d api.inamsos.kemenkes.go.id
```

### Option B: Self-signed Certificates (Testing only)

```bash
# Create SSL directory
mkdir -p ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout ssl/privkey.pem \
    -out ssl/fullchain.pem \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Kemenkes/CN=inamsos.kemenkes.go.id"

# Generate DH parameters
openssl dhparam -out ssl/dhparam.pem 2048
```

---

## 4. Environment Configuration

### Create Production Environment File

```bash
# Copy template
cp .env.production.template .env.production

# Edit with your values
nano .env.production
```

### Required Variables (MUST CHANGE)

```bash
# Database
POSTGRES_PASSWORD=<STRONG_PASSWORD_32_CHARS>
DATABASE_URL=postgresql://inamsos_prod:<PASSWORD>@postgres:5432/inamsos_prod

# Redis
REDIS_PASSWORD=<STRONG_PASSWORD_32_CHARS>

# JWT Secrets (generate with: openssl rand -hex 64)
JWT_SECRET=<RANDOM_64_CHAR_HEX>
JWT_REFRESH_SECRET=<RANDOM_64_CHAR_HEX>

# MinIO
MINIO_ACCESS_KEY=<STRONG_PASSWORD_20_CHARS>
MINIO_SECRET_KEY=<STRONG_PASSWORD_40_CHARS>

# SMTP
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@inamsos.kemenkes.go.id
SMTP_PASSWORD=<SMTP_PASSWORD>
```

### Generate Secure Secrets

```bash
# JWT Secret
openssl rand -hex 64

# Database Password
openssl rand -base64 32

# Redis Password
openssl rand -base64 32
```

---

## 5. Deployment Process

### Initial Deployment

```bash
# 1. Build and start services
docker-compose -f docker-compose.production.yml up -d --build

# 2. Run database migrations
docker-compose -f docker-compose.production.yml exec backend npx prisma migrate deploy

# 3. Seed initial data (21 centers, classifications)
docker-compose -f docker-compose.production.yml exec backend npx prisma db seed

# 4. Verify deployment
./scripts/health-check.sh
```

### Automated Deployment (Using Script)

```bash
# Single command deployment
./scripts/deploy.sh
```

### Update Deployment (New Version)

```bash
# 1. Pull latest code
git pull origin main

# 2. Pull latest Docker images
docker-compose -f docker-compose.production.yml pull

# 3. Stop services
docker-compose -f docker-compose.production.yml down

# 4. Start services
docker-compose -f docker-compose.production.yml up -d

# 5. Run migrations
docker-compose -f docker-compose.production.yml exec backend npx prisma migrate deploy

# 6. Health check
./scripts/health-check.sh
```

### CI/CD Automated Deployment

The system includes GitHub Actions CI/CD pipeline that automatically:
1. Builds and tests code on push to `main`
2. Scans for security vulnerabilities
3. Builds Docker images
4. Deploys to production server
5. Runs post-deployment tests

**Required GitHub Secrets**:
- `SSH_PRIVATE_KEY` - SSH key for production server
- `SSH_USER` - SSH username
- `PRODUCTION_SERVER_IP` - Server IP address
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `NEXT_PUBLIC_API_URL` - Production API URL

---

## 6. Health Checks

### Manual Health Checks

```bash
# Run health check script
./scripts/health-check.sh

# Individual service checks
curl -f https://inamsos.kemenkes.go.id/health
curl -f https://api.inamsos.kemenkes.go.id/health

# Docker container status
docker-compose -f docker-compose.production.yml ps
```

### Service Logs

```bash
# View all logs
docker-compose -f docker-compose.production.yml logs

# View specific service logs
docker-compose -f docker-compose.production.yml logs frontend
docker-compose -f docker-compose.production.yml logs backend
docker-compose -f docker-compose.production.yml logs postgres

# Follow logs in real-time
docker-compose -f docker-compose.production.yml logs -f backend
```

### Health Check Endpoints

- **Frontend**: https://inamsos.kemenkes.go.id/health
- **Backend API**: https://api.inamsos.kemenkes.go.id/health
- **Swagger Docs**: https://api.inamsos.kemenkes.go.id/api/docs

---

## 7. Backup & Recovery

### Automated Backups

Backups run automatically every 24 hours via the backup service container.

**Backup Configuration**:
- **Location**: `/var/lib/postgresql/backups/` (inside container)
- **Retention**: 7 days (configurable via `BACKUP_RETENTION_DAYS`)
- **Format**: Compressed SQL (.sql.gz)
- **Checksum**: SHA256 verification file

### Manual Backup

```bash
# Run backup script
./scripts/backup-database.sh

# Or direct backup
docker-compose -f docker-compose.production.yml exec postgres pg_dump \
    -U inamsos_prod \
    -d inamsos_prod \
    --format=plain \
    --clean \
    > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# 1. Stop backend service
docker-compose -f docker-compose.production.yml stop backend

# 2. Restore database
gunzip -c backup_20251212.sql.gz | \
    docker-compose -f docker-compose.production.yml exec -T postgres \
    psql -U inamsos_prod -d inamsos_prod

# 3. Start backend service
docker-compose -f docker-compose.production.yml start backend

# 4. Verify restoration
./scripts/health-check.sh
```

### Backup to S3 (Optional)

```bash
# Configure AWS CLI
aws configure

# Upload backup to S3
aws s3 cp backup_$(date +%Y%m%d).sql.gz \
    s3://inamsos-backups/$(date +%Y%m%d)/
```

---

## 8. Monitoring

### Docker Stats

```bash
# Real-time container stats
docker stats

# Resource usage by service
docker-compose -f docker-compose.production.yml top
```

### Log Monitoring

```bash
# Monitor error logs
docker-compose -f docker-compose.production.yml logs -f backend | grep ERROR

# Monitor nginx access logs
docker-compose -f docker-compose.production.yml logs -f nginx
```

### Disk Space Monitoring

```bash
# Check disk usage
df -h

# Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a --volumes -f
```

### Performance Monitoring

Recommended tools:
- **Prometheus + Grafana**: Metrics collection and visualization
- **ELK Stack**: Centralized logging
- **Uptime Robot**: External uptime monitoring
- **Sentry**: Error tracking and reporting

---

## 9. Troubleshooting

### Common Issues

#### Issue 1: Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.production.yml logs <service_name>

# Restart service
docker-compose -f docker-compose.production.yml restart <service_name>

# Rebuild service
docker-compose -f docker-compose.production.yml up -d --build <service_name>
```

#### Issue 2: Database Connection Failed

```bash
# Check database status
docker-compose -f docker-compose.production.yml ps postgres

# Check database logs
docker-compose -f docker-compose.production.yml logs postgres

# Restart database
docker-compose -f docker-compose.production.yml restart postgres
```

#### Issue 3: SSL Certificate Issues

```bash
# Renew certificates
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/inamsos.kemenkes.go.id/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/inamsos.kemenkes.go.id/privkey.pem ssl/

# Restart nginx
docker-compose -f docker-compose.production.yml restart nginx
```

#### Issue 4: Out of Memory

```bash
# Check memory usage
free -h
docker stats

# Increase swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Emergency Procedures

#### Complete System Restart

```bash
# Stop all services
docker-compose -f docker-compose.production.yml down

# Wait 30 seconds
sleep 30

# Start all services
docker-compose -f docker-compose.production.yml up -d

# Monitor startup
docker-compose -f docker-compose.production.yml logs -f
```

#### Rollback to Previous Version

```bash
# Stop services
docker-compose -f docker-compose.production.yml down

# Checkout previous version
git log --oneline -5
git checkout <previous_commit>

# Rebuild and start
docker-compose -f docker-compose.production.yml up -d --build

# Restore database if needed
gunzip -c previous_backup.sql.gz | \
    docker-compose -f docker-compose.production.yml exec -T postgres \
    psql -U inamsos_prod -d inamsos_prod
```

---

## 10. Security Best Practices

### Regular Security Updates

```bash
# Update system packages monthly
sudo apt-get update && sudo apt-get upgrade -y

# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

### Secret Rotation (Every 90 days)

1. Generate new secrets
2. Update `.env.production`
3. Restart services
4. Verify all services are working

### Firewall Configuration

```bash
# Install UFW
sudo apt-get install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other incoming
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Enable firewall
sudo ufw enable
```

### File Permissions

```bash
# Set correct permissions
chmod 600 .env.production
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem
chmod +x scripts/*.sh
```

### Security Checklist

- [ ] SSL/TLS enabled with valid certificates
- [ ] Strong passwords for all services (32+ characters)
- [ ] JWT secrets rotated every 90 days
- [ ] Database backups automated and tested
- [ ] Firewall configured and enabled
- [ ] Docker security scanning enabled
- [ ] Rate limiting configured in nginx
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Regular security updates applied
- [ ] Monitoring and alerting configured
- [ ] Incident response plan documented

---

## Appendix A: Service Ports

| Service | Internal Port | External Port | Protocol |
|---------|--------------|---------------|----------|
| Frontend | 3000 | 80, 443 (via nginx) | HTTP/HTTPS |
| Backend | 3001 | 80, 443 (via nginx) | HTTP/HTTPS |
| PostgreSQL | 5432 | - (internal only) | TCP |
| Redis | 6379 | - (internal only) | TCP |
| MinIO | 9000, 9001 | - (internal only) | HTTP |
| Nginx | 80, 443 | 80, 443 | HTTP/HTTPS |

---

## Appendix B: Environment Variables Reference

See `.env.production.template` for complete list of configuration options.

---

## Support & Contact

**Technical Support**: tech-support@inamsos.kemenkes.go.id  
**Emergency Contact**: +62-XXX-XXXX-XXXX  
**Documentation**: https://docs.inamsos.kemenkes.go.id  
**Issue Tracker**: https://github.com/kemenkes/inamsos/issues

---

**Document Version**: 1.0.0  
**Last Updated**: December 12, 2025  
**Next Review**: March 12, 2026
