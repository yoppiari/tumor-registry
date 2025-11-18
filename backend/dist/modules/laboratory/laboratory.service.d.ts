import { PrismaService } from '@/database/prisma.service';
import { LabTestType, LabTestStatus, SpecimenType, UrgencyLevel } from '@prisma/client';
export declare class LaboratoryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createLabOrder(orderData: {
        patientId: string;
        orderingPhysicianId: string;
        testType: LabTestType;
        specimenType: SpecimenType;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        requestedDate: Date;
        notes?: string;
    }): Promise<any>;
    updateLabResult(orderId: string, resultData: {
        result?: string;
        numericalResult?: number;
        unit?: string;
        referenceRange?: string;
        interpretation?: string;
        flaggedAsAbnormal?: boolean;
        performedBy?: string;
        performedAt?: Date;
        verifiedBy?: string;
        verifiedAt?: Date;
        notes?: string;
    }): Promise<any>;
    getLabOrdersByPatient(patientId: string, options?: {
        testType?: LabTestType;
        status?: LabTestStatus;
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
    getLabOrderById(orderId: string): Promise<any>;
    getLabStatistics(centerId?: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
    getPendingOrders(centerId?: string): Promise<any[]>;
    updateLabOrderStatus(orderId: string, status: LabTestStatus, updatedBy?: string): Promise<any>;
    private createAbnormalResultAlert;
    private calculatePatientAge;
    private getTestTypeDisplay;
    private getStatusDisplay;
    private getUrgencyDisplay;
    private getSpecimenTypeDisplay;
    private getOrdersByTypeStatistics;
    private getOrdersByMonthStatistics;
}
