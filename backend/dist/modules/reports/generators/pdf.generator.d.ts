import { ReportData, ReportLayout } from '../interfaces/reports.interface';
export declare class PdfGenerator {
    private readonly logger;
    generateReport(data: ReportData, layout: ReportLayout, options?: {
        title?: string;
        filename?: string;
        outputPath?: string;
    }): Promise<{
        filePath: string;
        fileSize: number;
    }>;
    private processSection;
    private processHeaderSection;
    private processSummarySection;
    private processTableSection;
    private processChartSection;
    private processTextSection;
    private processFooterSection;
    private calculateColumnWidths;
}
