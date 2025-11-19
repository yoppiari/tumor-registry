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
exports.CreateBackupJobDto = exports.VerificationMode = exports.BackupType = void 0;
const class_validator_1 = require("class-validator");
var BackupType;
(function (BackupType) {
    BackupType["FULL"] = "FULL";
    BackupType["INCREMENTAL"] = "INCREMENTAL";
    BackupType["DIFFERENTIAL"] = "DIFFERENTIAL";
    BackupType["TRANSACTION_LOG"] = "TRANSACTION_LOG";
    BackupType["SNAPSHOT"] = "SNAPSHOT";
    BackupType["CONTINUOUS"] = "CONTINUOUS";
})(BackupType || (exports.BackupType = BackupType = {}));
var VerificationMode;
(function (VerificationMode) {
    VerificationMode["NONE"] = "NONE";
    VerificationMode["CHECKSUM"] = "CHECKSUM";
    VerificationMode["FULL"] = "FULL";
    VerificationMode["SAMPLE"] = "SAMPLE";
    VerificationMode["INTEGRITY_CHECK"] = "INTEGRITY_CHECK";
})(VerificationMode || (exports.VerificationMode = VerificationMode = {}));
class CreateBackupJobDto {
}
exports.CreateBackupJobDto = CreateBackupJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BackupType),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "backupType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "dataSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBackupJobDto.prototype, "retentionDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBackupJobDto.prototype, "compression", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBackupJobDto.prototype, "encryption", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "storageLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "storagePath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBackupJobDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateBackupJobDto.prototype, "backupOptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(VerificationMode),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "verificationMode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBackupJobDto.prototype, "centerId", void 0);
//# sourceMappingURL=create-backup-job.dto.js.map