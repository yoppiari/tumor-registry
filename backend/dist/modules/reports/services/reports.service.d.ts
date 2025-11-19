import { PrismaService } from '../../database/prisma.service';
import { PdfGenerator } from '../generators/pdf.generator';
import { ExcelGenerator } from '../generators/excel.generator';
import { CsvGenerator } from '../generators/csv.generator';
import { ReportTemplateData, ReportValidationResult, ReportStatistics } from '../interfaces/reports.interface';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { GenerateReportDto } from '../dto/generate-report.dto';
export declare class ReportsService {
    private readonly prisma;
    private readonly pdfGenerator;
    private readonly excelGenerator;
    private readonly csvGenerator;
    private readonly logger;
    private scheduledReports;
    constructor(prisma: PrismaService, pdfGenerator: PdfGenerator, excelGenerator: ExcelGenerator, csvGenerator: CsvGenerator);
    createTemplate(createTemplateDto: CreateReportTemplateDto): Promise<any>;
    generateReport(generateReportDto: GenerateReportDto): Promise<any>;
    getReport(reportId: string): Promise<any>;
    downloadReport(reportId: string): Promise<{
        filePath: string;
        fileName: string;
        mimeType: string;
    }>;
    scheduleReport(scheduleData: any): Promise<any>;
    getTemplates(filters?: {
        reportType?: string;
        accessLevel?: string;
        centerId?: string;
        isActive?: boolean;
    }): Promise<any[]>;
    getGeneratedReports(filters?: {
        templateId?: string;
        status?: string;
        format?: string;
        generatedBy?: string;
        centerId?: string;
        limit?: number;
    }): Promise<any[]>;
    getReportStatistics(centerId?: string): Promise<ReportStatistics>;
    validateTemplate(templateData: ReportTemplateData): Promise<ReportValidationResult>;
    private processReportGeneration;
    private executeReportQuery;
    private buildFilters;
    private buildOrderBy;
    private validateReportAccess;
    private initializeScheduledReports;
    private scheduleReportJob;
    private executeScheduledReport;
    private getPopularTemplates;
    private getAverageGenerationTime;
    private getSuccessRate;
    private getFormatDistribution;
    private getMimeType;
}
