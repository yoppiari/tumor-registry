# Panduan Keamanan INAMSOS

**Indonesia National Cancer Database System - Security Configuration & Best Practices**

[![Security Level](https://img.shields.io/badge/security_level-Critical-red.svg)](https://security.inamsos.go.id)
[![Compliance](https://img.shields.io/badge/compliance-HIPAA%20%7C%20ISO%2027001-blue.svg)](https://compliance.inamsos.go.id)
[![Audit](https://img.shields.io/badge/audit-Ready-green.svg)](https://audit.inamsos.go.id)

## Daftar Isi

- [Ikhtisar Keamanan](#ikhtisar-keamanan)
- [Arsitektur Keamanan](#arsitektur-keamanan)
- [Konfigurasi Authentication](#konfigurasi-authentication)
- [Setup SSL/TLS](#setup-ssltls)
- [Database Security](#database-security)
- [Network Security](#network-security)
- [Application Security](#application-security)
- [Audit & Monitoring](#audit--monitoring)
- [Compliance Requirements](#compliance-requirements)
- [Security Best Practices](#security-best-practices)
- [Incident Response](#incident-response)
- [Security Testing](#security-testing)

---

## Ikhtisar Keamanan

INAMSOS mengimplementasikan keamanan berlapis (defense-in-depth) untuk melindungi data kanker pasien yang sangat sensitif. Sistem ini dirancang untuk memenuhi standar keamanan kesehatan internasional dan regulasi Indonesia.

### Level Keamanan

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│  Network Security     │  Firewall, DDoS Protection, IDS/IPS  │
│  Application Security│  Input Validation, Secure Headers    │
│  Data Security        │  Encryption, Anonymization, Access  │
│  Infrastructure       │  Hardened Servers, Monitoring       │
│  Physical Security    │  Data Center Access Control         │
└─────────────────────────────────────────────────────────────┘
```

### Security Principles

- **Confidentiality**: Data hanya dapat diakses oleh authorized users
- **Integrity**: Data tidak dapat diubah tanpa authorization
- **Availability**: System tersedia 24/7 untuk operations
- **Accountability**: Semua actions tercatat dan dapat ditelusuri
- **Privacy**: Patient data dilindungi sesuai regulasi

---

## Arsitektur Keamanan

### Component Security Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   WAF Gateway   │    │   API Gateway   │
│   (SSL/TLS)     │◄──►│   (Rate Limit)  │◄──►│   (Auth Check)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │ Network │            │ App     │            │ Data    │
    │ Firewall│            │ Security│            │ Encryption│
    └─────────┘            └─────────┘            └─────────┘
```

### Data Flow Security

1. **Client Request** → HTTPS/TLS 1.3 encryption
2. **WAF Filter** → OWASP Top 10 protection
3. **API Gateway** → JWT authentication
4. **Application** → Role-based authorization
5. **Database** → Encrypted storage
6. **Audit Log** → Immutable logging

---

## Konfigurasi Authentication

### Multi-Factor Authentication (MFA)

#### Setup TOTP (Time-based One-Time Password)

```bash
# Install dependencies
npm install speakeasy qrcode @types/speakeasy

# Environment variables
MFA_ISSUER=INAMSOS
MFA_WINDOW=1
MFA_DIGITS=6
```

#### Enable MFA for Users

```typescript
// src/modules/auth/mfa.service.ts
import * as speakeasy from 'speakeasy';

export class MfaService {
  generateSecret(userId: string) {
    const secret = speakeasy.generateSecret({
      name: `INAMSOS:${userId}`,
      issuer: process.env.MFA_ISSUER,
      length: 32
    });

    return {
      secret: secret.base32,
      qrCode: this.generateQRCode(secret.otpauth_url)
    };
  }

  verifyToken(userId: string, token: string): boolean {
    const userSecret = this.getUserSecret(userId);
    return speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: token,
      window: parseInt(process.env.MFA_WINDOW) || 1
    });
  }
}
```

#### Backup Codes Generation

```typescript
generateBackupCodes(userId: string): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }

  // Hash and store backup codes
  this.storeBackupCodes(userId, codes.map(code => bcrypt.hash(code, 10)));

  return codes;
}
```

### JWT Configuration

#### Production JWT Settings

```typescript
// src/config/jwt.config.ts
export const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
    algorithm: 'HS256'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
  },
  issuer: 'INAMSOS',
  audience: 'inamsos-users'
};
```

#### Token Rotation

```typescript
// src/modules/auth/token.service.ts
export class TokenService {
  async rotateTokens(refreshToken: string) {
    // Validate current refresh token
    const payload = jwt.verify(refreshToken, jwtConfig.refreshToken.secret);

    // Invalidate old tokens
    await this.invalidateUserTokens(payload.sub);

    // Generate new token pair
    return await this.generateTokenPair(payload.sub);
  }
}
```

### Session Management

```typescript
// src/modules/auth/session.service.ts
export class SessionService {
  async createSession(userId: string, deviceInfo: any) {
    const session = {
      id: uuid(),
      userId,
      deviceInfo,
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    await this.sessionRepository.create(session);
    return session;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session || !session.isActive) return false;

    // Update last activity
    await this.sessionRepository.update(sessionId, {
      lastActivity: new Date()
    });

    return true;
  }
}
```

---

## Setup SSL/TLS

### SSL Certificate Configuration

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/inamsos
server {
    listen 443 ssl http2;
    server_name api.inamsos.go.id;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/inamsos.crt;
    ssl_certificate_key /etc/ssl/private/inamsos.key;

    # Modern SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.inamsos.go.id;
    return 301 https://$server_name$request_uri;
}
```

#### Application SSL Setup

```typescript
// src/main.ts
import * as https from 'https';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('./ssl/private.key'),
      cert: fs.readFileSync('./ssl/certificate.crt'),
      ca: fs.readFileSync('./ssl/ca_bundle.crt')
    }
  });

  // Enable CORS for secure origins
  app.enableCors({
    origin: ['https://app.inamsos.go.id'],
    credentials: true
  });

  await app.listen(3000);
}
```

### Certificate Management

#### Automated Certificate Renewal

```bash
#!/bin/bash
# scripts/renew-ssl.sh

# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d api.inamsos.go.id -d www.inamsos.go.id

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Certificate Monitoring

```typescript
// src/modules/monitoring/ssl.service.ts
export class SslService {
  async checkCertificateExpiry() {
    const cert = await this.getCertificateInfo();
    const daysUntilExpiry = this.calculateDaysUntilExpiry(cert.notAfter);

    if (daysUntilExpiry < 30) {
      await this.alertTeam({
        type: 'SSL_EXPIRY_WARNING',
        message: `Certificate expires in ${daysUntilExpiry} days`,
        severity: 'HIGH'
      });
    }
  }
}
```

---

## Database Security

### Database Encryption

#### Column-Level Encryption

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Patient sensitive data encryption
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  nik_encrypted BYTEA, -- Encrypted NIK
  phone_encrypted BYTEA, -- Encrypted phone
  email_encrypted BYTEA, -- Encrypted email
  birth_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Encryption functions
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(data BYTEA)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql;
```

#### Application-Level Encryption

```typescript
// src/modules/encryption/encryption.service.ts
import { createCipher, createDecipher } from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey = process.env.ENCRYPTION_KEY;

  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('INAMSOS-DATA'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    };
  }

  decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = createDecipher(this.algorithm, this.secretKey);
    decipher.setAAD(Buffer.from('INAMSOS-DATA'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

### Database Access Control

```sql
-- Role-based database access
CREATE ROLE data_entry_role;
CREATE ROLE researcher_role;
CREATE ROLE admin_role;

-- Grant specific permissions
GRANT SELECT, INSERT ON medical.patients TO data_entry_role;
GRANT SELECT ON medical.patients TO researcher_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA medical TO admin_role;

-- Row Level Security (RLS)
ALTER TABLE medical.patients ENABLE ROW LEVEL SECURITY;

-- Policy for data entry users (only their center's data)
CREATE POLICY center_isolation ON medical.patients
    FOR ALL
    TO data_entry_role
    USING (center_id = current_setting('app.current_center_id'));

-- Policy for researchers (anonymized data only)
CREATE POLICY researcher_access ON medical.patients
    FOR SELECT
    TO researcher_role
    USING (created_at < NOW() - INTERVAL '2 years');
```

### Database Connection Security

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // SSL Configuration
  sslmode  = "require"
  cert     = env("DB_SSL_CERT")
  key      = env("DB_SSL_KEY")
  ca       = env("DB_SSL_CA")
}

// Connection pool configuration
// .env
DATABASE_URL="postgresql://user:password@localhost:5432/inamsos?sslmode=require&connection_limit=20&pool_timeout=20"
```

---

## Network Security

### Firewall Configuration

#### UFW (Uncomplicated Firewall) Setup

```bash
#!/bin/bash
# scripts/setup-firewall.sh

# Reset firewall
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (restricted to admin IPs)
sudo ufw allow from 203.0.113.0/24 to any port 22
sudo ufw allow from 198.51.100.0/24 to any port 22

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application server (restricted)
sudo ufw allow from 10.0.0.0/8 to any port 3000
sudo ufw allow from 172.16.0.0/12 to any port 3000

# Allow database (restricted to application servers)
sudo ufw allow from 10.0.1.0/24 to any port 5432

# Enable firewall
sudo ufw enable

# Show status
sudo ufw status verbose
```

#### Advanced Firewall with iptables

```bash
#!/bin/bash
# scripts/iptables-setup.sh

# Clear existing rules
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t nat -X

# Default policies
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow established connections
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Rate limiting
sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --set
sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# SSH (restricted)
sudo iptables -A INPUT -p tcp -s 203.0.113.0/24 --dport 22 -j ACCEPT

# HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Application (restricted)
sudo iptables -A INPUT -p tcp -s 10.0.0.0/8 --dport 3000 -j ACCEPT

# Log and drop
sudo iptables -A INPUT -j LOG --log-prefix "DROPPED: "
sudo iptables -A INPUT -j DROP

# Save rules
sudo iptables-save > /etc/iptables/rules.v4
```

### DDoS Protection

#### Nginx Rate Limiting

```nginx
# /etc/nginx/nginx.conf

# Rate limiting for API
http {
    # Limit requests per IP
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    # Burst protection
    limit_req_zone $binary_remote_addr zone=burst:10m rate=100r/s;
}

server {
    # Apply to authentication endpoints
    location /auth/ {
        limit_req zone=auth burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }

    # Apply to general API
    location /api/ {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://localhost:3000;
    }

    # Global burst protection
    location / {
        limit_req zone=burst burst=200 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

#### Application-Level DDoS Protection

```typescript
// src/modules/security/ddos.guard.ts
@Injectable()
export class DdosGuard implements CanActivate {
  private readonly requests = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIP = request.ip;
    const now = Date.now();

    // Clean old requests
    this.cleanOldRequests(clientIP, now);

    // Check rate limit
    if (this.isRateLimited(clientIP, now)) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Record request
    this.recordRequest(clientIP, now);

    return true;
  }

  private cleanOldRequests(clientIP: string, now: number) {
    const requests = this.requests.get(clientIP) || [];
    const oneMinuteAgo = now - 60000;

    const recentRequests = requests.filter(time => time > oneMinuteAgo);
    this.requests.set(clientIP, recentRequests);
  }
}
```

---

## Application Security

### Input Validation & Sanitization

```typescript
// src/common/pipes/validation.pipe.ts
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    // Sanitize string inputs
    if (typeof value === 'string') {
      value = this.sanitizeString(value);
    }

    // Validate objects recursively
    if (typeof value === 'object' && value !== null) {
      value = this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  private sanitizeObject(obj: any): any {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
```

### SQL Injection Prevention

```typescript
// Using Prisma ORM (built-in protection)
export class PatientsService {
  async findPatients(search: string): Promise<Patient[]> {
    // Safe: Prisma parameterized queries
    return this.prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { medicalRecordNumber: { contains: search } }
        ]
      }
    });
  }
}

// Manual SQL with parameter binding
export class ReportsService {
  async generateReport(filters: any): Promise<any> {
    const query = `
      SELECT COUNT(*) as count, cancer_type
      FROM medical_records
      WHERE record_date BETWEEN $1 AND $2
      AND center_id = $3
      GROUP BY cancer_type
    `;

    return this.database.query(query, [
      filters.startDate,
      filters.endDate,
      filters.centerId
    ]);
  }
}
```

### XSS Protection

```typescript
// src/common/decorators/sanitize.decorator.ts
export function Sanitize() {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const sanitizedArgs = args.map(arg => {
        if (typeof arg === 'string') {
          return require('sanitize-html')(arg, {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
        return arg;
      });

      return method.apply(this, sanitizedArgs);
    };
  };
}

// Usage
@Post('patients')
@Sanitize()
async createPatient(@Body() createPatientDto: CreatePatientDto) {
  return this.patientsService.create(createPatientDto);
}
```

### CSRF Protection

```typescript
// src/modules/security/csrf.guard.ts
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Skip for GET requests
    if (request.method === 'GET') return true;

    const token = request.headers['x-csrf-token'];
    const sessionToken = request.session?.csrfToken;

    if (!token || token !== sessionToken) {
      throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}

// CSRF token generation
@Injectable()
export class CsrfService {
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }
}
```

---

## Audit & Monitoring

### Comprehensive Audit Logging

```typescript
// src/modules/audit/audit.service.ts
@Injectable()
export class AuditService {
  async logEvent(event: AuditEventDto) {
    const auditLog = {
      id: uuid(),
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      timestamp: new Date(),
      oldValues: event.oldValues,
      newValues: event.newValues,
      success: event.success,
      errorMessage: event.errorMessage
    };

    // Store in database
    await this.auditRepository.create(auditLog);

    // Send to SIEM system
    await this.sendToSIEM(auditLog);

    // Critical actions get immediate notification
    if (this.isCriticalAction(event.action)) {
      await this.notifySecurityTeam(auditLog);
    }
  }

  private isCriticalAction(action: string): boolean {
    const criticalActions = [
      'USER_DELETE',
      'PATIENT_DELETE',
      'ROLE_ASSIGN',
      'PERMISSION_CHANGE',
      'DATA_EXPORT',
      'MASS_UPDATE'
    ];

    return criticalActions.includes(action);
  }
}
```

### Security Monitoring

```typescript
// src/modules/monitoring/security.service.ts
@Injectable()
export class SecurityService {
  async detectAnomalies() {
    const anomalies = await Promise.all([
      this.detectUnusualLoginPatterns(),
      this.detectDataAccessAnomalies(),
      this.detectPrivilegeEscalation(),
      this.detectDataExfiltration()
    ]);

    const criticalAnomalies = anomalies.flat().filter(a => a.severity === 'CRITICAL');

    if (criticalAnomalies.length > 0) {
      await this.alertSecurityTeam(criticalAnomalies);
    }
  }

  private async detectUnusualLoginPatterns() {
    // Detect logins from unusual locations
    const unusualLogins = await this.auditRepository.find({
      where: {
        action: 'USER_LOGIN',
        timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      include: { user: true }
    });

    return unusualLogins.filter(login =>
      this.isUnusualLocation(login.ipAddress, login.user.usualLocations)
    );
  }
}
```

### Real-time Alerting

```typescript
// src/modules/alerts/alert.service.ts
@Injectable()
export class AlertService {
  async sendSecurityAlert(alert: SecurityAlertDto) {
    const message = {
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      timestamp: new Date(),
      source: 'INAMSOS',
      details: alert.details
    };

    // Send to multiple channels
    await Promise.all([
      this.sendEmailAlert(message),
      this.sendSmsAlert(message),
      this.sendSlackAlert(message),
      this.createJiraTicket(message),
      this.updateSecurityDashboard(message)
    ]);
  }

  private async sendEmailAlert(message: any) {
    await this.emailService.send({
      to: 'security@inamsos.go.id',
      subject: `[SECURITY ALERT] ${message.title}`,
      template: 'security-alert',
      data: message
    });
  }
}
```

---

## Compliance Requirements

### HIPAA Compliance Checklist

#### Administrative Safeguards
- ✅ **Security Officer**: Appointed HIPAA Security Officer
- ✅ **Workforce Training**: Regular security awareness training
- ✅ **Access Management**: Formal access control procedures
- ✅ **Audit Controls**: Comprehensive audit logging
- ✅ **Security Incident Procedures**: Incident response plan

#### Physical Safeguards
- ✅ **Facility Access**: Controlled access to data centers
- ✅ **Workstation Security**: Secure workstation policies
- ✅ **Device Controls**: Mobile device management
- ✅ **Media Disposal**: Secure data disposal procedures

#### Technical Safeguards
- ✅ **Access Control**: Unique user authentication
- ✅ **Audit Controls**: Implementation complete
- ✅ **Integrity Controls**: Data integrity mechanisms
- ✅ **Transmission Security**: End-to-end encryption

### Indonesian Data Protection

#### Personal Data Protection Act Compliance

```typescript
// src/modules/consent/consent.service.ts
@Injectable()
export class ConsentService {
  async recordConsent(consent: ConsentDto) {
    const consentRecord = {
      id: uuid(),
      patientId: consent.patientId,
      consentType: consent.consentType,
      purpose: consent.purpose,
      dataCategories: consent.dataCategories,
      retentionPeriod: consent.retentionPeriod,
      withdrawalRights: true,
      givenAt: new Date(),
      ipAddress: consent.ipAddress,
      userAgent: consent.userAgent,
      version: '1.0'
    };

    await this.consentRepository.create(consentRecord);

    // Send confirmation to patient
    await this.sendConsentConfirmation(consentRecord);
  }

  async withdrawConsent(consentId: string, reason: string) {
    const consent = await this.consentRepository.findById(consentId);

    consent.withdrawnAt = new Date();
    consent.withdrawalReason = reason;
    consent.isActive = false;

    await this.consentRepository.update(consentId, consent);

    // Process data deletion/anonymization
    await this.processConsentWithdrawal(consent);
  }
}
```

### Data Retention Policies

```typescript
// src/modules/retention/retention.service.ts
@Injectable()
export class RetentionService {
  @Cron('0 2 * * *') // Run daily at 2 AM
  async processRetentionPolicies() {
    const policies = await this.getActivePolicies();

    for (const policy of policies) {
      await this.applyPolicy(policy);
    }
  }

  private async applyPolicy(policy: RetentionPolicy) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - policy.retentionYears);

    const recordsToProcess = await this.getRecordsForRetention(
      policy.dataType,
      cutoffDate
    );

    for (const record of recordsToProcess) {
      if (policy.action === 'ANONYMIZE') {
        await this.anonymizeRecord(record, policy.anonymizationRules);
      } else if (policy.action === 'DELETE') {
        await this.deleteRecord(record);
      }
    }
  }
}
```

---

## Security Best Practices

### Password Security

```typescript
// src/modules/auth/password.service.ts
@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;
  private readonly minLength = 12;

  async hashPassword(password: string): Promise<string> {
    this.validatePasswordStrength(password);
    return bcrypt.hash(password, this.saltRounds);
  }

  private validatePasswordStrength(password: string) {
    const requirements = [
      { test: (p: string) => p.length >= this.minLength, message: 'Minimum 12 characters' },
      { test: (p: string) => /[A-Z]/.test(p), message: 'At least one uppercase letter' },
      { test: (p: string) => /[a-z]/.test(p), message: 'At least one lowercase letter' },
      { test: (p: string) => /\d/.test(p), message: 'At least one number' },
      { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), message: 'At least one special character' }
    ];

    const failed = requirements.filter(req => !req.test(password));

    if (failed.length > 0) {
      throw new BadRequestException(
        `Password requirements not met: ${failed.map(f => f.message).join(', ')}`
      );
    }
  }
}
```

### API Security Headers

```typescript
// src/common/middleware/security.middleware.ts
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // HSTS
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'"
    ].join('; ');

    res.setHeader('Content-Security-Policy', csp);

    next();
  }
}
```

### Secure File Upload

```typescript
// src/modules/files/upload.service.ts
@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, metadata: FileMetadataDto) {
    // Validate file type
    if (!this.isAllowedFileType(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File too large');
    }

    // Scan for malware
    const isClean = await this.scanForMalware(file.buffer);
    if (!isClean) {
      throw new BadRequestException('Malware detected');
    }

    // Generate secure filename
    const secureFilename = this.generateSecureFilename(file.originalname);

    // Upload to MinIO with encryption
    const result = await this.minioService.putObject(
      'secure-uploads',
      secureFilename,
      file.buffer,
      {
        'Content-Type': file.mimetype,
        'X-Amz-Server-Side-Encryption': 'AES256'
      }
    );

    // Log upload
    await this.auditService.logEvent({
      action: 'FILE_UPLOAD',
      resource: 'file',
      resourceId: secureFilename,
      userId: metadata.userId,
      ipAddress: metadata.ipAddress
    });

    return {
      filename: secureFilename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    };
  }

  private isAllowedFileType(mimetype: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    return allowedTypes.includes(mimetype);
  }
}
```

---

## Incident Response

### Security Incident Classification

```typescript
// src/modules/incident/incident.service.ts
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_BREACH = 'DATA_BREACH',
  MALWARE_DETECTION = 'MALWARE_DETECTION',
  DDOS_ATTACK = 'DDOS_ATTACK',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION'
}

@Injectable()
export class IncidentService {
  async createIncident(incident: CreateIncidentDto) {
    const securityIncident = {
      id: uuid(),
      type: incident.type,
      severity: this.calculateSeverity(incident),
      description: incident.description,
      affectedSystems: incident.affectedSystems,
      compromisedData: incident.compromisedData,
      timeline: incident.timeline,
      reporter: incident.reporter,
      createdAt: new Date(),
      status: 'OPEN',
      assignedTo: this.assignToTeam(incident.type)
    };

    const created = await this.incidentRepository.create(securityIncident);

    // Immediate notifications for critical incidents
    if (created.severity === IncidentSeverity.CRITICAL) {
      await this.immediateResponse(created);
    }

    return created;
  }

  private async immediateResponse(incident: any) {
    // 1. Contain the threat
    await this.containThreat(incident);

    // 2. Notify stakeholders
    await this.notifyStakeholders(incident);

    // 3. Document initial findings
    await this.documentFindings(incident);

    // 4. Start investigation
    await this.startInvestigation(incident);
  }
}
```

### Incident Response Playbook

#### Data Breach Response

```typescript
// src/modules/playbooks/data-breach.playbook.ts
@Injectable()
export class DataBreachPlaybook {
  async execute(incident: SecurityIncident) {
    const steps = [
      { name: 'Immediate Containment', action: () => this.containBreach(incident) },
      { name: 'Assessment', action: () => this.assessImpact(incident) },
      { name: 'Notification', action: () => this.notifyAuthorities(incident) },
      { name: 'Remediation', action: () => this.remediateVulnerability(incident) },
      { name: 'Prevention', action: () => this.implementPrevention(incident) }
    ];

    for (const step of steps) {
      try {
        await step.action();
        await this.updateIncidentStatus(incident.id, step.name, 'COMPLETED');
      } catch (error) {
        await this.updateIncidentStatus(incident.id, step.name, 'FAILED');
        throw error;
      }
    }
  }

  private async containBreach(incident: SecurityIncident) {
    // 1. Isolate affected systems
    await this.isolateSystems(incident.affectedSystems);

    // 2. Change credentials
    await this.forcePasswordReset(incident.compromisedAccounts);

    // 3. Revoke sessions
    await this.revokeActiveSessions(incident.compromisedAccounts);

    // 4. Increase monitoring
    await this.enhanceMonitoring(incident.indicators);
  }

  private async notifyAuthorities(incident: SecurityIncident) {
    // Regulatory notifications (within 72 hours)
    if (this.requiresRegulatoryNotification(incident)) {
      await this.notifyDataProtectionAuthority(incident);
    }

    // Patient notifications (if PHI compromised)
    if (this.containsPatientData(incident.compromisedData)) {
      await this.notifyAffectedPatients(incident);
    }
  }
}
```

---

## Security Testing

### Automated Security Testing

```typescript
// test/security/auth.security.spec.ts
describe('Authentication Security', () => {
  describe('Password Security', () => {
    it('should reject weak passwords', async () => {
      const weakPasswords = [
        'password',
        '123456',
        'qwerty',
        'admin123'
      ];

      for (const password of weakPasswords) {
        await request(app)
          .post('/auth/register')
          .send({
            email: 'test@example.com',
            password: password
          })
          .expect(400);
      }
    });

    it('should prevent password reuse', async () => {
      const userId = await createTestUser();

      await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getToken(userId)}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'NewPassword123!'
        })
        .expect(200);

      // Try to reuse old password
      await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${getToken(userId)}`)
        .send({
          currentPassword: 'NewPassword123!',
          newPassword: 'oldPassword123!'
        })
        .expect(400);
    });
  });

  describe('Session Security', () => {
    it('should invalidate session on password change', async () => {
      const token = await loginTestUser();

      await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'oldPassword123!',
          newPassword: 'NewPassword123!'
        })
        .expect(200);

      // Old token should be invalid
      await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });

    it('should detect session hijacking', async () => {
      const token = await loginTestUser();

      // Simulate request from different IP
      await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Forwarded-For', '192.168.1.100')
        .expect(401); // Should detect IP change
    });
  });
});
```

### Penetration Testing Checklist

```typescript
// test/security/pentest.checklist.ts
export const pentestChecklist = {
  authentication: [
    'Test for weak passwords',
    'Verify MFA implementation',
    'Check session management',
    'Test password recovery',
    'Verify account lockout'
  ],
  authorization: [
    'Test privilege escalation',
    'Verify role-based access',
    'Check direct object references',
    'Test API endpoint protection'
  ],
  dataValidation: [
    'Test SQL injection protection',
    'Verify XSS prevention',
    'Check file upload security',
    'Test input validation'
  ],
  infrastructure: [
    'Test network security',
    'Verify SSL/TLS configuration',
    'Check server hardening',
    'Test monitoring capabilities'
  ]
};
```

### Security Scanning Tools Integration

```bash
#!/bin/bash
# scripts/security-scan.sh

echo "Starting Security Scan..."

# OWASP ZAP Scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# NPM Audit
npm audit --audit-level high

# Snyk Vulnerability Scan
snyk test --severity-threshold=high

# Dependency Check
npm run dependency-check

# Code Analysis
npm run sonarqube-scan

echo "Security Scan Complete"
```

---

## Monitoring & Alerting Configuration

### Security Metrics Dashboard

```typescript
// src/modules/metrics/security.metrics.ts
@Injectable()
export class SecurityMetricsService {
  async getSecurityMetrics(timeRange: TimeRangeDto) {
    return {
      authentication: {
        failedLogins: await this.countFailedLogins(timeRange),
        mfaUsage: await this.getMfaUsageRate(timeRange),
        suspiciousActivities: await this.countSuspiciousActivities(timeRange)
      },
      dataAccess: {
        dataExports: await this.countDataExports(timeRange),
        accessViolations: await this.countAccessViolations(timeRange),
        privilegedAccess: await this.countPrivilegedAccess(timeRange)
      },
      systemHealth: {
        securityIncidents: await this.countSecurityIncidents(timeRange),
        vulnerabilities: await this.getOpenVulnerabilities(),
        complianceScore: await this.calculateComplianceScore()
      }
    };
  }
}
```

### Real-time Security Alerts

```typescript
// src/modules/alerts/security-alerts.ts
@Injectable()
export class SecurityAlertsService {
  async setupAlerts() {
    // Failed login threshold
    await this.createAlert({
      name: 'Multiple Failed Logins',
      condition: 'failed_logins_count > 5 in 5 minutes',
      severity: 'HIGH',
      actions: ['lock_account', 'notify_admin']
    });

    // Data export monitoring
    await this.createAlert({
      name: 'Unusual Data Export',
      condition: 'export_size > 1GB OR export_frequency > hourly',
      severity: 'CRITICAL',
      actions: ['block_export', 'notify_security_team']
    });

    // Privilege escalation
    await this.createAlert({
      name: 'Privilege Escalation Attempt',
      condition: 'role_change OR permission_grant',
      severity: 'HIGH',
      actions: ['require_approval', 'audit_log']
    });
  }
}
```

---

## Summary

Panduan keamanan INAMSOS ini menyediakan framework komprehensif untuk:

1. **Proteksi Data Berlapis**: Dari network hingga application layer
2. **Compliance**: HIPAA dan regulasi data protection Indonesia
3. **Monitoring**: Real-time security monitoring dan alerting
4. **Incident Response**: Terstruktur response procedures
5. **Testing**: Automated security testing dan validation

### Security Checklist untuk Production Deployment

- [ ] SSL/TLS configuration yang tepat
- [ ] Multi-factor authentication diaktifkan
- [ ] Role-based access control terkonfigurasi
- [ ] Audit logging diaktifkan
- [ ] Database encryption diimplementasikan
- [ ] Firewall rules dikonfigurasi
- [ ] Security monitoring setup
- [ ] Incident response plan disiapkan
- [ ] Security testing dilakukan
- [ ] Compliance requirements terpenuhi

Untuk informasi lebih lanjut atau bantuan implementasi, hubungi Security Team di security@inamsos.go.id.

---

**© 2025 INAMSOS - Security Team**
*Last Updated: November 19, 2025*