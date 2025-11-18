import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    health(): Promise<import("./health.service").HealthCheck>;
    detailedHealth(): Promise<import("./health.service").DetailedHealthCheck>;
    readiness(): Promise<import("./health.service").HealthCheck>;
    liveness(): Promise<import("./health.service").HealthCheck>;
}
