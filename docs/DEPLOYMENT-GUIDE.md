# INAMSOS Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Indonesia National Cancer Database System (INAMSOS) to production environment with enterprise-grade reliability, security, and performance.

## Prerequisites

### System Requirements

**Hardware Requirements**:
- **CPU**: Minimum 8 cores, recommended 16 cores
- **Memory**: Minimum 32GB RAM, recommended 64GB RAM
- **Storage**: Minimum 500GB SSD, recommended 1TB NVMe SSD
- **Network**: 1Gbps network connection

**Software Requirements**:
- **Operating System**: Ubuntu 20.04 LTS or later / CentOS 8 or later
- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Git**: Version 2.25 or later

**Network Requirements**:
- **Public IP**: Static public IP address
- **Domain Names**:
  - `inamsos.kemenkes.go.id` (main application)
  - `admin.inamsos.kemenkes.go.id` (admin panel)
  - `monitoring.inamsos.kemenkes.go.id` (monitoring dashboards)
- **DNS**: Proper DNS records pointing to server
- **SSL**: SSL certificates (automated via Let's Encrypt)

### Access Requirements

**Required Access**:
- Root or sudo access to server
- SSH key-based authentication
- Firewall configuration access
- Domain management access

## Pre-Deployment Preparation

### 1. Server Setup

**Update System**:
```bash
# For Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# For CentOS/RHEL
sudo yum update -y
```

**Install Docker**:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Install Additional Tools**:
```bash
# For Ubuntu/Debian
sudo apt install -y git curl wget unzip htop iotop

# For CentOS/RHEL
sudo yum install -y git curl wget unzip htop iotop
```

### 2. Security Configuration

**Configure Firewall**:
```bash
# For Ubuntu (UFW)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# For CentOS/RHEL (firewalld)
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**Configure SSH Security**:
```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# Port 22
# Protocol 2
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# MaxAuthTries 3
# ClientAliveInterval 300

sudo systemctl restart sshd
```

**Install Security Tools**:
```bash
# Install security scanning tools
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Install code analysis tools
npm install -g semgrep

# Install network tools
sudo apt install -y nmap openssl testssl.sh  # Ubuntu/Debian
# sudo yum install -y nmap openssl testssl.sh  # CentOS/RHEL
```

### 3. Directory Structure

**Create Directories**:
```bash
# Create application directory
sudo mkdir -p /opt/inamsos
sudo chown $USER:$USER /opt/inamsos
cd /opt/inamsos

# Create data directories
sudo mkdir -p /data/inamsos/{postgres,redis,minio,prometheus,grafana,alertmanager,nginx_logs}
sudo mkdir -p /backup/{database,deployments,ssl}
sudo mkdir -p /var/log/inamosos
sudo mkdir -p /security/{monitoring,blacklist,whitelist}
sudo mkdir -p /reports/security

# Set permissions
sudo chown -R $USER:$USER /opt/inamsos
sudo chown -R $USER:$USER /data/inamosos
sudo chown -R $USER:$USER /backup
sudo chown -R $USER:$USER /var/log/inamosos
sudo chown -R $USER:$USER /security
sudo chown -R $USER:$USER /reports
```

## Deployment Process

### 1. Source Code Setup

**Clone Repository**:
```bash
cd /opt/inamsos
git clone https://github.com/kemenkes/inamsos.git .
```

**Create Environment Files**:
```bash
# Create production environment file
cat > .env.production << 'EOF'
# Database Configuration
DB_PASSWORD=your_secure_database_password
POSTGRES_DB=inamsos_prod
POSTGRES_USER=inamsos_user

# Redis Configuration
REDIS_PASSWORD=your_secure_redis_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_characters

# MinIO Configuration
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key

# Email Configuration
SMTP_HOST=smtp.kemenkes.go.id
SMTP_PORT=587
SMTP_USER=noreply@inamsos.kemenkes.go.id
SMTP_PASS=your_smtp_password

# Grafana Configuration
GRAFANA_PASSWORD=your_grafana_admin_password

# Monitoring Configuration
SLACK_WEBHOOK_URL=your_slack_webhook_url
DEPLOYMENT_EMAIL=admin@inamsos.kemenkes.go.id

# Application Configuration
VERSION=1.0.0
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VCS_REF=$(git rev-parse --short HEAD)
EOF

# Secure the environment file
chmod 600 .env.production
```

### 2. SSL Certificate Setup

**Initial SSL Setup**:
```bash
# Make SSL setup script executable
chmod +x ssl/setup-ssl.sh

# Run SSL setup
sudo ./ssl/setup-ssl.sh
```

**Deploy with Self-Signed Certificates**:
```bash
# Initial deployment with self-signed certificates
docker-compose -f docker-compose.production.yml up -d nginx
```

**Setup Let's Encrypt Certificates**:
```bash
# Make script executable and run
chmod +x scripts/setup-letsencrypt.sh
sudo ./scripts/setup-letsencrypt.sh
```

### 3. Database Setup

**Initialize PostgreSQL**:
```bash
# Create database configuration directory
mkdir -p database/config

# Create PostgreSQL configuration
cat > database/config/postgresql.conf << 'EOF'
# PostgreSQL Configuration for Production
listen_addresses = '*'
port = 5432
max_connections = 200

# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# WAL Settings
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB
checkpoint_completion_target = 0.9

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_min_duration_statement = 1000
EOF

# Create pg_hba.conf
cat > database/config/pg_hba.conf << 'EOF'
# PostgreSQL Client Authentication Configuration

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             all                                     trust

# Docker network connections
host    all             all             172.23.0.0/24           md5
host    all             all             172.22.0.0/24           md5

# IPv4 local connections:
host    all             all             127.0.0.1/32            md5

# IPv6 local connections:
host    all             all             ::1/128                 md5
EOF
```

### 4. Application Deployment

**Build Docker Images**:
```bash
# Set version
export VERSION=1.0.0

# Build production images
docker-compose -f docker-compose.production.yml build
```

**Deploy Services**:
```bash
# Deploy database and cache first
docker-compose -f docker-compose.production.yml up -d postgres redis

# Wait for database to be ready
sleep 30

# Deploy application services
docker-compose -f docker-compose.production.yml up -d backend frontend

# Wait for applications to be ready
sleep 60

# Deploy supporting services
docker-compose -f docker-compose.production.yml up -d nginx minio

# Deploy monitoring stack
docker-compose -f docker-compose.production.yml up -d prometheus grafana alertmanager

# Deploy monitoring exporters
docker-compose -f docker-compose.production.yml up -d node-exporter postgres-exporter redis-exporter nginx-exporter cadvisor blackbox-exporter
```

### 5. Health Checks and Verification

**Check Service Status**:
```bash
# Check all services
docker-compose -f docker-compose.production.yml ps

# Check individual service logs
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
docker-compose -f docker-compose.production.yml logs -f postgres
```

**Run Health Checks**:
```bash
# Check main application
curl -f https://inamsos.kemenkes.go.id/health

# Check API
curl -f https://api.inamsos.kemenkes.go.id/health

# Check database
docker-compose -f docker-compose.production.yml exec postgres pg_isready -U inamsos_user -d inamsos_prod

# Check monitoring
curl -f http://localhost:9090/-/healthy
curl -f http://localhost:3000/api/health
```

### 6. Automated Deployment Script

**Use Deployment Script**:
```bash
# Make deployment script executable
chmod +x scripts/deploy-production.sh

# Run deployment
sudo ./scripts/deploy-production.sh
```

**With Custom Version**:
```bash
VERSION=1.0.1 sudo ./scripts/deploy-production.sh
```

## Post-Deployment Configuration

### 1. Monitoring Setup

**Access Grafana**:
1. Open `https://admin.inamsos.kemenkes.go.id`
2. Login with: admin / your_grafana_password
3. Configure data sources and dashboards

**Access Prometheus**:
1. Open `https://monitoring.inamsos.kemenkes.go.id/prometheus`
2. Verify targets are up
3. Check alert rules

### 2. Backup Configuration

**Setup Automated Backups**:
```bash
# Create backup configuration
sudo mkdir -p /etc/inamos
cat > /etc/inamos/backup.env << 'EOF'
DB_PASSWORD=your_secure_database_password
SLACK_WEBHOOK_URL=your_slack_webhook_url
EOF

# Create backup cron job
sudo crontab -e

# Add these lines to crontab:
# Daily backup at 2:00 AM
0 2 * * * /opt/inamsos/scripts/backup-database.sh

# Weekly backup verification on Sundays at 3:00 AM
0 3 * * 0 /opt/inamosos/scripts/backup-verification.sh

# Monthly security scan on 1st at 4:00 AM
0 4 1 * * /opt/inamsos/scripts/security-scanner.sh
```

### 3. Security Monitoring

**Setup Security Monitoring**:
```bash
# Create security monitoring service
sudo tee /etc/systemd/system/inamos-security-monitor.service > /dev/null << 'EOF'
[Unit]
Description=INAMOS Security Monitoring
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/inamsos
ExecStart=/opt/inamosos/scripts/security-monitoring.sh --continuous
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable inamos-security-monitor
sudo systemctl start inamos-security-monitor
```

### 4. SSL Certificate Auto-Renewal

**Setup SSL Renewal**:
```bash
# SSL renewal should already be configured by setup script
# Verify renewal timer is active
sudo systemctl status ssl-renewal.timer

# Test renewal process
sudo ./scripts/renew-ssl.sh
```

## Maintenance Procedures

### 1. Regular Updates

**Application Updates**:
```bash
# Pull latest code
git pull origin main

# Deploy new version
VERSION=1.0.2 sudo ./scripts/deploy-production.sh
```

**Security Updates**:
```bash
# Run security scan
sudo ./scripts/security-scanner.sh

# Update system packages
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
# sudo yum update -y  # CentOS/RHEL

# Restart services if needed
docker-compose -f docker-compose.production.yml restart
```

### 2. Backup Verification

**Test Backup Integrity**:
```bash
# Run backup verification
./scripts/backup-verification.sh

# Test restore process
./scripts/restore-database.sh --list
```

### 3. Performance Monitoring

**Check System Performance**:
```bash
# Check resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connections
netstat -tuln
```

## Troubleshooting

### Common Issues

**Service Won't Start**:
```bash
# Check service logs
docker-compose -f docker-compose.production.yml logs [service_name]

# Check resource usage
docker stats

# Restart service
docker-compose -f docker-compose.production.yml restart [service_name]
```

**Database Connection Issues**:
```bash
# Check database status
docker-compose -f docker-compose.production.yml exec postgres pg_isready -U inamsos_user -d inamsos_prod

# Check database logs
docker-compose -f docker-compose.production.yml logs postgres

# Test connection from backend
docker-compose -f docker-compose.production.yml exec backend npm run db:test
```

**SSL Certificate Issues**:
```bash
# Check certificate expiry
./ssl/scripts/validate-ssl.sh

# Renew certificates manually
sudo ./scripts/renew-ssl.sh

# Restart nginx
docker-compose -f docker-compose.production.yml restart nginx
```

**Performance Issues**:
```bash
# Check resource usage
docker stats

# Check slow queries
docker-compose -f docker-compose.production.yml exec postgres psql -U inamsos_user -d inamsos_prod -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Check system metrics
curl http://localhost:9100/metrics
```

## Emergency Procedures

### Service Recovery

**Full System Restart**:
```bash
# Stop all services
docker-compose -f docker-compose.production.yml down

# Start database first
docker-compose -f docker-compose.production.yml up -d postgres redis

# Wait for database
sleep 30

# Start applications
docker-compose -f docker-compose.production.yml up -d backend frontend

# Start supporting services
docker-compose -f docker-compose.production.yml up -d nginx minio

# Start monitoring
docker-compose -f docker-compose.production.yml up -d prometheus grafana alertmanager
```

**Database Recovery**:
```bash
# List available backups
./scripts/restore-database.sh --list

# Restore from backup
./scripts/restore-database.sh --backup-file /backup/database/daily/inamos_backup_20241119_120000.tar.gz
```

### Rollback Procedures

**Automatic Rollback**:
```bash
# Deployment script includes automatic rollback on failure
# If manual rollback needed:
./scripts/deploy-production.sh --rollback
```

**Manual Rollback**:
```bash
# Identify last successful deployment
ls -la /backup/deployments/

# Rollback to specific backup
./scripts/deploy-production.sh --rollback /backup/deployments/deployment_backup_20241119_120000
```

## Support and Contact

### Emergency Contacts

- **Technical Support**: +62-21-XXXX-XXXX
- **Security Team**: security@inamsos.kemenkes.go.id
- **System Administrator**: admin@inamsos.kemenkes.go.id

### Documentation

- **System Architecture**: `/docs/PRODUCTION-INFRASTRUCTURE.md`
- **Security Guide**: `/docs/SECURITY-GUIDE.md`
- **Backup Procedures**: `/docs/BACKUP-GUIDE.md`
- **Monitoring Guide**: `/docs/MONITORING-GUIDE.md`

### Monitoring Dashboards

- **System Health**: https://monitoring.inamsos.kemenkes.go.id
- **Application Metrics**: https://monitoring.inamsos.kemenkes.go.id/d/applications
- **Infrastructure Metrics**: https://monitoring.inamsos.kemenkes.go.id/d/infrastructure

---

**Document Version**: 1.0
**Last Updated**: $(date +%Y-%m-%d)
**Next Review**: $(date -d "+3 months" +%Y-%m-%d)

This deployment guide should be followed carefully and updated regularly to reflect changes in deployment procedures, security requirements, and system architecture.