// Basic types for analytics module
export interface BaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient extends BaseDocument {
  medicalRecordNumber: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  // Add other patient fields as needed
}

export interface TreatmentPlan extends BaseDocument {
  patientId: string;
  diagnosis: string;
  stage: string;
  treatmentType: string;
  startDate: Date;
  endDate?: Date;
}

export interface TreatmentSession extends BaseDocument {
  treatmentPlanId: string;
  sessionDate: Date;
  sessionType: string;
  outcomes: string[];
}

export interface MedicalRecord extends BaseDocument {
  patientId: string;
  recordType: string;
  content: any;
  recordedDate: Date;
}