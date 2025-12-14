'use client';

import React, { useState } from 'react';
import { useFormContext } from '../FormContext';

/**
 * LaboratoryTests Sub-component
 *
 * Comprehensive laboratory test data collection based on INAMSOS requirements
 *
 * Categories:
 * - Critical Tumor Markers (REQUIRED): ALP, LDH, Calcium, Phosphate
 * - Hematology: CBC, ESR, CRP
 * - Organ Function: Creatinine, BUN, SGOT, SGPT, Albumin
 * - Advanced Tumor Markers (Optional): CEA, PSA, Ca 125, Ca 19-9, AFP
 * - Specialized: Serum Electrophoresis, Bence Jones Protein
 */

export interface LaboratoryTestsData {
  // Test Date
  testDate?: string;

  // Critical Tumor Markers (REQUIRED)
  alkalinePhosphatase?: number;  // ALP - U/L *
  ldh?: number;                  // Lactate Dehydrogenase - U/L *
  calcium?: number;              // mg/dL *
  phosphate?: number;            // mg/dL *

  // Hematology
  cbc?: string;                  // Complete Blood Count - text field
  esr?: number;                  // LED (Erythrocyte Sedimentation Rate) - mm/hr
  crp?: number;                  // C-Reactive Protein - mg/L

  // Organ Function Tests
  creatinine?: number;           // RFT (Renal Function Test) - mg/dL
  bun?: number;                  // Blood Urea Nitrogen - mg/dL
  sgot?: number;                 // LFT (Liver Function Test) - U/L
  sgpt?: number;                 // LFT (Liver Function Test) - U/L
  albumin?: number;              // g/dL

  // Advanced Tumor Markers (Optional)
  cea?: number;                  // Carcinoembryonic Antigen - ng/mL
  psa?: number;                  // Prostate-Specific Antigen - ng/mL
  ca125?: number;                // Cancer Antigen 125 - U/mL
  ca199?: number;                // Cancer Antigen 19-9 - U/mL
  afp?: number;                  // Alpha-Fetoprotein - ng/mL

  // Specialized
  serumElectrophoresis?: string; // text
  benceJonesProtein?: boolean;   // boolean
}

interface LaboratoryTestsProps {
  sectionId?: string; // Default: 'section4'
  subsectionKey?: string; // Default: 'laboratoryTests'
}

