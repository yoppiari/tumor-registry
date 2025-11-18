import { Patient, CreatePatientDto, UpdatePatientDto, PatientSearchDto, PatientListResponse, PatientStatistics, QuickPatientEntryDto, PatientEntrySession } from './interfaces/patient.interface';
export declare class PatientsService {
    private patients;
    private entrySessions;
    create(createPatientDto: CreatePatientDto, createdBy: string): Promise<Patient>;
    findById(id: string): Promise<Patient>;
    findByMedicalRecordNumber(mrn: string): Promise<Patient>;
    findAll(searchDto: PatientSearchDto): Promise<PatientListResponse>;
    update(id: string, updatePatientDto: UpdatePatientDto, updatedBy: string): Promise<Patient>;
    softDelete(id: string): Promise<void>;
    markAsDeceased(id: string, dateOfDeath: Date, causeOfDeath?: string, updatedBy?: string): Promise<Patient>;
    getStatistics(): Promise<PatientStatistics>;
    quickEntry(quickEntryDto: QuickPatientEntryDto, createdBy: string): Promise<Patient>;
    private generateMedicalRecordNumber;
    createEntrySession(userId: string): Promise<PatientEntrySession>;
    getSession(sessionId: string): Promise<PatientEntrySession>;
    updateSession(sessionId: string, content: string, fieldName?: string, formData?: any): Promise<PatientEntrySession>;
    private generateSystemResponse;
}
