'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  TreatmentPlan,
  TreatmentSession,
  MedicalRecord,
  QualityMetrics,
  TreatmentReport,
  TreatmentContextType,
  CreateTreatmentPlanDto,
  UpdateTreatmentPlanDto,
  SearchTreatmentDto,
  TreatmentListResponse
} from '@/types/treatment';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Action types
type TreatmentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TREATMENT_PLANS'; payload: TreatmentPlan[] }
  | { type: 'SET_CURRENT_TREATMENT_PLAN'; payload: TreatmentPlan | null }
  | { type: 'SET_TREATMENT_SESSIONS'; payload: TreatmentSession[] }
  | { type: 'SET_MEDICAL_RECORDS'; payload: MedicalRecord[] }
  | { type: 'SET_QUALITY_METRICS'; payload: QualityMetrics | null }
  | { type: 'ADD_TREATMENT_PLAN'; payload: TreatmentPlan }
  | { type: 'UPDATE_TREATMENT_PLAN'; payload: TreatmentPlan }
  | { type: 'REMOVE_TREATMENT_PLAN'; payload: string }
  | { type: 'ADD_TREATMENT_SESSION'; payload: TreatmentSession }
  | { type: 'UPDATE_TREATMENT_SESSION'; payload: TreatmentSession }
  | { type: 'ADD_MEDICAL_RECORD'; payload: MedicalRecord }
  | { type: 'UPDATE_MEDICAL_RECORD'; payload: MedicalRecord };

// Initial state
const initialState: Omit<TreatmentContextType, 'actions'> = {
  treatmentPlans: [],
  currentTreatmentPlan: null,
  treatmentSessions: [],
  medicalRecords: [],
  qualityMetrics: null,
  isLoading: false,
  error: null,
};

// Reducer
function treatmentReducer(state: any, action: TreatmentAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_TREATMENT_PLANS':
      return { ...state, treatmentPlans: action.payload, isLoading: false };
    case 'SET_CURRENT_TREATMENT_PLAN':
      return { ...state, currentTreatmentPlan: action.payload, isLoading: false };
    case 'SET_TREATMENT_SESSIONS':
      return { ...state, treatmentSessions: action.payload, isLoading: false };
    case 'SET_MEDICAL_RECORDS':
      return { ...state, medicalRecords: action.payload, isLoading: false };
    case 'SET_QUALITY_METRICS':
      return { ...state, qualityMetrics: action.payload, isLoading: false };
    case 'ADD_TREATMENT_PLAN':
      return { ...state, treatmentPlans: [action.payload, ...state.treatmentPlans] };
    case 'UPDATE_TREATMENT_PLAN':
      return {
        ...state,
        treatmentPlans: state.treatmentPlans.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentTreatmentPlan: state.currentTreatmentPlan?.id === action.payload.id
          ? action.payload
          : state.currentTreatmentPlan
      };
    case 'REMOVE_TREATMENT_PLAN':
      return {
        ...state,
        treatmentPlans: state.treatmentPlans.filter(p => p.id !== action.payload),
        currentTreatmentPlan: state.currentTreatmentPlan?.id === action.payload ? null : state.currentTreatmentPlan
      };
    case 'ADD_TREATMENT_SESSION':
      return { ...state, treatmentSessions: [action.payload, ...state.treatmentSessions] };
    case 'UPDATE_TREATMENT_SESSION':
      return {
        ...state,
        treatmentSessions: state.treatmentSessions.map(s =>
          s.id === action.payload.id ? action.payload : s
        )
      };
    case 'ADD_MEDICAL_RECORD':
      return { ...state, medicalRecords: [action.payload, ...state.medicalRecords] };
    case 'UPDATE_MEDICAL_RECORD':
      return {
        ...state,
        medicalRecords: state.medicalRecords.map(r =>
          r.id === action.payload.id ? action.payload : r
        )
      };
    default:
      return state;
  }
}

// Context
const TreatmentContext = createContext<TreatmentContextType | undefined>(undefined);

