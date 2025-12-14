'use client';

import { useState } from 'react';
import { DataFieldsSelection, DataFieldCategory } from '@/services/research-requests.service';
import researchRequestsService from '@/services/research-requests.service';

interface DataCategoryConfig {
  key: keyof DataFieldsSelection;
  label: string;
  description: string;
  sensitivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  sensitivityScore: number;
  requiresExtra?: string;
}

const DATA_CATEGORIES: DataCategoryConfig[] = [
  {
    key: 'demographics',
    label: 'Demographics & Identity (Basic)',
    description: 'Age, gender, provinsi/region only (TIDAK termasuk alamat lengkap)',
    sensitivityLevel: 'LOW',
    sensitivityScore: 10,
  },
  {
    key: 'demographicsIdentifiable',
    label: 'Demographics Identifiable ⚠️',
    description: 'NIK, Full Name, Full Address',
    sensitivityLevel: 'VERY HIGH',
    sensitivityScore: 40,
    requiresExtra: 'Requires IRB approval + extra justification',
  },
  {
    key: 'clinicalPresentation',
    label: 'Clinical Presentation',
    description: 'Chief complaint, symptoms, Karnofsky score, tumor size',
    sensitivityLevel: 'LOW',
    sensitivityScore: 5,
  },
  {
    key: 'diagnosisClassification',
    label: 'Diagnosis & Classification ⭐',
    description: 'WHO classification, tumor location, histopathology grade',
    sensitivityLevel: 'LOW',
    sensitivityScore: 5,
  },
  {
    key: 'stagingData',
    label: 'Staging Data ⭐',
    description: 'Enneking, AJCC staging, tumor size, metastasis status',
    sensitivityLevel: 'LOW',
    sensitivityScore: 5,
  },
  {
    key: 'diagnosticInvestigations',
    label: 'Diagnostic Investigations',
    description: 'Biopsy results, imaging studies, laboratory results, radiology findings',
    sensitivityLevel: 'MEDIUM',
    sensitivityScore: 10,
  },
  {
    key: 'treatmentManagement',
    label: 'Treatment Management',
    description: 'Surgery details, chemotherapy, radiotherapy, reconstruction',
    sensitivityLevel: 'MEDIUM',
    sensitivityScore: 10,
  },
  {
    key: 'followUpOutcomes',
    label: 'Follow-up & Outcomes',
    description: '14-visit follow-up data, MSTS scores, recurrence, survival',
    sensitivityLevel: 'MEDIUM',
    sensitivityScore: 10,
  },
  {
    key: 'clinicalPhotosImaging',
    label: 'Clinical Photos & Imaging Files ⚠️',
    description: 'Clinical photographs and imaging files',
    sensitivityLevel: 'VERY HIGH',
    sensitivityScore: 35,
    requiresExtra: 'Requires patient consent verification + IRB approval',
  },
  {
    key: 'cpcRecords',
    label: 'CPC Conference Records',
    description: 'Multidisciplinary team conference notes and recommendations',
    sensitivityLevel: 'LOW',
    sensitivityScore: 5,
  },
];

interface Step3Props {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export default function Step3DataFieldsChecklist({ formData, updateFormData }: Step3Props) {
  const [selectedCategories, setSelectedCategories] = useState<DataFieldsSelection>(
    formData.requestedDataFields || {}
  );
  const [totalSensitivityScore, setTotalSensitivityScore] = useState(0);

  const handlePresetClick = (preset: 'basic_research' | 'outcome_study' | 'survival_analysis' | 'treatment_comparison') => {
    const presetFields = researchRequestsService.getPresetDataFields(preset);
    setSelectedCategories(presetFields);
    updateFormData('requestedDataFields', presetFields);
    calculateSensitivityScore(presetFields);
  };

  const toggleCategory = (categoryKey: keyof DataFieldsSelection) => {
    const newCategories = { ...selectedCategories };

    if (newCategories[categoryKey]?.selected) {
      // Deselect
      newCategories[categoryKey] = { selected: false, justification: '' };
    } else {
      // Select
      newCategories[categoryKey] = {
        selected: true,
        justification: newCategories[categoryKey]?.justification || '',
      };
    }

    setSelectedCategories(newCategories);
    updateFormData('requestedDataFields', newCategories);
    calculateSensitivityScore(newCategories);
  };

  const updateJustification = (categoryKey: keyof DataFieldsSelection, justification: string) => {
    const newCategories = {
      ...selectedCategories,
      [categoryKey]: {
        ...selectedCategories[categoryKey],
        justification,
      },
    };

    setSelectedCategories(newCategories);
    updateFormData('requestedDataFields', newCategories);
  };

