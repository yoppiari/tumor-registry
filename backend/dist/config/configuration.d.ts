declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        url: string;
    };
    redis: {
        url: string;
        password: string;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    app: {
        name: string;
        version: string;
        corsOrigin: string;
    };
    minio: {
        endPoint: string;
        port: number;
        useSSL: boolean;
        accessKey: string;
        secretKey: string;
        bucket: string;
    };
};
export default _default;
