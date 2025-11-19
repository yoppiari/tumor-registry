import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ReportsService } from '../services/reports.service';
import { CreateReportTemplateDto } from '../dto/create-report-template.dto';
import { GenerateReportDto, ScheduleReportDto } from '../dto/generate-report.dto';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('templates')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get report templates' })
  @ApiResponse({ status: 200, description: 'Report templates retrieved successfully' })
  async getTemplates(
    @Query('reportType') reportType?: string,
    @Query('accessLevel') accessLevel?: string,
    @Query('centerId') centerId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters = {
      reportType,
      accessLevel,
      centerId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    return this.reportsService.getTemplates(filters);
  }

  @Post('templates')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Create new report template' })
  @ApiResponse({ status: 201, description: 'Report template created successfully' })
  async createTemplate(@Body() createTemplateDto: CreateReportTemplateDto) {
    return this.reportsService.createTemplate(createTemplateDto);
  }

  @Get('templates/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get report template by ID' })
  @ApiResponse({ status: 200, description: 'Report template retrieved successfully' })
  async getTemplate(@Param('id') id: string) {
    return this.reportsService.getTemplate(id);
  }

  @Get('generated')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get generated reports' })
  @ApiResponse({ status: 200, description: 'Generated reports retrieved successfully' })
  async getGeneratedReports(
    @Query('templateId') templateId?: string,
    @Query('status') status?: string,
    @Query('format') format?: string,
    @Query('generatedBy') generatedBy?: string,
    @Query('centerId') centerId?: string,
    @Query('limit') limit?: string,
  ) {
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

  @Get('generated/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get generated report by ID' })
  @ApiResponse({ status: 200, description: 'Generated report retrieved successfully' })
  async getGeneratedReport(@Param('id') id: string) {
    return this.reportsService.getReport(id);
  }

  @Get('generated/:id/download')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Download generated report' })
  @ApiResponse({ status: 200, description: 'Report downloaded successfully' })
  async downloadReport(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const { filePath, fileName, mimeType } = await this.reportsService.downloadReport(id);

      // Set appropriate headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Handle errors
      fileStream.on('error', (error) => {
        res.status(500).json({ error: 'Error reading file' });
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  @Post('generate')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Generate a new report' })
  @ApiResponse({ status: 201, description: 'Report generation started' })
  async generateReport(@Body() generateReportDto: GenerateReportDto) {
    return this.reportsService.generateReport(generateReportDto);
  }

  @Post('schedule')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Schedule a recurring report' })
  @ApiResponse({ status: 201, description: 'Report scheduled successfully' })
  async scheduleReport(@Body() scheduleReportDto: ScheduleReportDto) {
    return this.reportsService.scheduleReport(scheduleReportDto);
  }

  @Get('scheduled')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Get scheduled reports' })
  @ApiResponse({ status: 200, description: 'Scheduled reports retrieved successfully' })
  async getScheduledReports(
    @Query('centerId') centerId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters = {
      centerId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    return this.reportsService.getScheduledReports(filters);
  }

  @Get('scheduled/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Get scheduled report by ID' })
  @ApiResponse({ status: 200, description: 'Scheduled report retrieved successfully' })
  async getScheduledReport(@Param('id') id: string) {
    return this.reportsService.getScheduledReport(id);
  }

  @Put('scheduled/:id/toggle')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Toggle scheduled report active status' })
  @ApiResponse({ status: 200, description: 'Scheduled report status updated successfully' })
  async toggleScheduledReport(@Param('id') id: string) {
    return this.reportsService.toggleScheduledReport(id);
  }

  @Delete('scheduled/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete scheduled report' })
  @ApiResponse({ status: 204, description: 'Scheduled report deleted successfully' })
  async deleteScheduledReport(@Param('id') id: string) {
    return this.reportsService.deleteScheduledReport(id);
  }

  @Get('statistics')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Get report generation statistics' })
  @ApiResponse({ status: 200, description: 'Report statistics retrieved successfully' })
  async getStatistics(@Query('centerId') centerId?: string) {
    return this.reportsService.getReportStatistics(centerId);
  }

  @Post('templates/:id/validate')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Validate report template' })
  @ApiResponse({ status: 200, description: 'Template validation completed' })
  async validateTemplate(
    @Param('id') id: string,
    @Body() templateData?: any,
  ) {
    if (templateData) {
      return this.reportsService.validateTemplate(templateData);
    }

    const template = await this.reportsService.getTemplate(id);
    return this.reportsService.validateTemplate(template);
  }

  @Get('preview/:templateId')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Preview report data' })
  @ApiResponse({ status: 200, description: 'Report preview generated successfully' })
  async previewReport(
    @Param('templateId') templateId: string,
    @Query('limit') limit?: string,
    @Query('format') format?: string,
  ) {
    return this.reportsService.previewReportData(
      templateId,
      limit ? parseInt(limit) : undefined,
      format,
    );
  }

  @Get('data-sources')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get available data sources for reports' })
  @ApiResponse({ status: 200, description: 'Data sources retrieved successfully' })
  async getDataSources() {
    return this.reportsService.getAvailableDataSources();
  }

  @Get('data-sources/:source/schema')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get data source schema' })
  @ApiResponse({ status: 200, description: 'Data source schema retrieved successfully' })
  async getDataSourceSchema(@Param('source') source: string) {
    return this.reportsService.getDataSourceSchema(source);
  }

  @Post('data-sources/:source/query')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Execute query against data source' })
  @ApiResponse({ status: 200, description: 'Query executed successfully' })
  async queryDataSource(
    @Param('source') source: string,
    @Body() query: any,
  ) {
    return this.reportsService.queryDataSource(source, query);
  }

  @Get('formats')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST', 'RESEARCHER')
  @ApiOperation({ summary: 'Get supported report formats' })
  @ApiResponse({ status: 200, description: 'Supported formats retrieved successfully' })
  async getSupportedFormats() {
    return this.reportsService.getSupportedFormats();
  }

  @Get('exports')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Get export history' })
  @ApiResponse({ status: 200, description: 'Export history retrieved successfully' })
  async getExportHistory(
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.reportsService.getExportHistory(filters);
  }

  @Delete('generated/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete generated report' })
  @ApiResponse({ status: 204, description: 'Generated report deleted successfully' })
  async deleteGeneratedReport(@Param('id') id: string) {
    return this.reportsService.deleteGeneratedReport(id);
  }

  @Get('templates/:id/usage')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Get template usage statistics' })
  @ApiResponse({ status: 200, description: 'Template usage statistics retrieved successfully' })
  async getTemplateUsage(@Param('id') id: string) {
    return this.reportsService.getTemplateUsage(id);
  }

  @Post('templates/:id/clone')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR', 'DATA_ANALYST')
  @ApiOperation({ summary: 'Clone report template' })
  @ApiResponse({ status: 201, description: 'Template cloned successfully' })
  async cloneTemplate(
    @Param('id') id: string,
    @Body() cloneData: { name: string; description?: string },
  ) {
    return this.reportsService.cloneTemplate(id, cloneData);
  }
}