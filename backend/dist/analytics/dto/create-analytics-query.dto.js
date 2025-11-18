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
exports.ReportScheduleDto = exports.GenerateAnalyticsReportDto = exports.DashboardSettingsDto = exports.DashboardLayoutDto = exports.CreateExecutiveDashboardDto = exports.MonitoringScheduleDto = exports.MonitoringActionDto = exports.MonitoringConditionDto = exports.CreateMonitoringRuleDto = exports.MLFeatureDto = exports.CreateMLPredictionDto = exports.DateRangeDto = exports.AnalyticsFilterDto = exports.CreateAnalyticsQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateAnalyticsQueryDto {
}
exports.CreateAnalyticsQueryDto = CreateAnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric to analyze', example: 'patient_volume' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsQueryDto.prototype, "metric", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dimensions for grouping',
        example: ['cancer_type', 'stage', 'treatment_type'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAnalyticsQueryDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filters to apply',
        type: [AnalyticsFilterDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AnalyticsFilterDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAnalyticsQueryDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date range for the query',
        type: DateRangeDto
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DateRangeDto),
    __metadata("design:type", DateRangeDto)
], CreateAnalyticsQueryDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Aggregation function',
        enum: ['sum', 'avg', 'count', 'min', 'max', 'median']
    }),
    (0, class_validator_1.IsEnum)(['sum', 'avg', 'count', 'min', 'max', 'median']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsQueryDto.prototype, "aggregation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fields to group by', example: ['cancer_type', 'month'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAnalyticsQueryDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort field', example: 'patient_volume' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAnalyticsQueryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit results', example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAnalyticsQueryDto.prototype, "limit", void 0);
class AnalyticsFilterDto {
}
exports.AnalyticsFilterDto = AnalyticsFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Field to filter on', example: 'cancer_type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsFilterDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison operator',
        enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'regex']
    }),
    (0, class_validator_1.IsEnum)(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'regex']),
    __metadata("design:type", String)
], AnalyticsFilterDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter value', example: 'Breast' }),
    __metadata("design:type", Object)
], AnalyticsFilterDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logical operator for multiple filters',
        enum: ['and', 'or']
    }),
    (0, class_validator_1.IsEnum)(['and', 'or']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsFilterDto.prototype, "logicalOperator", void 0);
