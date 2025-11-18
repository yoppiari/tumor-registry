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
exports.PatientEntrySessionDto = exports.ChatMessageDto = exports.QuickPatientEntryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class QuickPatientEntryDto {
}
exports.QuickPatientEntryDto = QuickPatientEntryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiProperty)({ description: 'Patient full name', example: 'John Doe' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[+]?[0-9]{10,15}$/, { message: 'Phone number must be 10-15 digits, may start with +' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number', example: '+62812345678' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth (YYYY-MM-DD)', type: 'string', format: 'date' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['male', 'female'], description: 'Gender' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9\-\/]+$/, { message: 'Medical record number can only contain letters, numbers, hyphens, and slashes' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical record number (No. RM)', example: 'RM20240001' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary cancer site', example: 'Breast' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "primarySite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['I', 'II', 'III', 'IV']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['I', 'II', 'III', 'IV'], description: 'Cancer stage' }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "cancerStage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['new', 'ongoing', 'completed', 'palliative']),
    (0, swagger_1.ApiProperty)({
        enum: ['new', 'ongoing', 'completed', 'palliative'],
        description: 'Treatment status'
    }),
    __metadata("design:type", String)
], QuickPatientEntryDto.prototype, "treatmentStatus", void 0);
class ChatMessageDto {
}
exports.ChatMessageDto = ChatMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Message content' }),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field name being updated' }),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "fieldName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session ID for chat-based entry' }),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "sessionId", void 0);
class PatientEntrySessionDto {
}
exports.PatientEntrySessionDto = PatientEntrySessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Session ID' }),
    __metadata("design:type", String)
], PatientEntrySessionDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID if exists' }),
    __metadata("design:type", String)
], PatientEntrySessionDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['in_progress', 'completed', 'abandoned']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['in_progress', 'completed', 'abandoned'],
        description: 'Session status'
    }),
    __metadata("design:type", String)
], PatientEntrySessionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    IsNumber(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current step in form' }),
    __metadata("design:type", Number)
], PatientEntrySessionDto.prototype, "currentStep", void 0);
//# sourceMappingURL=quick-patient-entry.dto.js.map