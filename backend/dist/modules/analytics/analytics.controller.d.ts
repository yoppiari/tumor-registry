import { AnalyticsService } from './analytics.service';
import { ExecutiveDashboardQueryDto } from './dto/enhanced-analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(query: ExecutiveDashboardQueryDto): Promise<any>;
    getCancerStats(provinceId?: string, cancerType?: string): Promise<any>;
    getTrends(period?: string): Promise<{
        period: string;
        data: {
            quarter: string;
            cases: number;
        }[] | {
            month: string;
            cases: number;
            trend: number;
        }[];
        growth: number;
    }>;
    getCenterPerformance(): Promise<{
        totalCenters: number;
        activeCenters: number;
        performance: {
            centerName: string;
            totalPatients: number;
            dataQuality: number;
            rank: number;
        }[];
        averageQuality: number;
        lastUpdated: Date;
    }>;
}
