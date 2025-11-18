import { CancerRegistryService } from './cancer-registry.service';
import { CancerStage } from '@prisma/client';
export declare class CancerRegistryController {
    private readonly cancerRegistryService;
    constructor(cancerRegistryService: CancerRegistryService);
    getOverview(centerId?: string, dateFrom?: string, dateTo?: string): Promise<any>;
    getIncidenceTrends(years?: string, centerId?: string): Promise<any>;
    getSurvivalAnalysis(cancerType?: string, stage?: CancerStage, centerId?: string): Promise<any>;
    getTreatmentOutcomes(cancerType?: string, treatmentType?: string, centerId?: string): Promise<any>;
    getEpidemiologicalReport(centerId?: string): Promise<any>;
    getQualityMetrics(centerId?: string): Promise<any>;
    exportRegistryData(exportData: {
        format: 'json' | 'csv' | 'excel';
        filters?: {
            dateFrom?: string;
            dateTo?: string;
            centerId?: string;
            cancerType?: string;
            stage?: CancerStage;
        };
    }): Promise<any>;
    getBreastCancerStatistics(centerId?: string): Promise<any>;
    getLungCancerStatistics(centerId?: string): Promise<any>;
    getColorectalCancerStatistics(centerId?: string): Promise<any>;
    getCervicalCancerStatistics(centerId?: string): Promise<any>;
    getStageDistributionAnalysis(cancerType?: string, centerId?: string): Promise<any>;
    getAgeGroupStatistics(centerId?: string): Promise<{
        message: string;
        centerId: string;
    }>;
    getGenderDistribution(cancerType?: string, centerId?: string): Promise<any>;
    getAnnualSummary(year?: string, centerId?: string): Promise<any>;
    getComparativeAnalysis(query: any): Promise<{
        message: string;
        query: any;
    }>;
}
