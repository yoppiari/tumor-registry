'use client';

import React, { useState, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { PatientSearchDto, Patient } from '@/types/patient';

interface PatientSearchProps {
  onPatientsFound?: (patients: Patient[]) => void;
  className?: string;
}

export default function PatientSearch({ onPatientsFound, className = '' }: PatientSearchProps) {
  const {
    searchPatients,
    fetchPatients,
    searchQuery,
    setSearchQuery,
    isLoading
  } = usePatient();

  const [localQuery, setLocalQuery] = useState<PatientSearchDto>({
    query: '',
    medicalRecordNumber: '',
    name: '',
    phone: '',
    cancerStage: undefined,
    treatmentStatus: undefined,
    primarySite: '',
    dateOfBirthFrom: '',
    dateOfBirthTo: '',
    dateOfDiagnosisFrom: '',
    dateOfDiagnosisTo: '',
    isDeceased: undefined,
    treatmentCenter: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const cancerStages = ['I', 'II', 'III', 'IV'];
  const treatmentStatuses = [
    { value: 'new', label: 'Baru' },
    { value: 'ongoing', label: 'Sedang Berjalan' },
    { value: 'completed', label: 'Selesai' },
    { value: 'palliative', label: 'Paliatif' },
    { value: 'lost_to_followup', label: 'Hilang Follow-up' },
    { value: 'deceased', label: 'Meninggal' }
  ];

  const primarySites = [
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
  ];

  const sortOptions = [
    { value: 'name', label: 'Nama' },
    { value: 'createdAt', label: 'Tanggal Dibuat' },
    { value: 'dateOfDiagnosis', label: 'Tanggal Diagnosis' },
    { value: 'lastVisitDate', label: 'Kunjungan Terakhir' }
  ];

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      const updatedQuery = { ...localQuery, page: 1 }; // Reset to first page
      setSearchQuery(updatedQuery);

      const result = await searchPatients(updatedQuery);
      onPatientsFound?.(result.patients);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleReset = () => {
    const resetQuery: PatientSearchDto = {
      query: '',
      medicalRecordNumber: '',
      name: '',
      phone: '',
      cancerStage: undefined,
      treatmentStatus: undefined,
      primarySite: '',
      dateOfBirthFrom: '',
      dateOfBirthTo: '',
      dateOfDiagnosisFrom: '',
      dateOfDiagnosisTo: '',
      isDeceased: undefined,
      treatmentCenter: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    setLocalQuery(resetQuery);
    setSearchQuery(resetQuery);

    fetchPatients().then(() => {
      onPatientsFound?.([]);
    });
  };

  const handleQuickSearch = (field: keyof PatientSearchDto, value: string) => {
    const updatedQuery = { ...localQuery, [field]: value, page: 1 };
    setLocalQuery(updatedQuery);

    // Auto-search for quick fields
    setTimeout(() => {
      setSearchQuery(updatedQuery);
      searchPatients(updatedQuery).then(result => {
        onPatientsFound?.(result.patients);
      });
    }, 300);
  };

  const updateLocalQuery = (field: keyof PatientSearchDto, value: any) => {
    setLocalQuery(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Cari Pasien</h2>

      {/* Quick Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama atau No. RM
          </label>
          <input
            type="text"
            value={localQuery.query || ''}
            onChange={(e) => handleQuickSearch('query', e.target.value)}
            placeholder="Cari nama atau nomor rekam medis"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <input
            type="text"
            value={localQuery.phone || ''}
            onChange={(e) => handleQuickSearch('phone', e.target.value)}
            placeholder="0812-3456-7890"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi Kanker Primer
          </label>
          <select
            value={localQuery.primarySite || ''}
            onChange={(e) => handleQuickSearch('primarySite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Lokasi</option>
            {primarySites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Search Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <svg className={`w-4 h-4 mr-1 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? 'Sembunyikan' : 'Tampilkan'} Pencarian Lanjutan
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isLoading ? 'Mencari...' : 'Cari'}
          </button>
        </div>
      </div>

      {/* Advanced Search */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Medical Record Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Rekam Medis
              </label>
              <input
                type="text"
                value={localQuery.medicalRecordNumber || ''}
                onChange={(e) => updateLocalQuery('medicalRecordNumber', e.target.value)}
                placeholder="RM20240001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cancer Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stadium Kanker
              </label>
              <select
                value={localQuery.cancerStage || ''}
                onChange={(e) => updateLocalQuery('cancerStage', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Stadium</option>
                {cancerStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Treatment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Pengobatan
              </label>
              <select
                value={localQuery.treatmentStatus || ''}
                onChange={(e) => updateLocalQuery('treatmentStatus', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                {treatmentStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir (Dari)
              </label>
              <input
                type="date"
                value={localQuery.dateOfBirthFrom || ''}
                onChange={(e) => updateLocalQuery('dateOfBirthFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir (Sampai)
              </label>
              <input
                type="date"
                value={localQuery.dateOfBirthTo || ''}
                onChange={(e) => updateLocalQuery('dateOfBirthTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Diagnosis Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Diagnosis (Dari)
              </label>
              <input
                type="date"
                value={localQuery.dateOfDiagnosisFrom || ''}
                onChange={(e) => updateLocalQuery('dateOfDiagnosisFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Diagnosis (Sampai)
              </label>
              <input
                type="date"
                value={localQuery.dateOfDiagnosisTo || ''}
                onChange={(e) => updateLocalQuery('dateOfDiagnosisTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Deceased Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Hidup
              </label>
              <select
                value={localQuery.isDeceased === undefined ? '' : localQuery.isDeceased.toString()}
                onChange={(e) => updateLocalQuery('isDeceased', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua</option>
                <option value="false">Hidup</option>
                <option value="true">Meninggal</option>
              </select>
            </div>

            {/* Treatment Center */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pusat Pengobatan
              </label>
              <input
                type="text"
                value={localQuery.treatmentCenter || ''}
                onChange={(e) => updateLocalQuery('treatmentCenter', e.target.value)}
                placeholder="Rumah Sakit A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutkan
              </label>
              <select
                value={localQuery.sortBy || 'createdAt'}
                onChange={(e) => updateLocalQuery('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutan
              </label>
              <select
                value={localQuery.sortOrder || 'desc'}
                onChange={(e) => updateLocalQuery('sortOrder', e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}