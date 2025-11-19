export interface ReportData {
    [key: string]: any;
}
export interface ReportFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
    value: any;
}
export interface ReportQuery {
    dataSource: string;
    filters?: ReportFilter[];
    groupBy?: string[];
    orderBy?: {
        field: string;
        direction: 'asc' | 'desc';
    }[];
    limit?: number;
    offset?: number;
    aggregations?: {
        field: string;
        function: 'count' | 'sum' | 'avg' | 'min' | 'max';
        alias?: string;
    }[];
}
export interface ChartConfig {
    type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap' | 'gauge';
    title: string;
    xAxis?: string;
    yAxis?: string;
    series?: string[];
    colors?: string[];
    options?: any;
}
export interface ReportLayout {
    sections: {
        id: string;
        type: 'header' | 'summary' | 'chart' | 'table' | 'text' | 'footer';
        title?: string;
        content?: any;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        styling?: any;
    }[];
}
export interface ReportGenerationRequest {
    templateId: string;
    name: string;
    parameters?: any;
    format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'HTML';
    filters?: ReportFilter[];
    orderBy?: {
        field: string;
        direction: 'asc' | 'desc';
    }[];
    limit?: number;
    expiresAt?: Date;
    generatedBy: string;
    centerId?: string;
}
export interface ScheduledReportRequest {
    templateId: string;
    name: string;
    description?: string;
    schedule: string;
    recipients: {
        type: 'email' | 'role' | 'user';
        value: string;
    }[];
    parameters?: any;
    format: 'PDF' | 'EXCEL' | 'CSV';
    deliveryMethod: 'EMAIL' | 'FILE_SHARE' | 'API_WEBHOOK';
    isActive: boolean;
    createdBy: string;
    centerId?: string;
}
export interface ReportExecutionResult {
    success: boolean;
    filePath?: string;
    fileSize?: number;
    duration: number;
    recordCount?: number;
    errorMessage?: string;
    metadata?: any;
}
export interface ReportTemplateData {
    name: string;
    title: string;
    description?: string;
    reportType: string;
    templateType: string;
    dataSource: string;
    parameters?: any;
    layout: ReportLayout;
    styling?: any;
    filters?: any;
    aggregations?: any;
    charts?: ChartConfig[];
    accessLevel: string;
    isActive: boolean;
    isPublic: boolean;
    centerId?: string;
    createdBy: string;
}
export interface ReportValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    sampleData?: any;
}
export interface ReportStatistics {
    totalReports: number;
    activeReports: number;
    scheduledReports: number;
    recentGenerations: number;
    popularTemplates: Array<{
        templateId: string;
        templateName: string;
        generationCount: number;
    }>;
    averageGenerationTime: number;
    successRate: number;
    formatDistribution: Record<string, number>;
}
