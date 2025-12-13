/**
 * Advanced Example: Multi-step form with custom validation and persistence
 *
 * This example demonstrates advanced features including:
 * - Multi-step wizard
 * - Form state persistence to localStorage
 * - Custom validation rules
 * - Dynamic tumor type switching
 */

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { WhoClassificationTree, WhoClassification, useWhoClassifications } from '../index';

interface PatientDiagnosisData {
  // Step 1: Patient Info
  patientId: string;
  patientName: string;

  // Step 2: Tumor Type
  tumorType: 'BONE' | 'SOFT_TISSUE';

  // Step 3: Classification
  classificationId: string;
  diagnosisDate: string;

  // Step 4: Additional Details
  stage?: string;
  grade?: string;
  notes?: string;
}

const STORAGE_KEY = 'diagnosis_form_draft';

export function AdvancedExample() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClassification, setSelectedClassification] = useState<WhoClassification | null>(
    null
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PatientDiagnosisData>({
    defaultValues: {
      tumorType: 'BONE',
    },
  });

  const tumorType = watch('tumorType');
  const classificationId = watch('classificationId');

  // Load classification data
  const { getById } = useWhoClassifications({ tumorType });

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key as keyof PatientDiagnosisData, value as any);
      });
    }
  }, [setValue]);

  // Save draft to localStorage on changes
  useEffect(() => {
    const subscription = watch((formData) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Update selected classification when ID changes
  useEffect(() => {
    if (classificationId && getById) {
      const classification = getById(classificationId);
      setSelectedClassification(classification || null);
    }
  }, [classificationId, getById]);

  const onSubmit = async (data: PatientDiagnosisData) => {
    console.log('Final submission:', data);

    // Clear draft
    localStorage.removeItem(STORAGE_KEY);

    alert('Diagnosis successfully saved!');
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, name: 'Patient Info', description: 'Enter patient details' },
    { number: 2, name: 'Tumor Type', description: 'Select tumor type' },
    { number: 3, name: 'Classification', description: 'Select WHO classification' },
    { number: 4, name: 'Details', description: 'Additional information' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Advanced Diagnosis Entry Wizard
      </h1>

      {/* Progress Steps */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-900">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Patient Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID <span className="text-red-600">*</span>
              </label>
              <Controller
                name="patientId"
                control={control}
                rules={{ required: 'Patient ID is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="e.g., P-2024-001"
                  />
                )}
              />
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="patientName"
                control={control}
                rules={{ required: 'Patient name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              />
              {errors.patientName && (
                <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Tumor Type */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Tumor Type</h2>
            <Controller
              name="tumorType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange('BONE');
                      setValue('classificationId', '');
                    }}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      field.value === 'BONE'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Bone Tumor</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      WHO Classification of Bone Tumours
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      field.onChange('SOFT_TISSUE');
                      setValue('classificationId', '');
                    }}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      field.value === 'SOFT_TISSUE'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Soft Tissue Tumor</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      WHO Classification of Soft Tissue Tumours
                    </p>
                  </button>
                </div>
              )}
            />
          </div>
        )}

        {/* Step 3: Classification */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Classification</h2>
            <Controller
              name="classificationId"
              control={control}
              rules={{ required: 'Classification is required' }}
              render={({ field }) => (
                <WhoClassificationTree
                  tumorType={tumorType}
                  selectedId={field.value}
                  onSelect={(classification) => field.onChange(classification.id)}
                />
              )}
            />
            {errors.classificationId && (
              <p className="mt-2 text-sm text-red-600">{errors.classificationId.message}</p>
            )}
          </div>
        )}

        {/* Step 4: Additional Details */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>

            {/* Review Selection */}
            {selectedClassification && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-blue-900">Selected Classification</h3>
                <p className="mt-1 text-sm text-blue-800">{selectedClassification.name}</p>
                <p className="mt-0.5 text-xs text-blue-700">
                  {selectedClassification.category}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="diagnosisDate"
                control={control}
                rules={{ required: 'Diagnosis date is required' }}
                render={({ field }) => (
                  <input {...field} type="date" className="block w-full rounded-md border border-gray-300 px-3 py-2" />
                )}
              />
              {errors.diagnosisDate && (
                <p className="mt-1 text-sm text-red-600">{errors.diagnosisDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea {...field} rows={4} className="block w-full rounded-md border border-gray-300 px-3 py-2" />
                )}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Submit Diagnosis
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
