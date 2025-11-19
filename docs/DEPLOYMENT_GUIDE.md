# Panduan Deployment INAMSOS

**Indonesia National Cancer Database System - Production Deployment Procedures**

[![Environment](https://img.shields.io/badge/environment-Production-red.svg)](https://deploy.inamsos.go.id)
[![Kubernetes](https://img.shields.io/badge/kubernetes-1.28+-blue.svg)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/docker-24.0+-blue.svg)](https://www.docker.com/)
[![Infrastructure as Code](https://img.shields.io/badge/IaC-Terraform-orange.svg)](https://www.terraform.io/)

## Daftar Isi

- [Prasyarat Deployment](#prasyarat-deployment)
- [Arsitektur Deployment](#arsitektur-deployment)
- [Environment Setup](#environment-setup)
- [Infrastructure Preparation](#infrastructure-preparation)
- [Database Setup](#database-setup)
- [Application Deployment](#application-deployment)
- [Load Balancer Configuration](#load-balancer-configuration)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Disaster Recovery](#backup--disaster-recovery)
- [Post-Deployment Tasks](#post-deployment-tasks)
- [Rollback Procedures](#rollback-procedures)
- [Maintenance Procedures](#maintenance-procedures)
- [Performance Optimization](#performance-optimization)

---

## Prasyarat Deployment

### System Requirements

#### Hardware Requirements

**Minimum Production Environment:**
- **Application Servers**: 4 CPU cores, 16GB RAM, 500GB SSD
- **Database Server**: 8 CPU cores, 32GB RAM, 1TB SSD
- **Redis Server**: 2 CPU cores, 8GB RAM, 200GB SSD
- **Load Balancer**: 2 CPU cores, 4GB RAM, 100GB SSD

**Recommended Production Environment:**
- **Application Servers**: 8 CPU cores, 32GB RAM, 1TB NVMe SSD
- **Database Server**: 16 CPU cores, 64GB RAM, 2TB NVMe SSD
- **Redis Server**: 4 CPU cores, 16GB RAM, 500GB SSD
- **Load Balancer**: 4 CPU cores, 8GB RAM, 200GB SSD

#### Software Requirements

- **Operating System**: Ubuntu 22.04 LTS / RHEL 9.x
- **Container Runtime**: Docker 24.0+ with Docker Compose
- **Orchestration**: Kubernetes 1.28+ (optional)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7.0+
- **Reverse Proxy**: Nginx 1.24+
- **SSL**: Let's Encrypt or commercial certificates

### Networking Requirements

- **Static IP Addresses**: For all production servers
- **Domain Names**:
  - `api.inamsos.go.id` - Primary API
  - `app.inamsos.go.id` - Frontend application
  - `admin.inamsos.go.id` - Administration panel
- **Firewall**: Configured to allow necessary ports only
- **Load Balancer**: High availability setup

### Team Requirements

- **DevOps Engineer**: Infrastructure and deployment expertise
- **Database Administrator**: PostgreSQL optimization and management
- **Security Officer**: Security review and compliance verification
- **Application Developer**: Application-specific configuration

---

## Arsitektur Deployment

### Production Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            INTERNET                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                         ┌─────────▼─────────┐
                         │  Cloudflare CDN   │
                         │  (DDoS Protection)│
                         └─────────┬─────────┘
                                  │
                         ┌─────────▼─────────┐
                         │  Load Balancer    │
                         │  (HAProxy/Nginx)  │
                         └─────────┬─────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────────────┐
    │                             │                                     │
┌───▼───┐    ┌─────────▼─────────┐    │    ┌─────────▼─────────┐    ┌───▼───┐
│  Web  │    │   App Server 1    │    │    │   App Server 2    │    │  Web  │
│ Server│◄──►│   (Node.js)       │◄──►│◄──►│   (Node.js)       │◄──►│ Server│
│ (Nginx)│    │   (Container)     │    │    │   (Container)     │    │ (Nginx)│
└───┬───┘    └─────────┬─────────┘    │    └─────────┬─────────┘    └───┬───┘
    │                  │              │              │                  │
    │            ┌─────▼─────┐        │        ┌─────▼─────┐            │
    │            │  Redis    │        │        │  Redis    │            │
    │            │  Cluster  │        │        │  Cluster  │            │
    │            └─────┬─────┘        │        └─────┬─────┘            │
    └────────────────┼────────────────┼────────────────┼────────────────┘
                     │                │                │
              ┌──────▼──────┐   ┌─────▼─────┐   ┌──────▼──────┐
              │ PostgreSQL  │   │  MinIO    │   │ Elasticsearch│
              │  Primary    │   │  Storage  │   │   (Logs)    │
              │   (Master)  │   │           │   │             │
              └──────┬──────┘   └───────────┘   └──────────────┘
                     │
              ┌──────▼──────┐
              │ PostgreSQL  │
              │  Replica    │
              │  (Slave)    │
              └─────────────┘
```

### High Availability Setup

#### Load Balancer Configuration

```bash
# /etc/haproxy/haproxy.cfg
global
    daemon
    maxconn 4096
    user haproxy
    group haproxy

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    option httplog
    option dontlognull

frontend api_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/inamsos.pem
    redirect scheme https if !{ ssl_fc }
    default_backend api_servers

backend api_servers
    balance roundrobin
    option httpchk GET /health
    server api1 10.0.1.10:3000 check
    server api2 10.0.1.11:3000 check
    server api3 10.0.1.12:3000 check

listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
```

---

## Environment Setup

### Environment Variables Configuration

#### Production Environment (.env.production)

```bash
# Application Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://inamsos_user:secure_password@postgres-primary:5432/inamsos_prod?sslmode=require&connection_limit=20
DATABASE_REPLICA_URL=postgresql://inamsos_user:secure_password@postgres-replica:5432/inamsos_prod?sslmode=require&connection_limit=20
DATABASE_POOL_MIN=10
DATABASE_POOL_MAX=50

# Redis Configuration
REDIS_HOST=redis-cluster
REDIS_PORT=6379
REDIS_PASSWORD=redis_secure_password
REDIS_DB=0
REDIS_TLS=true

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secure_access_secret_at_least_64_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_at_least_64_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your_32_byte_encryption_key_for_sensitive_data
ENCRYPTION_IV=your_16_byte_initialization_vector

# File Storage (MinIO)
MINIO_ENDPOINT=minio.example.com
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio_access_key
MINIO_SECRET_KEY=minio_secret_key
MINIO_BUCKET=inamsos-files
MINIO_USE_SSL=true

# Email Configuration
SMTP_HOST=smtp.inamsos.go.id
SMTP_PORT=587
SMTP_USER=noreply@inamsos.go.id
SMTP_PASS=email_secure_password
SMTP_FROM=INAMSOS System <noreply@inamsos.go.id>

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+628123456789

# Monitoring & Logging
LOG_LEVEL=info
LOG_FORMAT=json
METRICS_ENABLED=true
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id

# Security
CORS_ORIGIN=https://app.inamsos.go.id,https://admin.inamsos.go.id
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
ENABLE_MFA=true
ENABLE_AUDIT_LOGGING=true
ENABLE_DATA_ENCRYPTION=true
ENABLE_BACKUP_SCHEDULING=true

# External Services
EXTERNAL_API_TIMEOUT=30000
HEALTH_CHECK_INTERVAL=30000
```

#### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: inamsos/backend:1.0.0
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - inamsos-network
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G

  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_DB: inamsos_prod
      POSTGRES_USER: inamsos_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - inamsos-network
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 8G

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - inamsos-network
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - ./logs/nginx:/var/log/nginx
    networks:
      - inamsos-network
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:

networks:
  inamsos-network:
    driver: bridge
```

---

## Infrastructure Preparation

### Server Setup Scripts

#### Application Server Setup

```bash
#!/bin/bash
# scripts/setup-app-server.sh

set -euo pipefail

echo "Setting up INAMSOS Application Server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install -y nginx

# Create application directories
sudo mkdir -p /opt/inamsos/{app,logs,uploads,ssl}
sudo chown -R $USER:$USER /opt/inamsos

# Setup firewall
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Setup log rotation
sudo tee /etc/logrotate.d/inamsos << EOF
/opt/inamsos/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker kill -s USR1 inamsos_app_1
    endscript
}
EOF

echo "Application server setup complete!"
```

#### Database Server Setup

```bash
#!/bin/bash
# scripts/setup-db-server.sh

echo "Setting up PostgreSQL Database Server..."

# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib

# Configure PostgreSQL
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/15/main/postgresql.conf

# Setup access control
sudo tee -a /etc/postgresql/15/main/pg_hba.conf << EOF
# INAMSOS production access
host inamsos_prod inamsos_user 10.0.0.0/8 md5
host replication replicator 10.0.0.0/8 md5
EOF

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE inamsos_prod;
CREATE USER inamsos_user WITH PASSWORD 'secure_db_password';
GRANT ALL PRIVILEGES ON DATABASE inamsos_prod TO inamsos_user;
CREATE USER replicator WITH REPLICATION PASSWORD 'repl_password';
GRANT CONNECT ON DATABASE inamsos_prod TO replicator;
EOF

# Setup performance tuning
sudo tee -a /etc/postgresql/15/main/postgresql.conf << EOF
# Performance tuning for INAMSOS
shared_buffers = 8GB
effective_cache_size = 24GB
maintenance_work_mem = 2GB
checkpoint_completion_target = 0.9
wal_buffers = 64MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 128MB
min_wal_size = 2GB
max_wal_size = 8GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
EOF

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

echo "Database server setup complete!"
```

### Kubernetes Deployment (Alternative)

#### Namespace and ConfigMap

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: inamsos-prod
  labels:
    name: inamsos-prod

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: inamsos-config
  namespace: inamsos-prod
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  METRICS_ENABLED: "true"
  ENABLE_MFA: "true"
  ENABLE_AUDIT_LOGGING: "true"
```

#### Secrets

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: inamsos-secrets
  namespace: inamsos-prod
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_ACCESS_SECRET: <base64-encoded-jwt-secret>
  ENCRYPTION_KEY: <base64-encoded-encryption-key>
  REDIS_PASSWORD: <base64-encoded-redis-password>
```

#### Application Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inamsos-app
  namespace: inamsos-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: inamsos-app
  template:
    metadata:
      labels:
        app: inamsos-app
    spec:
      containers:
      - name: app
        image: inamsos/backend:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: inamsos-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: inamsos-secrets
              key: DATABASE_URL
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: inamsos-service
  namespace: inamsos-prod
spec:
  selector:
    app: inamsos-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

---

## Database Setup

### Database Migration

```bash
#!/bin/bash
# scripts/migrate-database.sh

echo "Running database migrations..."

# Set environment
export NODE_ENV=production
export DATABASE_URL="postgresql://inamsos_user:secure_password@postgres-primary:5432/inamsos_prod?sslmode=require"

# Generate Prisma client
cd /opt/inamsos/app
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (if needed)
if [ "$1" = "--seed" ]; then
  echo "Seeding initial data..."
  npm run db:seed
fi

# Validate database schema
npx prisma db seed

echo "Database migration complete!"
```

### Database Backup Setup

```bash
#!/bin/bash
# scripts/setup-backup.sh

# Create backup user
sudo -u postgres psql << EOF
CREATE USER backup_user WITH PASSWORD 'backup_secure_password';
GRANT CONNECT ON DATABASE inamsos_prod TO backup_user;
GRANT USAGE ON SCHEMA medical TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA medical TO backup_user;
GRANT USAGE ON SCHEMA system TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA system TO backup_user;
GRANT USAGE ON SCHEMA audit TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA medical GRANT SELECT ON TABLES TO backup_user;
EOF

# Create backup directory
sudo mkdir -p /opt/backups/inamsos/{daily,weekly,monthly}
sudo chown -R postgres:postgres /opt/backups

# Setup backup scripts
sudo tee /opt/backups/backup-daily.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/opt/backups/inamsos/daily/inamsos_backup_${DATE}.sql"

pg_dump -h localhost -U backup_user -d inamsos_prod \
    --no-password --clean --if-exists \
    --format=custom --compress=9 \
    --file="${BACKUP_FILE}"

# Keep last 7 days
find /opt/backups/inamsos/daily -name "*.sql" -mtime +7 -delete

# Upload to cloud storage (optional)
# aws s3 cp "${BACKUP_FILE}" s3://inamsos-backups/daily/
EOF

sudo chmod +x /opt/backups/backup-daily.sh

# Schedule backups
sudo tee /etc/cron.d/inamsos-backups << EOF
# INAMSOS Database Backups
30 2 * * * postgres /opt/backups/backup-daily.sh
0 3 * * 0 postgres /opt/backups/backup-weekly.sh
0 4 1 * * postgres /opt/backups/backup-monthly.sh
EOF

echo "Database backup setup complete!"
```

### Performance Optimization

```sql
-- scripts/optimize-database.sql

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_patients_center_active ON medical.patients(center_id, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_medical_records_patient_date ON medical.medical_records(patient_id, record_date DESC);
CREATE INDEX CONCURRENTLY idx_audit_events_user_timestamp ON audit.audit_events(user_id, event_timestamp DESC);

-- Partition large tables (if needed)
CREATE TABLE audit.audit_events_2024 PARTITION OF audit.audit_events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Update table statistics
ANALYZE;

-- Vacuum and reindex
VACUUM ANALYZE;
REINDEX DATABASE inamsos_prod;
```

---

## Application Deployment

### Build and Deploy Script

```bash
#!/bin/bash
# scripts/deploy.sh

set -euo pipefail

# Configuration
APP_VERSION=${1:-1.0.0}
ENVIRONMENT=${2:-production}
REGISTRY="registry.inamsos.go.id"

echo "Deploying INAMSOS v${APP_VERSION} to ${ENVIRONMENT}..."

# Build application
echo "Building application..."
cd /opt/inamsos/app
npm ci --only=production
npm run build

# Build Docker image
echo "Building Docker image..."
docker build -t ${REGISTRY}/inamsos/backend:${APP_VERSION} .
docker tag ${REGISTRY}/inamsos/backend:${APP_VERSION} ${REGISTRY}/inamsos/backend:latest

# Push to registry
echo "Pushing to registry..."
docker push ${REGISTRY}/inamsos/backend:${APP_VERSION}
docker push ${REGISTRY}/inamsos/backend:latest

# Deploy with Docker Compose
echo "Deploying application..."
cd /opt/inamsos
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

# Wait for health check
echo "Waiting for application to be healthy..."
sleep 30

# Run health checks
if curl -f http://localhost:3000/health; then
    echo "Deployment successful!"
else
    echo "Deployment failed - rolling back..."
    docker-compose -f docker-compose.prod.yml down
    exit 1
fi

# Cleanup old images
echo "Cleaning up old Docker images..."
docker image prune -f

echo "Deployment complete!"
```

### Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

CURRENT_ENV=$(docker-compose -f docker-compose.prod.yml ps -q app | head -1)
NEW_VERSION=$1

echo "Starting blue-green deployment..."

# Deploy to green environment
echo "Deploying to green environment..."
export DEPLOY_ENV=green
docker-compose -f docker-compose.green.yml up -d

# Wait for green to be healthy
echo "Waiting for green environment to be healthy..."
for i in {1..30}; do
    if curl -f http://green.inamsos.go.id/health; then
        echo "Green environment is healthy!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 10
done

# Switch traffic to green
echo "Switching traffic to green..."
# Update load balancer configuration
sed -i 's/server api1/server api_green/g' /etc/haproxy/haproxy.cfg
systemctl reload haproxy

# Wait for verification
sleep 60

# If everything is good, clean up blue
if curl -f https://api.inamsos.go.id/health; then
    echo "Deployment successful! Cleaning up blue environment..."
    docker-compose -f docker-compose.prod.yml down
else
    echo "Health check failed! Rolling back..."
    sed -i 's/server api_green/server api1/g' /etc/haproxy/haproxy.cfg
    systemctl reload haproxy
    docker-compose -f docker-compose.green.yml down
    exit 1
fi

echo "Blue-green deployment complete!"
```

---

## Load Balancer Configuration

### HAProxy Production Configuration

```bash
#!/bin/bash
# scripts/setup-haproxy.sh

# Install HAProxy
sudo apt install -y haproxy

# Configure HAProxy
sudo tee /etc/haproxy/haproxy.cfg << 'EOF'
global
    daemon
    maxconn 4096
    user haproxy
    group haproxy
    log /dev/log local0
    log /dev/log local1 notice
    ssl-default-bind-ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    timeout http-request 10s
    timeout http-keep-alive 10s
    option httplog
    option dontlognull
    retries 3
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

frontend api_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/inamsos.pem alpn h2,http/1.1
    redirect scheme https if !{ ssl_fc }
    http-request set-header X-Forwarded-Proto https if { ssl_fc }
    http-request set-header X-Forwarded-Port %[dst_port]
    acl is_api path_beg /api /auth /patients /research
    use_backend api_servers if is_api
    default_backend web_servers

backend api_servers
    balance roundrobin
    option httpchk GET /health
    server api1 10.0.1.10:3000 check weight 1
    server api2 10.0.1.11:3000 check weight 1
    server api3 10.0.1.12:3000 check weight 1

backend web_servers
    balance roundrobin
    option httpchk GET /
    server web1 10.0.1.20:80 check
    server web2 10.0.1.21:80 check

listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
    stats admin if TRUE
    stats realm HAProxy\ Statistics
    stats auth admin:secure_stats_password

EOF

# Enable HAProxy
sudo systemctl enable haproxy
sudo systemctl start haproxy

echo "HAProxy setup complete!"
```

---

## SSL Certificate Setup

### Let's Encrypt Certificate Setup

```bash
#!/bin/bash
# scripts/setup-ssl.sh

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.inamsos.go.id -d app.inamsos.go.id -d admin.inamsos.go.id \
    --email admin@inamsos.go.id --agree-tos --no-eff-email --non-interactive

# Setup auto-renewal
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

# Test renewal
sudo certbot renew --dry-run

echo "SSL certificate setup complete!"
```

### Custom SSL Certificate Setup

```bash
#!/bin/bash
# scripts/install-custom-ssl.sh

CERT_DIR="/etc/ssl/certs/inamsos"
KEY_DIR="/etc/ssl/private/inamsos"

# Create directories
sudo mkdir -p $CERT_DIR $KEY_DIR

# Install certificates
sudo cp certificates/inamsos.crt $CERT_DIR/
sudo cp certificates/inamsos.key $KEY_DIR/
sudo cp certificates/chain.crt $CERT_DIR/

# Set permissions
sudo chmod 644 $CERT_DIR/*.crt
sudo chmod 600 $KEY_DIR/inamsos.key

# Create combined certificate for HAProxy
sudo cat $CERT_DIR/inamsos.crt $CERT_DIR/chain.crt > $CERT_DIR/inamsos-combined.pem

echo "Custom SSL certificate installed!"
```

---

## Monitoring & Logging

### Monitoring Setup with Prometheus

```yaml
# monitoring/prometheus.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
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
    container_name: grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin_secure_password
      - GF_USERS_ALLOW_SIGN_UP=false

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
```

### Log Aggregation with ELK Stack

```yaml
# logging/elasticsearch.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=elastic_secure_password
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.0
    container_name: logstash
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=elastic_secure_password
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

---

## Backup & Disaster Recovery

### Automated Backup Script

```bash
#!/bin/bash
# scripts/comprehensive-backup.sh

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/inamsos"
S3_BUCKET="s3://inamsos-backups"

echo "Starting comprehensive backup for $BACKUP_DATE..."

# Create backup directory
mkdir -p $BACKUP_DIR/$BACKUP_DATE

# Database backup
echo "Backing up database..."
pg_dump -h localhost -U backup_user -d inamsos_prod \
    --format=custom --compress=9 \
    --file="$BACKUP_DIR/$BACKUP_DATE/database.sqlc"

# Application files backup
echo "Backing up application files..."
tar -czf "$BACKUP_DIR/$BACKUP_DATE/application.tar.gz" \
    /opt/inamsos/app \
    /opt/inamsos/config \
    /opt/inamsos/uploads

# Configuration backup
echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/$BACKUP_DATE/config.tar.gz" \
    /etc/nginx \
    /etc/haproxy \
    /opt/inamsos/.env.production

# Log files backup
echo "Backing up logs..."
tar -czf "$BACKUP_DIR/$BACKUP_DATE/logs.tar.gz" \
    /opt/inamsos/logs \
    /var/log/nginx \
    /var/log/haproxy

# Create backup manifest
echo "Creating backup manifest..."
cat > "$BACKUP_DIR/$BACKUP_DATE/MANIFEST.txt" << EOF
Backup Date: $BACKUP_DATE
Database Size: $(du -h "$BACKUP_DIR/$BACKUP_DATE/database.sqlc" | cut -f1)
Application Size: $(du -h "$BACKUP_DIR/$BACKUP_DATE/application.tar.gz" | cut -f1)
Configuration Size: $(du -h "$BACKUP_DIR/$BACKUP_DATE/config.tar.gz" | cut -f1)
Logs Size: $(du -h "$BACKUP_DIR/$BACKUP_DATE/logs.tar.gz" | cut -f1)
Total Size: $(du -sh "$BACKUP_DIR/$BACKUP_DATE" | cut -f1)
EOF

# Upload to cloud storage
echo "Uploading to cloud storage..."
aws s3 sync "$BACKUP_DIR/$BACKUP_DATE" "$S3_BUCKET/$BACKUP_DATE/" \
    --storage-class STANDARD_IA

# Create S3 lifecycle policy for old backups
aws s3api put-bucket-lifecycle-configuration \
    --bucket inamsos-backups \
    --lifecycle-configuration file://s3-lifecycle.json

# Verify backup
echo "Verifying backup..."
BACKUP_SIZE=$(aws s3 ls "$S3_BUCKET/$BACKUP_DATE/" --recursive --summarize | tail -1 | awk '{print $3}')
if [ $BACKUP_SIZE -gt 0 ]; then
    echo "Backup verified successfully! Size: $BACKUP_SIZE bytes"

    # Clean up local files older than 7 days
    find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
else
    echo "Backup verification failed!"
    exit 1
fi

echo "Comprehensive backup completed successfully!"
```

### Disaster Recovery Plan

```bash
#!/bin/bash
# scripts/disaster-recovery.sh

echo "INAMSOS Disaster Recovery Procedure"
echo "==================================="

# Function to check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."

    # Check if backup exists
    if [ -z "$BACKUP_ID" ]; then
        echo "Error: BACKUP_ID is required"
        exit 1
    fi

    # Check AWS credentials
    if ! aws s3 ls > /dev/null 2>&1; then
        echo "Error: AWS credentials not configured"
        exit 1
    fi

    echo "Prerequisites check passed!"
}

# Function to restore database
restore_database() {
    echo "Restoring database..."

    # Download backup
    aws s3 cp "s3://inamsos-backups/$BACKUP_ID/database.sqlc" /tmp/database.sqlc

    # Stop application
    docker-compose -f docker-compose.prod.yml down

    # Restore database
    pg_restore -h localhost -U inamsos_user -d inamsos_prod \
        --clean --if-exists --verbose /tmp/database.sqlc

    echo "Database restore completed!"
}

# Function to restore application
restore_application() {
    echo "Restoring application..."

    # Download application backup
    aws s3 cp "s3://inamsos-backups/$BACKUP_ID/application.tar.gz" /tmp/application.tar.gz

    # Extract to temporary location
    mkdir -p /tmp/app_restore
    tar -xzf /tmp/application.tar.gz -C /tmp/app_restore

    # Copy files to application directory
    rsync -av /tmp/app_restore/opt/inamsos/ /opt/inamsos/

    echo "Application restore completed!"
}

# Function to restore configuration
restore_configuration() {
    echo "Restoring configuration..."

    # Download config backup
    aws s3 cp "s3://inamsos-backups/$BACKUP_ID/config.tar.gz" /tmp/config.tar.gz

    # Extract
    mkdir -p /tmp/config_restore
    tar -xzf /tmp/config.tar.gz -C /tmp/config_restore

    # Copy configuration files
    sudo rsync -av /tmp/config_restore/etc/ /etc/

    # Restart services
    sudo systemctl reload nginx
    sudo systemctl reload haproxy

    echo "Configuration restore completed!"
}

# Function to verify restore
verify_restore() {
    echo "Verifying restore..."

    # Start application
    docker-compose -f docker-compose.prod.yml up -d

    # Wait for application to start
    sleep 60

    # Health checks
    if curl -f http://localhost:3000/health; then
        echo "Application health check passed!"
    else
        echo "Application health check failed!"
        return 1
    fi

    # Database connectivity check
    if docker exec inamsos_app_1 npm run db:check; then
        echo "Database connectivity check passed!"
    else
        echo "Database connectivity check failed!"
        return 1
    fi

    echo "Restore verification completed!"
}

# Main disaster recovery process
main() {
    BACKUP_ID=$1

    if [ -z "$BACKUP_ID" ]; then
        echo "Usage: $0 <backup_id>"
        echo "Available backups:"
        aws s3 ls s3://inamsos-backups/ | grep -E "^[0-9]{8}_[0-9]{6}" | awk '{print $2}' | sed 's/\///'
        exit 1
    fi

    check_prerequisites
    restore_database
    restore_application
    restore_configuration
    verify_restore

    echo "Disaster recovery completed successfully!"
    echo "System is now ready for operation!"
}

main "$@"
```

---

## Post-Deployment Tasks

### Health Checks and Validation

```bash
#!/bin/bash
# scripts/post-deployment-checks.sh

echo "Running post-deployment health checks..."

# Application health check
echo "1. Checking application health..."
APP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$APP_HEALTH" = "200" ]; then
    echo "✓ Application health check passed"
else
    echo "✗ Application health check failed (HTTP $APP_HEALTH)"
    exit 1
fi

# Database connectivity
echo "2. Checking database connectivity..."
DB_STATUS=$(docker exec inamsos_app_1 npm run db:check)
if [ "$DB_STATUS" = "OK" ]; then
    echo "✓ Database connectivity check passed"
else
    echo "✗ Database connectivity check failed"
    exit 1
fi

# Redis connectivity
echo "3. Checking Redis connectivity..."
REDIS_PING=$(docker exec redis redis-cli ping)
if [ "$REDIS_PING" = "PONG" ]; then
    echo "✓ Redis connectivity check passed"
else
    echo "✗ Redis connectivity check failed"
    exit 1
fi

# SSL certificate validation
echo "4. Checking SSL certificate..."
SSL_INFO=$(openssl s_client -connect api.inamsos.go.id:443 -servername api.inamsos.go.id </dev/null 2>/dev/null | openssl x509 -noout -dates)
if [ $? -eq 0 ]; then
    echo "✓ SSL certificate is valid"
    echo "$SSL_INFO"
else
    echo "✗ SSL certificate check failed"
    exit 1
fi

# Performance benchmarks
echo "5. Running performance benchmarks..."
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:3000/api/patients)
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo "✓ Performance benchmark passed (${RESPONSE_TIME}s)"
else
    echo "✗ Performance benchmark failed (${RESPONSE_TIME}s)"
    exit 1
fi

# Security headers check
echo "6. Checking security headers..."
SECURITY_HEADERS=$(curl -I http://localhost:3000 2>/dev/null | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)")
if [ -n "$SECURITY_HEADERS" ]; then
    echo "✓ Security headers are present"
else
    echo "✗ Security headers are missing"
    exit 1
fi

echo "All post-deployment checks passed! ✓"
```

### User Acceptance Testing

```bash
#!/bin/bash
# scripts/uat-automation.sh

echo "Running User Acceptance Tests..."

# Test user registration
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "email": "uat-test@inamsos.go.id",
        "name": "UAT Test User",
        "password": "TestPassword123!",
        "centerId": "center_123"
    }')

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
    echo "✓ User registration test passed"
else
    echo "✗ User registration test failed"
    echo "$REGISTER_RESPONSE"
    exit 1
fi

# Test user login
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "uat-test@inamsos.go.id",
        "password": "TestPassword123!"
    }')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
if [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✓ User login test passed"
else
    echo "✗ User login test failed"
    exit 1
fi

# Test patient creation
echo "3. Testing patient creation..."
PATIENT_RESPONSE=$(curl -s -X POST http://localhost:3000/patients \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
        "medicalRecordNumber": "MRN_UAT_001",
        "name": "UAT Patient",
        "gender": "MALE",
        "birthDate": "1980-01-01"
    }')

if echo "$PATIENT_RESPONSE" | grep -q "patient_"; then
    echo "✓ Patient creation test passed"
    PATIENT_ID=$(echo "$PATIENT_RESPONSE" | jq -r '.id')
else
    echo "✗ Patient creation test failed"
    echo "$PATIENT_RESPONSE"
    exit 1
fi

# Test patient retrieval
echo "4. Testing patient retrieval..."
RETRIEVE_RESPONSE=$(curl -s -X GET "http://localhost:3000/patients/$PATIENT_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$RETRIEVE_RESPONSE" | grep -q "UAT Patient"; then
    echo "✓ Patient retrieval test passed"
else
    echo "✗ Patient retrieval test failed"
    exit 1
fi

# Test data export (if available)
echo "5. Testing data export..."
EXPORT_RESPONSE=$(curl -s -X GET "http://localhost:3000/research/data" \
    -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$EXPORT_RESPONSE" | grep -q "demographics"; then
    echo "✓ Data export test passed"
else
    echo "✗ Data export test failed"
    exit 1
fi

# Cleanup test data
echo "6. Cleaning up test data..."
curl -s -X DELETE "http://localhost:3000/patients/$PATIENT_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" > /dev/null

curl -s -X POST http://localhost:3000/auth/logout \
    -H "Authorization: Bearer $ACCESS_TOKEN" > /dev/null

echo "All UAT tests passed! ✓"
echo "System is ready for production use."
```

---

## Rollback Procedures

### Automated Rollback Script

```bash
#!/bin/bash
# scripts/rollback.sh

PREVIOUS_VERSION=$1
CURRENT_VERSION=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep inamsos/backend | awk '{print $2}' | head -2 | tail -1)

if [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: $0 <previous_version>"
    echo "Current version: $CURRENT_VERSION"
    echo "Available versions:"
    docker images --format "table {{.Repository}}:{{.Tag}}" | grep inamsos/backend
    exit 1
fi

echo "Rolling back from $CURRENT_VERSION to $PREVIOUS_VERSION..."

# Create backup before rollback
echo "Creating pre-rollback backup..."
./scripts/comprehensive-backup.sh

# Stop current deployment
echo "Stopping current deployment..."
docker-compose -f docker-compose.prod.yml down

# Pull previous version
echo "Pulling previous version..."
docker pull registry.inamsos.go.id/inamsos/backend:$PREVIOUS_VERSION

# Update compose file with previous version
sed -i "s/:$CURRENT_VERSION/:$PREVIOUS_VERSION/" docker-compose.prod.yml

# Start previous version
echo "Starting previous version..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for startup
sleep 30

# Health check
echo "Performing health check..."
if curl -f http://localhost:3000/health; then
    echo "✓ Rollback successful!"
    echo "Current running version: $PREVIOUS_VERSION"

    # Notify team
    curl -X POST https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK \
        -H 'Content-type: application/json' \
        -d "{\"text\":\"🚨 INAMSOS Rollback Alert: Rolled back from $CURRENT_VERSION to $PREVIOUS_VERSION\"}"
else
    echo "✗ Rollback failed! Manual intervention required."
    exit 1
fi
```

---

## Maintenance Procedures

### Scheduled Maintenance Script

```bash
#!/bin/bash
# scripts/maintenance.sh

MAINTENANCE_MODE=$1

if [ "$MAINTENANCE_MODE" = "enable" ]; then
    echo "Enabling maintenance mode..."

    # Enable maintenance page
    sudo tee /etc/nginx/sites-available/maintenance << 'EOF'
server {
    listen 80;
    listen 443 ssl;
    server_name api.inamsos.go.id app.inamsos.go.id;

    ssl_certificate /etc/ssl/certs/inamsos.pem;
    ssl_certificate_key /etc/ssl/private/inamsos.key;

    location / {
        return 503;
    }

    error_page 503 @maintenance;
    location @maintenance {
        rewrite ^(.*)$ /maintenance.html break;
        root /var/www/html;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/maintenance /etc/nginx/sites-enabled/maintenance
    sudo rm /etc/nginx/sites-enabled/inamsos

    # Create maintenance page
    sudo tee /var/www/html/maintenance.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>INAMSOS - Under Maintenance</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding-top: 100px; }
        h1 { color: #e74c3c; }
        .info { color: #7f8c8d; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>🔧 INAMSOS - Under Maintenance</h1>
    <div class="info">
        <p>System sedang dalam maintenance terjadwal.</p>
        <p>Estimasi selesai: 2 jam</p>
        <p>Untuk informasi lebih lanjut, hubungi IT Support</p>
    </div>
</body>
</html>
EOF

    sudo systemctl reload nginx

    # Put application in maintenance mode
    docker exec inamsos_app_1 npm run maintenance:on

    echo "✓ Maintenance mode enabled"

elif [ "$MAINTENANCE_MODE" = "disable" ]; then
    echo "Disabling maintenance mode..."

    # Disable maintenance mode
    docker exec inamsos_app_1 npm run maintenance:off

    # Restore normal configuration
    sudo rm /etc/nginx/sites-enabled/maintenance
    sudo ln -sf /etc/nginx/sites-available/inamsos /etc/nginx/sites-enabled/inamsos

    sudo systemctl reload nginx

    echo "✓ Maintenance mode disabled"

else
    echo "Usage: $0 <enable|disable>"
    exit 1
fi
```

### Database Maintenance

```bash
#!/bin/bash
# scripts/db-maintenance.sh

echo "Starting database maintenance..."

# Check database size before maintenance
DB_SIZE_BEFORE=$(psql -U postgres -d inamsos_prod -c "SELECT pg_size_pretty(pg_database_size('inamsos_prod'));" -t | xargs)
echo "Database size before maintenance: $DB_SIZE_BEFORE"

# Vacuum and analyze
echo "Running VACUUM ANALYZE..."
psql -U postgres -d inamsos_prod -c "VACUUM ANALYZE;"

# Rebuild indexes
echo "Rebuilding indexes..."
psql -U postgres -d inamsos_prod -c "REINDEX DATABASE inamsos_prod;"

# Update statistics
echo "Updating table statistics..."
psql -U postgres -d inamsos_prod -c "ANALYZE;"

# Clean up old audit logs (older than 1 year)
echo "Cleaning up old audit logs..."
psql -U postgres -d inamsos_prod -c "DELETE FROM audit.audit_events WHERE event_timestamp < NOW() - INTERVAL '1 year';"

# Check database size after maintenance
DB_SIZE_AFTER=$(psql -U postgres -d inamsos_prod -c "SELECT pg_size_pretty(pg_database_size('inamsos_prod'));" -t | xargs)
echo "Database size after maintenance: $DB_SIZE_AFTER"

# Check database health
echo "Checking database health..."
pg_controldata /var/lib/postgresql/15/main | grep -E "(Database cluster state|Latest checkpoint location)"

echo "Database maintenance completed!"
```

---

## Performance Optimization

### Application Performance Tuning

```typescript
// src/config/performance.config.ts
export const performanceConfig = {
  // Connection pooling
  database: {
    min: 10,
    max: 50,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000
  },

  // Redis configuration
  redis: {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false,
    lazyConnect: true,
    keepAlive: 30000
  },

  // HTTP server
  server: {
    keepAliveTimeout: 65000,
    headersTimeout: 66000
  },

  // Caching strategy
  cache: {
    defaultTTL: 300, // 5 minutes
    checkPeriod: 600, // 10 minutes
    maxKeys: 10000
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  }
};
```

### Database Performance Optimization

```sql
-- scripts/performance-optimization.sql

-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_patients_search ON medical.patients USING gin(to_tsvector('english', name || ' ' || medical_record_number));
CREATE INDEX CONCURRENTLY idx_medical_records_composite ON medical.medical_records(patient_id, record_date DESC, diagnosis_primary_cancer);
CREATE INDEX CONCURRENTLY idx_audit_events_composite ON audit.audit_events(user_id, event_timestamp DESC, action);
CREATE INDEX CONCURRENTLY idx_research_requests_status ON research.research_requests(status, submitted_at DESC);

-- Partition audit_events by month for better performance
CREATE TABLE audit.audit_events_y2024m01 PARTITION OF audit.audit_events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit.audit_events_y2024m02 PARTITION OF audit.audit_events
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Materialized view for dashboard analytics
CREATE MATERIALIZED VIEW analytics.patient_summary AS
SELECT
    center_id,
    COUNT(*) as total_patients,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_patients,
    AVG(EXTRACT(YEAR FROM AGE(NOW(), birth_date))) as avg_age,
    COUNT(CASE WHEN gender = 'MALE' THEN 1 END) as male_patients,
    COUNT(CASE WHEN gender = 'FEMALE' THEN 1 END) as female_patients,
    MAX(created_at) as last_registration
FROM medical.patients
GROUP BY center_id;

CREATE UNIQUE INDEX idx_patient_summary_center ON analytics.patient_summary(center_id);

-- Refresh materialized view periodically
CREATE OR REPLACE FUNCTION refresh_patient_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.patient_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh every hour
SELECT cron.schedule('refresh-patient-summary', '0 * * * *', 'SELECT refresh_patient_summary();');

-- Optimize table statistics
ANALYZE medical.patients;
ANALYZE medical.medical_records;
ANALYZE audit.audit_events;
```

---

## Summary

Panduan deployment INAMSOS ini menyediakan prosedur komprehensif untuk:

1. **Production Deployment**: Dari infrastructure setup hingga application deployment
2. **High Availability**: Load balancer, replication, dan failover procedures
3. **Security**: SSL/TLS setup, firewall configuration, dan security hardening
4. **Monitoring**: Comprehensive logging, monitoring, dan alerting
5. **Backup & Recovery**: Automated backups dan disaster recovery procedures
6. **Maintenance**: Scheduled maintenance dan performance optimization

### Deployment Checklist Final

#### Pre-Deployment
- [ ] Infrastructure provisioning completed
- [ ] Security review and approval obtained
- [ ] Database migration tested in staging
- [ ] Backup procedures verified
- [ ] Monitoring and alerting configured
- [ ] SSL certificates obtained and installed
- [ ] Load balancer configured
- [ ] Rollback procedures documented

#### During Deployment
- [ ] Traffic routing to maintenance page
- [ ] Database backup created
- [ ] Application deployed to production
- [ ] Health checks performed
- [ ] User acceptance testing completed
- [ ] Traffic restored to normal

#### Post-Deployment
- [ ] Monitoring dashboards verified
- [ ] Performance benchmarks met
- [ ] Security scans completed
- [ ] Documentation updated
- [ ] Team notification sent
- [ ] Post-deployment review conducted

Untuk informasi lebih lanjut atau bantuan deployment, hubungi DevOps Team di devops@inamsos.go.id.

---

**© 2025 INAMSOS - DevOps Team**
*Last Updated: November 19, 2025*