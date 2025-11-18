"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrivacyValidator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyValidator = void 0;
const common_1 = require("@nestjs/common");
let PrivacyValidator = PrivacyValidator_1 = class PrivacyValidator {
    constructor() {
        this.logger = new common_1.Logger(PrivacyValidator_1.name);
        this.SENSITIVE_FIELDS = [
            'name',
            'nik',
            'birthDate',
            'phone',
            'address',
            'email',
            'medicalRecordNumber',
        ];
    }
    async validateAnonymization(patientData) {
        const violations = [];
        let score = 100;
        try {
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
        }
        catch (error) {
            this.logger.error(`Error validating anonymization: ${error.message}`);
            return {
                isCompliant: false,
                violations: [`Validation error: ${error.message}`],
                score: 0,
                details: { error: error.message },
            };
        }
    }
    async checkDataLeakage(query, centerId) {
        const leakedFields = [];
        let severity = 'LOW';
        try {
            if (query.includes('SELECT') && this.containsSensitiveFields(query)) {
                const sensitiveFieldsInQuery = this.extractSensitiveFields(query);
                leakedFields.push(...sensitiveFieldsInQuery);
                severity = this.calculateSeverity(query, sensitiveFieldsInQuery);
            }
            if (query.includes('patients') && !query.includes('WHERE')) {
                leakedFields.push('Unrestricted patient data access');
                severity = 'CRITICAL';
            }
            if (query.includes('JOIN') && this.hasCrossCenterJoin(query)) {
                leakedFields.push('Cross-center data exposure');
                severity = 'HIGH';
            }
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
        }
        catch (error) {
            this.logger.error(`Error checking data leakage: ${error.message}`);
            return {
                hasLeakage: true,
                leakedFields: ['Analysis error'],
                severity: 'HIGH',
                details: { error: error.message },
            };
        }
    }
    async auditAccessLogs(accessLogs) {
        const violations = [];
        let overallScore = 100;
        try {
            const auditTrailComplete = this.validateAuditTrail(accessLogs);
            if (!auditTrailComplete) {
                violations.push('Audit trail incomplete or missing entries');
                overallScore -= 25;
            }
            const encryptionUsed = this.checkEncryptionUsage(accessLogs);
            if (!encryptionUsed) {
                violations.push('Encryption not consistently used');
                overallScore -= 20;
            }
            const anonymizationApplied = this.checkAnonymizationLogs(accessLogs);
            if (!anonymizationApplied) {
                violations.push('Anonymization process not logged');
                overallScore -= 15;
            }
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
        }
        catch (error) {
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
    containsRealData(name) {
        return !name.includes('PATIENT') && !name.includes('TEST') && name.length > 3;
    }
    containsValidNIK(nik) {
        return /^\d{16}$/.test(nik);
    }
    containsRealPhone(phone) {
        return /^(\+62|62|0)[0-9]{9,12}$/.test(phone.replace(/[-\s]/g, ''));
    }
    containsRealAddress(address) {
        return /\b(Jalan|Jl|Street|RT|RW|No\.|#)\b/i.test(address);
    }
    isReversibleAnonymization(data) {
        return this.SENSITIVE_FIELDS.some(field => {
            const value = data[field];
            return value && typeof value === 'string' && value.length < 10;
        });
    }
    containsSensitiveFields(query) {
        const sensitivePatterns = [
            /name|nik|birth_date|phone|address|email/i,
        ];
        return sensitivePatterns.some(pattern => pattern.test(query));
    }
    extractSensitiveFields(query) {
        const extracted = [];
        this.SENSITIVE_FIELDS.forEach(field => {
            if (new RegExp(field.replace(/([A-Z])/g, '[_$1]'), 'i').test(query)) {
                extracted.push(field);
            }
        });
        return extracted;
    }
    calculateSeverity(query, fields) {
        if (fields.includes('nik') || query.includes('*'))
            return 'CRITICAL';
        if (fields.length > 2 || query.includes('patients'))
            return 'HIGH';
        if (fields.length > 0)
            return 'MEDIUM';
        return 'LOW';
    }
    hasCrossCenterJoin(query) {
        return /test_\d+\.\w+\s*JOIN\s*test_\d+/i.test(query);
    }
    containsExportKeywords(query) {
        const exportKeywords = ['EXPORT', 'COPY', 'DUMP', 'BACKUP'];
        return exportKeywords.some(keyword => query.toUpperCase().includes(keyword));
    }
    validateAuditTrail(logs) {
        if (!logs || logs.length === 0)
            return false;
        return logs.every(log => log.userId &&
            log.action &&
            log.timestamp &&
            log.resource);
    }
    checkEncryptionUsage(logs) {
        return logs.some(log => log.action?.includes('encrypt') ||
            log.action?.includes('decrypt') ||
            log.action?.includes('secure'));
    }
    checkAnonymizationLogs(logs) {
        return logs.some(log => log.action?.includes('anonymize') ||
            log.action?.includes('pseudonymize'));
    }
    checkUnauthorizedAccess(logs) {
        return logs.filter(log => log.status === 'DENIED' ||
            log.action?.includes('unauthorized')).length;
    }
};
exports.PrivacyValidator = PrivacyValidator;
exports.PrivacyValidator = PrivacyValidator = PrivacyValidator_1 = __decorate([
    (0, common_1.Injectable)()
], PrivacyValidator);
//# sourceMappingURL=privacy-validator.service.js.map