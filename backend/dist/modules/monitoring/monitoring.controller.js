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
exports.MonitoringController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const monitoring_service_1 = require("./monitoring.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
let MonitoringController = class MonitoringController {
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    async getSystemHealth() {
        return await this.monitoringService.getSystemHealth();
    }
    async getPerformanceMetrics() {
        return await this.monitoringService.getPerformanceMetrics();
    }
    async getSystemMetrics(timeRange) {
        return await this.monitoringService.getSystemMetrics(timeRange);
    }
    async getActiveAlerts() {
        return await this.monitoringService.getActiveAlerts();
    }
    async createAlert(alertData) {
        return await this.monitoringService.createAlert(alertData);
    }
    async acknowledgeAlert(alertId, acknowledgement) {
        return await this.monitoringService.acknowledgeAlert(alertId, acknowledgement.userId, acknowledgement.notes);
    }
    async resolveAlert(alertId, resolution) {
        return await this.monitoringService.resolveAlert(alertId, resolution.userId, resolution.resolution);
    }
    async getAuditLogs(filters) {
        return await this.monitoringService.getAuditLogs(filters);
    }
    async createAuditLog(logData) {
        return await this.monitoringService.createAuditLog(logData);
    }
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
            alerts: alerts.slice(0, 10),
            metrics,
            summary: {
                totalAlerts: alerts.length,
                criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
                systemScore: health.score,
                uptime: performance.application?.uptime || 0,
            },
        };
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health status retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_HEALTH_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance metrics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_METRICS_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getPerformanceMetrics", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system metrics by time range' }),
    (0, swagger_1.ApiQuery)({ name: 'timeRange', enum: ['hour', 'day', 'week', 'month'], required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System metrics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('SYSTEM_METRICS_READ'),
    __param(0, (0, common_1.Query)('timeRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getSystemMetrics", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active system alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active alerts retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ALERT_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getActiveAlerts", null);
__decorate([
    (0, common_1.Post)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new system alert' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alert created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ALERT_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_ALERT'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:alertId/acknowledge'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge an alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert acknowledged successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ALERT_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('ACKNOWLEDGE_ALERT'),
    __param(0, (0, common_1.Param)('alertId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "acknowledgeAlert", null);
__decorate([
    (0, common_1.Put)('alerts/:alertId/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an alert' }),
    (0, swagger_1.ApiParam)({ name: 'alertId', description: 'Alert ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alert resolved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ALERT_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('RESOLVE_ALERT'),
    __param(0, (0, common_1.Param)('alertId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "resolveAlert", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs with filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'component', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('AUDIT_LOG_READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create audit log entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Audit log created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('AUDIT_LOG_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_AUDIT_LOG'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monitoring dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DASHBOARD_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitoringController.prototype, "getDashboardData", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, swagger_1.ApiTags)('System Monitoring'),
    (0, common_1.Controller)('monitoring'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringController);
//# sourceMappingURL=monitoring.controller.js.map