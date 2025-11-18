import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsEnum, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchTreatmentDto {
  @ApiPropertyOptional({ description: 'Patient ID' })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Treatment plan status',
    enum: ['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled']
  })
  @IsEnum(['planned', 'active', 'on_hold', 'completed', 'discontinued', 'cancelled'])
  @IsOptional()
  status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'discontinued' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Treatment modality',
    enum: ['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care']
  })
  @IsEnum(['surgery', 'chemotherapy', 'radiotherapy', 'targeted_therapy', 'immunotherapy', 'hormonal_therapy', 'supportive_care'])
  @IsOptional()
  modality?: string;

  @ApiPropertyOptional({
    description: 'Treatment intent',
    enum: ['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance']
  })
  @IsEnum(['curative', 'palliative', 'adjuvant', 'neoadjuvant', 'maintenance'])
  @IsOptional()
  intent?: 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant' | 'maintenance';

  @ApiPropertyOptional({ description: 'Primary oncologist name' })
  @IsString()
  @IsOptional()
  primaryOncologist?: string;

  @ApiPropertyOptional({ description: 'Primary cancer site' })
  @IsString()
  @IsOptional()
  primaryCancerSite?: string;

  @ApiPropertyOptional({ description: 'Cancer stage' })
  @IsString()
  @IsOptional()
  cancerStage?: string;

  @ApiPropertyOptional({ description: 'Protocol category' })
  @IsString()
  @IsOptional()
  protocolCategory?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Sort field', example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc']
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Date range for treatment start',
    type: 'object'
  })
  @IsOptional()
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export class CreateMedicalRecordDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiProperty({
    description: 'Record type',
    enum: ['progress_note', 'consultation', 'discharge_summary', 'procedure_note', 'imaging_report', 'lab_report', 'pathology_report']
  })
  @IsEnum(['progress_note', 'consultation', 'discharge_summary', 'procedure_note', 'imaging_report', 'lab_report', 'pathology_report'])
  recordType: 'progress_note' | 'consultation' | 'discharge_summary' | 'procedure_note' | 'imaging_report' | 'lab_report' | 'pathology_report';

  @ApiProperty({ description: 'Record title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Record content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Record summary' })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: 'Service type' })
  @IsString()
  serviceType: string;

  @ApiProperty({ description: 'Department' })
  @IsString()
  department: string;

  @ApiProperty({
    description: 'Encounter type',
    enum: ['outpatient', 'inpatient', 'emergency', 'day_care']
  })
  @IsEnum(['outpatient', 'inpatient', 'emergency', 'day_care'])
  encounterType: 'outpatient' | 'inpatient' | 'emergency' | 'day_care';

  @ApiProperty({ description: 'Primary provider', type: any })
  primaryProvider: any; // Would use CreateClinicalTeamMemberDto

  @ApiPropertyOptional({ description: 'Consulting providers' })
  @IsArray()
  @IsOptional()
  consultingProviders?: any[];

  @ApiProperty({ description: 'Service date' })
  @IsDate()
  @Type(() => Date)
  serviceDate: Date;

  @ApiPropertyOptional({ description: 'Documentation date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  documentationDate?: Date;

  @ApiPropertyOptional({ description: 'Diagnoses' })
  @IsArray()
  @IsOptional()
  diagnosis?: any[];

  @ApiPropertyOptional({ description: 'Medications' })
  @IsArray()
  @IsOptional()
  medications?: any[];

  @ApiPropertyOptional({ description: 'Procedures' })
  @IsArray()
  @IsOptional()
  procedures?: any[];

  @ApiPropertyOptional({ description: 'Vital signs' })
  @IsOptional()
  vitals?: any;

  @ApiPropertyOptional({ description: 'Lab results' })
  @IsArray()
  @IsOptional()
  labs?: any[];

  @ApiPropertyOptional({ description: 'Imaging results' })
  @IsArray()
  @IsOptional()
  imaging?: any[];

  @ApiProperty({ description: 'Assessment' })
  @IsString()
  assessment: string;

  @ApiProperty({ description: 'Plan' })
  @IsString()
  plan: string;

  @ApiPropertyOptional({ description: 'Follow-up plan' })
  @IsOptional()
  followUp?: any;
}

export class GenerateReportDto {
  @ApiProperty({
    description: 'Report type',
    enum: ['treatment_summary', 'progress_report', 'outcome_analysis', 'quality_metrics', 'adverse_events']
  })
  @IsEnum(['treatment_summary', 'progress_report', 'outcome_analysis', 'quality_metrics', 'adverse_events'])
  reportType: 'treatment_summary' | 'progress_report' | 'outcome_analysis' | 'quality_metrics' | 'adverse_events';

  @ApiProperty({ description: 'Report title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Report description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Patient IDs to include in report' })
  @IsArray()
  @IsOptional()
  patientIds?: string[];

  @ApiPropertyOptional({ description: 'Treatment plan IDs to include in report' })
  @IsArray()
  @IsOptional()
  treatmentPlanIds?: string[];

  @ApiProperty({ description: 'Date range for the report' })
  dateRange: {
    startDate: Date;
    endDate: Date;
  };

  @ApiPropertyOptional({ description: 'Additional report parameters' })
  @IsOptional()
  parameters?: any;

  @ApiPropertyOptional({
    description: 'Output format',
    enum: ['json', 'pdf', 'excel', 'csv']
  })
  @IsEnum(['json', 'pdf', 'excel', 'csv'])
  @IsOptional()
  format?: 'json' | 'pdf' | 'excel' | 'csv';
}