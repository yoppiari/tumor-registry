'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 8: Treatment Management
 *
 * Comprehensive treatment tracking for musculoskeletal tumors with special emphasis on:
 *
 * 1. **LIMB SALVAGE vs AMPUTATION** - Critical outcome for musculoskeletal oncology
 * 2. Surgical details (margins, reconstruction, complications)
 * 3. Chemotherapy protocols (Neoadjuvant, Adjuvant)
 * 4. Radiation therapy
 * 5. Targeted therapy & Immunotherapy
 * 6. Treatment response assessment
 */

interface SurgicalTreatment {
  // LIMB SALVAGE - KEY METRIC
  limbSalvageStatus?: 'LIMB_SALVAGE' | 'AMPUTATION' | 'NOT_APPLICABLE';

  // Surgery Details
  surgeryDate?: string;
  surgeryDuration?: number; // in minutes
  bloodLoss?: number; // in ml
  intraoperativeContamination?: boolean;
  surgeryType?: 'WIDE_EXCISION' | 'MARGINAL_EXCISION' | 'INTRALESIONAL' | 'AMPUTATION' | 'ROTATIONPLASTY' | 'OTHER';
  surgeryTypeOther?: string;

  // Limb Salvage Details (if applicable)
  limbSalvageTechnique?: 'ENDOPROSTHESIS' | 'ALLOGRAFT' | 'ALLOGRAFT_PROSTHESIS_COMPOSITE' | 'VASCULARIZED_FIBULA' | 'DISTRACTION_OSTEOGENESIS' | 'OTHER';
  limbSalvageTechniqueOther?: string;
  reconstructionDetails?: string;

  // Amputation Details (if applicable)
  amputationLevel?: 'FOREQUARTER' | 'ABOVE_ELBOW' | 'BELOW_ELBOW' | 'HINDQUARTER' | 'ABOVE_KNEE' | 'BELOW_KNEE' | 'SYMES' | 'DISARTICULATION' | 'OTHER';
  amputationLevelOther?: string;
  amputationReason?: 'TUMOR_EXTENT' | 'FAILED_SALVAGE' | 'RECURRENCE' | 'INFECTION' | 'PATIENT_CHOICE' | 'OTHER';

  // Surgical Margins
  surgicalMargin?: 'R0_NEGATIVE' | 'R1_MICROSCOPIC_POSITIVE' | 'R2_MACROSCOPIC_POSITIVE';
  marginDistance?: number; // in mm

  // Complications
  complications?: string[];
  infectionOccurred?: boolean;

  // Surgeon & Hospital
  surgeon?: string;
  hospital?: string;
}

interface ChemotherapyTreatment {
  received?: boolean;
  timing?: 'NEOADJUVANT' | 'ADJUVANT' | 'BOTH' | 'PALLIATIVE';

  // Neoadjuvant
  neoadjuvantProtocol?: string;
  neoadjuvantCycles?: number;
  neoadjuvantStartDate?: string;
  neoadjuvantEndDate?: string;

  // Adjuvant
  adjuvantProtocol?: string;
  adjuvantCycles?: number;
  adjuvantStartDate?: string;
  adjuvantEndDate?: string;

  // Response
  response?: 'COMPLETE' | 'PARTIAL' | 'STABLE' | 'PROGRESSION';
  huvosGrade?: 'I' | 'II' | 'III' | 'IV'; // Necrosis response grading
}

interface RadiationTreatment {
  received?: boolean;
  timing?: 'NEOADJUVANT' | 'ADJUVANT' | 'PALLIATIVE' | 'DEFINITIVE';
  totalDose?: number; // in Gy
  fractions?: number;
  startDate?: string;
  endDate?: string;
  technique?: 'EXTERNAL_BEAM' | 'BRACHYTHERAPY' | 'PROTON' | 'IMRT' | 'STEREOTACTIC' | 'OTHER';
  site?: string;
  response?: 'COMPLETE' | 'PARTIAL' | 'STABLE' | 'PROGRESSION';
}

interface OtherTreatment {
  targetedTherapy?: {
    received: boolean;
    agent?: string;
    startDate?: string;
    response?: 'COMPLETE' | 'PARTIAL' | 'STABLE' | 'PROGRESSION';
  };
  immunotherapy?: {
    received: boolean;
    agent?: string;
    startDate?: string;
    response?: 'COMPLETE' | 'PARTIAL' | 'STABLE' | 'PROGRESSION';
  };
}

