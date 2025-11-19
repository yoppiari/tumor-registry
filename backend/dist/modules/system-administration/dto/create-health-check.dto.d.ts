export declare enum HealthCheckType {
    HTTP_ENDPOINT = "HTTP_ENDPOINT",
    DATABASE_CONNECTION = "DATABASE_CONNECTION",
    FILE_SYSTEM = "FILE_SYSTEM",
    SERVICE_PORT = "SERVICE_PORT",
    API_HEALTH = "API_HEALTH",
    SSL_CERTIFICATE = "SSL_CERTIFICATE",
    DOMAIN_DNS = "DOMAIN_DNS",
    NETWORK_CONNECTIVITY = "NETWORK_CONNECTIVITY",
    CUSTOM_CHECK = "CUSTOM_CHECK"
}
export declare class CreateHealthCheckDto {
    serviceName: string;
    checkType: HealthCheckType;
    endpoint?: string;
    expectedStatus?: number;
    timeout?: number;
    interval?: number;
    isActive?: boolean;
    threshold?: number;
    configuration?: any;
    createdBy?: string;
}
