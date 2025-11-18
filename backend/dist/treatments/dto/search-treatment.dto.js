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
exports.GenerateReportDto = exports.CreateMedicalRecordDto = exports.SearchTreatmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchTreatmentDto {
}
exports.SearchTreatmentDto = SearchTreatmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment plan status',
        enum: ['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']
    }),
    (0, class_validator_1.IsEnum)(['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment modality',
        enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
    }),
    (0, class_validator_1.IsEnum)(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "modality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment intent',
        enum: ['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']
    }),
    (0, class_validator_1.IsEnum)(['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "intent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary oncologist name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "primaryOncologist", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Primary cancer site' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "primaryCancerSite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancer stage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "cancerStage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Protocol category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "protocolCategory", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchTreatmentDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchTreatmentDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort field', example: 'createdAt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchTreatmentDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date range for treatment start',
        type: 'object'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SearchTreatmentDto.prototype, "dateRange", void 0);
class CreateMedicalRecordDto {
}
exports.CreateMedicalRecordDto = CreateMedicalRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record type',
        enum: ['progress_note', 'consultation', 'discharge_summary', 'procedure_note', 'imaging_report', 'lab_report', 'pathology_report']
    }),
    (0, class_validator_1.IsEnum)(['progress_note', 'consultation', 'discharge_summary', 'procedure_note', 'imaging_report', 'lab_report', 'pathology_report']),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "recordType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Record summary' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encounter type',
        enum: ['outpatient', 'inpatient', 'emergency', 'day_care']
    }),
    (0, class_validator_1.IsEnum)(['outpatient', 'inpatient', 'emergency', 'day_care']),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "encounterType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary provider', type: any }),
    __metadata("design:type", Object)
], CreateMedicalRecordDto.prototype, "primaryProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Consulting providers' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "consultingProviders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateMedicalRecordDto.prototype, "serviceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Documentation date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateMedicalRecordDto.prototype, "documentationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnoses' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medications' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Procedures' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "procedures", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vital signs' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMedicalRecordDto.prototype, "vitals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lab results' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "labs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Imaging results' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMedicalRecordDto.prototype, "imaging", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicalRecordDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Follow-up plan' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMedicalRecordDto.prototype, "followUp", void 0);
class GenerateReportDto {
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report type',
        enum: ['treatment_summary', 'progress_report', 'outcome_analysis', 'quality_metrics', 'adverse_events']
    }),
    (0, class_validator_1.IsEnum)(['treatment_summary', 'progress_report', 'outcome_analysis', 'quality_metrics', 'adverse_events']),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient IDs to include in report' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "patientIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Treatment plan IDs to include in report' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "treatmentPlanIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date range for the report' }),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional report parameters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Output format',
        enum: ['json', 'pdf', 'excel', 'csv']
    }),
    (0, class_validator_1.IsEnum)(['json', 'pdf', 'excel', 'csv']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "format", void 0);
//# sourceMappingURL=search-treatment.dto.js.map