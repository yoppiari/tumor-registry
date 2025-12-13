'use client';

import React, { useState, useEffect } from 'react';
import {
  MstsScoreCalculatorProps,
  ScoreLevel,
  MstsScoreValues,
} from '../types/msts.types';
import {
  useMstsCalculator,
  createMstsScoreResult,
} from './hooks/useMstsCalculator';
import {
  getDomainConfigsForExtremity,
  getInterpretationColor,
} from './domainConfigs';
import MstsDomainSelector from './MstsDomainSelector';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
} from '@heroicons/react/24/outline';

/**
 * Main MSTS Score Calculator Component
 * Supports both Upper and Lower extremity with conditional domain display
 */
export const MstsScoreCalculator: React.FC<MstsScoreCalculatorProps> = ({
  extremityType,
  initialValues,
  onSave,
  readOnly = false,
  showResetButton = true,
  autoCalculate = true,
  previousScore,
}) => {
  const {
    scores,
    setScore,
    totalScore,
    percentageScore,
    interpretation,
    isValid,
    validation,
    reset,
    compareWithPrevious,
  } = useMstsCalculator(extremityType, initialValues);

  const [assessmentDate, setAssessmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [assessedBy, setAssessedBy] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get domain configurations for current extremity type
  const domainConfigs = getDomainConfigsForExtremity(extremityType);

  // Compare with previous score if available
  const scoreChanges =
    previousScore && isValid ? compareWithPrevious(previousScore) : [];

  // Handle save
  const handleSave = async () => {
    if (!isValid) {
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(false);

      const result = createMstsScoreResult(scores as MstsScoreValues, {
        assessmentDate: new Date(assessmentDate),
        assessedBy: assessedBy || undefined,
        notes: notes || undefined,
      });

      await onSave(result);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving MSTS score:', error);
      // Error handling could be enhanced here
    } finally {
      setSaving(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all scores?')) {
      reset();
      setAssessmentDate(new Date().toISOString().split('T')[0]);
      setAssessedBy('');
      setNotes('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">MSTS Score Calculator</h2>
            <p className="text-blue-100 mt-1">
              Musculoskeletal Tumor Society Functional Rating System
            </p>
            <div className="mt-2 inline-block">
              <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-medium">
                {extremityType === 'UPPER' ? 'Upper Extremity' : 'Lower Extremity'}
              </span>
            </div>
          </div>
          {readOnly && (
            <span className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium">
              Read Only
            </span>
          )}
        </div>
      </div>

      {/* Score Summary Panel */}
      <div className="bg-white border-x border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Score */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">Total MSTS Score</div>
            <div className="text-5xl font-bold text-blue-900">{totalScore}</div>
            <div className="text-sm text-blue-600 mt-1">out of 30 points</div>
          </div>

          {/* Percentage */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
            <div className="text-sm font-medium text-purple-700 mb-1">Percentage</div>
            <div className="text-5xl font-bold text-purple-900">{percentageScore}%</div>
            <div className="text-sm text-purple-600 mt-1">functional capacity</div>
          </div>

          {/* Interpretation */}
          <div
            className={`p-6 rounded-lg border-2 ${getInterpretationColor(
              interpretation
            )}`}
          >
            <div className="text-sm font-medium mb-1">Functional Status</div>
            <div className="text-3xl font-bold">{interpretation}</div>
            <div className="text-sm mt-1">
              {interpretation === 'Excellent' && '≥25 points'}
              {interpretation === 'Good' && '20-24 points'}
              {interpretation === 'Fair' && '15-19 points'}
              {interpretation === 'Poor' && '<15 points'}
            </div>
          </div>
        </div>

        {/* Assessment Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Date *
            </label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessed By
            </label>
            <input
              type="text"
              value={assessedBy}
              onChange={(e) => setAssessedBy(e.target.value)}
              placeholder="Physician or clinician name"
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            {!readOnly && (
              <>
                <button
                  onClick={handleSave}
                  disabled={!isValid || saving}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    !isValid || saving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : saveSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    'Save Score'
                  )}
                </button>

                {showResetButton && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Validation Messages */}
        {validation.errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">
                  Please complete all required fields:
                </h4>
                <ul className="mt-1 space-y-1">
                  {validation.errors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800">Warnings:</h4>
                <ul className="mt-1 space-y-1">
                  {validation.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Score Changes Comparison */}
        {scoreChanges.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-800">
                  Changes from Previous Assessment:
                </h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {scoreChanges.map((change, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {change.domain}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {change.previousValue} → {change.currentValue}
                        </span>
                        {change.changeType === 'improvement' ? (
                          <TrendingUpIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDownIcon className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            change.changeType === 'improvement'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {change.change > 0 ? '+' : ''}
                          {change.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Domain Selectors */}
      <div className="bg-gray-50 border border-gray-200 rounded-b-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Assessment Domains</h3>
          <p className="text-gray-600">
            Rate each domain from 0 (worst) to 5 (best) based on the patient's current
            functional status.
          </p>
        </div>

        {/* Grid Layout for Domain Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(domainConfigs).map(([domain, config]) => (
            <MstsDomainSelector
              key={domain}
              domain={domain}
              config={config}
              value={(scores as any)[domain]}
              onChange={(value: ScoreLevel) => setScore(domain, value)}
              readOnly={readOnly}
            />
          ))}
        </div>

        {/* Clinical Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Additional observations, limitations, context, or recommendations for this assessment..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                About MSTS Score
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                The MSTS (Musculoskeletal Tumor Society) score is a standardized functional
                outcome assessment tool. It evaluates 6 functional domains, each scored 0-5
                points, for a total of 0-30 points. Higher scores indicate better functional
                outcomes.{' '}
                {extremityType === 'UPPER'
                  ? 'For upper extremity: Pain, Function, Emotional Acceptance, Hand Positioning, and Manual Dexterity.'
                  : 'For lower extremity: Pain, Function, Emotional Acceptance, and Lifting Ability.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MstsScoreCalculator;
