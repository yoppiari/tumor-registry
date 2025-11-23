import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SecurityMonitoringService } from './security-monitoring.service';

@ApiTags('Security Monitoring')
@Controller('security')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SecurityMonitoringController {
  constructor(private readonly securityService: SecurityMonitoringService) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Get security alerts' })
  async getSecurityAlerts(@Query('userId') userId?: string, @Query('limit') limit?: number) {
    return this.securityService.getSecurityAlerts(userId, limit ? parseInt(limit.toString()) : 50);
  }

  @Get('alerts/:id')
  @ApiOperation({ summary: 'Get security alert by ID' })
  async getSecurityAlert(@Param('id') id: string) {
    return this.securityService.getSecurityAlert(id);
  }

  @Put('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve security alert' })
  async resolveAlert(
    @Param('id') id: string,
    @Body('resolution') resolution: string,
    @Req() req: any,
  ) {
    return this.securityService.resolveAlert(id, req.user.userId, resolution);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Get security incidents' })
  async getSecurityIncidents(@Query('status') status?: string, @Query('severity') severity?: string) {
    return this.securityService.getSecurityIncidents(status, severity);
  }

  @Post('incidents')
  @ApiOperation({ summary: 'Create security incident' })
  async createSecurityIncident(
    @Body('type') type: string,
    @Body('severity') severity: string,
    @Body('description') description: string,
    @Body('details') details: any,
    @Req() req: any,
  ) {
    return this.securityService.createSecurityIncident(req.user.userId, type, severity, description, details);
  }

  @Put('incidents/:id/status')
  @ApiOperation({ summary: 'Update incident status' })
  async updateIncidentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.securityService.updateIncidentStatus(id, status, req.user.userId);
  }

  @Get('threat-intelligence')
  @ApiOperation({ summary: 'Get threat intelligence' })
  async getThreatIntelligence() {
    return this.securityService.getThreatIntelligence();
  }

  @Post('scan/threats')
  @ApiOperation({ summary: 'Scan for security threats' })
  async scanForThreats(@Query('userId') userId?: string) {
    return this.securityService.scanForThreats(userId);
  }

  @Get('behavior/analyze/:userId')
  @ApiOperation({ summary: 'Analyze user behavior' })
  async analyzeBehavior(@Param('userId') userId: string) {
    return this.securityService.analyzeBehavior(userId);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get security metrics' })
  async getSecurityMetrics(@Query('days') days?: number) {
    return this.securityService.getSecurityMetrics(days ? parseInt(days.toString()) : 30);
  }
}
