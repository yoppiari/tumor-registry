import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16;  // 128 bits
  private readonly tagLength = 16; // 128 bits
  private readonly encryptionKey: Buffer;
  private readonly hashKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    const masterKey = this.configService.get<string>('ENCRYPTION_MASTER_KEY');
    if (!masterKey) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is required');
    }

    // Derive encryption key from master key using PBKDF2
    this.encryptionKey = crypto.pbkdf2Sync(masterKey, 'encryption', 100000, this.keyLength, 'sha512');
    this.hashKey = crypto.pbkdf2Sync(masterKey, 'hashing', 100000, this.keyLength, 'sha512');
  }

  /**
   * Encrypt sensitive data with field-level encryption
   */
  encryptSensitiveData(data: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    cipher.setAAD(Buffer.from('sensitive-data'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  /**
   * Decrypt sensitive data
   */
  decryptSensitiveData(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
    decipher.setAAD(Buffer.from('sensitive-data'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash sensitive data for comparison (one-way)
   */
  hashSensitiveData(data: string, salt?: string): { hash: string; salt: string } {
    const dataSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, dataSalt, 100000, 64, 'sha512').toString('hex');

    return { hash, salt: dataSalt };
  }

  /**
   * Verify hashed data
   */
  verifyHashedData(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashSensitiveData(data, salt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt PHI (Protected Health Information)
   */
  encryptPHI(data: any): string {
    const jsonString = JSON.stringify(data);
    const encrypted = this.encryptSensitiveData(jsonString);
    return JSON.stringify(encrypted);
  }

  /**
   * Decrypt PHI (Protected Health Information)
   */
  decryptPHI(encryptedData: string): any {
    const encrypted = JSON.parse(encryptedData);
    const decryptedJson = this.decryptSensitiveData(encrypted);
    return JSON.parse(decryptedJson);
  }

  /**
   * Anonymize patient data for analytics
   */
  anonymizePatientData(patientData: any): any {
    const anonymized = { ...patientData };

    // Remove direct identifiers
    delete anonymized.name;
    delete anonymized.nik;
    delete anonymized.phone;
    delete anonymized.email;
    delete anonymized.address;

    // Hash remaining identifiers for consistency
    if (anonymized.id) {
      anonymized.patientHash = this.hashSensitiveData(anonymized.id).hash;
      delete anonymized.id;
    }

    // Generalize dates (keep only year)
    if (anonymized.dateOfBirth) {
      anonymized.birthYear = new Date(anonymized.dateOfBirth).getFullYear();
      delete anonymized.dateOfBirth;
    }

    // Generalize locations
    if (anonymized.address && anonymized.address.province) {
      anonymized.region = anonymized.address.province;
      delete anonymized.address;
    }

    // Add anonymization metadata
    anonymized.anonymized = true;
    anonymized.anonymizationDate = new Date().toISOString();

    return anonymized;
  }

  /**
   * Generate data access fingerprint for audit trails
   */
  generateAccessFingerprint(userId: string, resourceType: string, resourceId: string): string {
    const timestamp = Date.now().toString();
    const data = `${userId}:${resourceType}:${resourceId}:${timestamp}`;
    return crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
  }

  /**
   * Validate data integrity using HMAC
   */
  validateDataIntegrity(data: string, expectedHmac: string): boolean {
    const computedHmac = crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(computedHmac));
  }

  /**
   * Generate HMAC for data integrity
   */
  generateDataHmac(data: string): string {
    return crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
  }

  /**
   * Encrypt bulk data for secure storage
   */
  encryptBulkData(data: any[]): string {
    const jsonString = JSON.stringify(data);
    return this.encryptSensitiveData(jsonString).encrypted;
  }

  /**
   * Decrypt bulk data
   */
  decryptBulkData(encryptedData: string): any[] {
    const decryptedJson = this.decryptSensitiveData({
      encrypted: encryptedData,
      iv: '', // This would need to be stored separately
      tag: ''  // This would need to be stored separately
    });
    return JSON.parse(decryptedJson);
  }

  /**
   * Generate secure password hash
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate encryption keys for multi-tenant scenarios
   */
  generateTenantKey(tenantId: string): Buffer {
    return crypto.pbkdf2Sync(tenantId + this.configService.get<string>('TENANT_KEY_SALT'), 'tenant', 100000, this.keyLength, 'sha512');
  }

  /**
   * Encrypt data with tenant-specific key
   */
  encryptTenantData(data: string, tenantId: string): { encrypted: string; iv: string; tag: string } {
    const tenantKey = this.generateTenantKey(tenantId);
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, tenantKey);
    cipher.setAAD(Buffer.from(`tenant-${tenantId}`));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  /**
   * Decrypt data with tenant-specific key
   */
  decryptTenantData(encryptedData: { encrypted: string; iv: string; tag: string }, tenantId: string): string {
    const tenantKey = this.generateTenantKey(tenantId);
    const decipher = crypto.createDecipher(this.algorithm, tenantKey);
    decipher.setAAD(Buffer.from(`tenant-${tenantId}`));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Key rotation for encryption keys
   */
  rotateKey(newMasterKey: string): void {
    // Re-derive new keys
    const newEncryptionKey = crypto.pbkdf2Sync(newMasterKey, 'encryption', 100000, this.keyLength, 'sha512');
    const newHashKey = crypto.pbkdf2Sync(newMasterKey, 'hashing', 100000, this.keyLength, 'sha512');

    // This would trigger re-encryption of all stored data
    // Implementation would depend on your database and storage strategy

    // For now, just update the keys in memory
    (this as any).encryptionKey = newEncryptionKey;
    (this as any).hashKey = newHashKey;
  }
}