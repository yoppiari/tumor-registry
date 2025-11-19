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
var SystemAdministrationService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdministrationService = void 0;
const common_1 = require("@nestjs/common");
const configuration_service_1 = require("./configuration.service");
const dashboard_service_1 = require("./dashboard.service");
const prisma_service_1 = require("../../database/prisma.service");
let SystemAdministrationService = SystemAdministrationService_1 = class SystemAdministrationService {
    constructor(prisma, configurationService, dashboardService) {
        this.prisma = prisma;
        this.configurationService = configurationService;
        this.dashboardService = dashboardService;
        this.logger = new common_1.Logger(SystemAdministrationService_1.name);
    }
    async getDashboardData(centerId) {
        return this.dashboardService.getDashboardData(centerId);
    }
    async getSystemOverview() {
        const [totalUsers, activeUsers, totalPatients, totalCenters, activeReports, systemAlerts, backupStatus, performanceMetrics,] = await Promise.all([
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({
                where: {
                    isActive: true,
                    lastLoginAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
            }),
            this.prisma.patient.count({ where: { isActive: true } }),
            this.prisma.center.count({ where: { isActive: true } }),
            this.prisma.generatedReport.count({
                where: { status: { in: ['PENDING', 'GENERATING'] } },
            }),
            this.prisma.systemAlert.count({
                where: { isActive: true },
            }),
            this.getBackupOverview(),
            this.getPerformanceOverview(),
        ]);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            patients: {
                total: totalPatients,
            },
            centers: {
                total: totalCenters,
            },
            reports: {
                active: activeReports,
            },
            alerts: {
                total: systemAlerts,
                critical: await this.prisma.systemAlert.count({
                    where: { isActive: true, severity: 'CRITICAL' },
                }),
            },
            backup: backupStatus,
            performance: performanceMetrics,
        };
    }
    async getSystemHealth() {
        const healthChecks = await this.prisma.healthCheck.findMany({
            where: { isActive: true },
            include: {
                results: {
                    where: {
                        timestamp: {
                            gte: new Date(Date.now() - 60 * 60 * 1000),
                        },
                    },
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        });
        const overallStatus = this.calculateOverallHealth(healthChecks);
        return {
            overall: overallStatus,
            checks: healthChecks.map(check => ({
                id: check.id,
                serviceName: check.serviceName,
                checkType: check.checkType,
                status: check.results[0]?.status || 'UNKNOWN',
                lastCheck: check.results[0]?.timestamp,
                responseTime: check.results[0]?.responseTime,
                uptime: check.uptime,
                consecutiveFails: check.consecutiveFails,
            })),
            summary: {
                totalChecks: healthChecks.length,
                healthyChecks: healthChecks.filter(c => c.status === 'HEALTHY').length,
                degradedChecks: healthChecks.filter(c => c.status === 'DEGRADED').length,
                unhealthyChecks: healthChecks.filter(c => c.status === 'UNHEALTHY').length,
            },
        };
    }
    async getActivityLogs(filters) {
        const where = {};
        if (filters?.userId)
            where.userId = filters.userId;
        if (filters?.activityType)
            where.activityType = filters.activityType;
        if (filters?.startDate || filters?.endDate) {
            where.timestamp = {};
            if (filters?.startDate)
                where.timestamp.gte = filters.startDate;
            if (filters?.endDate)
                where.timestamp.lte = filters.endDate;
        }
        const activities = await this.prisma.userActivityLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { timestamp: 'desc' },
            take: filters?.limit || 50,
        });
        return activities.map(activity => ({
            id: activity.id,
            type: activity.activityType,
            activity: activity.activity,
            resource: activity.resource,
            resourceId: activity.resourceId,
            details: activity.details,
            user: activity.user,
            ipAddress: activity.ipAddress,
            userAgent: activity.userAgent,
            location: activity.location,
            duration: activity.duration,
            success: activity.success,
            riskScore: activity.riskScore,
            tags: activity.tags,
            timestamp: activity.timestamp,
        }));
    }
    async getSecurityEvents(filters) {
        const where = {};
        if (filters?.severity)
            where.severity = filters.severity;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters?.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters?.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const events = await this.prisma.securityEvent.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: filters?.limit || 50,
        });
        return events.map(event => ({
            id: event.id,
            eventType: event.eventType,
            severity: event.severity,
            threatLevel: event.threatLevel,
            title: event.title,
            description: event.description,
            source: event.source,
            user: event.user,
            ipAddress: event.ipAddress,
            status: event.status,
            assignedTo: event.assignedTo,
            resolvedBy: event.resolvedBy,
            resolvedAt: event.resolvedAt,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        }));
    }
    async getSystemMetrics(filters) {
        const where = {};
        if (filters?.metricType)
            where.metricType = filters.metricType;
        if (filters?.source)
            where.source = filters.source;
        if (filters?.startDate || filters?.endDate) {
            where.timestamp = {};
            if (filters?.startDate)
                where.timestamp.gte = filters.startDate;
            if (filters?.endDate)
                where.timestamp.lte = filters.endDate;
        }
        const metrics = await this.prisma.performanceMetric.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: filters?.limit || 100,
        });
        return metrics.map(metric => ({
            id: metric.id,
            type: metric.metricType,
            name: metric.metricName,
            value: metric.value,
            unit: metric.unit,
            timestamp: metric.timestamp,
            tags: metric.tags,
            dimensions: metric.dimensions,
            source: metric.source,
            hostname: metric.hostname,
            service: metric.service,
            environment: metric.environment,
        }));
    }
    async acknowledgeAlert(alertId, userId) {
        const alert = await this.prisma.systemAlert.findUnique({
            where: { id: alertId },
        });
        if (!alert) {
            throw new Error('Alert not found');
        }
        const updatedAlert = await this.prisma.systemAlert.update({
            where: { id: alertId },
            data: {
                isAcknowledged: true,
                acknowledgedBy: userId,
                acknowledgedAt: new Date(),
            },
        });
        this.logger.log(`Alert ${alertId} acknowledged by user ${userId}`);
        return updatedAlert;
    }
    async resolveAlert(alertId, userId, resolution) {
        const alert = await this.prisma.systemAlert.findUnique({
            where: { id: alertId },
        });
        if (!alert) {
            throw new Error('Alert not found');
        }
        const updatedAlert = await this.prisma.systemAlert.update({
            where: { id: alertId },
            data: {
                isActive: false,
                resolvedBy: userId,
                resolvedAt: new Date(),
                resolution,
            },
        });
        this.logger.log(`Alert ${alertId} resolved by user ${userId}`);
        return updatedAlert;
    }
    async getBackupOverview() {
        const [totalJobs, recentExecutions] = await Promise.all([
            this.prisma.backupJob.count({ where: { isActive: true } }),
            this.prisma.backupExecution.findMany({
                where: {
                    executionTime: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
                orderBy: { executionTime: 'desc' },
                take: 10,
            }),
        ]);
        const successfulBackups = recentExecutions.filter(exec => exec.status === 'COMPLETED').length;
        const failedBackups = recentExecutions.filter(exec => exec.status === 'FAILED').length;
        return {
            totalJobs,
            recentExecutions: recentExecutions.length,
            successfulBackups,
            failedBackups,
            successRate: recentExecutions.length > 0 ? (successfulBackups / recentExecutions.length) * 100 : 0,
            lastBackup: recentExecutions[0]?.executionTime || null,
        };
    }
    async getPerformanceOverview() {
        const latestMetrics = await this.prisma.performanceMetric.findMany({
            where: {
                timestamp: {
                    gte: new Date(Date.now() - 5 * 60 * 1000),
                },
            },
            orderBy: { timestamp: 'desc' },
            take: 100,
        });
        return {
            cpuUsage: this.getLatestMetricValue(latestMetrics, 'CPU_USAGE'),
            memoryUsage: this.getLatestMetricValue(latestMetrics, 'MEMORY_USAGE'),
            diskUsage: this.getLatestMetricValue(latestMetrics, 'DISK_USAGE'),
            networkIO: this.getLatestMetricValue(latestMetrics, 'NETWORK_IO'),
            databaseConnections: this.getLatestMetricValue(latestMetrics, 'DATABASE_CONNECTIONS'),
            responseTime: this.getLatestMetricValue(latestMetrics, 'RESPONSE_TIME'),
            errorRate: this.getLatestMetricValue(latestMetrics, 'ERROR_RATE'),
        };
    }
    getLatestMetricValue(metrics, metricType) {
        const metric = metrics.find(m => m.metricType === metricType);
        return metric ? metric.value : 0;
    }
    calculateOverallHealth(healthChecks) {
        if (healthChecks.length === 0)
            return 'UNKNOWN';
        const healthyCount = healthChecks.filter(check => check.results[0]?.status === 'HEALTHY').length;
        const unhealthyCount = healthChecks.filter(check => check.results[0]?.status === 'UNHEALTHY').length;
        if (unhealthyCount > 0)
            return 'UNHEALTHY';
        if (healthyCount === healthChecks.length)
            return 'HEALTHY';
        return 'DEGRADED';
    }
};
exports.SystemAdministrationService = SystemAdministrationService;
exports.SystemAdministrationService = SystemAdministrationService = SystemAdministrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, configuration_service_1.ConfigurationService,
        dashboard_service_1.DashboardService])
], SystemAdministrationService);
//# sourceMappingURL=system-administration.service.js.map