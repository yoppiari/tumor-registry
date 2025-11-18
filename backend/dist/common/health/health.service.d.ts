export interface HealthCheck {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
}
export interface DetailedHealthCheck extends HealthCheck {
    components: {
        database: ComponentStatus;
        redis: ComponentStatus;
        memory: ComponentStatus;
        disk: ComponentStatus;
    };
}
export interface ComponentStatus {
    status: 'healthy' | 'unhealthy';
    responseTime?: number;
    error?: string;
    details?: any;
}
export declare class HealthService {
    private readonly startTime;
    private readonly version;
    private readonly environment;
    checkHealth(): HealthCheck;
    checkDetailedHealth(): Promise<DetailedHealthCheck>;
    checkReadiness(): HealthCheck;
    checkLiveness(): HealthCheck;
    private checkDatabase;
    private checkRedis;
    private checkMemory;
    private checkDisk;
}
