import React from 'react';
import { SectionValidation } from './FormContext';

/**
 * SectionNavigator - Sidebar navigation for multi-step wizard
 *
 * Features:
 * - Visual section list
 * - Click to navigate between sections
 * - Status indicators (completed, current, incomplete, error)
 * - Progress tracking
 * - Optional sections marked
 */

export interface NavigatorSection {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  validation?: SectionValidation;
}

export interface SectionNavigatorProps {
  sections: NavigatorSection[];
  currentSectionId: string;
  onNavigate: (sectionId: string) => void;
  allowNavigation?: boolean; // Allow clicking to any section
  className?: string;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  currentSectionId,
  onNavigate,
  allowNavigation = true,
  className = '',
}) => {
  const currentIndex = sections.findIndex(s => s.id === currentSectionId);

  const getSectionStatus = (section: NavigatorSection, index: number) => {
    const hasErrors = section.validation && !section.validation.isValid;
    const isCurrent = section.id === currentSectionId;
    const isCompleted = section.isCompleted;
    const isPast = index < currentIndex;

    if (hasErrors) return 'error';
    if (isCurrent) return 'current';
    if (isCompleted || isPast) return 'completed';
    return 'incomplete';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'current':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'current':
        return 'bg-blue-50 border-blue-500 border-2 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const completedCount = sections.filter(s => s.isCompleted).length;
  const totalCount = sections.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <nav className={`space-y-4 ${className}`}>
      {/* Progress Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {completedCount} of {totalCount} sections completed
        </p>
      </div>

      {/* Section List */}
      <div className="space-y-2">
        {sections.map((section, index) => {
          const status = getSectionStatus(section, index);
          const statusStyles = getStatusStyles(status);
          const canNavigate = allowNavigation;

          return (
            <button
              key={section.id}
              onClick={() => canNavigate && onNavigate(section.id)}
              disabled={!canNavigate}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-start space-x-3 border ${statusStyles} ${
                canNavigate ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
              }`}
              aria-current={section.isCurrent ? 'step' : undefined}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(status)}
              </div>

              {/* Section Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate pr-2">
                    {index + 1}. {section.title}
                  </div>
                  {section.isOptional && (
                    <span className="flex-shrink-0 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                </div>

                {section.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {section.description}
                  </p>
                )}

                {/* Error count */}
                {status === 'error' && section.validation && (
                  <p className="text-xs text-red-600 mt-1">
                    {section.validation.errors.length} error
                    {section.validation.errors.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {/* Current indicator arrow */}
              {section.isCurrent && (
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Status Legend</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
            <span className="text-gray-600">Incomplete</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600">Has Errors</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Compact version - Horizontal progress indicator for mobile/small screens
 */
export const CompactSectionNavigator: React.FC<{
  sections: NavigatorSection[];
  currentSectionId: string;
  className?: string;
}> = ({ sections, currentSectionId, className = '' }) => {
  const currentIndex = sections.findIndex(s => s.id === currentSectionId);
  const progressPercentage = Math.round(((currentIndex + 1) / sections.length) * 100);

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentIndex + 1} of {sections.length}
        </span>
        <span className="text-sm font-semibold text-blue-600">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 truncate">
        {sections[currentIndex]?.title}
      </p>
    </div>
  );
};
