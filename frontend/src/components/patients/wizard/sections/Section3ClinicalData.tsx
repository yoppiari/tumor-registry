'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 3: Clinical Data & Presentation
 *
 * Captures comprehensive clinical assessment:
 * - Karnofsky Performance Score (0-100, increments of 10)
 * - Pain Scale (0-10 VAS - Visual Analog Scale)
 * - BMI calculation (height + weight)
 * - Chief complaint
 * - Comorbidities
 * - Physical examination findings
 * - Clinical photography (optional)
 */

interface Section3Data {
  // Performance & Pain Assessment
  karnofskyScore?: number;        // 0-100, increments of 10
  painScale?: number;             // 0-10 VAS

  // Anthropometric Measurements
  height?: number;                // cm
  weight?: number;                // kg
  bmi?: number;                   // Auto-calculated

  // Clinical History
  chiefComplaint?: string;        // Main presenting symptom
  durationOfSymptoms?: number;    // In months
  comorbidities?: string;         // Comma-separated or free text

  // Physical Examination
  swellingPresent?: boolean;
  swellingSize?: string;          // e.g., "10x8 cm"
  skinChanges?: string;
  neurovascularStatus?: string;   // "Normal" | "Compromised"
  rangeOfMotion?: string;         // e.g., "Full" | "Limited (50%)"

  // Clinical Photos (will implement file upload later)
  clinicalPhotosUploaded?: boolean;
  numberOfPhotos?: number;
}

const KARNOFSKY_DESCRIPTIONS = {
  100: 'Normal; tidak ada keluhan atau tanda penyakit',
  90: 'Aktivitas normal; tanda/gejala minimal',
  80: 'Aktivitas normal dengan usaha; tanda/gejala penyakit',
  70: 'Rawat diri sendiri; tidak mampu aktivitas normal',
  60: 'Memerlukan bantuan kadang-kadang',
  50: 'Memerlukan bantuan dan perawatan medis',
  40: 'Cacat; memerlukan perawatan khusus',
  30: 'Sangat cacat; diindikasikan rawat inap',
  20: 'Sangat sakit; rawat inap dan supportif aktif',
  10: 'Moribund; proses fatal berkembang cepat',
  0: 'Meninggal',
};

