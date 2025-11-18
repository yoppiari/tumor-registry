import { RadiologyService } from './radiology.service';
import { ImagingModality, ExamStatus, ContrastType, UrgencyLevel } from '@prisma/client';
export declare class RadiologyController {
    private readonly radiologyService;
    constructor(radiologyService: RadiologyService);
    createImagingOrder(createImagingOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        modality: ImagingModality;
        bodyPart: string;
        clinicalIndication?: string;
        contrastType?: ContrastType;
        urgency: UrgencyLevel;
        requestedDate: string;
        notes?: string;
    }): Promise<any>;
    searchImagingOrders(searchQuery: any): Promise<{
        orders: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getPendingStudies(centerId?: string): Promise<any[]>;
    getImagingOrderById(orderId: string): Promise<any>;
    updateImagingOrderStatus(orderId: string, updateData: {
        status: ExamStatus;
        updatedBy?: string;
        scheduledDate?: string;
    }): Promise<any>;
    updateRadiologyReport(orderId: string, reportData: {
        findings?: string;
        impression?: string;
        recommendation?: string;
        radiologistId?: string;
        reportDate?: string;
        imagesCaptured?: number;
        contrastAdministered?: boolean;
        contrastAmount?: number;
        complications?: string;
        technique?: string;
        comparison?: string;
        biRadsScore?: number;
        notes?: string;
    }): Promise<any>;
    getImagingOrdersByPatient(patientId: string, modality?: ImagingModality, status?: ExamStatus, dateFrom?: string, dateTo?: string, page?: string, limit?: string): Promise<{
        orders: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getRadiologyStatistics(centerId?: string, dateFrom?: string, dateTo?: string): Promise<any>;
    getPatientRadiationTracking(patientId: string): Promise<any>;
    createCTCAPOrder(ctOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        contrastType?: ContrastType;
        clinicalIndication?: string;
        cancerStaging?: boolean;
        notes?: string;
    }): Promise<any>;
    createCTSpecificOrder(ctOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        bodyPart: string;
        urgency: UrgencyLevel;
        contrastType?: ContrastType;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createMRITumorOrder(mriOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        bodyPart: string;
        urgency: UrgencyLevel;
        contrastType?: ContrastType;
        tumorType?: string;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createPETCTOrder(petOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        cancerType?: string;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createXRayChestOrder(xrayOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
    createUltrasoundAbdomenOrder(usOrderDto: {
        patientId: string;
        orderingPhysicianId: string;
        urgency: UrgencyLevel;
        clinicalIndication?: string;
        notes?: string;
    }): Promise<any>;
}
