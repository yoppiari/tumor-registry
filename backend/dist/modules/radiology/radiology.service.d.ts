import { PrismaService } from '@/database/prisma.service';
import { ImagingModality, ExamStatus, ContrastType, UrgencyLevel } from '@prisma/client';
export declare class RadiologyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createImagingOrder(orderData: {
        patientId: string;
        orderingPhysicianId: string;
        modality: ImagingModality;
        bodyPart: string;
        clinicalIndication?: string;
        contrastType?: ContrastType;
        urgency: UrgencyLevel;
        requestedDate: Date;
        notes?: string;
    }): Promise<any>;
    updateRadiologyReport(orderId: string, reportData: {
        findings?: string;
        impression?: string;
        recommendation?: string;
        radiologistId?: string;
        reportDate?: Date;
        imagesCaptured?: number;
        contrastAdministered?: boolean;
        contrastAmount?: number;
        complications?: string;
        technique?: string;
        comparison?: string;
        biRadsScore?: number;
        notes?: string;
    }): Promise<any>;
    getImagingOrdersByPatient(patientId: string, options?: {
        modality?: ImagingModality;
        status?: ExamStatus;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        orders: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getImagingOrderById(orderId: string): Promise<any>;
    getRadiologyStatistics(centerId?: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
    getPendingStudies(centerId?: string): Promise<any[]>;
    updateImagingOrderStatus(orderId: string, status: ExamStatus, updatedBy?: string, scheduledDate?: Date): Promise<any>;
    getPatientRadiationDoseTracking(patientId: string): Promise<any>;
    private createCriticalFindingAlert;
    private hasCriticalFindings;
    private calculatePatientAge;
    private getModalityDisplay;
    private getStatusDisplay;
    private getUrgencyDisplay;
    private getContrastTypeDisplay;
    private estimateRadiationDose;
    private getAnnualDoseLimit;
    private getRadiationRiskLevel;
    private getOrdersByModalityStatistics;
    private getOrdersByMonthStatistics;
}
