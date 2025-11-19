# 🚀 PRODUCTION DEPLOYMENT GUIDE - INAMSOS Tumor Registry
## Indonesian National Cancer Database System - Production Ready Deployment

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Infrastructure Requirements](#infrastructure-requirements)
3. [Phase 1: Environment Setup](#phase-1-environment-setup)
4. [Phase 2: Database Setup](#phase-2-database-setup)
5. [Phase 3: Backend Deployment](#phase-3-backend-deployment)
6. [Phase 4: Frontend Deployment](#phase-4-frontend-deployment)
7. [Phase 5: Security Configuration](#phase-5-security-configuration)
8. [Phase 6: Monitoring Setup](#phase-6-monitoring-setup)
9. [Phase 7: Go-Live Checklist](#phase-7-go-live-checklist)
10. [Phase 8: Post-Deployment](#phase-8-post-deployment)

---

## 🔑 PREREQUISITES

### **Required Permissions:**
- ✅ Server admin access (root/sudo)
- ✅ Domain management access
- ✅ SSL certificate management
- ✅ Firewall configuration access
- ✅ Database administration access

### **Required Skills:**
- ✅ Linux server administration
- ✅ Docker and container management
- ✅ PostgreSQL database administration
- ✅ Nginx reverse proxy configuration
- ✅ SSL/TLS certificate management
- ✅ Basic networking knowledge

### **Required Tools:**
- ✅ Docker & Docker Compose
- ✅ Git version control
- ✅ SSH client
- ✅ Text editor (vim/nano)
- ✅ SSL certificate tool (certbot)

---

## 🏗️ INFRASTRUCTURE REQUIREMENTS

### **Minimum Server Specifications:**
```yaml
Production Server:
  CPU: 4+ cores (Intel/AMD x64)
  RAM: 16GB+ DDR4
  Storage: 500GB+ SSD
  Network: 1Gbps connection
  OS: Ubuntu 22.04 LTS / CentOS 8+

Database Server:
  CPU: 8+ cores (Intel/AMD x64)
  RAM: 32GB+ DDR4
  Storage: 1TB+ NVMe SSD
  Network: 10Gbps connection (if possible)
  OS: Ubuntu 22.04 LTS LTS

Load Balancer:
  CPU: 2+ cores
  RAM: 4GB+
  Storage: 100GB+
  Network: 1Gbps+
  OS: Ubuntu 22.04 LTS
```

### **Software Requirements:**
```yaml
Required Software:
  Docker: 20.10+
  Docker Compose: 2.0+
  PostgreSQL: 15+
  Redis: 7+
  Nginx: 1.20+
  Node.js: 18+ (for local builds)
  Certbot: 1.0+
```

---

## 🚀 PHASE 1: ENVIRONMENT SETUP

### **1.1 Server Initial Setup**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git vim nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/inamsos
sudo chown $USER:$USER /opt/inamsos
cd /opt/inamsos
```

### **1.2 Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow database connections (internal only)
sudo ufw allow from 10.0.0.0/8 to any port 5432
sudo ufw allow from 172.16.0.0/12 to any port 5432
sudo ufw allow from 192.168.0.0/16 to any port 5432

# Enable firewall
sudo ufw --force enable
```

### **1.3 Domain Configuration**

```bash
# Replace with your domain
DOMAIN="inamsos.kemenkes.go.id"

# Add to /etc/hosts if needed (for testing)
echo "127.0.0.1 $DOMAIN www.$DOMAIN" | sudo tee -a /etc/hosts

# Configure DNS (required for production)
# - Create A records:
#   - @ -> Server IP
#   - www -> Server IP
#   - api -> Server IP
#   - admin -> Server IP
```

---

## 🗄️ PHASE 2: DATABASE SETUP

### **2.1 PostgreSQL Installation & Configuration**

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE inamsos;
CREATE USER inamsos WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE inamsos TO inamsos;
ALTER USER inamsos CREATEDB;
\q
EOF

# Configure PostgreSQL for production
sudo vim /etc/postgresql/15/main/postgresql.conf
```

**Edit postgresql.conf:**
```ini
# Memory settings
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 256MB
maintenance_work_mem = 1GB

# Connection settings
max_connections = 200
listen_addresses = 'localhost'

# Performance settings
random_page_cost = 1.1
effective_io_concurrency = 200
```

**Edit pg_hba.conf:**
```bash
sudo vim /etc/postgresql/15/main/pg_hba.conf
```

**Add these lines:**
```
# INAMSOS database connections
local   inamsos         inamsos                                 md5
host    inamsos         inamsos         127.0.0.1/32            md5
host    inamsos         inamsos         ::1/128                 md5
```

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### **2.2 Redis Installation & Configuration**

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo vim /etc/redis/redis.conf
```

**Edit redis.conf:**
```ini
# Security
bind 127.0.0.1 ::1
port 6379
requirepass STRONG_REDIS_PASSWORD
protected-mode yes

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
```

```bash
# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

### **2.3 Database Schema Setup**

```bash
# Clone repository
cd /opt/inamsos
git clone <REPOSITORY_URL> .

# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed initial data (if available)
npx prisma db seed
```

---

## 🐳 PHASE 3: BACKEND DEPLOYMENT

### **3.1 Environment Configuration**

```bash
# Create production environment file
cd /opt/inamsos/backend
cp .env.production .env

# Edit environment file
vim .env
```

**Production Environment Variables:**
```env
# Database Configuration
DATABASE_URL="postgresql://inamsos:STRONG_PASSWORD_HERE@localhost:5432/inamsos"
POSTGRES_DB=inamsos
POSTGRES_USER=inamsos
POSTGRES_PASSWORD=STRONG_PASSWORD_HERE

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=STRONG_REDIS_PASSWORD

# JWT Configuration
JWT_SECRET="GENERATE_STRONG_256_BIT_SECRET_HERE"
JWT_REFRESH_SECRET="GENERATE_ANOTHER_STRONG_256_BIT_SECRET_HERE"
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=production
PORT=3001
APP_NAME=INAMSOS
APP_VERSION=1.0.0
CORS_ORIGIN=https://inamsos.kemenkes.go.id

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.inamsos.kemenkes.go.id
NEXT_PUBLIC_APP_NAME=INAMSOS
NEXT_PUBLIC_VERSION=1.0.0

# Security Configuration
ENCRYPTION_MASTER_KEY="GENERATE_256_BIT_ENCRYPTION_KEY"
SESSION_SECRET="GENERATE_STRONG_SESSION_SECRET"

# MinIO Configuration (for file storage)
MINIO_ENDPOINT=storage.inamsos.kemenkes.go.id
MINIO_PORT=443
MINIO_ACCESS_KEY=MINIO_ACCESS_KEY
MINIO_SECRET_KEY=MINIO_SECRET_KEY
MINIO_USE_SSL=true
MINIO_BUCKET=inamsos-files

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/var/log/inamsos/app.log
```

### **3.2 Build Backend Application**

```bash
# Install production dependencies
npm ci --production

# Build application
npm run build

# Create systemd service
sudo vim /etc/systemd/system/inamsos-backend.service
```

**Systemd Service Configuration:**
```ini
[Unit]
Description=INAMSOS Backend Service
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/inamsos/backend
Environment=NODE_ENV=production
EnvironmentFile=/opt/inamsos/backend/.env
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=inamsos-backend

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/inamsos /tmp

[Install]
WantedBy=multi-user.target
```

```bash
# Create log directory
sudo mkdir -p /var/log/inamsos
sudo chown www-data:www-data /var/log/inamsos

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable inamsos-backend
sudo systemctl start inamsos-backend

# Check service status
sudo systemctl status inamsos-backend
```

---

## 🌐 PHASE 4: FRONTEND DEPLOYMENT

### **4.1 Build Frontend Application**

```bash
# Navigate to frontend directory
cd /opt/inamsos/frontend

# Install dependencies
npm ci

# Create production environment file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.inamsos.kemenkes.go.id
NEXT_PUBLIC_APP_NAME=INAMSOS
NEXT_PUBLIC_VERSION=1.0.0
NODE_ENV=production
EOF

# Build frontend application
npm run build

# Create nginx configuration
sudo vim /etc/nginx/sites-available/inamsos
```

### **4.2 Nginx Configuration**

**Nginx Virtual Host Configuration:**
```nginx
server {
    listen 80;
    server_name inamsos.kemenkes.go.id www.inamsos.kemenkes.go.id;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name inamsos.kemenkes.go.id www.inamsos.kemenkes.go.id;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/inamsos.kemenkes.go.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/inamsos.kemenkes.go.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.inamsos.kemenkes.go.id;" always;

    # Frontend files
    root /opt/inamsos/frontend/.next;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ @nextjs;
    }

    location @nextjs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # Static files
    location /_next/static/ {
        alias /opt/inamsos/frontend/.next/static/;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Rate limiting zones
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
}
```

### **4.3 Configure Frontend Service**

```bash
# Create systemd service for frontend
sudo vim /etc/systemd/system/inamsos-frontend.service
```

**Frontend Service Configuration:**
```ini
[Unit]
Description=INAMSOS Frontend Service
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/inamsos/frontend
Environment=NODE_ENV=production
EnvironmentFile=/opt/inamsos/frontend/.env.production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=inamsos-frontend

[Install]
WantedBy=multi-user.target
```

### **4.4 Start Services**

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/inamsos /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Enable and start frontend service
sudo systemctl daemon-reload
sudo systemctl enable inamsos-frontend
sudo systemctl start inamsos-frontend

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔐 PHASE 5: SECURITY CONFIGURATION

### **5.1 SSL Certificate Setup**

```bash
# Generate SSL certificate with Let's Encrypt
sudo certbot --nginx -d inamsos.kemenkes.go.id -d www.inamsos.kemenkes.go.id

# Set up auto-renewal
sudo crontab -e
```

**Add to crontab:**
```cron
0 12 * * * /usr/bin/certbot renew --quiet
```

### **5.2 Security Hardening**

```bash
# Create security configuration
sudo vim /etc/security/limits.d/inamsos.conf
```

**Security Limits:**
```conf
# INAMSOS security limits
www-data soft nofile 65536
www-data hard nofile 65536
www-data soft nproc 4096
www-data hard nproc 8192
```

```bash
# Configure kernel parameters
sudo vim /etc/sysctl.d/99-inamsos.conf
```

**Kernel Parameters:**
```conf
# Network security
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Memory management
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5

# File system security
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
```

```bash
# Apply kernel parameters
sudo sysctl -p /etc/sysctl.d/99-inamsos.conf
```

### **5.3 Backup Setup**

```bash
# Create backup script
sudo vim /opt/inamsos/scripts/backup.sh
```

**Backup Script:**
```bash
#!/bin/bash

# Backup configuration
BACKUP_DIR="/var/backups/inamsos"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U inamsos -d inamsos | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /opt/inamsos/backend/uploads /opt/inamsos/frontend/public

# Configuration backup
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /opt/inamsos/backend/.env /etc/nginx/sites-available/inamsos

# Remove old backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

# Log backup
echo "Backup completed: $DATE" >> /var/log/inamsos/backup.log
```

```bash
# Make script executable
sudo chmod +x /opt/inamsos/scripts/backup.sh

# Create cron job for automatic backups
sudo crontab -e
```

**Add to crontab:**
```cron
# INAMSOS backups
0 2 * * * /opt/inamsos/scripts/backup.sh

# INAMSOS log rotation
0 3 * * 0 /usr/sbin/logrotate /etc/logrotate.d/inamsos
```

---

## 📊 PHASE 6: MONITORING SETUP

### **6.1 Prometheus & Grafana Setup**

```bash
# Create monitoring directory
mkdir -p /opt/inamsos/monitoring

# Create docker-compose for monitoring
cat > /opt/inamsos/monitoring/docker-compose.monitoring.yml << EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: inamsos-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    container_name: inamsos-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=GRAFANA_ADMIN_PASSWORD
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning

  alertmanager:
    image: prom/alertmanager:latest
    container_name: inamsos-alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
EOF
```

### **6.2 Health Check Configuration**

```bash
# Create health check endpoint
sudo vim /opt/inamsos/scripts/health-check.sh
```

**Health Check Script:**
```bash
#!/bin/bash

# Health check configuration
FRONTEND_URL="https://inamsos.kemenkes.go.id"
API_URL="https://api.inamsos.kemenkes.go.id/health"
EMAIL_ALERT="admin@inamsos.kemenkes.go.id"

# Check frontend
if curl -f -s $FRONTEND_URL > /dev/null; then
    echo "$(date): Frontend OK"
    FRONTEND_STATUS=0
else
    echo "$(date): Frontend DOWN"
    FRONTEND_STATUS=1
fi

# Check API
if curl -f -s $API_URL > /dev/null; then
    echo "$(date): API OK"
    API_STATUS=0
else
    echo "$(date): API DOWN"
    API_STATUS=1
fi

# Send alert if any service is down
if [ $FRONTEND_STATUS -eq 1 ] || [ $API_STATUS -eq 1 ]; then
    echo "Service down detected" | mail -s "INAMSOS Alert" $EMAIL_ALERT
fi
```

---

## ✅ PHASE 7: GO-LIVE CHECKLIST

### **7.1 Pre-Deployment Verification**

```bash
# Create pre-deployment checklist
vim /opt/inamsos/CHECKLIST.md
```

**Pre-Deployment Checklist:**
```markdown
## 🚀 INAMSOS Production Deployment Checklist

### ✅ Infrastructure Setup
- [ ] Server specifications meet requirements
- [ ] Docker and Docker Compose installed
- [ ] Nginx configured and tested
- [ ] SSL certificates installed and valid
- [ ] Firewall rules configured
- [ ] Domain DNS records configured

### ✅ Database Setup
- [ ] PostgreSQL installed and configured
- [ ] Database created with proper schema
- [ ] Redis installed and configured
- [ ] Database migrations applied
- [ ] Backup procedures tested
- [ ] Performance tuning applied

### ✅ Application Setup
- [ ] Backend application built and tested
- [ ] Frontend application built and optimized
- [ ] Environment variables configured
- [ ] Systemd services configured
- [ ] Application security hardening applied
- [ ] Logging and monitoring configured

### ✅ Security Verification
- [ ] SSL/TLS certificates valid and properly configured
- [ ] Security headers implemented
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Authentication and authorization tested
- [ ] Vulnerability scan completed

### ✅ Performance Verification
- [ ] Load testing completed
- [ ] Database query optimization verified
- [ ] Caching strategies implemented
- [ ] CDN configured (if applicable)
- [ ] Response times meet requirements
- [ ] Scalability testing completed

### ✅ Monitoring & Alerting
- [ ] Prometheus metrics configured
- [ ] Grafana dashboards created
- [ ] Health check endpoints configured
- [ ] Alert rules configured
- [ ] Log aggregation configured
- [ ] Backup monitoring setup

### ✅ Documentation & Training
- [ ] Deployment documentation completed
- [ ] User training materials prepared
- [ ] Admin documentation created
- [ ] Troubleshooting guide prepared
- [ ] Support procedures defined
- [ ] Emergency contact list created
```

### **7.2 Deployment Verification**

```bash
# Run verification script
vim /opt/inamsos/scripts/verify-deployment.sh
```

**Deployment Verification Script:**
```bash
#!/bin/bash

echo "🚀 INAMSOS Deployment Verification"

# Test API endpoints
echo "Testing API endpoints..."
API_URL="https://api.inamsos.kemenkes.go.id"

# Health check
if curl -f $API_URL/health; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Test frontend
echo "Testing frontend..."
FRONTEND_URL="https://inamsos.kemenkes.go.id"
if curl -f $FRONTEND_URL; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend not accessible"
    exit 1
fi

# Test database connection
echo "Testing database connection..."
cd /opt/inamsos/backend
if npm run test:db; then
    echo "✅ Database connection OK"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Test Redis connection
echo "Testing Redis connection..."
if redis-cli -a $REDIS_PASSWORD ping; then
    echo "✅ Redis connection OK"
else
    echo "❌ Redis connection failed"
    exit 1
fi

echo "🎉 All verification tests passed!"
```

---

## 🎉 PHASE 8: POST-DEPLOYMENT

### **8.1 Performance Monitoring**

```bash
# Monitor application performance
sudo systemctl status inamsos-backend
sudo systemctl status inamsos-frontend
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server

# Monitor resource usage
htop
iotop
nethogs
```

### **8.2 Ongoing Maintenance**

```bash
# Create maintenance script
vim /opt/inamsos/scripts/maintenance.sh
```

**Maintenance Script:**
```bash
#!/bin/bash

echo "🔧 INAMSOS System Maintenance"

# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean Docker containers
docker system prune -f

# Rotate logs
sudo logrotate -f /etc/logrotate.d/inamsos

# Check disk space
df -h

# Check memory usage
free -h

# Check service status
systemctl is-active inamsos-backend
systemctl is-active inamsos-frontend
systemctl is-active nginx

# Run security updates
sudo apt autoremove -y
sudo apt autoclean

echo "✅ Maintenance completed"
```

### **8.3 Scaling Preparation**

```bash
# Create scaling configuration
vim /opt/inamsos/docker-compose.scale.yml
```

**Scaling Configuration:**
```yaml
version: '3.8'

services:
  backend:
    image: inamsos/backend:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
      reservations:
        cpus: '0.5'
          memory: 512M

  frontend:
    image: inamsos/frontend:latest
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  nginx:
    image: nginx:alpine
    deploy:
      replicas: 2
```

---

## 📞 EMERGENCY PROCEDURES

### **Rollback Procedures:**

```bash
# Quick rollback script
vim /opt/inamsos/scripts/rollback.sh
```

**Rollback Script:**
```bash
#!/bin/bash

echo "🔄 INAMSOS Emergency Rollback"

# Stop current services
sudo systemctl stop inamsos-backend
sudo systemctl stop inamsos-frontend

# Restore database backup
LATEST_BACKUP=$(ls -t /var/backups/inamsos/database_*.sql.gz | head -1)
gunzip -c $LATEST_BACKUP | psql -U inamsos -d inamsos

# Restore previous version
git checkout PREVIOUS_VERSION_TAG
npm run build

# Restart services
sudo systemctl start inamsos-backend
sudo systemctl start inamsos-frontend

echo "✅ Rollback completed"
```

---

## 🎯 SUCCESS METRICS

### **Key Performance Indicators:**
- ✅ **Uptime:** >99.9%
- ✅ **Response Time:** <2 seconds average
- ✅ **Availability:** 24/7 with monitoring
- ✅ **Security:** Zero critical vulnerabilities
- ✅ **Data Integrity:** 100% backup success
- ✅ **User Satisfaction:** >95%

### **Monitoring Dashboards:**
- Grafana: http://server-ip:3001
- Prometheus: http://server-ip:9090
- Application logs: /var/log/inamsos/
- System metrics: Built-in monitoring

---

## 📞 SUPPORT CONTACT

### **Emergency Contacts:**
- **System Administrator:** [Contact Information]
- **Database Administrator:** [Contact Information]
- **Security Team:** [Contact Information]
- **Application Support:** [Contact Information]

### **Documentation:**
- User Manual: `/docs/USER_MANUAL.md`
- Admin Guide: `/docs/ADMIN_GUIDE.md`
- API Documentation: `/docs/API_DOCUMENTATION.md`
- Troubleshooting: `/docs/TROUBLESHOOTING.md`

---

## 🏆 DEPLOYMENT SUCCESS CRITERIA

**System is considered successfully deployed when:**
- ✅ All health checks pass
- ✅ SSL certificates are valid
- ✅ All services are running
- ✅ Database connections are stable
- ✅ Frontend is accessible via HTTPS
- ✅ API endpoints respond correctly
- ✅ Monitoring dashboards are active
- ✅ Backup procedures are working
- ✅ Load testing meets requirements
- ✅ Security scan is clean

---

**🎉 CONGRATULATIONS! INAMSOS is now production-ready and serving Indonesian healthcare providers! 🇮🇩**

*This deployment guide provides enterprise-grade procedures for deploying the INAMSOS tumor registry system in production environment with security, scalability, and reliability.*