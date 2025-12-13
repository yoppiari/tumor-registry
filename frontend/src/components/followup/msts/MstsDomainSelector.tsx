'use client';

import React from 'react';
import { MstsDomainSelectorProps, ScoreLevel } from '../types/msts.types';
import { getScoreBadgeColor } from './domainConfigs';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

/**
 * Reusable domain selector component for MSTS scoring
 * Displays radio button groups with clear descriptions for each score level
 */
export const MstsDomainSelector: React.FC<MstsDomainSelectorProps> = ({
  domain,
  config,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          {config.helpText && (
            <div className="flex items-start gap-2 mt-1">
              <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">{config.helpText}</p>
            </div>
          )}
        </div>

        {/* Current Score Badge */}
        {value !== undefined && (
          <div className="ml-3 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Score:</span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${getScoreBadgeColor(
                value
              )}`}
            >
              {value}
            </div>
          </div>
        )}
      </div>

      {/* Score Level Options */}
      <div className="space-y-2">
        {config.levels.map((level) => {
          const isSelected = value === level.value;
          const scoreColor = getScoreBadgeColor(level.value);

          return (
            <button
              key={level.value}
              onClick={() => !readOnly && onChange(level.value as ScoreLevel)}
              disabled={readOnly}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${readOnly ? 'cursor-default opacity-75' : 'cursor-pointer'}
              `}
              type="button"
            >
              <div className="flex items-center gap-3">
                {/* Score Badge */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
                    ${scoreColor}
                  `}
                >
                  {level.value}
                </div>

                {/* Label and Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {level.label}
                    </span>
                    {isSelected && (
                      <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      isSelected ? 'text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    {level.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MstsDomainSelector;
