import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiPropertyOptional()
  street?: string;

  @ApiPropertyOptional()
  village?: string;

  @ApiPropertyOptional()
  district?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  province?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  country?: string;
}

export class EmergencyContactDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['spouse', 'parent', 'child', 'sibling', 'other', 'friend'] })
  relationship: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  address?: string;
}

export class CancerDiagnosisDto {
  @ApiProperty()
  primarySite: string;

  @ApiProperty({ enum: ['left', 'right', 'bilateral', 'midline', 'unknown'] })
  laterality: string;

  @ApiProperty()
  morphology: string;

  @ApiProperty({ enum: ['benign', 'borderline', 'invasive', 'in_situ'] })
  behavior: string;

  @ApiPropertyOptional()
  grade?: string;
}

export class TNMClassificationDto {
  @ApiProperty()
  t: string;

  @ApiProperty()
  n: string;

  @ApiProperty()
  m: string;

  @ApiPropertyOptional()
  clinicalStage?: string;

  @ApiPropertyOptional()
  pathologicalStage?: string;
}

export class MolecularMarkerDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['positive', 'negative', 'unknown'] })
  result: string;

  @ApiPropertyOptional()
  testDate?: Date;

  @ApiPropertyOptional()
  methodology?: string;
}

export class PatientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  medicalRecordNumber: string;

  @ApiPropertyOptional()
  identityNumber?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: ['male', 'female'] })
  gender: string;

  @ApiPropertyOptional({ enum: ['A', 'B', 'AB', 'O'] })
  bloodType?: string;

  @ApiPropertyOptional({ enum: ['positive', 'negative'] })
  rhFactor?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty({ type: AddressDto })
  address: AddressDto;

  @ApiProperty({ type: EmergencyContactDto })
  emergencyContact: EmergencyContactDto;

  @ApiPropertyOptional()
  occupation?: string;

  @ApiPropertyOptional({ enum: ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'] })
  educationLevel?: string;

  @ApiPropertyOptional({ enum: ['single', 'married', 'divorced', 'widowed'] })
  maritalStatus?: string;

  @ApiPropertyOptional({ enum: ['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'other'] })
  religion?: string;

  @ApiPropertyOptional({ type: CancerDiagnosisDto })
  primaryCancerDiagnosis?: CancerDiagnosisDto;

  @ApiPropertyOptional({ enum: ['I', 'II', 'III', 'IV'] })
  cancerStage?: string;

  @ApiPropertyOptional({ enum: ['G1', 'G2', 'G3', 'G4'] })
  cancerGrade?: string;

  @ApiPropertyOptional({ type: TNMClassificationDto })
  tnmClassification?: TNMClassificationDto;

  @ApiPropertyOptional()
  histology?: string;

  @ApiPropertyOptional({ type: [MolecularMarkerDto] })
  molecularMarkers?: MolecularMarkerDto[];

  @ApiProperty({ enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'] })
  treatmentStatus: string;

  @ApiPropertyOptional()
  dateOfDiagnosis?: Date;

  @ApiPropertyOptional()
  dateOfFirstVisit?: Date;

  @ApiPropertyOptional()
  lastVisitDate?: Date;

  @ApiProperty()
  treatmentCenter: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeceased: boolean;

  @ApiPropertyOptional()
  dateOfDeath?: Date;

  @ApiPropertyOptional()
  causeOfDeath?: string;

  @ApiProperty()
  createdBy: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  lastActivityAt?: Date;
}
