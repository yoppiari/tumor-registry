export declare enum ReportFormat {
    PDF = "PDF",
    EXCEL = "EXCEL",
    CSV = "CSV",
    JSON = "JSON",
    HTML = "HTML",
    POWERPOINT = "POWERPOINT"
}
export declare class GenerateReportDto {
    templateId: string;
    name: string;
    parameters?: any;
    format?: ReportFormat;
    expiresAt?: Date;
    generatedBy: string;
}
