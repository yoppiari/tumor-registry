// Export all services
export { default as authService } from './auth.service';
export { default as patientService } from './patient.service';
export { default as referenceService } from './reference.service';

// Export types
export type { LoginCredentials, LoginResponse, User } from './auth.service';
export type {
  Patient,
  CreatePatientDto,
  UpdatePatientDto,
  PatientListParams,
} from './patient.service';
export type {
  WhoBoneTumor,
  WhoSoftTissueTumor,
  BoneLocation,
  SoftTissueLocation,
  Center,
  PathologyType,
  TumorSyndrome,
} from './reference.service';
export type { ApiResponse, ApiError, PaginationParams } from './api.config';
