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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeographicVisualizationDto = exports.AggregateDataQueryDto = exports.SearchDataAccessSessionDto = exports.UpdateDataAccessSessionDto = exports.CreateDataAccessSessionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateDataAccessSessionDto {
}
exports.CreateDataAccessSessionDto = CreateDataAccessSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID accessing data' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SessionType, description: 'Type of session' }),
    (0, class_validator_1.IsEnum)(client_1.SessionType),
    __metadata("design:type", typeof (_a = typeof client_1.SessionType !== "undefined" && client_1.SessionType) === "function" ? _a : Object)
], CreateDataAccessSessionDto.prototype, "sessionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DataAccessLevel, description: 'Access level' }),
    (0, class_validator_1.IsEnum)(client_1.DataAccessLevel),
    __metadata("design:type", typeof (_b = typeof client_1.DataAccessLevel !== "undefined" && client_1.DataAccessLevel) === "function" ? _b : Object)
], CreateDataAccessSessionDto.prototype, "accessLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session purpose' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User agent' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval reference' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDataAccessSessionDto.prototype, "approvalReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable automated monitoring' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDataAccessSessionDto.prototype, "automatedMonitoring", void 0);
class UpdateDataAccessSessionDto {
}
exports.UpdateDataAccessSessionDto = UpdateDataAccessSessionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDataAccessSessionDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duration in minutes' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDataAccessSessionDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data accessed (JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDataAccessSessionDto.prototype, "dataAccessed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Queries executed (JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDataAccessSessionDto.prototype, "queriesExecuted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ComplianceStatus, description: 'Compliance status' }),
    (0, class_validator_1.IsEnum)(client_1.ComplianceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof client_1.ComplianceStatus !== "undefined" && client_1.ComplianceStatus) === "function" ? _c : Object)
], UpdateDataAccessSessionDto.prototype, "complianceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Violation reason' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDataAccessSessionDto.prototype, "violationReason", void 0);
class SearchDataAccessSessionDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.SearchDataAccessSessionDto = SearchDataAccessSessionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDataAccessSessionDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDataAccessSessionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SessionType, description: 'Session type' }),
    (0, class_validator_1.IsEnum)(client_1.SessionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof client_1.SessionType !== "undefined" && client_1.SessionType) === "function" ? _d : Object)
], SearchDataAccessSessionDto.prototype, "sessionType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DataAccessLevel, description: 'Access level' }),
    (0, class_validator_1.IsEnum)(client_1.DataAccessLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_e = typeof client_1.DataAccessLevel !== "undefined" && client_1.DataAccessLevel) === "function" ? _e : Object)
], SearchDataAccessSessionDto.prototype, "accessLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ComplianceStatus, description: 'Compliance status' }),
    (0, class_validator_1.IsEnum)(client_1.ComplianceStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_f = typeof client_1.ComplianceStatus !== "undefined" && client_1.ComplianceStatus) === "function" ? _f : Object)
], SearchDataAccessSessionDto.prototype, "complianceStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDataAccessSessionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date from' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDataAccessSessionDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchDataAccessSessionDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchDataAccessSessionDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchDataAccessSessionDto.prototype, "limit", void 0);
class AggregateDataQueryDto {
    constructor() {
        this.includeMortality = false;
        this.includeSurvival = false;
        this.includeTrends = false;
        this.privacyThreshold = 5;
        this.aggregateFunction = 'sum';
        this.outputFormat = 'json';
    }
}
exports.AggregateDataQueryDto = AggregateDataQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancer types to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "cancerTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Years to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "years", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provinces to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "provinces", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Age groups to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "ageGroups", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Genders to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "genders", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Stages to include' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "stages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include mortality data' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AggregateDataQueryDto.prototype, "includeMortality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include survival data' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AggregateDataQueryDto.prototype, "includeSurvival", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include trends' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AggregateDataQueryDto.prototype, "includeTrends", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum case count for privacy' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AggregateDataQueryDto.prototype, "privacyThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group by field' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Aggregate function' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "aggregateFunction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Output format' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AggregateDataQueryDto.prototype, "outputFormat", void 0);
class GeographicVisualizationDto {
    constructor() {
        this.metric = 'count';
        this.mapType = 'choropleth';
        this.colorScheme = 'blues';
        this.showLabels = true;
        this.privacyThreshold = 5;
        this.includeCoordinates = true;
    }
}
exports.GeographicVisualizationDto = GeographicVisualizationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Province' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Regency' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "regency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancer type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "cancerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Year' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GeographicVisualizationDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Month', minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GeographicVisualizationDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metric to visualize' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "metric", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Map type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "mapType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Color scheme' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GeographicVisualizationDto.prototype, "colorScheme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show labels' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GeographicVisualizationDto.prototype, "showLabels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum case count for privacy' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GeographicVisualizationDto.prototype, "privacyThreshold", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include coordinates' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GeographicVisualizationDto.prototype, "includeCoordinates", void 0);
//# sourceMappingURL=data-access.dto.js.map