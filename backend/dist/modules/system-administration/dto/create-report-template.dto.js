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
exports.CreateReportTemplateDto = exports.DataAccessLevel = exports.TemplateType = exports.ReportType = void 0;
const class_validator_1 = require("class-validator");
var ReportType;
(function (ReportType) {
    ReportType["DAILY_SUMMARY"] = "DAILY_SUMMARY";
    ReportType["WEEKLY_ANALYTICS"] = "WEEKLY_ANALYTICS";
    ReportType["MONTHLY_PERFORMANCE"] = "MONTHLY_PERFORMANCE";
    ReportType["QUARTERLY_REVIEW"] = "QUARTERLY_REVIEW";
    ReportType["ANNUAL_REPORT"] = "ANNUAL_REPORT";
    ReportType["AD_HOC_ANALYSIS"] = "AD_HOC_ANALYSIS";
    ReportType["RESEARCH_IMPACT"] = "RESEARCH_IMPACT";
    ReportType["QUALITY_METRICS"] = "QUALITY_METRICS";
    ReportType["EXECUTIVE_BRIEFING"] = "EXECUTIVE_BRIEFING";
})(ReportType || (exports.ReportType = ReportType = {}));
var TemplateType;
(function (TemplateType) {
    TemplateType["STANDARD"] = "STANDARD";
    TemplateType["CUSTOM"] = "CUSTOM";
    TemplateType["SYSTEM"] = "SYSTEM";
    TemplateType["USER_DEFINED"] = "USER_DEFINED";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
var DataAccessLevel;
(function (DataAccessLevel) {
    DataAccessLevel["LIMITED"] = "LIMITED";
    DataAccessLevel["AGGREGATE_ONLY"] = "AGGREGATE_ONLY";
    DataAccessLevel["DEIDENTIFIED"] = "DEIDENTIFIED";
    DataAccessLevel["LIMITED_IDENTIFIABLE"] = "LIMITED_IDENTIFIABLE";
    DataAccessLevel["FULL_ACCESS"] = "FULL_ACCESS";
})(DataAccessLevel || (exports.DataAccessLevel = DataAccessLevel = {}));
class CreateReportTemplateDto {
}
exports.CreateReportTemplateDto = CreateReportTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportType),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TemplateType),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "templateType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "dataSource", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "styling", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "aggregations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateReportTemplateDto.prototype, "charts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DataAccessLevel),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "accessLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReportTemplateDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReportTemplateDto.prototype, "isPublic", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportTemplateDto.prototype, "centerId", void 0);
//# sourceMappingURL=create-report-template.dto.js.map