import React from 'react';

/**
 * ProgressIndicator - Enhanced visual progress tracking for multi-step wizard
 *
 * Features:
 * - Visual progress bar
 * - Section completion checkmarks
 * - Current section highlight
 * - Percentage display
 * - Step indicators with status
 * - Responsive design
 */

export interface ProgressStep {
  id: string;
  number: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  hasErrors?: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  totalSteps,
  className = '',
  variant = 'default',
}) => {
  const completedSteps = steps.filter(s => s.isCompleted).length;
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  if (variant === 'minimal') {
    return (
      <div className={`bg-white border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Section {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  step.isCurrent
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                    : step.hasErrors
                    ? 'bg-red-100 text-red-800'
                    : step.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step.number}. {step.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Patient Registration Form
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {completedSteps} of {totalSteps} sections completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {progressPercentage}%
            </div>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative flex items-center p-3 rounded-lg border-2 transition-all ${
                step.isCurrent
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : step.hasErrors
                  ? 'bg-red-50 border-red-300'
                  : step.isCompleted
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mr-3">
                {step.isCompleted && !step.hasErrors ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : step.hasErrors ? (
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : step.isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.number}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">{step.number}</span>
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium truncate ${
                    step.isCurrent
                      ? 'text-blue-900'
                      : step.hasErrors
                      ? 'text-red-900'
                      : step.isCompleted
                      ? 'text-green-900'
                      : 'text-gray-700'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {step.isCompleted && !step.hasErrors
                    ? 'Completed'
                    : step.hasErrors
                    ? 'Has errors'
                    : step.isCurrent
                    ? 'In progress'
                    : 'Pending'}
                </div>
              </div>

              {/* Current Indicator */}
              {step.isCurrent && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * StepDots - Minimalist dot-based progress indicator
 */
export const StepDots: React.FC<{
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
  className?: string;
}> = ({ currentStep, totalSteps, completedSteps = [], className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`transition-all ${
            step === currentStep
              ? 'w-3 h-3 bg-blue-600 rounded-full'
              : completedSteps.includes(step)
              ? 'w-2.5 h-2.5 bg-green-500 rounded-full'
              : 'w-2 h-2 bg-gray-300 rounded-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * LinearProgress - Simple linear progress bar
 */
export const LinearProgress: React.FC<{
  currentStep: number;
  totalSteps: number;
  showPercentage?: boolean;
  className?: string;
}> = ({ currentStep, totalSteps, showPercentage = true, className = '' }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={`${className}`}>
      {showPercentage && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-700 font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-blue-600 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
