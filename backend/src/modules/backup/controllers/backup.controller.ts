import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { BackupService } from '../services/backup.service';
import { CreateBackupJobDto } from '../dto/create-backup-job.dto';

@ApiTags('backup')
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('jobs')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup jobs' })
  @ApiResponse({ status: 200, description: 'Backup jobs retrieved successfully' })
  async getBackupJobs(
    @Query('backupType') backupType?: string,
    @Query('dataSource') dataSource?: string,
    @Query('isActive') isActive?: string,
    @Query('centerId') centerId?: string,
  ) {
    const filters = {
      backupType,
      dataSource,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      centerId,
    };

    return this.backupService.getBackupJobs(filters);
  }

  @Post('jobs')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Create new backup job' })
  @ApiResponse({ status: 201, description: 'Backup job created successfully' })
  async createBackupJob(
    @Body() createBackupJobDto: CreateBackupJobDto,
    @Request() req: any,
  ) {
    return this.backupService.createBackupJob({
      ...createBackupJobDto,
      createdBy: req.user.userId,
    });
  }

  @Get('jobs/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup job by ID' })
  @ApiResponse({ status: 200, description: 'Backup job retrieved successfully' })
  async getBackupJob(@Param('id') id: string) {
    return this.backupService.getBackupJob(id);
  }

  @Put('jobs/:id/toggle')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Toggle backup job active status' })
  @ApiResponse({ status: 200, description: 'Backup job status updated successfully' })
  async toggleBackupJob(@Param('id') id: string) {
    return this.backupService.toggleBackupJob(id);
  }

  @Delete('jobs/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete backup job' })
  @ApiResponse({ status: 204, description: 'Backup job deleted successfully' })
  async deleteBackupJob(@Param('id') id: string) {
    return this.backupService.deleteBackupJob(id);
  }

  @Post('jobs/:id/execute')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Execute backup job manually' })
  @ApiResponse({ status: 200, description: 'Backup execution started' })
  async executeBackup(@Param('id') id: string) {
    return this.backupService.executeBackup(id);
  }

  @Get('executions')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup executions' })
  @ApiResponse({ status: 200, description: 'Backup executions retrieved successfully' })
  async getBackupExecutions(
    @Query('backupJobId') backupJobId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      backupJobId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.backupService.getBackupExecutions(filters);
  }

  @Get('executions/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup execution by ID' })
  @ApiResponse({ status: 200, description: 'Backup execution retrieved successfully' })
  async getBackupExecution(@Param('id') id: string) {
    return this.backupService.getBackupExecution(id);
  }

  @Delete('executions/:id')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete backup execution' })
  @ApiResponse({ status: 204, description: 'Backup execution deleted successfully' })
  async deleteBackupExecution(@Param('id') id: string) {
    return this.backupService.deleteBackupExecution(id);
  }

  @Post('executions/:id/restore')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Restore from backup execution' })
  @ApiResponse({ status: 200, description: 'Restore operation completed' })
  async restoreFromBackup(
    @Param('id') id: string,
    @Body() restoreOptions: {
      targetDatabase?: string;
      overwriteExisting?: boolean;
      skipErrors?: boolean;
      verifyIntegrity?: boolean;
      dryRun?: boolean;
    },
  ) {
    return this.backupService.restoreFromBackup(id, restoreOptions);
  }

  @Get('statistics')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup statistics' })
  @ApiResponse({ status: 200, description: 'Backup statistics retrieved successfully' })
  async getBackupStatistics(@Query('centerId') centerId?: string) {
    return this.backupService.getBackupStatistics(centerId);
  }

  @Get('health')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup system health status' })
  @ApiResponse({ status: 200, description: 'Backup health status retrieved successfully' })
  async getBackupHealth(@Query('centerId') centerId?: string) {
    return this.backupService.getBackupHealthStatus(centerId);
  }

  @Post('cleanup')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Perform backup cleanup' })
  @ApiResponse({ status: 200, description: 'Backup cleanup completed' })
  async performCleanup(@Body() cleanupOptions: {
    retentionDays?: number;
    dryRun?: boolean;
    backupJobId?: string;
    centerId?: string;
  }) {
    return this.backupService.performCleanup(cleanupOptions);
  }

  @Get('storage-usage')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get storage usage information' })
  @ApiResponse({ status: 200, description: 'Storage usage retrieved successfully' })
  async getStorageUsage(@Query('centerId') centerId?: string) {
    return this.backupService.getStorageUsage(centerId);
  }

  @Get('retention-policy')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup retention policy' })
  @ApiResponse({ status: 200, description: 'Retention policy retrieved successfully' })
  async getRetentionPolicy(@Query('centerId') centerId?: string) {
    return this.backupService.getRetentionPolicy(centerId);
  }

  @Put('retention-policy')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Update backup retention policy' })
  @ApiResponse({ status: 200, description: 'Retention policy updated successfully' })
  async updateRetentionPolicy(
    @Body() retentionPolicy: {
      dailyBackups: number;
      weeklyBackups: number;
      monthlyBackups: number;
      yearlyBackups: number;
      centerId?: string;
    },
  ) {
    return this.backupService.updateRetentionPolicy(retentionPolicyPolicy);
  }

  @Get('restore-history')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get restore operation history' })
  @ApiResponse({ status: 200, description: 'Restore history retrieved successfully' })
  async getRestoreHistory(
    @Query('backupJobId') backupJobId?: string,
    @Query('executionId') executionId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      backupJobId,
      executionId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.backupService.getRestoreHistory(filters);
  }

  @Post('verify/:executionId')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Verify backup integrity' })
  @ApiResponse({ status: 200, description: 'Backup verification completed' })
  async verifyBackup(@Param('executionId') executionId: string) {
    return this.backupService.verifyBackupIntegrity(executionId);
  }

  @Get('configs/storage')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get storage configurations' })
  @ApiResponse({ status: 200, description: 'Storage configurations retrieved successfully' })
  async getStorageConfigurations() {
    return this.backupService.getStorageConfigurations();
  }

  @Post('configs/storage')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Add storage configuration' })
  @ApiResponse({ status: 201, description: 'Storage configuration added successfully' })
  async addStorageConfiguration(@Body() storageConfig: any) {
    return this.backupService.addStorageConfiguration(storageConfig);
  }

  @Get('templates')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup job templates' })
  @ApiResponse({ status: 200, description: 'Backup templates retrieved successfully' })
  async getBackupTemplates() {
    return this.backupService.getBackupTemplates();
  }

  @Post('templates')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Create backup job template' })
  @ApiResponse({ status: 201, description: 'Backup template created successfully' })
  async createBackupTemplate(
    @Body() templateData: {
      name: string;
      description?: string;
      backupType: string;
      dataSource: string;
      backupOptions?: any;
    },
    @Request() req: any,
  ) {
    return this.backupService.createBackupTemplate({
      ...templateData,
      createdBy: req.user.userId,
    });
  }

  @Post('jobs/:id/test-connection')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Test backup storage connection' })
  @ApiResponse({ status: 200, description: 'Connection test completed' })
  async testStorageConnection(@Param('id') id: string) {
    return this.backupService.testStorageConnection(id);
  }

  @Get('alerts')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Get backup system alerts' })
  @ApiResponse({ status: 200, description: 'Backup alerts retrieved successfully' })
  async getBackupAlerts(
    @Query('severity') severity?: string,
    @Query('limit') limit?: string,
  ) {
    return this.backupService.getBackupAlerts({
      severity,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('jobs/:id/reschedule')
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Reschedule backup job' })
  @ApiResponse({ status: 200, description: 'Backup job rescheduled successfully' })
  async rescheduleBackupJob(
    @Param('id') id: string,
    @Body() rescheduleData: {
      schedule: string;
      timezone?: string;
    },
  ) {
    return this.backupService.rescheduleBackupJob(id, rescheduleData);
  }
}