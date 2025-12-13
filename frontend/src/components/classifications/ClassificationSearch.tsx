import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ClassificationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  className?: string;
}

/**
 * Search input component for filtering classifications
 * Features instant search with result count and clear button
 */
export const ClassificationSearch: React.FC<ClassificationSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by name, category, or ICD-O-3 code...',
  resultCount,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <p className="mt-1.5 text-xs text-gray-600">
          {resultCount === 0 ? (
            <span className="text-red-600">No results found</span>
          ) : (
            <span>
              Found <span className="font-semibold">{resultCount}</span> result
              {resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      )}
    </div>
  );
};
