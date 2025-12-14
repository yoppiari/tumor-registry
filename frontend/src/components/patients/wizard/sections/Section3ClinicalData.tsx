'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';
import { ClinicalPhotoUpload, ClinicalPhoto } from '../../../upload/ClinicalPhotoUpload';

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

  // Clinical History (Anamnesa)
  chiefComplaint?: string;        // Main presenting symptom
  durationOfSymptoms?: number;    // In months
  comorbidities?: string;         // Comma-separated or free text
  cancerHistory?: string;         // INAMSOS: Riwayat Kanker Pribadi
  familyCancerHistory?: string;   // INAMSOS: Riwayat Kanker Keluarga

  // Physical Examination - Musculoskeletal Specific
  swellingPresent?: boolean;
  swellingSize?: string;          // e.g., "10x8 cm"
  skinChanges?: string;
  neurovascularStatus?: string;   // "Normal" | "Compromised"
  rangeOfMotion?: string;         // e.g., "Full" | "Limited (50%)"

  // Physical Examination - INAMSOS Structured (General)
  physicalExamGeneral?: string;        // Status Generalisata
  physicalExamHeadNeck?: string;       // Kepala & Leher
  physicalExamThorax?: string;         // Thoraks
  physicalExamAbdomen?: string;        // Abdomen
  physicalExamExtremitiesSpine?: string; // Ekstremitas & Tulang Belakang

  // Local Tumor Examination
  localTumorStatus?: string;      // INAMSOS: Status Lokalisata (pemeriksaan lokal tumor)

  // Clinical Photos
  clinicalPhotos?: ClinicalPhoto[];
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
  const savedData = (getSection('section3') as Partial<Section3Data>) || {};
  const sectionData: Partial<Section3Data> = {
    karnofskyScore: savedData.karnofskyScore,
    painScale: savedData.painScale || 0,
    height: savedData.height,
    weight: savedData.weight,
    bmi: savedData.bmi,
    chiefComplaint: savedData.chiefComplaint || '',
    durationOfSymptoms: savedData.durationOfSymptoms,
    comorbidities: savedData.comorbidities || '',
    cancerHistory: savedData.cancerHistory || '',
    familyCancerHistory: savedData.familyCancerHistory || '',
    swellingPresent: savedData.swellingPresent || false,
    swellingSize: savedData.swellingSize || '',
    skinChanges: savedData.skinChanges || '',
    neurovascularStatus: savedData.neurovascularStatus || '',
    rangeOfMotion: savedData.rangeOfMotion || '',
    physicalExamGeneral: savedData.physicalExamGeneral || '',
    physicalExamHeadNeck: savedData.physicalExamHeadNeck || '',
    physicalExamThorax: savedData.physicalExamThorax || '',
    physicalExamAbdomen: savedData.physicalExamAbdomen || '',
    physicalExamExtremitiesSpine: savedData.physicalExamExtremitiesSpine || '',
    localTumorStatus: savedData.localTumorStatus || '',
    clinicalPhotos: savedData.clinicalPhotos || [],
  };

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

        {/* Cancer History - INAMSOS Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Riwayat Kanker Pribadi
          </label>
          <textarea
            value={sectionData.cancerHistory || ''}
            onChange={(e) => updateField('cancerHistory', e.target.value)}
            rows={3}
            placeholder="Contoh: Riwayat osteosarcoma femur kanan pada usia 25 tahun (2015), sudah dilakukan amputasi dan kemoterapi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Riwayat kanker yang pernah diderita pasien sebelumnya (jika ada)
          </p>
        </div>

        {/* Family Cancer History - INAMSOS Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Riwayat Kanker Keluarga
          </label>
          <textarea
            value={sectionData.familyCancerHistory || ''}
            onChange={(e) => updateField('familyCancerHistory', e.target.value)}
            rows={3}
            placeholder="Contoh: Ayah - Ca Kolon (meninggal usia 60 tahun), Kakak - Leukemia (sembuh)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Riwayat kanker pada keluarga pasien (orang tua, saudara kandung, anak)
          </p>
        </div>
      </div>

      {/* Physical Examination - Musculoskeletal Specific */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pemeriksaan Fisik - Muskuloskeletal Spesifik
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Pemeriksaan fisik yang spesifik untuk tumor muskuloskeletal
        </p>

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

      {/* INAMSOS Structured Physical Examination */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pemeriksaan Fisik Terstruktur (INAMSOS)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Pemeriksaan fisik sistemik menurut standar INAMSOS
        </p>

        {/* Status Generalisata */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Generalisata
          </label>
          <textarea
            value={sectionData.physicalExamGeneral || ''}
            onChange={(e) => updateField('physicalExamGeneral', e.target.value)}
            rows={3}
            placeholder="Contoh: Keadaan umum baik, kesadaran compos mentis, gizi baik, tekanan darah 120/80 mmHg, nadi 80x/menit, nafas 20x/menit, suhu 36.5°C"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Kondisi umum pasien, tanda-tanda vital, dan status gizi
          </p>
        </div>

        {/* Kepala & Leher */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kepala & Leher
          </label>
          <textarea
            value={sectionData.physicalExamHeadNeck || ''}
            onChange={(e) => updateField('physicalExamHeadNeck', e.target.value)}
            rows={2}
            placeholder="Contoh: Konjungtiva anemis (-/-), sklera ikterik (-/-), tidak ada pembesaran KGB leher"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Thoraks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thoraks (Paru & Jantung)
          </label>
          <textarea
            value={sectionData.physicalExamThorax || ''}
            onChange={(e) => updateField('physicalExamThorax', e.target.value)}
            rows={2}
            placeholder="Contoh: Simetris, retraksi (-), suara napas vesikuler +/+, ronki -/-, wheezing -/-, bunyi jantung I-II reguler, murmur (-)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Abdomen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Abdomen
          </label>
          <textarea
            value={sectionData.physicalExamAbdomen || ''}
            onChange={(e) => updateField('physicalExamAbdomen', e.target.value)}
            rows={2}
            placeholder="Contoh: Datar, supel, bising usus (+) normal, nyeri tekan (-), hepatomegali (-), splenomegali (-)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ekstremitas & Tulang Belakang */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ekstremitas & Tulang Belakang
          </label>
          <textarea
            value={sectionData.physicalExamExtremitiesSpine || ''}
            onChange={(e) => updateField('physicalExamExtremitiesSpine', e.target.value)}
            rows={3}
            placeholder="Contoh: Tidak ada deformitas tulang belakang, ekstremitas atas dalam batas normal, ekstremitas bawah kanan terdapat massa (lihat pemeriksaan lokal)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Pemeriksaan ekstremitas secara umum dan tulang belakang
          </p>
        </div>
      </div>

      {/* Local Tumor Examination - CRITICAL */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 space-y-4">
        <div className="flex items-start">
          <svg className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Status Lokalisata (Pemeriksaan Lokal Tumor) - CRITICAL
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              Pemeriksaan fokus pada lokasi tumor - SANGAT PENTING untuk dokumentasi INAMSOS
            </p>

            <label className="block text-sm font-medium text-yellow-900 mb-2">
              Deskripsi Pemeriksaan Lokal
            </label>
            <textarea
              value={sectionData.localTumorStatus || ''}
              onChange={(e) => updateField('localTumorStatus', e.target.value)}
              rows={5}
              placeholder="Contoh:&#10;Look: Massa di 1/3 distal femur kanan, ukuran ±12x10x8 cm, batas tidak tegas, kulit di atasnya tampak eritema&#10;Feel: Massa teraba keras, tidak mobile, nyeri tekan (+), peningkatan suhu lokal (+), tidak ada fluktuasi&#10;Move: ROM lutut kanan terbatas 50%, nyeri saat fleksi, krepitasi (-)&#10;Neurovaskular: CRT <2 detik, pulsasi a. dorsalis pedis (+) kuat, sensibilitas utuh, motorik 5/5"
              className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
            />
            <p className="mt-2 text-xs text-yellow-700">
              <strong>Format Look-Feel-Move:</strong> Inspeksi (Look), Palpasi (Feel), Range of Motion (Move), Status Neurovaskular
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Photography */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Foto Klinis (Opsional)
        </h3>

        <ClinicalPhotoUpload
          patientId={undefined} // Will be set when patient is created
          onPhotosChange={(photos) => updateField('clinicalPhotos', photos)}
          maxPhotos={10}
          maxFileSizeMB={10}
        />
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
                {sectionData.clinicalPhotos && sectionData.clinicalPhotos.length > 0 && (
                  <p><span className="font-semibold">Foto Klinis:</span> {sectionData.clinicalPhotos.length} foto</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
