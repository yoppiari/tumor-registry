import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-summary')
  @ApiOperation({ summary: 'Get overall dashboard summary with key metrics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard summary' })
  async getDashboardSummary() {
    return this.analyticsService.getDashboardSummary();
  }

  @Get('limb-salvage-rate')
  @ApiOperation({ summary: 'Get limb salvage rate by center' })
  @ApiResponse({ status: 200, description: 'Returns limb salvage rates for all centers' })
  async getLimbSalvageRate() {
    return this.analyticsService.getLimbSalvageRateByCenter();
  }

  @Get('msts-trends')
  @ApiOperation({ summary: 'Get MSTS score trends over time' })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of months to include (default: 12)',
  })
  @ApiResponse({ status: 200, description: 'Returns MSTS trends' })
  async getMstsTrends(@Query('months') months?: string) {
    const monthsNum = months ? parseInt(months, 10) : 12;
    return this.analyticsService.getMstsTrends(monthsNum);
  }

  @Get('treatment-effectiveness')
  @ApiOperation({ summary: 'Compare treatment modality effectiveness' })
  @ApiResponse({
    status: 200,
    description: 'Returns treatment effectiveness comparison',
  })
  async getTreatmentEffectiveness() {
    return this.analyticsService.getTreatmentEffectiveness();
  }

  @Get('who-classification-distribution')
  @ApiOperation({ summary: 'Get WHO classification distribution' })
  @ApiResponse({
    status: 200,
    description: 'Returns distribution of WHO tumor classifications',
  })
  async getWhoClassificationDistribution() {
    return this.analyticsService.getWhoClassificationDistribution();
  }

  @Get('survival-analysis')
  @ApiOperation({ summary: 'Get 5-year survival analysis by tumor type' })
  @ApiResponse({
    status: 200,
    description: 'Returns survival analysis data',
  })
  async getSurvivalAnalysis() {
    return this.analyticsService.getSurvivalAnalysisByTumorType();
  }

  @Get('center-performance')
  @ApiOperation({ summary: 'Compare center performance metrics' })
  @ApiResponse({
    status: 200,
    description: 'Returns performance comparison for all centers',
  })
  async getCenterPerformance() {
    return this.analyticsService.getCenterPerformanceComparison();
  }

  @Get('follow-up-compliance')
  @ApiOperation({ summary: 'Get follow-up compliance tracking' })
  @ApiQuery({
    name: 'centerId',
    required: false,
    type: String,
    description: 'Filter by specific center',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns follow-up compliance data',
  })
  async getFollowUpCompliance(@Query('centerId') centerId?: string) {
    return this.analyticsService.getFollowUpCompliance(centerId);
  }
}
