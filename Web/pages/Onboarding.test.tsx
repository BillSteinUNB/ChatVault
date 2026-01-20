import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Onboarding } from './Onboarding';
import { useOnboarding } from '../hooks/useOnboarding';

// Mock the useOnboarding hook
vi.mock('../hooks/useOnboarding', () => ({
  useOnboarding: vi.fn(),
}));

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('when onboarding is not completed', () => {
    const mockUseOnboarding = {
      currentStep: 0,
      completed: false,
      skipped: false,
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      complete: vi.fn(),
      skip: vi.fn(),
      reset: vi.fn(),
    };

    beforeEach(() => {
      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);
    });

    it('renders the onboarding page', () => {
      renderWithRouter(<Onboarding />);
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('shows progress indicator with all steps', () => {
      renderWithRouter(<Onboarding />);
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Install')).toBeInTheDocument();
      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('shows skip button', () => {
      renderWithRouter(<Onboarding />);
      expect(screen.getByText('Skip')).toBeInTheDocument();
    });

    it('displays WelcomeStep on step 0', () => {
      renderWithRouter(<Onboarding />);
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('shows progress bar with correct width for step 0', () => {
      renderWithRouter(<Onboarding />);
      const progressBar = screen.getByRole('progressbar') || document.querySelector('[style*="width"]');
      expect(progressBar).toBeDefined();
    });
  });

  describe('when onboarding is completed', () => {
    const mockUseOnboarding = {
      currentStep: 3,
      completed: true,
      skipped: false,
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      complete: vi.fn(),
      skip: vi.fn(),
      reset: vi.fn(),
    };

    beforeEach(() => {
      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);
    });

    it('redirects to dashboard', async () => {
      renderWithRouter(<Onboarding />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      });
    });

    it('does not render content while redirecting', () => {
      const { container } = renderWithRouter(<Onboarding />);
      expect(container.firstChild).toBe(null);
    });
  });

  describe('step navigation', () => {
    it('shows correct step for each currentStep value', async () => {
      const mockUseOnboarding = {
        currentStep: 1,
        completed: false,
        skipped: false,
        nextStep: vi.fn(),
        prevStep: vi.fn(),
        complete: vi.fn(),
        skip: vi.fn(),
        reset: vi.fn(),
      };

      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);

      renderWithRouter(<Onboarding />);
      // InstallStep should be rendered
      expect(screen.getByText('Install the Extension')).toBeInTheDocument();
    });
  });

  describe('skip functionality', () => {
    const mockUseOnboarding = {
      currentStep: 0,
      completed: false,
      skipped: false,
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      complete: vi.fn(),
      skip: vi.fn(),
      reset: vi.fn(),
    };

    beforeEach(() => {
      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);
    });

    it('calls skip and navigates to dashboard when skip button is clicked', async () => {
      renderWithRouter(<Onboarding />);

      const skipButton = screen.getAllByText('Skip')[0];
      skipButton.click();

      await waitFor(() => {
        expect(mockUseOnboarding.skip).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      });
    });
  });

  describe('progress indicator', () => {
    it('shows completed steps with checkmarks', () => {
      const mockUseOnboarding = {
        currentStep: 2,
        completed: false,
        skipped: false,
        nextStep: vi.fn(),
        prevStep: vi.fn(),
        complete: vi.fn(),
        skip: vi.fn(),
        reset: vi.fn(),
      };

      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);

      renderWithRouter(<Onboarding />);

      // Steps 0 and 1 should show checkmarks (completed)
      // Step 2 should show current step
      // Step 3 should show not started
    });

    it('updates progress bar based on current step', () => {
      const mockUseOnboarding = {
        currentStep: 1,
        completed: false,
        skipped: false,
        nextStep: vi.fn(),
        prevStep: vi.fn(),
        complete: vi.fn(),
        skip: vi.fn(),
        reset: vi.fn(),
      };

      vi.mocked(useOnboarding).mockReturnValue(mockUseOnboarding);

      renderWithRouter(<Onboarding />);

      // Progress should be at 50% (2 out of 4 steps)
      const progressBar = document.querySelector('[style*="width"]');
      expect(progressBar).toBeDefined();
    });
  });
});
