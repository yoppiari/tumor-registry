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
exports.PatientSearchDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PatientSearchDto {
}
exports.PatientSearchDto = PatientSearchDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query (name, MRN, phone)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical record number' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Identity number (NIK)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "identityNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient name' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['I', 'II', 'III', 'IV']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['I', 'II', 'III', 'IV'],
        description: 'Cancer stage filter'
    }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "cancerStage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
        description: 'Treatment status filter'
    }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "treatmentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary cancer site' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "primarySite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Treatment center ID' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "treatmentCenter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth from (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "dateOfBirthFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth to (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "dateOfBirthTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of diagnosis from (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "dateOfDiagnosisFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of diagnosis to (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "dateOfDiagnosisTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter deceased patients' }),
    __metadata("design:type", Boolean)
], PatientSearchDto.prototype, "isDeceased", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number (default: 1)', minimum: 1, default: 1 }),
    __metadata("design:type", Number)
], PatientSearchDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page (default: 10)', minimum: 1, maximum: 100, default: 10 }),
    __metadata("design:type", Number)
], PatientSearchDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['name', 'createdAt', 'dateOfDiagnosis', 'lastVisitDate']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['name', 'createdAt', 'dateOfDiagnosis', 'lastVisitDate'],
        description: 'Sort field'
    }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['asc', 'desc'],
        description: 'Sort order'
    }),
    __metadata("design:type", String)
], PatientSearchDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=patient-search.dto.js.map