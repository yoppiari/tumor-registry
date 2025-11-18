import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsArray, IsEnum, IsOptional, IsNumber, IsObject, Min, Max, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreatmentPlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Chemotherapy for Breast Cancer' })
  @IsString()
  @IsNotEmpty()
  planName: string;

  @ApiProperty({ description: 'Plan code', example: 'BR-CA-CHMO-001' })
  @IsString()
  @IsNotEmpty()
  planCode: string;

  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Primary cancer site', example: 'Breast' })
  @IsString()
  @IsNotEmpty()
  primaryCancerSite: string;

  @ApiProperty({ description: 'Cancer stage', example: 'II' })
  @IsString()
  @IsNotEmpty()
  cancerStage: string;

  @ApiPropertyOptional({ description: 'Histology', example: 'Invasive Ductal Carcinoma' })
  @IsString()
  histology?: string;

  @ApiProperty({
    description: 'Treatment modalities',
    type: [CreateTreatmentModalityDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentModalityDto)
  modalities: CreateTreatmentModalityDto[];

  @ApiProperty({
    description: 'Treatment intent',
    enum: ['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']
  })
  @IsEnum(['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance'])
  intent: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';

  @ApiPropertyOptional({ description: 'Protocol ID', example: 'uuid' })
  @IsString()
  @IsOptional()
  protocolId?: string;

  @ApiPropertyOptional({ description: 'Protocol name', example: 'AC-T' })
  @IsString()
  @IsOptional()
  protocolName?: string;

  @ApiPropertyOptional({ description: 'Protocol version', example: '1.0' })
  @IsString()
  @IsOptional()
  protocolVersion?: string;

  @ApiPropertyOptional({
    description: 'Protocol category',
    enum: ['standard', 'clinical_trial', 'modified', 'compassionate_use']
  })
  @IsEnum(['standard', 'clinical_trial', 'modified', 'compassionate_use'])
  @IsOptional()
  protocolCategory?: 'standard' | 'clinical_trial' | 'modified' | 'compassionate_use';

  @ApiProperty({ description: 'Primary oncologist', type: CreateClinicalTeamMemberDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateClinicalTeamMemberDto)
  primaryOncologist: CreateClinicalTeamMemberDto;

  @ApiPropertyOptional({
    description: 'Multidisciplinary team members',
    type: [CreateClinicalTeamMemberDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClinicalTeamMemberDto)
  multidisciplinaryTeam?: CreateClinicalTeamMemberDto[];

  @ApiProperty({ description: 'Start date', example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiPropertyOptional({ description: 'Expected end date', example: '2024-06-15' })
  @IsDate()
  @Type(() => Date)
  expectedEndDate?: Date;

  @ApiPropertyOptional({ description: 'Total number of cycles', example: 6 })
  @IsNumber()
  @Min(1)
  @Max(52)
  @IsOptional()
  totalCycles?: number;

  @ApiProperty({ description: 'Baseline assessment', type: CreateBaselineAssessmentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBaselineAssessmentDto)
  baselineAssessment: CreateBaselineAssessmentDto;
}

export class CreateTreatmentModalityDto {
  @ApiProperty({
    description: 'Modality type',
    enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
  })
  @IsEnum(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care'])
  type: 'surgery' | 'chemotherapy' | 'radiotherapy' | 'targeted_therapy' | 'immunotherapy' | 'hormonal_therapy' | 'supportive_care';

  @ApiProperty({ description: 'Modality name', example: 'Doxorubicin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Priority',
    enum: ['primary', 'secondary', 'adjuvant']
  })
  @IsEnum(['primary', 'secondary', 'adjuvant'])
  priority: 'primary' | 'secondary' | 'adjuvant';

  @ApiPropertyOptional({ description: 'Sequence number', example: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  sequence?: number;

  @ApiPropertyOptional({ description: 'Description', example: 'Neoadjuvant chemotherapy' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Modality settings', type: CreateModalitySettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateModalitySettingsDto)
  settings?: CreateModalitySettingsDto;
}

export class CreateModalitySettingsDto {
  @ApiPropertyOptional({ description: 'Surgery type', example: 'Mastectomy' })
  @IsString()
  @IsOptional()
  surgeryType?: string;

  @ApiPropertyOptional({
    description: 'Surgical approach',
    enum: ['open', 'laparoscopic', 'robotic', 'endoscopic']
  })
  @IsEnum(['open', 'laparoscopic', 'robotic', 'endoscopic'])
  @IsOptional()
  surgicalApproach?: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic';

  @ApiPropertyOptional({ description: 'Planned surgery date', example: '2024-01-20' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  plannedDate?: Date;

  @ApiPropertyOptional({ description: 'Chemotherapy regimen', example: 'AC' })
  @IsString()
  @IsOptional()
  regimen?: string;

  @ApiPropertyOptional({ description: 'Cycle length in days', example: 21 })
  @IsNumber()
  @Min(1)
  @Max(365)
  @IsOptional()
  cycleLength?: number;

  @ApiPropertyOptional({ description: 'Number of cycles', example: 4 })
  @IsNumber()
  @Min(1)
  @Max(52)
  @IsOptional()
  numberOfCycles?: number;

  @ApiPropertyOptional({ description: 'Radiotherapy technique', example: 'IMRT' })
  @IsString()
  @IsOptional()
  technique?: string;

  @ApiPropertyOptional({ description: 'Total dose in Gy', example: 50 })
  @IsNumber()
  @Min(1)
  @Max(200)
  @IsOptional()
  dose?: number;

  @ApiPropertyOptional({ description: 'Number of fractions', example: 25 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  fractions?: number;

  @ApiPropertyOptional({ description: 'Target volume', example: 'Breast and regional nodes' })
  @IsString()
  @IsOptional()
  targetVolume?: string;

  @ApiPropertyOptional({ description: 'Therapy agent', example: 'Trastuzumab' })
  @IsString()
  @IsOptional()
  agent?: string;

  @ApiPropertyOptional({ description: 'Dosage', example: '8 mg/kg' })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiPropertyOptional({ description: 'Frequency', example: 'Every 3 weeks' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ description: 'Duration', example: '1 year' })
  @IsString()
  @IsOptional()
  duration?: string;
}

export class CreateClinicalTeamMemberDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Name', example: 'Dr. John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Role',
    enum: ['medical_oncologist', 'radiation_oncologist', 'surgical_oncologist', 'pathologist', 'radiologist', 'nurse', 'pharmacist', 'nutritionist', 'social_worker', 'palliative_care']
  })
  @IsEnum(['medical_oncologist', 'radiation_oncologist', 'surgical_oncologist', 'pathologist', 'radiologist', 'nurse', 'pharmacist', 'nutritionist', 'social_worker', 'palliative_care'])
  role: 'medical_oncologist' | 'radiation_oncologist' | 'surgical_oncologist' | 'pathologist' | 'radiologist' | 'nurse' | 'pharmacist' | 'nutritionist' | 'social_worker' | 'palliative_care';

  @ApiProperty({ description: 'Department', example: 'Medical Oncology' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Institution', example: 'National Cancer Center' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiPropertyOptional({ description: 'Email', example: 'john.smith@hospital.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Phone', example: '+62-812-3456-7890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Is primary team member' })
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateBaselineAssessmentDto {
  @ApiProperty({ description: 'Assessment date', example: '2024-01-10' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Disease assessment', type: CreateDiseaseAssessmentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateDiseaseAssessmentDto)
  diseaseAssessment: CreateDiseaseAssessmentDto;

  @ApiPropertyOptional({ description: 'Laboratory values', type: [CreateLabValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabValueDto)
  laboratoryValues?: CreateLabValueDto[];

  @ApiPropertyOptional({ description: 'Imaging studies', type: [CreateImagingStudyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImagingStudyDto)
  imagingStudies?: CreateImagingStudyDto[];

  @ApiProperty({ description: 'Functional status', type: CreateFunctionalStatusDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateFunctionalStatusDto)
  functionalStatus: CreateFunctionalStatusDto;

  @ApiPropertyOptional({ description: 'Comorbidities', type: [CreateComorbidityDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComorbidityDto)
  comorbidities?: CreateComorbidityDto[];
}

export class CreateDiseaseAssessmentDto {
  @ApiProperty({ description: 'Lesion measurements', type: [CreateLesionMeasurementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLesionMeasurementDto)
  lesionMeasurements: CreateLesionMeasurementDto[];

  @ApiProperty({
    description: 'Disease burden',
    enum: ['minimal', 'moderate', 'extensive']
  })
  @IsEnum(['minimal', 'moderate', 'extensive'])
  diseaseBurden: 'minimal' | 'moderate' | 'extensive';

  @ApiPropertyOptional({ description: 'Biomarkers', type: [CreateBiomarkerResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBiomarkerResultDto)
  biomarkers?: CreateBiomarkerResultDto[];

  @ApiProperty({ description: 'Assessment date', example: '2024-01-10' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Assessment method',
    enum: ['RECIST', 'WHO', 'PERCIST', 'clinical']
  })
  @IsEnum(['RECIST', 'WHO', 'PERCIST', 'clinical'])
  assessmentMethod: 'RECIST' | 'WHO' | 'PERCIST' | 'clinical';
}

export class CreateLesionMeasurementDto {
  @ApiProperty({ description: 'Lesion site', example: 'Right breast mass' })
  @IsString()
  @IsNotEmpty()
  site: string;

  @ApiProperty({
    description: 'Lesion type',
    enum: ['target', 'non_target', 'new']
  })
  @IsEnum(['target', 'non_target', 'new'])
  lesionType: 'target' | 'non_target' | 'new';

  @ApiProperty({ description: 'Baseline size in mm', example: 25 })
  @IsNumber()
  @Min(1)
  @Max(500)
  baselineSize: number;

  @ApiProperty({
    description: 'Measurement method',
    enum: ['CT', 'MRI', 'PET', 'clinical', 'ultrasound']
  })
  @IsEnum(['CT', 'MRI', 'PET', 'clinical', 'ultrasound'])
  measurementMethod: 'CT' | 'MRI' | 'PET' | 'clinical' | 'ultrasound';

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateLabValueDto {
  @ApiProperty({ description: 'Test name', example: 'Hemoglobin' })
  @IsString()
  @IsNotEmpty()
  testName: string;

  @ApiProperty({ description: 'Value', example: 12.5 })
  @IsNumber()
  value: number;

  @ApiProperty({ description: 'Unit', example: 'g/dL' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'Reference range', example: '12.0-15.5' })
  @IsString()
  @IsNotEmpty()
  referenceRange: string;

  @ApiProperty({
    description: 'Category',
    enum: ['hematology', 'chemistry', 'tumor_marker', 'hormone', 'other']
  })
  @IsEnum(['hematology', 'chemistry', 'tumor_marker', 'hormone', 'other'])
  category: 'hematology' | 'chemistry' | 'tumor_marker' | 'hormone' | 'other';

  @ApiProperty({ description: 'Test date', example: '2024-01-10' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class CreateImagingStudyDto {
  @ApiProperty({ description: 'Study type', example: 'CT Chest/Abdomen/Pelvis' })
  @IsString()
  @IsNotEmpty()
  studyType: string;

  @ApiProperty({ description: 'Study date', example: '2024-01-08' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Findings', example: 'No evidence of metastatic disease' })
  @IsString()
  @IsNotEmpty()
  findings: string;

  @ApiPropertyOptional({ description: 'Impression', example: 'Stable disease' })
  @IsString()
  @IsOptional()
  impression?: string;

  @ApiPropertyOptional({ description: 'Radiologist', example: 'Dr. Radiologist' })
  @IsString()
  @IsOptional()
  radiologist?: string;

  @ApiPropertyOptional({ description: 'Report URL' })
  @IsString()
  @IsOptional()
  reportUrl?: string;
}

export class CreateFunctionalStatusDto {
  @ApiProperty({ description: 'ADL score (0-6)', example: 6 })
  @IsNumber()
  @Min(0)
  @Max(6)
  adlScore: number;

  @ApiProperty({ description: 'IADL score (0-8)', example: 8 })
  @IsNumber()
  @Min(0)
  @Max(8)
  iadlScore: number;

  @ApiProperty({
    description: 'Nutritional status',
    enum: ['well_nourished', 'moderately_malnourished', 'severely_malnourished']
  })
  @IsEnum(['well_nourished', 'moderately_malnourished', 'severely_malnourished'])
  nutritionalStatus: 'well_nourished' | 'moderately_malnourished' | 'severely_malnourished';

  @ApiProperty({ description: 'Performance score', example: 90 })
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceScore: number;
}

export class CreateComorbidityDto {
  @ApiProperty({ description: 'Condition', example: 'Hypertension' })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({
    description: 'Severity',
    enum: ['mild', 'moderate', 'severe']
  })
  @IsEnum(['mild', 'moderate', 'severe'])
  severity: 'mild' | 'moderate' | 'severe';

  @ApiProperty({ description: 'Controlled status' })
  controlled: boolean;

  @ApiProperty({ description: 'Treatment', example: 'ACE inhibitor' })
  @IsString()
  @IsNotEmpty()
  treatment: string;

  @ApiProperty({
    description: 'Impact on cancer treatment',
    enum: ['none', 'minimal', 'moderate', 'significant']
  })
  @IsEnum(['none', 'minimal', 'moderate', 'significant'])
  impactOnCancerTreatment: 'none' | 'minimal' | 'moderate' | 'significant';
}

export class CreateBiomarkerResultDto {
  @ApiProperty({ description: 'Marker name', example: 'HER2' })
  @IsString()
  @IsNotEmpty()
  markerName: string;

  @ApiProperty({ description: 'Value', example: 'Positive' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: 'Unit' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: 'Reference range' })
  @IsString()
  @IsOptional()
  referenceRange?: string;

  @ApiPropertyOptional({ description: 'Interpretation', example: 'HER2-positive (3+)' })
  @IsString()
  @IsOptional()
  interpretation?: string;

  @ApiProperty({ description: 'Test date', example: '2024-01-05' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiPropertyOptional({ description: 'Assay method', example: 'IHC' })
  @IsString()
  @IsOptional()
  assayMethod?: string;
}