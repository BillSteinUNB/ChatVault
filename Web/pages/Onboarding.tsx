import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { InstallStep } from '../components/onboarding/InstallStep';
import { ConnectStep } from '../components/onboarding/ConnectStep';
import { CompleteStep } from '../components/onboarding/CompleteStep';

const ONBOARDING_STEPS = ['Welcome', 'Install', 'Connect', 'Complete'] as const;

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, completed, skip, nextStep, prevStep, complete } = useOnboarding();

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (completed) {
      navigate('/dashboard', { replace: true });
    }
  }, [completed, navigate]);

  // Handle skip
  const handleSkip = () => {
    skip();
    navigate('/dashboard', { replace: true });
  };

  // Handle completion
  const handleComplete = () => {
    complete();
    navigate('/dashboard', { replace: true });
  };

  // If completed, don't render anything (redirect will happen)
  if (completed) {
    return null;
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            {/* Step labels */}
            <div className="flex items-center gap-2 flex-1">
              {ONBOARDING_STEPS.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2">
                    {/* Step circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        index <= currentStep
                          ? 'bg-primary-500 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {/* Step label */}
                    <span
                      className={`text-sm font-medium transition-colors ${
                        index <= currentStep ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {/* Connector line */}
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        index < currentStep ? 'bg-primary-500' : 'bg-neutral-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="text-sm text-neutral-400 hover:text-white transition-colors px-3 py-1 rounded hover:bg-neutral-800"
            >
              Skip
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-purple-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="pt-24">
        {currentStep === 0 && (
          <WelcomeStep
            onNext={nextStep}
            onSkip={handleSkip}
          />
        )}
        {currentStep === 1 && (
          <InstallStep
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={handleSkip}
          />
        )}
        {currentStep === 2 && (
          <ConnectStep
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={handleSkip}
          />
        )}
        {currentStep === 3 && (
          <CompleteStep
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};
