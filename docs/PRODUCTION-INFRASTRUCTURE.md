# INAMSOS Production Infrastructure Documentation

## Overview

This document outlines the complete production infrastructure for the Indonesia National Cancer Database System (INAMSOS), providing enterprise-grade reliability, security, and performance for Indonesia's national cancer registry.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
              ┌───────▼────────┐
              │  Nginx (SSL)   │  ← SSL Termination, Load Balancing
              │  Port: 80/443  │
              └───────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼────────┐┌───▼────────┐┌───▼────────┐
│   Frontend     ││  Backend   ││  Monitoring│
│   (Next.js)    ││  (NestJS)  ││ (Grafana)  │
│   Port: 3000   ││  Port: 3001││ Port: 3001 │
└───────────────┘└──────┬─────┘└────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼────────┐┌───▼────────┐┌───▼────────┐
│ PostgreSQL     ││   Redis    ││  MinIO     │
│   Database     ││    Cache   ││  Storage   │
│   Port: 5432   ││ Port: 6379 ││ Port: 9000 │
└────────────────┘└────────────┘└────────────┘
```

### Network Segmentation

The infrastructure is segmented into multiple networks for security:

- **inamos-frontend** (172.21.0.0/24): Frontend services
- **inamos-backend** (172.22.0.0/24): Backend API services
- **inamos-database** (172.23.0.0/24): Database services
- **inamos-cache** (172.24.0.0/24): Cache services
- **inamos-storage** (172.25.0.0/24): Storage services
- **inamos-monitoring** (172.26.0.0/24): Monitoring services

## Components

### 1. Web Server (Nginx)

**Purpose**: Reverse proxy, SSL termination, load balancing

**Configuration**:
- SSL/TLS with modern ciphers
- HTTP/2 support
- Rate limiting
- Security headers
- Static file serving

**Files**:
- `/nginx/nginx.conf` - Main configuration
- `/nginx/conf.d/inamsos.conf` - Site configuration

**Monitoring**: Nginx Exporter (Port 9113)

### 2. Frontend Application (Next.js)

**Purpose**: User interface for the cancer registry

**Configuration**:
- Production optimized builds
- Server-side rendering
- Static asset optimization
- Security headers

**Docker Image**: `inamos-frontend:${VERSION}`

**Health Check**: `GET /health`

### 3. Backend Application (NestJS)

**Purpose**: API server for business logic and data management

**Configuration**:
- TypeScript compilation
- Environment-specific configurations
- Security middleware
- API documentation (Swagger)

**Docker Image**: `inamos-backend:${VERSION}`

**Health Check**: `GET /health`

**Metrics**: Port 9464

### 4. Database (PostgreSQL)

**Purpose**: Primary data storage for patient records, cancer cases, and system data

**Configuration**:
- PostgreSQL 15
- Optimized settings for production
- WAL archiving for point-in-time recovery
- Connection pooling

**Data Directory**: `/data/inamsos/postgres`

**Backup Strategy**: Automated daily, weekly, and monthly backups

**Monitoring**: PostgreSQL Exporter (Port 9187)

### 5. Cache (Redis)

**Purpose**: Session storage, caching, and queue management

**Configuration**:
- Redis 7
- Persistence enabled
- Memory optimization
- Security enabled

**Data Directory**: `/data/inamosos/redis`

**Monitoring**: Redis Exporter (Port 9121)

### 6. Object Storage (MinIO)

**Purpose**: File storage for documents, images, and reports

**Configuration**:
- S3-compatible API
- Replication enabled
- Encryption at rest
- Lifecycle management

**Data Directory**: `/data/inamsos/minio`

**Monitoring**: MinIO metrics endpoint

### 7. Monitoring Stack

#### Prometheus
**Purpose**: Metrics collection and alerting

**Configuration**:
- Data retention: 200 hours
- Recording rules
- Alerting rules
- Multi-target scraping

**Port**: 9090
**Data Directory**: `/data/inamsos/prometheus`

#### Grafana
**Purpose**: Visualization and dashboards

**Configuration**:
- Custom dashboards for INAMSOS
- Alert integration
- User authentication

**Port**: 3000 (on monitoring subdomain)
**Data Directory**: `/data/inamosos/grafana`

#### AlertManager
**Purpose**: Alert routing and notification

**Configuration**:
- Multiple notification channels
- Alert grouping
- Escalation policies

**Port**: 9093

## Security Implementation

### 1. SSL/TLS Configuration

- **Certificates**: Let's Encrypt with automatic renewal
- **Ciphers**: Modern TLS 1.2/1.3 ciphers only
- **Headers**: HSTS, CSP, and other security headers
- **Forward Secrecy**: Enabled

### 2. Network Security

- **Firewall**: iptables/ufw rules
- **Network Segmentation**: Isolated Docker networks
- **IP Whitelisting**: Admin interfaces restricted
- **DDoS Protection**: Rate limiting at multiple levels

### 3. Application Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **Security Headers**: OWASP recommended headers

### 4. Container Security

- **Non-root users**: All containers run as non-root
- **Minimal Images**: Alpine-based minimal containers
- **Security Scanning**: Automated vulnerability scanning
- **Resource Limits**: CPU and memory limits enforced

### 5. Data Security

- **Encryption**: Data encrypted at rest and in transit
- **Backup Encryption**: Encrypted backup archives
- **Access Control**: Database access restricted
- **Audit Logging**: Comprehensive audit trails

## Monitoring and Alerting

### 1. Metrics Collection

**Application Metrics**:
- Request rate and response time
- Error rates by endpoint
- Database connection pool usage
- Cache hit rates
- Business metrics (patient registrations, etc.)

**Infrastructure Metrics**:
- CPU, memory, disk usage
- Network I/O and bandwidth
- Docker container health
- Service availability

**Security Metrics**:
- Failed login attempts
- Suspicious request patterns
- SSL certificate expiry
- Security events

### 2. Alerting Rules

**Critical Alerts** (Immediate notification):
- Service downtime
- Database connection failure
- SSL certificate expiry
- Security breach detection
- High error rates

**Warning Alerts** (Within 1 hour):
- High resource usage
- Performance degradation
- Backup failures
- Configuration changes

### 3. Dashboards

**System Overview Dashboard**:
- Service health status
- Resource utilization
- Request/response metrics
- Error rates

**Application Dashboard**:
- Business metrics
- User activity
- Data entry statistics
- Performance metrics

**Infrastructure Dashboard**:
- Container status
- Resource usage trends
- Network performance
- Storage utilization

## Backup and Disaster Recovery

### 1. Database Backup Strategy

**Automated Backups**:
- **Daily**: Full compressed backups
- **Weekly**: Full backup with verification
- **Monthly**: Archive backup for long-term retention
- **Real-time**: WAL archiving for point-in-time recovery

**Backup Storage**:
- **Local**: Encrypted local storage
- **Cloud**: S3-compatible cloud storage
- **Retention**: 30 days daily, 12 weeks weekly, 12 months monthly

### 2. Disaster Recovery Procedures

**Recovery Time Objective (RTO)**: 4 hours
**Recovery Point Objective (RPO)**: 15 minutes

**Recovery Scenarios**:
1. **Service Recovery**: Restart failed services
2. **Database Recovery**: Restore from backup
3. **Full System Recovery**: Complete infrastructure restore
4. **Site Recovery**: Disaster recovery site activation

### 3. Testing Procedures

- **Weekly**: Backup verification
- **Monthly**: Restore testing
- **Quarterly**: Full disaster recovery drill
- **Annual**: Complete disaster recovery test

## Deployment Procedures

### 1. Zero-Downtime Deployment

**Process**:
1. Build new Docker images
2. Update backend services first
3. Verify backend health
4. Update frontend services
5. Update supporting services
6. Verify overall system health

**Rollback Capability**:
- Automatic rollback on failure
- Manual rollback procedures
- Service state preservation
- Data integrity validation

### 2. Environment Management

**Production Environment**:
- Isolated production infrastructure
- Production-specific configurations
- Production monitoring
- Production data

**Staging Environment**:
- Production-like configuration
- Test data only
- Pre-deployment validation
- Performance testing

### 3. Configuration Management

**Environment Variables**:
- Sensitive data in environment files
- Configuration validation
- Secure secret management
- Audit trail of changes

## Maintenance Procedures

### 1. Regular Maintenance

**Daily**:
- Backup verification
- Security log review
- Performance monitoring
- Health check validation

**Weekly**:
- Security scanning
- Update management
- Performance tuning
- Capacity planning review

**Monthly**:
- Full system health check
- Security audit
- Documentation updates
- Training and procedures review

### 2. Update Procedures

**Security Updates**:
- Immediate patching for critical vulnerabilities
- Scheduled maintenance for other updates
- Update testing in staging
- Rollback planning

**Application Updates**:
- Zero-downtime deployment
- Database migrations
- Feature flag management
- User communication

### 3. Capacity Planning

**Monitoring Metrics**:
- Resource utilization trends
- Performance degradation indicators
- Storage growth projections
- User growth patterns

**Scaling Procedures**:
- Horizontal scaling for stateless services
- Vertical scaling for database
- Storage expansion planning
- Performance optimization

## Compliance and Regulations

### 1. Healthcare Data Compliance

**Indonesian Healthcare Regulations**:
- Personal Health Data Protection
- Medical Record Confidentiality
- Data Localization Requirements
- Audit Trail Requirements

**Security Standards**:
- ISO 27001 Information Security
- OWASP Top 10 compliance
- Healthcare security best practices
- Data encryption standards

### 2. Data Governance

**Data Classification**:
- Public data
- Internal data
- Confidential data
- Restricted data

**Access Control**:
- Role-based access control
- Principle of least privilege
- Access review procedures
- Audit logging

### 3. Audit Requirements

**Logging**:
- Complete audit trail
- Tamper-evident logs
- Log retention policies
- Access logging

**Reporting**:
- Security incident reporting
- Compliance reporting
- Performance reporting
- Audit reports

## Emergency Procedures

### 1. Security Incident Response

**Detection**:
- Automated monitoring alerts
- Security scanning results
- User reports
- External notifications

**Response**:
- Incident classification
- Containment procedures
- Eradication activities
- Recovery operations

**Communication**:
- Internal notification
- External reporting
- User communication
- Stakeholder updates

### 2. System Outage Response

**Detection**:
- Health monitoring alerts
- User reports
- External monitoring
- Automated checks

**Response**:
- Impact assessment
- Service restoration
- Root cause analysis
- Prevention measures

### 3. Data Breach Response

**Immediate Actions**:
- Contain the breach
- Preserve evidence
- Notify stakeholders
- Engage security team

**Follow-up Actions**:
- Investigation
- Remediation
- Communication
- Prevention

## Contact Information

### 1. Emergency Contacts

**Technical Team**:
- System Administrator: [Contact]
- Database Administrator: [Contact]
- Security Officer: [Contact]
- Application Support: [Contact]

**Management**:
- Project Manager: [Contact]
- IT Director: [Contact]
- Security Director: [Contact]

### 2. Service Providers

**Infrastructure**:
- Hosting Provider: [Provider]
- DNS Provider: [Provider]
- Certificate Authority: Let's Encrypt
- Cloud Storage: [Provider]

**Support**:
- 24/7 Support: [Contact]
- Emergency Support: [Contact]
- Vendor Support: [Contacts]

## Documentation

### 1. Related Documents

- **Deployment Guide**: Step-by-step deployment procedures
- **Security Guide**: Security best practices and procedures
- **Backup Guide**: Backup and restore procedures
- **Monitoring Guide**: Monitoring configuration and procedures
- **Troubleshooting Guide**: Common issues and solutions

### 2. Runbooks

- **Service Restart**: How to restart individual services
- **Database Recovery**: Step-by-step database restore
- **Security Incident**: Security incident response procedures
- **Performance Issues**: Performance troubleshooting procedures
- **Backup Restore**: Backup restore procedures

### 3. Training Materials

- **System Overview**: High-level system introduction
- **Security Training**: Security awareness and procedures
- **Emergency Procedures**: Emergency response training
- **User Training**: End-user system training

---

**Document Version**: 1.0
**Last Updated**: $(date +%Y-%m-%d)
**Next Review**: $(date -d "+6 months" +%Y-%m-%d)
**Approved By**: Security Team

This document is part of the INAMSOS production infrastructure documentation and should be reviewed and updated regularly to reflect changes in the system architecture, security procedures, and operational requirements.