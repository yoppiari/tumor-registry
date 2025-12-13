import React from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  StarIcon as StarIconOutline,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { WhoClassification } from './types';

interface ClassificationNodeProps {
  classification: WhoClassification;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  showCodes?: boolean;
  depth?: number;
}

/**
 * Individual tree node component for a single classification
 * Displays classification details with selection, favorite, and malignancy indicators
 */
export const ClassificationNode: React.FC<ClassificationNodeProps> = ({
  classification,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  showCodes = true,
  depth = 0,
}) => {
  const indentClass = depth > 0 ? `pl-${depth * 4}` : '';

  return (
    <div
      className={`group relative border-b border-gray-100 last:border-b-0 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`w-full px-4 py-3 text-left flex items-start gap-3 ${indentClass}`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 leading-snug">
                {classification.name || classification.diagnosis}
              </h4>
              {classification.subcategory && (
                <p className="mt-0.5 text-xs text-gray-600">{classification.subcategory}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {classification.isMalignant && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-200">
                  Malignant
                </span>
              )}
              {classification.isMalignant === false && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                  Benign
                </span>
              )}
              {isSelected && (
                <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* ICD-O-3 Code */}
          {showCodes && classification.icdO3Code && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                ICD-O-3: {classification.icdO3Code}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? (
          <StarIconSolid className="h-5 w-5 text-yellow-500" />
        ) : (
          <StarIconOutline className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
        )}
      </button>
    </div>
  );
};

interface CategoryNodeProps {
  name: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Category header node component
 * Displays category name with expand/collapse functionality
 */
export const CategoryNode: React.FC<CategoryNodeProps> = ({
  name,
  count,
  isExpanded,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
    >
      <div className="flex items-center gap-2">
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        )}
        <span className="font-semibold text-gray-900">{name}</span>
      </div>
      <span className="text-sm text-gray-600 font-medium bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
        {count}
      </span>
    </button>
  );
};
