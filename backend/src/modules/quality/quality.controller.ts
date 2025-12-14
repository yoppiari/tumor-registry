import { Controller, Get, Param, Query, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { QualityService } from './quality.service';

@ApiTags('quality')
@Controller('quality')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QualityController {
  private readonly logger = new Logger(QualityController.name);

  constructor(private readonly qualityService: QualityService) {}

  @Get('patient/:patientId/score')
  @ApiOperation({ summary: 'Calculate quality score for a patient' })
  @ApiResponse({ status: 200, description: 'Quality score calculated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientQualityScore(@Param('patientId') patientId: string) {
    this.logger.log(`Calculating quality score for patient ${patientId}`);
    return this.qualityService.calculateQualityScore(patientId);
  }

  @Get('patient/:patientId/trends')
  @ApiOperation({ summary: 'Get quality trends for a patient' })
  @ApiResponse({ status: 200, description: 'Quality trends retrieved successfully' })
  async getPatientQualityTrends(
    @Param('patientId') patientId: string,
    @Query('days') days?: string
  ) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    this.logger.log(`Getting quality trends for patient ${patientId} for last ${daysNumber} days`);
    return this.qualityService.getQualityTrends(patientId, daysNumber);
  }

  @Get('patient/:patientId/validate')
  @ApiOperation({ summary: 'Validate patient data quality' })
  @ApiResponse({ status: 200, description: 'Patient data validated successfully' })
  async validatePatientData(@Param('patientId') patientId: string) {
    this.logger.log(`Validating data for patient ${patientId}`);
    return this.qualityService.validatePatientData(patientId);
  }

  @Get('center/:centerId/summary')
  @ApiOperation({ summary: 'Get quality summary for a center' })
  @ApiResponse({ status: 200, description: 'Center quality summary retrieved successfully' })
  async getCenterQualitySummary(@Param('centerId') centerId: string) {
    this.logger.log(`Getting quality summary for center ${centerId}`);
    return this.qualityService.getCenterQualitySummary(centerId);
  }

  @Get('national/overview')
  @ApiOperation({ summary: 'Get national quality overview' })
  @ApiResponse({ status: 200, description: 'National quality overview retrieved successfully' })
  async getNationalQualityOverview() {
    this.logger.log('Getting national quality overview');
    return this.qualityService.getNationalQualityOverview();
  }

  @Get('staff-performance')
  @ApiOperation({ summary: 'Get staff performance leaderboard' })
  @ApiResponse({ status: 200, description: 'Staff performance leaderboard retrieved successfully' })
  async getStaffPerformanceLeaderboard(@Query('centerId') centerId?: string) {
    this.logger.log(`Getting staff performance leaderboard${centerId ? ` for center ${centerId}` : ' (all centers)'}`);
    return this.qualityService.getStaffPerformanceLeaderboard(centerId);
  }

  @Get('missing-data-heatmap')
  @ApiOperation({ summary: 'Get missing data heatmap' })
  @ApiResponse({ status: 200, description: 'Missing data heatmap retrieved successfully' })
  async getMissingDataHeatmap(@Query('centerId') centerId?: string) {
    this.logger.log(`Getting missing data heatmap${centerId ? ` for center ${centerId}` : ' (all centers)'}`);
    return this.qualityService.getMissingDataHeatmap(centerId);
  }
}
