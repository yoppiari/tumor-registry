/**
 * ValidationUtils - Comprehensive validation utilities for form fields and sections
 *
 * Features:
 * - Field-level validators (email, phone, NIK, etc.)
 * - Section-level validation
 * - Cross-section validation
 * - Custom validation rules
 * - Indonesian-specific validators (NIK, phone numbers)
 */

import { SectionData, ValidationError, SectionValidation } from './FormContext';

// ============================================================================
// Field Validators
// ============================================================================

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string, fieldName: string = 'Email'): ValidationError | null => {
  if (!email) return null; // Allow empty if not required

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: fieldName,
      message: 'Invalid email format',
    };
  }
  return null;
};

/**
 * Validate Indonesian NIK (16 digits)
 */
export const validateNIK = (nik: string, fieldName: string = 'NIK'): ValidationError | null => {
  if (!nik) return null;

  // NIK must be exactly 16 digits
  const nikRegex = /^\d{16}$/;
  if (!nikRegex.test(nik)) {
    return {
      field: fieldName,
      message: 'NIK must be exactly 16 digits',
    };
  }
  return null;
};

/**
 * Validate Indonesian phone number
 */
export const validatePhoneNumber = (phone: string, fieldName: string = 'Phone Number'): ValidationError | null => {
  if (!phone) return null;

  // Indonesian phone: starts with 08 or +628, 10-13 digits
  const phoneRegex = /^(\+62|62|0)[8][0-9]{8,11}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    return {
      field: fieldName,
      message: 'Invalid Indonesian phone number format (e.g., 08123456789)',
    };
  }
  return null;
};

/**
 * Validate date format and range
 */
export const validateDate = (
  date: string,
  fieldName: string = 'Date',
  options?: {
    minDate?: Date;
    maxDate?: Date;
    futureAllowed?: boolean;
  }
): ValidationError | null => {
  if (!date) return null;

  const dateObj = new Date(date);

  // Check valid date
  if (isNaN(dateObj.getTime())) {
    return {
      field: fieldName,
      message: 'Invalid date format',
    };
  }

  // Check future dates
  if (options?.futureAllowed === false && dateObj > new Date()) {
    return {
      field: fieldName,
      message: 'Date cannot be in the future',
    };
  }

  // Check min date
  if (options?.minDate && dateObj < options.minDate) {
    return {
      field: fieldName,
      message: `Date must be after ${options.minDate.toLocaleDateString()}`,
    };
  }

  // Check max date
  if (options?.maxDate && dateObj > options.maxDate) {
    return {
      field: fieldName,
      message: `Date must be before ${options.maxDate.toLocaleDateString()}`,
    };
  }

  return null;
};

/**
 * Validate date of birth (not future, reasonable age range)
 */
export const validateDateOfBirth = (dob: string, fieldName: string = 'Date of Birth'): ValidationError | null => {
  if (!dob) return null;

  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();

  // Basic date validation
  const dateError = validateDate(dob, fieldName, { futureAllowed: false });
  if (dateError) return dateError;

  // Age range validation (0-150 years)
  if (age < 0 || age > 150) {
    return {
      field: fieldName,
      message: 'Please enter a valid date of birth',
    };
  }

  return null;
};

/**
 * Validate number within range
 */
export const validateNumber = (
  value: number | string,
  fieldName: string,
  options?: {
    min?: number;
    max?: number;
    integer?: boolean;
  }
): ValidationError | null => {
  if (value === null || value === undefined || value === '') return null;

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return {
      field: fieldName,
      message: 'Must be a valid number',
    };
  }

  if (options?.integer && !Number.isInteger(num)) {
    return {
      field: fieldName,
      message: 'Must be a whole number',
    };
  }

  if (options?.min !== undefined && num < options.min) {
    return {
      field: fieldName,
      message: `Must be at least ${options.min}`,
    };
  }

  if (options?.max !== undefined && num > options.max) {
    return {
      field: fieldName,
      message: `Must be no more than ${options.max}`,
    };
  }

  return null;
};

