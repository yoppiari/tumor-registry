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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchGeographicDataDto = exports.SearchImpactMetricDto = exports.SearchPublicationDto = exports.SearchCollaborationDto = exports.SearchResearchRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class SearchResearchRequestDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.sortBy = 'createdAt';
        this.sortOrder = 'desc';
    }
}
exports.SearchResearchRequestDto = SearchResearchRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by title or description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ResearchRequestStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsEnum)(client_1.ResearchRequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof client_1.ResearchRequestStatus !== "undefined" && client_1.ResearchRequestStatus) === "function" ? _a : Object)
], SearchResearchRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StudyType, description: 'Filter by study type' }),
    (0, class_validator_1.IsEnum)(client_1.StudyType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof client_1.StudyType !== "undefined" && client_1.StudyType) === "function" ? _b : Object)
], SearchResearchRequestDto.prototype, "studyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.EthicsStatus, description: 'Filter by ethics status' }),
    (0, class_validator_1.IsEnum)(client_1.EthicsStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof client_1.EthicsStatus !== "undefined" && client_1.EthicsStatus) === "function" ? _c : Object)
], SearchResearchRequestDto.prototype, "ethicsStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ResearchPriority, description: 'Filter by priority' }),
    (0, class_validator_1.IsEnum)(client_1.ResearchPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof client_1.ResearchPriority !== "undefined" && client_1.ResearchPriority) === "function" ? _d : Object)
], SearchResearchRequestDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by principal investigator ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "principalInvestigatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by creator ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by funding source' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "fundingSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by province' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "minSampleSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum sample size' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "maxSampleSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "minDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum duration in months' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "maxDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether ethics approval is required' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], SearchResearchRequestDto.prototype, "requiresEthicsApproval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submitted after date' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "submittedAfter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submitted before date' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "submittedBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchResearchRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort field' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort direction' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchResearchRequestDto.prototype, "sortOrder", void 0);
class SearchCollaborationDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.SearchCollaborationDto = SearchCollaborationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchCollaborationDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collaborator user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchCollaborationDto.prototype, "collaboratorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.CollaborationStatus, description: 'Filter by status' }),
    (0, class_validator_1.IsEnum)(client_1.CollaborationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_e = typeof client_1.CollaborationStatus !== "undefined" && client_1.CollaborationStatus) === "function" ? _e : Object)
], SearchCollaborationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Collaborator email' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchCollaborationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Affiliation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchCollaborationDto.prototype, "affiliation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchCollaborationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchCollaborationDto.prototype, "limit", void 0);
class SearchPublicationDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.SearchPublicationDto = SearchPublicationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPublicationDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search by title or abstract' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPublicationDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PublicationType, description: 'Filter by publication type' }),
    (0, class_validator_1.IsEnum)(client_1.PublicationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_f = typeof client_1.PublicationType !== "undefined" && client_1.PublicationType) === "function" ? _f : Object)
], SearchPublicationDto.prototype, "publicationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Journal name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPublicationDto.prototype, "journal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DOI' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPublicationDto.prototype, "doi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'PMID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPublicationDto.prototype, "pmid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Open access' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], SearchPublicationDto.prototype, "openAccess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Year of publication' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchPublicationDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchPublicationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchPublicationDto.prototype, "limit", void 0);
class SearchImpactMetricDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.SearchImpactMetricDto = SearchImpactMetricDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchImpactMetricDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ImpactMetricType, description: 'Filter by metric type' }),
    (0, class_validator_1.IsEnum)(client_1.ImpactMetricType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_g = typeof client_1.ImpactMetricType !== "undefined" && client_1.ImpactMetricType) === "function" ? _g : Object)
], SearchImpactMetricDto.prototype, "metricType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchImpactMetricDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Verified status' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], SearchImpactMetricDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date from' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchImpactMetricDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchImpactMetricDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchImpactMetricDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchImpactMetricDto.prototype, "limit", void 0);
class SearchGeographicDataDto {
    constructor() {
        this.page = 1;
        this.limit = 100;
    }
}
exports.SearchGeographicDataDto = SearchGeographicDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Province' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Regency' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "regency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancer type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "cancerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Year' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Month', minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gender' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Age group' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "ageGroup", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Urban/rural' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchGeographicDataDto.prototype, "urbanRural", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "minCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "maxCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 1000, default: 100 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchGeographicDataDto.prototype, "limit", void 0);
//# sourceMappingURL=search-research.dto.js.map