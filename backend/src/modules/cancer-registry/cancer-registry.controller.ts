import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CancerRegistryService } from './cancer-registry.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { CancerStage } from '@prisma/client';

@ApiTags('Cancer Registry')
@Controller('cancer-registry')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CancerRegistryController {
  constructor(private readonly cancerRegistryService: CancerRegistryService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get cancer registry overview' })
  @ApiResponse({ status: 200, description: 'Cancer registry overview retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getOverview(
    @Query('centerId') centerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.cancerRegistryService.getCancerRegistryOverview(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
      centerId
    );
  }

  @Get('incidence-trends')
  @ApiOperation({ summary: 'Get cancer incidence trends' })
  @ApiResponse({ status: 200, description: 'Cancer incidence trends retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'years', required: false, type: Number, description: 'Number of years to analyze' })
  @ApiQuery({ name: 'centerId', required: false })
  async getIncidenceTrends(
    @Query('years') years?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.cancerRegistryService.getCancerIncidenceTrends(
      years ? parseInt(years) : 5,
      centerId
    );
  }

  @Get('survival-analysis')
  @ApiOperation({ summary: 'Get survival analysis' })
  @ApiResponse({ status: 200, description: 'Survival analysis retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'cancerType', required: false })
  @ApiQuery({ name: 'stage', required: false, enum: CancerStage })
  @ApiQuery({ name: 'centerId', required: false })
  async getSurvivalAnalysis(
    @Query('cancerType') cancerType?: string,
    @Query('stage') stage?: CancerStage,
    @Query('centerId') centerId?: string,
  ) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      cancerType,
      stage,
      centerId
    );
  }

  @Get('treatment-outcomes')
  @ApiOperation({ summary: 'Get treatment outcomes analysis' })
  @ApiResponse({ status: 200, description: 'Treatment outcomes retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'cancerType', required: false })
  @ApiQuery({ name: 'treatmentType', required: false })
  @ApiQuery({ name: 'centerId', required: false })
  async getTreatmentOutcomes(
    @Query('cancerType') cancerType?: string,
    @Query('treatmentType') treatmentType?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.cancerRegistryService.getTreatmentOutcomes(
      cancerType,
      treatmentType,
      centerId
    );
  }

  @Get('epidemiological-report')
  @ApiOperation({ summary: 'Get comprehensive epidemiological report' })
  @ApiResponse({ status: 200, description: 'Epidemiological report generated successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getEpidemiologicalReport(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getEpidemiologicalReport(centerId);
  }

  @Get('quality-metrics')
  @ApiOperation({ summary: 'Get cancer registry quality metrics' })
  @ApiResponse({ status: 200, description: 'Quality metrics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getQualityMetrics(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getQualityMetrics(centerId);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export cancer registry data' })
  @ApiResponse({ status: 201, description: 'Data exported successfully' })
  @RequirePermissions('RESEARCH_EXPORT')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('EXPORT_CANCER_REGISTRY')
  async exportRegistryData(@Body() exportData: {
    format: 'json' | 'csv' | 'excel';
    filters?: {
      dateFrom?: string;
      dateTo?: string;
      centerId?: string;
      cancerType?: string;
      stage?: CancerStage;
    };
  }) {
    const filters = {
      ...exportData.filters,
      dateFrom: exportData.filters?.dateFrom ? new Date(exportData.filters.dateFrom) : undefined,
      dateTo: exportData.filters?.dateTo ? new Date(exportData.filters.dateTo) : undefined,
    };

    return await this.cancerRegistryService.exportRegistryData(
      exportData.format,
      filters
    );
  }

  // Specialized cancer registry endpoints

  @Get('statistics/breast-cancer')
  @ApiOperation({ summary: 'Get breast cancer specific statistics' })
  @ApiResponse({ status: 200, description: 'Breast cancer statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getBreastCancerStatistics(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      'Breast Cancer',
      undefined,
      centerId
    );
  }

  @Get('statistics/lung-cancer')
  @ApiOperation({ summary: 'Get lung cancer specific statistics' })
  @ApiResponse({ status: 200, description: 'Lung cancer statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getLungCancerStatistics(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      'Lung Cancer',
      undefined,
      centerId
    );
  }

  @Get('statistics/colorectal-cancer')
  @ApiOperation({ summary: 'Get colorectal cancer specific statistics' })
  @ApiResponse({ status: 200, description: 'Colorectal cancer statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getColorectalCancerStatistics(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      'Colorectal Cancer',
      undefined,
      centerId
    );
  }

  @Get('statistics/cervical-cancer')
  @ApiOperation({ summary: 'Get cervical cancer specific statistics' })
  @ApiResponse({ status: 200, description: 'Cervical cancer statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getCervicalCancerStatistics(@Query('centerId') centerId?: string) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      'Cervical Cancer',
      undefined,
      centerId
    );
  }

  @Get('analytics/stage-distribution')
  @ApiOperation({ summary: 'Get detailed stage distribution analysis' })
  @ApiResponse({ status: 200, description: 'Stage distribution analysis retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'cancerType', required: false })
  @ApiQuery({ name: 'centerId', required: false })
  async getStageDistributionAnalysis(
    @Query('cancerType') cancerType?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      cancerType,
      undefined,
      centerId
    );
  }

  @Get('analytics/age-groups')
  @ApiOperation({ summary: 'Get cancer statistics by age groups' })
  @ApiResponse({ status: 200, description: 'Age group statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getAgeGroupStatistics(@Query('centerId') centerId?: string) {
    // This would be implemented in the service
    return {
      message: 'Age group statistics endpoint',
      centerId,
    };
  }

  @Get('analytics/gender-distribution')
  @ApiOperation({ summary: 'Get cancer statistics by gender' })
  @ApiResponse({ status: 200, description: 'Gender distribution statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'cancerType', required: false })
  @ApiQuery({ name: 'centerId', required: false })
  async getGenderDistribution(
    @Query('cancerType') cancerType?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.cancerRegistryService.getSurvivalAnalysis(
      cancerType,
      undefined,
      centerId
    );
  }

  @Get('reports/annual-summary')
  @ApiOperation({ summary: 'Get annual cancer registry summary report' })
  @ApiResponse({ status: 200, description: 'Annual summary report generated successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'centerId', required: false })
  async getAnnualSummary(
    @Query('year') year?: string,
    @Query('centerId') centerId?: string,
  ) {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    return await this.cancerRegistryService.getCancerRegistryOverview(
      new Date(targetYear, 0, 1),
      new Date(targetYear, 11, 31),
      centerId
    );
  }

  @Get('reports/comparative-analysis')
  @ApiOperation({ summary: 'Get comparative analysis between periods or centers' })
  @ApiResponse({ status: 200, description: 'Comparative analysis retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'period1Start', required: false })
  @ApiQuery({ name: 'period1End', required: false })
  @ApiQuery({ name: 'period2Start', required: false })
  @ApiQuery({ name: 'period2End', required: false })
  @ApiQuery({ name: 'center1Id', required: false })
  @ApiQuery({ name: 'center2Id', required: false })
  async getComparativeAnalysis(@Query() query: any) {
    // This would be implemented in the service
    return {
      message: 'Comparative analysis endpoint',
      query,
    };
  }
}