/**
 * Validate string length
 */
export const validateLength = (
  value: string,
  fieldName: string,
  options: {
    min?: number;
    max?: number;
    exact?: number;
  }
): ValidationError | null => {
  if (!value) return null;

  if (options.exact && value.length !== options.exact) {
    return {
      field: fieldName,
      message: `Must be exactly ${options.exact} characters`,
    };
  }

  if (options.min !== undefined && value.length < options.min) {
    return {
      field: fieldName,
      message: `Must be at least ${options.min} characters`,
    };
  }

  if (options.max !== undefined && value.length > options.max) {
    return {
      field: fieldName,
      message: `Must be no more than ${options.max} characters`,
    };
  }

  return null;
};

/**
 * Validate Karnofsky Performance Score (0-100, increments of 10)
 */
export const validateKarnofskyScore = (score: number | string, fieldName: string = 'Karnofsky Score'): ValidationError | null => {
  if (!score) return null;

  const num = typeof score === 'string' ? parseInt(score) : score;

  if (isNaN(num) || num < 0 || num > 100) {
    return {
      field: fieldName,
      message: 'Karnofsky score must be between 0 and 100',
    };
  }

  if (num % 10 !== 0) {
    return {
      field: fieldName,
      message: 'Karnofsky score must be in increments of 10',
    };
  }

  return null;
};

/**
 * Validate medical record number format
 */
export const validateMedicalRecordNumber = (mrn: string, fieldName: string = 'Medical Record Number'): ValidationError | null => {
  if (!mrn) return null;

  // At least 6 characters, alphanumeric
  if (mrn.length < 6) {
    return {
      field: fieldName,
      message: 'Medical record number must be at least 6 characters',
    };
  }

  return null;
};

// ============================================================================
// Section Validators
// ============================================================================

/**
 * Validate Section 1: Center & Pathology Type
 */