export function Section3ClinicalData() {
  const { getSection, updateSection } = useFormContext();
  const sectionData: Partial<Section3Data> = (getSection('section3') as Section3Data) || {};

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (sectionData.height && sectionData.weight) {
      const heightInMeters = sectionData.height / 100;
      const calculatedBMI = sectionData.weight / (heightInMeters * heightInMeters);

      if (calculatedBMI !== sectionData.bmi) {
        updateSection('section3', {
          ...sectionData,
          bmi: parseFloat(calculatedBMI.toFixed(2)),
        });
      }
    }
  }, [sectionData.height, sectionData.weight]);

  const updateField = <K extends keyof Section3Data>(field: K, value: Section3Data[K]) => {
    updateSection('section3', {
      ...sectionData,
      [field]: value,
    });
  };

  const getBMICategory = (bmi?: number): { label: string; color: string } => {
    if (!bmi) return { label: '', color: '' };

    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const getPainDescription = (pain?: number): string => {
    if (pain === undefined || pain === null) return '';

    if (pain === 0) return 'Tidak ada nyeri';
    if (pain <= 3) return 'Nyeri ringan';
    if (pain <= 6) return 'Nyeri sedang';
    if (pain <= 9) return 'Nyeri berat';
    return 'Nyeri sangat berat';
  };

  const bmiCategory = getBMICategory(sectionData.bmi);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Data Klinis & Presentasi
        </h2>
        <p className="text-gray-600">
          Penilaian kondisi klinis pasien saat pertama kali datang
        </p>
      </div>

      {/* Performance Assessment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Penilaian Performa & Nyeri
        </h3>

        {/* Karnofsky Performance Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Karnofsky Performance Score
          </label>
          <select
            value={sectionData.karnofskyScore || ''}
            onChange={(e) => updateField('karnofskyScore', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Skor Karnofsky</option>
            {Object.entries(KARNOFSKY_DESCRIPTIONS).reverse().map(([score, description]) => (
              <option key={score} value={score}>
                {score} - {description}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Skala 0-100 untuk menilai kemampuan fungsional pasien (0 = meninggal, 100 = normal)
          </p>
        </div>

        {/* Pain Scale (VAS) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skala Nyeri (VAS 0-10)
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={sectionData.painScale || 0}
              onChange={(e) => updateField('painScale', parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-500 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #86efac 0%, #fde047 50%, #ef4444 100%)`,
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">0 (Tidak nyeri)</span>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {sectionData.painScale ?? 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {getPainDescription(sectionData.painScale)}
                </div>
              </div>
              <span className="text-sm text-gray-600">10 (Sangat nyeri)</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Visual Analog Scale (VAS): 0 = tidak ada nyeri, 10 = nyeri terburuk yang bisa dibayangkan
          </p>
        </div>

        {/* Duration of Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durasi Gejala (bulan)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={sectionData.durationOfSymptoms || ''}
            onChange={(e) => updateField('durationOfSymptoms', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Contoh: 3 (untuk 3 bulan)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Berapa lama pasien mengalami gejala (dalam bulan)
          </p>
        </div>
      </div>

      {/* Anthropometric Measurements */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pengukuran Antropometri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tinggi Badan (cm)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={sectionData.height || ''}
              onChange={(e) => updateField('height', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Contoh: 170"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Berat Badan (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={sectionData.weight || ''}
              onChange={(e) => updateField('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Contoh: 65"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* BMI Display */}
        {sectionData.bmi && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Body Mass Index (BMI)</p>
                <p className="text-xs text-blue-700 mt-1">
                  Dihitung otomatis dari tinggi dan berat badan
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900">
                  {sectionData.bmi.toFixed(1)}
                </div>
                <div className={`text-sm font-medium ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clinical History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Riwayat Klinis
        </h3>

        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keluhan Utama <span className="text-red-500">*</span>
          </label>
          <textarea
            value={sectionData.chiefComplaint || ''}
            onChange={(e) => updateField('chiefComplaint', e.target.value)}
            rows={3}
            placeholder="Contoh: Benjolan di paha kanan yang membesar sejak 6 bulan terakhir, disertai nyeri saat beraktivitas"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Keluhan utama yang membawa pasien datang ke rumah sakit
          </p>
        </div>

        {/* Comorbidities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Komorbiditas
          </label>
          <textarea
            value={sectionData.comorbidities || ''}
            onChange={(e) => updateField('comorbidities', e.target.value)}
            rows={3}
            placeholder="Contoh: Diabetes Melitus tipe 2, Hipertensi, Osteoarthritis"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Penyakit penyerta atau kondisi medis lain yang dimiliki pasien
          </p>
        </div>
      </div>

      {/* Physical Examination */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pemeriksaan Fisik
        </h3>

        {/* Swelling */}
        <div>
          <label className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              checked={sectionData.swellingPresent || false}
              onChange={(e) => updateField('swellingPresent', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Terdapat pembengkakan/massa
            </span>
          </label>

          {sectionData.swellingPresent && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukuran Pembengkakan/Massa
              </label>
              <input
                type="text"
                value={sectionData.swellingSize || ''}
                onChange={(e) => updateField('swellingSize', e.target.value)}
                placeholder="Contoh: 10 x 8 x 5 cm"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Skin Changes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Perubahan Kulit
          </label>
          <input
            type="text"
            value={sectionData.skinChanges || ''}
            onChange={(e) => updateField('skinChanges', e.target.value)}
            placeholder="Contoh: Eritema, ulserasi, peningkatan suhu lokal"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Neurovascular Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Neurovaskular
          </label>
          <select
            value={sectionData.neurovascularStatus || ''}
            onChange={(e) => updateField('neurovascularStatus', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Status</option>
            <option value="Normal">Normal - Tidak ada defisit</option>
            <option value="Compromised">Terganggu - Ada defisit neurologis/vaskular</option>
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Penilaian fungsi saraf dan pembuluh darah di sekitar tumor
          </p>
        </div>

        {/* Range of Motion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rentang Gerak (Range of Motion)
          </label>
          <input
            type="text"
            value={sectionData.rangeOfMotion || ''}
            onChange={(e) => updateField('rangeOfMotion', e.target.value)}
            placeholder="Contoh: Fleksi 90°, Ekstensi penuh, Terbatas 50% pada abduksi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Penilaian rentang gerak sendi yang terkait dengan lokasi tumor
          </p>
        </div>
      </div>

      {/* Clinical Photography */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Foto Klinis (Opsional)
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Fitur Upload Foto Akan Segera Tersedia</p>
              <p className="mt-1">
                Upload foto klinis dengan berbagai sudut pandang (anterior, posterior, lateral) untuk dokumentasi komprehensif.
              </p>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Upload foto klinis pasien
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Rekomendasi: minimal 3 sudut pandang (anterior, lateral, posterior)
          </p>
        </div>
      </div>

      {/* Summary Indicator */}
      {sectionData.chiefComplaint && sectionData.karnofskyScore !== undefined && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-green-600 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-green-900">Data Klinis Minimum Lengkap</p>
              <div className="mt-2 text-green-800 space-y-1">
                <p><span className="font-semibold">Karnofsky Score:</span> {sectionData.karnofskyScore}</p>
                <p><span className="font-semibold">Pain Scale:</span> {sectionData.painScale ?? 0}/10</p>
                {sectionData.bmi && (
                  <p><span className="font-semibold">BMI:</span> {sectionData.bmi.toFixed(1)} ({bmiCategory.label})</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
