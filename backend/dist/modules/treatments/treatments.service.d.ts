import { PrismaService } from '@/database/prisma.service';
import { PatientProcedure, ProcedureStatus } from '@prisma/client';
export declare class TreatmentsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createTreatment(treatmentData: {
        patientId: string;
        procedureName: string;
        procedureCode?: string;
        indication?: string;
        description?: string;
        startDate: Date;
        endDate?: Date;
        status: ProcedureStatus;
        performedBy: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    findByPatientId(patientId: string, status?: ProcedureStatus, page?: number, limit?: number): Promise<{
        treatments: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    updateTreatment(id: string, updateData: {
        procedureName?: string;
        procedureCode?: string;
        indication?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        status?: ProcedureStatus;
        outcome?: string;
        complications?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    scheduleTreatment(id: string, startDate: Date, endDate?: Date): Promise<PatientProcedure>;
    startTreatment(id: string): Promise<PatientProcedure>;
    completeTreatment(id: string, outcome?: string, complications?: string): Promise<PatientProcedure>;
    cancelTreatment(id: string, reason?: string): Promise<PatientProcedure>;
    getTreatmentStatistics(centerId?: string, providerId?: string): Promise<any>;
    searchTreatments(query: {
        search?: string;
        patientId?: string;
        providerId?: string;
        status?: ProcedureStatus;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        treatments: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getActiveTreatmentsByPatient(patientId: string): Promise<any[]>;
    getUpcomingTreatments(days?: number, centerId?: string): Promise<any[]>;
    private validateTreatmentData;
    private calculateTreatmentDuration;
    private getTreatmentStatus;
    private calculatePatientAge;
    private getTreatmentType;
    private getTreatmentsByTypeStatistics;
    private getTreatmentsByMonthStatistics;
}
