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
exports.UpdateResponseAssessmentDto = exports.UpdateTreatmentPlanDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateTreatmentPlanDto {
}
exports.UpdateTreatmentPlanDto = UpdateTreatmentPlanDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTreatmentPlanDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected end date', example: '2024-06-15' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateTreatmentPlanDto.prototype, "expectedEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total number of cycles', example: 6 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTreatmentPlanDto.prototype, "totalCycles", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment status',
        enum: ['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']
    }),
    (0, class_validator_1.IsEnum)(['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTreatmentPlanDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment phase',
        enum: ['initial', 'consolidation', 'maintenance', 'follow_up']
    }),
    (0, class_validator_1.IsEnum)(['initial', 'consolidation', 'maintenance', 'follow_up']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTreatmentPlanDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Actual end date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateTreatmentPlanDto.prototype, "actualEndDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Response assessment', type: UpdateResponseAssessmentDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateResponseAssessmentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", UpdateResponseAssessmentDto)
], UpdateTreatmentPlanDto.prototype, "responseAssessment", void 0);
class UpdateResponseAssessmentDto {
}
exports.UpdateResponseAssessmentDto = UpdateResponseAssessmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assessment date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateResponseAssessmentDto.prototype, "assessmentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Response criteria',
        enum: ['RECIST_1.1', 'WHO', 'PERCIST', 'clinical']
    }),
    (0, class_validator_1.IsEnum)(['RECIST_1.1', 'WHO', 'PERCIST', 'clinical']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "responseCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Overall response',
        enum: ['CR', 'PR', 'SD', 'PD']
    }),
    (0, class_validator_1.IsEnum)(['CR', 'PR', 'SD', 'PD']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "overallResponse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Target lesion response' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "targetLesionResponse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Non-target lesion response' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "nonTargetLesionResponse", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'New lesions detected' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateResponseAssessmentDto.prototype, "newLesions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Progression date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateResponseAssessmentDto.prototype, "progressionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assessed by' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResponseAssessmentDto.prototype, "assessedBy", void 0);
//# sourceMappingURL=update-treatment-plan.dto.js.map