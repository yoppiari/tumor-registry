# Panduan Troubleshooting INAMSOS

**Indonesia National Cancer Database System - Problem Solving Guide**

[![Troubleshooting](https://img.shields.io/badge/troubleshooting-Comprehensive-orange.svg)](https://support.inamsos.go.id)
[![Support](https://img.shields.io/badge/support-24/7-green.svg)](https://help.inamsos.go.id)
[![Knowledge Base](https://img.shields.io/badge/knowledge_base-Extensive-blue.svg)](https://kb.inamsos.go.id)

## Daftar Isi

- [Ikhtisar Troubleshooting](#ikhtisar-troubleshooting)
- [Quick Diagnostics](#quick-diagnostics)
- [Connection Issues](#connection-issues)
- [Authentication Problems](#authentication-problems)
- [Database Issues](#database-issues)
- [Application Errors](#application-errors)
- [Performance Issues](#performance-issues)
- [File Upload Problems](#file-upload-problems)
- [Data Synchronization Issues](#data-synchronization-issues)
- [Backup & Recovery](#backup--recovery)
- [System Monitoring](#system-monitoring)
- [Emergency Procedures](#emergency-procedures)
- [Contact Support](#contact-support)

---

## Ikhtisar Troubleshooting

### Metodologi Troubleshooting

```
Problem Identification → Root Cause Analysis → Solution Implementation → Verification
        ↓                       ↓                        ↓              ↓
  Symptom Recognition    Log Analysis        Configuration Change   System Validation
  Error Messages       Metrics Review        Code/Fix Application   Functional Testing
  User Reports         Component Testing     Service Restart       Performance Check
```

### Level Prioritas

| Priority | Response Time | Examples |
|----------|---------------|----------|
| P0 - Critical | 15 minutes | System down, data breach, complete service failure |
| P1 - High | 1 hour | Major feature failure, significant performance degradation |
| P2 - Medium | 4 hours | Partial feature failure, moderate performance issues |
| P3 - Low | 24 hours | Minor bugs, usability issues, documentation updates |

### Escalation Path

1. **Self-Service**: Use this troubleshooting guide
2. **Local Support**: Center administrator or IT department
3. **Regional Support**: Regional technical support team
4. **National Support**: INAMSOS national support team
5. **Vendor Support**: External vendor escalation if needed

---

## Quick Diagnostics

### System Health Check

```bash
#!/bin/bash
# scripts/health-check.sh

echo "=== INAMSOS System Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Check application status
echo "🔍 Checking Application Status..."
if curl -f -s http://localhost:3000/health > /dev/null; then
    echo "✅ Application: Healthy"
else
    echo "❌ Application: Unhealthy"
fi

# Check database connectivity
echo "🔍 Checking Database..."
if docker exec inamsos_db_1 pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database: Connected"
else
    echo "❌ Database: Connection failed"
fi

# Check Redis
echo "🔍 Checking Redis..."
if docker exec inamsos_redis_1 redis-cli ping | grep -q PONG; then
    echo "✅ Redis: Connected"
else
    echo "❌ Redis: Connection failed"
fi

# Check disk space
echo "🔍 Checking Disk Space..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo "✅ Disk Space: ${DISK_USAGE}% used"
elif [ $DISK_USAGE -lt 90 ]; then
    echo "⚠️  Disk Space: ${DISK_USAGE}% used (Warning)"
else
    echo "❌ Disk Space: ${DISK_USAGE}% used (Critical)"
fi

# Check memory usage
echo "🔍 Checking Memory..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo "✅ Memory: ${MEMORY_USAGE}% used"
elif [ $MEMORY_USAGE -lt 90 ]; then
    echo "⚠️  Memory: ${MEMORY_USAGE}% used (Warning)"
else
    echo "❌ Memory: ${MEMORY_USAGE}% used (Critical)"
fi

echo ""
echo "=== Health Check Complete ==="
```

### Service Status Check

```bash
# Check all INAMSOS services
systemctl status inamsos-api
systemctl status inamsos-worker
systemctl status nginx
systemctl status postgresql
systemctl status redis

# Docker services check
docker-compose ps
docker service ls  # for swarm mode
kubectl get pods -n inamsos-prod  # for Kubernetes
```

### Log Quick Scan

```bash
# Recent application errors
tail -100 /opt/inamsos/logs/error.log | grep -i error

# Recent database errors
tail -100 /var/log/postgresql/postgresql-15-main.log | grep -i error

# Nginx errors
tail -100 /var/log/nginx/error.log

# System resource usage
top -b -n 1 | head -20
df -h
free -h
```

---

## Connection Issues

### Application Not Accessible

#### Symptom: Cannot access web application

**Diagnostic Steps:**

1. **Check Service Status**
```bash
# Check if application is running
curl -I http://localhost:3000
systemctl status inamsos-api
docker ps | grep inamsos
```

2. **Check Port Availability**
```bash
# Check if port is listening
netstat -tlnp | grep :3000
ss -tlnp | grep :3000

# Check if port is blocked by firewall
sudo ufw status
sudo iptables -L -n | grep 3000
```

3. **Check Load Balancer**
```bash
# Check HAProxy/Nginx status
systemctl status nginx
systemctl status haproxy

# Test load balancer configuration
curl -I http://api.inamsos.go.id/health
```

**Solutions:**

```bash
# Restart application service
sudo systemctl restart inamsos-api

# Restart Docker containers
docker-compose restart

# Restart Kubernetes pods
kubectl rollout restart deployment/inamsos-api -n inamsos-prod

# Check and restart load balancer
sudo systemctl restart nginx
sudo systemctl restart haproxy
```

#### Symptom: Slow connection timeouts

**Diagnostic Steps:**

1. **Check Network Latency**
```bash
# Ping latency
ping api.inamsos.go.id

# Trace route
traceroute api.inamsos.go.id

# Check DNS resolution
nslookup api.inamsos.go.id
dig api.inamsos.go.id
```

2. **Check Application Performance**
```bash
# Application response time
time curl http://localhost:3000/health

# Check database query performance
docker exec inamsos_db_1 psql -U postgres -d inamsos_prod -c "SELECT query_start, query, state FROM pg_stat_activity WHERE state = 'active';"
```

**Solutions:**

1. **Database Optimization**
```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill long-running queries if necessary
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query_start < now() - interval '5 minutes';
```

2. **Application Optimization**
```typescript
// Enable connection pooling
// npm run performance:analyze
```

### Database Connection Issues

#### Symptom: Cannot connect to database

**Diagnostic Steps:**

```bash
# Test database connection
docker exec -it inamsos_db_1 psql -U postgres -d inamsos_prod -c "SELECT 1;"

# Check database logs
docker logs inamsos_db_1 | tail -50

# Check database configuration
docker exec inamsos_db_1 cat /var/lib/postgresql/data/postgresql.conf | grep listen_addresses
```

**Common Issues and Solutions:**

1. **Connection Pool Exhausted**
```sql
-- Check current connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Increase max_connections in postgresql.conf
ALTER SYSTEM SET max_connections = 200;
SELECT pg_reload_conf();
```

2. **Database Disk Full**
```bash
# Check database disk usage
docker exec inamsos_db_1 du -sh /var/lib/postgresql/data

# Clean up old logs
docker exec inamsos_db_1 psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('inamsos_prod'));"

-- Vacuum and cleanup
docker exec inamsos_db_1 psql -U postgres -d inamsos_prod -c "VACUUM ANALYZE;"
```

3. **Wrong Credentials**
```bash
# Check database user permissions
docker exec inamsos_db_1 psql -U postgres -c "\du"

# Reset database password if needed
docker exec inamsos_db_1 psql -U postgres -c "ALTER USER inamsos_user PASSWORD 'new_password';"
```

---

## Authentication Problems

### Login Issues

#### Symptom: Cannot login with valid credentials

**Diagnostic Steps:**

1. **Check Authentication Service**
```bash
# Check auth service logs
docker logs inamsos-auth-service | tail -50

# Test authentication endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test"}'
```

2. **Check User Account Status**
```sql
-- Check if user exists and is active
SELECT id, email, is_active, is_email_verified, last_login_at
FROM system.users
WHERE email = 'user@example.com';

-- Check user roles
SELECT u.email, r.name as role_name, ur.is_active
FROM system.users u
JOIN system.user_roles ur ON u.id = ur.user_id
JOIN system.roles r ON ur.role_id = r.id
WHERE u.email = 'user@example.com';
```

**Solutions:**

1. **Reset User Password**
```bash
# Generate new password hash
docker exec -it inamsos-api npm run reset-password -- user@example.com
```

2. **Unlock User Account**
```sql
-- Reset failed login attempts
UPDATE system.users
SET failed_login_attempts = 0, locked_until = NULL
WHERE email = 'user@example.com';
```

3. **Verify Email**
```sql
-- Manually verify email if needed
UPDATE system.users
SET is_email_verified = true
WHERE email = 'user@example.com';
```

#### Symptom: MFA verification failing

**Diagnostic Steps:**

1. **Check MFA Configuration**
```sql
-- Check user MFA status
SELECT id, email, mfa_enabled, mfa_secret
FROM system.users
WHERE email = 'user@example.com';
```

2. **Test MFA Token Generation**
```typescript
// Verify MFA setup
const speakeasy = require('speakeasy');
const token = speakeasy.totp({
  secret: user.mfa_secret,
  encoding: 'base32',
  time: Math.floor(Date.now() / 1000)
});
```

**Solutions:**

1. **Regenerate MFA Secret**
```typescript
// Reset MFA for user
await this.mfaService.resetMfa(userId);
```

2. **Use Backup Codes**
```bash
# Provide user with backup codes
docker exec -it inamsos-api npm run generate-backup-codes -- user@example.com
```

### Session Issues

#### Symptom: Frequently logged out

**Diagnostic Steps:**

1. **Check Session Configuration**
```typescript
// Check JWT configuration
console.log({
  expiresIn: process.env.JWT_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
});
```

2. **Check Session Storage**
```bash
# Check Redis session storage
docker exec inamsos_redis_1 redis-cli keys "session:*"
docker exec inamsos_redis_1 redis-cli get "session:user_123"
```

**Solutions:**

1. **Adjust Session Timeout**
```typescript
// Increase session timeout in environment
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

2. **Clear Corrupted Sessions**
```bash
# Clear expired sessions
docker exec inamsos_redis_1 redis-cli --scan --pattern "session:*" | xargs docker exec -i inamsos_redis_1 redis-cli del
```

---

## Database Issues

### Performance Issues

#### Symptom: Slow database queries

**Diagnostic Steps:**

```sql
-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT query, mean_time, calls, total_time, stddev_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check current activity
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Check table sizes
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'medical'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions:**

1. **Create Missing Indexes**
```sql
-- Example: Create index for common queries
CREATE INDEX CONCURRENTLY idx_patients_center_name
ON medical.patients(center_id, name);

-- Example: Create partial index
CREATE INDEX CONCURRENTLY idx_active_patients
ON medical.patients(center_id, created_at)
WHERE is_active = true;
```

2. **Optimize Queries**
```sql
-- Use EXPLAIN ANALYZE to analyze query performance
EXPLAIN ANALYZE SELECT * FROM medical.patients
WHERE center_id = 'center_123' AND name LIKE '%john%';

-- Add appropriate indexes based on query analysis
```

3. **Update Statistics**
```sql
-- Update table statistics for better query planning
ANALYZE medical.patients;
ANALYZE medical.medical_records;
```

### Lock Issues

#### Symptom: Database locks causing delays

**Diagnostic Steps:**

```sql
-- Check for locks
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS current_statement_in_blocking_process,
       blocked_activity.application_name AS blocked_application
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

**Solutions:**

```sql
-- Kill blocking queries (use with caution)
SELECT pg_terminate_backend(blocking_pid);

-- Check for long-running transactions
SELECT pid, age(clock_timestamp(), xact_start), query
FROM pg_stat_activity
WHERE state != 'idle' AND xact_start IS NOT NULL
ORDER BY age DESC;
```

### Replication Issues

#### Symptom: Database replication lag

**Diagnostic Steps:**

```bash
# Check replication status
docker exec inamsos_db_slave_1 psql -U postgres -c "SELECT * FROM pg_stat_replication;"

# Check replication lag in bytes
SELECT pg_xlog_location_diff(pg_current_xlog_location(), replay_location) AS lag_bytes
FROM pg_stat_replication;

# Check WAL files
docker exec inamsos_db_master_1 psql -U postgres -c "SELECT * FROM pg_stat_wal;"
```

**Solutions:**

1. **Restart Replication**
```bash
# Restart replica
docker restart inamsos_db_slave_1

# Rebuild replica if needed
docker exec inamsos_db_slave_1 pg_basebackup -h inamsos_db_master_1 -D /var/lib/postgresql/data -U replicator -v -P -W
```

---

## Application Errors

### Application Crashes

#### Symptom: Application process terminates unexpectedly

**Diagnostic Steps:**

1. **Check Application Logs**
```bash
# Recent error logs
tail -100 /opt/inamsos/logs/error.log

# Application container logs
docker logs inamsos-api --tail=100

# System logs
journalctl -u inamsos-api -n 100
```

2. **Check System Resources**
```bash
# Memory usage
free -h
docker stats

# Disk space
df -h

# CPU usage
top
htop
```

3. **Check Configuration**
```bash
# Environment variables
env | grep INAMSOS

# Configuration files
cat /opt/inamsos/.env.production
```

**Common Causes and Solutions:**

1. **Out of Memory**
```yaml
# Increase memory limits in docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
```

2. **Database Connection Issues**
```bash
# Check database connectivity
docker exec inamsos_api_1 ping inamsos_db_1

# Restart with database recovery
docker-compose up -d --force-recreate
```

3. **File Permission Issues**
```bash
# Fix file permissions
sudo chown -R inamsos:inamsos /opt/inamsos
sudo chmod -R 755 /opt/inamsos/logs
sudo chmod -R 755 /opt/inamsos/uploads
```

### API Errors

#### Symptom: HTTP 500 Internal Server Error

**Diagnostic Steps:**

1. **Check API Logs**
```bash
# Check specific error
tail -f /opt/inamsos/logs/error.log | grep ERROR

# Check request logs
tail -f /opt/inamsos/logs/access.log
```

2. **Test API Endpoint**
```bash
# Test health endpoint
curl -v http://localhost:3000/health

# Test specific endpoint with debug
curl -v -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN"
```

**Common API Errors:**

1. **Database Connection Errors**
```typescript
// Check database connection pool status
@Injectable()
export class DatabaseHealthService {
  async checkConnection(): Promise<ConnectionStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'connected', timestamp: new Date() };
    } catch (error) {
      return { status: 'disconnected', error: error.message, timestamp: new Date() };
    }
  }
}
```

2. **Validation Errors**
```typescript
// Check DTO validation
import { ValidationError } from 'class-validator';

// Enable validation debug
process.env.DEBUG = 'class-validator';
```

3. **Timeout Errors**
```typescript
// Increase timeout in configuration
@nestjs/common
import { RequestTimeoutException } from '@nestjs/common';

// Set appropriate timeouts
```

---

## Performance Issues

### Slow Application Response

#### Symptom: Application responding slowly

**Diagnostic Steps:**

1. **Performance Profiling**
```bash
# Application performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/patients

# curl-format.txt
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

2. **Database Performance**
```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename = 'patients';
```

3. **Resource Usage**
```bash
# Check application resource usage
docker stats inamsos-api

# Check system load
uptime
iostat -x 1
sar -u 1 5
```

**Optimization Strategies:**

1. **Database Optimization**
```sql
-- Create composite indexes
CREATE INDEX CONCURRENTLY idx_patients_search_composite
ON medical.patients(center_id, is_active, created_at);

-- Analyze and vacuum
ANALYZE;
VACUUM ANALYZE;
```

2. **Application Caching**
```typescript
// Implement Redis caching
@Injectable()
export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

3. **Load Balancing**
```bash
# Check load balancer distribution
curl -H "X-Forwarded-For: 1.1.1.1" http://api.inamsos.go.id/health
curl -H "X-Forwarded-For: 1.1.1.2" http://api.inamsos.go.id/health
```

### Memory Issues

#### Symptom: High memory usage

**Diagnostic Steps:**

```bash
# Check memory usage by process
ps aux --sort=-%mem | head -10

# Check Node.js memory usage
docker exec inamsos_api_1 node --inspect=0.0.0.0:9229 app.js

# Check database memory
docker exec inamsos_db_1 psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('inamsos_prod'));"
```

**Solutions:**

1. **Increase Memory Limits**
```yaml
# docker-compose.yml
services:
  api:
    environment:
      - NODE_OPTIONS=--max-old-space-size=4096
    deploy:
      resources:
        limits:
          memory: 4G
```

2. **Optimize Memory Usage**
```typescript
// Implement memory cleanup
@Injectable()
export class MemoryOptimizationService {
  @Cron('0 */6 * * *') // Every 6 hours
  async cleanup() {
    // Clear expired sessions
    await this.sessionService.clearExpired();

    // Clear cache
    await this.cacheService.clearExpired();

    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
  }
}
```

---

## File Upload Problems

### Upload Failures

#### Symptom: Cannot upload files

**Diagnostic Steps:**

1. **Check File Storage**
```bash
# Check MinIO status
docker exec inamsos_minio_1 mc admin info local

# Check disk space for uploads
df -h /opt/inamsos/uploads

# Check file permissions
ls -la /opt/inamsos/uploads/
```

2. **Check Upload Configuration**
```typescript
// Check multer configuration
console.log({
  dest: './uploads',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});
```

**Common Issues and Solutions:**

1. **File Size Too Large**
```typescript
// Increase file size limit
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const uploadConfig = {
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5
  }
};
```

2. **Disk Space Full**
```bash
# Clean up old files
find /opt/inamsos/uploads -type f -mtime +30 -delete

# Compress old files
find /opt/inamsos/uploads -type f -mtime +7 -exec gzip {} \;
```

3. **Permission Issues**
```bash
# Fix upload directory permissions
sudo chown -R www-data:www-data /opt/inamsos/uploads
sudo chmod -R 755 /opt/inamsos/uploads
```

### File Access Issues

#### Symptom: Cannot access uploaded files

**Diagnostic Steps:**

1. **Check File URL Generation**
```typescript
// Verify file URL generation
const fileUrl = `https://files.inamsos.go.id/${filename}`;
console.log('File URL:', fileUrl);
```

2. **Check MinIO Configuration**
```bash
# Test MinIO access
docker exec inamsos_minio_1 mc ls local/inamsos-files/

# Check bucket policies
docker exec inamsos_minio_1 mc policy local/inamsos-files/
```

**Solutions:**

1. **Fix MinIO URL Configuration**
```typescript
// Correct MinIO endpoint configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});
```

---

## Data Synchronization Issues

### Center Data Sync Problems

#### Symptom: Data not syncing between centers

**Diagnostic Steps:**

1. **Check Network Connectivity**
```bash
# Test connectivity between centers
ping center2.inamsos.go.id
telnet center2.inamsos.go.id 5432

# Check firewall rules
sudo ufw status verbose
```

2. **Check Replication Status**
```sql
-- Check logical replication
SELECT * FROM pg_stat_subscription;
SELECT * FROM pg_stat_replication;

-- Check pending transactions
SELECT * FROM pg_replication_slots;
```

**Solutions:**

1. **Restart Replication**
```sql
-- Restart logical replication
ALTER SUBSCRIPTION inamsos_sub DISABLE;
ALTER SUBSCRIPTION inamsos_sub ENABLE;

-- Resynchronize if needed
ALTER SUBSCRIPTION inamsos_sub REFRESH PUBLICATION;
```

2. **Fix Network Issues**
```bash
# Restart networking
sudo systemctl restart networking

# Check DNS resolution
nslookup center2.inamsos.go.id
```

---

## Backup & Recovery

### Backup Failures

#### Symptom: Automated backups failing

**Diagnostic Steps:**

1. **Check Backup Logs**
```bash
# Check backup logs
tail -100 /opt/backups/backup.log

# Check cron jobs
sudo crontab -l
grep backup /var/log/cron.log
```

2. **Check Backup Script**
```bash
# Test backup script manually
sudo -u postgres /opt/backups/backup-daily.sh

# Check permissions
ls -la /opt/backups/
```

**Common Backup Issues:**

1. **Disk Space Insufficient**
```bash
# Clean up old backups
find /opt/backups -name "*.sql" -mtime +7 -delete

# Check backup size
du -sh /opt/backups/*
```

2. **Database Lock Issues**
```bash
# Check for locks during backup
SELECT pid, state, query FROM pg_stat_activity WHERE state != 'idle';

# Use non-blocking backup
pg_dump --no-owner --no-privileges inamsos_prod > backup.sql
```

### Recovery Procedures

#### Emergency Data Recovery

1. **Stop Application**
```bash
docker-compose down
systemctl stop inamsos-api
```

2. **Restore Database**
```bash
# Restore from latest backup
psql -U postgres -d inamsos_prod < /opt/backups/latest.sql

# Or use pg_restore for custom format
pg_restore -U postgres -d inamsos_prod /opt/backups/latest.dump
```

3. **Verify Data Integrity**
```sql
-- Check record counts
SELECT COUNT(*) FROM medical.patients;
SELECT COUNT(*) FROM medical.medical_records;

-- Check data consistency
SELECT p.id, COUNT(mr.id) as record_count
FROM medical.patients p
LEFT JOIN medical.medical_records mr ON p.id = mr.patient_id
GROUP BY p.id
HAVING COUNT(mr.id) = 0;
```

---

## System Monitoring

### Monitoring Setup Issues

#### Symptom: Monitoring data not appearing

**Diagnostic Steps:**

1. **Check Prometheus Configuration**
```bash
# Test Prometheus configuration
docker exec prometheus promtool check config /etc/prometheus/prometheus.yml

# Check targets
curl http://localhost:9090/api/v1/targets
```

2. **Check Metrics Endpoint**
```bash
# Test application metrics
curl http://localhost:3000/metrics

# Check node exporter
curl http://localhost:9100/metrics
```

**Solutions:**

1. **Fix Prometheus Configuration**
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'inamsos-api'
    static_configs:
      - targets: ['inamsos-api:3000']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

2. **Restart Monitoring Stack**
```bash
docker-compose restart prometheus grafana
systemctl restart prometheus grafana-server
```

---

## Emergency Procedures

### Complete System Outage

#### Emergency Response Steps

1. **Immediate Assessment (0-5 minutes)**
```bash
# Check system status
./scripts/emergency-check.sh

# Check all services
docker-compose ps
systemctl status --all
```

2. **Identify Root Cause (5-15 minutes)**
```bash
# Check recent changes
git log --oneline -10
systemctl list-units --failed
journalctl -p err -n 50
```

3. **Restore Critical Services (15-30 minutes)**
```bash
# Start with database
systemctl start postgresql

# Start application
docker-compose up -d

# Verify health
curl -f http://localhost:3000/health
```

4. **Communicate Status (Ongoing)**
```bash
# Update status page
curl -X POST https://status.inamsos.go.id/api/update \
  -d '{"status": "outage", "message": "Investigating issue"}'

# Notify team
curl -X POST https://hooks.slack.com/services/xxx \
  -d '{"text": "🚨 INAMSOS System Outage - Team mobilized"}'
```

### Data Breach Response

#### Immediate Actions

1. **Containment (0-15 minutes)**
```bash
# Isolate affected systems
sudo iptables -I INPUT -s <attacker_ip> -j DROP

# Enable enhanced logging
export LOG_LEVEL=debug

# Create forensic snapshot
docker export inamsos_db_1 > forensic-$(date +%Y%m%d).tar
```

2. **Assessment (15-60 minutes)**
```bash
# Check access logs
grep -i "breach\|hack\|attack" /var/log/nginx/access.log | tail -100

# Check database access
SELECT * FROM audit.audit_events
WHERE event_timestamp > NOW() - INTERVAL '1 hour'
  AND action LIKE '%ACCESS%';

# Check for data exfiltration
du -sh /opt/inamsos/uploads/
```

3. **Recovery (1-4 hours)**
```bash
# Force password reset
UPDATE system.users SET password_reset_required = true;

# Revoke all sessions
docker exec inamsos_redis_1 redis-cli flushall;

# Restore from backup if needed
psql -U postgres -d inamsos_prod < /opt/backups/pre-breach.sql
```

---

## Contact Support

### When to Contact Support

#### Critical Issues (Contact Immediately)
- System completely down
- Data breach suspected
- Data corruption detected
- Security compromise
- Multiple users affected

#### High Priority Issues (Contact within 1 hour)
- Major features not working
- Significant performance degradation
- Data synchronization failures
- Backup failures

#### Medium Priority Issues (Contact within 4 hours)
- Minor feature issues
- Performance optimization needs
- Configuration assistance
- User training requests

### Support Channels

#### 24/7 Emergency Support
```
📞 Phone: (021) 12345678 ext. 999
📧 Email: emergency@inamsos.go.id
💬 Slack: #inamsos-emergency
🌐 Web: https://emergency.inamsos.go.id
```

#### Business Hours Support
```
📞 Phone: (021) 12345678 ext. 888
📧 Email: support@inamsos.go.id
💬 Chat: https://help.inamsos.go.id
🎫 Ticket: https://tickets.inamsos.go.id
```

### Information Required for Support

When contacting support, please provide:

1. **Basic Information**
   - Your name and institution
   - Contact information
   - Priority level (P0-P3)

2. **Problem Description**
   - Detailed description of the issue
   - Steps to reproduce the problem
   - Expected vs actual behavior

3. **System Information**
   - Browser and version
   - Operating system
   - Error messages (screenshots preferred)
   - Time issue occurred

4. **Context Information**
   - What you were trying to do
   - Recent changes or updates
   - Number of affected users
   - Business impact

### Self-Service Resources

#### Knowledge Base
- 📚 [Complete Documentation](https://docs.inamsos.go.id)
- 🔍 [Searchable FAQ](https://kb.inamsos.go.id)
- 🎥 [Video Tutorials](https://tutorials.inamsos.go.id)
- 📋 [Troubleshooting Guides](https://troubleshoot.inamsos.go.id)

#### Community Support
- 💬 [User Forums](https://community.inamsos.go.id)
- 🐛 [Bug Reports](https://github.com/inamsos/issues)
- 💡 [Feature Requests](https://features.inamsos.go.id)
- 📢 [Announcements](https://announcements.inamsos.go.id)

### Escalation Process

```
Level 1: Self-Service & Community
    ↓ (15 minutes)
Level 2: Local IT Support
    ↓ (1 hour)
Level 3: Regional Technical Support
    ↓ (4 hours)
Level 4: National Engineering Team
    ↓ (24 hours)
Level 5: Vendor/External Support
```

### Service Level Agreement (SLA)

| Priority | Response Time | Resolution Target | Availability |
|----------|---------------|-------------------|--------------|
| P0 - Critical | 15 minutes | 2 hours | 99.9% |
| P1 - High | 1 hour | 8 hours | 99.5% |
| P2 - Medium | 4 hours | 24 hours | 98% |
| P3 - Low | 24 hours | 72 hours | 95% |

---

## Quick Reference

### Common Commands

```bash
# System Status
./scripts/health-check.sh
docker-compose ps
systemctl status

# Logs
tail -f /opt/inamsos/logs/error.log
docker logs inamsos-api --follow
journalctl -u inamsos-api -f

# Database
docker exec -it inamsos_db_1 psql -U postgres -d inamsos_prod
docker exec inamsos_db_1 pg_dump inamsos_prod > backup.sql

# Cache
docker exec inamsos_redis_1 redis-cli ping
docker exec inamsos_redis_1 redis-cli flushall

# Application
docker-compose restart
npm run build
npm run start:prod
```

### Critical File Locations

```
Application: /opt/inamsos/
Logs: /opt/inamsos/logs/
Uploads: /opt/inamsos/uploads/
Config: /opt/inamsos/.env.production
Database: /var/lib/postgresql/data/
Backups: /opt/backups/inamsos/
Nginx: /etc/nginx/sites-available/
SSL: /etc/ssl/certs/inamsos/
```

### Emergency Contacts

```
Critical System Failure:
📞 0811-1234-567 (Emergency Hotline)
📧 emergency@inamsos.go.id

Data Breach:
📞 0811-9999-888 (Security Hotline)
📧 security@inamsos.go.id

Technical Support:
📞 (021) 12345678 ext. 888
📧 support@inamsos.go.id

Business Hours: Senin - Jumat, 08:00 - 17:00 WIB
Emergency: 24/7 untuk critical issues
```

---

**© 2025 INAMSOS - Support Team**
*Last Updated: November 19, 2025*
*Version: 1.0*

For the most current information, visit: https://support.inamsos.go.id