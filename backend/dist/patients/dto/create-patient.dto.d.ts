export declare class AddressDto {
    street?: string;
    village?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
}
export declare class EmergencyContactDto {
    name: string;
    relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'other' | 'friend';
    phone: string;
    address?: string;
}
export declare class CancerDiagnosisDto {
    primarySite: string;
    laterality: 'left' | 'right' | 'bilateral' | 'midline' | 'unknown';
    morphology: string;
    behavior: 'benign' | 'borderline' | 'invasive' | 'in_situ';
    grade?: string;
}
export declare class TNMClassificationDto {
    t: string;
    n: string;
    m: string;
    clinicalStage?: string;
    pathologicalStage?: string;
}
export declare class MolecularMarkerDto {
    name: string;
    result: 'positive' | 'negative' | 'unknown';
    testDate?: Date;
    methodology?: string;
}
export declare class CreatePatientDto {
    medicalRecordNumber: string;
    identityNumber?: string;
    name: string;
    dateOfBirth: Date;
    gender: 'male' | 'female';
    bloodType?: 'A' | 'B' | 'AB' | 'O';
    rhFactor?: 'positive' | 'negative';
    phone?: string;
    email?: string;
    address: AddressDto;
    emergencyContact: EmergencyContactDto;
    occupation?: string;
    educationLevel?: 'SD' | 'SMP' | 'SMA' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
    religion?: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'konghucu' | 'other';
    primaryCancerDiagnosis?: CancerDiagnosisDto;
    cancerStage?: 'I' | 'II' | 'III' | 'IV';
    cancerGrade?: 'G1' | 'G2' | 'G3' | 'G4';
    tnmClassification?: TNMClassificationDto;
    histology?: string;
    molecularMarkers?: MolecularMarkerDto[];
    treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';
    dateOfDiagnosis?: Date;
    dateOfFirstVisit?: Date;
    treatmentCenter: string;
}
