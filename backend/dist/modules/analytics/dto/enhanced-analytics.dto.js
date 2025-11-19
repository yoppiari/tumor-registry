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
exports.ErrorResponseDto = exports.AnalyticsApiResponseDto = exports.ExportDataDto = exports.AlertConfigurationDto = exports.ResearchAnalyticsDto = exports.TrendAnalysisDto = exports.PerformanceMetricsDto = exports.AnalyticsConfigDto = exports.BenchmarkComparisonDto = exports.ReportSchedulingDto = exports.ReportGenerationDto = exports.EventsQueryDto = exports.HealthCheckQueryDto = exports.DataQualityQueryDto = exports.CacheStatsQueryDto = exports.InvalidateCacheDto = exports.ResearchImpactQueryDto = exports.CancerTypeTrendsQueryDto = exports.PredictiveTrendsQueryDto = exports.CenterMetricsQueryDto = exports.PerformanceBenchmarkQueryDto = exports.NationalIntelligenceQueryDto = exports.ExecutiveDashboardQueryDto = exports.ReportFormat = exports.ImpactType = exports.BenchmarkPeriod = exports.GeographicLevel = exports.TimeRange = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TimeRange;
(function (TimeRange) {
    TimeRange["SEVEN_DAYS"] = "7d";
    TimeRange["THIRTY_DAYS"] = "30d";
    TimeRange["NINETY_DAYS"] = "90d";
    TimeRange["SIX_MONTHS"] = "6m";
    TimeRange["ONE_YEAR"] = "1y";
})(TimeRange || (exports.TimeRange = TimeRange = {}));
var GeographicLevel;
(function (GeographicLevel) {
    GeographicLevel["NATIONAL"] = "national";
    GeographicLevel["PROVINCE"] = "province";
    GeographicLevel["REGENCY"] = "regency";
})(GeographicLevel || (exports.GeographicLevel = GeographicLevel = {}));
var BenchmarkPeriod;
(function (BenchmarkPeriod) {
    BenchmarkPeriod["MONTHLY"] = "monthly";
    BenchmarkPeriod["QUARTERLY"] = "quarterly";
    BenchmarkPeriod["YEARLY"] = "yearly";
})(BenchmarkPeriod || (exports.BenchmarkPeriod = BenchmarkPeriod = {}));
var ImpactType;
(function (ImpactType) {
    ImpactType["ALL"] = "all";
    ImpactType["PUBLICATIONS"] = "publications";
    ImpactType["CITATIONS"] = "citations";
    ImpactType["PATENTS"] = "patents";
    ImpactType["POLICY"] = "policy";
    ImpactType["CLINICAL"] = "clinical";
    ImpactType["ECONOMIC"] = "economic";
})(ImpactType || (exports.ImpactType = ImpactType = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "pdf";
    ReportFormat["EXCEL"] = "excel";
    ReportFormat["CSV"] = "csv";
    ReportFormat["JSON"] = "json";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
class ExecutiveDashboardQueryDto {
    constructor() {
        this.timeRange = TimeRange.THIRTY_DAYS;
    }
}
exports.ExecutiveDashboardQueryDto = ExecutiveDashboardQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Center ID filter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ExecutiveDashboardQueryDto.prototype, "centerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TimeRange, description: 'Time range for dashboard data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TimeRange),
    __metadata("design:type", String)
], ExecutiveDashboardQueryDto.prototype, "timeRange", void 0);
class NationalIntelligenceQueryDto {
}
exports.NationalIntelligenceQueryDto = NationalIntelligenceQueryDto;
class PerformanceBenchmarkQueryDto {
    constructor() {
        this.benchmarkPeriod = BenchmarkPeriod.MONTHLY;
    }
}
exports.PerformanceBenchmarkQueryDto = PerformanceBenchmarkQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceBenchmarkQueryDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BenchmarkPeriod),
    __metadata("design:type", String)
], PerformanceBenchmarkQueryDto.prototype, "benchmarkPeriod", void 0);
class CenterMetricsQueryDto {
}
exports.CenterMetricsQueryDto = CenterMetricsQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CenterMetricsQueryDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CenterMetricsQueryDto.prototype, "period", void 0);
class PredictiveTrendsQueryDto {
    constructor() {
        this.geographicLevel = GeographicLevel.NATIONAL;
        this.predictionHorizon = 12;
    }
}
exports.PredictiveTrendsQueryDto = PredictiveTrendsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PredictiveTrendsQueryDto.prototype, "cancerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GeographicLevel),
    __metadata("design:type", String)
], PredictiveTrendsQueryDto.prototype, "geographicLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], PredictiveTrendsQueryDto.prototype, "predictionHorizon", void 0);
class CancerTypeTrendsQueryDto {
    constructor() {
        this.geographicLevel = GeographicLevel.NATIONAL;
        this.predictionHorizon = 12;
    }
}
exports.CancerTypeTrendsQueryDto = CancerTypeTrendsQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancerTypeTrendsQueryDto.prototype, "cancerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GeographicLevel),
    __metadata("design:type", String)
], CancerTypeTrendsQueryDto.prototype, "geographicLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], CancerTypeTrendsQueryDto.prototype, "predictionHorizon", void 0);
class ResearchImpactQueryDto {
    constructor() {
        this.impactType = ImpactType.ALL;
        this.timeFrame = '12m';
    }
}
exports.ResearchImpactQueryDto = ResearchImpactQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResearchImpactQueryDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ImpactType),
    __metadata("design:type", String)
], ResearchImpactQueryDto.prototype, "impactType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResearchImpactQueryDto.prototype, "timeFrame", void 0);
class InvalidateCacheDto {
    constructor() {
        this.all = false;
    }
}
exports.InvalidateCacheDto = InvalidateCacheDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvalidateCacheDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InvalidateCacheDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InvalidateCacheDto.prototype, "all", void 0);
class CacheStatsQueryDto {
    constructor() {
        this.detailed = false;
    }
}
exports.CacheStatsQueryDto = CacheStatsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CacheStatsQueryDto.prototype, "detailed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CacheStatsQueryDto.prototype, "metricType", void 0);
class DataQualityQueryDto {
    constructor() {
        this.timeRange = TimeRange.THIRTY_DAYS;
        this.includeRecommendations = true;
    }
}
exports.DataQualityQueryDto = DataQualityQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DataQualityQueryDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TimeRange),
    __metadata("design:type", String)
], DataQualityQueryDto.prototype, "timeRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DataQualityQueryDto.prototype, "includeRecommendations", void 0);
class HealthCheckQueryDto {
    constructor() {
        this.detailed = false;
    }
}
exports.HealthCheckQueryDto = HealthCheckQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthCheckQueryDto.prototype, "detailed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthCheckQueryDto.prototype, "services", void 0);
class EventsQueryDto {
    constructor() {
        this.limit = 10;
    }
}
exports.EventsQueryDto = EventsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsQueryDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], EventsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsQueryDto.prototype, "endDate", void 0);
class ReportGenerationDto {
    constructor() {
        this.format = ReportFormat.PDF;
    }
}
exports.ReportGenerationDto = ReportGenerationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportGenerationDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], ReportGenerationDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReportGenerationDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportGenerationDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportGenerationDto.prototype, "parameters", void 0);
class ReportSchedulingDto {
    constructor() {
        this.format = ReportFormat.PDF;
        this.isActive = true;
    }
}
exports.ReportSchedulingDto = ReportSchedulingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportSchedulingDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportSchedulingDto.prototype, "reportType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportSchedulingDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReportSchedulingDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], ReportSchedulingDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportSchedulingDto.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReportSchedulingDto.prototype, "isActive", void 0);
class BenchmarkComparisonDto {
    constructor() {
        this.period = BenchmarkPeriod.MONTHLY;
        this.numberOfPeriods = 6;
    }
}
exports.BenchmarkComparisonDto = BenchmarkComparisonDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BenchmarkComparisonDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BenchmarkComparisonDto.prototype, "comparisonCenters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BenchmarkComparisonDto.prototype, "peerGroup", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BenchmarkPeriod),
    __metadata("design:type", String)
], BenchmarkComparisonDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], BenchmarkComparisonDto.prototype, "numberOfPeriods", void 0);
class AnalyticsConfigDto {
    constructor() {
        this.cacheTTL = 3600;
        this.enableRealTimeUpdates = true;
        this.updateInterval = 5;
        this.defaultTimeRange = TimeRange.THIRTY_DAYS;
        this.enablePredictiveAnalytics = true;
        this.enableBenchmarking = true;
    }
}
exports.AnalyticsConfigDto = AnalyticsConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(300),
    (0, class_validator_1.Max)(86400),
    __metadata("design:type", Number)
], AnalyticsConfigDto.prototype, "cacheTTL", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsConfigDto.prototype, "enableRealTimeUpdates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], AnalyticsConfigDto.prototype, "updateInterval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsConfigDto.prototype, "defaultTimeRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsConfigDto.prototype, "enablePredictiveAnalytics", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsConfigDto.prototype, "enableBenchmarking", void 0);
class PerformanceMetricsDto {
    constructor() {
        this.includeComparisons = true;
        this.includeTargets = true;
    }
}
exports.PerformanceMetricsDto = PerformanceMetricsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceMetricsDto.prototype, "metricType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceMetricsDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PerformanceMetricsDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PerformanceMetricsDto.prototype, "includeComparisons", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PerformanceMetricsDto.prototype, "includeTargets", void 0);
class TrendAnalysisDto {
    constructor() {
        this.geographicLevel = GeographicLevel.NATIONAL;
        this.historicalMonths = 24;
        this.predictionMonths = 12;
        this.includeSeasonality = true;
        this.includeRiskFactors = true;
    }
}
exports.TrendAnalysisDto = TrendAnalysisDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrendAnalysisDto.prototype, "cancerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrendAnalysisDto.prototype, "geographicArea", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GeographicLevel),
    __metadata("design:type", String)
], TrendAnalysisDto.prototype, "geographicLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], TrendAnalysisDto.prototype, "historicalMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], TrendAnalysisDto.prototype, "predictionMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TrendAnalysisDto.prototype, "includeSeasonality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TrendAnalysisDto.prototype, "includeRiskFactors", void 0);
class ResearchAnalyticsDto {
    constructor() {
        this.timeFrame = '12m';
        this.includeCollaborations = true;
        this.includeEconomicImpact = true;
        this.includePatientOutcomes = true;
    }
}
exports.ResearchAnalyticsDto = ResearchAnalyticsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResearchAnalyticsDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ResearchAnalyticsDto.prototype, "researchTypes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResearchAnalyticsDto.prototype, "timeFrame", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResearchAnalyticsDto.prototype, "includeCollaborations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResearchAnalyticsDto.prototype, "includeEconomicImpact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ResearchAnalyticsDto.prototype, "includePatientOutcomes", void 0);
class AlertConfigurationDto {
    constructor() {
        this.isActive = true;
        this.checkInterval = 60;
    }
}
exports.AlertConfigurationDto = AlertConfigurationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConfigurationDto.prototype, "metricType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConfigurationDto.prototype, "condition", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AlertConfigurationDto.prototype, "threshold", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AlertConfigurationDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AlertConfigurationDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlertConfigurationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], AlertConfigurationDto.prototype, "checkInterval", void 0);
class ExportDataDto {
    constructor() {
        this.includeMetadata = true;
    }
}
exports.ExportDataDto = ExportDataDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "dataType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], ExportDataDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ExportDataDto.prototype, "fields", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportDataDto.prototype, "includeMetadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportDataDto.prototype, "filterCriteria", void 0);
class AnalyticsApiResponseDto {
}
exports.AnalyticsApiResponseDto = AnalyticsApiResponseDto;
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
//# sourceMappingURL=enhanced-analytics.dto.js.map