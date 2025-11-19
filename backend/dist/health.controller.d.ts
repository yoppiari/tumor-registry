export declare class HealthController {
    getRoot(): {
        message: string;
        status: string;
        version: string;
        timestamp: string;
    };
    getHealth(): {
        status: string;
        service: string;
        version: string;
        timestamp: string;
        uptime: number;
    };
}
