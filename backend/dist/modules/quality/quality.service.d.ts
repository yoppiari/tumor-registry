import { PrismaService } from '@/common/database/prisma.service';
import { QualityScore, QualityTrend } from './interfaces/quality.interface';
export declare class QualityService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    calculateQualityScore(patientId: string): Promise<QualityScore>;
    getQualityTrends(patientId: string, days?: number): Promise<QualityTrend[]>;
    getCenterQualitySummary(centerId: string): Promise<any>;
    getNationalQualityOverview(): Promise<any>;
    private saveQualityMetric;
    private getQualityCategory;
    private calculateWeeklyTrends;
    private getWeekNumber;
    validatePatientData(patientId: string): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
}
