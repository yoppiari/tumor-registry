import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface PatientData {
  id: string;
  name: string;
  nik: string;
  birthDate: string;
  phone: string;
  address: string;
}

export interface PrivacyResult {
  isCompliant: boolean;
  violations: string[];
  score: number;
  details: any;
}

export interface LeakageResult {
  hasLeakage: boolean;
  leakedFields: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: any;
}

export interface ComplianceResult {
  overallScore: number;
  auditTrailComplete: boolean;
  encryptionUsed: boolean;
  anonymizationApplied: boolean;
  violations: string[];
}

@Injectable()
export class PrivacyValidator {
  private readonly logger = new Logger(PrivacyValidator.name);
  private readonly SENSITIVE_FIELDS = [
    'name',
    'nik',
    'birthDate',
    'phone',
    'address',
    'email',
    'medicalRecordNumber',
  ];

  /**
   * Validate patient data anonymization
   */
  async validateAnonymization(patientData: PatientData): Promise<PrivacyResult> {
    const violations: string[] = [];
    let score = 100;

    try {
      // Check if direct identifiers are properly anonymized
      if (this.containsRealData(patientData.name)) {
        violations.push('Patient name not properly anonymized');
        score -= 30;
      }

      if (this.containsValidNIK(patientData.nik)) {
        violations.push('NIK (National ID) contains valid format');
        score -= 40;
      }

      if (this.containsRealPhone(patientData.phone)) {
        violations.push('Phone number contains real format');
        score -= 20;
      }

      if (this.containsRealAddress(patientData.address)) {
        violations.push('Address contains identifiable information');
        score -= 25;
      }

      // Check for reversibility
      if (this.isReversibleAnonymization(patientData)) {
        violations.push('Anonymization is reversible');
        score -= 15;
      }

      return {
        isCompliant: violations.length === 0 && score >= 70,
        violations,
        score: Math.max(0, score),
        details: {
          fieldsChecked: this.SENSITIVE_FIELDS.length,
          anonymizationLevel: score >= 90 ? 'HIGH' : score >= 70 ? 'MEDIUM' : 'LOW',
        },
      };

    } catch (error) {
      this.logger.error(`Error validating anonymization: ${error.message}`);
      return {
        isCompliant: false,
        violations: [`Validation error: ${error.message}`],
        score: 0,
        details: { error: error.message },
      };
    }
  }

  /**
   * Check for data leakage in queries
   */
  async checkDataLeakage(query: string, centerId: string): Promise<LeakageResult> {
    const leakedFields: string[] = [];
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    try {
      // Check for SELECT queries with sensitive fields
      if (query.includes('SELECT') && this.containsSensitiveFields(query)) {
        const sensitiveFieldsInQuery = this.extractSensitiveFields(query);
        leakedFields.push(...sensitiveFieldsInQuery);
        severity = this.calculateSeverity(query, sensitiveFieldsInQuery);
      }

      // Check for lack of WHERE clause in patient data queries
      if (query.includes('patients') && !query.includes('WHERE')) {
        leakedFields.push('Unrestricted patient data access');
        severity = 'CRITICAL';
      }

      // Check for JOIN operations that might expose data across centers
      if (query.includes('JOIN') && this.hasCrossCenterJoin(query)) {
        leakedFields.push('Cross-center data exposure');
        severity = 'HIGH';
      }

      // Check for export functions
      if (this.containsExportKeywords(query)) {
        leakedFields.push('Data export operation');
        severity = 'MEDIUM';
      }

      return {
        hasLeakage: leakedFields.length > 0,
        leakedFields,
        severity,
        details: {
          queryLength: query.length,
          centerId,
          timestamp: new Date().toISOString(),
        },
      };

    } catch (error) {
      this.logger.error(`Error checking data leakage: ${error.message}`);
      return {
        hasLeakage: true,
        leakedFields: ['Analysis error'],
        severity: 'HIGH',
        details: { error: error.message },
      };
    }
  }

