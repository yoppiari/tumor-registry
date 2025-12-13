'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 2: Patient Identity & Demographics
 *
 * Captures complete patient identification and demographic information:
 * - NIK (Indonesian National ID - 16 digits)
 * - Full name
 * - Date of birth (with age calculation)
 * - Gender (MALE/FEMALE)
 * - Hierarchical address (Province → Regency → District → Village)
 * - Contact information (phone, emergency contact)
 */

interface Section2Data {
  nik: string;
  name: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | '';
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  addressDetail: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  provinceId: string;
}

interface District {
  id: string;
  name: string;
  regencyId: string;
}

interface Village {
  id: string;
  name: string;
  districtId: string;
}

export function Section2PatientIdentity() {
  const { getSection, updateSection } = useFormContext();
  const sectionData: Partial<Section2Data> = (getSection('section2') as Section2Data) || {
    nik: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    provinceId: '',
    regencyId: '',
    districtId: '',
    villageId: '',
    addressDetail: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  };

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nikError, setNikError] = useState<string | null>(null);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(sectionData.dateOfBirth);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load regencies when province changes
  useEffect(() => {
    if (sectionData.provinceId) {
      loadRegencies(sectionData.provinceId);
    } else {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    }
  }, [sectionData.provinceId]);

  // Load districts when regency changes
  useEffect(() => {
    if (sectionData.regencyId) {
      loadDistricts(sectionData.regencyId);
    } else {
      setDistricts([]);
      setVillages([]);
    }
  }, [sectionData.regencyId]);

  // Load villages when district changes
  useEffect(() => {
    if (sectionData.districtId) {
      loadVillages(sectionData.districtId);
    } else {
      setVillages([]);
    }
  }, [sectionData.districtId]);

  const loadProvinces = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/regions/provinces', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setProvinces(data.data || data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegencies = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/v1/regions/provinces/${provinceId}/regencies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setRegencies(data.data || data);
    } catch (error) {
      console.error('Error loading regencies:', error);
    }
  };

  const loadDistricts = async (regencyId: string) => {
    try {
      const response = await fetch(`/api/v1/regions/regencies/${regencyId}/districts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setDistricts(data.data || data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadVillages = async (districtId: string) => {
    try {
      const response = await fetch(`/api/v1/regions/districts/${districtId}/villages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setVillages(data.data || data);
    } catch (error) {
      console.error('Error loading villages:', error);
    }
  };

  const validateNIK = (nik: string): boolean => {
    setNikError(null);
    if (!nik) return true; // Allow empty for now

    // NIK must be exactly 16 digits
    if (!/^\d{16}$/.test(nik)) {
      setNikError('NIK harus 16 digit angka');
      return false;
    }

    return true;
  };

  const updateField = <K extends keyof Section2Data>(field: K, value: Section2Data[K]) => {
    updateSection('section2', {
      ...sectionData,
      [field]: value,
    });

    // Clear dependent fields when parent changes
    if (field === 'provinceId') {
      updateSection('section2', {
        ...sectionData,
        provinceId: value,
        regencyId: '',
        districtId: '',
        villageId: '',
      });
    } else if (field === 'regencyId') {
      updateSection('section2', {
        ...sectionData,
        regencyId: value,
        districtId: '',
        villageId: '',
      });
    } else if (field === 'districtId') {
      updateSection('section2', {
        ...sectionData,
        districtId: value,
        villageId: '',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identitas Pasien
        </h2>
        <p className="text-gray-600">
          Lengkapi data identitas dan demografi pasien
        </p>
      </div>

      {/* Basic Identity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Identitas</h3>

        {/* NIK */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sectionData.nik}
            onChange={(e) => {
              updateField('nik', e.target.value);
              validateNIK(e.target.value);
            }}
            onBlur={(e) => validateNIK(e.target.value)}
            maxLength={16}
            placeholder="3201234567890123"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              nikError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {nikError && (
            <p className="mt-1 text-sm text-red-600">{nikError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">16 digit nomor identitas kependudukan</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sectionData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Masukkan nama lengkap sesuai KTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={sectionData.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {age > 0 && (
              <p className="mt-1 text-sm text-gray-600">Usia: {age} tahun</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionData.gender}
              onChange={(e) => updateField('gender', e.target.value as 'MALE' | 'FEMALE')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hierarchical Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alamat</h3>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <select
            value={sectionData.provinceId}
            onChange={(e) => updateField('provinceId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regency/City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kabupaten/Kota <span className="text-red-500">*</span>
          </label>
          <select
            value={sectionData.regencyId}
            onChange={(e) => updateField('regencyId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!sectionData.provinceId}
            required
          >
            <option value="">Pilih Kabupaten/Kota</option>
            {regencies.map((regency) => (
              <option key={regency.id} value={regency.id}>
                {regency.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <select
            value={sectionData.districtId}
            onChange={(e) => updateField('districtId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!sectionData.regencyId}
            required
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kelurahan/Desa <span className="text-red-500">*</span>
          </label>
          <select
            value={sectionData.villageId}
            onChange={(e) => updateField('villageId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!sectionData.districtId}
            required
          >
            <option value="">Pilih Kelurahan/Desa</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
        </div>

        {/* Detailed Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detail Alamat (RT/RW, Nama Jalan, dll)
          </label>
          <textarea
            value={sectionData.addressDetail}
            onChange={(e) => updateField('addressDetail', e.target.value)}
            rows={3}
            placeholder="Contoh: Jl. Merdeka No. 123, RT 001/RW 005"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={sectionData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="08123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak Darurat</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kontak Darurat
            </label>
            <input
              type="text"
              value={sectionData.emergencyContactName}
              onChange={(e) => updateField('emergencyContactName', e.target.value)}
              placeholder="Nama kerabat/keluarga"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hubungan
            </label>
            <input
              type="text"
              value={sectionData.emergencyContactRelationship}
              onChange={(e) => updateField('emergencyContactRelationship', e.target.value)}
              placeholder="Contoh: Istri, Anak, Saudara"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon Kontak Darurat
          </label>
          <input
            type="tel"
            value={sectionData.emergencyContactPhone}
            onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
            placeholder="08123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
