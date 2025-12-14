'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 4: Diagnostic Investigations
 *
 * Captures comprehensive diagnostic workup:
 * - Laboratory Results (CBC, tumor markers, chemistry panel)
 * - Radiology Findings (X-ray, CT, MRI, PET scan)
 * - Mirrel Score Calculator (pathological fracture risk: 3-12 points)
 * - HUVOS Grade (chemotherapy response grading: I-IV)
 * - Pathology Report details
 */

interface LaboratoryData {
  hemoglobin?: number;          // g/dL
  leukocytes?: number;          // x10^9/L
  platelets?: number;           // x10^9/L
  alkalinePhosphatase?: number; // U/L (tumor marker for bone)
  ldh?: number;                 // U/L (Lactate Dehydrogenase)
  calcium?: number;             // mg/dL
  albumin?: number;             // g/dL
}

interface RadiologyData {
  xrayFindings?: string;
  ctFindings?: string;
  mriFindings?: string;
  petScanFindings?: string;
  bonescanFindings?: string;
}

interface MirrelScoreData {
  siteScore?: number;           // 1-3 points (Upper limb=1, Lower limb=2, Peritrochanteric=3)
  painScore?: number;           // 1-3 points (Mild=1, Moderate=2, Functional=3)
  lesionType?: 'BLASTIC' | 'MIXED' | 'LYTIC'; // Blastic=1, Mixed=2, Lytic=3
  sizeScore?: number;           // 1-3 points (<1/3=1, 1/3-2/3=2, >2/3=3)
  totalScore?: number;          // 3-12 (auto-calculated)
  fractureRisk?: string;        // LOW (≤7), MODERATE (8-10), HIGH (≥11)
}

interface IHKMarker {
  marker: string;               // e.g., 'S100', 'HER2', 'ER', 'PR', 'CD34'
  result: string;               // e.g., 'Positive', 'Negative', 'Borderline', 'Score 3+', 'Score 2+'
}

interface PathologyData {
  biopsyType?: string;          // "Core needle" | "Incisional" | "Excisional"
  biopsyDate?: string;
  pathologyFindings?: string;
  huvosGrade?: 'GRADE_I' | 'GRADE_II' | 'GRADE_III' | 'GRADE_IV';
  necrosisPercentage?: number;  // For HUVOS grade
  ihkMarkers?: IHKMarker[];     // Immunohistochemistry markers
}

interface Section4Data {
  laboratory?: LaboratoryData;
  radiology?: RadiologyData;
  mirrelScore?: MirrelScoreData;
  pathology?: PathologyData;
}

const HUVOS_GRADES = {
  GRADE_I: 'Grade I - Sedikit/tidak ada nekrosis (<50%)',
  GRADE_II: 'Grade II - Nekrosis 50-90%',
  GRADE_III: 'Grade III - Nekrosis 90-99%',
  GRADE_IV: 'Grade IV - Nekrosis 100% (no viable tumor)',
};

