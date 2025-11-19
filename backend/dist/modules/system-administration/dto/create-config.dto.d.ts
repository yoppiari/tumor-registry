export declare enum Environment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}
export declare class CreateConfigDto {
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
