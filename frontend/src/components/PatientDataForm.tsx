import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PaperAirplaneIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Simple debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface PatientData {
  id?: string;
  patientName?: string;
  idNumber?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE';
  tumorType?: string;
  diagnosisDate?: string;
  stage?: string;
  medicalHistory?: string;
  familyHistory?: string;
  previousTreatments?: string;
  notes?: string;
}

type DataEntryStatus = 'draft' | 'review' | 'complete' | 'error';
type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface WhatsAppBubbleProps {
  children: React.ReactNode;
  isUser?: boolean;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
}

const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({
  children,
  isUser = true,
  timestamp,
  status = 'sent'
}) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
      <div
        className={`
          rounded-2xl px-4 py-3 shadow-sm
          ${isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }
        `}
      >
        {children}
      </div>
      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {timestamp && <span>{timestamp}</span>}
        {isUser && status === 'read' && <CheckCircleIcon className="w-3 h-3 text-blue-500" />}
        {isUser && status === 'delivered' && <CheckCircleIcon className="w-3 h-3 text-gray-400" />}
      </div>
    </div>
  </div>
);

interface QuickCaptureFormProps {
  onChange: (data: Partial<PatientData>) => void;
  initialData?: Partial<PatientData>;
}

const QuickCaptureForm: React.FC<QuickCaptureFormProps> = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState<PatientData>(initialData || {});

  const handleChange = useCallback((field: keyof PatientData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  }, [formData, onChange]);

  return (
    <div className="space-y-3">
      <WhatsAppBubble isUser={false}>
        <div className="space-y-3">
          <p className="font-medium">📝 Quick Patient Registration</p>
          <p className="text-sm opacity-90">Essential information only - we can add details later</p>
        </div>
      </WhatsAppBubble>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Patient Name *"
          value={formData.patientName || ''}
          onChange={(e) => handleChange('patientName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          type="text"
          placeholder="ID Number (NIK/Passport) *"
          value={formData.idNumber || ''}
          onChange={(e) => handleChange('idNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            placeholder="Birth Date *"
            value={formData.birthDate || ''}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={formData.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
            className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Gender *</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Tumor Type *"
          value={formData.tumorType || ''}
          onChange={(e) => handleChange('tumorType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          type="date"
          placeholder="Diagnosis Date *"
          value={formData.diagnosisDate || ''}
          onChange={(e) => handleChange('diagnosisDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

interface DetailedFormProps {
  onChange: (data: Partial<PatientData>) => void;
  initialData?: Partial<PatientData>;
}

const DetailedForm: React.FC<DetailedFormProps> = ({ onChange, initialData }) => {
  const [formData, setFormData] = useState<PatientData>(initialData || {});

  const handleChange = useCallback((field: keyof PatientData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  }, [formData, onChange]);

  return (
    <div className="space-y-3">
      <WhatsAppBubble isUser={false}>
        <div className="space-y-2">
          <p className="font-medium">📋 Detailed Medical Information</p>
          <p className="text-sm opacity-90">Complete clinical data for comprehensive care</p>
        </div>
      </WhatsAppBubble>

      {/* Include Quick Form Fields */}
      <QuickCaptureForm onChange={onChange} initialData={formData} />

      {/* Additional Detailed Fields */}
      <div className="space-y-3 mt-4">
        <select
          value={formData.stage || ''}
          onChange={(e) => handleChange('stage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Cancer Stage</option>
          <option value="STAGE_I">Stage I</option>
          <option value="STAGE_II">Stage II</option>
          <option value="STAGE_III">Stage III</option>
          <option value="STAGE_IV">Stage IV</option>
        </select>

        <textarea
          placeholder="Medical History..."
          value={formData.medicalHistory || ''}
          onChange={(e) => handleChange('medicalHistory', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <textarea
          placeholder="Family History..."
          value={formData.familyHistory || ''}
          onChange={(e) => handleChange('familyHistory', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <textarea
          placeholder="Previous Treatments..."
          value={formData.previousTreatments || ''}
          onChange={(e) => handleChange('previousTreatments', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <textarea
          placeholder="Additional Notes..."
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status }) => {
  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          text: 'Saving...',
          icon: <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />,
          color: 'text-blue-500'
        };
      case 'saved':
        return {
          text: 'Saved',
          icon: <CheckCircleIcon className="w-4 h-4" />,
          color: 'text-green-500'
        };
      case 'error':
        return {
          text: 'Save failed',
          icon: <ExclamationTriangleIcon className="w-4 h-4" />,
          color: 'text-red-500'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${config.color} transition-all duration-200`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

interface WhatsAppStyleActionsProps {
  onSave: () => void;
  onExpand: () => void;
  mode: 'quick' | 'detailed';
  isValid: boolean;
  isSaving: boolean;
}

const WhatsAppStyleActions: React.FC<WhatsAppStyleActionsProps> = ({
  onSave,
  onExpand,
  mode,
  isValid,
  isSaving
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === 'quick' && (
            <button
              onClick={onExpand}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <DocumentTextIcon className="w-4 h-4" />
              <span>Add Details</span>
            </button>
          )}
        </div>

        <button
          onClick={onSave}
          disabled={!isValid || isSaving}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200
            ${isValid && !isSaving
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <PaperAirplaneIcon className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : mode === 'quick' ? 'Quick Save' : 'Complete'}</span>
        </button>
      </div>
    </div>
  );
};

interface PatientDataFormProps {
  onSave: (data: PatientData) => void;
  initialMode?: 'quick' | 'detailed';
  initialData?: Partial<PatientData>;
}

export const PatientDataForm: React.FC<PatientDataFormProps> = ({
  onSave,
  initialMode = 'quick',
  initialData
}) => {
  const [mode, setMode] = useState<'quick' | 'detailed'>(initialMode);
  const [status, setStatus] = useState<DataEntryStatus>('draft');
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  const [formData, setFormData] = useState<PatientData>(initialData || {});

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce(async (data: Partial<PatientData>) => {
      if (!Object.keys(data).length) return;

      setAutoSaveStatus('saving');
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    }, 1000),
    []
  );

  const handleChange = useCallback((data: Partial<PatientData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    debouncedSave(data);
  }, [debouncedSave]);

  const validateForm = (): boolean => {
    const requiredFields = ['patientName', 'idNumber', 'birthDate', 'gender', 'tumorType', 'diagnosisDate'];
    return requiredFields.every(field => formData[field as keyof PatientData]);
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('review');
    try {
      await onSave(formData);
      setStatus('complete');
    } catch (error) {
      setStatus('error');
    }
  }, [formData, onSave]);

  const handleExpand = useCallback(() => {
    setMode('detailed');
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const isValid = validateForm();
  const isSaving = status === 'review';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {mode === 'quick' ? 'Quick Registration' : 'Detailed Registration'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'quick'
                ? 'Essential information for rapid patient entry'
                : 'Complete medical information for comprehensive care'
              }
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AutoSaveIndicator status={autoSaveStatus} />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                status === 'complete' ? 'bg-green-500' :
                status === 'review' ? 'bg-yellow-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-gray-300'
              }`} />
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          {mode === 'quick' ? (
            <QuickCaptureForm onChange={handleChange} initialData={formData} />
          ) : (
            <DetailedForm onChange={handleChange} initialData={formData} />
          )}
        </div>
      </div>

      {/* Actions */}
      <WhatsAppStyleActions
        onSave={handleSave}
        onExpand={handleExpand}
        mode={mode}
        isValid={isValid}
        isSaving={isSaving}
      />
    </div>
  );
};

export default PatientDataForm;