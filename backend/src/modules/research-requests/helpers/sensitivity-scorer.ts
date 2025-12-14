import { DataFieldsSelectionDto } from '../dto/data-fields-selection.dto';

/**
 * Data sensitivity weights for each category
 * Higher weight = more sensitive data
 */
const SENSITIVITY_WEIGHTS = {
  demographics: 10, // Basic demographics (age, gender, region only) - LOW
  demographicsIdentifiable: 40, // NIK, full name, full address - VERY HIGH
  clinicalPresentation: 5, // Symptoms, Karnofsky score - LOW
  diagnosisClassification: 5, // WHO classification, tumor location - LOW
  stagingData: 5, // Enneking, AJCC staging - LOW
  diagnosticInvestigations: 10, // Biopsy, imaging results - MEDIUM
  treatmentManagement: 10, // Surgery, chemo, radio details - MEDIUM
  followUpOutcomes: 10, // Follow-up, MSTS scores, survival - MEDIUM
  clinicalPhotosImaging: 35, // Clinical photos and imaging files - VERY HIGH
  cpcRecords: 5, // CPC conference records - LOW
};

/**
 * Calculate data sensitivity score (0-100)
 *
 * Score ranges:
 * - 0-25: LOW sensitivity (non-identifiable clinical data only)
 * - 26-50: MEDIUM sensitivity (includes some identifiable data)
 * - 51-75: HIGH sensitivity (includes direct identifiers or photos)
 * - 76-100: VERY HIGH sensitivity (includes NIK/name + photos)
 *
 * @param dataFields - Selected data fields from research request
 * @returns Sensitivity score from 0 to 100
 */
export function calculateSensitivityScore(
  dataFields: DataFieldsSelectionDto,
): number {
  let totalScore = 0;
  let selectedCategories = 0;

  // Iterate through each category
  Object.entries(dataFields).forEach(([category, fieldData]) => {
    if (fieldData && fieldData.selected) {
      const weight = SENSITIVITY_WEIGHTS[category as keyof typeof SENSITIVITY_WEIGHTS] || 0;
      totalScore += weight;
      selectedCategories++;
    }
  });

  // If no categories selected, return 0
  if (selectedCategories === 0) {
    return 0;
  }

  // Ensure score doesn't exceed 100
  return Math.min(totalScore, 100);
}

/**
 * Get sensitivity level label based on score
 */
export function getSensitivityLevel(score: number): string {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'VERY HIGH';
}

/**
 * Check if request is eligible for auto-approval
 *
 * Criteria for auto-approval:
 * - Sensitivity score <= 25 (LOW)
 * - No identifiable demographics (NIK, full name, address)
 * - No clinical photos/imaging files
 * - IRB approved
 *
 * @param dataFields - Selected data fields
 * @param irbApproved - Whether IRB is already approved
 * @returns true if eligible for auto-approval
 */
export function isAutoApprovalEligible(
  dataFields: DataFieldsSelectionDto,
  irbApproved: boolean,
): boolean {
  const score = calculateSensitivityScore(dataFields);

  // Must have IRB approval
  if (!irbApproved) {
    return false;
  }

  // Must be LOW sensitivity (score <= 25)
  if (score > 25) {
    return false;
  }

  // Must NOT include identifiable demographics
  if (dataFields.demographicsIdentifiable?.selected) {
    return false;
  }

  // Must NOT include clinical photos/imaging
  if (dataFields.clinicalPhotosImaging?.selected) {
    return false;
  }

  return true;
}

/**
 * Get warnings for high-sensitivity data requests
 */
export function getSensitivityWarnings(
  dataFields: DataFieldsSelectionDto,
): string[] {
  const warnings: string[] = [];

  if (dataFields.demographicsIdentifiable?.selected) {
    warnings.push(
      'Request includes direct identifiers (NIK/Full Name/Address) - requires IRB approval and extra justification',
    );
  }

  if (dataFields.clinicalPhotosImaging?.selected) {
    warnings.push(
      'Request includes clinical photos/imaging files - requires patient consent verification and extra approval',
    );
  }

  const score = calculateSensitivityScore(dataFields);
  if (score > 75) {
    warnings.push(
      'This is a VERY HIGH sensitivity request - expect longer review time and possible additional requirements',
    );
  }

  return warnings;
}
