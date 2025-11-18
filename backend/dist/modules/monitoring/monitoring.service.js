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
var MonitoringService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MonitoringService = MonitoringService_1 = class MonitoringService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MonitoringService_1.name);
    }
    async getSystemHealth() {
        try {
            const [databaseStatus, apiStatus, integrationStatus, performanceMetrics] = await Promise.all([
                this.getDatabaseHealth(),
                this.getAPIHealth(),
                this.getIntegrationHealth(),
                this.getPerformanceMetrics(),
            ]);
            const overallHealth = this.calculateOverallHealth([
                databaseStatus,
                apiStatus,
                integrationStatus,
                performanceMetrics,
            ]);
            return {
                timestamp: new Date(),
                status: overallHealth.status,
                score: overallHealth.score,
                components: {
                    database: databaseStatus,
                    api: apiStatus,
                    integrations: integrationStatus,
                    performance: performanceMetrics,
                },
                alerts: this.getActiveAlerts(),
                recommendations: this.generateHealthRecommendations([
                    databaseStatus,
                    apiStatus,
                    integrationStatus,
                    performanceMetrics,
                ]),
            };
        }
        catch (error) {
            this.logger.error('Error getting system health', error);
            throw error;
        }
    }
    async getPerformanceMetrics() {
        try {
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const [cpuUsage, memoryUsage, diskUsage, networkIO, activeConnections, responseTimeStats, errorRate, throughput,] = await Promise.all([
                this.getCPUUsage(),
                this.getMemoryUsage(),
                this.getDiskUsage(),
                this.getNetworkIO(),
            ]);
            return {
                timestamp: new Date(),
                system: {
                    cpu: {
                        current: cpuUsage.current,
                        average: cpuUsage.average,
                        cores: cpuUsage.cores,
                        load: cpuUsage.load,
                    },
                    memory: {
                        total: memoryUsage.total,
                        used: memoryUsage.used,
                        free: memoryUsage.free,
                        percentage: memoryUsage.percentage,
                        heap: memoryUsage.heap,
                    },
                    disk: {
                        total: diskUsage.total,
                        used: diskUsage.used,
                        free: diskUsage.free,
                        percentage: diskUsage.percentage,
                    },
                    network: {
                        bytesReceived: networkIO.bytesReceived,
                        bytesSent: networkIO.bytesSent,
                        packetsReceived: networkIO.packetsReceived,
                        packetsSent: networkIO.packetsSent,
                    },
                },
                application: {
                    activeConnections,
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    cpuUsage: process.cpuUsage(),
                },
                performance: {
                    responseTime: {
                        average: await this.getAverageResponseTime(oneHourAgo),
                        p95: await this.getP95ResponseTime(oneHourAgo),
                        p99: await this.getP99ResponseTime(oneHourAgo),
                    },
                    errorRate: await this.getErrorRate(oneHourAgo),
                    throughput: {
                        requestsPerSecond: await this.getRequestsPerSecond(oneHourAgo),
                        averageResponseTime: await this.getAverageResponseTime(oneHourAgo),
                    },
                },
                database: {
                    connectionPool: await this.getDatabaseConnectionStats(),
                    queryPerformance: await this.getDatabaseQueryStats(),
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting performance metrics', error);
            throw error;
        }
    }
    async createAlert(alertData) {
        try {
            const alert = await this.prisma.alert.create({
                data: {
                    type: alertData.type,
                    severity: alertData.severity,
                    title: alertData.title,
                    message: alertData.message,
                    details: alertData.details,
                    component: alertData.component,
                    status: 'ACTIVE',
                    thresholds: alertData.thresholds,
                    actions: alertData.actions,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            if (alertData.severity === 'critical') {
                await this.sendAlertNotification(alert);
            }
            this.logger.warn(`Alert created: ${alertData.title}`, alert);
            return {
                alertId: alert.id,
                status: 'created',
                createdAt: alert.createdAt,
            };
        }
        catch (error) {
            this.logger.error('Error creating alert', error);
            throw error;
        }
    }
    async getActiveAlerts() {
        try {
            const alerts = await this.prisma.alert.findMany({
                where: {
                    status: 'ACTIVE',
                },
                include: {
                    acknowledgedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: [
                    { severity: 'desc' },
                    { createdAt: 'desc' },
                ],
                take: 50,
            });
            return alerts.map(alert => ({
                id: alert.id,
                type: alert.type,
                severity: alert.severity,
                title: alert.title,
                message: alert.message,
                component: alert.component,
                createdAt: alert.createdAt,
                acknowledged: alert.acknowledgedAt ? {
                    at: alert.acknowledgedAt,
                    by: alert.acknowledgedBy,
                } : null,
                autoResolveAt: alert.autoResolveAt,
                details: alert.details,
                actions: alert.actions,
            }));
        }
        catch (error) {
            this.logger.error('Error getting active alerts', error);
            throw error;
        }
    }
    async acknowledgeAlert(alertId, userId, notes) {
        try {
            const alert = await this.prisma.alert.update({
                where: { id: alertId },
                data: {
                    status: 'ACKNOWLEDGED',
                    acknowledgedAt: new Date(),
                    acknowledgedBy: userId,
                    acknowledgementNotes: notes,
                    updatedAt: new Date(),
                },
            });
            return {
                alertId: alert.id,
                status: alert.status,
                acknowledgedAt: alert.acknowledgedAt,
                acknowledgedBy: userId,
            };
        }
        catch (error) {
            this.logger.error(`Error acknowledging alert: ${alertId}`, error);
            throw error;
        }
    }
    async resolveAlert(alertId, userId, resolution) {
        try {
            const alert = await this.prisma.alert.update({
                where: { id: alertId },
                data: {
                    status: 'RESOLVED',
                    resolvedAt: new Date(),
                    resolvedBy: userId,
                    resolution: resolution,
                    updatedAt: new Date(),
                },
            });
            this.logger.info(`Alert resolved: ${alert.title}`);
            return {
                alertId: alert.id,
                status: alert.status,
                resolvedAt: alert.resolvedAt,
                resolvedBy: userId,
            };
        }
        catch (error) {
            this.logger.error(`Error resolving alert: ${alertId}`, error);
            throw error;
        }
    }
    async getAuditLogs(filters = {}) {
        try {
            const page = filters.page || 1;
            const limit = filters.limit || 50;
            const skip = (page - 1) * limit;
            const where = {};
            if (filters.dateFrom || filters.dateTo) {
                where.timestamp = {};
                if (filters.dateFrom) {
                    where.timestamp.gte = new Date(filters.dateFrom);
                }
                if (filters.dateTo) {
                    where.timestamp.lte = new Date(filters.dateTo);
                }
            }
            if (filters.userId) {
                where.userId = filters.userId;
            }
            if (filters.action) {
                where.action = filters.action;
            }
            if (filters.component) {
                where.component = filters.component;
            }
            if (filters.severity) {
                where.severity = filters.severity;
            }
            const [logs, total] = await Promise.all([
                this.prisma.auditLog.findMany({
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
                    skip,
                    take: limit,
                }),
                this.prisma.auditLog.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting audit logs', error);
            throw error;
        }
    }
    async createAuditLog(logData) {
        try {
            const log = await this.prisma.auditLog.create({
                data: {
                    userId: logData.userId,
                    action: logData.action,
                    component: logData.component,
                    severity: logData.severity || 'info',
                    details: logData.details,
                    ipAddress: logData.ipAddress,
                    userAgent: logData.userAgent,
                    timestamp: new Date(),
                },
            });
            return {
                logId: log.id,
                timestamp: log.timestamp,
            };
        }
        catch (error) {
            this.logger.error('Error creating audit log', error);
            throw error;
        }
    }
    async getSystemMetrics(timeRange = 'hour') {
        try {
            const endDate = new Date();
            const startDate = this.calculateStartDate(endDate, timeRange);
            const [requestMetrics, userMetrics, errorMetrics, performanceMetrics, securityMetrics,] = await Promise.all([
                this.getRequestMetrics(startDate, endDate),
                this.getUserMetrics(startDate, endDate),
                this.getErrorMetrics(startDate, endDate),
                this.getPerformanceMetricsByTimeRange(startDate, endDate),
                this.getSecurityMetrics(startDate, endDate),
            ]);
            return {
                timeRange,
                period: {
                    start: startDate,
                    end: endDate,
                },
                metrics: {
                    requests: requestMetrics,
                    users: userMetrics,
                    errors: errorMetrics,
                    performance: performanceMetrics,
                    security: securityMetrics,
                },
                trends: await this.calculateTrends(startDate, endDate),
            };
        }
        catch (error) {
            this.logger.error('Error getting system metrics', error);
            throw error;
        }
    }
    async getDatabaseHealth() {
        try {
            const startTime = Date.now();
            await this.prisma.$queryRaw `SELECT 1`;
            const responseTime = Date.now() - startTime;
            const poolStats = await this.getDatabaseConnectionStats();
            return {
                status: 'healthy',
                responseTime,
                connectionPool: poolStats,
                lastChecked: new Date(),
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                lastChecked: new Date(),
            };
        }
    }
    async getAPIHealth() {
        const endpoints = [
            '/health',
            '/api/v1/patients',
            '/api/v1/users',
        ];
        const results = await Promise.all(endpoints.map(async (endpoint) => {
            try {
                const startTime = Date.now();
                await new Promise(resolve => setTimeout(resolve, 100));
                const responseTime = Date.now() - startTime;
                return { endpoint, status: 'healthy', responseTime };
            }
            catch (error) {
                return { endpoint, status: 'unhealthy', error: error.message };
            }
        }));
        const allHealthy = results.every(r => r.status === 'healthy');
        const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
        return {
            status: allHealthy ? 'healthy' : 'degraded',
            endpoints: results,
            averageResponseTime,
            lastChecked: new Date(),
        };
    }
    async getIntegrationHealth() {
        const integrations = await this.prisma.externalSystem.findMany({
            where: { isActive: true },
        });
        const results = integrations.map(integration => ({
            id: integration.id,
            name: integration.name,
            type: integration.type,
            status: Math.random() > 0.1 ? 'healthy' : 'unhealthy',
            lastSync: integration.lastSyncDate || new Date(),
            uptime: Math.random() * 100,
            errorRate: Math.random() * 5,
        }));
        const allHealthy = results.every(r => r.status === 'healthy');
        return {
            status: allHealthy ? 'healthy' : 'degraded',
            integrations: results,
            lastChecked: new Date(),
        };
    }
    getPerformanceMetrics() {
        return {
            status: 'healthy',
            score: 85,
            metrics: {
                responseTime: { current: 150, target: 200 },
                throughput: { current: 450, target: 400 },
                errorRate: { current: 0.02, target: 0.05 },
                cpuUsage: { current: 0.45, target: 0.80 },
                memoryUsage: { current: 0.65, target: 0.80 },
            },
            lastChecked: new Date(),
        };
    }
    calculateOverallHealth(components) {
        const healthyCount = components.filter(c => c.status === 'healthy').length;
        const totalScore = components.reduce((sum, c) => sum + c.score, 0) / components.length;
        const status = healthyCount === components.length ? 'healthy' : totalScore > 70 ? 'degraded' : 'unhealthy';
        return {
            status,
            score: Math.round(totalScore),
        };
    }
    getActiveAlerts() {
        return [];
    }
    generateHealthRecommendations(components) {
        const recommendations = [];
        components.forEach(component => {
            if (component.status !== 'healthy') {
                recommendations.push(`${component.name} requires attention`);
            }
            if (component.metrics) {
                Object.entries(component.metrics).forEach(([metric, value]) => {
                    if (value.current && value.target && value.current > value.target) {
                        recommendations.push(`High ${metric}: ${value.current} exceeds target ${value.target}`);
                    }
                });
            }
        });
        return recommendations;
    }
    async getCPUUsage() {
        return {
            current: Math.random() * 0.8,
            average: 0.35,
            cores: 4,
            load: [0.5, 0.6, 0.4, 0.3],
        };
    }
    async getMemoryUsage() {
        const total = 16 * 1024 * 1024 * 1024;
        const used = total * (0.3 + Math.random() * 0.4);
        const heap = process.memoryUsage().heapUsed;
        return {
            total,
            used,
            free: total - used,
            percentage: used / total,
            heap,
        };
    }
    async getDiskUsage() {
        const total = 500 * 1024 * 1024 * 1024;
        const used = total * (0.4 + Math.random() * 0.3);
        return {
            total,
            used,
            free: total - used,
            percentage: used / total,
        };
    }
    async getNetworkIO() {
        return {
            bytesReceived: Math.floor(Math.random() * 1000000000),
            bytesSent: Math.floor(Math.random() * 1000000000),
            packetsReceived: Math.floor(Math.random() * 500000),
            packetsSent: Math.floor(Math.random() * 500000),
        };
    }
    async getAverageResponseTime(since) {
        return 150 + Math.random() * 100;
    }
    async getP95ResponseTime(since) {
        return 300 + Math.random() * 200;
    }
    async getP99ResponseTime(since) {
        return 500 + Math.random() * 300;
    }
    async getErrorRate(since) {
        return 0.01 + Math.random() * 0.04;
    }
    async getRequestsPerSecond(since) {
        return 50 + Math.random() * 100;
    }
    async getDatabaseConnectionStats() {
        return {
            total: 20,
            active: 5,
            idle: 15,
            waiting: 0,
        };
    }
    async getDatabaseQueryStats() {
        return {
            averageQueryTime: 25,
            slowQueries: 2,
            totalQueries: 1000,
        };
    }
    async sendAlertNotification(alert) {
        this.logger.error(`CRITICAL ALERT: ${alert.title} - ${alert.message}`, alert.details);
    }
    calculateStartDate(endDate, timeRange) {
        const startDate = new Date(endDate);
        switch (timeRange) {
            case 'hour':
                startDate.setHours(startDate.getHours() - 1);
                break;
            case 'day':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
        }
        return startDate;
    }
    async getRequestMetrics(startDate, endDate) {
        return {
            totalRequests: 50000,
            successfulRequests: 49750,
            failedRequests: 250,
            averageResponseTime: 145,
            requestsPerSecond: 25,
        };
    }
    async getUserMetrics(startDate, endDate) {
        return {
            activeUsers: 1250,
            newUsers: 85,
            returningUsers: 1165,
            sessionDuration: 1800,
        };
    }
    async getErrorMetrics(startDate, endDate) {
        return {
            totalErrors: 125,
            errorsByType: {
                validation: 45,
                database: 30,
                authentication: 20,
                authorization: 15,
                server: 15,
            },
            errorsByComponent: {
                patients: 25,
                diagnoses: 20,
                treatments: 18,
                medical_records: 15,
                auth: 12,
                integration: 10,
            },
        };
    }
    async getPerformanceMetricsByTimeRange(startDate, endDate) {
        return {
            averageResponseTime: 145,
            p95ResponseTime: 300,
            p99ResponseTime: 500,
            throughput: 25,
        };
    }
    async getSecurityMetrics(startDate, endDate) {
        return {
            loginAttempts: 2500,
            successfulLogins: 2475,
            failedLogins: 25,
            suspiciousActivities: 5,
            blockedIPs: 3,
        };
    }
    async calculateTrends(startDate, endDate) {
        return {
            requests: {
                trend: 'increasing',
                percentage: 12.5,
            },
            users: {
                trend: 'stable',
                percentage: 2.3,
            },
            errors: {
                trend: 'decreasing',
                percentage: -15.8,
            },
        };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = MonitoringService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map