class DateRangeDto {
}
exports.DateRangeDto = DateRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DateRangeDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', example: '2024-12-31' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DateRangeDto.prototype, "endDate", void 0);
class CreateMLPredictionDto {
}
exports.CreateMLPredictionDto = CreateMLPredictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ML model type',
        enum: ['survival', 'response', 'toxicity', 'readmission', 'prognosis']
    }),
    (0, class_validator_1.IsEnum)(['survival', 'response', 'toxicity', 'readmission', 'prognosis']),
    __metadata("design:type", String)
], CreateMLPredictionDto.prototype, "modelType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMLPredictionDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Treatment plan ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMLPredictionDto.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Input features for the ML model',
        type: [MLFeatureDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MLFeatureDto),
    __metadata("design:type", Array)
], CreateMLPredictionDto.prototype, "features", void 0);
class MLFeatureDto {
}
exports.MLFeatureDto = MLFeatureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature name', example: 'age' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MLFeatureDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature value', example: 65 }),
    __metadata("design:type", Object)
], MLFeatureDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Feature importance', example: 0.35 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MLFeatureDto.prototype, "importance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Feature category',
        enum: ['demographic', 'clinical', 'laboratory', 'treatment', 'imaging', 'genomic']
    }),
    (0, class_validator_1.IsEnum)(['demographic', 'clinical', 'laboratory', 'treatment', 'imaging', 'genomic']),
    __metadata("design:type", String)
], MLFeatureDto.prototype, "category", void 0);
class CreateMonitoringRuleDto {
}
exports.CreateMonitoringRuleDto = CreateMonitoringRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule name', example: 'High Toxicity Rate Alert' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMonitoringRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule description', example: 'Alert when toxicity rate exceeds threshold' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMonitoringRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rule category',
        enum: ['clinical', 'operational', 'quality', 'system', 'security']
    }),
    (0, class_validator_1.IsEnum)(['clinical', 'operational', 'quality', 'system', 'security']),
    __metadata("design:type", String)
], CreateMonitoringRuleDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monitoring condition', type: MonitoringConditionDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MonitoringConditionDto),
    __metadata("design:type", MonitoringConditionDto)
], CreateMonitoringRuleDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Actions to take when condition is met',
        type: [MonitoringActionDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MonitoringActionDto),
    __metadata("design:type", Array)
], CreateMonitoringRuleDto.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether rule is enabled' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMonitoringRuleDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alert severity',
        enum: ['info', 'warning', 'error', 'critical']
    }),
    (0, class_validator_1.IsEnum)(['info', 'warning', 'error', 'critical']),
    __metadata("design:type", String)
], CreateMonitoringRuleDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cooldown period in minutes', example: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMonitoringRuleDto.prototype, "cooldownPeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Monitoring schedule', type: MonitoringScheduleDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MonitoringScheduleDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", MonitoringScheduleDto)
], CreateMonitoringRuleDto.prototype, "schedule", void 0);
class MonitoringConditionDto {
}
exports.MonitoringConditionDto = MonitoringConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metric to monitor', example: 'toxicity_rate' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MonitoringConditionDto.prototype, "metric", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comparison operator',
        enum: ['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'in', 'nin', 'between', 'outside']
    }),
    (0, class_validator_1.IsEnum)(['gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'in', 'nin', 'between', 'outside']),
    __metadata("design:type", String)
], MonitoringConditionDto.prototype, "operator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Threshold value', example: 0.4 }),
    __metadata("design:type", Object)
], MonitoringConditionDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time window in minutes', example: 60 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MonitoringConditionDto.prototype, "timeWindow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Aggregation function',
        enum: ['avg', 'sum', 'count', 'min', 'max']
    }),
    (0, class_validator_1.IsEnum)(['avg', 'sum', 'count', 'min', 'max']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MonitoringConditionDto.prototype, "aggregation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field to group by', example: 'patient_id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MonitoringConditionDto.prototype, "groupBy", void 0);
class MonitoringActionDto {
}
exports.MonitoringActionDto = MonitoringActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action type',
        enum: ['alert', 'email', 'sms', 'webhook', 'notification', 'escalation']
    }),
    (0, class_validator_1.IsEnum)(['alert', 'email', 'sms', 'webhook', 'notification', 'escalation']),
    __metadata("design:type", String)
], MonitoringActionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action parameters', example: { recipients: ['admin@hospital.com'], subject: 'High toxicity alert' } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MonitoringActionDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether action is enabled' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MonitoringActionDto.prototype, "enabled", void 0);
class MonitoringScheduleDto {
}
exports.MonitoringScheduleDto = MonitoringScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Schedule type',
        enum: ['continuous', 'interval', 'cron']
    }),
    (0, class_validator_1.IsEnum)(['continuous', 'interval', 'cron']),
    __metadata("design:type", String)
], MonitoringScheduleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Interval in minutes', example: 15 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MonitoringScheduleDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cron expression', example: '0 */6 * * *' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MonitoringScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone', example: 'Asia/Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MonitoringScheduleDto.prototype, "timezone", void 0);
class CreateExecutiveDashboardDto {
}
exports.CreateExecutiveDashboardDto = CreateExecutiveDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard name', example: 'Executive Overview' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExecutiveDashboardDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard description', example: 'Key metrics and KPIs for executive leadership' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExecutiveDashboardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dashboard layout configuration', type: DashboardLayoutDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DashboardLayoutDto),
    __metadata("design:type", DashboardLayoutDto)
], CreateExecutiveDashboardDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date range for dashboard data', type: DateRangeDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DateRangeDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", DateRangeDto)
], CreateExecutiveDashboardDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Refresh interval in minutes', example: 15 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExecutiveDashboardDto.prototype, "refreshInterval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether dashboard is shared' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExecutiveDashboardDto.prototype, "shared", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard owners', example: ['user-123'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateExecutiveDashboardDto.prototype, "owners", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard viewers', example: ['user-456', 'user-789'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateExecutiveDashboardDto.prototype, "viewers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dashboard settings', type: DashboardSettingsDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DashboardSettingsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", DashboardSettingsDto)
], CreateExecutiveDashboardDto.prototype, "settings", void 0);
class DashboardLayoutDto {
}
exports.DashboardLayoutDto = DashboardLayoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Layout type',
        enum: ['grid', 'flex', 'custom']
    }),
    (0, class_validator_1.IsEnum)(['grid', 'flex', 'custom']),
    __metadata("design:type", String)
], DashboardLayoutDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of columns', example: 12 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DashboardLayoutDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Responsive breakpoints' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DashboardLayoutDto.prototype, "breakpoints", void 0);
class DashboardSettingsDto {
}
exports.DashboardSettingsDto = DashboardSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Auto-refresh enabled' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardSettingsDto.prototype, "autoRefresh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Theme',
        enum: ['light', 'dark', 'auto']
    }),
    (0, class_validator_1.IsEnum)(['light', 'dark', 'auto']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardSettingsDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Language', example: 'en' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardSettingsDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone', example: 'Asia/Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardSettingsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default export format',
        enum: ['pdf', 'excel', 'png', 'csv']
    }),
    (0, class_validator_1.IsEnum)(['pdf', 'excel', 'png', 'csv']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardSettingsDto.prototype, "exportFormat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable notifications' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DashboardSettingsDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Drill-down mode',
        enum: ['modal', 'page', 'inline']
    }),
    (0, class_validator_1.IsEnum)(['modal', 'page', 'inline']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DashboardSettingsDto.prototype, "drillDownMode", void 0);
