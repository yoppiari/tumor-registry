import { PerformanceService } from './performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    getDatabaseOptimizationRecommendations(): Promise<any>;
    getApplicationPerformanceMetrics(): Promise<any>;
    implementCachingStrategy(): Promise<any>;
    optimizeQueryPerformance(): Promise<any>;
    getPerformanceDashboard(): Promise<{
        timestamp: Date;
        database: any;
        application: any;
        caching: any;
        summary: {
            healthScore: any;
            totalRecommendations: any;
            criticalIssues: any;
            estimatedImpact: any;
            optimizationProgress: number;
        };
        quickActions: {
            title: string;
            description: string;
            impact: string;
            effort: string;
            timeframe: string;
        }[];
        performanceTrends: {
            responseTime: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            errorRate: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            cacheHitRate: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
            memoryUsage: {
                current: any;
                target: number;
                trend: string;
                status: string;
            };
        };
    }>;
    runBenchmark(benchmarkConfig: {
        testTypes: string[];
        duration: number;
        concurrency: number;
        scenarios: any[];
    }): Promise<{
        timestamp: Date;
        configuration: {
            testTypes: string[];
            duration: number;
            concurrency: number;
            scenarios: any[];
        };
        results: {
            loadTesting: {
                averageResponseTime: number;
                peakResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
                throughput: number;
            };
            stressTesting: {
                maxConcurrentUsers: number;
                breakingPoint: number;
                recoveryTime: number;
            };
            enduranceTesting: {
                duration: string;
                memoryLeakDetected: boolean;
                performanceDegradation: number;
                averageResponseTime: number;
            };
        };
        comparisons: {
            baseline: {
                averageResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
            };
            current: {
                averageResponseTime: number;
                requestsPerSecond: number;
                errorRate: number;
            };
            improvement: {
                responseTime: string;
                throughput: string;
                reliability: string;
            };
        };
        recommendations: {
            category: string;
            priority: string;
            title: string;
            description: string;
        }[];
    }>;
    private calculateOptimizationProgress;
}
