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
exports.CreateBiomarkerResultDto = exports.CreateComorbidityDto = exports.CreateFunctionalStatusDto = exports.CreateImagingStudyDto = exports.CreateLabValueDto = exports.CreateLesionMeasurementDto = exports.CreateDiseaseAssessmentDto = exports.CreateBaselineAssessmentDto = exports.CreateClinicalTeamMemberDto = exports.CreateModalitySettingsDto = exports.CreateTreatmentModalityDto = exports.CreateTreatmentPlanDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateTreatmentPlanDto {
}
exports.CreateTreatmentPlanDto = CreateTreatmentPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan name', example: 'Chemotherapy for Breast Cancer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan code', example: 'BR-CA-CHMO-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "planCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Patient ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary cancer site', example: 'Breast' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "primaryCancerSite", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancer stage', example: 'II' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "cancerStage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Histology', example: 'Invasive Ductal Carcinoma' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "histology", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment modalities',
        type: [CreateTreatmentModalityDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateTreatmentModalityDto),
    __metadata("design:type", Array)
], CreateTreatmentPlanDto.prototype, "modalities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment intent',
        enum: ['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']
    }),
    (0, class_validator_1.IsEnum)(['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "intent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Protocol ID', example: 'uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "protocolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Protocol name', example: 'AC-T' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "protocolName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Protocol version', example: '1.0' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "protocolVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Protocol category',
        enum: ['standard', 'clinical_trial', 'modified', 'compassionate_use']
    }),
    (0, class_validator_1.IsEnum)(['standard', 'clinical_trial', 'modified', 'compassionate_use']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "protocolCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Primary oncologist', type: CreateClinicalTeamMemberDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateClinicalTeamMemberDto),
    __metadata("design:type", CreateClinicalTeamMemberDto)
], CreateTreatmentPlanDto.prototype, "primaryOncologist", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Multidisciplinary team members',
        type: [CreateClinicalTeamMemberDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateClinicalTeamMemberDto),
    __metadata("design:type", Array)
], CreateTreatmentPlanDto.prototype, "multidisciplinaryTeam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-15' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateTreatmentPlanDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected end date', example: '2024-06-15' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateTreatmentPlanDto.prototype, "expectedEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total number of cycles', example: 6 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(52),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTreatmentPlanDto.prototype, "totalCycles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Baseline assessment', type: CreateBaselineAssessmentDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateBaselineAssessmentDto),
    __metadata("design:type", CreateBaselineAssessmentDto)
], CreateTreatmentPlanDto.prototype, "baselineAssessment", void 0);
class CreateTreatmentModalityDto {
}
exports.CreateTreatmentModalityDto = CreateTreatmentModalityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Modality type',
        enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
    }),
    (0, class_validator_1.IsEnum)(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']),
    __metadata("design:type", String)
], CreateTreatmentModalityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modality name', example: 'Doxorubicin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTreatmentModalityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Priority',
        enum: ['primary', 'secondary', 'adjuvant']
    }),
    (0, class_validator_1.IsEnum)(['primary', 'secondary', 'adjuvant']),
    __metadata("design:type", String)
], CreateTreatmentModalityDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sequence number', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTreatmentModalityDto.prototype, "sequence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description', example: 'Neoadjuvant chemotherapy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentModalityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Modality settings', type: CreateModalitySettingsDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateModalitySettingsDto),
    __metadata("design:type", CreateModalitySettingsDto)
], CreateTreatmentModalityDto.prototype, "settings", void 0);
class CreateModalitySettingsDto {
}
exports.CreateModalitySettingsDto = CreateModalitySettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Surgery type', example: 'Mastectomy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "surgeryType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Surgical approach',
        enum: ['open', 'laparoscopic', 'robotic', 'endoscopic']
    }),
    (0, class_validator_1.IsEnum)(['open', 'laparoscopic', 'robotic', 'endoscopic']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "surgicalApproach", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Planned surgery date', example: '2024-01-20' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateModalitySettingsDto.prototype, "plannedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chemotherapy regimen', example: 'AC' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "regimen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cycle length in days', example: 21 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateModalitySettingsDto.prototype, "cycleLength", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of cycles', example: 4 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(52),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateModalitySettingsDto.prototype, "numberOfCycles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Radiotherapy technique', example: 'IMRT' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "technique", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total dose in Gy', example: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateModalitySettingsDto.prototype, "dose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of fractions', example: 25 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateModalitySettingsDto.prototype, "fractions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target volume', example: 'Breast and regional nodes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "targetVolume", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Therapy agent', example: 'Trastuzumab' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "agent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dosage', example: '8 mg/kg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Frequency', example: 'Every 3 weeks' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duration', example: '1 year' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateModalitySettingsDto.prototype, "duration", void 0);
class CreateClinicalTeamMemberDto {
}
exports.CreateClinicalTeamMemberDto = CreateClinicalTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name', example: 'Dr. John Smith' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role',
        enum: ['medical_oncologist', 'radiation_oncologist', 'surgical_oncologist', 'pathologist', 'radiologist', 'nurse', 'pharmacist', 'nutritionist', 'social_worker', 'palliative_care']
    }),
    (0, class_validator_1.IsEnum)(['medical_oncologist', 'radiation_oncologist', 'surgical_oncologist', 'pathologist', 'radiologist', 'nurse', 'pharmacist', 'nutritionist', 'social_worker', 'palliative_care']),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Department', example: 'Medical Oncology' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Institution', example: 'National Cancer Center' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "institution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email', example: 'john.smith@hospital.com' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone', example: '+62-812-3456-7890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClinicalTeamMemberDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is primary team member' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateClinicalTeamMemberDto.prototype, "isPrimary", void 0);
