import { PrismaService } from '../../database/prisma.service';
import { AdminDashboardData } from '../interfaces/system-administration.interface';
export declare class DashboardService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getDashboardData(centerId?: string): Promise<AdminDashboardData>;
    private getSystemMetrics;
    private getRecentActivities;
    private getActiveAlerts;
    private getScheduledTasks;
    private getBackupStatus;
    private getPerformanceMetrics;
    private getComplianceStatus;
    private getLatestMetricValue;
    private calculateSystemUptime;
    private getNextScheduledBackup;
    private calculateComplianceScore;
}