export const validateSection1 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  const centerError = validateRequired(data.centerId, 'Center');
  if (centerError) errors.push(centerError);

  const pathologyError = validateRequired(data.pathologyType, 'Pathology Type');
  if (pathologyError) errors.push(pathologyError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 2: Patient Identity
 */
export const validateSection2 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Required fields
  const mrnError = validateRequired(data.medicalRecordNumber, 'Medical Record Number');
  if (mrnError) errors.push(mrnError);
  else {
    const mrnFormatError = validateMedicalRecordNumber(data.medicalRecordNumber);
    if (mrnFormatError) errors.push(mrnFormatError);
  }

  const nikError = validateRequired(data.nik, 'NIK');
  if (nikError) errors.push(nikError);
  else {
    const nikFormatError = validateNIK(data.nik);
    if (nikFormatError) errors.push(nikFormatError);
  }

  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.push(nameError);

  const dobError = validateRequired(data.dateOfBirth, 'Date of Birth');
  if (dobError) errors.push(dobError);
  else {
    const dobFormatError = validateDateOfBirth(data.dateOfBirth);
    if (dobFormatError) errors.push(dobFormatError);
  }

  const genderError = validateRequired(data.gender, 'Gender');
  if (genderError) errors.push(genderError);

  // Optional but validated if present
  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);
  }

  if (data.phoneNumber) {
    const phoneError = validatePhoneNumber(data.phoneNumber);
    if (phoneError) errors.push(phoneError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 3: Clinical Data
 */
export const validateSection3 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Optional section, but validate format if provided
  if (data.karnofskysScore) {
    const karnofskyError = validateKarnofskyScore(data.karnofskysScore);
    if (karnofskyError) errors.push(karnofskyError);
  }

  if (data.onsetDate) {
    const dateError = validateDate(data.onsetDate, 'Onset Date', { futureAllowed: false });
    if (dateError) errors.push(dateError);
  }

  if (data.tumorSizeAtPresentation) {
    const sizeError = validateNumber(data.tumorSizeAtPresentation, 'Tumor Size', { min: 0 });
    if (sizeError) errors.push(sizeError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 4: Diagnostic Investigations
 */
export const validateSection4 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Optional section, validate dates if provided
  if (data.biopsyDate) {
    const dateError = validateDate(data.biopsyDate, 'Biopsy Date', { futureAllowed: false });
    if (dateError) errors.push(dateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 5: Diagnosis & Location
 * Conditional based on pathology type
 */
export const validateSection5 = (data: SectionData, section1Data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];
  const pathologyType = section1Data.pathologyType;

  // Conditional validation based on pathology type
  if (pathologyType === 'bone_tumor' || pathologyType === 'BONE_TUMOR') {
    const boneError = validateRequired(data.whoBoneTumorId, 'WHO Bone Tumor Classification');
    if (boneError) errors.push(boneError);

    const locationError = validateRequired(data.boneLocationId, 'Bone Location');
    if (locationError) errors.push(locationError);
  }

  if (pathologyType === 'soft_tissue_tumor' || pathologyType === 'SOFT_TISSUE_TUMOR') {
    const softTissueError = validateRequired(data.whoSoftTissueTumorId, 'WHO Soft Tissue Tumor Classification');
    if (softTissueError) errors.push(softTissueError);

    const locationError = validateRequired(data.softTissueLocationId, 'Soft Tissue Location');
    if (locationError) errors.push(locationError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 6: Staging
 */
export const validateSection6 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Enneking Stage or AJCC Stage required
  if (!data.ennekingStage && !data.ajccStage) {
    errors.push({
      field: 'staging',
      message: 'Staging: Minimal satu staging system (Enneking atau AJCC) harus diisi',
    });
  }

  // Histopathology Grade required
  if (!data.histopathologyGrade) {
    errors.push({
      field: 'histopathologyGrade',
      message: 'Histopathology Grade harus diisi',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 7: CPC (Clinico-Pathological Conference)
 * Simple validation - 3 fields: Tanggal, Konsultan hadir, Keputusan
 */
export const validateSection7 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  // Validate date if filled
  if (data.cpcDate) {
    const dateError = validateDate(data.cpcDate, 'Tanggal CPC', { futureAllowed: false });
    if (dateError) errors.push(dateError);
  }

  // CPC is optional, but if date is filled, consultants and decision should be filled
  if (data.cpcDate) {
    if (!data.consultantsPresent) {
      errors.push({
        field: 'consultantsPresent',
        message: 'Jika tanggal CPC diisi, daftar konsultan hadir harus diisi',
      });
    }
    if (!data.decision) {
      errors.push({
        field: 'decision',
        message: 'Jika tanggal CPC diisi, keputusan CPC harus diisi',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 8: Treatment Management
 * Comprehensive validation for surgical, chemotherapy, and radiotherapy components
 */
export const validateSection8 = (data: any): SectionValidation => {
  const errors: ValidationError[] = [];

  // Treatment intention required
  if (!data.treatmentIntention) {
    errors.push({
      field: 'treatmentIntention',
      message: 'Treatment Intention (Curative/Palliative) harus diisi',
    });
  }

  // Primary treatment modality required
  if (!data.primaryTreatment) {
    errors.push({
      field: 'primaryTreatment',
      message: 'Modalitas pengobatan primer harus dipilih',
    });
  }

  // If surgery is primary treatment, validate surgical fields
  if (data.primaryTreatment === 'SURGERY' || data.primaryTreatment === 'MULTIMODAL') {
    if (!data.surgery?.limbSalvageStatus) {
      errors.push({
        field: 'limbSalvageStatus',
        message: 'Limb Salvage Status HARUS diisi untuk pembedahan',
      });
    }

    if (!data.surgery?.surgeryDate) {
      errors.push({
        field: 'surgeryDate',
        message: 'Tanggal operasi harus diisi',
      });
    } else {
      const dateError = validateDate(data.surgery.surgeryDate, 'Surgery Date', { futureAllowed: false });
      if (dateError) errors.push(dateError);
    }

    if (!data.surgery?.surgeryType) {
      errors.push({
        field: 'surgeryType',
        message: 'Jenis operasi harus diisi',
      });
    }

    // Surgery duration validation
    if (data.surgery?.surgeryDuration) {
      const durationError = validateNumber(data.surgery.surgeryDuration, 'Surgery Duration', { min: 1, max: 1440 });
      if (durationError) errors.push(durationError);
    }

    // Blood loss validation
    if (data.surgery?.bloodLoss) {
      const bloodLossError = validateNumber(data.surgery.bloodLoss, 'Blood Loss', { min: 0, max: 50000 });
      if (bloodLossError) errors.push(bloodLossError);
    }

    // If LIMB_SALVAGE, technique required
    if (data.surgery?.limbSalvageStatus === 'LIMB_SALVAGE' && !data.surgery?.limbSalvageTechnique) {
      errors.push({
        field: 'limbSalvageTechnique',
        message: 'Teknik rekonstruksi harus diisi untuk Limb Salvage',
      });
    }

    // If AMPUTATION, level and reason required
    if (data.surgery?.limbSalvageStatus === 'AMPUTATION') {
      if (!data.surgery?.amputationLevel) {
        errors.push({
          field: 'amputationLevel',
          message: 'Level amputasi harus diisi',
        });
      }
      if (!data.surgery?.amputationReason) {
        errors.push({
          field: 'amputationReason',
          message: 'Alasan amputasi harus diisi',
        });
      }
    }

    // Surgical margin required
    if (!data.surgery?.surgicalMargin) {
      errors.push({
        field: 'surgicalMargin',
        message: 'Status margin bedah harus diisi',
      });
    }

    // Margin distance validation
    if (data.surgery?.marginDistance) {
      const marginError = validateNumber(data.surgery.marginDistance, 'Margin Distance', { min: 0, max: 1000 });
      if (marginError) errors.push(marginError);
    }
  }

  // If chemotherapy received, validate protocols
  if (data.chemotherapy?.received) {
    if (!data.chemotherapy?.timing) {
      errors.push({
        field: 'chemotherapyTiming',
        message: 'Timing kemoterapi harus diisi',
      });
    }

    // Validate chemotherapy dates
    if (data.chemotherapy?.neoadjuvantStartDate) {
      const dateError = validateDate(data.chemotherapy.neoadjuvantStartDate, 'Neoadjuvant Start Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    if (data.chemotherapy?.neoadjuvantEndDate) {
      const dateError = validateDate(data.chemotherapy.neoadjuvantEndDate, 'Neoadjuvant End Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    if (data.chemotherapy?.adjuvantStartDate) {
      const dateError = validateDate(data.chemotherapy.adjuvantStartDate, 'Adjuvant Start Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    if (data.chemotherapy?.adjuvantEndDate) {
      const dateError = validateDate(data.chemotherapy.adjuvantEndDate, 'Adjuvant End Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    // Validate cycles
    if (data.chemotherapy?.neoadjuvantCycles) {
      const cyclesError = validateNumber(data.chemotherapy.neoadjuvantCycles, 'Neoadjuvant Cycles', { min: 1, max: 50, integer: true });
      if (cyclesError) errors.push(cyclesError);
    }

    if (data.chemotherapy?.adjuvantCycles) {
      const cyclesError = validateNumber(data.chemotherapy.adjuvantCycles, 'Adjuvant Cycles', { min: 1, max: 50, integer: true });
      if (cyclesError) errors.push(cyclesError);
    }
  }

  // If radiation received, validate doses
  if (data.radiation?.received) {
    // Validate radiation dates
    if (data.radiation?.startDate) {
      const dateError = validateDate(data.radiation.startDate, 'Radiation Start Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    if (data.radiation?.endDate) {
      const dateError = validateDate(data.radiation.endDate, 'Radiation End Date', { futureAllowed: true });
      if (dateError) errors.push(dateError);
    }

    // Validate dose and fractions
    if (data.radiation?.totalDose) {
      const doseError = validateNumber(data.radiation.totalDose, 'Radiation Dose', { min: 0, max: 200 });
      if (doseError) errors.push(doseError);
    }

    if (data.radiation?.fractions) {
      const fractionsError = validateNumber(data.radiation.fractions, 'Radiation Fractions', { min: 1, max: 100, integer: true });
      if (fractionsError) errors.push(fractionsError);
    }
  }

  // Analgesia date validation
  if (data.analgesiaStartDate) {
    const dateError = validateDate(data.analgesiaStartDate, 'Analgesia Start Date', { futureAllowed: false });
    if (dateError) errors.push(dateError);
  }

  // Treatment start date validation
  if (data.treatmentStartDate) {
    const dateError = validateDate(data.treatmentStartDate, 'Treatment Start Date', { futureAllowed: true });
    if (dateError) errors.push(dateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate Section 9: Follow-up Plan
 */
export const validateSection9 = (data: SectionData): SectionValidation => {
  const errors: ValidationError[] = [];

  if (data.nextFollowUpDate) {
    const dateError = validateDate(data.nextFollowUpDate, 'Next Follow-up Date', { futureAllowed: true });
    if (dateError) errors.push(dateError);
  }

  if (data.dateOfLastContact) {
    const dateError = validateDate(data.dateOfLastContact, 'Date of Last Contact', { futureAllowed: false });
    if (dateError) errors.push(dateError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Cross-section validation
 * Validates relationships between different sections
 */
export const validateCrossSections = (allData: { [sectionId: string]: SectionData }): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Example: Treatment start date should be after diagnosis date
  const section3 = allData['section3'] || {};
  const section8 = allData['section8'] || {};

  if (section3.onsetDate && section8.treatmentStartDate) {
    const onsetDate = new Date(section3.onsetDate);
    const treatmentDate = new Date(section8.treatmentStartDate);

    if (treatmentDate < onsetDate) {
      errors.push({
        field: 'treatmentStartDate',
        message: 'Treatment start date cannot be before symptom onset date',
      });
    }
  }

  // Example: Surgery date should be after biopsy date
  const section4 = allData['section4'] || {};

  if (section4.biopsyDate && section8.surgeryDate) {
    const biopsyDate = new Date(section4.biopsyDate);
    const surgeryDate = new Date(section8.surgeryDate);

    if (surgeryDate < biopsyDate) {
      errors.push({
        field: 'surgeryDate',
        message: 'Surgery date cannot be before biopsy date',
      });
    }
  }

  return errors;
};

/**
 * Master validation function for entire form
 */
export const validateAllSections = (allData: { [sectionId: string]: SectionData }): {
  isValid: boolean;
  sectionValidations: { [sectionId: string]: SectionValidation };
  crossSectionErrors: ValidationError[];
} => {
  const section1 = allData['section1'] || {};
  const section2 = allData['section2'] || {};
  const section3 = allData['section3'] || {};
  const section4 = allData['section4'] || {};
  const section5 = allData['section5'] || {};
  const section6 = allData['section6'] || {};
  const section7 = allData['section7'] || {};
  const section8 = allData['section8'] || {};
  const section9 = allData['section9'] || {};

  const sectionValidations = {
    section1: validateSection1(section1),
    section2: validateSection2(section2),
    section3: validateSection3(section3),
    section4: validateSection4(section4),
    section5: validateSection5(section5, section1),
    section6: validateSection6(section6),
    section7: validateSection7(section7),
    section8: validateSection8(section8),
    section9: validateSection9(section9),
  };

  const crossSectionErrors = validateCrossSections(allData);

  const allValid = Object.values(sectionValidations).every(v => v.isValid) && crossSectionErrors.length === 0;

  return {
    isValid: allValid,
    sectionValidations,
    crossSectionErrors,
  };
};
