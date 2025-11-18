import { PrismaService } from '@/database/prisma.service';
import { MedicalRecord, RecordType } from '@prisma/client';
export declare class MedicalRecordsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createMedicalRecord(recordData: {
        patientId: string;
        recordType: RecordType;
        providerId: string;
        chiefComplaint?: string;
        historyOfPresent?: string;
        pastMedical?: any;
        surgicalHistory?: any;
        familyHistory?: any;
        socialHistory?: any;
        reviewOfSystems?: any;
        physicalExam?: any;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }): Promise<MedicalRecord>;
    findByPatientId(patientId: string, recordType?: RecordType, page?: number, limit?: number): Promise<{
        records: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    findByRecordNumber(recordNumber: string): Promise<MedicalRecord>;
    updateMedicalRecord(id: string, updateData: {
        chiefComplaint?: string;
        historyOfPresent?: string;
        pastMedical?: any;
        surgicalHistory?: any;
        familyHistory?: any;
        socialHistory?: any;
        reviewOfSystems?: any;
        physicalExam?: any;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }, providerId: string): Promise<MedicalRecord>;
    getMedicalRecordStatistics(centerId?: string, providerId?: string): Promise<any>;
    searchMedicalRecords(query: {
        search?: string;
        patientId?: string;
        providerId?: string;
        recordType?: RecordType;
        isConfidential?: boolean;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        records: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    private generateRecordNumber;
    private getRecordsByTypeStatistics;
    private getRecordsByMonthStatistics;
}
