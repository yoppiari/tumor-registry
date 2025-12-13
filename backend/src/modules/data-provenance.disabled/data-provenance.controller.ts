import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { DataProvenanceService } from './data-provenance.service';

@ApiTags('Data Provenance')
@Controller('data-provenance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataProvenanceController {
  constructor(private readonly provenanceService: DataProvenanceService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track data change' })
  async trackDataChange(
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Body('fieldName') fieldName: string,
    @Body('oldValue') oldValue: any,
    @Body('newValue') newValue: any,
    @Body('reason') reason: string,
    @Body('source') source: string,
    @Req() req: any,
  ) {
    return this.provenanceService.trackDataChange(
      entityType,
      entityId,
      fieldName,
      oldValue,
      newValue,
      req.user.userId,
      reason,
      source,
    );
  }

  @Get('history/:entityType/:entityId')
  @ApiOperation({ summary: 'Get data change history' })
  async getDataHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('fieldName') fieldName?: string,
  ) {
    return this.provenanceService.getDataHistory(entityType, entityId, fieldName);
  }

  @Get('timeline/:entityType/:entityId')
  @ApiOperation({ summary: 'Get data timeline visualization' })
  async getDataTimeline(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.provenanceService.getDataTimeline(entityType, entityId);
  }

  @Post('rollback/:provenanceId')
  @ApiOperation({ summary: 'Rollback to previous version' })
  async rollbackToVersion(@Param('provenanceId') provenanceId: string, @Req() req: any) {
    return this.provenanceService.rollbackToVersion(provenanceId, req.user.userId);
  }

  @Get('verify/:entityType/:entityId')
  @ApiOperation({ summary: 'Verify data integrity' })
  async verifyDataIntegrity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.provenanceService.verifyDataIntegrity(entityType, entityId);
  }

  @Get('lineage/:entityType/:entityId')
  @ApiOperation({ summary: 'Get data lineage' })
  async getDataLineage(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.provenanceService.getDataLineage(entityType, entityId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get provenance statistics' })
  async getProvenanceStatistics(@Query('entityType') entityType?: string, @Query('days') days?: number) {
    return this.provenanceService.getProvenanceStatistics(entityType, days ? parseInt(days.toString()) : 30);
  }
}
