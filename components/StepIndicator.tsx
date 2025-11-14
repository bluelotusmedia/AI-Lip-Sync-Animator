import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ["Upload Image", "Customize Portrait"];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                index + 1 <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`ml-3 mr-4 text-sm font-medium transition-all duration-300 ${
                index + 1 <= currentStep ? 'text-white' : 'text-gray-500'
              }`}
            >
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-auto border-t-2 transition-all duration-300 ${
                index < currentStep -1 ? 'border-purple-600' : 'border-gray-700'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;