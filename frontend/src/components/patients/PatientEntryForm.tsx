'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePatient } from '@/contexts/PatientContext';
import {
  closeQuestionsConfig,
  openQuestionsConfig,
  validateSection,
  FormSection,
  FormField,
} from '@/config/patientFormConfig';

type EntryMode = 'quick' | 'full';

interface PatientEntryFormProps {
  onSuccess?: () => void;
}

export default function PatientEntryForm({ onSuccess }: PatientEntryFormProps) {
  const { user } = useAuth();
  const { createPatient, isLoading } = usePatient();

  // Form state
  const [mode, setMode] = useState<EntryMode>('quick');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get sections based on mode
  const getSections = (): FormSection[] => {
    if (mode === 'quick') {
      return closeQuestionsConfig;
    }
    return [...closeQuestionsConfig, ...openQuestionsConfig];
  };

  const sections = getSections();
  const totalSteps = sections.length;
  const currentSection = sections[currentStep];

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleAutoSave();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges]);

  const handleAutoSave = useCallback(() => {
    // Save to localStorage
    const draftKey = `patient-draft-${user?.id || 'guest'}`;
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        mode,
        currentStep,
        formData,
        timestamp: new Date().toISOString(),
      })
    );
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    console.log('📝 Draft auto-saved');
  }, [formData, mode, currentStep, user]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `patient-draft-${user?.id || 'guest'}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();

        // Only load if draft is less than 24 hours old
        if (draftAge < 24 * 60 * 60 * 1000) {
          const shouldLoad = window.confirm(
            'Ditemukan draft yang tersimpan. Lanjutkan dari draft?'
          );

          if (shouldLoad) {
            setMode(draft.mode);
            setCurrentStep(draft.currentStep);
            setFormData(draft.formData);
            setLastSaved(new Date(draft.timestamp));
          }
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [user]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleModeSwitch = (newMode: EntryMode) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(
        'Ada perubahan yang belum tersimpan. Simpan draft terlebih dahulu?'
      );
      if (confirm) {
        handleAutoSave();
      }
    }

    setMode(newMode);
    setCurrentStep(0);
  };

  const handleNext = () => {
    // Validate current section before moving forward
    const sectionErrors = validateSection(currentSection, formData);

    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Validate current section
    const sectionErrors = validateSection(currentSection, formData);

    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Transform form data to CreatePatientDto format
      const patientData = transformFormDataToDto(formData);

      await createPatient(patientData);

      // Clear draft
      const draftKey = `patient-draft-${user?.id || 'guest'}`;
      localStorage.removeItem(draftKey);

      alert('✅ Data pasien berhasil disimpan!');

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/patients';
      }
    } catch (error) {
      console.error('Failed to create patient:', error);
      alert('❌ Gagal menyimpan data pasien. Silakan coba lagi.');
    }
  };

  const transformFormDataToDto = (data: Record<string, any>) => {
    return {
      medicalRecordNumber: data.medicalRecordNumber || `RM-${Date.now()}`,
      identityNumber: data.identityNumber,
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodType: data.bloodType,
      rhFactor: data.rhFactor,
      phone: data.phone,
      email: data.email,
      address: {
        street: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      },
      emergencyContact: {
        name: data.emergencyContactName || '',
        relationship: (data.emergencyContactRelationship || 'other') as any,
        phone: data.emergencyContactPhone || '',
      },
      occupation: data.occupation,
      educationLevel: data.educationLevel,
      maritalStatus: data.maritalStatus,
      primaryCancerDiagnosis: {
        primarySite: data.primarySite,
        laterality: data.laterality,
        morphology: data.morphologyCode || '',
        behavior: 'invasive' as any,
      },
      cancerStage: data.cancerStage,
      cancerGrade: data.cancerGrade,
      tnmClassification: data.tnm_t || data.tnm_n || data.tnm_m ? {
        t: data.tnm_t || '',
        n: data.tnm_n || '',
        m: data.tnm_m || '',
      } : undefined,
      treatmentStatus: data.treatmentStatus,
      dateOfDiagnosis: data.dateOfDiagnosis,
      dateOfFirstVisit: data.dateOfFirstVisit,
      treatmentCenter: data.treatmentCenter,
    };
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    const fieldClasses = `
      w-full px-4 py-2 border rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500
      ${error ? 'border-red-500' : 'border-gray-300'}
    `;

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'tel':
      case 'email':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={fieldClasses}
            />
            {field.helpText && !error && (
              <p className="text-xs text-gray-500 mt-1">💡 {field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={fieldClasses}
            />
            {field.helpText && !error && (
              <p className="text-xs text-gray-500 mt-1">💡 {field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={fieldClasses}
            >
              <option value="">-- Pilih {field.label} --</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && !error && (
              <p className="text-xs text-gray-500 mt-1">💡 {field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {field.helpText && !error && (
              <p className="text-xs text-gray-500 mt-2">💡 {field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-2">⚠️ {error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mode Input Data</h3>
            <p className="text-sm text-gray-600">
              {mode === 'quick'
                ? 'Quick Capture - Data essential untuk database nasional'
                : 'Full Detail - Data lengkap termasuk riwayat medis'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeSwitch('quick')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'quick'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ⚡ Quick Capture
            </button>
            <button
              onClick={() => handleModeSwitch('full')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'full'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Full Detail
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {totalSteps}: {currentSection.title}
          </span>
          <span className="text-sm font-medium text-green-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {sections.map((section, index) => (
            <div key={section.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < currentStep
                    ? 'bg-green-600 text-white'
                    : index === currentStep
                    ? 'bg-green-600 text-white ring-4 ring-green-200'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs text-gray-600 mt-1 text-center hidden md:block">
                {section.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentSection.title}
        </h2>
        {currentSection.description && (
          <p className="text-gray-600 mb-6">{currentSection.description}</p>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {currentSection.fields.map(field => renderField(field))}
        </div>

        {/* Auto-save indicator */}
        {lastSaved && (
          <div className="mt-6 text-sm text-gray-500 flex items-center">
            <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Draft tersimpan otomatis {new Date(lastSaved).toLocaleTimeString('id-ID')}
          </div>
        )}
        {hasUnsavedChanges && (
          <div className="mt-6 text-sm text-orange-600 flex items-center">
            <svg className="h-4 w-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ada perubahan yang belum tersimpan (auto-save dalam 10 detik)
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ← Kembali
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleAutoSave}
            className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
          >
            💾 Simpan Draft
          </button>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Lanjut →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                '✓ Submit Data Pasien'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
