import { SystemAdministrationService } from '../services/system-administration.service';
import { ConfigurationService } from '../services/configuration.service';
import { CreateConfigDto } from '../dto/create-config.dto';
import { DashboardService } from '../services/dashboard.service';
export declare class SystemAdministrationController {
    private readonly systemAdministrationService;
    private readonly configurationService;
    private readonly dashboardService;
    constructor(systemAdministrationService: SystemAdministrationService, configurationService: ConfigurationService, dashboardService: DashboardService);
    getDashboard(centerId?: string): Promise<import("../interfaces/system-administration.interface").AdminDashboardData>;
    getOverview(): Promise<any>;
    getHealth(): Promise<any>;
    getConfigurations(category?: string, environment?: string, centerId?: string, isActive?: string): Promise<any[]>;
    createConfiguration(createConfigDto: CreateConfigDto): Promise<any>;
    getConfiguration(id: string): Promise<any>;
    updateConfiguration(id: string, updateData: any, req: any): Promise<any>;
    deleteConfiguration(id: string): Promise<void>;
    exportConfigurations(category?: string, environment?: string, centerId?: string): Promise<any>;
    importConfigurations(importData: {
        configurations: any[];
        options?: any;
    }): Promise<any>;
    getActivities(userId?: string, activityType?: string, startDate?: string, endDate?: string, limit?: string): Promise<any[]>;
    getSecurityEvents(severity?: string, status?: string, startDate?: string, endDate?: string, limit?: string): Promise<any[]>;
    getMetrics(metricType?: string, source?: string, startDate?: string, endDate?: string, limit?: string): Promise<any[]>;
    acknowledgeAlert(alertId: string, req: any): Promise<any>;
    resolveAlert(alertId: string, resolveData: {
        resolution?: string;
    }, req: any): Promise<any>;
    toggleMaintenanceMode(maintenanceData: {
        enabled: boolean;
        message?: string;
    }): Promise<{
        success: boolean;
        maintenanceMode: boolean;
        message: string;
        timestamp: Date;
    }>;
    restartSystem(restartData: {
        services: string[];
        force?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        services: string[];
        estimatedDowntime: string;
        timestamp: Date;
    }>;
    getSystemInfo(): Promise<{
        version: string;
        environment: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        platform: NodeJS.Platform;
        nodeVersion: string;
        timestamp: Date;
    }>;
    performCleanup(cleanupData: {
        operations: string[];
    }): Promise<{
        success: boolean;
        message: string;
        operations: string[];
        results: {
            logsCleared: boolean;
            cacheCleared: boolean;
            tempFilesRemoved: boolean;
        };
        timestamp: Date;
    }>;
}