// Provider props
interface TreatmentProviderProps {
  children: ReactNode;
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Provider component
export function TreatmentProvider({ children }: TreatmentProviderProps) {
  const [state, dispatch] = useReducer(treatmentReducer, initialState);

  // Actions
  const setTreatmentPlans = (plans: TreatmentPlan[]) => dispatch({ type: 'SET_TREATMENT_PLANS', payload: plans });
  const setCurrentTreatmentPlan = (plan: TreatmentPlan | null) => dispatch({ type: 'SET_CURRENT_TREATMENT_PLAN', payload: plan });
  const setTreatmentSessions = (sessions: TreatmentSession[]) => dispatch({ type: 'SET_TREATMENT_SESSIONS', payload: sessions });
  const setMedicalRecords = (records: MedicalRecord[]) => dispatch({ type: 'SET_MEDICAL_RECORDS', payload: records });
  const setQualityMetrics = (metrics: QualityMetrics | null) => dispatch({ type: 'SET_QUALITY_METRICS', payload: metrics });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const clearCurrentTreatmentPlan = () => dispatch({ type: 'SET_CURRENT_TREATMENT_PLAN', payload: null });

  // Async actions
  const fetchTreatmentPlans = async (query?: SearchTreatmentDto): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const searchParams = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'object' && value.startDate && value.endDate) {
              searchParams.append('dateRange[startDate]', value.startDate);
              searchParams.append('dateRange[endDate]', value.endDate);
            } else {
              searchParams.append(key, String(value));
            }
          }
        });
      }

      const response: TreatmentListResponse = await apiCall(`/treatments/plans?${searchParams.toString()}`);
      dispatch({ type: 'SET_TREATMENT_PLANS', payload: response.treatmentPlans });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch treatment plans' });
    }
  };

  const createTreatmentPlan = async (plan: CreateTreatmentPlanDto): Promise<TreatmentPlan> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newPlan = await apiCall('/treatments/plans', {
        method: 'POST',
        body: JSON.stringify(plan),
      });

      dispatch({ type: 'ADD_TREATMENT_PLAN', payload: newPlan });
      return newPlan;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create treatment plan' });
      throw error;
    }
  };

  const updateTreatmentPlan = async (id: string, plan: UpdateTreatmentPlanDto): Promise<TreatmentPlan> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedPlan = await apiCall(`/treatments/plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(plan),
      });

      dispatch({ type: 'UPDATE_TREATMENT_PLAN', payload: updatedPlan });
      return updatedPlan;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update treatment plan' });
      throw error;
    }
  };

  const activateTreatmentPlan = async (id: string): Promise<TreatmentPlan> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const activatedPlan = await apiCall(`/treatments/plans/${id}/activate`, {
        method: 'PATCH',
      });

      dispatch({ type: 'UPDATE_TREATMENT_PLAN', payload: activatedPlan });
      return activatedPlan;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to activate treatment plan' });
      throw error;
    }
  };

  const completeTreatmentPlan = async (id: string): Promise<TreatmentPlan> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const completedPlan = await apiCall(`/treatments/plans/${id}/complete`, {
        method: 'PATCH',
      });

      dispatch({ type: 'UPDATE_TREATMENT_PLAN', payload: completedPlan });
      return completedPlan;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to complete treatment plan' });
      throw error;
    }
  };

  const fetchTreatmentSessions = async (planId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessions = await apiCall(`/treatments/plans/${planId}/sessions`);
      dispatch({ type: 'SET_TREATMENT_SESSIONS', payload: sessions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch treatment sessions' });
    }
  };

  const createTreatmentSession = async (session: any): Promise<TreatmentSession> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newSession = await apiCall('/treatments/sessions', {
        method: 'POST',
        body: JSON.stringify(session),
      });

      dispatch({ type: 'ADD_TREATMENT_SESSION', payload: newSession });
      return newSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create treatment session' });
      throw error;
    }
  };

  const completeTreatmentSession = async (sessionId: string, postAssessment: any): Promise<TreatmentSession> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const completedSession = await apiCall(`/treatments/sessions/${sessionId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(postAssessment),
      });

      dispatch({ type: 'UPDATE_TREATMENT_SESSION', payload: completedSession });
      return completedSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to complete treatment session' });
      throw error;
    }
  };

  const fetchMedicalRecords = async (patientId: string, limit: number = 50): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const records = await apiCall(`/treatments/patients/${patientId}/medical-records?limit=${limit}`);
      dispatch({ type: 'SET_MEDICAL_RECORDS', payload: records });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch medical records' });
    }
  };

  const createMedicalRecord = async (record: any): Promise<MedicalRecord> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newRecord = await apiCall('/treatments/medical-records', {
        method: 'POST',
        body: JSON.stringify(record),
      });

      dispatch({ type: 'ADD_MEDICAL_RECORD', payload: newRecord });
      return newRecord;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create medical record' });
      throw error;
    }
  };

  const calculateQualityMetrics = async (planId: string): Promise<QualityMetrics> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const metrics = await apiCall(`/treatments/plans/${planId}/quality-metrics`);
      dispatch({ type: 'SET_QUALITY_METRICS', payload: metrics });
      return metrics;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to calculate quality metrics' });
      throw error;
    }
  };

  const generateTreatmentReport = async (reportData: any): Promise<TreatmentReport> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const report = await apiCall('/treatments/reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });

      return report;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate treatment report' });
      throw error;
    }
  };

  // Context value
  const contextValue: TreatmentContextType = {
    ...state,

    // Actions
    setTreatmentPlans,
    setCurrentTreatmentPlan,
    setTreatmentSessions,
    setMedicalRecords,
    setQualityMetrics,
    setLoading,
    setError,
    clearCurrentTreatmentPlan,

    // Async actions
    fetchTreatmentPlans,
    createTreatmentPlan,
    updateTreatmentPlan,
    activateTreatmentPlan,
    completeTreatmentPlan,
    fetchTreatmentSessions,
    createTreatmentSession,
    completeTreatmentSession,
    fetchMedicalRecords,
    createMedicalRecord,
    calculateQualityMetrics,
    generateTreatmentReport,
  };

  return (
    <TreatmentContext.Provider value={contextValue}>
      {children}
    </TreatmentContext.Provider>
  );
}

// Hook to use the context
export function useTreatment() {
  const context = useContext(TreatmentContext);
  if (context === undefined) {
    throw new Error('useTreatment must be used within a TreatmentProvider');
  }
  return context;
}