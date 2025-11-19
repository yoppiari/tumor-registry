export declare enum ReportFormat {
    PDF = "PDF",
    EXCEL = "EXCEL",
    CSV = "CSV",
    JSON = "JSON",
    HTML = "HTML",
    POWERPOINT = "POWERPOINT"
}
export declare class ReportFilterDto {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
    value: any;
}
export declare class OrderByDto {
    field: string;
    direction: 'asc' | 'desc';
}
export declare class GenerateReportDto {
    templateId: string;
    name: string;
    parameters?: any;
    format: ReportFormat;
    filters?: ReportFilterDto[];
    orderBy?: OrderByDto[];
    limit?: number;
    expiresAt?: Date;
    centerId?: string;
    generatedBy: string;
}
export declare class ScheduleReportDto {
    templateId: string;
    name: string;
    description?: string;
    schedule: string;
    recipients: Array<{
        type: 'email' | 'role' | 'user';
        value: string;
    }>;
    parameters?: any;
    format: ReportFormat;
    deliveryMethod: 'EMAIL' | 'FILE_SHARE' | 'API_WEBHOOK';
    isActive?: boolean;
    centerId?: string;
    createdBy: string;
}
