export interface SystemConfigurationData {
    category: string;
    key: string;
    value: any;
    description?: string;
    isEncrypted?: boolean;
    isRequired?: boolean;
    defaultValue?: any;
    validationRules?: any;
    environment?: string;
    centerId?: string;
    isActive?: boolean;
}
export interface ReportTemplateData {
    name: string;
    title: string;
    description?: string;
    reportType: string;
    templateType?: string;
    dataSource: string;
    parameters?: any;
    layout: any;
    styling?: any;
    filters?: any;
    aggregations?: any;
    charts?: any;
    accessLevel?: string;
    isActive?: boolean;
    isPublic?: boolean;
    centerId?: string;
}
export interface GeneratedReportData {
    templateId: string;
    name: string;
    parameters?: any;
    format?: string;
    expiresAt?: Date;
    generatedBy: string;
}
export interface BackupJobData {
    name: string;
    backupType: string;
    dataSource: string;
    schedule?: string;
    retentionDays?: number;
    compression?: boolean;
    encryption?: boolean;
    storageLocation: string;
    storagePath?: string;
    isActive?: boolean;
    backupOptions?: any;
    verificationMode?: string;
    createdBy: string;
}
export interface ScheduledTaskData {
    name: string;
    taskType: string;
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
export interface HealthCheckData {
    serviceName: string;
    checkType: string;
    endpoint?: string;
    expectedStatus?: number;
    timeout?: number;
    interval?: number;
    isActive?: boolean;
    threshold?: number;
    configuration?: any;
    createdBy?: string;
}
export interface SystemMetrics {
    totalUsers: number;
    activeUsers: number;
    totalPatients: number;
    totalCenters: number;
    systemUptime: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    databaseConnections: number;
    activeReports: number;
    scheduledReports: number;
    backupJobs: number;
    healthChecks: number;
    alertsCount: number;
    integrationsCount: number;
}
export interface DashboardConfig {
    layout: any;
    widgets: any;
    filters?: any;
    refreshInterval?: number;
    accessLevel?: string;
}
export interface AdminDashboardData {
    systemMetrics: SystemMetrics;
    recentActivities: any[];
    activeAlerts: any[];
    scheduledTasks: any[];
    backupStatus: any;
    performanceMetrics: any[];
    complianceStatus: any;
}
export interface BulkOperation {
    operation: 'EXPORT' | 'IMPORT' | 'DELETE' | 'UPDATE';
    entityType: string;
    filters?: any;
    data?: any;
    options?: any;
    requestedBy: string;
}
export interface SystemMaintenanceWindow {
    startTime: Date;
    endTime: Date;
    description: string;
    affectedServices: string[];
    notificationSent: boolean;
    isActive: boolean;
    createdBy: string;
}
