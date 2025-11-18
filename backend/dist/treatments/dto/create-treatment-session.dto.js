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
exports.CreateSessionProcedureDto = exports.CreateSessionMedicationDto = exports.CreateLabAssessmentDto = exports.CreateSymptomAssessmentDto = exports.CreatePerformanceStatusDto = exports.CreateBloodPressureDto = exports.CreateVitalSignsDto = exports.CreatePreSessionAssessmentDto = exports.CreateTreatmentSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_treatment_plan_dto_1 = require("./create-treatment-plan.dto");
class CreateTreatmentSessionDto {
}
exports.CreateTreatmentSessionDto = CreateTreatmentSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Treatment plan ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTreatmentSessionDto.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session date', example: '2024-01-20T09:00:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateTreatmentSessionDto.prototype, "sessionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment modality',
        enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
    }),
    (0, class_validator_1.IsEnum)(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']),
    __metadata("design:type", String)
], CreateTreatmentSessionDto.prototype, "modality", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Duration in minutes', example: 180 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1440),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTreatmentSessionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pre-session assessment', type: CreatePreSessionAssessmentDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreatePreSessionAssessmentDto),
    __metadata("design:type", CreatePreSessionAssessmentDto)
], CreateTreatmentSessionDto.prototype, "preAssessment", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Session medications', type: [CreateSessionMedicationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateSessionMedicationDto),
    __metadata("design:type", Array)
], CreateTreatmentSessionDto.prototype, "medications", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Session procedures', type: [CreateSessionProcedureDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateSessionProcedureDto),
    __metadata("design:type", Array)
], CreateTreatmentSessionDto.prototype, "procedures", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Performed by', type: create_treatment_plan_dto_1.CreateClinicalTeamMemberDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_treatment_plan_dto_1.CreateClinicalTeamMemberDto),
    __metadata("design:type", create_treatment_plan_dto_1.CreateClinicalTeamMemberDto)
], CreateTreatmentSessionDto.prototype, "performedBy", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Supervised by', type: create_treatment_plan_dto_1.CreateClinicalTeamMemberDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_treatment_plan_dto_1.CreateClinicalTeamMemberDto),
    __metadata("design:type", create_treatment_plan_dto_1.CreateClinicalTeamMemberDto)
], CreateTreatmentSessionDto.prototype, "supervisedBy", void 0);
class CreatePreSessionAssessmentDto {
}
exports.CreatePreSessionAssessmentDto = CreatePreSessionAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vital signs', type: CreateVitalSignsDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateVitalSignsDto),
    __metadata("design:type", CreateVitalSignsDto)
], CreatePreSessionAssessmentDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Performance status', type: CreatePerformanceStatusDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreatePerformanceStatusDto),
    __metadata("design:type", CreatePerformanceStatusDto)
], CreatePreSessionAssessmentDto.prototype, "performanceStatus", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Symptoms assessment', type: [CreateSymptomAssessmentDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateSymptomAssessmentDto),
    __metadata("design:type", Array)
], CreatePreSessionAssessmentDto.prototype, "symptoms", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Lab assessments', type: [CreateLabAssessmentDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateLabAssessmentDto),
    __metadata("design:type", Array)
], CreatePreSessionAssessmentDto.prototype, "labs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment clearance',
        enum: ['cleared', 'cleared_with_modifications', 'delayed', 'cancelled']
    }),
    (0, class_validator_1.IsEnum)(['cleared', 'cleared_with_modifications', 'delayed', 'cancelled']),
    __metadata("design:type", String)
], CreatePreSessionAssessmentDto.prototype, "clearance", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Clearance notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePreSessionAssessmentDto.prototype, "clearanceNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessed by', example: 'Dr. Nurse Name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePreSessionAssessmentDto.prototype, "assessedBy", void 0);
class CreateVitalSignsDto {
}
exports.CreateVitalSignsDto = CreateVitalSignsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Blood pressure', type: CreateBloodPressureDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateBloodPressureDto),
    __metadata("design:type", CreateBloodPressureDto)
], CreateVitalSignsDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heart rate (bpm)', example: 72 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Respiratory rate (breaths/min)', example: 16 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(8),
    (0, class_validator_1.Max)(40),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temperature (°C)', example: 36.8 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(45),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Weight (kg)', example: 65.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "weight", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Height (cm)', example: 165 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(250),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "height", void 0);
