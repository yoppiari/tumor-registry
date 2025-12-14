import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Individual data field category with selection and justification
 */
export class DataFieldCategory {
  @IsBoolean()
  selected: boolean;

  @IsOptional()
  @IsString()
  justification?: string;

  @IsOptional()
  subFields?: Record<string, boolean>; // For granular field selection within category
}

/**
 * Complete data fields selection for research request
 * Represents the checklist of data categories researcher can request
 */
export class DataFieldsSelectionDto {
  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  demographics?: DataFieldCategory; // Age, gender, region

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  demographicsIdentifiable?: DataFieldCategory; // NIK, full name, full address (HIGH SENSITIVITY)

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  clinicalPresentation?: DataFieldCategory; // Chief complaint, symptoms, Karnofsky score

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  diagnosisClassification?: DataFieldCategory; // WHO classification, tumor location, histopathology

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  stagingData?: DataFieldCategory; // Enneking, AJCC, tumor size, metastasis

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  diagnosticInvestigations?: DataFieldCategory; // Biopsy, imaging, labs, radiology

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  treatmentManagement?: DataFieldCategory; // Surgery, chemo, radio, reconstruction

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  followUpOutcomes?: DataFieldCategory; // Follow-up visits, MSTS scores, recurrence, survival

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  clinicalPhotosImaging?: DataFieldCategory; // Clinical photos and imaging files (HIGH SENSITIVITY)

  @ValidateNested()
  @Type(() => DataFieldCategory)
  @IsOptional()
  cpcRecords?: DataFieldCategory; // CPC conference records
}

/**
 * Quick preset options for common research types
 */
export enum DataFieldPreset {
  BASIC_RESEARCH = 'basic_research', // Demographics + Diagnosis + Staging
  OUTCOME_STUDY = 'outcome_study', // Diagnosis + Staging + Treatment + Follow-up + MSTS
  SURVIVAL_ANALYSIS = 'survival_analysis', // Demographics + Diagnosis + Staging + Treatment + Survival
  TREATMENT_COMPARISON = 'treatment_comparison', // Diagnosis + Staging + Treatment + Follow-up
  CUSTOM = 'custom', // Manual selection
}

/**
 * Helper function to get preset data fields selection
 */
export function getPresetDataFields(preset: DataFieldPreset): DataFieldsSelectionDto {
  const presets: Record<DataFieldPreset, DataFieldsSelectionDto> = {
    [DataFieldPreset.BASIC_RESEARCH]: {
      demographics: {
        selected: true,
        justification: 'Basic demographics for patient characterization',
        subFields: { age: true, gender: true, region: true },
      },
      diagnosisClassification: {
        selected: true,
        justification: 'Diagnosis and classification for tumor type analysis',
      },
      stagingData: {
        selected: true,
        justification: 'Staging data for disease severity assessment',
      },
    },
    [DataFieldPreset.OUTCOME_STUDY]: {
      diagnosisClassification: {
        selected: true,
        justification: 'Diagnosis for outcome stratification',
      },
      stagingData: {
        selected: true,
        justification: 'Staging for baseline disease severity',
      },
      treatmentManagement: {
        selected: true,
        justification: 'Treatment details for outcome correlation',
      },
      followUpOutcomes: {
        selected: true,
        justification: 'Follow-up data and MSTS scores for outcome measurement',
      },
    },
    [DataFieldPreset.SURVIVAL_ANALYSIS]: {
      demographics: {
        selected: true,
        justification: 'Age and demographics as survival predictors',
        subFields: { age: true, gender: true },
      },
      diagnosisClassification: {
        selected: true,
        justification: 'Tumor type and grade for survival analysis',
      },
      stagingData: {
        selected: true,
        justification: 'Stage is primary survival predictor',
      },
      treatmentManagement: {
        selected: true,
        justification: 'Treatment modality affects survival',
      },
      followUpOutcomes: {
        selected: true,
        justification: 'Survival status and duration',
        subFields: { survivalStatus: true, survivalDuration: true },
      },
    },
    [DataFieldPreset.TREATMENT_COMPARISON]: {
      diagnosisClassification: {
        selected: true,
        justification: 'Diagnosis for treatment stratification',
      },
      stagingData: {
        selected: true,
        justification: 'Baseline staging for comparison groups',
      },
      treatmentManagement: {
        selected: true,
        justification: 'Treatment details for comparison',
      },
      followUpOutcomes: {
        selected: true,
        justification: 'Outcomes for treatment effectiveness comparison',
      },
    },
    [DataFieldPreset.CUSTOM]: {},
  };

  return presets[preset];
}
