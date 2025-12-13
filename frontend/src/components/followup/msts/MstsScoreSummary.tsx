'use client';

import React from 'react';
import { MstsScoreSummaryProps } from '../types/msts.types';
import { getInterpretationColor, getScoreBadgeColor } from './domainConfigs';
import {
  CalendarIcon,
  UserIcon,
  PencilIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

/**
 * MSTS Score Summary Component
 * Displays a saved MSTS score in read-only mode with optional breakdown
 */
export const MstsScoreSummary: React.FC<MstsScoreSummaryProps> = ({
  score,
  showBreakdown = true,
  onEdit,
  editable = false,
  compact = false,
}) => {
  // Domain display helper
  const domains = [
    { key: 'pain', label: 'Pain', value: score.pain },
    { key: 'function', label: 'Function', value: score.function },
    {
      key: 'emotionalAcceptance',
      label: 'Emotional Acceptance',
      value: score.emotionalAcceptance,
    },
    ...(score.extremityType === 'UPPER'
      ? [
          { key: 'handPositioning', label: 'Hand Positioning', value: score.handPositioning },
          { key: 'manualDexterity', label: 'Manual Dexterity', value: score.manualDexterity },
        ]
      : [
          { key: 'liftingAbility', label: 'Lifting Ability', value: score.liftingAbility },
        ]),
  ].filter((d) => d.value !== undefined);

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">{score.totalScore}</div>
              <div className="text-xs text-gray-600">/ 30</div>
            </div>
            <div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getInterpretationColor(
                  score.interpretation
                )}`}
              >
                {score.interpretation}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {score.percentageScore}% functional capacity
              </div>
            </div>
          </div>
          {editable && onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">MSTS Score Assessment</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(score.assessmentDate).toLocaleDateString()}</span>
              </div>
              {score.assessedBy && (
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  <span>{score.assessedBy}</span>
                </div>
              )}
              <span className="px-2 py-0.5 bg-blue-500 rounded text-xs">
                {score.extremityType === 'UPPER' ? 'Upper Extremity' : 'Lower Extremity'}
              </span>
            </div>
          </div>
          {editable && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Score
            </button>
          )}
        </div>
      </div>

      {/* Score Summary */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Score */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Total Score</span>
            </div>
            <div className="text-4xl font-bold text-blue-900">{score.totalScore}</div>
            <div className="text-sm text-blue-600 mt-1">out of 30 points</div>
          </div>

          {/* Percentage */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-2 border-purple-200">
            <div className="text-sm font-medium text-purple-700 mb-2">
              Functional Capacity
            </div>
            <div className="text-4xl font-bold text-purple-900">
              {score.percentageScore}%
            </div>
            <div className="text-sm text-purple-600 mt-1">of normal function</div>
          </div>

          {/* Interpretation */}
          <div className={`p-5 rounded-lg border-2 ${getInterpretationColor(score.interpretation)}`}>
            <div className="text-sm font-medium mb-2">Status</div>
            <div className="text-3xl font-bold">{score.interpretation}</div>
            <div className="text-sm mt-1">
              {score.interpretation === 'Excellent' && '≥25 points'}
              {score.interpretation === 'Good' && '20-24 points'}
              {score.interpretation === 'Fair' && '15-19 points'}
              {score.interpretation === 'Poor' && '<15 points'}
            </div>
          </div>
        </div>

        {/* Domain Breakdown */}
        {showBreakdown && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Domain Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {domains.map((domain) => (
                <div
                  key={domain.key}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">{domain.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{domain.value} / 5</span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getScoreBadgeColor(
                        domain.value || 0
                      )}`}
                    >
                      {domain.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{score.percentageScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                score.percentageScore >= 83
                  ? 'bg-green-500'
                  : score.percentageScore >= 67
                  ? 'bg-blue-500'
                  : score.percentageScore >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${score.percentageScore}%` }}
            />
          </div>
        </div>

        {/* Clinical Notes */}
        {score.notes && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinical Notes</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{score.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MstsScoreSummary;
