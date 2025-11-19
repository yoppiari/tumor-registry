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
exports.CreateScheduledTaskDto = exports.TaskType = void 0;
const class_validator_1 = require("class-validator");
var TaskType;
(function (TaskType) {
    TaskType["BACKUP"] = "BACKUP";
    TaskType["CLEANUP"] = "CLEANUP";
    TaskType["REPORT_GENERATION"] = "REPORT_GENERATION";
    TaskType["DATA_SYNC"] = "DATA_SYNC";
    TaskType["HEALTH_CHECK"] = "HEALTH_CHECK";
    TaskType["NOTIFICATION"] = "NOTIFICATION";
    TaskType["CACHE_REFRESH"] = "CACHE_REFRESH";
    TaskType["LOG_ROTATION"] = "LOG_ROTATION";
    TaskType["INDEX_REBUILD"] = "INDEX_REBUILD";
    TaskType["STATISTICS_UPDATE"] = "STATISTICS_UPDATE";
    TaskType["COMPLIANCE_CHECK"] = "COMPLIANCE_CHECK";
    TaskType["MAINTENANCE"] = "MAINTENANCE";
    TaskType["CUSTOM_SCRIPT"] = "CUSTOM_SCRIPT";
})(TaskType || (exports.TaskType = TaskType = {}));
class CreateScheduledTaskDto {
}
exports.CreateScheduledTaskDto = CreateScheduledTaskDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(TaskType),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "taskType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "timezone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduledTaskDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduledTaskDto.prototype, "concurrency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduledTaskDto.prototype, "timeout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduledTaskDto.prototype, "retryAttempts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduledTaskDto.prototype, "retryDelay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateScheduledTaskDto.prototype, "maxRunTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateScheduledTaskDto.prototype, "configuration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduledTaskDto.prototype, "createdBy", void 0);
//# sourceMappingURL=create-scheduled-task.dto.js.map