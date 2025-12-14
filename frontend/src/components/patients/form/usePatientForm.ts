import { useState, useCallback } from 'react';

export interface PatientFormData {
  // Section 1: Center & Pathology Type
  centerId: string;
  pathologyType: string;
  consultantName?: string;
  residentName?: string;
  inputDate?: string;

  // Section 2: Patient Identity
  tumorRegistryNumber?: string;
  medicalRecordNumber: string;
  nik: string;
  name: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  bloodType?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
  postalCode?: string;
  emergencyContact?: any;

  // Section 3: Clinical Data
  chiefComplaint?: string;
  onsetDate?: string;
  symptomDuration?: number;
  presentingSymptoms?: string;
  tumorSizeAtPresentation?: number;
  cancerHistory?: string;
  familyHistoryCancer?: string;
  tumorSyndromeId?: string;
  karnofskysScore?: number;
  physicalExamGeneral?: string;
  physicalExamHeadNeck?: string;
  physicalExamThorax?: string;
  physicalExamAbdomen?: string;
  physicalExamExtremitiesSpine?: string;
  localTumorStatus?: string;

  // Section 4: Diagnostic Investigations
  biopsyDate?: string;
  biopsyType?: string;
  biopsyResult?: string;
  imagingStudies?: string;

  // Section 5: Diagnosis & Location
  whoBoneTumorId?: string;
  whoSoftTissueTumorId?: string;
  boneLocationId?: string;
  softTissueLocationId?: string;
  histopathologyGrade?: string;
  histopathologyDetails?: string;
  tumorSize?: string;
  tumorDepth?: string[];
  metastasisLung?: boolean;
  metastasisOther?: boolean;
  metastasisOtherSites?: string;
  noMetastasis?: boolean;
  diagnosisKomplikasi?: string;
  diagnosisKomorbid?: string;

  // Section 6: Staging
  ennekingStage?: string;
  ajccStage?: string;
  metastasisPresent?: boolean;
  metastasisSites?: string;

  // Section 7: CPC Conference
  cpcDate?: string;
  cpcAttendees?: string;
  cpcCaseSummary?: string;
  cpcRecommendedTreatment?: string;
  cpcTreatmentPlan?: string;
  cpcDecision?: string;
  cpcNotes?: string;
  cpcNextReviewDate?: string;
  attendingConsultants?: string[];

  // Section 8: Treatment Management
  treatmentStartDate?: string;
  treatmentEndDate?: string;
  surgeryDate?: string;
  surgeryType?: string;
  surgeryDetails?: string;
  chemotherapyProtocol?: string;
  chemotherapyCycles?: number;
  radiotherapyDose?: number;
  radiotherapyFractions?: number;
  treatmentResponse?: string;
  complications?: string;
  adverseEvents?: string;

  // Section 9: Follow-up Plan
  followUpSchedule?: string;
  nextFollowUpDate?: string;
  monitoringPlan?: string;
  imagingFollowUp?: string;
  labFollowUp?: string;
  qualityOfLife?: string;
  functionalStatus?: string;
  survivalStatus?: string;
  dateOfLastContact?: string;
}

export interface FormSection {
  number: number;
  title: string;
  completed: boolean;
}

export const usePatientForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({
    centerId: '',
    pathologyType: '',
    medicalRecordNumber: '',
    nik: '',
    name: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
  });

  const [sections, setSections] = useState<FormSection[]>([
    { number: 1, title: 'Center & Type', completed: false },
    { number: 2, title: 'Identity', completed: false },
    { number: 3, title: 'Clinical Data', completed: false },
    { number: 4, title: 'Diagnostics', completed: false },
    { number: 5, title: 'Diagnosis', completed: false },
    { number: 6, title: 'Staging', completed: false },
    { number: 7, title: 'CPC Conference', completed: false },
    { number: 8, title: 'Treatment', completed: false },
    { number: 9, title: 'Follow-up', completed: false },
    { number: 10, title: 'Review', completed: false },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<PatientFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const validateSection = useCallback(
    (sectionNumber: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (sectionNumber) {
        case 1:
          if (!formData.centerId) newErrors.centerId = 'Center is required';
          if (!formData.pathologyType) newErrors.pathologyType = 'Pathology type is required';
          break;

        case 2:
          if (!formData.medicalRecordNumber)
            newErrors.medicalRecordNumber = 'Medical record number is required';
          if (!formData.nik) newErrors.nik = 'NIK is required';
          if (formData.nik && formData.nik.length !== 16)
            newErrors.nik = 'NIK must be 16 digits';
          if (!formData.name) newErrors.name = 'Name is required';
          if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
          if (!formData.gender) newErrors.gender = 'Gender is required';
          break;

        case 3:
          // Optional fields, no validation required
          break;

        case 4:
          // Optional fields, no validation required
          break;

        case 5:
          // Conditional validation based on pathology type
          if (formData.pathologyType === 'bone_tumor' && !formData.whoBoneTumorId) {
            newErrors.whoBoneTumorId = 'WHO Bone Tumor classification is required';
          }
          if (formData.pathologyType === 'soft_tissue_tumor' && !formData.whoSoftTissueTumorId) {
            newErrors.whoSoftTissueTumorId = 'WHO Soft Tissue Tumor classification is required';
          }
          break;

        case 6:
          // Optional fields, no validation required
          break;

        default:
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    if (validateSection(currentStep)) {
      setSections((prev) =>
        prev.map((section) =>
          section.number === currentStep ? { ...section, completed: true } : section
        )
      );
      if (currentStep < 10) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, validateSection]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 10) {
      setCurrentStep(step);
    }
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      centerId: '',
      pathologyType: '',
      medicalRecordNumber: '',
      nik: '',
      name: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
    });
    setSections((prev) => prev.map((section) => ({ ...section, completed: false })));
    setErrors({});
  }, []);

  return {
    currentStep,
    formData,
    sections,
    errors,
    updateFormData,
    updateMultipleFields,
    validateSection,
    nextStep,
    previousStep,
    goToStep,
    resetForm,
  };
};
