import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsArray, IsEnum, IsOptional, IsNumber, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClinicalTeamMemberDto } from './create-treatment-plan.dto';

export class CreateTreatmentSessionDto {
  @ApiProperty({ description: 'Treatment plan ID' })
  @IsString()
  treatmentPlanId: string;

  @ApiProperty({ description: 'Session date', example: '2024-01-20T09:00:00Z' })
  @IsDate()
  @Type(() => Date)
  sessionDate: Date;

  @ApiProperty({
    description: 'Treatment modality',
    enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
  })
  @IsEnum(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care'])
  modality: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';

  @ApiPropertyOptional({ description: 'Duration in minutes', example: 180 })
  @IsNumber()
  @Min(0)
  @Max(1440) // Max 24 hours
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Pre-session assessment', type: CreatePreSessionAssessmentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePreSessionAssessmentDto)
  preAssessment: CreatePreSessionAssessmentDto;

  @ApiPropertyOptional({ description: 'Session medications', type: [CreateSessionMedicationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionMedicationDto)
  medications?: CreateSessionMedicationDto[];

  @ApiPropertyOptional({ description: 'Session procedures', type: [CreateSessionProcedureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionProcedureDto)
  procedures?: CreateSessionProcedureDto[];

  @ApiProperty({ description: 'Performed by', type: CreateClinicalTeamMemberDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateClinicalTeamMemberDto)
  performedBy: CreateClinicalTeamMemberDto;

  @ApiPropertyOptional({ description: 'Supervised by', type: CreateClinicalTeamMemberDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateClinicalTeamMemberDto)
  supervisedBy?: CreateClinicalTeamMemberDto;
}

export class CreatePreSessionAssessmentDto {
  @ApiProperty({ description: 'Vital signs', type: CreateVitalSignsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateVitalSignsDto)
  vitalSigns: CreateVitalSignsDto;

  @ApiProperty({ description: 'Performance status', type: CreatePerformanceStatusDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreatePerformanceStatusDto)
  performanceStatus: CreatePerformanceStatusDto;

  @ApiPropertyOptional({ description: 'Symptoms assessment', type: [CreateSymptomAssessmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSymptomAssessmentDto)
  symptoms?: CreateSymptomAssessmentDto[];

  @ApiPropertyOptional({ description: 'Lab assessments', type: [CreateLabAssessmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabAssessmentDto)
  labs?: CreateLabAssessmentDto[];

  @ApiProperty({
    description: 'Treatment clearance',
    enum: ['cleared', 'cleared_with_modifications', 'delayed', 'cancelled']
  })
  @IsEnum(['cleared', 'cleared_with_modifications', 'delayed', 'cancelled'])
  clearance: 'cleared' | 'cleared_with_modifications' | 'delayed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Clearance notes' })
  @IsString()
  @IsOptional()
  clearanceNotes?: string;

  @ApiProperty({ description: 'Assessed by', example: 'Dr. Nurse Name' })
  @IsString()
  assessedBy: string;
}

export class CreateVitalSignsDto {
  @ApiProperty({ description: 'Blood pressure', type: CreateBloodPressureDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBloodPressureDto)
  bloodPressure: CreateBloodPressureDto;

  @ApiProperty({ description: 'Heart rate (bpm)', example: 72 })
  @IsNumber()
  @Min(30)
  @Max(200)
  heartRate: number;

  @ApiProperty({ description: 'Respiratory rate (breaths/min)', example: 16 })
  @IsNumber()
  @Min(8)
  @Max(40)
  respiratoryRate: number;

  @ApiProperty({ description: 'Temperature (°C)', example: 36.8 })
  @IsNumber()
  @Min(30)
  @Max(45)
  temperature: number;

  @ApiProperty({ description: 'Weight (kg)', example: 65.5 })
  @IsNumber()
  @Min(1)
  @Max(300)
  weight: number;

  @ApiPropertyOptional({ description: 'Height (cm)', example: 165 })
  @IsNumber()
  @Min(50)
  @Max(250)
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'BMI' })
  @IsNumber()
  @IsOptional()
  bmi?: number;

  @ApiPropertyOptional({ description: 'Oxygen saturation (%)', example: 98 })
  @IsNumber()
  @Min(70)
  @Max(100)
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional({ description: 'Pain score (0-10)', example: 2 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  painScore?: number;
}

export class CreateBloodPressureDto {
  @ApiProperty({ description: 'Systolic pressure', example: 120 })
  @IsNumber()
  @Min(60)
  @Max(250)
  systolic: number;

  @ApiProperty({ description: 'Diastolic pressure', example: 80 })
  @IsNumber()
  @Min(40)
  @Max(150)
  diastolic: number;
}

export class CreatePerformanceStatusDto {
  @ApiProperty({
    description: 'Performance scale',
    enum: ['ECOG', 'KARNOFSKY']
  })
  @IsEnum(['ECOG', 'KARNOFSKY'])
  scale: 'ECOG' | 'KARNOFSKY';

  @ApiProperty({ description: 'Performance score', example: 1 })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateSymptomAssessmentDto {
  @ApiProperty({ description: 'Symptom', example: 'Nausea' })
  @IsString()
  symptom: string;

  @ApiProperty({ description: 'Severity (0-10)', example: 3 })
  @IsNumber()
  @Min(0)
  @Max(10)
  severity: number;

  @ApiPropertyOptional({ description: 'Duration', example: '2 days' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Impact on activities',
    enum: ['none', 'mild', 'moderate', 'severe']
  })
  @IsEnum(['none', 'mild', 'moderate', 'severe'])
  impactOnActivities: 'none' | 'mild' | 'moderate' | 'severe';

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateLabAssessmentDto {
  @ApiProperty({ description: 'Test name', example: 'Absolute Neutrophil Count' })
  @IsString()
  testName: string;

  @ApiProperty({ description: 'Value', example: 2.1 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Unit', example: 'x10^9/L' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Reference range', example: '1.5-7.0' })
  @IsString()
  referenceRange: string;

  @ApiProperty({
    description: 'Status',
    enum: ['normal', 'high', 'low', 'critical']
  })
  @IsEnum(['normal', 'high', 'low', 'critical'])
  status: 'normal' | 'high' | 'low' | 'critical';

  @ApiProperty({ description: 'Test date', example: '2024-01-20T08:00:00Z' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class CreateSessionMedicationDto {
  @ApiProperty({ description: 'Medication name', example: 'Doxorubicin' })
  @IsString()
  medicationName: string;

  @ApiProperty({ description: 'Dosage', example: '60 mg' })
  @IsString()
  dosage: string;

  @ApiProperty({ description: 'Route', example: 'IV' })
  @IsString()
  route: string;

  @ApiPropertyOptional({ description: 'Administration time', example: '2024-01-20T09:30:00Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  administrationTime?: Date;

  @ApiProperty({ description: 'Administered by', example: 'Nurse Sarah' })
  @IsString()
  administeredBy: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateSessionProcedureDto {
  @ApiProperty({ description: 'Procedure name', example: 'Central line insertion' })
  @IsString()
  procedureName: string;

  @ApiProperty({ description: 'Start time', example: '2024-01-20T09:15:00Z' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'End time', example: '2024-01-20T09:45:00Z' })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ description: 'Performed by', example: 'Dr. Smith' })
  @IsString()
  performedBy: string;

  @ApiPropertyOptional({ description: 'Complications', example: ['Minor bleeding'] })
  @IsArray()
  @IsOptional()
  complications?: string[];

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}