import { ReportData, ReportLayout } from '../interfaces/reports.interface';
export declare class CsvGenerator {
    private readonly logger;
    generateReport(data: ReportData, layout: ReportLayout, options?: {
        title?: string;
        filename?: string;
        outputPath?: string;
        includeHeaders?: boolean;
        delimiter?: string;
    }): Promise<{
        filePath: string;
        fileSize: number;
    }>;
    generateMultiSheetCsv(data: ReportData, layout: ReportLayout, options?: {
        title?: string;
        filename?: string;
        outputPath?: string;
    }): Promise<{
        filePath: string;
        fileSize: number;
    }>;
    generateFlatReport(data: ReportData, layout: ReportLayout, options?: {
        title?: string;
        filename?: string;
        outputPath?: string;
        includeMetadata?: boolean;
    }): Promise<{
        filePath: string;
        fileSize: number;
    }>;
}
