import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { EnhancedThrottlerGuard } from '../auth/guards/enhanced-throttler.guard';
import { AnalyticsService } from './analytics.service';
import { ExecutiveDashboardQueryDto, EnhancedAnalyticsQueryDto } from './dto/enhanced-analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, EnhancedThrottlerGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get analytics dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({ name: 'timeRange', required: false, description: 'Time range (7d, 30d, 90d, 1y)' })
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ExecutiveDashboardQueryDto
  ) {
    return await this.analyticsService.getDashboardData(query.centerId, query.timeRange);
  }

  @Get('cancer-stats')
  @ApiOperation({ summary: 'Get cancer statistics' })
  @ApiResponse({ status: 200, description: 'Cancer statistics retrieved successfully' })
  @ApiQuery({ name: 'provinceId', required: false, description: 'Filter by province' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Filter by cancer type' })
  async getCancerStats(
    @Query('provinceId') provinceId?: string,
    @Query('cancerType') cancerType?: string,
  ) {
    return await this.analyticsService.getCancerStatistics(provinceId, cancerType);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get cancer trends over time' })
  @ApiResponse({ status: 200, description: 'Trend data retrieved successfully' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (monthly, quarterly, yearly)' })
  async getTrends(@Query('period') period?: string) {
    return await this.analyticsService.getCancerTrends(period);
  }

  @Get('center-performance')
  @ApiOperation({ summary: 'Get center performance metrics' })
  @ApiResponse({ status: 200, description: 'Center performance data retrieved successfully' })
  async getCenterPerformance() {
    return await this.analyticsService.getCenterPerformance();
  }
}