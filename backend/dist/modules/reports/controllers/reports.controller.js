"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/decorators/roles.decorator");
const reports_service_1 = require("../services/reports.service");
const report_history_service_1 = require("../services/report-history.service");
const create_report_template_dto_1 = require("../dto/create-report-template.dto");
const generate_report_dto_1 = require("../dto/generate-report.dto");
const fs = require("fs");
let ReportsController = class ReportsController {
    constructor(reportsService, historyService) {
        this.reportsService = reportsService;
        this.historyService = historyService;
    }
    async getTemplates(reportType, accessLevel, centerId, isActive) {
        const filters = {
            reportType,
            accessLevel,
            centerId,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        };
        return this.reportsService.getTemplates(filters);
    }
    async createTemplate(createTemplateDto) {
        return this.reportsService.createTemplate(createTemplateDto);
    }
    async getTemplate(id) {
        return this.reportsService.getTemplate(id);
    }
    async getGeneratedReports(templateId, status, format, generatedBy, centerId, limit) {
        const filters = {
            templateId,
            status,
            format,
            generatedBy,
            centerId,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.reportsService.getGeneratedReports(filters);
    }
    async getGeneratedReport(id) {
        return this.reportsService.getReport(id);
    }
    async downloadReport(id, reply) {
        try {
            const { filePath, fileName, mimeType } = await this.reportsService.downloadReport(id);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('error', (error) => {
                res.status(500).json({ error: 'Error reading file' });
            });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async generateReport(generateReportDto) {
        return this.reportsService.generateReport(generateReportDto);
    }
    async scheduleReport(scheduleReportDto) {
        return this.reportsService.scheduleReport(scheduleReportDto);
    }
    async getScheduledReports(centerId, isActive) {
        const filters = {
            centerId,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        };
        return this.reportsService.getScheduledReports(filters);
    }
    async getScheduledReport(id) {
        return this.reportsService.getScheduledReport(id);
    }
    async toggleScheduledReport(id) {
        return this.reportsService.toggleScheduledReport(id);
    }
    async deleteScheduledReport(id) {
        return this.reportsService.deleteScheduledReport(id);
    }
    async getStatistics(centerId) {
        return this.reportsService.getReportStatistics(centerId);
    }
    async validateTemplate(id, templateData) {
        if (templateData) {
            return this.reportsService.validateTemplate(templateData);
        }
        const template = await this.reportsService.getTemplate(id);
        return this.reportsService.validateTemplate(template);
    }
    async previewReport(templateId, limit, format) {
        return this.reportsService.previewReportData(templateId, limit ? parseInt(limit) : undefined, format);
    }
    async getDataSources() {
        return this.reportsService.getAvailableDataSources();
    }
    async getDataSourceSchema(source) {
        return this.reportsService.getDataSourceSchema(source);
    }
    async queryDataSource(source, query) {
        return this.reportsService.queryDataSource(source, query);
    }
    async getSupportedFormats() {
        return this.reportsService.getSupportedFormats();
    }
    async getExportHistory(userId, startDate, endDate, limit) {
        const filters = {
            userId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.reportsService.getExportHistory(filters);
    }
    async deleteGeneratedReport(id) {
        return this.reportsService.deleteGeneratedReport(id);
    }
    async getTemplateUsage(id) {
        return this.reportsService.getTemplateUsage(id);
    }
    async cloneTemplate(id, cloneData) {
        return this.reportsService.cloneTemplate(id, cloneData);
    }
    async getReportHistory(reportId) {
        return this.historyService.getReportHistory(reportId);
    }
    async getTemplateHistory(templateId, startDate, endDate, status, limit) {
        const filters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            status,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.historyService.getTemplateHistory(templateId, filters);
    }
    async getDistributions(reportHistoryId) {
        return this.historyService.getDistributions(reportHistoryId);
    }
    async getAccessLogs(reportHistoryId, userId, accessType, startDate, endDate) {
        const filters = {
            userId,
            accessType,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.historyService.getAccessLogs(reportHistoryId, filters);
    }
    async logAccess(reportHistoryId, accessData, req) {
        return this.historyService.logAccess({
            reportHistoryId,
            userId: req.user.id,
            userName: req.user.name,
            ...accessData,
        });
    }
    async verifyIntegrity(reportHistoryId) {
        return this.historyService.verifyIntegrity(reportHistoryId);
    }
    async getVersionHistory(reportId) {
        return this.historyService.getVersionHistory(reportId);
    }
    async exportForAudit(startDate, endDate, templateId, reportType) {
        const filters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            templateId,
            reportType,
        };
        return this.historyService.exportForAudit(filters);
    }
    async getHistoryStatistics(templateId, startDate, endDate) {
        const filters = {
            templateId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.historyService.getHistoryStatistics(filters);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report templates retrieved successfully' }),
    __param(0, (0, common_1.Query)('reportType')),
    __param(1, (0, common_1.Query)('accessLevel')),
    __param(2, (0, common_1.Query)('centerId')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new report template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_template_dto_1.CreateReportTemplateDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report template retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Get)('generated'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get generated reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Generated reports retrieved successfully' }),
    __param(0, (0, common_1.Query)('templateId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('format')),
    __param(3, (0, common_1.Query)('generatedBy')),
    __param(4, (0, common_1.Query)('centerId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getGeneratedReports", null);
__decorate([
    (0, common_1.Get)('generated/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get generated report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Generated report retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getGeneratedReport", null);
__decorate([
    (0, common_1.Get)('generated/:id/download'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Download generated report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report downloaded successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof FastifyReply !== "undefined" && FastifyReply) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadReport", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generation started' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.GenerateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a recurring report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report scheduled successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.ScheduleReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "scheduleReport", null);
__decorate([
    (0, common_1.Get)('scheduled'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduled reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled reports retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __param(1, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getScheduledReports", null);
__decorate([
    (0, common_1.Get)('scheduled/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduled report by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled report retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getScheduledReport", null);
__decorate([
    (0, common_1.Put)('scheduled/:id/toggle'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle scheduled report active status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scheduled report status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "toggleScheduledReport", null);
__decorate([
    (0, common_1.Delete)('scheduled/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete scheduled report' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Scheduled report deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteScheduledReport", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report generation statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('templates/:id/validate'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate report template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template validation completed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "validateTemplate", null);
__decorate([
    (0, common_1.Get)('preview/:templateId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report preview generated successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "previewReport", null);
__decorate([
    (0, common_1.Get)('data-sources'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available data sources for reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data sources retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDataSources", null);
__decorate([
    (0, common_1.Get)('data-sources/:source/schema'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get data source schema' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data source schema retrieved successfully' }),
    __param(0, (0, common_1.Param)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDataSourceSchema", null);
__decorate([
    (0, common_1.Post)('data-sources/:source/query'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute query against data source' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Query executed successfully' }),
    __param(0, (0, common_1.Param)('source')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "queryDataSource", null);
__decorate([
    (0, common_1.Get)('formats'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supported report formats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supported formats retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getSupportedFormats", null);
__decorate([
    (0, common_1.Get)('exports'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get export history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Export history retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getExportHistory", null);
__decorate([
    (0, common_1.Delete)('generated/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete generated report' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Generated report deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteGeneratedReport", null);
__decorate([
    (0, common_1.Get)('templates/:id/usage'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get template usage statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template usage statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTemplateUsage", null);
__decorate([
    (0, common_1.Post)('templates/:id/clone'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Clone report template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template cloned successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "cloneTemplate", null);
__decorate([
    (0, common_1.Get)('history/:reportId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete history for a report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report history retrieved successfully' }),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportHistory", null);
__decorate([
    (0, common_1.Get)('history/template/:templateId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get history by template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template history retrieved successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getTemplateHistory", null);
__decorate([
    (0, common_1.Get)('distributions/:reportHistoryId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get distribution tracking for a report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribution tracking retrieved successfully' }),
    __param(0, (0, common_1.Param)('reportHistoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDistributions", null);
__decorate([
    (0, common_1.Get)('access-logs/:reportHistoryId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get access logs for a report (who viewed it)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access logs retrieved successfully' }),
    __param(0, (0, common_1.Param)('reportHistoryId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('accessType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAccessLogs", null);
__decorate([
    (0, common_1.Post)('access-logs/:reportHistoryId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Log report access' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Access logged successfully' }),
    __param(0, (0, common_1.Param)('reportHistoryId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "logAccess", null);
__decorate([
    (0, common_1.Get)('integrity/:reportHistoryId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify report file integrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Integrity verification completed' }),
    __param(0, (0, common_1.Param)('reportHistoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "verifyIntegrity", null);
__decorate([
    (0, common_1.Get)('versions/:reportId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get version history for a report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version history retrieved successfully' }),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getVersionHistory", null);
__decorate([
    (0, common_1.Get)('audit/export'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Export report history for compliance audit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit export completed successfully' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('templateId')),
    __param(3, (0, common_1.Query)('reportType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportForAudit", null);
__decorate([
    (0, common_1.Get)('history/statistics'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST'),
    (0, swagger_1.ApiOperation)({ summary: 'Get history statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('templateId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getHistoryStatistics", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        report_history_service_1.ReportHistoryService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map