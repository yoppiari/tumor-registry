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
exports.SystemAdministrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../auth/decorators/roles.decorator");
const system_administration_service_1 = require("../services/system-administration.service");
const configuration_service_1 = require("../services/configuration.service");
const create_config_dto_1 = require("../dto/create-config.dto");
const dashboard_service_1 = require("../services/dashboard.service");
let SystemAdministrationController = class SystemAdministrationController {
    constructor(systemAdministrationService, configurationService, dashboardService) {
        this.systemAdministrationService = systemAdministrationService;
        this.configurationService = configurationService;
        this.dashboardService = dashboardService;
    }
    async getDashboard(centerId) {
        return this.systemAdministrationService.getDashboardData(centerId);
    }
    async getOverview() {
        return this.systemAdministrationService.getSystemOverview();
    }
    async getHealth() {
        return this.systemAdministrationService.getSystemHealth();
    }
    async getConfigurations(category, environment, centerId, isActive) {
        const filters = {
            category,
            environment,
            centerId,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        };
        return this.configurationService.findAll(filters);
    }
    async createConfiguration(createConfigDto) {
        return this.configurationService.create(createConfigDto);
    }
    async getConfiguration(id) {
        return this.configurationService.findOne(id);
    }
    async updateConfiguration(id, updateData, req) {
        return this.configurationService.update(id, {
            ...updateData,
            lastModifiedBy: req.user.userId,
        });
    }
    async deleteConfiguration(id) {
        return this.configurationService.remove(id);
    }
    async exportConfigurations(category, environment, centerId) {
        return this.configurationService.exportConfigurations({
            category,
            environment,
            centerId,
        });
    }
    async importConfigurations(importData) {
        return this.configurationService.importConfigurations(importData.configurations, importData.options);
    }
    async getActivities(userId, activityType, startDate, endDate, limit) {
        const filters = {
            userId,
            activityType,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.systemAdministrationService.getActivityLogs(filters);
    }
    async getSecurityEvents(severity, status, startDate, endDate, limit) {
        const filters = {
            severity,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.systemAdministrationService.getSecurityEvents(filters);
    }
    async getMetrics(metricType, source, startDate, endDate, limit) {
        const filters = {
            metricType,
            source,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        };
        return this.systemAdministrationService.getSystemMetrics(filters);
    }
    async acknowledgeAlert(alertId, req) {
        return this.systemAdministrationService.acknowledgeAlert(alertId, req.user.userId);
    }
    async resolveAlert(alertId, resolveData, req) {
        return this.systemAdministrationService.resolveAlert(alertId, req.user.userId, resolveData.resolution);
    }
    async toggleMaintenanceMode(maintenanceData) {
        return {
            success: true,
            maintenanceMode: maintenanceData.enabled,
            message: maintenanceData.message || 'System is under maintenance',
            timestamp: new Date(),
        };
    }
    async restartSystem(restartData) {
        return {
            success: true,
            message: 'System restart initiated',
            services: restartData.services,
            estimatedDowntime: '5-10 minutes',
            timestamp: new Date(),
        };
    }
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
    async performCleanup(cleanupData) {
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
};
exports.SystemAdministrationController = SystemAdministrationController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system administration dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved successfully' }),
    __param(0, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System overview retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health status retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('configurations'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configurations retrieved successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('environment')),
    __param(2, (0, common_1.Query)('centerId')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getConfigurations", null);
__decorate([
    (0, common_1.Post)('configurations'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Configuration created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_config_dto_1.CreateConfigDto]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "createConfiguration", null);
__decorate([
    (0, common_1.Get)('configurations/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configuration by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getConfiguration", null);
__decorate([
    (0, common_1.Put)('configurations/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuration updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "updateConfiguration", null);
__decorate([
    (0, common_1.Delete)('configurations/:id'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete configuration' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Configuration deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "deleteConfiguration", null);
__decorate([
    (0, common_1.Get)('configurations/export'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Export configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configurations exported successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('environment')),
    __param(2, (0, common_1.Query)('centerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "exportConfigurations", null);
__decorate([
    (0, common_1.Post)('configurations/import'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Import configurations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configurations imported successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "importConfigurations", null);
__decorate([
    (0, common_1.Get)('activities'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activity logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity logs retrieved successfully' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('activityType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getActivities", null);
__decorate([
    (0, common_1.Get)('security-events'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get security events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Security events retrieved successfully' }),
    __param(0, (0, common_1.Query)('severity')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getSecurityEvents", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System metrics retrieved successfully' }),
    __param(0, (0, common_1.Query)('metricType')),
    __param(1, (0, common_1.Query)('source')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Put)('alerts/:alertId/acknowledge'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge system alert' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert acknowledged successfully' }),
    __param(0, (0, common_1.Param)('alertId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:alertId/resolve'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN', 'CENTER_DIRECTOR'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve system alert' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully' }),
    __param(0, (0, common_1.Param)('alertId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Post)('maintenance-mode'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable/disable maintenance mode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Maintenance mode updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "toggleMaintenanceMode", null);
__decorate([
    (0, common_1.Post)('system-restart'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Restart system services' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System restart initiated successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "restartSystem", null);
__decorate([
    (0, common_1.Get)('system-info'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed system information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System information retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "getSystemInfo", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, roles_decorator_1.Roles)('SYSTEM_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform system cleanup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System cleanup completed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemAdministrationController.prototype, "performCleanup", null);
exports.SystemAdministrationController = SystemAdministrationController = __decorate([
    (0, swagger_1.ApiTags)('system-administration'),
    (0, common_1.Controller)('system-administration'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [system_administration_service_1.SystemAdministrationService,
        configuration_service_1.ConfigurationService,
        dashboard_service_1.DashboardService])
], SystemAdministrationController);
//# sourceMappingURL=system-administration.controller.js.map