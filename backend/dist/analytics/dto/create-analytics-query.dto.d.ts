export declare class CreateAnalyticsQueryDto {
    metric: string;
    dimensions: string[];
    filters?: AnalyticsFilterDto[];
    dateRange: DateRangeDto;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
    groupBy?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
}
export declare class AnalyticsFilterDto {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
    value: any;
    logicalOperator?: 'and' | 'or';
}
export declare class DateRangeDto {
    startDate: string;
    endDate: string;
}
export declare class CreateMLPredictionDto {
    modelType: 'survival' | 'response' | 'toxicity' | 'readmission' | 'prognosis';
    patientId?: string;
    treatmentPlanId?: string;
    features: MLFeatureDto[];
}
export declare class MLFeatureDto {
    name: string;
    value: any;
    importance?: number;
    category: 'demographic' | 'clinical' | 'laboratory' | 'treatment' | 'imaging' | 'genomic';
}
export declare class CreateMonitoringRuleDto {
    name: string;
    description: string;
    category: 'clinical' | 'operational' | 'quality' | 'system' | 'security';
    condition: MonitoringConditionDto;
    actions: MonitoringActionDto[];
    enabled?: boolean;
    severity: 'info' | 'warning' | 'error' | 'critical';
    cooldownPeriod?: number;
    schedule?: MonitoringScheduleDto;
}
export declare class MonitoringConditionDto {
    metric: string;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | 'in' | 'nin' | 'between' | 'outside';
    value: any;
    timeWindow?: number;
    aggregation?: 'avg' | 'sum' | 'count' | 'min' | 'max';
    groupBy?: string;
}
export declare class MonitoringActionDto {
    type: 'alert' | 'email' | 'sms' | 'webhook' | 'notification' | 'escalation';
    parameters: Record<string, any>;
    enabled?: boolean;
}
export declare class MonitoringScheduleDto {
    type: 'continuous' | 'interval' | 'cron';
    interval?: number;
    cronExpression?: string;
    timezone?: string;
}
export declare class CreateExecutiveDashboardDto {
    name: string;
    description: string;
    layout: DashboardLayoutDto;
    dateRange?: DateRangeDto;
    refreshInterval?: number;
    shared?: boolean;
    owners?: string[];
    viewers?: string[];
    settings?: DashboardSettingsDto;
}
export declare class DashboardLayoutDto {
    type: 'grid' | 'flex' | 'custom';
    columns: number;
    breakpoints?: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
}
export declare class DashboardSettingsDto {
    autoRefresh?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    timezone?: string;
    exportFormat?: 'pdf' | 'excel' | 'png' | 'csv';
    notifications?: boolean;
    drillDownMode?: 'modal' | 'page' | 'inline';
}
export declare class GenerateAnalyticsReportDto {
    reportType: 'treatment_outcomes' | 'quality_metrics' | 'operational_efficiency' | 'financial_analysis';
    title: string;
    description?: string;
    patientIds?: string[];
    treatmentPlanIds?: string[];
    dateRange: DateRangeDto;
    parameters?: any;
    format?: 'json' | 'pdf' | 'excel' | 'csv';
    emailRecipients?: string[];
    schedule?: ReportScheduleDto;
}
export declare class ReportScheduleDto {
    type: 'once' | 'recurring';
    frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    cronExpression?: string;
    timezone?: string;
    startDate?: string;
    endDate?: string;
}
