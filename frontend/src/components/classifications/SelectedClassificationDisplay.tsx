import React from 'react';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { WhoClassification } from './types';

interface SelectedClassificationDisplayProps {
  classification: WhoClassification;
  onClear: () => void;
  showCodes?: boolean;
  className?: string;
}

/**
 * Display component for the currently selected classification
 * Shows full classification details with breadcrumb path and option to change
 */
export const SelectedClassificationDisplay: React.FC<SelectedClassificationDisplayProps> = ({
  classification,
  onClear,
  showCodes = true,
  className = '',
}) => {
  // Build breadcrumb path
  const breadcrumbs = [classification.category, classification.subcategory, classification.name]
    .filter(Boolean)
    .join(' > ');

  return (
    <div className={`rounded-lg border-2 border-blue-200 bg-blue-50 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <CheckCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-blue-900">Selected Classification</h4>
          <p className="mt-1 text-sm text-blue-800 break-words">{breadcrumbs}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Malignancy badge */}
            {classification.isMalignant !== undefined && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  classification.isMalignant
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}
              >
                {classification.isMalignant ? 'Malignant' : 'Benign'}
              </span>
            )}

            {/* ICD-O-3 Code */}
            {showCodes && classification.icdO3Code && (
              <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-mono font-medium text-blue-900 border border-blue-200">
                ICD-O-3: {classification.icdO3Code}
              </span>
            )}
          </div>
        </div>

        {/* Change button */}
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50 border border-blue-200 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Change
        </button>
      </div>
    </div>
  );
};
