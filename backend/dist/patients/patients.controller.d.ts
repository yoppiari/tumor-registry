import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientSearchDto } from './dto/patient-search.dto';
import { QuickPatientEntryDto, ChatMessageDto } from './dto/quick-patient-entry.dto';
import { Patient } from './interfaces/patient.interface';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(req: any, createPatientDto: CreatePatientDto): Promise<Patient>;
    quickEntry(req: any, quickEntryDto: QuickPatientEntryDto): Promise<Patient>;
    findAll(searchDto: PatientSearchDto, page: number, limit: number, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<import("./interfaces/patient.interface").PatientListResponse>;
    getStatistics(): Promise<import("./interfaces/patient.interface").PatientStatistics>;
    findByMedicalRecordNumber(medicalRecordNumber: string): Promise<Patient>;
    findOne(id: string): Promise<Patient>;
    update(req: any, id: string, updatePatientDto: UpdatePatientDto): Promise<Patient>;
    markAsDeceased(req: any, id: string, body: {
        dateOfDeath: string;
        causeOfDeath?: string;
    }): Promise<Patient>;
    softDelete(id: string): Promise<void>;
    createChatSession(req: any): Promise<import("./interfaces/patient.interface").PatientEntrySession>;
    sendChatMessage(sessionId: string, chatMessageDto: ChatMessageDto): Promise<import("./interfaces/patient.interface").PatientEntrySession>;
    getChatSession(sessionId: string): Promise<import("./interfaces/patient.interface").PatientEntrySession>;
    advancedSearch(advancedSearchDto: any): Promise<import("./interfaces/patient.interface").PatientListResponse>;
    searchByPhone(phone: string): Promise<import("./interfaces/patient.interface").PatientListResponse>;
    searchByName(name: string): Promise<any>;
    exportToCsv(searchDto: PatientSearchDto): Promise<{
        downloadUrl: string;
        recordCount: number;
        generatedAt: string;
    }>;
}
