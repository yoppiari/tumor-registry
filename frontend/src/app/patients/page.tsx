'use client';

import React, { useState, useEffect } from 'react';
import { PatientProvider } from '@/contexts/PatientContext';
import { Patient } from '@/types/patient';
import PatientSearch from '@/components/patients/PatientSearch';
import PatientList from '@/components/patients/PatientList';
import PatientDetail from '@/components/patients/PatientDetail';
import PatientChatEntry from '@/components/patients/PatientChatEntry';

function PatientManagementContent() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showChatEntry, setShowChatEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePatientsFound = (foundPatients: Patient[]) => {
    setPatients(foundPatients);
    if (selectedPatient && !foundPatients.find(p => p.id === selectedPatient.id)) {
      setSelectedPatient(null);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowChatEntry(false);
  };

  const handleShowChatEntry = () => {
    setShowChatEntry(true);
    setSelectedPatient(null);
  };

  const handleShowListView = () => {
    setShowChatEntry(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pasien</h1>
              <p className="text-gray-600">INAMSOS - Sistem Informasi Kanker Nasional</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShowListView}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showChatEntry
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Daftar Pasien
              </button>
              <button
                onClick={handleShowChatEntry}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showChatEntry
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Input Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showChatEntry ? (
          /* WhatsApp-inspired Entry View */
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={handleShowListView}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Daftar Pasien
              </button>
            </div>
            <PatientChatEntry />
          </div>
        ) : (
          /* List and Detail View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Search and List */}
            <div className="lg:col-span-2 space-y-6">
              <PatientSearch onPatientsFound={handlePatientsFound} />
              <PatientList
                patients={patients}
                onSelectPatient={handleSelectPatient}
                isLoading={loading}
              />
            </div>

            {/* Right Column - Patient Detail */}
            <div className="lg:col-span-1">
              {selectedPatient ? (
                <PatientDetail
                  patient={selectedPatient}
                  onEdit={(patient) => {
                    // Handle edit functionality
                    console.log('Edit patient:', patient);
                  }}
                  className="sticky top-6"
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center sticky top-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Pilih Pasien</h3>
                  <p className="text-sm text-gray-500">
                    Klik pada pasien dari daftar untuk melihat detailnya
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <PatientProvider>
      <PatientManagementContent />
    </PatientProvider>
  );
}