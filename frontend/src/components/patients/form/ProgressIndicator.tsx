import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: {
    number: number;
    title: string;
    completed: boolean;
  }[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="w-full py-6 px-4 bg-white border-b">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                step.number === currentStep
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : step.completed
                  ? 'bg-green-50 border border-green-300'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.completed
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs font-medium truncate ${
                  step.number === currentStep
                    ? 'text-blue-900'
                    : step.completed
                    ? 'text-green-900'
                    : 'text-gray-600'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
