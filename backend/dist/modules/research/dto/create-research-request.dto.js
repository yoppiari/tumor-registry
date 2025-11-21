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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateResearchRequestDto = exports.CreateResearchRequestDto = exports.CreateCollaborationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateCollaborationDto {
}
exports.CreateCollaborationDto = CreateCollaborationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Collaborator user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "collaboratorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.CollaborationRole, description: 'Collaboration role' }),
    (0, class_validator_1.IsEnum)(client_1.CollaborationRole),
    __metadata("design:type", typeof (_a = typeof client_1.CollaborationRole !== "undefined" && client_1.CollaborationRole) === "function" ? _a : Object)
], CreateCollaborationDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Responsibilities' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affiliation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "affiliation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expertise' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "expertise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conflict of interest' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollaborationDto.prototype, "conflictOfInterest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DataAccessLevel, description: 'Data access level' }),
    (0, class_validator_1.IsEnum)(client_1.DataAccessLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof client_1.DataAccessLevel !== "undefined" && client_1.DataAccessLevel) === "function" ? _b : Object)
], CreateCollaborationDto.prototype, "dataAccessLevel", void 0);
class CreateResearchRequestDto {
}
exports.CreateResearchRequestDto = CreateResearchRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed research description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Principal investigator ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "principalInvestigatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StudyType, description: 'Type of study' }),
    (0, class_validator_1.IsEnum)(client_1.StudyType),
    __metadata("design:type", typeof (_c = typeof client_1.StudyType !== "undefined" && client_1.StudyType) === "function" ? _c : Object)
], CreateResearchRequestDto.prototype, "studyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research objectives' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research methodology' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "methodology", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "inclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Exclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "exclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateResearchRequestDto.prototype, "sampleSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateResearchRequestDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether ethics approval is required' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateResearchRequestDto.prototype, "requiresEthicsApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data requested (JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "dataRequested", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidentiality requirements' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "confidentialityRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Funding source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "fundingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected outcomes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "expectedOutcomes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk assessment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data retention period in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(360),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateResearchRequestDto.prototype, "dataRetentionPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ResearchPriority, description: 'Research priority' }),
    (0, class_validator_1.IsEnum)(client_1.ResearchPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof client_1.ResearchPriority !== "undefined" && client_1.ResearchPriority) === "function" ? _d : Object)
], CreateResearchRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collaborator IDs (JSON array)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateResearchRequestDto.prototype, "collaborators", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateCollaborationDto], description: 'Collaborations' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateCollaborationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateResearchRequestDto.prototype, "collaborationDetails", void 0);
class UpdateResearchRequestDto {
}
exports.UpdateResearchRequestDto = UpdateResearchRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research objectives' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research methodology' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "methodology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "inclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "exclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateResearchRequestDto.prototype, "sampleSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(120),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateResearchRequestDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected outcomes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "expectedOutcomes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk assessment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data retention period in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(360),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateResearchRequestDto.prototype, "dataRetentionPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateResearchRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-research-request.dto.js.map