export declare enum TaskType {
    BACKUP = "BACKUP",
    CLEANUP = "CLEANUP",
    REPORT_GENERATION = "REPORT_GENERATION",
    DATA_SYNC = "DATA_SYNC",
    HEALTH_CHECK = "HEALTH_CHECK",
    NOTIFICATION = "NOTIFICATION",
    CACHE_REFRESH = "CACHE_REFRESH",
    LOG_ROTATION = "LOG_ROTATION",
    INDEX_REBUILD = "INDEX_REBUILD",
    STATISTICS_UPDATE = "STATISTICS_UPDATE",
    COMPLIANCE_CHECK = "COMPLIANCE_CHECK",
    MAINTENANCE = "MAINTENANCE",
    CUSTOM_SCRIPT = "CUSTOM_SCRIPT"
}
export declare class CreateScheduledTaskDto {
    name: string;
    taskType: TaskType;
    description?: string;
    schedule: string;
    timezone?: string;
    isActive?: boolean;
    concurrency?: number;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    maxRunTime?: number;
    configuration?: any;
    environment?: string;
    centerId?: string;
    createdBy: string;
}