export function LaboratoryTests({
  sectionId = 'section4',
  subsectionKey = 'laboratoryTests'
}: LaboratoryTestsProps) {
  const { getSection, updateSection } = useFormContext();
  const [showAdvancedMarkers, setShowAdvancedMarkers] = useState(false);

  // Get current section data
  const sectionData = getSection(sectionId);
  const labData: LaboratoryTestsData = sectionData?.[subsectionKey] || {};

  // Update laboratory test field
  const updateLabField = <K extends keyof LaboratoryTestsData>(
    field: K,
    value: LaboratoryTestsData[K]
  ) => {
    updateSection(sectionId, {
      ...sectionData,
      [subsectionKey]: {
        ...labData,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Hasil Laboratorium
        </h3>
        <p className="text-sm text-gray-600">
          Lengkapi hasil pemeriksaan laboratorium. Penanda tumor kritis (ALP, LDH, Kalsium, Fosfat) wajib diisi.
        </p>
      </div>

      {/* Test Date */}
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Pemeriksaan
        </label>
        <input
          type="date"
          value={labData.testDate || ''}
          onChange={(e) => updateLabField('testDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Critical Tumor Markers (REQUIRED) */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <svg
            className="h-5 w-5 text-yellow-600 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h4 className="text-md font-semibold text-yellow-900">
            Penanda Tumor Kritis (WAJIB)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ALP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ALP (Alkaline Phosphatase) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.alkalinePhosphatase || ''}
                onChange={(e) => updateLabField('alkalinePhosphatase', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 30-120"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                U/L
              </span>
            </div>
          </div>

          {/* LDH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LDH (Lactate Dehydrogenase) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.ldh || ''}
                onChange={(e) => updateLabField('ldh', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 140-280"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                U/L
              </span>
            </div>
          </div>

          {/* Calcium */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kalsium (Calcium) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={labData.calcium || ''}
                onChange={(e) => updateLabField('calcium', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 8.5-10.5"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                mg/dL
              </span>
            </div>
          </div>

          {/* Phosphate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fosfat (Phosphate) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={labData.phosphate || ''}
                onChange={(e) => updateLabField('phosphate', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 2.5-4.5"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                mg/dL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hematology */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Hematologi
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {/* CBC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CBC (Complete Blood Count)
            </label>
            <textarea
              value={labData.cbc || ''}
              onChange={(e) => updateLabField('cbc', e.target.value)}
              rows={3}
              placeholder="Contoh: Hb 13.2 g/dL, Leukosit 8500/uL, Trombosit 245000/uL, Hematokrit 39%"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ESR (LED) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ESR / LED (Erythrocyte Sedimentation Rate)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={labData.esr || ''}
                  onChange={(e) => updateLabField('esr', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: 0-20 (M), 0-30 (F)"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  mm/hr
                </span>
              </div>
            </div>

            {/* CRP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CRP (C-Reactive Protein)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={labData.crp || ''}
                  onChange={(e) => updateLabField('crp', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <5"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  mg/L
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organ Function Tests */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Fungsi Organ
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Creatinine (RFT) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kreatinin (RFT)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={labData.creatinine || ''}
                onChange={(e) => updateLabField('creatinine', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 0.6-1.2"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                mg/dL
              </span>
            </div>
          </div>

          {/* BUN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BUN (Blood Urea Nitrogen)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.bun || ''}
                onChange={(e) => updateLabField('bun', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 7-20"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                mg/dL
              </span>
            </div>
          </div>

          {/* SGOT (LFT) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SGOT / AST (LFT)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.sgot || ''}
                onChange={(e) => updateLabField('sgot', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 5-40"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                U/L
              </span>
            </div>
          </div>

          {/* SGPT (LFT) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SGPT / ALT (LFT)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.sgpt || ''}
                onChange={(e) => updateLabField('sgpt', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 7-56"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                U/L
              </span>
            </div>
          </div>

          {/* Albumin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Albumin
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={labData.albumin || ''}
                onChange={(e) => updateLabField('albumin', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Normal: 3.5-5.0"
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                g/dL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Tumor Markers (Collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvancedMarkers(!showAdvancedMarkers)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
        >
          <h4 className="text-md font-semibold text-gray-900">
            Penanda Tumor Lanjutan (Opsional)
          </h4>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${showAdvancedMarkers ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvancedMarkers && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CEA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEA (Carcinoembryonic Antigen)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={labData.cea || ''}
                  onChange={(e) => updateLabField('cea', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <5"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ng/mL
                </span>
              </div>
            </div>

            {/* PSA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PSA (Prostate-Specific Antigen)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={labData.psa || ''}
                  onChange={(e) => updateLabField('psa', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <4"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ng/mL
                </span>
              </div>
            </div>

            {/* CA 125 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CA 125 (Cancer Antigen 125)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={labData.ca125 || ''}
                  onChange={(e) => updateLabField('ca125', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <35"
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  U/mL
                </span>
              </div>
            </div>

            {/* CA 19-9 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CA 19-9 (Cancer Antigen 19-9)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={labData.ca199 || ''}
                  onChange={(e) => updateLabField('ca199', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <37"
                  className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  U/mL
                </span>
              </div>
            </div>

            {/* AFP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AFP (Alpha-Fetoprotein)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={labData.afp || ''}
                  onChange={(e) => updateLabField('afp', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Normal: <10"
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ng/mL
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Specialized Tests */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Pemeriksaan Khusus
        </h4>

        <div className="space-y-4">
          {/* Serum Electrophoresis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elektroforesis Serum
            </label>
            <textarea
              value={labData.serumElectrophoresis || ''}
              onChange={(e) => updateLabField('serumElectrophoresis', e.target.value)}
              rows={2}
              placeholder="Hasil elektroforesis protein serum"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Bence Jones Protein */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="benceJonesProtein"
              checked={labData.benceJonesProtein || false}
              onChange={(e) => updateLabField('benceJonesProtein', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="benceJonesProtein" className="ml-2 text-sm font-medium text-gray-700">
              Bence Jones Protein terdeteksi
            </label>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Informasi Penting:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Penanda tumor kritis (ALP, LDH, Kalsium, Fosfat) wajib diisi untuk analisis risiko</li>
              <li>Nilai normal dapat bervariasi antar laboratorium</li>
              <li>Hasil dapat digunakan untuk monitoring respons terapi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaboratoryTests;