class GenerateAnalyticsReportDto {
}
exports.GenerateAnalyticsReportDto = GenerateAnalyticsReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report type',
        enum: ['treatment_outcomes', 'quality_metrics', 'operational_efficiency', 'financial_analysis']
    }),
    (0, class_validator_1.IsEnum)(['treatment_outcomes', 'quality_metrics', 'operational_efficiency', 'financial_analysis']),
    __metadata("design:type", String)
], GenerateAnalyticsReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateAnalyticsReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Report description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateAnalyticsReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Patient IDs to include' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateAnalyticsReportDto.prototype, "patientIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Treatment plan IDs to include' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateAnalyticsReportDto.prototype, "treatmentPlanIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date range for report', type: DateRangeDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DateRangeDto),
    __metadata("design:type", DateRangeDto)
], GenerateAnalyticsReportDto.prototype, "dateRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional report parameters' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GenerateAnalyticsReportDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Output format',
        enum: ['json', 'pdf', 'excel', 'csv']
    }),
    (0, class_validator_1.IsEnum)(['json', 'pdf', 'excel', 'csv']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GenerateAnalyticsReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email recipients for report delivery' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GenerateAnalyticsReportDto.prototype, "emailRecipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule report generation', type: ReportScheduleDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReportScheduleDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ReportScheduleDto)
], GenerateAnalyticsReportDto.prototype, "schedule", void 0);
class ReportScheduleDto {
}
exports.ReportScheduleDto = ReportScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Schedule type',
        enum: ['once', 'recurring']
    }),
    (0, class_validator_1.IsEnum)(['once', 'recurring']),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Frequency for recurring reports',
        enum: ['daily', 'weekly', 'monthly', 'quarterly']
    }),
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'quarterly']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cron expression for complex scheduling' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone for scheduling', example: 'Asia/Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for recurring schedule' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for recurring schedule' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "endDate", void 0);
//# sourceMappingURL=create-analytics-query.dto.js.map