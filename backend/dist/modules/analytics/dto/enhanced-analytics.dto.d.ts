export declare enum TimeRange {
    SEVEN_DAYS = "7d",
    THIRTY_DAYS = "30d",
    NINETY_DAYS = "90d",
    SIX_MONTHS = "6m",
    ONE_YEAR = "1y"
}
export declare enum GeographicLevel {
    NATIONAL = "national",
    PROVINCE = "province",
    REGENCY = "regency"
}
export declare enum BenchmarkPeriod {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare enum ImpactType {
    ALL = "all",
    PUBLICATIONS = "publications",
    CITATIONS = "citations",
    PATENTS = "patents",
    POLICY = "policy",
    CLINICAL = "clinical",
    ECONOMIC = "economic"
}
export declare enum ReportFormat {
    PDF = "pdf",
    EXCEL = "excel",
    CSV = "csv",
    JSON = "json"
}
export declare class ExecutiveDashboardQueryDto {
    centerId?: string;
    timeRange?: TimeRange;
}
export declare class NationalIntelligenceQueryDto {
}
export declare class PerformanceBenchmarkQueryDto {
    centerId?: string;
    benchmarkPeriod?: BenchmarkPeriod;
}
export declare class CenterMetricsQueryDto {
    centerId: string;
    period?: string;
}
export declare class PredictiveTrendsQueryDto {
    cancerType?: string;
    geographicLevel?: GeographicLevel;
    predictionHorizon?: number;
}
export declare class CancerTypeTrendsQueryDto {
    cancerType: string;
    geographicLevel?: GeographicLevel;
    predictionHorizon?: number;
}
export declare class ResearchImpactQueryDto {
    researchRequestId?: string;
    impactType?: ImpactType;
    timeFrame?: string;
}
export declare class InvalidateCacheDto {
    centerId?: string;
    patientId?: string;
    all?: boolean;
}
export declare class CacheStatsQueryDto {
    detailed?: boolean;
    metricType?: string;
}
export declare class DataQualityQueryDto {
    centerId?: string;
    timeRange?: TimeRange;
    includeRecommendations?: boolean;
}
export declare class HealthCheckQueryDto {
    detailed?: boolean;
    services?: string[];
}
export declare class EventsQueryDto {
    eventType?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
}
export declare class ReportGenerationDto {
    reportType: string;
    format: ReportFormat;
    recipients?: string[];
    schedule?: string;
    parameters?: Record<string, any>;
}
export declare class ReportSchedulingDto {
    name: string;
    reportType: string;
    schedule: string;
    recipients: string[];
    format: ReportFormat;
    parameters?: Record<string, any>;
    isActive?: boolean;
}
export declare class BenchmarkComparisonDto {
    centerId?: string;
    comparisonCenters?: string[];
    peerGroup?: string;
    period?: BenchmarkPeriod;
    numberOfPeriods?: number;
}
export declare class AnalyticsConfigDto {
    cacheTTL?: number;
    enableRealTimeUpdates?: boolean;
    updateInterval?: number;
    defaultTimeRange?: TimeRange;
    enablePredictiveAnalytics?: boolean;
    enableBenchmarking?: boolean;
}
export declare class PerformanceMetricsDto {
    metricType: string;
    centerId?: string;
    period?: string;
    includeComparisons?: boolean;
    includeTargets?: boolean;
}
export declare class TrendAnalysisDto {
    cancerType?: string;
    geographicArea?: string;
    geographicLevel?: GeographicLevel;
    historicalMonths?: number;
    predictionMonths?: number;
    includeSeasonality?: boolean;
    includeRiskFactors?: boolean;
}
export declare class ResearchAnalyticsDto {
    researchRequestId?: string;
    researchTypes?: string[];
    timeFrame?: string;
    includeCollaborations?: boolean;
    includeEconomicImpact?: boolean;
    includePatientOutcomes?: boolean;
}
export declare class AlertConfigurationDto {
    metricType: string;
    condition: string;
    threshold: number;
    recipients: string[];
    isActive?: boolean;
    description?: string;
    checkInterval?: number;
}
export declare class ExportDataDto {
    dataType: string;
    format: ReportFormat;
    centerId?: string;
    startDate?: string;
    endDate?: string;
    fields?: string[];
    includeMetadata?: boolean;
    filterCriteria?: string;
}
export declare class AnalyticsApiResponseDto<T = any> {
    data: T;
    metadata: {
        timestamp: Date;
        cacheHit: boolean;
        executionTime: number;
        dataFreshness?: Date;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        hasNext: boolean;
    };
}
export declare class ErrorResponseDto {
    error: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: Date;
    path: string;
}
