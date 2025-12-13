/**
 * Form Integration Example: Using WHO Classification Tree with React Hook Form
 *
 * This example shows how to integrate the classification tree with react-hook-form
 * for complete form validation and submission.
 */

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BoneTumorTree, SoftTissueTumorTree, WhoClassification } from '../index';

interface DiagnosisFormData {
  tumorType: 'BONE' | 'SOFT_TISSUE';
  classificationId: string;
  diagnosisDate: string;
  notes?: string;
}

export function FormIntegrationExample() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DiagnosisFormData>({
    defaultValues: {
      tumorType: 'BONE',
    },
  });

  const tumorType = watch('tumorType');

  const onSubmit = async (data: DiagnosisFormData) => {
    console.log('Form submitted:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(`Diagnosis saved!\nType: ${data.tumorType}\nID: ${data.classificationId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Diagnosis Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tumor Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tumor Type <span className="text-red-600">*</span>
          </label>
          <Controller
            name="tumorType"
            control={control}
            rules={{ required: 'Tumor type is required' }}
            render={({ field }) => (
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="BONE"
                    checked={field.value === 'BONE'}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="mr-2"
                  />
                  Bone Tumor
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="SOFT_TISSUE"
                    checked={field.value === 'SOFT_TISSUE'}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="mr-2"
                  />
                  Soft Tissue Tumor
                </label>
              </div>
            )}
          />
          {errors.tumorType && (
            <p className="mt-1 text-sm text-red-600">{errors.tumorType.message}</p>
          )}
        </div>

        {/* WHO Classification Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WHO Classification <span className="text-red-600">*</span>
          </label>
          <Controller
            name="classificationId"
            control={control}
            rules={{ required: 'Please select a tumor classification' }}
            render={({ field }) => (
              <div>
                {tumorType === 'BONE' ? (
                  <BoneTumorTree
                    selectedId={field.value}
                    onSelect={(classification: WhoClassification) => {
                      field.onChange(classification.id);
                    }}
                  />
                ) : (
                  <SoftTissueTumorTree
                    selectedId={field.value}
                    onSelect={(classification: WhoClassification) => {
                      field.onChange(classification.id);
                    }}
                  />
                )}
              </div>
            )}
          />
          {errors.classificationId && (
            <p className="mt-2 text-sm text-red-600">{errors.classificationId.message}</p>
          )}
        </div>

        {/* Diagnosis Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis Date <span className="text-red-600">*</span>
          </label>
          <Controller
            name="diagnosisDate"
            control={control}
            rules={{ required: 'Diagnosis date is required' }}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          />
          {errors.diagnosisDate && (
            <p className="mt-1 text-sm text-red-600">{errors.diagnosisDate.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter any additional notes about the diagnosis..."
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Diagnosis'}
          </button>
        </div>
      </form>
    </div>
  );
}
