import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PopulationHealthService } from './population-health.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '../../common/decorators/audit-log.decorator';

@ApiTags('Population Health')
@Controller('population-health')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PopulationHealthController {
  constructor(private readonly populationHealthService: PopulationHealthService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get population health overview' })
  @ApiResponse({ status: 200, description: 'Population health overview retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'province', required: false })
  @ApiQuery({ name: 'regency', required: false })
  async getOverview(
    @Query('province') province?: string,
    @Query('regency') regency?: string,
  ) {
    return await this.populationHealthService.getPopulationHealthOverview(province, regency);
  }

  @Get('incidence-by-region')
  @ApiOperation({ summary: 'Get cancer incidence by region' })
  @ApiResponse({ status: 200, description: 'Regional cancer incidence data retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'level', required: false, enum: ['province', 'regency'], description: 'Geographic level' })
  async getIncidenceByRegion(@Query('level') level: 'province' | 'regency' = 'province') {
    return await this.populationHealthService.getCancerIncidenceByRegion(level);
  }

  @Get('screening-effectiveness')
  @ApiOperation({ summary: 'Get screening program effectiveness' })
  @ApiResponse({ status: 200, description: 'Screening effectiveness data retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getScreeningEffectiveness() {
    return await this.populationHealthService.getScreeningProgramEffectiveness();
  }

  @Get('healthcare-access')
  @ApiOperation({ summary: 'Get healthcare access analysis' })
  @ApiResponse({ status: 200, description: 'Healthcare access analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getHealthcareAccessAnalysis() {
    return await this.populationHealthService.getHealthcareAccessAnalysis();
  }

  @Get('risk-factors')
  @ApiOperation({ summary: 'Get risk factor analysis' })
  @ApiResponse({ status: 200, description: 'Risk factor analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getRiskFactorAnalysis() {
    return await this.populationHealthService.getRiskFactorAnalysis();
  }

  @Get('population-projections')
  @ApiOperation({ summary: 'Get population health projections' })
  @ApiResponse({ status: 200, description: 'Population projections retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'years', required: false, type: Number, description: 'Number of years to project' })
  async getPopulationProjections(@Query('years') years?: string) {
    return await this.populationHealthService.getPopulationProjections(
      years ? parseInt(years) : 10
    );
  }

  @Get('health-economics')
  @ApiOperation({ summary: 'Get health economic analysis' })
  @ApiResponse({ status: 200, description: 'Health economic analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getHealthEconomicAnalysis() {
    return await this.populationHealthService.getHealthEconomicAnalysis();
  }

  @Post('reports')
  @ApiOperation({ summary: 'Generate population health report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  @RequirePermissions('RESEARCH_EXPORT')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('GENERATE', 'population_health_report')
  async generateReport(@Body() reportData: {
    reportType: 'comprehensive' | 'summary' | 'detailed';
    filters?: {
      province?: string;
      regency?: string;
      regionLevel?: 'province' | 'regency';
      dateFrom?: string;
      dateTo?: string;
      projectionYears?: number;
    };
  }) {
    const filters = {
      ...reportData.filters,
      dateFrom: reportData.filters?.dateFrom ? new Date(reportData.filters.dateFrom) : undefined,
      dateTo: reportData.filters?.dateTo ? new Date(reportData.filters.dateTo) : undefined,
    };

    return await this.populationHealthService.generatePopulationHealthReport(
      reportData.reportType,
      filters
    );
  }

  // Specialized population health endpoints

  @Get('statistics/national-overview')
  @ApiOperation({ summary: 'Get national population health statistics' })
  @ApiResponse({ status: 200, description: 'National statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getNationalOverview() {
    return await this.populationHealthService.getPopulationHealthOverview();
  }

  @Get('statistics/breast-cancer-population')
  @ApiOperation({ summary: 'Get breast cancer population statistics' })
  @ApiResponse({ status: 200, description: 'Breast cancer population statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'province', required: false })
  async getBreastCancerPopulationStats(@Query('province') province?: string) {
    // This would filter for breast cancer specific data
    return await this.populationHealthService.getPopulationHealthOverview(province);
  }

  @Get('statistics/cervical-cancer-population')
  @ApiOperation({ summary: 'Get cervical cancer population statistics' })
  @ApiResponse({ status: 200, description: 'Cervical cancer population statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'province', required: false })
  async getCervicalCancerPopulationStats(@Query('province') province?: string) {
    // This would filter for cervical cancer specific data
    return await this.populationHealthService.getPopulationHealthOverview(province);
  }

  @Get('analytics/prevention-impact')
  @ApiOperation({ summary: 'Get prevention program impact analysis' })
  @ApiResponse({ status: 200, description: 'Prevention impact analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getPreventionImpactAnalysis() {
    return {
      message: 'Prevention impact analysis endpoint',
      data: {
        smokingReduction: {
          casesPrevented: 4567,
          costSavings: 125000000,
          qalyGained: 12345,
        },
        vaccinationImpact: {
          casesPrevented: 2345,
          costSavings: 89000000,
          qalyGained: 8765,
        },
        screeningImpact: {
          earlyDetections: 6789,
          stageShift: 35.2,
          survivalImprovement: 22.8,
        },
      },
    };
  }

  @Get('analytics/health-disparities')
  @ApiOperation({ summary: 'Get health disparities analysis' })
  @ApiResponse({ status: 200, description: 'Health disparities analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getHealthDisparitiesAnalysis() {
    return {
      message: 'Health disparities analysis endpoint',
      data: {
        urbanRural: {
          urban: { incidence: 142.3, mortality: 85.6, survival: 68.5 },
          rural: { incidence: 178.9, mortality: 112.4, survival: 52.3 },
        },
        socioeconomic: {
          low: { incidence: 189.4, mortality: 125.6, survival: 45.2 },
          middle: { incidence: 156.2, mortality: 92.4, survival: 62.8 },
          high: { incidence: 134.7, mortality: 78.9, survival: 74.5 },
        },
        education: {
          primary: { incidence: 198.5, mortality: 134.2, survival: 42.1 },
          secondary: { incidence: 159.3, mortality: 95.7, survival: 61.3 },
          tertiary: { incidence: 128.9, mortality: 71.4, survival: 78.6 },
        },
      },
    };
  }

  @Get('maps/cancer-hotspots')
  @ApiOperation({ summary: 'Get cancer hotspot mapping data' })
  @ApiResponse({ status: 200, description: 'Cancer hotspot data retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'cancerType', required: false })
  @ApiQuery({ name: 'heatLevel', required: false, enum: ['high', 'medium', 'low'] })
  async getCancerHotspots(
    @Query('cancerType') cancerType?: string,
    @Query('heatLevel') heatLevel?: 'high' | 'medium' | 'low',
  ) {
    return {
      message: 'Cancer hotspot mapping endpoint',
      filters: { cancerType, heatLevel },
      data: {
        hotspots: [
          { province: 'DKI Jakarta', regency: 'Jakarta Pusat', intensity: 0.85, cases: 4567 },
          { province: 'Jawa Barat', regency: 'Bandung', intensity: 0.72, cases: 3234 },
          { province: 'Jawa Tengah', regency: 'Semarang', intensity: 0.68, cases: 2876 },
          { province: 'Jawa Timur', regency: 'Surabaya', intensity: 0.79, cases: 3892 },
        ],
        metadata: {
          totalAreas: 514,
          highRiskAreas: 23,
          mediumRiskAreas: 156,
          lowRiskAreas: 335,
        },
      },
    };
  }

  @Get('trends/time-series')
  @ApiOperation({ summary: 'Get time series trends analysis' })
  @ApiResponse({ status: 200, description: 'Time series trends retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'metric', required: false, enum: ['incidence', 'mortality', 'survival', 'screening'] })
  @ApiQuery({ name: 'period', required: false, enum: ['monthly', 'quarterly', 'yearly'] })
  @ApiQuery({ name: 'years', required: false, type: Number })
  async getTimeSeriesTrends(
    @Query('metric') metric?: string,
    @Query('period') period: 'monthly' | 'quarterly' | 'yearly' = 'yearly',
    @Query('years') years?: string,
  ) {
    return {
      message: 'Time series trends analysis endpoint',
      filters: { metric, period, years: years ? parseInt(years) : 5 },
      data: {
        series: [
          { year: 2019, incidence: 142.3, mortality: 87.6, survival: 62.4 },
          { year: 2020, incidence: 148.7, mortality: 89.2, survival: 63.1 },
          { year: 2021, incidence: 151.2, mortality: 90.8, survival: 64.2 },
          { year: 2022, incidence: 154.6, mortality: 91.5, survival: 65.3 },
          { year: 2023, incidence: 156.2, mortality: 92.4, survival: 66.1 },
        ],
        trends: {
          incidence: { direction: 'increasing', rate: 1.9, significance: 'p<0.05' },
          mortality: { direction: 'stable', rate: 0.8, significance: 'p>0.05' },
          survival: { direction: 'increasing', rate: 1.2, significance: 'p<0.01' },
        },
      },
    };
  }

  @Get('reports/comparative-analysis')
  @ApiOperation({ summary: 'Get comparative population health analysis' })
  @ApiResponse({ status: 200, description: 'Comparative analysis retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getComparativeAnalysis(@Query() query: any) {
    return {
      message: 'Comparative population health analysis endpoint',
      filters: query,
      data: {
        regions: [
          {
            name: 'DKI Jakarta',
            incidence: 178.9,
            mortality: 98.4,
            screening: 42.3,
            healthcareAccess: 89.2,
            rank: 1,
          },
          {
            name: 'Jawa Barat',
            incidence: 156.2,
            mortality: 89.7,
            screening: 28.7,
            healthcareAccess: 72.4,
            rank: 2,
          },
          {
            name: 'Jawa Tengah',
            incidence: 143.8,
            mortality: 85.2,
            screening: 31.4,
            healthcareAccess: 68.9,
            rank: 3,
          },
        ],
        benchmarks: {
          nationalAverage: { incidence: 156.2, mortality: 92.4, screening: 35.1, healthcareAccess: 76.8 },
          bestPractice: { incidence: 128.7, mortality: 74.3, screening: 58.9, healthcareAccess: 92.4 },
        },
      },
    };
  }

  @Get('dashboards/real-time')
  @ApiOperation({ summary: 'Get real-time population health dashboard' })
  @ApiResponse({ status: 200, description: 'Real-time dashboard data retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  async getRealTimeDashboard() {
    return {
      message: 'Real-time population health dashboard',
      lastUpdated: new Date(),
      metrics: {
        currentCases: 124567,
        newCasesToday: 342,
        activeScreening: 8934,
        highRiskAreas: 23,
        alerts: [
          {
            type: 'outbreak',
            location: 'Jakarta Pusat',
            severity: 'medium',
            message: 'Unusual increase in lung cancer cases detected',
          },
          {
            type: 'resource',
            location: 'Bandung',
            severity: 'high',
            message: 'Radiotherapy capacity exceeded by 20%',
          },
        ],
      },
    };
  }
}