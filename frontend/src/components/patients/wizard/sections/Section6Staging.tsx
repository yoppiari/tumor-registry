'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 6: Tumor Staging
 *
 * Captures comprehensive staging information using two major systems:
 *
 * 1. **Enneking Staging System** (Musculoskeletal Tumor Society)
 *    - Specifically designed for musculoskeletal tumors
 *    - Components: Grade (G), Site (T), Metastasis (M)
 *    - Stages: IA, IB, IIA, IIB, III
 *
 * 2. **AJCC Staging System** (American Joint Committee on Cancer)
 *    - TNM Classification: Tumor (T), Nodes (N), Metastasis (M)
 *    - Overall Stages: I, II, III, IV (with subcategories)
 */

interface EnnekingStaging {
  grade?: 'LOW' | 'HIGH';                    // G1 (low) or G2 (high)
  site?: 'INTRACOMPARTMENTAL' | 'EXTRACOMPARTMENTAL';  // T1 or T2
  metastasis?: 'NO' | 'YES';                 // M0 or M1
  stage?: 'IA' | 'IB' | 'IIA' | 'IIB' | 'III';  // Auto-calculated
  description?: string;                      // Staging description
}

interface AJCCStaging {
  // Primary Tumor (T)
  t?: 'TX' | 'T0' | 'T1' | 'T2' | 'T3' | 'T4';
  tSubcategory?: string;  // e.g., "a", "b"

  // Regional Lymph Nodes (N)
  n?: 'NX' | 'N0' | 'N1' | 'N2' | 'N3';
  nSubcategory?: string;

  // Distant Metastasis (M)
  m?: 'M0' | 'M1' | 'M1a' | 'M1b';

  // Grade
  grade?: 'GX' | 'G1' | 'G2' | 'G3' | 'G4';

  // Overall Stage
  stage?: 'I' | 'IA' | 'IB' | 'II' | 'IIA' | 'IIB' | 'III' | 'IIIA' | 'IIIB' | 'IV' | 'IVA' | 'IVB';

  // Edition
  ajccEdition?: '8th' | '7th';
}

interface Section6Data {
  stagingSystem?: 'ENNEKING' | 'AJCC' | 'BOTH';
  enneking?: EnnekingStaging;
  ajcc?: AJCCStaging;
  stagingDate?: string;
  stagingNotes?: string;
}

// Enneking Staging Descriptions
const ENNEKING_STAGES = {
  IA: 'Stage IA - Low grade, Intracompartmental, No metastasis',
  IB: 'Stage IB - Low grade, Extracompartmental, No metastasis',
  IIA: 'Stage IIA - High grade, Intracompartmental, No metastasis',
  IIB: 'Stage IIB - High grade, Extracompartmental, No metastasis',
  III: 'Stage III - Any grade, Any site, Regional or distant metastasis',
};

