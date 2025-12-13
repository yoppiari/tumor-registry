import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('System Monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get overall system health status' })
  @ApiResponse({ status: 200, description: 'System health status retrieved successfully' })
  @RequirePermissions('SYSTEM_HEALTH_READ')
  async getSystemHealth() {
    return await this.monitoringService.getSystemHealth();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get system performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getPerformanceMetrics() {
    return await this.monitoringService.getPerformanceMetrics();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get system metrics by time range' })
  @ApiQuery({ name: 'timeRange', enum: ['hour', 'day', 'week', 'month'], required: false })
  @ApiResponse({ status: 200, description: 'System metrics retrieved successfully' })
  @RequirePermissions('SYSTEM_METRICS_READ')
  async getSystemMetrics(@Query('timeRange') timeRange?: 'hour' | 'day' | 'week' | 'month') {
    return await this.monitoringService.getSystemMetrics(timeRange);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get active system alerts' })
  @ApiResponse({ status: 200, description: 'Active alerts retrieved successfully' })
  @RequirePermissions('ALERT_READ')
  async getActiveAlerts() {
    return await this.monitoringService.getActiveAlerts();
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create new system alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  @RequirePermissions('ALERT_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'alert')
  async createAlert(@Body() alertData: {
    type: 'system' | 'performance' | 'security' | 'business';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    details?: any;
    component?: string;
    thresholds?: any;
    actions?: string[];
  }) {
    return await this.monitoringService.createAlert(alertData);
  }

  @Put('alerts/:alertId/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged successfully' })
  @RequirePermissions('ALERT_UPDATE')
  @AuditLog('ACKNOWLEDGE', 'alert')
  async acknowledgeAlert(
    @Param('alertId') alertId: string,
    @Body() acknowledgement: {
      userId: string;
      notes?: string;
    }
  ) {
    return await this.monitoringService.acknowledgeAlert(
      alertId,
      acknowledgement.userId,
      acknowledgement.notes
    );
  }

  @Put('alerts/:alertId/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully' })
  @RequirePermissions('ALERT_UPDATE')
  @AuditLog('RESOLVE', 'alert')
  async resolveAlert(
    @Param('alertId') alertId: string,
    @Body() resolution: {
      userId: string;
      resolution: string;
    }
  ) {
    return await this.monitoringService.resolveAlert(
      alertId,
      resolution.userId,
      resolution.resolution
    );
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs with filtering' })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'component', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  @RequirePermissions('AUDIT_LOG_READ')
  async getAuditLogs(@Query() filters: {
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
    action?: string;
    component?: string;
    severity?: string;
    page?: number;
    limit?: number;
  }) {
    return await this.monitoringService.getAuditLogs(filters);
  }

  @Post('audit-logs')
  @ApiOperation({ summary: 'Create audit log entry' })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  @RequirePermissions('AUDIT_LOG_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'audit_log')
  async createAuditLog(@Body() logData: {
    userId: string;
    action: string;
    component: string;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return await this.monitoringService.createAuditLog(logData);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get monitoring dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @RequirePermissions('DASHBOARD_VIEW')
  async getDashboardData() {
    const [health, performance, alerts, metrics] = await Promise.all([
      this.monitoringService.getSystemHealth(),
      this.monitoringService.getPerformanceMetrics(),
      this.monitoringService.getActiveAlerts(),
      this.monitoringService.getSystemMetrics('hour'),
    ]);

    return {
      timestamp: new Date(),
      health,
      performance,
      alerts: alerts.slice(0, 10), // Top 10 recent alerts
      metrics,
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        systemScore: health.score,
        uptime: performance.application?.uptime || 0,
      },
    };
  }
}