interface Section8Data {
  // Treatment Intention - CRITICAL FIRST FIELD
  treatmentIntention?: 'CURATIVE' | 'PALLIATIVE';

  // Analgesia
  analgesiaStartDate?: string;

  // Primary Treatment Modality
  primaryTreatment?: 'SURGERY' | 'CHEMOTHERAPY' | 'RADIATION' | 'MULTIMODAL';

  // Treatment Components
  surgery?: SurgicalTreatment;
  chemotherapy?: ChemotherapyTreatment;
  radiation?: RadiationTreatment;
  other?: OtherTreatment;

  // Overall Treatment
  treatmentStartDate?: string;
  treatmentPlan?: string;
  clinicalTrialParticipation?: boolean;
  clinicalTrialName?: string;

  // Treatment Response (Overall)
  overallResponse?: 'COMPLETE_REMISSION' | 'PARTIAL_REMISSION' | 'STABLE_DISEASE' | 'PROGRESSIVE_DISEASE';
  responseAssessmentDate?: string;
}

const SURGICAL_COMPLICATIONS = [
  'Infeksi superfisial',
  'Infeksi dalam',
  'Wound dehiscence',
  'Hematoma',
  'Nerve injury',
  'Vascular injury',
  'Prosthesis failure',
  'Nonunion / malunion',
  'Kontraktur sendi',
  'Heterotopic ossification',
];

