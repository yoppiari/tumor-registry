"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let EncryptionService = class EncryptionService {
    constructor(configService) {
        this.configService = configService;
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
        this.ivLength = 16;
        this.tagLength = 16;
        const masterKey = this.configService.get('ENCRYPTION_MASTER_KEY');
        if (!masterKey) {
            throw new Error('ENCRYPTION_MASTER_KEY environment variable is required');
        }
        this.encryptionKey = crypto.pbkdf2Sync(masterKey, 'encryption', 100000, this.keyLength, 'sha512');
        this.hashKey = crypto.pbkdf2Sync(masterKey, 'hashing', 100000, this.keyLength, 'sha512');
    }
    encryptSensitiveData(data) {
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
    decryptSensitiveData(encryptedData) {
        const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
        decipher.setAAD(Buffer.from('sensitive-data'));
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    hashSensitiveData(data, salt) {
        const dataSalt = salt || crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(data, dataSalt, 100000, 64, 'sha512').toString('hex');
        return { hash, salt: dataSalt };
    }
    verifyHashedData(data, hash, salt) {
        const { hash: computedHash } = this.hashSensitiveData(data, salt);
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
    }
    generateSecureToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
    encryptPHI(data) {
        const jsonString = JSON.stringify(data);
        const encrypted = this.encryptSensitiveData(jsonString);
        return JSON.stringify(encrypted);
    }
    decryptPHI(encryptedData) {
        const encrypted = JSON.parse(encryptedData);
        const decryptedJson = this.decryptSensitiveData(encrypted);
        return JSON.parse(decryptedJson);
    }
    anonymizePatientData(patientData) {
        const anonymized = { ...patientData };
        delete anonymized.name;
        delete anonymized.nik;
        delete anonymized.phone;
        delete anonymized.email;
        delete anonymized.address;
        if (anonymized.id) {
            anonymized.patientHash = this.hashSensitiveData(anonymized.id).hash;
            delete anonymized.id;
        }
        if (anonymized.dateOfBirth) {
            anonymized.birthYear = new Date(anonymized.dateOfBirth).getFullYear();
            delete anonymized.dateOfBirth;
        }
        if (anonymized.address && anonymized.address.province) {
            anonymized.region = anonymized.address.province;
            delete anonymized.address;
        }
        anonymized.anonymized = true;
        anonymized.anonymizationDate = new Date().toISOString();
        return anonymized;
    }
    generateAccessFingerprint(userId, resourceType, resourceId) {
        const timestamp = Date.now().toString();
        const data = `${userId}:${resourceType}:${resourceId}:${timestamp}`;
        return crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
    }
    validateDataIntegrity(data, expectedHmac) {
        const computedHmac = crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(computedHmac));
    }
    generateDataHmac(data) {
        return crypto.createHmac('sha256', this.hashKey).update(data).digest('hex');
    }
    encryptBulkData(data) {
        const jsonString = JSON.stringify(data);
        return this.encryptSensitiveData(jsonString).encrypted;
    }
    decryptBulkData(encryptedData) {
        const decryptedJson = this.decryptSensitiveData({
            encrypted: encryptedData,
            iv: '',
            tag: ''
        });
        return JSON.parse(decryptedJson);
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    generateTenantKey(tenantId) {
        return crypto.pbkdf2Sync(tenantId + this.configService.get('TENANT_KEY_SALT'), 'tenant', 100000, this.keyLength, 'sha512');
    }
    encryptTenantData(data, tenantId) {
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
    decryptTenantData(encryptedData, tenantId) {
        const tenantKey = this.generateTenantKey(tenantId);
        const decipher = crypto.createDecipher(this.algorithm, tenantKey);
        decipher.setAAD(Buffer.from(`tenant-${tenantId}`));
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    rotateKey(newMasterKey) {
        const newEncryptionKey = crypto.pbkdf2Sync(newMasterKey, 'encryption', 100000, this.keyLength, 'sha512');
        const newHashKey = crypto.pbkdf2Sync(newMasterKey, 'hashing', 100000, this.keyLength, 'sha512');
        this.encryptionKey = newEncryptionKey;
        this.hashKey = newHashKey;
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map