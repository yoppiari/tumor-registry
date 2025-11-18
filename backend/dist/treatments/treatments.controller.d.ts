import { TreatmentsService } from './treatments.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { SearchTreatmentDto } from './dto/search-treatment.dto';
import { CreateTreatmentSessionDto } from './dto/create-treatment-session.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { TreatmentPlan, TreatmentSession, MedicalRecord, QualityMetrics, TreatmentReport } from './interfaces/treatment.interface';
export declare class TreatmentsController {
    private readonly treatmentsService;
    constructor(treatmentsService: TreatmentsService);
    createTreatmentPlan(req: any, createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<TreatmentPlan>;
    findAllTreatmentPlans(searchDto: SearchTreatmentDto, page: number, limit: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        treatmentPlans: TreatmentPlan[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }>;
    findTreatmentPlanById(id: string): Promise<TreatmentPlan>;
    updateTreatmentPlan(req: any, id: string, updateTreatmentPlanDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan>;
    activateTreatmentPlan(req: any, id: string): Promise<TreatmentPlan>;
    completeTreatmentPlan(req: any, id: string): Promise<TreatmentPlan>;
    createTreatmentSession(req: any, createTreatmentSessionDto: CreateTreatmentSessionDto): Promise<TreatmentSession>;
    findTreatmentSessionsByPlan(planId: string): Promise<TreatmentSession[]>;
    completeTreatmentSession(req: any, sessionId: string, postAssessmentData: any): Promise<TreatmentSession>;
    createMedicalRecord(req: any, createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord>;
    findMedicalRecordsByPatient(patientId: string, limit: number): Promise<MedicalRecord[]>;
    calculateQualityMetrics(planId: string): Promise<QualityMetrics>;
    generateTreatmentReport(req: any, generateReportDto: GenerateReportDto): Promise<TreatmentReport>;
    getTreatmentProtocols(cancerType?: string, stage?: string, lineOfTherapy?: number): Promise<{
        protocols: {
            id: string;
            name: string;
            code: string;
            cancerType: string;
            stage: string;
            lineOfTherapy: number;
            category: string;
        }[];
        total: number;
    }>;
    getTreatmentOutcomesAnalytics(dateFrom?: string, dateTo?: string, cancerType?: string, stage?: string): Promise<{
        summary: {
            totalPatients: number;
            overallResponseRate: number;
            medianProgressionFreeSurvival: number;
            medianOverallSurvival: number;
            oneYearSurvivalRate: number;
            fiveYearSurvivalRate: number;
        };
        byCancerType: {
            Breast: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            Lung: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            Colorectal: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            Other: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
        };
        byStage: {
            I: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            II: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            III: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
            IV: {
                patients: number;
                responseRate: number;
                medianOS: number;
            };
        };
        trends: {
            month: string;
            patients: number;
            avgResponseRate: number;
        }[];
    }>;
    getToxicityProfiles(treatmentType?: string, toxicityGrade?: number): Promise<{
        summary: {
            totalPatients: number;
            patientsWithToxicity: number;
            overallToxicityRate: number;
            grade3PlusToxicityRate: number;
        };
        commonToxicities: {
            type: string;
            grade3Plus: number;
            allGrades: number;
        }[];
        byTreatmentType: {
            chemotherapy: {
                toxicityRate: number;
                grade3PlusRate: number;
            };
            radiotherapy: {
                toxicityRate: number;
                grade3PlusRate: number;
            };
            targeted_therapy: {
                toxicityRate: number;
                grade3PlusRate: number;
            };
            immunotherapy: {
                toxicityRate: number;
                grade3PlusRate: number;
            };
        };
    }>;
    getTreatmentSchedule(date: string, department?: string, modality?: string): Promise<{
        date: string;
        totalSessions: number;
        sessions: {
            id: string;
            patientName: string;
            treatmentType: string;
            time: string;
            duration: number;
            status: string;
        }[];
    }>;
}
