'use client';

import { useState, useEffect } from 'react';
import { CreateResearchRequestDto, DataFieldsSelection, DataFilters } from '@/services/research-requests.service';

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Informasi Penelitian', description: 'Detail penelitian dan peneliti' },
  { id: 2, title: 'Kriteria Data', description: 'Filter dan estimasi pasien' },
  { id: 3, title: 'Data Fields', description: 'Pilih kategori data yang dibutuhkan' },
  { id: 4, title: 'Ethics & Timeline', description: 'IRB approval dan timeline' },
];

interface ResearchRequestWizardProps {
  onComplete: (data: CreateResearchRequestDto) => Promise<void>;
  onSaveDraft: (data: Partial<CreateResearchRequestDto>) => Promise<void>;
  initialData?: Partial<CreateResearchRequestDto>;
}

export function ResearchRequestWizard({ onComplete, onSaveDraft, initialData }: ResearchRequestWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateResearchRequestDto>>(initialData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(formData).length > 0) {
        handleSaveDraft();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [formData]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await onSaveDraft(formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.researchType && formData.researchAbstract && formData.objectives);
      case 2:
        return !!(formData.dataFilters);
      case 3:
        return !!(formData.requestedDataFields && hasSelectedFields(formData.requestedDataFields));
      case 4:
        return !!(formData.irbStatus && formData.researchStart && formData.researchEnd && formData.accessDurationMonths && formData.agreementSigned);
      default:
        return false;
    }
  };

  const hasSelectedFields = (fields: DataFieldsSelection): boolean => {
    return Object.values(fields).some(category => category?.selected);
  };

  const handleNext = () => {
    if (canProceed(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      handleSaveDraft();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (canProceed(4)) {
      try {
        await onComplete(formData as CreateResearchRequestDto);
      } catch (error) {
        console.error('Error submitting request:', error);
        alert('Gagal submit request. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-700'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`h-1 flex-1 mx-4 ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="mb-4 text-right text-sm text-gray-500">
        {isSaving ? (
          <span className="flex items-center justify-end gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Menyimpan draft...
          </span>
        ) : lastSaved ? (
          <span>Terakhir disimpan: {lastSaved.toLocaleTimeString('id-ID')}</span>
        ) : null}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        {currentStep === 1 && (
          <Step1ResearchInfo formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 2 && (
          <Step2DataCriteria formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 3 && (
          <Step3DataFieldsChecklist formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 4 && (
          <Step4EthicsTimeline formData={formData} updateFormData={updateFormData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              ← Kembali
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed(currentStep)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed(4)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit untuk Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Import step components (will be created)
import Step1ResearchInfo from './Step1ResearchInfo';
import Step2DataCriteria from './Step2DataCriteria';
import Step3DataFieldsChecklist from './Step3DataFieldsChecklist';
import Step4EthicsTimeline from './Step4EthicsTimeline';
