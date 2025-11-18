import { PrismaService } from '@/database/prisma.service';
export declare class PopulationHealthService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPopulationHealthOverview(province?: string, regency?: string): Promise<any>;
    getCancerIncidenceByRegion(level?: 'province' | 'regency'): Promise<any>;
    getScreeningProgramEffectiveness(): Promise<any>;
    getHealthcareAccessAnalysis(): Promise<any>;
    getRiskFactorAnalysis(): Promise<any>;
    getPopulationProjections(years?: number): Promise<any>;
    getHealthEconomicAnalysis(): Promise<any>;
    generatePopulationHealthReport(reportType: 'comprehensive' | 'summary' | 'detailed', filters?: any): Promise<any>;
    private getTotalPopulation;
    private getCancerIncidenceRate;
    private getMortalityRate;
    private getScreeningCoverage;
    private getEarlyDetectionRate;
    private getTopCancerTypes;
    private getAgeDistribution;
    private getGenderDistribution;
    private getSocioeconomicData;
    private getHealthcareAccessData;
    private calculateAverage;
    private generateRecommendations;
    private generateExecutiveSummary;
}
