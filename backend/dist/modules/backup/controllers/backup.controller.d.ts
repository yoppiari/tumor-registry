import { BackupService } from '../services/backup.service';
import { CreateBackupJobDto } from '../dto/create-backup-job.dto';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    getBackupJobs(backupType?: string, dataSource?: string, isActive?: string, centerId?: string): Promise<any[]>;
    createBackupJob(createBackupJobDto: CreateBackupJobDto, req: any): Promise<any>;
    getBackupJob(id: string): Promise<any>;
    toggleBackupJob(id: string): Promise<any>;
    deleteBackupJob(id: string): Promise<void>;
    executeBackup(id: string): Promise<any>;
    getBackupExecutions(backupJobId?: string, status?: string, startDate?: string, endDate?: string, limit?: string): Promise<any[]>;
    getBackupExecution(id: string): Promise<any>;
    deleteBackupExecution(id: string): Promise<void>;
    restoreFromBackup(id: string, restoreOptions: {
        targetDatabase?: string;
        overwriteExisting?: boolean;
        skipErrors?: boolean;
        verifyIntegrity?: boolean;
        dryRun?: boolean;
    }): Promise<import("../interfaces/backup.interface").RecoveryResult>;
    getBackupStatistics(centerId?: string): Promise<import("../interfaces/backup.interface").BackupStatistics>;
    getBackupHealth(centerId?: string): Promise<import("../interfaces/backup.interface").BackupHealthStatus>;
    performCleanup(cleanupOptions: {
        retentionDays?: number;
        dryRun?: boolean;
        backupJobId?: string;
        centerId?: string;
    }): Promise<any>;
    getStorageUsage(centerId?: string): Promise<any>;
    getRetentionPolicy(centerId?: string): Promise<any>;
    updateRetentionPolicy(retentionPolicy: {
        dailyBackups: number;
        weeklyBackups: number;
        monthlyBackups: number;
        yearlyBackups: number;
        centerId?: string;
    }): Promise<any>;
    getRestoreHistory(backupJobId?: string, executionId?: string, startDate?: string, endDate?: string, limit?: string): Promise<any>;
    verifyBackup(executionId: string): Promise<boolean>;
    getStorageConfigurations(): Promise<any>;
    addStorageConfiguration(storageConfig: any): Promise<any>;
    getBackupTemplates(): Promise<any>;
    createBackupTemplate(templateData: {
        name: string;
        description?: string;
        backupType: string;
        dataSource: string;
        backupOptions?: any;
    }, req: any): Promise<any>;
    testStorageConnection(id: string): Promise<any>;
    getBackupAlerts(severity?: string, limit?: string): Promise<any>;
    rescheduleBackupJob(id: string, rescheduleData: {
        schedule: string;
        timezone?: string;
    }): Promise<any>;
}
