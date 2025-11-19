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
exports.ScheduleReportDto = exports.GenerateReportDto = exports.OrderByDto = exports.ReportFilterDto = exports.ReportFormat = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "PDF";
    ReportFormat["EXCEL"] = "EXCEL";
    ReportFormat["CSV"] = "CSV";
    ReportFormat["JSON"] = "JSON";
    ReportFormat["HTML"] = "HTML";
    ReportFormat["POWERPOINT"] = "POWERPOINT";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
class ReportFilterDto {
}
exports.ReportFilterDto = ReportFilterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportFilterDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportFilterDto.prototype, "operator", void 0);
class OrderByDto {
}
exports.OrderByDto = OrderByDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderByDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderByDto.prototype, "direction", void 0);
class GenerateReportDto {
}
exports.GenerateReportDto = GenerateReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GenerateReportDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportFilterDto),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderByDto),
    __metadata("design:type", Array)
], GenerateReportDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GenerateReportDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GenerateReportDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateReportDto.prototype, "generatedBy", void 0);
class ScheduleReportDto {
}
exports.ScheduleReportDto = ScheduleReportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScheduleReportDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ScheduleReportDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], ScheduleReportDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleReportDto.prototype, "createdBy", void 0);
//# sourceMappingURL=generate-report.dto.js.map