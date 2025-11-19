export declare class GenerateAnalyticsReportDto {
    type: 'summary' | 'detailed' | 'trends';
    startDate?: string;
    endDate?: string;
    format?: 'pdf' | 'excel' | 'csv';
}
