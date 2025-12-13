'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext';

/**
 * Section 9: Follow-up Management
 *
 * Long-term follow-up tracking for musculoskeletal tumor patients:
 *
 * 1. **14-Visit Follow-up Protocol**
 *    - Standard follow-up schedule: 3, 6, 9, 12, 18, 24, 30, 36, 48, 60, 72, 84, 96, 120 months
 *    - Track visit dates, imaging, lab results, disease status
 *
 * 2. **MSTS Score Tracking** (Musculoskeletal Tumor Society Functional Score)
 *    - Evaluate functional outcomes at each visit
 *    - Upper/Lower extremity specific domains
 *    - Score: 0-30 (higher = better function)
 *
 * 3. **Disease Status & Complications**
 *    - Local recurrence monitoring
 *    - Distant metastasis detection
 *    - Late complications tracking
 */

// Standard 14-visit follow-up schedule for musculoskeletal tumors
const FOLLOW_UP_SCHEDULE = [
  { visit: 1, month: 3, label: '3 months' },
  { visit: 2, month: 6, label: '6 months' },
  { visit: 3, month: 9, label: '9 months' },
  { visit: 4, month: 12, label: '1 year' },
  { visit: 5, month: 18, label: '18 months' },
  { visit: 6, month: 24, label: '2 years' },
  { visit: 7, month: 30, label: '30 months' },
  { visit: 8, month: 36, label: '3 years' },
  { visit: 9, month: 48, label: '4 years' },
  { visit: 10, month: 60, label: '5 years' },
  { visit: 11, month: 72, label: '6 years' },
  { visit: 12, month: 84, label: '7 years' },
  { visit: 13, month: 96, label: '8 years' },
  { visit: 14, month: 120, label: '10 years' },
];

interface MSTSScore {
  extremityType: 'UPPER' | 'LOWER';

  // Common domains (0-5 each)
  pain: number;
  function: number;
  emotionalAcceptance: number;

  // Upper extremity specific
  handPositioning?: number;      // 0-5
  manualDexterity?: number;      // 0-5
  liftingAbility?: number;       // 0-5

  // Lower extremity specific
  supports?: number;             // 0-5 (walking aids)
  walkingAbility?: number;       // 0-5
  gait?: number;                 // 0-5

  // Calculated total (0-30)
  totalScore?: number;
  percentage?: number;           // Total/30 * 100
}

interface FollowUpVisit {
  visitNumber: number;
  scheduledMonth: number;
  visitDate?: string;
  completed: boolean;

  // Disease Status
  diseaseStatus?: 'NED' | 'LOCAL_RECURRENCE' | 'DISTANT_METASTASIS' | 'BOTH' | 'DECEASED';
  localRecurrence?: boolean;
  localRecurrenceDate?: string;
  distantMetastasis?: boolean;
  metastasisSites?: string[];

  // Imaging
  imagingPerformed?: boolean;
  imagingTypes?: string[];      // CT, MRI, Bone Scan, PET
  imagingFindings?: string;

  // Lab Results
  labsPerformed?: boolean;
  alkalinePhosphatase?: number;
  ldh?: number;

  // MSTS Score
  mstsScore?: MSTSScore;

  // Complications
  complications?: string[];
  prosthesisStatus?: 'INTACT' | 'REVISED' | 'FAILED' | 'REMOVED' | 'NOT_APPLICABLE';

  // Clinical Notes
  notes?: string;
}

interface Section9Data {
  // Treatment End Date (to calculate follow-up dates)
  treatmentEndDate?: string;

  // 14 Follow-up Visits
  visits: FollowUpVisit[];

  // Summary Statistics
  diseaseFreeSurvival?: number;    // months
  overallSurvival?: number;        // months
  currentStatus?: 'ALIVE_NED' | 'ALIVE_WITH_DISEASE' | 'DECEASED' | 'LOST_TO_FOLLOWUP';

  // Latest MSTS Score (for quick reference)
  latestMSTSScore?: MSTSScore;
  latestMSTSDate?: string;
}