class CreateBaselineAssessmentDto {
}
exports.CreateBaselineAssessmentDto = CreateBaselineAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment date', example: '2024-01-10' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateBaselineAssessmentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Disease assessment', type: CreateDiseaseAssessmentDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateDiseaseAssessmentDto),
    __metadata("design:type", CreateDiseaseAssessmentDto)
], CreateBaselineAssessmentDto.prototype, "diseaseAssessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Laboratory values', type: [CreateLabValueDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateLabValueDto),
    __metadata("design:type", Array)
], CreateBaselineAssessmentDto.prototype, "laboratoryValues", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Imaging studies', type: [CreateImagingStudyDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateImagingStudyDto),
    __metadata("design:type", Array)
], CreateBaselineAssessmentDto.prototype, "imagingStudies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Functional status', type: CreateFunctionalStatusDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateFunctionalStatusDto),
    __metadata("design:type", CreateFunctionalStatusDto)
], CreateBaselineAssessmentDto.prototype, "functionalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comorbidities', type: [CreateComorbidityDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateComorbidityDto),
    __metadata("design:type", Array)
], CreateBaselineAssessmentDto.prototype, "comorbidities", void 0);
class CreateDiseaseAssessmentDto {
}
exports.CreateDiseaseAssessmentDto = CreateDiseaseAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lesion measurements', type: [CreateLesionMeasurementDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateLesionMeasurementDto),
    __metadata("design:type", Array)
], CreateDiseaseAssessmentDto.prototype, "lesionMeasurements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Disease burden',
        enum: ['minimal', 'moderate', 'extensive']
    }),
    (0, class_validator_1.IsEnum)(['minimal', 'moderate', 'extensive']),
    __metadata("design:type", String)
], CreateDiseaseAssessmentDto.prototype, "diseaseBurden", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Biomarkers', type: [CreateBiomarkerResultDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateBiomarkerResultDto),
    __metadata("design:type", Array)
], CreateDiseaseAssessmentDto.prototype, "biomarkers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assessment date', example: '2024-01-10' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateDiseaseAssessmentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Assessment method',
        enum: ['RECIST', 'WHO', 'PERCIST', 'clinical']
    }),
    (0, class_validator_1.IsEnum)(['RECIST', 'WHO', 'PERCIST', 'clinical']),
    __metadata("design:type", String)
], CreateDiseaseAssessmentDto.prototype, "assessmentMethod", void 0);
class CreateLesionMeasurementDto {
}
exports.CreateLesionMeasurementDto = CreateLesionMeasurementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lesion site', example: 'Right breast mass' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLesionMeasurementDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lesion type',
        enum: ['target', 'non_target', 'new']
    }),
    (0, class_validator_1.IsEnum)(['target', 'non_target', 'new']),
    __metadata("design:type", String)
], CreateLesionMeasurementDto.prototype, "lesionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Baseline size in mm', example: 25 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], CreateLesionMeasurementDto.prototype, "baselineSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Measurement method',
        enum: ['CT', 'MRI', 'PET', 'clinical', 'ultrasound']
    }),
    (0, class_validator_1.IsEnum)(['CT', 'MRI', 'PET', 'clinical', 'ultrasound']),
    __metadata("design:type", String)
], CreateLesionMeasurementDto.prototype, "measurementMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLesionMeasurementDto.prototype, "notes", void 0);
class CreateLabValueDto {
}
exports.CreateLabValueDto = CreateLabValueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test name', example: 'Hemoglobin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLabValueDto.prototype, "testName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value', example: 12.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLabValueDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit', example: 'g/dL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLabValueDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference range', example: '12.0-15.5' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLabValueDto.prototype, "referenceRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category',
        enum: ['hematology', 'chemistry', 'tumor_marker', 'hormone', 'other']
    }),
    (0, class_validator_1.IsEnum)(['hematology', 'chemistry', 'tumor_marker', 'hormone', 'other']),
    __metadata("design:type", String)
], CreateLabValueDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test date', example: '2024-01-10' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateLabValueDto.prototype, "date", void 0);
class CreateImagingStudyDto {
}
exports.CreateImagingStudyDto = CreateImagingStudyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study type', example: 'CT Chest/Abdomen/Pelvis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateImagingStudyDto.prototype, "studyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study date', example: '2024-01-08' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateImagingStudyDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Findings', example: 'No evidence of metastatic disease' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateImagingStudyDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Impression', example: 'Stable disease' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateImagingStudyDto.prototype, "impression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Radiologist', example: 'Dr. Radiologist' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateImagingStudyDto.prototype, "radiologist", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateImagingStudyDto.prototype, "reportUrl", void 0);
class CreateFunctionalStatusDto {
}
exports.CreateFunctionalStatusDto = CreateFunctionalStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ADL score (0-6)', example: 6 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateFunctionalStatusDto.prototype, "adlScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'IADL score (0-8)', example: 8 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], CreateFunctionalStatusDto.prototype, "iadlScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nutritional status',
        enum: ['well_nourished', 'moderately_malnourished', 'severely_malnourished']
    }),
    (0, class_validator_1.IsEnum)(['well_nourished', 'moderately_malnourished', 'severely_malnourished']),
    __metadata("design:type", String)
], CreateFunctionalStatusDto.prototype, "nutritionalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Performance score', example: 90 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateFunctionalStatusDto.prototype, "performanceScore", void 0);
class CreateComorbidityDto {
}
exports.CreateComorbidityDto = CreateComorbidityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Condition', example: 'Hypertension' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComorbidityDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity',
        enum: ['mild', 'moderate', 'severe']
    }),
    (0, class_validator_1.IsEnum)(['mild', 'moderate', 'severe']),
    __metadata("design:type", String)
], CreateComorbidityDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Controlled status' }),
    __metadata("design:type", Boolean)
], CreateComorbidityDto.prototype, "controlled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Treatment', example: 'ACE inhibitor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComorbidityDto.prototype, "treatment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Impact on cancer treatment',
        enum: ['none', 'minimal', 'moderate', 'significant']
    }),
    (0, class_validator_1.IsEnum)(['none', 'minimal', 'moderate', 'significant']),
    __metadata("design:type", String)
], CreateComorbidityDto.prototype, "impactOnCancerTreatment", void 0);
class CreateBiomarkerResultDto {
}
exports.CreateBiomarkerResultDto = CreateBiomarkerResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Marker name', example: 'HER2' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "markerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value', example: 'Positive' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unit' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reference range' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "referenceRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Interpretation', example: 'HER2-positive (3+)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "interpretation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Test date', example: '2024-01-05' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateBiomarkerResultDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assay method', example: 'IHC' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBiomarkerResultDto.prototype, "assayMethod", void 0);
//# sourceMappingURL=create-treatment-plan.dto.js.map