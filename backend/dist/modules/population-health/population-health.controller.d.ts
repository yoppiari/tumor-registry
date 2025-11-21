import { PopulationHealthService } from './population-health.service';
export declare class PopulationHealthController {
    private readonly populationHealthService;
    constructor(populationHealthService: PopulationHealthService);
    getOverview(province?: string, regency?: string): Promise<any>;
    getIncidenceByRegion(level?: 'province' | 'regency'): Promise<any>;
    getScreeningEffectiveness(): Promise<any>;
    getHealthcareAccessAnalysis(): Promise<any>;
    getRiskFactorAnalysis(): Promise<any>;
    getPopulationProjections(years?: string): Promise<any>;
    getHealthEconomicAnalysis(): Promise<any>;
    generateReport(reportData: {
        reportType: 'comprehensive' | 'summary' | 'detailed';
        filters?: {
            province?: string;
            regency?: string;
            regionLevel?: 'province' | 'regency';
            dateFrom?: string;
            dateTo?: string;
            projectionYears?: number;
        };
    }): Promise<any>;
    getNationalOverview(): Promise<any>;
    getBreastCancerPopulationStats(province?: string): Promise<any>;
    getCervicalCancerPopulationStats(province?: string): Promise<any>;
    getPreventionImpactAnalysis(): Promise<{
        message: string;
        data: {
            smokingReduction: {
                casesPrevented: number;
                costSavings: number;
                qalyGained: number;
            };
            vaccinationImpact: {
                casesPrevented: number;
                costSavings: number;
                qalyGained: number;
            };
            screeningImpact: {
                earlyDetections: number;
                stageShift: number;
                survivalImprovement: number;
            };
        };
    }>;
    getHealthDisparitiesAnalysis(): Promise<{
        message: string;
        data: {
            urbanRural: {
                urban: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
                rural: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
            };
            socioeconomic: {
                low: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
                middle: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
                high: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
            };
            education: {
                primary: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
                secondary: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
                tertiary: {
                    incidence: number;
                    mortality: number;
                    survival: number;
                };
            };
        };
    }>;
    getCancerHotspots(cancerType?: string, heatLevel?: 'high' | 'medium' | 'low'): Promise<{
        message: string;
        filters: {
            cancerType: string;
            heatLevel: "high" | "medium" | "low";
        };
        data: {
            hotspots: {
                province: string;
                regency: string;
                intensity: number;
                cases: number;
            }[];
            metadata: {
                totalAreas: number;
                highRiskAreas: number;
                mediumRiskAreas: number;
                lowRiskAreas: number;
            };
        };
    }>;
    getTimeSeriesTrends(metric?: string, period?: 'monthly' | 'quarterly' | 'yearly', years?: string): Promise<{
        message: string;
        filters: {
            metric: string;
            period: "monthly" | "quarterly" | "yearly";
            years: number;
        };
        data: {
            series: {
                year: number;
                incidence: number;
                mortality: number;
                survival: number;
            }[];
            trends: {
                incidence: {
                    direction: string;
                    rate: number;
                    significance: string;
                };
                mortality: {
                    direction: string;
                    rate: number;
                    significance: string;
                };
                survival: {
                    direction: string;
                    rate: number;
                    significance: string;
                };
            };
        };
    }>;
    getComparativeAnalysis(query: any): Promise<{
        message: string;
        filters: any;
        data: {
            regions: {
                name: string;
                incidence: number;
                mortality: number;
                screening: number;
                healthcareAccess: number;
                rank: number;
            }[];
            benchmarks: {
                nationalAverage: {
                    incidence: number;
                    mortality: number;
                    screening: number;
                    healthcareAccess: number;
                };
                bestPractice: {
                    incidence: number;
                    mortality: number;
                    screening: number;
                    healthcareAccess: number;
                };
            };
        };
    }>;
    getRealTimeDashboard(): Promise<{
        message: string;
        lastUpdated: Date;
        metrics: {
            currentCases: number;
            newCasesToday: number;
            activeScreening: number;
            highRiskAreas: number;
            alerts: {
                type: string;
                location: string;
                severity: string;
                message: string;
            }[];
        };
    }>;
}