const METASTASIS_SITES = [
  'Paru (Lung)',
  'Tulang (Bone)',
  'Hati (Liver)',
  'Otak (Brain)',
  'Kelenjar Getah Bening (Lymph Nodes)',
  'Lainnya',
];

const IMAGING_TYPES = [
  'X-Ray Lokal',
  'Chest X-Ray',
  'CT Scan Lokal',
  'CT Scan Thorax',
  'MRI Lokal',
  'Bone Scan',
  'PET Scan',
  'Ultrasound',
];

export function Section9FollowUpManagement() {
  const { getSection, updateSection } = useFormContext();
  const sectionData: Partial<Section9Data> = (getSection('section9') as Section9Data) || {
    visits: FOLLOW_UP_SCHEDULE.map(schedule => ({
      visitNumber: schedule.visit,
      scheduledMonth: schedule.month,
      completed: false,
    })),
  };

  const [selectedVisit, setSelectedVisit] = useState<number | null>(null);

  // Calculate MSTS Total Score
  const calculateMSTSTotal = (msts: MSTSScore): { total: number; percentage: number } => {
    const { extremityType, pain, function: func, emotionalAcceptance } = msts;

    let total = (pain || 0) + (func || 0) + (emotionalAcceptance || 0);

    if (extremityType === 'UPPER') {
      total += (msts.handPositioning || 0) + (msts.manualDexterity || 0) + (msts.liftingAbility || 0);
    } else {
      total += (msts.supports || 0) + (msts.walkingAbility || 0) + (msts.gait || 0);
    }

    const percentage = (total / 30) * 100;

    return { total, percentage };
  };

  const updateVisit = (visitNumber: number, updates: Partial<FollowUpVisit>) => {
    const updatedVisits = sectionData.visits.map(visit =>
      visit.visitNumber === visitNumber
        ? { ...visit, ...updates }
        : visit
    );

    updateSection('section9', {
      ...sectionData,
      visits: updatedVisits,
    });
  };

  const updateVisitMSTS = (visitNumber: number, field: keyof MSTSScore, value: any) => {
    const visit = sectionData.visits.find(v => v.visitNumber === visitNumber);
    if (!visit) return;

    const updatedMSTS: MSTSScore = {
      ...visit.mstsScore,
      [field]: value,
    } as MSTSScore;

    // Calculate total
    if (updatedMSTS.extremityType) {
      const { total, percentage } = calculateMSTSTotal(updatedMSTS);
      updatedMSTS.totalScore = total;
      updatedMSTS.percentage = percentage;
    }

    updateVisit(visitNumber, {
      mstsScore: updatedMSTS,
    });
  };

  const toggleMetastasisSite = (visitNumber: number, site: string) => {
    const visit = sectionData.visits.find(v => v.visitNumber === visitNumber);
    if (!visit) return;

    const current = visit.metastasisSites || [];
    const updated = current.includes(site)
      ? current.filter(s => s !== site)
      : [...current, site];

    updateVisit(visitNumber, { metastasisSites: updated });
  };

  const toggleImagingType = (visitNumber: number, type: string) => {
    const visit = sectionData.visits.find(v => v.visitNumber === visitNumber);
    if (!visit) return;

    const current = visit.imagingTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];

    updateVisit(visitNumber, { imagingTypes: updated });
  };

  const completedVisitsCount = sectionData.visits.filter(v => v.completed).length;
  const currentVisit = sectionData.visits.find(v => v.visitNumber === selectedVisit);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Manajemen Follow-up (Follow-up Management)
        </h2>
        <p className="text-gray-600">
          Protokol follow-up 14 kunjungan dengan tracking MSTS Score dan status penyakit
        </p>
      </div>

      {/* Treatment End Date */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Selesai Pengobatan <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={sectionData.treatmentEndDate || ''}
          onChange={(e) => updateSection('section9', { ...sectionData, treatmentEndDate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          Tanggal ini digunakan sebagai referensi untuk jadwal follow-up
        </p>
      </div>

      {/* Follow-up Progress Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">Progress Follow-up</div>
            <div className="text-3xl font-bold">{completedVisitsCount} / 14 Visits</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Completion Rate</div>
            <div className="text-2xl font-bold">
              {Math.round((completedVisitsCount / 14) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${(completedVisitsCount / 14) * 100}%` }}
          />
        </div>
      </div>

      {/* 14 Visit Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">14-Visit Follow-up Timeline</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {FOLLOW_UP_SCHEDULE.map((schedule) => {
            const visit = sectionData.visits.find(v => v.visitNumber === schedule.visit);
            const isCompleted = visit?.completed || false;
            const isSelected = selectedVisit === schedule.visit;

            return (
              <button
                key={schedule.visit}
                type="button"
                onClick={() => setSelectedVisit(schedule.visit)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-center
                  ${isSelected ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' : 'border-gray-300 bg-white'}
                  ${isCompleted ? 'ring-2 ring-green-500' : ''}
                  hover:border-blue-400
                `}
              >
                <div className={`text-xs font-medium mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-500'}`}>
                  Visit {schedule.visit}
                </div>
                <div className={`text-sm font-bold mb-2 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {schedule.label}
                </div>
                {isCompleted && (
                  <div className="text-green-600 text-xl">✓</div>
                )}
                {!isCompleted && (
                  <div className="text-gray-400 text-xl">○</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Visit Details */}
      {currentVisit && (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg border-2 border-indigo-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-indigo-900">
              Visit {currentVisit.visitNumber} Details ({FOLLOW_UP_SCHEDULE.find(s => s.visit === currentVisit.visitNumber)?.label})
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentVisit.completed}
                onChange={(e) => updateVisit(currentVisit.visitNumber, { completed: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-6 w-6"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Mark as completed</span>
            </label>
          </div>

          <div className="space-y-6">
            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kunjungan
              </label>
              <input
                type="date"
                value={currentVisit.visitDate || ''}
                onChange={(e) => updateVisit(currentVisit.visitNumber, { visitDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Disease Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status Penyakit
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { value: 'NED', label: 'NED', fullLabel: 'No Evidence of Disease', color: 'green' },
                  { value: 'LOCAL_RECURRENCE', label: 'Local Recur', fullLabel: 'Local Recurrence', color: 'yellow' },
                  { value: 'DISTANT_METASTASIS', label: 'Metastasis', fullLabel: 'Distant Metastasis', color: 'orange' },
                  { value: 'BOTH', label: 'Both', fullLabel: 'Local + Distant', color: 'red' },
                  { value: 'DECEASED', label: 'Deceased', fullLabel: 'Deceased', color: 'gray' },
                ].map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateVisit(currentVisit.visitNumber, { diseaseStatus: status.value as FollowUpVisit['diseaseStatus'] })}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${
                        currentVisit.diseaseStatus === status.value
                          ? `border-${status.color}-600 bg-${status.color}-100 text-${status.color}-900`
                          : 'border-gray-300 bg-white hover:border-indigo-400'
                      }
                    `}
                    title={status.fullLabel}
                  >
                    <div className="font-semibold text-xs">{status.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Metastasis Sites (if applicable) */}
            {(currentVisit.diseaseStatus === 'DISTANT_METASTASIS' || currentVisit.diseaseStatus === 'BOTH') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Lokasi Metastasis
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {METASTASIS_SITES.map((site) => (
                    <label key={site} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentVisit.metastasisSites?.includes(site) || false}
                        onChange={() => toggleMetastasisSite(currentVisit.visitNumber, site)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{site}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Imaging */}
            <div>
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={currentVisit.imagingPerformed || false}
                  onChange={(e) => updateVisit(currentVisit.visitNumber, { imagingPerformed: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Imaging Dilakukan</span>
              </label>

              {currentVisit.imagingPerformed && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {IMAGING_TYPES.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={currentVisit.imagingTypes?.includes(type) || false}
                          onChange={() => toggleImagingType(currentVisit.visitNumber, type)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hasil Imaging
                    </label>
                    <textarea
                      value={currentVisit.imagingFindings || ''}
                      onChange={(e) => updateVisit(currentVisit.visitNumber, { imagingFindings: e.target.value })}
                      rows={3}
                      placeholder="Deskripsi temuan imaging..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* MSTS Score */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                MSTS Score (Functional Assessment)
              </h4>

              {/* Extremity Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Ekstremitas
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateVisitMSTS(currentVisit.visitNumber, 'extremityType', 'UPPER')}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${
                        currentVisit.mstsScore?.extremityType === 'UPPER'
                          ? 'border-purple-600 bg-purple-100 text-purple-900'
                          : 'border-gray-300 bg-white hover:border-purple-400'
                      }
                    `}
                  >
                    Upper Extremity
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVisitMSTS(currentVisit.visitNumber, 'extremityType', 'LOWER')}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${
                        currentVisit.mstsScore?.extremityType === 'LOWER'
                          ? 'border-purple-600 bg-purple-100 text-purple-900'
                          : 'border-gray-300 bg-white hover:border-purple-400'
                      }
                    `}
                  >
                    Lower Extremity
                  </button>
                </div>
              </div>

              {currentVisit.mstsScore?.extremityType && (
                <div className="space-y-4">
                  {/* Common Domains */}
                  {['pain', 'function', 'emotionalAcceptance'].map((domain) => (
                    <div key={domain}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {domain.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={currentVisit.mstsScore?.[domain as keyof MSTSScore] as number || 0}
                        onChange={(e) => updateVisitMSTS(currentVisit.visitNumber, domain as keyof MSTSScore, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>0</span>
                        <span className="font-bold text-purple-700">
                          {currentVisit.mstsScore?.[domain as keyof MSTSScore] || 0}
                        </span>
                        <span>5</span>
                      </div>
                    </div>
                  ))}

                  {/* Upper Extremity Specific */}
                  {currentVisit.mstsScore.extremityType === 'UPPER' && (
                    <>
                      {['handPositioning', 'manualDexterity', 'liftingAbility'].map((domain) => (
                        <div key={domain}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {domain.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={currentVisit.mstsScore?.[domain as keyof MSTSScore] as number || 0}
                            onChange={(e) => updateVisitMSTS(currentVisit.visitNumber, domain as keyof MSTSScore, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>0</span>
                            <span className="font-bold text-purple-700">
                              {currentVisit.mstsScore?.[domain as keyof MSTSScore] || 0}
                            </span>
                            <span>5</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Lower Extremity Specific */}
                  {currentVisit.mstsScore.extremityType === 'LOWER' && (
                    <>
                      {['supports', 'walkingAbility', 'gait'].map((domain) => (
                        <div key={domain}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {domain.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            value={currentVisit.mstsScore?.[domain as keyof MSTSScore] as number || 0}
                            onChange={(e) => updateVisitMSTS(currentVisit.visitNumber, domain as keyof MSTSScore, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>0</span>
                            <span className="font-bold text-purple-700">
                              {currentVisit.mstsScore?.[domain as keyof MSTSScore] || 0}
                            </span>
                            <span>5</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* MSTS Total Score */}
                  {currentVisit.mstsScore?.totalScore !== undefined && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm opacity-90 mb-1">MSTS Total Score</div>
                          <div className="text-4xl font-bold">
                            {currentVisit.mstsScore.totalScore} / 30
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-90 mb-1">Percentage</div>
                          <div className="text-3xl font-bold">
                            {Math.round(currentVisit.mstsScore.percentage || 0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Klinis
              </label>
              <textarea
                value={currentVisit.notes || ''}
                onChange={(e) => updateVisit(currentVisit.visitNumber, { notes: e.target.value })}
                rows={4}
                placeholder="Catatan tambahan mengenai kunjungan ini..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {completedVisitsCount > 0 && (
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
              <span className="font-medium">
                {completedVisitsCount} dari 14 kunjungan follow-up telah lengkap
              </span> - Data follow-up siap untuk review di Section 10.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
