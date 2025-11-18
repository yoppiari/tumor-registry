import { PrismaService } from '../database/prisma.service';
export interface TestCenterConfig {
    id: string;
    name: string;
    code: string;
    province: string;
    isActive: boolean;
}
export interface IsolationResult {
    isIsolated: boolean;
    violations: string[];
    details: any;
}
export declare class TestTenantManager {
    private readonly prisma;
    private readonly logger;
    private readonly TEST_CENTERS_PREFIX;
    constructor(prisma: PrismaService);
    createTestCenter(config: Partial<TestCenterConfig>): Promise<TestCenterConfig>;
    cleanupTestCenter(centerId: string): Promise<void>;
    validateDataIsolation(centerIds: string[]): Promise<IsolationResult>;
    createTestData(centerId: string): Promise<void>;
    getTestCenters(): Promise<TestCenterConfig[]>;
    cleanupAllTestCenters(): Promise<void>;
}
