import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { MedicalImage } from '../medical-imaging/entities/medical-image.entity';
import { QualityMetric } from './entities/quality-metric.entity';
import { QualityScore, QualityTrend } from './interfaces/quality.interface';
export declare class QualityService {
    private patientRepository;
    private imageRepository;
    private qualityMetricRepository;
    constructor(patientRepository: Repository<Patient>, imageRepository: Repository<MedicalImage>, qualityMetricRepository: Repository<QualityMetric>);
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
