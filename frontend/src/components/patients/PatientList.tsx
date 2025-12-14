'use client';

import React, { useState } from 'react';
import { Patient } from '@/types/patient';
import { usePatient } from '@/contexts/PatientContext';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  isLoading?: boolean;
  className?: string;
}

export default function PatientList({
  patients,
  onSelectPatient,
  isLoading = false,
  className = ''
}: PatientListProps) {
  const { setCurrentPatient } = usePatient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '-';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatGender = (gender: string) => {
    if (!gender) return '-';
    return gender.toUpperCase() === 'MALE' ? 'Laki-laki' : 'Perempuan';
  };

  const formatTreatmentStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'new': 'Baru',
      'ongoing': 'Sedang Berjalan',
      'completed': 'Selesai',
      'palliative': 'Paliatif',
      'lost_to_followup': 'Hilang Follow-up',
      'deceased': 'Meninggal'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'ongoing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'palliative': 'bg-purple-100 text-purple-800',
      'lost_to_followup': 'bg-orange-100 text-orange-800',
      'deceased': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedId(patient.id);
    setCurrentPatient(patient);
    onSelectPatient?.(patient);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada pasien ditemukan</h3>
          <p className="text-sm">Coba ubah kriteria pencarian Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Pasien ({patients.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => handlePatientClick(patient)}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedId === patient.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Patient Avatar */}
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>

                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {patient.name}
                    </h4>
                    {patient.isDeceased && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Meninggal
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span>No. RM: <strong>{patient.medicalRecordNumber}</strong></span>
                    <span>{calculateAge(patient.dateOfBirth)} tahun</span>
                    <span>{formatGender(patient.gender)}</span>
                    {patient.phone && <span>{patient.phone}</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.treatmentStatus)}`}>
                      {formatTreatmentStatus(patient.treatmentStatus)}
                    </span>

                    {patient.primaryCancerDiagnosis?.primarySite && (
                      <span className="text-xs text-gray-500">
                        {patient.primaryCancerDiagnosis.primarySite}
                      </span>
                    )}

                    {patient.cancerStage && (
                      <span className="text-xs text-gray-500">
                        Stadium {patient.cancerStage}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions and Metadata */}
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">
                  <div>Terdaftar: {formatDate(patient.createdAt)}</div>
                  {patient.lastVisitDate && (
                    <div>Kunjungan terakhir: {formatDate(patient.lastVisitDate)}</div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view details
                      handlePatientClick(patient);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Detail
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                      console.log('Edit patient:', patient.id);
                    }}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Additional info row for deceased patients */}
            {patient.isDeceased && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <strong>Tanggal meninggal:</strong> {formatDate(patient.dateOfDeath || '')}
                  {patient.causeOfDeath && (
                    <span className="ml-4">
                      <strong>Sebab:</strong> {patient.causeOfDeath}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More (for pagination) */}
      {patients.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Menampilkan {patients.length} pasien
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Muat lebih banyak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}