__decorate([
    ApiPropertyOptional({ description: 'BMI' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "bmi", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Oxygen saturation (%)', example: 98 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(70),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Pain score (0-10)', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVitalSignsDto.prototype, "painScore", void 0);
class CreateBloodPressureDto {
}
exports.CreateBloodPressureDto = CreateBloodPressureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Systolic pressure', example: 120 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], CreateBloodPressureDto.prototype, "systolic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diastolic pressure', example: 80 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(40),
    (0, class_validator_1.Max)(150),
    __metadata("design:type", Number)
], CreateBloodPressureDto.prototype, "diastolic", void 0);
class CreatePerformanceStatusDto {
}
exports.CreatePerformanceStatusDto = CreatePerformanceStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Performance scale',
        enum: ['ECOG', 'KARNOFSKY']
    }),
    (0, class_validator_1.IsEnum)(['ECOG', 'KARNOFSKY']),
    __metadata("design:type", String)
], CreatePerformanceStatusDto.prototype, "scale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Performance score', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreatePerformanceStatusDto.prototype, "score", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePerformanceStatusDto.prototype, "description", void 0);
class CreateSymptomAssessmentDto {
}
exports.CreateSymptomAssessmentDto = CreateSymptomAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Symptom', example: 'Nausea' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSymptomAssessmentDto.prototype, "symptom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Severity (0-10)', example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateSymptomAssessmentDto.prototype, "severity", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Duration', example: '2 days' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSymptomAssessmentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Impact on activities',
        enum: ['none', 'mild', 'moderate', 'severe']
    }),
    (0, class_validator_1.IsEnum)(['none', 'mild', 'moderate', 'severe']),
    __metadata("design:type", String)
], CreateSymptomAssessmentDto.prototype, "impactOnActivities", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSymptomAssessmentDto.prototype, "notes", void 0);
class CreateLabAssessmentDto {
}
exports.CreateLabAssessmentDto = CreateLabAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test name', example: 'Absolute Neutrophil Count' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabAssessmentDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value', example: 2.1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabAssessmentDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit', example: 'x10^9/L' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabAssessmentDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference range', example: '1.5-7.0' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLabAssessmentDto.prototype, "referenceRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status',
        enum: ['normal', 'high', 'low', 'critical']
    }),
    (0, class_validator_1.IsEnum)(['normal', 'high', 'low', 'critical']),
    __metadata("design:type", String)
], CreateLabAssessmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test date', example: '2024-01-20T08:00:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateLabAssessmentDto.prototype, "date", void 0);
class CreateSessionMedicationDto {
}
exports.CreateSessionMedicationDto = CreateSessionMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medication name', example: 'Doxorubicin' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionMedicationDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dosage', example: '60 mg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route', example: 'IV' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionMedicationDto.prototype, "route", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Administration time', example: '2024-01-20T09:30:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateSessionMedicationDto.prototype, "administrationTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Administered by', example: 'Nurse Sarah' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionMedicationDto.prototype, "administeredBy", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSessionMedicationDto.prototype, "notes", void 0);
class CreateSessionProcedureDto {
}
exports.CreateSessionProcedureDto = CreateSessionProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Procedure name', example: 'Central line insertion' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionProcedureDto.prototype, "procedureName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time', example: '2024-01-20T09:15:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateSessionProcedureDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time', example: '2024-01-20T09:45:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateSessionProcedureDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Performed by', example: 'Dr. Smith' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionProcedureDto.prototype, "performedBy", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Complications', example: ['Minor bleeding'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSessionProcedureDto.prototype, "complications", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSessionProcedureDto.prototype, "notes", void 0);
//# sourceMappingURL=create-treatment-session.dto.js.map