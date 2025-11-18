import { TreatmentsService } from './treatments.service';
import { ProcedureStatus } from '@prisma/client';
export declare class TreatmentsController {
    private readonly treatmentsService;
    constructor(treatmentsService: TreatmentsService);
    createTreatment(createTreatmentDto: {
        patientId: string;
        procedureName: string;
        procedureCode?: string;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        status: ProcedureStatus;
        notes?: string;
    }): Promise<PatientProcedure>;
    searchTreatments(searchQuery: any): Promise<{
        treatments: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStatistics(centerId?: string, providerId?: string): Promise<any>;
    getUpcomingTreatments(days?: string, centerId?: string): Promise<any[]>;
    findByPatientId(patientId: string, status?: ProcedureStatus, page?: string, limit?: string): Promise<{
        treatments: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getActiveTreatmentsByPatient(patientId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    updateTreatment(id: string, updateTreatmentDto: {
        procedureName?: string;
        procedureCode?: string;
        indication?: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        status?: ProcedureStatus;
        outcome?: string;
        complications?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    scheduleTreatment(id: string, scheduleDto: {
        startDate: string;
        endDate?: string;
    }): Promise<PatientProcedure>;
    startTreatment(id: string): Promise<PatientProcedure>;
    completeTreatment(id: string, completeDto: {
        outcome?: string;
        complications?: string;
    }): Promise<PatientProcedure>;
    cancelTreatment(id: string, reason: string): Promise<PatientProcedure>;
    createChemotherapyTreatment(createTreatmentDto: {
        patientId: string;
        protocol?: string;
        cycle?: string;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    createRadiotherapyTreatment(createTreatmentDto: {
        patientId: string;
        technique?: string;
        dose?: string;
        fractions?: number;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    createSurgeryTreatment(createTreatmentDto: {
        patientId: string;
        procedure?: string;
        approach?: string;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    createImmunotherapyTreatment(createTreatmentDto: {
        patientId: string;
        agent?: string;
        regimen?: string;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    createTargetedTherapyTreatment(createTreatmentDto: {
        patientId: string;
        drug?: string;
        target?: string;
        indication?: string;
        description?: string;
        startDate: string;
        endDate?: string;
        notes?: string;
    }): Promise<PatientProcedure>;
    private generateChemoCode;
    private generateRadTherapyCode;
    private generateSurgeryCode;
    private generateImmunoCode;
    private generateTargetedCode;
}
