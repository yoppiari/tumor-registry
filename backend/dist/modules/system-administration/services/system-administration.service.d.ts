import { ConfigurationService } from './configuration.service';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '@/common/database/prisma.service';
import { AdminDashboardData } from '../interfaces/system-administration.interface';
export declare class SystemAdministrationService {
    private readonly prisma;
    private readonly configurationService;
    private readonly dashboardService;
    private readonly logger;
    constructor(prisma: PrismaService, configurationService: ConfigurationService, dashboardService: DashboardService);
    getDashboardData(centerId?: string): Promise<AdminDashboardData>;
    getSystemOverview(): Promise<any>;
    getSystemHealth(): Promise<any>;
    getActivityLogs(filters?: {
        userId?: string;
        activityType?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<any[]>;
    getSecurityEvents(filters?: {
        severity?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<any[]>;
    getSystemMetrics(filters?: {
        metricType?: string;
        source?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<any[]>;
    acknowledgeAlert(alertId: string, userId: string): Promise<any>;
    resolveAlert(alertId: string, userId: string, resolution?: string): Promise<any>;
    private getBackupOverview;
    private getPerformanceOverview;
    private getLatestMetricValue;
    private calculateOverallHealth;
}
