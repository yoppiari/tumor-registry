'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { PatientEntrySession, ChatMessage, FormStep } from '@/types/patient';

// Form steps configuration
const formSteps: FormStep[] = [
  {
    id: 'name',
    title: 'Nama Pasien',
    fieldName: 'name',
    type: 'text',
    required: true,
    placeholder: 'Masukkan nama lengkap pasien',
    validation: (value: string) => ({
      isValid: value.trim().length >= 3,
      errors: value.trim().length < 3 ? ['Nama harus memiliki minimal 3 karakter'] : []
    })
  },
  {
    id: 'dateOfBirth',
    title: 'Tanggal Lahir',
    fieldName: 'dateOfBirth',
    type: 'date',
    required: true,
    validation: (value: string) => {
      const date = new Date(value);
      const now = new Date();
      const isValid = date < now && date.getFullYear() >= 1900;
      return {
        isValid,
        errors: !isValid ? ['Tanggal lahir tidak valid'] : []
      };
    }
  },
  {
    id: 'gender',
    title: 'Jenis Kelamin',
    fieldName: 'gender',
    type: 'options',
    required: true,
    options: ['Laki-laki', 'Perempuan']
  },
  {
    id: 'phone',
    title: 'Nomor Telepon',
    fieldName: 'phone',
    type: 'phone',
    required: false,
    placeholder: '0812-3456-7890',
    validation: (value: string) => {
      if (!value) return { isValid: true, errors: [] };
      const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
      const cleanPhone = value.replace(/[-\s]/g, '');
      return {
        isValid: phoneRegex.test(cleanPhone),
        errors: phoneRegex.test(cleanPhone) ? [] : ['Format nomor telepon tidak valid']
      };
    }
  },
  {
    id: 'address',
    title: 'Alamat',
    fieldName: 'address.street',
    type: 'text',
    required: true,
    placeholder: 'Masukkan alamat lengkap'
  },
  {
    id: 'primarySite',
    title: 'Lokasi Kanker Primer',
    fieldName: 'primaryCancerDiagnosis.primarySite',
    type: 'select',
    required: true,
    options: [
      'Payudara',
      'Serviks (Leher Rahim)',
      'Ovarium',
      'Paru-paru',
      'Hati',
      'Gastrik (Lambung)',
      'Kolon & Rektum',
      'Nasofaring',
      'Tiroid',
      'Prostat',
      'Kandung Kemih',
      'Lainnya'
    ]
  },
  {
    id: 'cancerStage',
    title: 'Stadium Kanker',
    fieldName: 'cancerStage',
    type: 'options',
    required: true,
    options: ['I', 'II', 'III', 'IV']
  },
  {
    id: 'treatmentStatus',
    title: 'Status Pengobatan',
    fieldName: 'treatmentStatus',
    type: 'options',
    required: true,
    options: ['Baru', 'Sedang Berjalan', 'Selesai', 'Paliatif']
  }
];

