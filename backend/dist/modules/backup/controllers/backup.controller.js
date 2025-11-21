"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/decorators/roles.decorator");
const backup_service_1 = require("../services/backup.service");
const create_backup_job_dto_1 = require("../dto/create-backup-job.dto");
let BackupController = class BackupController {
    constructor(backupService) {
        this.backupService = backupService;
    }
    async getBackupJobs(backupType, dataSource, isActive, centerId) {
        const filters = {
            backupType,
            dataSource,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
            centerId,
        };
        return this.backupService.getBackupJobs(filters);
    }
    async createBackupJob(createBackupJobDto, req) {
        return this.backupService.createBackupJob({
            ...createBackupJobDto,
            createdBy: req.user.userId,
        });
    }
    async getBackupJob(id) {
        return this.backupService.getBackupJob(id);
    }
    async toggleBackupJob(id) {
        return this.backupService.toggleBackupJob(id);
    }
    async deleteBackupJob(id) {
        return this.backupService.deleteBackupJob(id);
    }
    async executeBackup(id) {
        return this.backupService.executeBackup(id);
    }
    async getBackupExecutions(backupJobId, status, startDate, endDate, limit) {
        const filters = {
            backupJobId,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.backupService.getBackupExecutions(filters);
    }
    async getBackupExecution(id) {
        return this.backupService.getBackupExecution(id);
    }
    async deleteBackupExecution(id) {
        return this.backupService.deleteBackupExecution(id);
    }
    async restoreFromBackup(id, restoreOptions) {
        return this.backupService.restoreFromBackup(id, restoreOptions);
    }
    async getBackupStatistics(centerId) {
        return this.backupService.getBackupStatistics(centerId);
    }
    async getBackupHealth(centerId) {
        return this.backupService.getBackupHealthStatus(centerId);
    }
    async performCleanup(cleanupOptions) {
        return this.backupService.performCleanup(cleanupOptions);
    }
    async getStorageUsage(centerId) {
        return this.backupService.getStorageUsage(centerId);
    }
    async getRetentionPolicy(centerId) {
        return this.backupService.getRetentionPolicy(centerId);
    }
    async updateRetentionPolicy(retentionPolicy) {
        return this.backupService.updateRetentionPolicy(retentionPolicyPolicy);
    }
    async getRestoreHistory(backupJobId, executionId, startDate, endDate, limit) {
        const filters = {
            backupJobId,
            executionId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.backupService.getRestoreHistory(filters);
    }
    async verifyBackup(executionId) {
        return this.backupService.verifyBackupIntegrity(executionId);
    }
    async getStorageConfigurations() {
        return this.backupService.getStorageConfigurations();
    }
    async addStorageConfiguration(storageConfig) {
        return this.backupService.addStorageConfiguration(storageConfig);
    }
    async getBackupTemplates() {
        return this.backupService.getBackupTemplates();
    }
    async createBackupTemplate(templateData, req) {
        return this.backupService.createBackupTemplate({
            ...templateData,
            createdBy: req.user.userId,
        });
    }
    async testStorageConnection(id) {
        return this.backupService.testStorageConnection(id);
    }
    async getBackupAlerts(severity, limit) {
        return this.backupService.getBackupAlerts({
            severity,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async rescheduleBackupJob(id, rescheduleData) {
        return this.backupService.rescheduleBackupJob(id, rescheduleData);
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)('jobs'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup jobs retrieved successfully' }),
    __param(0, (0, common_1.Query)('backupType')),
    __param(1, (0, common_1.Query)('dataSource')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupJobs", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new backup job' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Backup job created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_backup_job_dto_1.CreateBackupJobDto, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackupJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup job by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup job retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupJob", null);
__decorate([
    (0, common_1.Put)('jobs/:id/toggle'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle backup job active status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup job status updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "toggleBackupJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete backup job' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Backup job deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackupJob", null);
__decorate([
    (0, common_1.Post)('jobs/:id/execute'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute backup job manually' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup execution started' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "executeBackup", null);
__decorate([
    (0, common_1.Get)('executions'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup executions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup executions retrieved successfully' }),
    __param(0, (0, common_1.Query)('backupJobId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupExecutions", null);
__decorate([
    (0, common_1.Get)('executions/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup execution by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup execution retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupExecution", null);
__decorate([
    (0, common_1.Delete)('executions/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete backup execution' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Backup execution deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackupExecution", null);
__decorate([
    (0, common_1.Post)('executions/:id/restore'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore from backup execution' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restore operation completed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restoreFromBackup", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupStatistics", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup health status retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupHealth", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform backup cleanup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup cleanup completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "performCleanup", null);
__decorate([
    (0, common_1.Get)('storage-usage'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage usage information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage usage retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getStorageUsage", null);
__decorate([
    (0, common_1.Get)('retention-policy'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup retention policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retention policy retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getRetentionPolicy", null);
__decorate([
    (0, common_1.Put)('retention-policy'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Update backup retention policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retention policy updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "updateRetentionPolicy", null);
__decorate([
    (0, common_1.Get)('restore-history'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get restore operation history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restore history retrieved successfully' }),
    __param(0, (0, common_1.Query)('backupJobId')),
    __param(1, (0, common_1.Query)('executionId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getRestoreHistory", null);
__decorate([
    (0, common_1.Post)('verify/:executionId'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify backup integrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup verification completed' }),
    __param(0, (0, common_1.Param)('executionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "verifyBackup", null);
__decorate([
    (0, common_1.Get)('configs/storage'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get storage configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Storage configurations retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getStorageConfigurations", null);
__decorate([
    (0, common_1.Post)('configs/storage'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Add storage configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Storage configuration added successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "addStorageConfiguration", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup job templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup templates retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Create backup job template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Backup template created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackupTemplate", null);
__decorate([
    (0, common_1.Post)('jobs/:id/test-connection'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Test backup storage connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection test completed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "testStorageConnection", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup system alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup alerts retrieved successfully' }),
    __param(0, (0, common_1.Query)('severity')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupAlerts", null);
__decorate([
    (0, common_1.Post)('jobs/:id/reschedule'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule backup job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup job rescheduled successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "rescheduleBackupJob", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('backup'),
    (0, common_1.Controller)('backup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map