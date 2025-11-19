import { ReportData, ReportLayout } from '../interfaces/reports.interface';
export declare class ExcelGenerator {
    private readonly logger;
    generateReport(data: ReportData, layout: ReportLayout, options?: {
        title?: string;
        filename?: string;
        outputPath?: string;
        includeCharts?: boolean;
    }): Promise<{
        filePath: string;
        fileSize: number;
    }>;
    private processWorksheet;
    private processHeaderWorksheet;
    private processSummaryWorksheet;
    private processTableWorksheet;
    private processChartDataWorksheet;
    private processTextWorksheet;
    private processGenericWorksheet;
    private addSummarySheet;
    private getSheetName;
    private applyConditionalFormatting;
}
