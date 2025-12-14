// Export all services
export { default as authService } from './auth.service';
export { default as patientService } from './patient.service';
export { default as referenceService } from './reference.service';
export { default as centersService } from './centers.service';
export { default as usersService } from './users.service';

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
export type {
  Center as CenterDetailed,
  CenterStatistics,
  CreateCenterDto,
  UpdateCenterDto,
} from './centers.service';
export type {
  User as UserDetailed,
  CreateUserDto,
  UpdateUserDto,
  ChangeRoleDto,
  ToggleStatusDto,
} from './users.service';
export type { ApiResponse, ApiError, PaginationParams } from './api.config';
