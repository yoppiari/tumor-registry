import { LaboratoryService } from './laboratory.service';
import { LabTestType, LabTestStatus, SpecimenType, UrgencyLevel } from '@prisma/client';
export declare class LaboratoryController {
    private readonly laboratoryService;
    constructor(laboratoryService: LaboratoryService);
    createLabOrder(createLabOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        testType: LabTestType;
        specimenType: SpecimenType;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        requestedDate: string;
        notes?: string;
    }): Promise<any>;
    searchLabOrders(searchQuery: any): Promise<{
        orders: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getPendingOrders(centerId?: string): Promise<any[]>;
    getLabOrderById(orderId: string): Promise<any>;
    updateLabOrderStatus(orderId: string, updateData: {
        status: LabTestStatus;
        updatedBy?: string;
    }): Promise<any>;
    updateLabResult(orderId: string, resultData: {
        result?: string;
        numericalResult?: number;
        unit?: string;
        referenceRange?: string;
        interpretation?: string;
        flaggedAsAbnormal?: boolean;
        performedBy?: string;
        performedAt?: string;
        verifiedBy?: string;
        verifiedAt?: string;
        notes?: string;
    }): Promise<any>;
    getLabOrdersByPatient(patientId: string, testType?: LabTestType, status?: LabTestStatus, dateFrom?: string, dateTo?: string, page?: string, limit?: string): Promise<{
        orders: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getLabStatistics(centerId?: string, dateFrom?: string, dateTo?: string): Promise<any>;
    createCBCOrder(cbcOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createCMPOrder(cmpOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createLFTOrder(lftOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createTumorMarkersOrder(tumorMarkersDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        cancerType?: string;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createCoagulationOrder(coagOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
}
