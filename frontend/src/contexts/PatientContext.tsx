'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Patient,
  PatientContextType,
  PatientSearchDto,
  PatientStatistics,
  CreatePatientDto,
  UpdatePatientDto,
  QuickPatientEntry,
  PatientEntrySession,
  PatientListResponse
} from '@/types/patient';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Action types
type PatientAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PATIENTS'; payload: Patient[] }
  | { type: 'SET_CURRENT_PATIENT'; payload: Patient | null }
  | { type: 'SET_SEARCH_QUERY'; payload: PatientSearchDto }
  | { type: 'SET_STATISTICS'; payload: PatientStatistics | null }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'REMOVE_PATIENT'; payload: string };

// Initial state
const initialState: Omit<PatientContextType, 'actions'> = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  error: null,
  searchQuery: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  statistics: null,
};

// Reducer
function patientReducer(state: any, action: PatientAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload, isLoading: false };
    case 'SET_CURRENT_PATIENT':
      return { ...state, currentPatient: action.payload, isLoading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: { ...state.searchQuery, ...action.payload } };
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload, isLoading: false };
    case 'ADD_PATIENT':
      return { ...state, patients: [action.payload, ...state.patients] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentPatient: state.currentPatient?.id === action.payload.id
          ? action.payload
          : state.currentPatient
      };
    case 'REMOVE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(p => p.id !== action.payload),
        currentPatient: state.currentPatient?.id === action.payload ? null : state.currentPatient
      };
    default:
      return state;
  }
}

// Context
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Provider props
interface PatientProviderProps {
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
export function PatientProvider({ children }: PatientProviderProps) {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  // Actions
  const setPatients = (patients: Patient[]) => dispatch({ type: 'SET_PATIENTS', payload: patients });
  const setCurrentPatient = (patient: Patient | null) => dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const setSearchQuery = (query: PatientSearchDto) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const clearCurrentPatient = () => dispatch({ type: 'SET_CURRENT_PATIENT', payload: null });

  // Async actions
  const fetchPatients = async (query?: PatientSearchDto): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const searchParams = new URLSearchParams();
      const finalQuery = { ...state.searchQuery, ...query };

      Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const response: PatientListResponse = await apiCall(`/patients?${searchParams.toString()}`);
      dispatch({ type: 'SET_PATIENTS', payload: response.patients });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch patients' });
    }
  };

  const createPatient = async (patient: CreatePatientDto): Promise<Patient> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newPatient = await apiCall('/patients', {
        method: 'POST',
        body: JSON.stringify(patient),
      });

      dispatch({ type: 'ADD_PATIENT', payload: newPatient });
      return newPatient;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create patient' });
      throw error;
    }
  };

  const updatePatient = async (id: string, patient: UpdatePatientDto): Promise<Patient> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedPatient = await apiCall(`/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patient),
      });

      dispatch({ type: 'UPDATE_PATIENT', payload: updatedPatient });
      return updatedPatient;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update patient' });
      throw error;
    }
  };

  const deletePatient = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiCall(`/patients/${id}/soft-delete`, {
        method: 'PATCH',
      });

      dispatch({ type: 'REMOVE_PATIENT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete patient' });
      throw error;
    }
  };

  const searchPatients = async (query: PatientSearchDto): Promise<PatientListResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const searchParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const response = await apiCall(`/patients?${searchParams.toString()}`);
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to search patients' });
      throw error;
    }
  };

  const getPatientById = async (id: string): Promise<Patient> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const patient = await apiCall(`/patients/${id}`);
      dispatch({ type: 'SET_CURRENT_PATIENT', payload: patient });
      return patient;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch patient' });
      throw error;
    }
  };

  const getStatistics = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const statistics = await apiCall('/patients/statistics');
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch statistics' });
    }
  };

  const quickEntry = async (quickEntry: QuickPatientEntry): Promise<Patient> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const patient = await apiCall('/patients/quick-entry', {
        method: 'POST',
        body: JSON.stringify(quickEntry),
      });

      dispatch({ type: 'ADD_PATIENT', payload: patient });
      return patient;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create patient' });
      throw error;
    }
  };

  // Chat session actions
  const createChatSession = async (): Promise<PatientEntrySession> => {
    try {
      const session = await apiCall('/patients/chat/session', {
        method: 'POST',
      });
      return session;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create chat session' });
      throw error;
    }
  };

  const sendChatMessage = async (sessionId: string, message: string, fieldName?: string, formData?: any): Promise<PatientEntrySession> => {
    try {
      const session = await apiCall(`/patients/chat/${sessionId}/message`, {
        method: 'POST',
        body: JSON.stringify({ content: message, fieldName, formData }),
      });
      return session;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to send message' });
      throw error;
    }
  };

  const getChatSession = async (sessionId: string): Promise<PatientEntrySession> => {
    try {
      const session = await apiCall(`/patients/chat/${sessionId}`);
      return session;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get chat session' });
      throw error;
    }
  };

  // Context value
  const contextValue: PatientContextType = {
    ...state,
    // Actions
    setPatients,
    setCurrentPatient,
    setLoading,
    setError,
    setSearchQuery,
    clearCurrentPatient,

    // Async actions
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    getPatientById,
    getStatistics,
    quickEntry,

    // Chat session actions
    createChatSession,
    sendChatMessage,
    getChatSession,
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
}

// Hook to use the context
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}