export function Section4DiagnosticInvestigations() {
  const { getSection, updateSection } = useFormContext();
  const savedData = (getSection('section4') as Section4Data) || {};
  const sectionData: Section4Data = {
    laboratory: savedData.laboratory || {},
    radiology: savedData.radiology || {},
    mirrelScore: savedData.mirrelScore || {},
    pathology: savedData.pathology || {},
  };

  // Calculate Mirrel Score when components change
  useEffect(() => {
    const { siteScore, painScore, lesionType, sizeScore } = sectionData.mirrelScore || {};

    if (siteScore && painScore && lesionType && sizeScore) {
      const lesionTypeScore = lesionType === 'BLASTIC' ? 1 : lesionType === 'MIXED' ? 2 : 3;
      const total = siteScore + painScore + lesionTypeScore + sizeScore;

      let risk = 'LOW';
      if (total >= 11) risk = 'HIGH';
      else if (total >= 8) risk = 'MODERATE';

      updateSection('section4', {
        ...sectionData,
        mirrelScore: {
          ...sectionData.mirrelScore,
          totalScore: total,
          fractureRisk: risk,
        },
      });
    }
  }, [
    sectionData.mirrelScore?.siteScore,
    sectionData.mirrelScore?.painScore,
    sectionData.mirrelScore?.lesionType,
    sectionData.mirrelScore?.sizeScore,
  ]);

  const updateLabField = <K extends keyof LaboratoryData>(field: K, value: LaboratoryData[K]) => {
    updateSection('section4', {
      ...sectionData,
      laboratory: {
        ...sectionData.laboratory,
        [field]: value,
      },
    });
  };

  const updateRadiologyField = <K extends keyof RadiologyData>(field: K, value: RadiologyData[K]) => {
    updateSection('section4', {
      ...sectionData,
      radiology: {
        ...sectionData.radiology,
        [field]: value,
      },
    });
  };

  const updateMirrelField = <K extends keyof MirrelScoreData>(field: K, value: MirrelScoreData[K]) => {
    updateSection('section4', {
      ...sectionData,
      mirrelScore: {
        ...sectionData.mirrelScore,
        [field]: value,
      },
    });
  };

  const updatePathologyField = <K extends keyof PathologyData>(field: K, value: PathologyData[K]) => {
    updateSection('section4', {
      ...sectionData,
      pathology: {
        ...sectionData.pathology,
        [field]: value,
      },
    });
  };

  const addIHKMarker = () => {
    const currentMarkers = sectionData.pathology?.ihkMarkers || [];
    updatePathologyField('ihkMarkers', [...currentMarkers, { marker: '', result: '' }]);
  };

  const removeIHKMarker = (index: number) => {
    const currentMarkers = sectionData.pathology?.ihkMarkers || [];
    const updatedMarkers = currentMarkers.filter((_, i) => i !== index);
    updatePathologyField('ihkMarkers', updatedMarkers);
  };

  const updateIHKMarker = (index: number, field: 'marker' | 'result', value: string) => {
    const currentMarkers = sectionData.pathology?.ihkMarkers || [];
    const updatedMarkers = [...currentMarkers];
    updatedMarkers[index] = { ...updatedMarkers[index], [field]: value };
    updatePathologyField('ihkMarkers', updatedMarkers);
  };

  const getMirrelRiskColor = (risk?: string): string => {
    if (risk === 'HIGH') return 'bg-red-100 border-red-300 text-red-900';
    if (risk === 'MODERATE') return 'bg-yellow-100 border-yellow-300 text-yellow-900';
    if (risk === 'LOW') return 'bg-green-100 border-green-300 text-green-900';
    return 'bg-gray-100 border-gray-300 text-gray-900';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pemeriksaan Penunjang Diagnostik
        </h2>
        <p className="text-gray-600">
          Hasil laboratorium, radiologi, dan pemeriksaan patologi
        </p>
      </div>

      {/* Laboratory Results */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hasil Laboratorium
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hemoglobin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={sectionData.laboratory?.hemoglobin || ''}
              onChange={(e) => updateLabField('hemoglobin', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 12-16 (F), 13-17 (M)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Leukocytes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leukosit (x10⁹/L)
            </label>
            <input
              type="number"
              step="0.1"
              value={sectionData.laboratory?.leukocytes || ''}
              onChange={(e) => updateLabField('leukocytes', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 4-10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Platelets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trombosit (x10⁹/L)
            </label>
            <input
              type="number"
              step="1"
              value={sectionData.laboratory?.platelets || ''}
              onChange={(e) => updateLabField('platelets', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 150-400"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Alkaline Phosphatase (Tumor Marker for Bone) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alkaline Phosphatase (U/L)
              <span className="ml-2 text-xs text-blue-600">Penanda tumor tulang</span>
            </label>
            <input
              type="number"
              step="1"
              value={sectionData.laboratory?.alkalinePhosphatase || ''}
              onChange={(e) => updateLabField('alkalinePhosphatase', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 30-120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* LDH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LDH (U/L)
              <span className="ml-2 text-xs text-blue-600">Penanda tumor</span>
            </label>
            <input
              type="number"
              step="1"
              value={sectionData.laboratory?.ldh || ''}
              onChange={(e) => updateLabField('ldh', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 140-280"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Calcium */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kalsium (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={sectionData.laboratory?.calcium || ''}
              onChange={(e) => updateLabField('calcium', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Normal: 8.5-10.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Radiology Findings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Temuan Radiologi
        </h3>

        {/* X-Ray */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hasil X-Ray (Rontgen)
          </label>
          <textarea
            value={sectionData.radiology?.xrayFindings || ''}
            onChange={(e) => updateRadiologyField('xrayFindings', e.target.value)}
            rows={3}
            placeholder="Contoh: Lesi litik di distal femur kanan dengan destruksi korteks anterior..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* CT Scan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hasil CT Scan
          </label>
          <textarea
            value={sectionData.radiology?.ctFindings || ''}
            onChange={(e) => updateRadiologyField('ctFindings', e.target.value)}
            rows={3}
            placeholder="Contoh: Massa jaringan lunak dengan komponen kalsifikasi, ukuran 8x6x5 cm..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* MRI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hasil MRI
          </label>
          <textarea
            value={sectionData.radiology?.mriFindings || ''}
            onChange={(e) => updateRadiologyField('mriFindings', e.target.value)}
            rows={3}
            placeholder="Contoh: Massa intramedular dengan ekstensi ekstraosseous, T1 hypointense, T2 hyperintense..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* PET Scan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hasil PET Scan (Opsional)
          </label>
          <textarea
            value={sectionData.radiology?.petScanFindings || ''}
            onChange={(e) => updateRadiologyField('petScanFindings', e.target.value)}
            rows={3}
            placeholder="Contoh: Peningkatan uptake FDG dengan SUVmax 8.5 di lesi primer..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mirrel Score Calculator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Mirrel Score Calculator
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Penilaian risiko fraktur patologis (Pathological Fracture Risk)
            </p>
          </div>
          {sectionData.mirrelScore?.totalScore && (
            <div className={`px-4 py-2 rounded-lg border-2 ${getMirrelRiskColor(sectionData.mirrelScore.fractureRisk)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{sectionData.mirrelScore.totalScore}</div>
                <div className="text-xs font-medium">{sectionData.mirrelScore.fractureRisk} RISK</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi (Site) <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionData.mirrelScore?.siteScore || ''}
              onChange={(e) => updateMirrelField('siteScore', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Lokasi</option>
              <option value="1">1 - Upper Limb (Ekstremitas Atas)</option>
              <option value="2">2 - Lower Limb (Ekstremitas Bawah)</option>
              <option value="3">3 - Peritrochanteric (Trokanter)</option>
            </select>
          </div>

          {/* Pain Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nyeri (Pain) <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionData.mirrelScore?.painScore || ''}
              onChange={(e) => updateMirrelField('painScore', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Tingkat Nyeri</option>
              <option value="1">1 - Mild (Ringan)</option>
              <option value="2">2 - Moderate (Sedang)</option>
              <option value="3">3 - Functional (Nyeri fungsional)</option>
            </select>
          </div>

          {/* Lesion Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Lesi (Lesion Type) <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionData.mirrelScore?.lesionType || ''}
              onChange={(e) => updateMirrelField('lesionType', e.target.value as 'BLASTIC' | 'MIXED' | 'LYTIC')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Tipe Lesi</option>
              <option value="BLASTIC">Blastic (1 point)</option>
              <option value="MIXED">Mixed (2 points)</option>
              <option value="LYTIC">Lytic (3 points)</option>
            </select>
          </div>

          {/* Size Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ukuran (Size) <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionData.mirrelScore?.sizeScore || ''}
              onChange={(e) => updateMirrelField('sizeScore', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Ukuran Lesi</option>
              <option value="1">1 - {'<'}1/3 diameter tulang</option>
              <option value="2">2 - 1/3 - 2/3 diameter tulang</option>
              <option value="3">3 - {'>'}2/3 diameter tulang</option>
            </select>
          </div>
        </div>

        {/* Mirrel Score Interpretation */}
        {sectionData.mirrelScore?.totalScore && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${getMirrelRiskColor(sectionData.mirrelScore.fractureRisk)}`}>
            <div className="flex items-start">
              <svg
                className="h-6 w-6 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm">
                <p className="font-medium">Interpretasi Mirrel Score:</p>
                <p className="mt-1">
                  Total Skor: <span className="font-bold">{sectionData.mirrelScore.totalScore}</span> / 12
                </p>
                <p className="mt-1">
                  Risiko Fraktur: <span className="font-bold">{sectionData.mirrelScore.fractureRisk}</span>
                </p>
                <p className="mt-2 text-xs">
                  {sectionData.mirrelScore.fractureRisk === 'LOW' && 'Risiko rendah fraktur patologis. Observasi rutin.'}
                  {sectionData.mirrelScore.fractureRisk === 'MODERATE' && 'Risiko sedang fraktur patologis. Pertimbangkan profilaksis.'}
                  {sectionData.mirrelScore.fractureRisk === 'HIGH' && 'Risiko tinggi fraktur patologis. Intervensi profilaksis direkomendasikan.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pathology */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hasil Patologi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Biopsy Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Biopsi
            </label>
            <select
              value={sectionData.pathology?.biopsyType || ''}
              onChange={(e) => updatePathologyField('biopsyType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Jenis Biopsi</option>
              <option value="Core needle">Core Needle Biopsy</option>
              <option value="Incisional">Incisional Biopsy</option>
              <option value="Excisional">Excisional Biopsy</option>
              <option value="Open">Open Biopsy</option>
            </select>
          </div>

          {/* Biopsy Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Biopsi
            </label>
            <input
              type="date"
              value={sectionData.pathology?.biopsyDate || ''}
              onChange={(e) => updatePathologyField('biopsyDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Pathology Findings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temuan Patologi Anatomi
          </label>
          <textarea
            value={sectionData.pathology?.pathologyFindings || ''}
            onChange={(e) => updatePathologyField('pathologyFindings', e.target.value)}
            rows={4}
            placeholder="Contoh: Tampak jaringan nekrosis luas (90%), sel tumor viabel minimal, respon baik terhadap kemoterapi..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* HUVOS Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HUVOS Grade (Respon Kemoterapi)
          </label>
          <select
            value={sectionData.pathology?.huvosGrade || ''}
            onChange={(e) => updatePathologyField('huvosGrade', e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih HUVOS Grade</option>
            {Object.entries(HUVOS_GRADES).map(([grade, description]) => (
              <option key={grade} value={grade}>
                {description}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-gray-500">
            Grading respons terhadap kemoterapi berdasarkan persentase nekrosis tumor
          </p>
        </div>

        {/* Necrosis Percentage */}
        {sectionData.pathology?.huvosGrade && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persentase Nekrosis Tumor (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={sectionData.pathology?.necrosisPercentage || ''}
              onChange={(e) => updatePathologyField('necrosisPercentage', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Contoh: 95"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Immunohistochemistry (IHK) Markers */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Immunohistochemistry (IHK) Markers
              </label>
              <p className="text-xs text-gray-500">
                Penanda imunogenetik untuk identifikasi tumor (ER, PR, HER2, S100, CD34, dll)
              </p>
            </div>
            <button
              onClick={addIHKMarker}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              + Tambah Marker
            </button>
          </div>

          {sectionData.pathology?.ihkMarkers && sectionData.pathology.ihkMarkers.length > 0 ? (
            <div className="space-y-3">
              {sectionData.pathology.ihkMarkers.map((marker, index) => (
                <div key={index} className="flex gap-3 items-end">
                  {/* Marker Name */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Penanda
                    </label>
                    <input
                      type="text"
                      value={marker.marker}
                      onChange={(e) => updateIHKMarker(index, 'marker', e.target.value)}
                      placeholder="Contoh: S100, ER, PR, HER2, CD34"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Result */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Hasil
                    </label>
                    <input
                      type="text"
                      value={marker.result}
                      onChange={(e) => updateIHKMarker(index, 'result', e.target.value)}
                      placeholder="Contoh: Positive, Negative, Score 3+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeIHKMarker(index)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-3">
              Tidak ada marker IHK yang ditambahkan. Klik tombol "Tambah Marker" untuk menambah penanda immunohistokimia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
