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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedApprovalDto = exports.EnhancedSearchResearchDto = exports.EnhancedUpdateResearchRequestDto = exports.EnhancedCreateCollaborationDto = exports.EnhancedCreateResearchRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class EnhancedCreateResearchRequestDto {
}
exports.EnhancedCreateResearchRequestDto = EnhancedCreateResearchRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(10, 200, { message: 'Title must be between 10 and 200 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_.,:;()]+$/, { message: 'Title contains invalid characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed research description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(50, 2000, { message: 'Description must be between 50 and 2000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Principal investigator ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "principalInvestigatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.StudyType, description: 'Type of study' }),
    (0, class_validator_1.IsEnum)(client_1.StudyType),
    __metadata("design:type", typeof (_a = typeof client_1.StudyType !== "undefined" && client_1.StudyType) === "function" ? _a : Object)
], EnhancedCreateResearchRequestDto.prototype, "studyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research objectives' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Objectives must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research methodology' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(50, 1500, { message: 'Methodology must be between 50 and 1500 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "methodology", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Inclusion criteria must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "inclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Exclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Exclusion criteria must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "exclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000, { message: 'Sample size cannot exceed 1,000,000' }),
    __metadata("design:type", Number)
], EnhancedCreateResearchRequestDto.prototype, "sampleSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Study duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(120, { message: 'Study duration cannot exceed 120 months (10 years)' }),
    __metadata("design:type", Number)
], EnhancedCreateResearchRequestDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether ethics approval is required' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnhancedCreateResearchRequestDto.prototype, "requiresEthicsApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data requested (structured JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\s*\{[\s\S]*\}\s*$/, { message: 'Data requested must be valid JSON format' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "dataRequested", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidentiality requirements' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 500, { message: 'Confidentiality requirements must be between 10 and 500 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "confidentialityRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Funding source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 200, { message: 'Funding source must be between 5 and 200 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_.,]+$/, { message: 'Funding source contains invalid characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "fundingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected outcomes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Expected outcomes must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "expectedOutcomes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk assessment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Risk assessment must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data retention period in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(360, { message: 'Data retention period cannot exceed 360 months (30 years)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedCreateResearchRequestDto.prototype, "dataRetentionPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ResearchPriority, description: 'Research priority' }),
    (0, class_validator_1.IsEnum)(client_1.ResearchPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof client_1.ResearchPriority !== "undefined" && client_1.ResearchPriority) === "function" ? _b : Object)
], EnhancedCreateResearchRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collaborator IDs (JSON array)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\s*\[[\s\S]*\]\s*$/, { message: 'Collaborators must be valid JSON array format' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "collaborators", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact email for research' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "contactEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research website' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "researchWebsite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Keywords for research categorization' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_,]+$/, { message: 'Keywords contain invalid characters' }),
    __metadata("design:type", String)
], EnhancedCreateResearchRequestDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [EnhancedCreateCollaborationDto], description: 'Collaborations' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EnhancedCreateCollaborationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EnhancedCreateResearchRequestDto.prototype, "collaborationDetails", void 0);
class EnhancedCreateCollaborationDto {
}
exports.EnhancedCreateCollaborationDto = EnhancedCreateCollaborationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Collaborator user ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "collaboratorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.CollaborationRole, description: 'Collaboration role' }),
    (0, class_validator_1.IsEnum)(client_1.CollaborationRole),
    __metadata("design:type", typeof (_c = typeof client_1.CollaborationRole !== "undefined" && client_1.CollaborationRole) === "function" ? _c : Object)
], EnhancedCreateCollaborationDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Responsibilities' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 500, { message: 'Responsibilities must be between 10 and 500 characters' }),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affiliation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 200, { message: 'Affiliation must be between 5 and 200 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_.,()]+$/, { message: 'Affiliation contains invalid characters' }),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "affiliation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+?[\d\s\-\(\)]+$/, { message: 'Phone number format is invalid' }),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expertise' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 300, { message: 'Expertise must be between 10 and 300 characters' }),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "expertise", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conflict of interest' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 1000, { message: 'Conflict of interest must be between 10 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedCreateCollaborationDto.prototype, "conflictOfInterest", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DataAccessLevel, description: 'Data access level' }),
    (0, class_validator_1.IsEnum)(client_1.DataAccessLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof client_1.DataAccessLevel !== "undefined" && client_1.DataAccessLevel) === "function" ? _d : Object)
], EnhancedCreateCollaborationDto.prototype, "dataAccessLevel", void 0);
class EnhancedUpdateResearchRequestDto {
}
exports.EnhancedUpdateResearchRequestDto = EnhancedUpdateResearchRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 200, { message: 'Title must be between 10 and 200 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9\s\-_.,:;()]+$/, { message: 'Title contains invalid characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(50, 2000, { message: 'Description must be between 50 and 2000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research objectives' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Objectives must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research methodology' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(50, 1500, { message: 'Methodology must be between 50 and 1500 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "methodology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Inclusion criteria must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "inclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exclusion criteria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Exclusion criteria must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "exclusionCriteria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000000, { message: 'Sample size cannot exceed 1,000,000' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedUpdateResearchRequestDto.prototype, "sampleSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Study duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(120, { message: 'Study duration cannot exceed 120 months (10 years)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedUpdateResearchRequestDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected outcomes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Expected outcomes must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "expectedOutcomes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Risk assessment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(20, 1000, { message: 'Risk assessment must be between 20 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "riskAssessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data retention period in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(360, { message: 'Data retention period cannot exceed 360 months (30 years)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedUpdateResearchRequestDto.prototype, "dataRetentionPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 1000, { message: 'Notes must be between 5 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedUpdateResearchRequestDto.prototype, "notes", void 0);
class EnhancedSearchResearchDto {
}
exports.EnhancedSearchResearchDto = EnhancedSearchResearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search term for title/description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 100, { message: 'Search term must be between 3 and 100 characters' }),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by status' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[A-Z_]+$/, { message: 'Status must be uppercase with underscores' }),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by study type' }),
    (0, class_validator_1.IsEnum)(client_1.StudyType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_e = typeof client_1.StudyType !== "undefined" && client_1.StudyType) === "function" ? _e : Object)
], EnhancedSearchResearchDto.prototype, "studyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by principal investigator ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "principalInvestigatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by center ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date filter' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date filter' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000, { message: 'Page number cannot exceed 1000' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedSearchResearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Results per page' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100, { message: 'Results per page cannot exceed 100' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EnhancedSearchResearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort field' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z_]+$/, { message: 'Sort field must contain only letters and underscores' }),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^(asc|desc)$/i, { message: 'Sort order must be asc or desc' }),
    __metadata("design:type", String)
], EnhancedSearchResearchDto.prototype, "sortOrder", void 0);
class EnhancedApprovalDto {
}
exports.EnhancedApprovalDto = EnhancedApprovalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Approver ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnhancedApprovalDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval comments' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 1000, { message: 'Comments must be between 10 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedApprovalDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conditions for approval' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(10, 1000, { message: 'Conditions must be between 10 and 1000 characters' }),
    __metadata("design:type", String)
], EnhancedApprovalDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ethics number (if applicable)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[A-Z0-9\-_\/]+$/, { message: 'Ethics number contains invalid characters' }),
    __metadata("design:type", String)
], EnhancedApprovalDto.prototype, "ethicsNumber", void 0);
//# sourceMappingURL=enhanced-research-request.dto.js.map