export function Section8TreatmentManagement() {
  const { getSection, updateSection } = useFormContext();
  const sectionData: Partial<Section8Data> = (getSection('section8') as Section8Data) || {};

  const [showSurgery, setShowSurgery] = useState(sectionData.primaryTreatment === 'SURGERY' || sectionData.primaryTreatment === 'MULTIMODAL');
  const [showChemotherapy, setShowChemotherapy] = useState(sectionData.chemotherapy?.received || false);
  const [showRadiation, setShowRadiation] = useState(sectionData.radiation?.received || false);

  const updateField = <K extends keyof Section8Data>(field: K, value: Section8Data[K]) => {
    updateSection('section8', {
      ...sectionData,
      [field]: value,
    });
  };

  const updateSurgery = <K extends keyof SurgicalTreatment>(field: K, value: SurgicalTreatment[K]) => {
    updateField('surgery', {
      ...sectionData.surgery,
      [field]: value,
    });
  };

  const updateChemotherapy = <K extends keyof ChemotherapyTreatment>(field: K, value: ChemotherapyTreatment[K]) => {
    updateField('chemotherapy', {
      ...sectionData.chemotherapy,
      [field]: value,
    });
  };

  const updateRadiation = <K extends keyof RadiationTreatment>(field: K, value: RadiationTreatment[K]) => {
    updateField('radiation', {
      ...sectionData.radiation,
      [field]: value,
    });
  };

  const toggleComplication = (complication: string) => {
    const current = sectionData.surgery?.complications || [];
    const updated = current.includes(complication)
      ? current.filter(c => c !== complication)
      : [...current, complication];

    updateSurgery('complications', updated);
  };

  useEffect(() => {
    setShowSurgery(sectionData.primaryTreatment === 'SURGERY' || sectionData.primaryTreatment === 'MULTIMODAL');
  }, [sectionData.primaryTreatment]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Manajemen Pengobatan (Treatment Management)
        </h2>
        <p className="text-gray-600">
          Dokumentasi lengkap pengobatan termasuk bedah (LIMB SALVAGE), kemoterapi, radiasi, dan modalitas lainnya
        </p>
      </div>

      {/* TREATMENT INTENTION - CRITICAL FIRST FIELD */}
      <div className="bg-gradient-to-r from-purple-50 to-white rounded-lg border-2 border-purple-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Tujuan Pengobatan (Treatment Intention) <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateField('treatmentIntention', 'CURATIVE')}
            className={`
              p-4 rounded-lg border-2 text-center transition-all
              ${
                sectionData.treatmentIntention === 'CURATIVE'
                  ? 'border-green-600 bg-green-50 text-green-900'
                  : 'border-gray-200 bg-white hover:border-green-400'
              }
            `}
          >
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-bold">CURATIVE</div>
            <div className="text-xs mt-1 opacity-80">Tujuan menyembuhkan</div>
          </button>

          <button
            type="button"
            onClick={() => updateField('treatmentIntention', 'PALLIATIVE')}
            className={`
              p-4 rounded-lg border-2 text-center transition-all
              ${
                sectionData.treatmentIntention === 'PALLIATIVE'
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-blue-400'
              }
            `}
          >
            <div className="text-3xl mb-2">💊</div>
            <div className="font-bold">PALLIATIVE</div>
            <div className="text-xs mt-1 opacity-80">Mengurangi gejala</div>
          </button>
        </div>
      </div>

      {/* ANALGESIA */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Analgesia (Tanggal Mulai)
        </label>
        <input
          type="date"
          value={sectionData.analgesiaStartDate || ''}
          onChange={(e) => updateField('analgesiaStartDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Primary Treatment Modality */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Modalitas Pengobatan Primer <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: 'SURGERY', label: 'Bedah', icon: '🏥' },
            { value: 'CHEMOTHERAPY', label: 'Kemoterapi', icon: '💊' },
            { value: 'RADIATION', label: 'Radiasi', icon: '⚡' },
            { value: 'MULTIMODAL', label: 'Multimodal', icon: '🔬' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('primaryTreatment', option.value as Section8Data['primaryTreatment'])}
              className={`
                p-4 rounded-lg border-2 text-center transition-all
                ${
                  sectionData.primaryTreatment === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }
              `}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className={`font-semibold ${sectionData.primaryTreatment === option.value ? 'text-blue-900' : 'text-gray-900'}`}>
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SURGICAL TREATMENT - With LIMB SALVAGE Highlight */}
      {showSurgery && (
        <div className="bg-gradient-to-br from-red-50 to-white rounded-lg border-2 border-red-200 p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
            Pengobatan Bedah (Surgical Treatment)
          </h3>

          <div className="space-y-6">
            {/* LIMB SALVAGE STATUS - CRITICAL METRIC */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border-2 border-yellow-400">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-yellow-700 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="text-lg font-bold text-yellow-900">LIMB SALVAGE STATUS</h4>
                  <p className="text-sm text-yellow-800">Indikator utama keberhasilan bedah tumor muskuloskeletal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => updateSurgery('limbSalvageStatus', 'LIMB_SALVAGE')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.surgery?.limbSalvageStatus === 'LIMB_SALVAGE'
                        ? 'border-green-600 bg-green-100 text-green-900'
                        : 'border-yellow-400 bg-white hover:border-green-500'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-bold">LIMB SALVAGE</div>
                  <div className="text-xs mt-1 opacity-80">Ekstremitas dipertahankan</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateSurgery('limbSalvageStatus', 'AMPUTATION')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.surgery?.limbSalvageStatus === 'AMPUTATION'
                        ? 'border-red-600 bg-red-100 text-red-900'
                        : 'border-yellow-400 bg-white hover:border-red-500'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">❌</div>
                  <div className="font-bold">AMPUTATION</div>
                  <div className="text-xs mt-1 opacity-80">Amputasi dilakukan</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateSurgery('limbSalvageStatus', 'NOT_APPLICABLE')}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${
                      sectionData.surgery?.limbSalvageStatus === 'NOT_APPLICABLE'
                        ? 'border-gray-600 bg-gray-100 text-gray-900'
                        : 'border-yellow-400 bg-white hover:border-gray-500'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">➖</div>
                  <div className="font-bold">NOT APPLICABLE</div>
                  <div className="text-xs mt-1 opacity-80">Bukan tumor ekstremitas</div>
                </button>
              </div>
            </div>

            {/* Surgery Date & Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Operasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={sectionData.surgery?.surgeryDate || ''}
                  onChange={(e) => updateSurgery('surgeryDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Operasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={sectionData.surgery?.surgeryType || ''}
                  onChange={(e) => updateSurgery('surgeryType', e.target.value as SurgicalTreatment['surgeryType'])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Pilih jenis operasi</option>
                  <option value="WIDE_EXCISION">Wide Excision</option>
                  <option value="MARGINAL_EXCISION">Marginal Excision</option>
                  <option value="INTRALESIONAL">Intralesional</option>
                  <option value="AMPUTATION">Amputation</option>
                  <option value="ROTATIONPLASTY">Rotationplasty</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Surgery Duration, Blood Loss, Contamination */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi Operasi (menit)
                </label>
                <input
                  type="number"
                  value={sectionData.surgery?.surgeryDuration || ''}
                  onChange={(e) => updateSurgery('surgeryDuration', parseInt(e.target.value))}
                  placeholder="Contoh: 180"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perdarahan (ml)
                </label>
                <input
                  type="number"
                  value={sectionData.surgery?.bloodLoss || ''}
                  onChange={(e) => updateSurgery('bloodLoss', parseInt(e.target.value))}
                  placeholder="Contoh: 500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontaminasi Intraoperatif
                </label>
                <div className="flex items-center h-12">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionData.surgery?.intraoperativeContamination || false}
                      onChange={(e) => updateSurgery('intraoperativeContamination', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-5 w-5"
                    />
                    <span className="ml-3 text-sm text-gray-700">Ya, terjadi kontaminasi</span>
                  </label>
                </div>
              </div>
            </div>

            {/* LIMB SALVAGE Details */}
            {sectionData.surgery?.limbSalvageStatus === 'LIMB_SALVAGE' && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-bold text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🦴</span>
                  Detail Limb Salvage
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teknik Rekonstruksi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sectionData.surgery?.limbSalvageTechnique || ''}
                      onChange={(e) => updateSurgery('limbSalvageTechnique', e.target.value as SurgicalTreatment['limbSalvageTechnique'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Pilih teknik rekonstruksi</option>
                      <option value="ENDOPROSTHESIS">Endoprosthesis (Modular prosthesis)</option>
                      <option value="ALLOGRAFT">Allograft</option>
                      <option value="ALLOGRAFT_PROSTHESIS_COMPOSITE">Allograft-Prosthesis Composite (APC)</option>
                      <option value="VASCULARIZED_FIBULA">Vascularized Fibula Graft</option>
                      <option value="DISTRACTION_OSTEOGENESIS">Distraction Osteogenesis</option>
                      <option value="OTHER">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detail Rekonstruksi
                    </label>
                    <textarea
                      value={sectionData.surgery?.reconstructionDetails || ''}
                      onChange={(e) => updateSurgery('reconstructionDetails', e.target.value)}
                      rows={3}
                      placeholder="Jelaskan detail teknik rekonstruksi, ukuran prosthesis, jenis graft, dll."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AMPUTATION Details */}
            {sectionData.surgery?.limbSalvageStatus === 'AMPUTATION' && (
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h4 className="font-bold text-red-900 mb-4">Detail Amputasi</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level Amputasi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sectionData.surgery?.amputationLevel || ''}
                      onChange={(e) => updateSurgery('amputationLevel', e.target.value as SurgicalTreatment['amputationLevel'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Pilih level amputasi</option>
                      <optgroup label="Upper Extremity">
                        <option value="FOREQUARTER">Forequarter (Interscapulothoracic)</option>
                        <option value="ABOVE_ELBOW">Above Elbow (Transhumeral)</option>
                        <option value="BELOW_ELBOW">Below Elbow (Transradial)</option>
                      </optgroup>
                      <optgroup label="Lower Extremity">
                        <option value="HINDQUARTER">Hindquarter (Hemipelvectomy)</option>
                        <option value="ABOVE_KNEE">Above Knee (Transfemoral)</option>
                        <option value="BELOW_KNEE">Below Knee (Transtibial)</option>
                        <option value="SYMES">Symes Amputation</option>
                      </optgroup>
                      <option value="DISARTICULATION">Disarticulation</option>
                      <option value="OTHER">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alasan Amputasi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={sectionData.surgery?.amputationReason || ''}
                      onChange={(e) => updateSurgery('amputationReason', e.target.value as SurgicalTreatment['amputationReason'])}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Pilih alasan amputasi</option>
                      <option value="TUMOR_EXTENT">Tumor Extent (Tumor terlalu luas)</option>
                      <option value="FAILED_SALVAGE">Failed Limb Salvage</option>
                      <option value="RECURRENCE">Local Recurrence</option>
                      <option value="INFECTION">Infection</option>
                      <option value="PATIENT_CHOICE">Patient Choice</option>
                      <option value="OTHER">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Surgical Margins */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status Margin Bedah <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'R0_NEGATIVE', label: 'R0 - Negative', color: 'green' },
                  { value: 'R1_MICROSCOPIC_POSITIVE', label: 'R1 - Microscopic+', color: 'yellow' },
                  { value: 'R2_MACROSCOPIC_POSITIVE', label: 'R2 - Macroscopic+', color: 'red' },
                ].map((margin) => (
                  <button
                    key={margin.value}
                    type="button"
                    onClick={() => updateSurgery('surgicalMargin', margin.value as SurgicalTreatment['surgicalMargin'])}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${
                        sectionData.surgery?.surgicalMargin === margin.value
                          ? `border-${margin.color}-600 bg-${margin.color}-100 text-${margin.color}-900`
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="font-semibold text-sm">{margin.label}</div>
                  </button>
                ))}
              </div>

              {sectionData.surgery?.surgicalMargin === 'R0_NEGATIVE' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jarak Margin (mm)
                  </label>
                  <input
                    type="number"
                    value={sectionData.surgery?.marginDistance || ''}
                    onChange={(e) => updateSurgery('marginDistance', parseFloat(e.target.value))}
                    placeholder="Jarak margin dalam milimeter"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            </div>

            {/* Complications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Komplikasi Pascaoperasi
              </label>

              <div className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sectionData.surgery?.infectionOccurred || false}
                    onChange={(e) => updateSurgery('infectionOccurred', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-5 w-5"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Terjadi Infeksi</span>
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SURGICAL_COMPLICATIONS.map((comp) => (
                  <label key={comp} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionData.surgery?.complications?.includes(comp) || false}
                      onChange={() => toggleComplication(comp)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{comp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Surgeon & Hospital */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Ahli Bedah
                </label>
                <input
                  type="text"
                  value={sectionData.surgery?.surgeon || ''}
                  onChange={(e) => updateSurgery('surgeon', e.target.value)}
                  placeholder="Nama lengkap ahli bedah"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rumah Sakit
                </label>
                <input
                  type="text"
                  value={sectionData.surgery?.hospital || ''}
                  onChange={(e) => updateSurgery('hospital', e.target.value)}
                  placeholder="Nama rumah sakit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHEMOTHERAPY */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={sectionData.chemotherapy?.received || false}
            onChange={(e) => {
              updateChemotherapy('received', e.target.checked);
              setShowChemotherapy(e.target.checked);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
          />
          <span className="ml-3 text-lg font-semibold text-gray-900">Kemoterapi</span>
        </label>

        {showChemotherapy && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timing
              </label>
              <select
                value={sectionData.chemotherapy?.timing || ''}
                onChange={(e) => updateChemotherapy('timing', e.target.value as ChemotherapyTreatment['timing'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih timing</option>
                <option value="NEOADJUVANT">Neoadjuvant (sebelum bedah)</option>
                <option value="ADJUVANT">Adjuvant (setelah bedah)</option>
                <option value="BOTH">Both (Neoadjuvant + Adjuvant)</option>
                <option value="PALLIATIVE">Palliative</option>
              </select>
            </div>

            {(sectionData.chemotherapy?.timing === 'NEOADJUVANT' || sectionData.chemotherapy?.timing === 'BOTH') && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Neoadjuvant Chemotherapy</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protokol</label>
                    <input
                      type="text"
                      value={sectionData.chemotherapy?.neoadjuvantProtocol || ''}
                      onChange={(e) => updateChemotherapy('neoadjuvantProtocol', e.target.value)}
                      placeholder="e.g., MAP, VAC, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Siklus</label>
                    <input
                      type="number"
                      value={sectionData.chemotherapy?.neoadjuvantCycles || ''}
                      onChange={(e) => updateChemotherapy('neoadjuvantCycles', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={sectionData.chemotherapy?.neoadjuvantStartDate || ''}
                      onChange={(e) => updateChemotherapy('neoadjuvantStartDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={sectionData.chemotherapy?.neoadjuvantEndDate || ''}
                      onChange={(e) => updateChemotherapy('neoadjuvantEndDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {(sectionData.chemotherapy?.timing === 'ADJUVANT' || sectionData.chemotherapy?.timing === 'BOTH') && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">Adjuvant Chemotherapy</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protokol</label>
                    <input
                      type="text"
                      value={sectionData.chemotherapy?.adjuvantProtocol || ''}
                      onChange={(e) => updateChemotherapy('adjuvantProtocol', e.target.value)}
                      placeholder="e.g., MAP, VAC, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Siklus</label>
                    <input
                      type="number"
                      value={sectionData.chemotherapy?.adjuvantCycles || ''}
                      onChange={(e) => updateChemotherapy('adjuvantCycles', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={sectionData.chemotherapy?.adjuvantStartDate || ''}
                      onChange={(e) => updateChemotherapy('adjuvantStartDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={sectionData.chemotherapy?.adjuvantEndDate || ''}
                      onChange={(e) => updateChemotherapy('adjuvantEndDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RADIATION */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={sectionData.radiation?.received || false}
            onChange={(e) => {
              updateRadiation('received', e.target.checked);
              setShowRadiation(e.target.checked);
            }}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-5 w-5"
          />
          <span className="ml-3 text-lg font-semibold text-gray-900">Radioterapi</span>
        </label>

        {showRadiation && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timing
              </label>
              <select
                value={sectionData.radiation?.timing || ''}
                onChange={(e) => updateRadiation('timing', e.target.value as RadiationTreatment['timing'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Pilih timing</option>
                <option value="NEOADJUVANT">Neoadjuvant (sebelum bedah)</option>
                <option value="ADJUVANT">Adjuvant (setelah bedah)</option>
                <option value="DEFINITIVE">Definitive</option>
                <option value="PALLIATIVE">Palliative</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Dosis (Gy)</label>
                <input
                  type="number"
                  value={sectionData.radiation?.totalDose || ''}
                  onChange={(e) => updateRadiation('totalDose', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fraksi</label>
                <input
                  type="number"
                  value={sectionData.radiation?.fractions || ''}
                  onChange={(e) => updateRadiation('fractions', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                <input
                  type="date"
                  value={sectionData.radiation?.startDate || ''}
                  onChange={(e) => updateRadiation('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                <input
                  type="date"
                  value={sectionData.radiation?.endDate || ''}
                  onChange={(e) => updateRadiation('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overall Treatment Response */}
      {(showSurgery || showChemotherapy || showRadiation) && (
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg border border-indigo-200 p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Respons Pengobatan Keseluruhan</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'COMPLETE_REMISSION', label: 'Complete Remission', color: 'green' },
              { value: 'PARTIAL_REMISSION', label: 'Partial Remission', color: 'blue' },
              { value: 'STABLE_DISEASE', label: 'Stable Disease', color: 'yellow' },
              { value: 'PROGRESSIVE_DISEASE', label: 'Progressive Disease', color: 'red' },
            ].map((response) => (
              <button
                key={response.value}
                type="button"
                onClick={() => updateField('overallResponse', response.value as Section8Data['overallResponse'])}
                className={`
                  p-3 rounded-lg border-2 transition-all text-center
                  ${
                    sectionData.overallResponse === response.value
                      ? `border-${response.color}-600 bg-${response.color}-100`
                      : 'border-gray-300 bg-white hover:border-indigo-400'
                  }
                `}
              >
                <div className="font-semibold text-sm">{response.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {sectionData.surgery?.limbSalvageStatus && (
        <div className={`border-2 rounded-lg p-6 ${
          sectionData.surgery.limbSalvageStatus === 'LIMB_SALVAGE'
            ? 'bg-green-50 border-green-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start">
            <svg
              className={`h-6 w-6 mr-3 flex-shrink-0 ${
                sectionData.surgery.limbSalvageStatus === 'LIMB_SALVAGE'
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
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
            <div className={`text-sm ${
              sectionData.surgery.limbSalvageStatus === 'LIMB_SALVAGE'
                ? 'text-green-800'
                : 'text-gray-800'
            }`}>
              <span className="font-medium">
                {sectionData.surgery.limbSalvageStatus === 'LIMB_SALVAGE'
                  ? '✅ LIMB SALVAGE berhasil dipertahankan'
                  : 'Informasi pengobatan telah dicatat'}
              </span> - Anda dapat melanjutkan ke bagian selanjutnya.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
