import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from './FormContext';
import { SectionData, ValidationError, SectionValidation } from './FormContext';

/**
 * MultiStepWizard - Reusable multi-step form wizard component
 *
 * Features:
 * - Section navigation (Next/Previous)
 * - Progress tracking
 * - Auto-save functionality
 * - Validation before advancing
 * - Conditional section rendering
 * - Review mode
 * - Loading states
 */

export interface SectionProps {
  data: SectionData;
  updateData: (data: SectionData) => void;
  updateField: (field: string, value: any) => void;
  errors: ValidationError[];
  isActive: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<SectionProps>;
  isOptional?: boolean;
  validate?: (data: SectionData, allData?: any) => Promise<SectionValidation> | SectionValidation;
  shouldRender?: (allData: any) => boolean; // Conditional rendering
}

export interface MultiStepWizardProps {
  sections: Section[];
  onComplete: (data: any) => Promise<void>;
  onSaveDraft?: (data: any) => Promise<void>;
  autoSaveInterval?: number; // milliseconds
  showSidebar?: boolean;
  className?: string;
}

export const MultiStepWizard: React.FC<MultiStepWizardProps> = ({
  sections,
  onComplete,
  onSaveDraft,
  autoSaveInterval = 120000,
  showSidebar = true,
  className = '',
}) => {
  const {
    getAllData,
    getSection,
    updateSection,
    updateField: updateFormField,
    sectionValidation,
    setSectionValidation,
    saveDraft,
    lastSaved,
    isDirty,
    hasUnsavedChanges,
  } = useFormContext();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Filter sections based on conditional rendering
  const visibleSections = sections.filter(section => {
    if (!section.shouldRender) return true;
    return section.shouldRender(getAllData());
  });

  const currentSection = visibleSections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === visibleSections.length - 1;

  // Get current section data and validation
  const currentSectionData = getSection(currentSection.id);
  const currentValidation = sectionValidation[currentSection.id] || { isValid: true, errors: [] };

  // Auto-save effect
  useEffect(() => {
    if (isDirty && onSaveDraft) {
      const timer = setTimeout(async () => {
        try {
          await onSaveDraft(getAllData());
          await saveDraft();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, autoSaveInterval);

      return () => clearTimeout(timer);
    }
  }, [isDirty, getAllData, onSaveDraft, autoSaveInterval, saveDraft]);

  /**
   * Validate current section before proceeding
   */
  const validateCurrentSection = async (): Promise<boolean> => {
    if (!currentSection.validate) {
      // No validation required, mark as valid
      setSectionValidation(currentSection.id, { isValid: true, errors: [] });
      return true;
    }

    setIsValidating(true);
    try {
      const validation = await Promise.resolve(
        currentSection.validate(currentSectionData, getAllData())
      );

      setSectionValidation(currentSection.id, validation);
      setIsValidating(false);

      return validation.isValid;
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidating(false);
      return false;
    }
  };

  /**
   * Navigate to next section
   */
  const handleNext = async () => {
    const isValid = await validateCurrentSection();

    if (isValid || currentSection.isOptional) {
      if (isValid) {
        setCompletedSections(prev => new Set(prev).add(currentSection.id));
      }
      setCurrentSectionIndex(prev => Math.min(prev + 1, visibleSections.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Show error notification
      console.warn('Validation failed for section:', currentSection.id);
    }
  };

  /**
   * Navigate to previous section
   */
  const handlePrevious = () => {
    setCurrentSectionIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Jump to specific section
   */
  const handleGoToSection = (sectionId: string) => {
    const index = visibleSections.findIndex(s => s.id === sectionId);
    if (index !== -1) {
      setCurrentSectionIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Manual save draft
   */
  const handleSaveDraft = async () => {
    try {
      if (onSaveDraft) {
        await onSaveDraft(getAllData());
      }
      await saveDraft();
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Save draft failed:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  /**
   * Submit entire form
   */
  const handleSubmit = async () => {
    // Validate all sections
    setIsValidating(true);
    let allValid = true;

    for (const section of visibleSections) {
      if (section.validate) {
        const sectionData = getSection(section.id);
        const validation = await Promise.resolve(section.validate(sectionData, getAllData()));
        setSectionValidation(section.id, validation);

        if (!validation.isValid && !section.isOptional) {
          allValid = false;
        }
      }
    }

    setIsValidating(false);

    if (!allValid) {
      alert('Please complete all required sections before submitting.');
      // Jump to first invalid section
      const firstInvalidIndex = visibleSections.findIndex(section => {
        const validation = sectionValidation[section.id];
        return validation && !validation.isValid && !section.isOptional;
      });

      if (firstInvalidIndex !== -1) {
        setCurrentSectionIndex(firstInvalidIndex);
      }
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onComplete(getAllData());
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Update section data handler
   */
  const handleUpdateData = useCallback((data: SectionData) => {
    updateSection(currentSection.id, data);
  }, [currentSection.id, updateSection]);

  /**
   * Update single field handler
   */
  const handleUpdateField = useCallback((field: string, value: any) => {
    updateFormField(currentSection.id, field, value);
  }, [currentSection.id, updateFormField]);

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="fixed top-4 right-4 z-50 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600 flex items-center space-x-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar Navigation */}
          {showSidebar && (
            <aside className="w-64 bg-white min-h-screen border-r border-gray-200 p-6 sticky top-0 overflow-y-auto h-screen">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Patient Registration
              </h2>

              <nav className="space-y-2">
                {visibleSections.map((section, index) => {
                  const validation = sectionValidation[section.id];
                  const isCompleted = completedSections.has(section.id);
                  const isCurrent = index === currentSectionIndex;
                  const hasErrors = validation && !validation.isValid;

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleGoToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                          : hasErrors
                          ? 'bg-red-50 border border-red-200 text-red-900'
                          : isCompleted
                          ? 'bg-green-50 border border-green-200 text-green-900'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted && !hasErrors ? (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : hasErrors ? (
                          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : isCurrent ? (
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {section.title}
                        </div>
                        {section.isOptional && (
                          <div className="text-xs text-gray-500">Optional</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Save Draft Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveDraft}
                  disabled={!hasUnsavedChanges}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    hasUnsavedChanges
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Draft
                </button>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentSection.title}
                  </h1>
                  <div className="text-sm text-gray-500">
                    Section {currentSectionIndex + 1} of {visibleSections.length}
                  </div>
                </div>
                {currentSection.description && (
                  <p className="text-gray-600">{currentSection.description}</p>
                )}
                {currentSection.isOptional && (
                  <p className="text-sm text-gray-500 mt-2">This section is optional</p>
                )}
              </div>

              {/* Validation Errors */}
              {currentValidation.errors.length > 0 && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Please correct the following errors:
                      </h3>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {currentValidation.errors.map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Content */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <currentSection.component
                  data={currentSectionData}
                  updateData={handleUpdateData}
                  updateField={handleUpdateField}
                  errors={currentValidation.errors}
                  isActive={true}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstSection}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isFirstSection
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-4">
                  {!isLastSection ? (
                    <button
                      onClick={handleNext}
                      disabled={isValidating}
                      className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {isValidating ? 'Validating...' : 'Next'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isValidating}
                      className="px-8 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
