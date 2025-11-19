export declare enum ReportType {
    DAILY_SUMMARY = "DAILY_SUMMARY",
    WEEKLY_ANALYTICS = "WEEKLY_ANALYTICS",
    MONTHLY_PERFORMANCE = "MONTHLY_PERFORMANCE",
    QUARTERLY_REVIEW = "QUARTERLY_REVIEW",
    ANNUAL_REPORT = "ANNUAL_REPORT",
    AD_HOC_ANALYSIS = "AD_HOC_ANALYSIS",
    RESEARCH_IMPACT = "RESEARCH_IMPACT",
    QUALITY_METRICS = "QUALITY_METRICS",
    EXECUTIVE_BRIEFING = "EXECUTIVE_BRIEFING",
    PATIENT_OUTCOMES = "PATIENT_OUTCOMES",
    CLINICAL_TRIALS = "CLINICAL_TRIALS",
    COMPLIANCE_REPORT = "COMPLIANCE_REPORT"
}
export declare enum TemplateType {
    STANDARD = "STANDARD",
    CUSTOM = "CUSTOM",
    SYSTEM = "SYSTEM",
    USER_DEFINED = "USER_DEFINED"
}
export declare enum DataAccessLevel {
    LIMITED = "LIMITED",
    AGGREGATE_ONLY = "AGGREGATE_ONLY",
    DEIDENTIFIED = "DEIDENTIFIED",
    LIMITED_IDENTIFIABLE = "LIMITED_IDENTIFIABLE",
    FULL_ACCESS = "FULL_ACCESS"
}
export declare class ChartConfigDto {
    type: string;
    title: string;
    xAxis?: string;
    yAxis?: string;
    series?: string[];
    colors?: string[];
    options?: any;
}
export declare class LayoutSectionDto {
    id: string;
    type: string;
    title?: string;
    content?: any;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    styling?: any;
}
export declare class CreateReportTemplateDto {
    name: string;
    title: string;
    description?: string;
    reportType: ReportType;
    templateType: TemplateType;
    dataSource: string;
    parameters?: any;
    layout: LayoutSectionDto[];
    styling?: any;
    filters?: any;
    aggregations?: any;
    charts?: ChartConfigDto[];
    accessLevel: DataAccessLevel;
    isActive?: boolean;
    isPublic?: boolean;
    centerId?: string;
    createdBy: string;
}