  /**
   * Audit access logs for compliance
   */
  async auditAccessLogs(accessLogs: any[]): Promise<ComplianceResult> {
    const violations: string[] = [];
    let overallScore = 100;

    try {
      // Check audit trail completeness
      const auditTrailComplete = this.validateAuditTrail(accessLogs);
      if (!auditTrailComplete) {
        violations.push('Audit trail incomplete or missing entries');
        overallScore -= 25;
      }

      // Check encryption usage
      const encryptionUsed = this.checkEncryptionUsage(accessLogs);
      if (!encryptionUsed) {
        violations.push('Encryption not consistently used');
        overallScore -= 20;
      }

      // Check anonymization logs
      const anonymizationApplied = this.checkAnonymizationLogs(accessLogs);
      if (!anonymizationApplied) {
        violations.push('Anonymization process not logged');
        overallScore -= 15;
      }

      // Check for unauthorized access attempts
      const unauthorizedAttempts = this.checkUnauthorizedAccess(accessLogs);
      if (unauthorizedAttempts > 0) {
        violations.push(`${unauthorizedAttempts} unauthorized access attempts detected`);
        overallScore -= unauthorizedAttempts * 10;
      }

      return {
        overallScore: Math.max(0, overallScore),
        auditTrailComplete,
        encryptionUsed,
        anonymizationApplied,
        violations,
      };

    } catch (error) {
      this.logger.error(`Error auditing access logs: ${error.message}`);
      return {
        overallScore: 0,
        auditTrailComplete: false,
        encryptionUsed: false,
        anonymizationApplied: false,
        violations: [`Audit error: ${error.message}`],
      };
    }
  }

  /**
   * Helper methods
   */
  private containsRealData(name: string): boolean {
    // Simple heuristic - in real implementation, use more sophisticated checks
    return !name.includes('PATIENT') && !name.includes('TEST') && name.length > 3;
  }

  private containsValidNIK(nik: string): boolean {
    // Basic NIK validation (16 digits)
    return /^\d{16}$/.test(nik);
  }

  private containsRealPhone(phone: string): boolean {
    // Basic phone validation
    return /^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/[-\s]/g, ''));
  }

  private containsRealAddress(address: string): boolean {
    // Check for specific address patterns
    return /\b(Jalan|Jl|Street|RT|RW|No\.|#)\b/i.test(address);
  }

  private isReversibleAnonymization(data: PatientData): boolean {
    // Check if data has patterns that could be reversed
    return this.SENSITIVE_FIELDS.some(field => {
      const value = data[field as keyof PatientData];
      return value && typeof value === 'string' && value.length < 10;
    });
  }

  private containsSensitiveFields(query: string): boolean {
    const sensitivePatterns = [
      /name|nik|birth_date|phone|address|email/i,
    ];
    return sensitivePatterns.some(pattern => pattern.test(query));
  }

  private extractSensitiveFields(query: string): string[] {
    const extracted: string[] = [];

    this.SENSITIVE_FIELDS.forEach(field => {
      if (new RegExp(field.replace(/([A-Z])/g, '[_$1]'), 'i').test(query)) {
        extracted.push(field);
      }
    });

    return extracted;
  }

  private calculateSeverity(query: string, fields: string[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (fields.includes('nik') || query.includes('*')) return 'CRITICAL';
    if (fields.length > 2 || query.includes('patients')) return 'HIGH';
    if (fields.length > 0) return 'MEDIUM';
    return 'LOW';
  }

  private hasCrossCenterJoin(query: string): boolean {
    // Check for joins between different center schemas
    return /test_\d+\.\w+\s*JOIN\s*test_\d+/i.test(query);
  }

  private containsExportKeywords(query: string): boolean {
    const exportKeywords = ['EXPORT', 'COPY', 'DUMP', 'BACKUP'];
    return exportKeywords.some(keyword => query.toUpperCase().includes(keyword));
  }

  private validateAuditTrail(logs: any[]): boolean {
    // Basic validation - check for required fields
    if (!logs || logs.length === 0) return false;

    return logs.every(log =>
      log.userId &&
      log.action &&
      log.timestamp &&
      log.resource
    );
  }

  private checkEncryptionUsage(logs: any[]): boolean {
    // Check if encryption-related actions are logged
    return logs.some(log =>
      log.action?.includes('encrypt') ||
      log.action?.includes('decrypt') ||
      log.action?.includes('secure')
    );
  }

  private checkAnonymizationLogs(logs: any[]): boolean {
    // Check if anonymization processes are logged
    return logs.some(log =>
      log.action?.includes('anonymize') ||
      log.action?.includes('pseudonymize')
    );
  }

  private checkUnauthorizedAccess(logs: any[]): number {
    // Count unauthorized access attempts
    return logs.filter(log =>
      log.status === 'DENIED' ||
      log.action?.includes('unauthorized')
    ).length;
  }
}