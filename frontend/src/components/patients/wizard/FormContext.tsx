import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

/**
 * FormContext - Centralized state management for multi-step wizard
 *
 * Features:
 * - Section-based data storage
 * - Auto-save to localStorage
 * - Draft management
 * - Validation state tracking
 * - Change history
 */

export interface SectionData {
  [key: string]: any;
}

export interface FormState {
  [sectionId: string]: SectionData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SectionValidation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FormContextValue {
  // Data management
  formData: FormState;
  updateSection: (sectionId: string, data: SectionData) => void;
  updateField: (sectionId: string, field: string, value: any) => void;
  getSection: (sectionId: string) => SectionData;
  getAllData: () => FormState;

  // Validation
  sectionValidation: { [sectionId: string]: SectionValidation };
  setSectionValidation: (sectionId: string, validation: SectionValidation) => void;

  // Draft management
  saveDraft: () => Promise<void>;
  loadDraft: () => void;
  clearDraft: () => void;
  lastSaved: Date | null;
  isDirty: boolean;

  // Auto-save control
  enableAutoSave: boolean;
  setEnableAutoSave: (enabled: boolean) => void;

  // Change tracking
  hasUnsavedChanges: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

interface FormProviderProps {
  children: React.ReactNode;
  autoSaveInterval?: number; // milliseconds, default 120000 (2 minutes)
  draftKey?: string; // localStorage key for draft, default 'patient-form-draft'
  onAutoSave?: (data: FormState) => Promise<void>; // Optional API auto-save
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  autoSaveInterval = 120000, // 2 minutes
  draftKey = 'patient-form-draft',
  onAutoSave,
}) => {
  const [formData, setFormData] = useState<FormState>({});
  const [sectionValidation, setSectionValidationState] = useState<{
    [sectionId: string]: SectionValidation;
  }>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [enableAutoSave, setEnableAutoSave] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDataRef = useRef<FormState>({});

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!enableAutoSave || !isDirty) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, isDirty, enableAutoSave, autoSaveInterval]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateSection = useCallback((sectionId: string, data: SectionData) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        ...data,
      },
    }));
    setIsDirty(true);
    setHasUnsavedChanges(true);
  }, []);

  const updateField = useCallback((sectionId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value,
      },
    }));
    setIsDirty(true);
    setHasUnsavedChanges(true);
  }, []);

  const getSection = useCallback((sectionId: string): SectionData => {
    return formData[sectionId] || {};
  }, [formData]);

  const getAllData = useCallback((): FormState => {
    return formData;
  }, [formData]);

  const setSectionValidation = useCallback((sectionId: string, validation: SectionValidation) => {
    setSectionValidationState((prev) => ({
      ...prev,
      [sectionId]: validation,
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    try {
      // Save to localStorage
      localStorage.setItem(draftKey, JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString(),
        validation: sectionValidation,
      }));

      // Optional API save
      if (onAutoSave) {
        await onAutoSave(formData);
      }

      setLastSaved(new Date());
      setIsDirty(false);

      console.log('Draft saved successfully at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [formData, sectionValidation, draftKey, onAutoSave]);

  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const { data, timestamp, validation } = JSON.parse(savedDraft);
        setFormData(data);
        setSectionValidationState(validation || {});
        setLastSaved(new Date(timestamp));
        initialDataRef.current = data;

        console.log('Draft loaded from', new Date(timestamp).toLocaleString());
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [draftKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    setFormData({});
    setSectionValidationState({});
    setLastSaved(null);
    setIsDirty(false);
    setHasUnsavedChanges(false);
    initialDataRef.current = {};
  }, [draftKey]);

  const value: FormContextValue = {
    formData,
    updateSection,
    updateField,
    getSection,
    getAllData,
    sectionValidation,
    setSectionValidation,
    saveDraft,
    loadDraft,
    clearDraft,
    lastSaved,
    isDirty,
    enableAutoSave,
    setEnableAutoSave,
    hasUnsavedChanges,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

/**
 * Hook to access form context
 * Must be used within FormProvider
 */
export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

/**
 * Hook for section-specific data management
 * Provides scoped access to a single section's data
 */
export const useSectionData = (sectionId: string) => {
  const {
    updateSection,
    updateField,
    getSection,
    sectionValidation,
    setSectionValidation,
  } = useFormContext();

  const sectionData = getSection(sectionId);
  const validation = sectionValidation[sectionId] || { isValid: true, errors: [] };

  const updateData = useCallback((data: SectionData) => {
    updateSection(sectionId, data);
  }, [sectionId, updateSection]);

  const updateSingleField = useCallback((field: string, value: any) => {
    updateField(sectionId, field, value);
  }, [sectionId, updateField]);

  const setValidation = useCallback((validation: SectionValidation) => {
    setSectionValidation(sectionId, validation);
  }, [sectionId, setSectionValidation]);

  return {
    data: sectionData,
    updateData,
    updateField: updateSingleField,
    validation,
    setValidation,
  };
};
