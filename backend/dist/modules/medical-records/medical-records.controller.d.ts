import { MedicalRecordsService } from './medical-records.service';
import { RecordType } from '@prisma/client';
export declare class MedicalRecordsController {
    private readonly medicalRecordsService;
    constructor(medicalRecordsService: MedicalRecordsService);
    createMedicalRecord(createRecordDto: {
        patientId: string;
        recordType: RecordType;
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
    searchMedicalRecords(searchQuery: any): Promise<{
        records: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStatistics(centerId?: string, providerId?: string): Promise<any>;
    findByPatientId(patientId: string, recordType?: RecordType, page?: string, limit?: string): Promise<{
        records: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    findByRecordNumber(recordNumber: string): Promise<MedicalRecord>;
    updateMedicalRecord(id: string, updateRecordDto: {
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
    createInitialVisitRecord(createRecordDto: {
        patientId: string;
        chiefComplaint: string;
        historyOfPresent: string;
        pastMedical?: any;
        surgicalHistory?: any;
        familyHistory?: any;
        socialHistory?: any;
        reviewOfSystems?: any;
        physicalExam?: any;
        assessment?: string;
        plan?: string;
        notes?: string;
    }): Promise<MedicalRecord>;
    createProgressNote(createRecordDto: {
        patientId: string;
        chiefComplaint?: string;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }): Promise<MedicalRecord>;
    createDischargeSummary(createRecordDto: {
        patientId: string;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }): Promise<MedicalRecord>;
    createConsultationRecord(createRecordDto: {
        patientId: string;
        chiefComplaint?: string;
        historyOfPresent?: string;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }): Promise<MedicalRecord>;
    createEmergencyRecord(createRecordDto: {
        patientId: string;
        chiefComplaint: string;
        historyOfPresent?: string;
        assessment?: string;
        plan?: string;
        notes?: string;
        isConfidential?: boolean;
    }): Promise<MedicalRecord>;
}
