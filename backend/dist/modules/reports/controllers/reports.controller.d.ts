import { ReportsService } from '../services/reports.service';
import { ReportHistoryService } from '../services/report-history.service';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { GenerateReportDto, ScheduleReportDto } from '../dto/generate-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    private readonly historyService;
    constructor(reportsService: ReportsService, historyService: ReportHistoryService);
    getTemplates(reportType?: string, accessLevel?: string, centerId?: string, isActive?: string): Promise<any[]>;
    createTemplate(createTemplateDto: CreateReportTemplateDto): Promise<any>;
    getTemplate(id: string): Promise<any>;
    getGeneratedReports(templateId?: string, status?: string, format?: string, generatedBy?: string, centerId?: string, limit?: string): Promise<any[]>;
    getGeneratedReport(id: string): Promise<any>;
    downloadReport(id: string, reply: FastifyReply): Promise<void>;
    generateReport(generateReportDto: GenerateReportDto): Promise<any>;
    scheduleReport(scheduleReportDto: ScheduleReportDto): Promise<any>;
    getScheduledReports(centerId?: string, isActive?: string): Promise<any>;
    getScheduledReport(id: string): Promise<any>;
    toggleScheduledReport(id: string): Promise<any>;
    deleteScheduledReport(id: string): Promise<any>;
    getStatistics(centerId?: string): Promise<import("../interfaces/reports.interface").ReportStatistics>;
    validateTemplate(id: string, templateData?: any): Promise<import("../interfaces/reports.interface").ReportValidationResult>;
    previewReport(templateId: string, limit?: string, format?: string): Promise<any>;
    getDataSources(): Promise<any>;
    getDataSourceSchema(source: string): Promise<any>;
    queryDataSource(source: string, query: any): Promise<any>;
    getSupportedFormats(): Promise<any>;
    getExportHistory(userId?: string, startDate?: string, endDate?: string, limit?: string): Promise<any>;
    deleteGeneratedReport(id: string): Promise<any>;
    getTemplateUsage(id: string): Promise<any>;
    cloneTemplate(id: string, cloneData: {
        name: string;
        description?: string;
    }): Promise<any>;
    getReportHistory(reportId: string): Promise<any[]>;
    getTemplateHistory(templateId: string, startDate?: string, endDate?: string, status?: string, limit?: string): Promise<any[]>;
    getDistributions(reportHistoryId: string): Promise<any[]>;
    getAccessLogs(reportHistoryId: string, userId?: string, accessType?: string, startDate?: string, endDate?: string): Promise<any[]>;
    logAccess(reportHistoryId: string, accessData: any, req: any): Promise<any>;
    verifyIntegrity(reportHistoryId: string): Promise<{
        isValid: boolean;
        originalHash: string;
        currentHash?: string;
        message: string;
    }>;
    getVersionHistory(reportId: string): Promise<any[]>;
    exportForAudit(startDate?: string, endDate?: string, templateId?: string, reportType?: string): Promise<any[]>;
    getHistoryStatistics(templateId?: string, startDate?: string, endDate?: string): Promise<any>;
}