export default function PatientChatEntry() {
  const {
    createChatSession,
    sendChatMessage,
    getChatSession,
    createPatient
  } = usePatient();

  const [session, setSession] = useState<PatientEntrySession | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  useEffect(() => {
    // Initialize chat session
    const initSession = async () => {
      try {
        setIsLoading(true);
        const newSession = await createChatSession();
        setSession(newSession);
      } catch (error) {
        console.error('Failed to create chat session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const getCurrentStep = () => {
    if (!session) return null;
    return formSteps[session.currentStep];
  };

  const handleSendMessage = async () => {
    if (!session || !currentInput.trim() || isLoading) return;

    const currentStep = getCurrentStep();
    if (!currentStep) return;

    // Validate input
    let isValid = true;
    let errors: string[] = [];

    if (currentStep.validation) {
      const validation = currentStep.validation(currentInput);
      isValid = validation.isValid;
      errors = validation.errors || [];
    }

    try {
      setIsLoading(true);

      // Send user message
      const updatedSession = await sendChatMessage(
        session.id,
        currentInput,
        currentStep.fieldName,
        { [currentStep.fieldName]: currentInput }
      );

      setSession(updatedSession);

      // If validation failed, the service will return error message
      // If valid and not the last step, service will proceed to next step
      // If this was the last step, create the patient
      if (isValid && session.currentStep === formSteps.length - 1) {
        // Create patient from session data
        await createPatientFromSession(updatedSession);
      }

      setCurrentInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPatientFromSession = async (chatSession: PatientEntrySession) => {
    try {
      // Transform chat session data to CreatePatientDto format
      const patientData = {
        medicalRecordNumber: `RM${Date.now()}`, // Generate auto MRN
        name: chatSession.formData.name || '',
        dateOfBirth: chatSession.formData.dateOfBirth || '',
        gender: chatSession.formData.gender === 'Laki-laki' ? 'male' : 'female',
        phone: chatSession.formData.phone,
        address: {
          street: chatSession.formData.address || ''
        },
        emergencyContact: {
          name: '',
          relationship: 'other',
          phone: ''
        },
        primaryCancerDiagnosis: {
          primarySite: chatSession.formData.primaryCancerDiagnosis?.primarySite || '',
          laterality: 'unknown',
          morphology: '',
          behavior: 'invasive'
        },
        cancerStage: chatSession.formData.cancerStage,
        treatmentStatus: chatSession.formData.treatmentStatus === 'Baru' ? 'new' :
                        chatSession.formData.treatmentStatus === 'Sedang Berjalan' ? 'ongoing' :
                        chatSession.formData.treatmentStatus === 'Selesai' ? 'completed' : 'palliative',
        treatmentCenter: 'Default' // This should come from user context
      };

      await createPatient(patientData);

      // Reset chat or show completion message
      setSession({
        ...chatSession,
        status: 'completed',
        messages: [
          ...chatSession.messages,
          {
            id: Date.now().toString(),
            type: 'system',
            content: '✅ Data pasien berhasil disimpan! Terima kasih telah menggunakan sistem INAMSOS.',
            timestamp: new Date(),
            completed: true
          }
        ]
      });
    } catch (error) {
      console.error('Failed to create patient:', error);
      // Add error message to chat
      if (session) {
        setSession({
          ...session,
          messages: [
            ...session.messages,
            {
              id: Date.now().toString(),
              type: 'system',
              content: '❌ Maaf, terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
              timestamp: new Date()
            }
          ]
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : isSystem
              ? 'bg-gray-100 text-gray-800 rounded-bl-none'
              : 'bg-green-500 text-white rounded-bl-none'
          }`}
        >
          {message.type === 'form' && message.options && (
            <div className="space-y-2">
              <p className="font-semibold">{message.content}</p>
              <div className="grid grid-cols-2 gap-2">
                {message.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCurrentInput(option);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
          {message.type !== 'form' && (
            <div>
              <p className="text-sm">{message.content}</p>
              {message.validation && !message.validation.isValid && (
                <div className="mt-2 text-xs bg-red-100 text-red-700 p-2 rounded">
                  {message.validation.errors?.map((error, idx) => (
                    <p key={idx}>• {error}</p>
                  ))}
                </div>
              )}
            </div>
          )}
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading && !session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memulai sesi input data...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center text-gray-500 py-8">
        Gagal memulai sesi. Silakan coba lagi.
      </div>
    );
  }

  const currentStep = getCurrentStep();
  const isCompleted = session.status === 'completed';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-green-500 text-white p-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
          <div>
            <h2 className="font-semibold">Input Data Pasien</h2>
            <p className="text-xs opacity-90">
              {isCompleted ? 'Selesai' : `Langkah ${session.currentStep + 1} dari ${session.totalSteps}`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {session.messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isCompleted && currentStep && (
        <div className="border-t p-4 bg-white">
          {currentStep.type === 'options' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">Pilih salah satu:</p>
              <div className="grid grid-cols-2 gap-2">
                {currentStep.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCurrentInput(option);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type={currentStep.type === 'date' ? 'date' : 'text'}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentStep.placeholder}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Kirim'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="border-t p-4 bg-white text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Input Pasien Baru
          </button>
        </div>
      )}
    </div>
  );
}