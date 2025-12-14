import { PrismaService } from '../../../database/prisma.service';

export interface ExportOptions {
  requestedDataFields: any;
  dataFilters: any;
  includeIdentifiableData: boolean;
  format: 'csv' | 'xlsx';
}

export interface ExportedData {
  patients: any[];
  totalCount: number;
  exportedFields: string[];
}

/**
 * Export patient data based on research request criteria
 * Handles data anonymization if identifiable data is not requested
 */
export async function exportPatientData(
  prisma: PrismaService,
  options: ExportOptions,
): Promise<ExportedData> {
  const { requestedDataFields, dataFilters, includeIdentifiableData } = options;

  // Build WHERE clause from dataFilters
  const whereClause: any = {
    isActive: true,
  };

  // Date range filter
  if (dataFilters.periodStart || dataFilters.periodEnd) {
    whereClause.createdAt = {};
    if (dataFilters.periodStart) {
      whereClause.createdAt.gte = new Date(dataFilters.periodStart);
    }
    if (dataFilters.periodEnd) {
      whereClause.createdAt.lte = new Date(dataFilters.periodEnd);
    }
  }

  // Age filter
  if (dataFilters.ageMin !== undefined || dataFilters.ageMax !== undefined) {
    const today = new Date();
    if (dataFilters.ageMax !== undefined) {
      const minBirthDate = new Date(
        today.getFullYear() - dataFilters.ageMax - 1,
        today.getMonth(),
        today.getDate(),
      );
      whereClause.dateOfBirth = { ...whereClause.dateOfBirth, gte: minBirthDate };
    }
    if (dataFilters.ageMin !== undefined) {
      const maxBirthDate = new Date(
        today.getFullYear() - dataFilters.ageMin,
        today.getMonth(),
        today.getDate(),
      );
      whereClause.dateOfBirth = { ...whereClause.dateOfBirth, lte: maxBirthDate };
    }
  }

  // Gender filter
  if (dataFilters.gender) {
    whereClause.gender = dataFilters.gender;
  }

  // Center filter
  if (dataFilters.centerId) {
    whereClause.centerId = dataFilters.centerId;
  }

  // Tumor type filter
  if (dataFilters.tumorType) {
    whereClause.tumorType = dataFilters.tumorType;
  }

  // WHO classification filters
  if (dataFilters.whoBoneTumorId) {
    whereClause.whoBoneTumorId = dataFilters.whoBoneTumorId;
  }
  if (dataFilters.whoSoftTissueTumorId) {
    whereClause.whoSoftTissueTumorId = dataFilters.whoSoftTissueTumorId;
  }

  // Staging filter
  if (dataFilters.ennekingStaging) {
    whereClause.ennekingStaging = dataFilters.ennekingStaging;
  }

  // Build SELECT clause based on requested data fields
  const selectFields: any = {
    id: true,
    createdAt: true,
    updatedAt: true,
  };

  const exportedFields: string[] = ['id', 'createdAt', 'updatedAt'];

  // Demographics (Basic)
  if (requestedDataFields.demographics?.selected) {
    selectFields.dateOfBirth = true;
    selectFields.gender = true;
    selectFields.province = true;
    selectFields.regency = true;
    selectFields.district = true;
    selectFields.village = true;
    exportedFields.push('age', 'gender', 'province', 'regency', 'district', 'village');
  }

  // Demographics Identifiable (NIK, Name) - ONLY if explicitly requested
  if (requestedDataFields.demographicsIdentifiable?.selected && includeIdentifiableData) {
    selectFields.nik = true;
    selectFields.fullName = true;
    selectFields.address = true;
    selectFields.phone = true;
    exportedFields.push('nik', 'fullName', 'address', 'phone');
  }

  // Clinical Presentation
  if (requestedDataFields.clinicalPresentation?.selected) {
    selectFields.karnofsky = true;
    selectFields.painVAS = true;
    selectFields.weight = true;
    selectFields.height = true;
    selectFields.bmi = true;
    exportedFields.push('karnofsky', 'painVAS', 'weight', 'height', 'bmi');
  }

  // Diagnosis & Classification
  if (requestedDataFields.diagnosisClassification?.selected) {
    selectFields.tumorType = true;
    selectFields.whoBoneTumorId = true;
    selectFields.whoSoftTissueTumorId = true;
    selectFields.boneLocationId = true;
    selectFields.softTissueLocationId = true;
    selectFields.tumorSyndromes = true;
    selectFields.whoBoneTumor = { select: { code: true, name: true } };
    selectFields.whoSoftTissueTumor = { select: { code: true, name: true } };
    selectFields.boneLocation = { select: { name: true, level: true } };
    selectFields.softTissueLocation = { select: { name: true, region: true } };
    exportedFields.push('tumorType', 'whoBoneTumor', 'whoSoftTissueTumor', 'boneLocation', 'softTissueLocation', 'tumorSyndromes');
  }

  // Staging Data
  if (requestedDataFields.stagingData?.selected) {
    selectFields.ennekingStaging = true;
    selectFields.ajccStaging = true;
    selectFields.tumorGrade = true;
    selectFields.tumorSize = true;
    selectFields.tumorDepth = true;
    selectFields.lymphNodeInvolvement = true;
    selectFields.metastasis = true;
    selectFields.metastasisSites = true;
    exportedFields.push('ennekingStaging', 'ajccStaging', 'tumorGrade', 'tumorSize', 'tumorDepth', 'lymphNodeInvolvement', 'metastasis', 'metastasisSites');
  }

  // Diagnostic Investigations
  if (requestedDataFields.diagnosticInvestigations?.selected) {
    selectFields.labAlp = true;
    selectFields.labLdh = true;
    selectFields.labCalcium = true;
    selectFields.labPhosphate = true;
    selectFields.radiologyXray = true;
    selectFields.radiologyMri = true;
    selectFields.radiologyCt = true;
    selectFields.radiologyBoneScan = true;
    selectFields.radiologyPet = true;
    selectFields.mirrelScore = true;
    selectFields.pathologyType = true;
    selectFields.huvosGrade = true;
    exportedFields.push('labAlp', 'labLdh', 'labCalcium', 'labPhosphate', 'radiologyXray', 'radiologyMri', 'radiologyCt', 'radiologyBoneScan', 'radiologyPet', 'mirrelScore', 'pathologyType', 'huvosGrade');
  }

  // Treatment Management
  if (requestedDataFields.treatmentManagement?.selected) {
    selectFields.surgeryType = true;
    selectFields.limbSalvagePerformed = true;
    selectFields.surgicalMargin = true;
    selectFields.reconstructionMethod = true;
    selectFields.chemotherapyType = true;
    selectFields.chemotherapyRegimen = true;
    selectFields.radiotherapyDose = true;
    selectFields.radiotherapyFractions = true;
    exportedFields.push('surgeryType', 'limbSalvagePerformed', 'surgicalMargin', 'reconstructionMethod', 'chemotherapyType', 'chemotherapyRegimen', 'radiotherapyDose', 'radiotherapyFractions');
  }

  // Follow-up & Outcomes
  if (requestedDataFields.followUpOutcomes?.selected) {
    selectFields.followUpVisits = true;
    selectFields.mstsScores = true;
    selectFields.recurrenceDetected = true;
    selectFields.recurrenceDate = true;
    selectFields.complicationsReported = true;
    selectFields.survivalStatus = true;
    selectFields.survivalDate = true;
    exportedFields.push('followUpVisits', 'mstsScores', 'recurrenceDetected', 'recurrenceDate', 'complicationsReported', 'survivalStatus', 'survivalDate');
  }

  // Clinical Photos/Imaging - Return URLs only if requested (no actual image data in export)
  if (requestedDataFields.clinicalPhotosImaging?.selected) {
    selectFields.clinicalPhotoUrls = true;
    selectFields.radiologyImageUrls = true;
    exportedFields.push('clinicalPhotoUrls', 'radiologyImageUrls');
  }

  // Always include center relationship
  selectFields.center = {
    select: {
      name: true,
      province: true,
      city: true,
    },
  };
  exportedFields.push('center');

  // Fetch patients with selected fields
  const patients = await prisma.patient.findMany({
    where: whereClause,
    select: selectFields,
  });

  // Anonymize data if identifiable data is NOT requested
  const anonymizedPatients = patients.map((patient) => {
    const anonymized = { ...patient };

    // Remove identifiable fields if not requested
    if (!includeIdentifiableData) {
      delete anonymized.nik;
      delete anonymized.fullName;
      delete anonymized.address;
      delete anonymized.phone;

      // Hash patient ID for anonymity
      anonymized.anonymousId = `ANON-${anonymized.id.substring(0, 8)}`;
      delete anonymized.id;
    }

    // Calculate age from dateOfBirth
    if (anonymized.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(anonymized.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      anonymized.age = age;

      // Remove exact birth date for privacy (keep age only)
      if (!includeIdentifiableData) {
        delete anonymized.dateOfBirth;
      }
    }

    return anonymized;
  });

  return {
    patients: anonymizedPatients,
    totalCount: anonymizedPatients.length,
    exportedFields,
  };
}

/**
 * Convert exported data to CSV format
 */
export function convertToCSV(data: ExportedData): string {
  if (data.patients.length === 0) {
    return '';
  }

  // Flatten nested objects for CSV
  const flattenedData = data.patients.map((patient) => {
    const flattened: any = {};

    Object.entries(patient).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Flatten nested objects (e.g., center, whoBoneTumor)
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          flattened[`${key}_${nestedKey}`] = nestedValue;
        });
      } else if (Array.isArray(value)) {
        // Convert arrays to JSON string
        flattened[key] = JSON.stringify(value);
      } else {
        flattened[key] = value;
      }
    });

    return flattened;
  });

  // Get all unique headers
  const headers = Array.from(
    new Set(flattenedData.flatMap((row) => Object.keys(row))),
  );

  // Build CSV string
  const csvRows = [
    headers.join(','), // Header row
    ...flattenedData.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape commas and quotes in values
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(','),
    ),
  ];

  return csvRows.join('\n');
}
