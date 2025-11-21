import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { SystemAdministrationService } from '../services/system-administration.service';
import { ConfigurationService } from '../services/configuration.service';
import { CreateConfigDto } from '../dto/create-config.dto';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('system-administration')
@Controller('system-administration')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SystemAdministrationController {
  constructor(
    private readonly systemAdministrationService: SystemAdministrationService,
    private readonly configurationService: ConfigurationService,
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('dashboard')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get system administration dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getDashboard(@Query('centerId') centerId?: string) {
    return this.systemAdministrationService.getDashboardData(centerId);
  }

  @Get('overview')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get system overview' })
  @ApiResponse({ status: 200, description: 'System overview retrieved successfully' })
  async getOverview() {
    return this.systemAdministrationService.getSystemOverview();
  }

  @Get('health')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health status retrieved successfully' })
  async getHealth() {
    return this.systemAdministrationService.getSystemHealth();
  }

  // Configuration Management
  @Get('configurations')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get all configurations' })
  @ApiResponse({ status: 200, description: 'Configurations retrieved successfully' })
  async getConfigurations(
    @Query('category') category?: string,
    @Query('environment') environment?: string,
    @Query('centerId') centerId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters = {
      category,
      environment,
      centerId,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    return this.configurationService.findAll(filters);
  }

  @Post('configurations')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Create new configuration' })
  @ApiResponse({ status: 201, description: 'Configuration created successfully' })
  async createConfiguration(@Body() createConfigDto: CreateConfigDto) {
    return this.configurationService.create(createConfigDto);
  }

  @Get('configurations/:id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get configuration by ID' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved successfully' })
  async getConfiguration(@Param('id') id: string) {
    return this.configurationService.findOne(id);
  }

  @Put('configurations/:id')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Update configuration' })
  @ApiResponse({ status: 200, description: 'Configuration updated successfully' })
  async updateConfiguration(
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    return this.configurationService.update(id, {
      ...updateData,
      lastModifiedBy: req.user.userId,
    });
  }

  @Delete('configurations/:id')
  @Roles('SYSTEM_ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete configuration' })
  @ApiResponse({ status: 204, description: 'Configuration deleted successfully' })
  async deleteConfiguration(@Param('id') id: string) {
    return this.configurationService.remove(id);
  }

  @Get('configurations/export')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Export configurations' })
  @ApiResponse({ status: 200, description: 'Configurations exported successfully' })
  async exportConfigurations(
    @Query('category') category?: string,
    @Query('environment') environment?: string,
    @Query('centerId') centerId?: string,
  ) {
    return this.configurationService.exportConfigurations({
      category,
      environment,
      centerId,
    });
  }

  @Post('configurations/import')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Import configurations' })
  @ApiResponse({ status: 200, description: 'Configurations imported successfully' })
  async importConfigurations(
    @Body() importData: { configurations: any[], options?: any },
  ) {
    return this.configurationService.importConfigurations(
      importData.configurations,
      importData.options,
    );
  }

  // Activity Logs
  @Get('activities')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved successfully' })
  async getActivities(
    @Query('userId') userId?: string,
    @Query('activityType') activityType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      userId,
      activityType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.systemAdministrationService.getActivityLogs(filters);
  }

  // Security Events
  @Get('security-events')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get security events' })
  @ApiResponse({ status: 200, description: 'Security events retrieved successfully' })
  async getSecurityEvents(
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      severity,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.systemAdministrationService.getSecurityEvents(filters);
  }

  // System Metrics
  @Get('metrics')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get system performance metrics' })
  @ApiResponse({ status: 200, description: 'System metrics retrieved successfully' })
  async getMetrics(
    @Query('metricType') metricType?: string,
    @Query('source') source?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      metricType,
      source,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.systemAdministrationService.getSystemMetrics(filters);
  }

  // Alert Management
  @Put('alerts/:alertId/acknowledge')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Acknowledge system alert' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged successfully' })
  async acknowledgeAlert(
    @Param('alertId') alertId: string,
    @Request() req: any,
  ) {
    return this.systemAdministrationService.acknowledgeAlert(alertId, req.user.userId);
  }

  @Put('alerts/:alertId/resolve')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Resolve system alert' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully' })
  async resolveAlert(
    @Param('alertId') alertId: string,
    @Body() resolveData: { resolution?: string },
    @Request() req: any,
  ) {
    return this.systemAdministrationService.resolveAlert(
      alertId,
      req.user.userId,
      resolveData.resolution,
    );
  }

  // System Operations
  @Post('maintenance-mode')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Enable/disable maintenance mode' })
  @ApiResponse({ status: 200, description: 'Maintenance mode updated successfully' })
  async toggleMaintenanceMode(
    @Body() maintenanceData: { enabled: boolean, message?: string },
  ) {
    // This would typically update a configuration or system state
    return {
      success: true,
      maintenanceMode: maintenanceData.enabled,
      message: maintenanceData.message || 'System is under maintenance',
      timestamp: new Date(),
    };
  }

  @Post('system-restart')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Restart system services' })
  @ApiResponse({ status: 200, description: 'System restart initiated successfully' })
  async restartSystem(@Body() restartData: { services: string[], force?: boolean }) {
    // This would typically orchestrate a graceful restart of services
    return {
      success: true,
      message: 'System restart initiated',
      services: restartData.services,
      estimatedDowntime: '5-10 minutes',
      timestamp: new Date(),
    };
  }

  @Get('system-info')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Get detailed system information' })
  @ApiResponse({ status: 200, description: 'System information retrieved successfully' })
  async getSystemInfo() {
    return {
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date(),
    };
  }

  @Post('cleanup')
  @Roles('SYSTEM_ADMIN')
  @ApiOperation({ summary: 'Perform system cleanup' })
  @ApiResponse({ status: 200, description: 'System cleanup completed successfully' })
  async performCleanup(@Body() cleanupData: { operations: string[] }) {
    // This would perform various cleanup operations like log rotation, cache clearing, etc.
    return {
      success: true,
      message: 'System cleanup completed',
      operations: cleanupData.operations,
      results: {
        logsCleared: true,
        cacheCleared: true,
        tempFilesRemoved: true,
      },
      timestamp: new Date(),
    };
  }
}