import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    getSystemHealth(): Promise<any>;
    getPerformanceMetrics(): Promise<any>;
    getSystemMetrics(timeRange?: 'hour' | 'day' | 'week' | 'month'): Promise<any>;
    getActiveAlerts(): Promise<any[]>;
    createAlert(alertData: {
        type: 'system' | 'performance' | 'security' | 'business';
        severity: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        message: string;
        details?: any;
        component?: string;
        thresholds?: any;
        actions?: string[];
    }): Promise<any>;
    acknowledgeAlert(alertId: string, acknowledgement: {
        userId: string;
        notes?: string;
    }): Promise<any>;
    resolveAlert(alertId: string, resolution: {
        userId: string;
        resolution: string;
    }): Promise<any>;
    getAuditLogs(filters: {
        dateFrom?: string;
        dateTo?: string;
        userId?: string;
        action?: string;
        component?: string;
        severity?: string;
        page?: number;
        limit?: number;
    }): Promise<any>;
    createAuditLog(logData: {
        userId: string;
        action: string;
        component: string;
        severity?: 'info' | 'warning' | 'error' | 'critical';
        details?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<any>;
    getDashboardData(): Promise<{
        timestamp: Date;
        health: any;
        performance: any;
        alerts: any[];
        metrics: any;
        summary: {
            totalAlerts: number;
            criticalAlerts: number;
            systemScore: any;
            uptime: any;
        };
    }>;
}
