import { useState, useEffect } from 'react';

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  skipped: boolean;
}

const ONBOARDING_STORAGE_KEY = 'chatvault_onboarding';

const DEFAULT_STATE: OnboardingState = {
  completed: false,
  currentStep: 0,
  skipped: false,
};

function loadOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }

  try {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load onboarding state:', error);
  }

  return DEFAULT_STATE;
}

function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(loadOnboardingState);

  useEffect(() => {
    saveOnboardingState(state);
  }, [state]);

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  const complete = () => {
    setState({
      completed: true,
      currentStep: state.currentStep,
      skipped: false,
    });
  };

  const skip = () => {
    setState({
      completed: true,
      currentStep: state.currentStep,
      skipped: true,
    });
  };

  const reset = () => {
    setState(DEFAULT_STATE);
  };

  return {
    ...state,
    nextStep,
    prevStep,
    complete,
    skip,
    reset,
  };
}