export function Section6Staging() {
  const { getSection, updateSection } = useFormContext();
  const savedData = (getSection('section6') as Section6Data) || {};
  const sectionData: Section6Data = {
    stagingSystem: savedData.stagingSystem || 'BOTH',
    enneking: savedData.enneking || {},
    ajcc: savedData.ajcc || {},
    stagingDate: savedData.stagingDate || '',
    stagingNotes: savedData.stagingNotes || '',
  };

  // Auto-calculate Enneking stage
  useEffect(() => {
    const { grade, site, metastasis } = sectionData.enneking || {};

    if (grade && site && metastasis) {
      let stage: EnnekingStaging['stage'];
      let description: string;

      if (metastasis === 'YES') {
        stage = 'III';
        description = ENNEKING_STAGES.III;
      } else if (grade === 'LOW' && site === 'INTRACOMPARTMENTAL') {
        stage = 'IA';
        description = ENNEKING_STAGES.IA;
      } else if (grade === 'LOW' && site === 'EXTRACOMPARTMENTAL') {
        stage = 'IB';
        description = ENNEKING_STAGES.IB;
      } else if (grade === 'HIGH' && site === 'INTRACOMPARTMENTAL') {
        stage = 'IIA';
        description = ENNEKING_STAGES.IIA;
      } else if (grade === 'HIGH' && site === 'EXTRACOMPARTMENTAL') {
        stage = 'IIB';
        description = ENNEKING_STAGES.IIB;
      } else {
        return; // Invalid combination
      }

      // Update if changed
      if (sectionData.enneking?.stage !== stage) {
        updateSection('section6', {
          ...sectionData,
          enneking: {
            ...sectionData.enneking,
            grade,
            site,
            metastasis,
            stage,
            description,
          },
        });
      }
    }
  }, [sectionData.enneking?.grade, sectionData.enneking?.site, sectionData.enneking?.metastasis]);

  const updateEnneking = <K extends keyof EnnekingStaging>(field: K, value: EnnekingStaging[K]) => {
    updateSection('section6', {
      ...sectionData,
      enneking: {
        ...sectionData.enneking,
        [field]: value,
      },
    });
  };

  const updateAJCC = <K extends keyof AJCCStaging>(field: K, value: AJCCStaging[K]) => {
    updateSection('section6', {
      ...sectionData,
      ajcc: {
        ...sectionData.ajcc,
        [field]: value,
      },
    });
  };

  const updateField = <K extends keyof Section6Data>(field: K, value: Section6Data[K]) => {
    updateSection('section6', {
      ...sectionData,
      [field]: value,
    });
  };

  const showEnneking = sectionData.stagingSystem === 'ENNEKING' || sectionData.stagingSystem === 'BOTH';
  const showAJCC = sectionData.stagingSystem === 'AJCC' || sectionData.stagingSystem === 'BOTH';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Stadium Tumor (Tumor Staging)
        </h2>
        <p className="text-gray-600">
          Tentukan stadium tumor menggunakan sistem Enneking dan/atau AJCC
        </p>
      </div>

      {/* Staging System Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Sistem Stadium <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'ENNEKING', label: 'Enneking', description: 'Khusus tumor muskuloskeletal' },
            { value: 'AJCC', label: 'AJCC TNM', description: 'Sistem TNM standar' },
            { value: 'BOTH', label: 'Keduanya', description: 'Enneking + AJCC' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('stagingSystem', option.value as Section6Data['stagingSystem'])}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                ${
                  sectionData.stagingSystem === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }
              `}
            >
              <div className={`font-semibold mb-1 ${sectionData.stagingSystem === option.value ? 'text-blue-900' : 'text-gray-900'}`}>
                {option.label}
              </div>
              <div className={`text-sm ${sectionData.stagingSystem === option.value ? 'text-blue-700' : 'text-gray-600'}`}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enneking Staging */}
      {showEnneking && (
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border-2 border-purple-200 p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Enneking Staging System
          </h3>
          <p className="text-sm text-purple-700 mb-6">
            Sistem stadium khusus untuk tumor muskuloskeletal berdasarkan grade, kompartemen, dan metastasis
          </p>

          <div className="space-y-6">
            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Grade (Derajat Keganasan) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateEnneking('grade', 'LOW')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.grade === 'LOW'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">G1 - Low Grade</div>
                  <div className="text-sm mt-1 opacity-80">Derajat rendah / jinak</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateEnneking('grade', 'HIGH')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.grade === 'HIGH'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">G2 - High Grade</div>
                  <div className="text-sm mt-1 opacity-80">Derajat tinggi / ganas</div>
                </button>
              </div>
            </div>

            {/* Site/Compartment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lokasi (Kompartemen) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateEnneking('site', 'INTRACOMPARTMENTAL')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.site === 'INTRACOMPARTMENTAL'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">T1 - Intracompartmental</div>
                  <div className="text-sm mt-1 opacity-80">Terbatas dalam satu kompartemen</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateEnneking('site', 'EXTRACOMPARTMENTAL')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.site === 'EXTRACOMPARTMENTAL'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">T2 - Extracompartmental</div>
                  <div className="text-sm mt-1 opacity-80">Meluas ke luar kompartemen</div>
                </button>
              </div>
            </div>

            {/* Metastasis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Metastasis <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateEnneking('metastasis', 'NO')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.metastasis === 'NO'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">M0 - Tidak ada</div>
                  <div className="text-sm mt-1 opacity-80">Tidak ada metastasis</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateEnneking('metastasis', 'YES')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.enneking?.metastasis === 'YES'
                        ? 'border-purple-600 bg-purple-100 text-purple-900'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }
                  `}
                >
                  <div className="font-semibold">M1 - Ada</div>
                  <div className="text-sm mt-1 opacity-80">Regional atau distant metastasis</div>
                </button>
              </div>
            </div>

            {/* Calculated Enneking Stage */}
            {sectionData.enneking?.stage && (
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90 mb-1">Stadium Enneking</div>
                    <div className="text-3xl font-bold">{sectionData.enneking.stage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">{sectionData.enneking.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AJCC Staging */}
      {showAJCC && (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border-2 border-blue-200 p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            AJCC TNM Staging System
          </h3>
          <p className="text-sm text-blue-700 mb-6">
            Sistem stadium TNM dari American Joint Committee on Cancer
          </p>

          <div className="space-y-6">
            {/* AJCC Edition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AJCC Edition
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateAJCC('ajccEdition', '8th')}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${
                      sectionData.ajcc?.ajccEdition === '8th'
                        ? 'border-blue-600 bg-blue-100 text-blue-900'
                        : 'border-gray-300 bg-white hover:border-blue-400'
                    }
                  `}
                >
                  8th Edition (2017)
                </button>

                <button
                  type="button"
                  onClick={() => updateAJCC('ajccEdition', '7th')}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${
                      sectionData.ajcc?.ajccEdition === '7th'
                        ? 'border-blue-600 bg-blue-100 text-blue-900'
                        : 'border-gray-300 bg-white hover:border-blue-400'
                    }
                  `}
                >
                  7th Edition (2010)
                </button>
              </div>
            </div>

            {/* T - Primary Tumor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                T - Primary Tumor (Tumor Primer) <span className="text-red-500">*</span>
              </label>
              <select
                value={sectionData.ajcc?.t || ''}
                onChange={(e) => updateAJCC('t', e.target.value as AJCCStaging['t'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih klasifikasi T</option>
                <option value="TX">TX - Tumor primer tidak dapat dinilai</option>
                <option value="T0">T0 - Tidak ada bukti tumor primer</option>
                <option value="T1">T1 - Tumor ≤ 5 cm</option>
                <option value="T2">T2 - Tumor &gt; 5 cm tapi ≤ 10 cm</option>
                <option value="T3">T3 - Tumor &gt; 10 cm tapi ≤ 15 cm</option>
                <option value="T4">T4 - Tumor &gt; 15 cm</option>
              </select>
            </div>

            {/* N - Regional Lymph Nodes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                N - Regional Lymph Nodes (Kelenjar Getah Bening Regional) <span className="text-red-500">*</span>
              </label>
              <select
                value={sectionData.ajcc?.n || ''}
                onChange={(e) => updateAJCC('n', e.target.value as AJCCStaging['n'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih klasifikasi N</option>
                <option value="NX">NX - Kelenjar getah bening regional tidak dapat dinilai</option>
                <option value="N0">N0 - Tidak ada metastasis kelenjar getah bening regional</option>
                <option value="N1">N1 - Metastasis kelenjar getah bening regional</option>
              </select>
            </div>

            {/* M - Distant Metastasis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                M - Distant Metastasis (Metastasis Jauh) <span className="text-red-500">*</span>
              </label>
              <select
                value={sectionData.ajcc?.m || ''}
                onChange={(e) => updateAJCC('m', e.target.value as AJCCStaging['m'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih klasifikasi M</option>
                <option value="M0">M0 - Tidak ada metastasis jauh</option>
                <option value="M1">M1 - Metastasis jauh</option>
                <option value="M1a">M1a - Metastasis paru</option>
                <option value="M1b">M1b - Metastasis lokasi lain</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                G - Histologic Grade (Grade Histologi) <span className="text-red-500">*</span>
              </label>
              <select
                value={sectionData.ajcc?.grade || ''}
                onChange={(e) => updateAJCC('grade', e.target.value as AJCCStaging['grade'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih grade histologi</option>
                <option value="GX">GX - Grade tidak dapat ditentukan</option>
                <option value="G1">G1 - Well differentiated (diferensiasi baik)</option>
                <option value="G2">G2 - Moderately differentiated (diferensiasi sedang)</option>
                <option value="G3">G3 - Poorly differentiated (diferensiasi buruk)</option>
                <option value="G4">G4 - Undifferentiated (tidak terdiferensiasi)</option>
              </select>
            </div>

            {/* Overall Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Stage (Stadium Keseluruhan) <span className="text-red-500">*</span>
              </label>
              <select
                value={sectionData.ajcc?.stage || ''}
                onChange={(e) => updateAJCC('stage', e.target.value as AJCCStaging['stage'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih stadium keseluruhan</option>
                <option value="I">Stage I</option>
                <option value="IA">Stage IA</option>
                <option value="IB">Stage IB</option>
                <option value="II">Stage II</option>
                <option value="IIA">Stage IIA</option>
                <option value="IIB">Stage IIB</option>
                <option value="III">Stage III</option>
                <option value="IIIA">Stage IIIA</option>
                <option value="IIIB">Stage IIIB</option>
                <option value="IV">Stage IV</option>
                <option value="IVA">Stage IVA</option>
                <option value="IVB">Stage IVB</option>
              </select>
            </div>

            {/* TNM Summary */}
            {sectionData.ajcc?.t && sectionData.ajcc?.n && sectionData.ajcc?.m && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-90 mb-1">TNM Classification</div>
                    <div className="text-2xl font-bold">
                      {sectionData.ajcc.t}{sectionData.ajcc.n}{sectionData.ajcc.m}
                    </div>
                  </div>
                  {sectionData.ajcc.stage && (
                    <div className="text-right">
                      <div className="text-sm opacity-90 mb-1">Overall Stage</div>
                      <div className="text-2xl font-bold">{sectionData.ajcc.stage}</div>
                    </div>
                  )}
                </div>
                {sectionData.ajcc.grade && (
                  <div className="mt-3 pt-3 border-t border-blue-500">
                    <span className="text-sm opacity-90">Grade: </span>
                    <span className="font-semibold">{sectionData.ajcc.grade}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staging Date & Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Staging
            </label>
            <input
              type="date"
              value={sectionData.stagingDate || ''}
              onChange={(e) => updateField('stagingDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan Staging
            </label>
            <textarea
              value={sectionData.stagingNotes || ''}
              onChange={(e) => updateField('stagingNotes', e.target.value)}
              rows={4}
              placeholder="Catatan tambahan mengenai staging, misalnya alasan pemilihan sistem tertentu, temuan klinis yang mempengaruhi staging, dll."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Completion Summary */}
      {((showEnneking && sectionData.enneking?.stage) || (showAJCC && sectionData.ajcc?.stage)) && (
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
            <div className="text-sm text-green-800">
              <span className="font-medium">Staging lengkap.</span> Anda dapat melanjutkan ke bagian selanjutnya.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
