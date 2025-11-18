import { PatientsService } from './patients.service';
import { Gender, BloodType, MaritalStatus } from '@prisma/client';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    findAll(centerId?: string, search?: string, includeInactive?: string, page?: string, limit?: string): Promise<{
        patients: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    searchPatients(searchQuery: any): Promise<{
        patients: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStatistics(centerId?: string): Promise<any>;
    findById(id: string, includeMedicalHistory?: string): Promise<any>;
    findByNIK(nik: string): Promise<Patient>;
    findByMRN(mrn: string): Promise<Patient>;
    create(createPatientDto: {
        name: string;
        nik: string;
        dateOfBirth: string;
        placeOfBirth?: string;
        gender: Gender;
        bloodType?: BloodType;
        religion?: string;
        maritalStatus?: MaritalStatus;
        occupation?: string;
        education?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        province?: string;
        regency?: string;
        district?: string;
        village?: string;
        postalCode?: string;
        emergencyContact?: {
            name: string;
            relationship: string;
            phone: string;
        };
        centerId: string;
    }): Promise<Patient>;
    update(id: string, updatePatientDto: {
        name?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        province?: string;
        regency?: string;
        district?: string;
        village?: string;
        postalCode?: string;
        emergencyContact?: {
            name: string;
            relationship: string;
            phone: string;
        };
        bloodType?: BloodType;
        religion?: string;
        maritalStatus?: MaritalStatus;
        occupation?: string;
        education?: string;
        isActive?: boolean;
        isDeceased?: boolean;
        dateOfDeath?: string;
        causeOfDeath?: string;
    }): Promise<Patient>;
    getPatientVitalSigns(id: string, limit?: string): Promise<{
        patientId: string;
        patientName: any;
        vitalSigns: any;
    }>;
    getPatientDiagnoses(id: string): Promise<{
        patientId: string;
        patientName: any;
        diagnoses: any;
    }>;
    getPatientMedications(id: string): Promise<{
        patientId: string;
        patientName: any;
        medications: any;
    }>;
    getPatientAllergies(id: string): Promise<{
        patientId: string;
        patientName: any;
        allergies: any;
    }>;
    getPatientVisits(id: string, limit?: string): Promise<{
        patientId: string;
        patientName: any;
        visits: any;
    }>;
    getPatientInsurance(id: string): Promise<{
        patientId: string;
        patientName: any;
        insuranceInfos: any;
    }>;
}