  const calculateSensitivityScore = (categories: DataFieldsSelection) => {
    let score = 0;
    DATA_CATEGORIES.forEach(category => {
      if (categories[category.key]?.selected) {
        score += category.sensitivityScore;
      }
    });
    setTotalSensitivityScore(Math.min(score, 100));
  };

  const getSensitivityLabel = (score: number): string => {
    if (score <= 25) return 'LOW';
    if (score <= 50) return 'MEDIUM';
    if (score <= 75) return 'HIGH';
    return 'VERY HIGH';
  };

  const getSensitivityColor = (level: string): string => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'VERY HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedCount = Object.values(selectedCategories).filter(c => c?.selected).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Fields Selection</h2>
        <p className="text-gray-600">
          Centang kategori data yang Anda butuhkan. Justifikasi WAJIB untuk setiap kategori yang dipilih.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">💡 Quick Presets (Pilih Cepat):</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => handlePresetClick('basic_research')}
            className="px-4 py-2 bg-white border border-blue-300 rounded text-sm hover:bg-blue-100 text-blue-900"
          >
            Basic Research
          </button>
          <button
            onClick={() => handlePresetClick('outcome_study')}
            className="px-4 py-2 bg-white border border-blue-300 rounded text-sm hover:bg-blue-100 text-blue-900"
          >
            Outcome Study
          </button>
          <button
            onClick={() => handlePresetClick('survival_analysis')}
            className="px-4 py-2 bg-white border border-blue-300 rounded text-sm hover:bg-blue-100 text-blue-900"
          >
            Survival Analysis
          </button>
          <button
            onClick={() => handlePresetClick('treatment_comparison')}
            className="px-4 py-2 bg-white border border-blue-300 rounded text-sm hover:bg-blue-100 text-blue-900"
          >
            Treatment Comparison
          </button>
        </div>
      </div>

      {/* Sensitivity Score Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Data Sensitivity Score</div>
          <div className="text-2xl font-bold text-gray-900">{totalSensitivityScore}/100</div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getSensitivityColor(getSensitivityLabel(totalSensitivityScore))}`}>
          {getSensitivityLabel(totalSensitivityScore)} SENSITIVITY
        </div>
      </div>

      {/* Data Categories Checklist */}
      <div className="space-y-3">
        {DATA_CATEGORIES.map((category) => {
          const isSelected = selectedCategories[category.key]?.selected || false;
          const justification = selectedCategories[category.key]?.justification || '';

          return (
            <div
              key={category.key}
              className={`border rounded-lg p-4 transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(category.key)}
                  className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />

                {/* Category Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-lg font-semibold text-gray-900 cursor-pointer" onClick={() => toggleCategory(category.key)}>
                      {category.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSensitivityColor(category.sensitivityLevel)}`}>
                        {category.sensitivityLevel}
                      </span>
                      <span className="text-sm text-gray-500">+{category.sensitivityScore} pts</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>

                  {category.requiresExtra && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800 mb-2">
                      ⚠️ {category.requiresExtra}
                    </div>
                  )}

                  {/* Justification Textarea (shown when selected) */}
                  {isSelected && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Justifikasi (WAJIB) <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        value={justification}
                        onChange={(e) => updateJustification(category.key, e.target.value)}
                        placeholder={`Jelaskan kenapa data ${category.label} diperlukan untuk penelitian Anda...`}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={isSelected}
                      />
                      {justification.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {justification.length} karakter
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total Kategori Dipilih</div>
            <div className="text-xl font-bold text-gray-900">{selectedCount} dari {DATA_CATEGORIES.length}</div>
          </div>
          {selectedCount > 0 && (
            <div className="text-sm text-gray-600">
              {selectedCount === DATA_CATEGORIES.length ? (
                <span className="text-orange-600 font-semibold">⚠️ Full dataset request</span>
              ) : (
                <span className="text-green-600">✓ Selective data request</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {totalSensitivityScore > 75 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600 text-xl">⚠️</div>
            <div>
              <div className="font-semibold text-red-900 mb-1">VERY HIGH Sensitivity Request</div>
              <p className="text-sm text-red-800">
                This request includes highly sensitive data (NIK/Name or Clinical Photos). Expect longer review time
                and possible additional requirements from ethics committee.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedCount === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            Silakan pilih minimal 1 kategori data untuk melanjutkan.
          </p>
        </div>
      )}
    </div>
  );
}
