import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Download, CheckCircle, Chrome, ExternalLink } from 'lucide-react';

interface InstallStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export const InstallStep: React.FC<InstallStepProps> = ({ onNext, onSkip }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Check if extension is installed by looking for the extension in navigator
  useEffect(() => {
    const checkExtension = () => {
      // Try to detect if extension is installed
      // This is a simple heuristic - in production you might have a more robust check
      const hasExtension = !!(window as any).chrome?.runtime;

      if (hasExtension) {
        setIsInstalled(true);
      } else if (checkCount < 20) {
        // Check up to 20 times (every 500ms for 10 seconds)
        const timeout = setTimeout(() => {
          setCheckCount((prev) => prev + 1);
        }, 500);
        return () => clearTimeout(timeout);
      }
    };

    checkExtension();
  }, [checkCount]);

  const handleInstallClick = () => {
    // Open Chrome Web Store in a new tab
    window.open(
      'https://chrome.google.com/webstore/detail/chatvault/[EXTENSION_ID]',
      '_blank'
    );
  };

  const handleContinueClick = () => {
    if (isInstalled) {
      onNext();
    } else {
      // Allow manual continue even if extension not detected
      // User might have installed but extension not yet loaded
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Skip button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onSkip}
            className="text-neutral-400 hover:text-white transition-colors text-sm"
          >
            Skip
          </button>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-1 bg-primary-500 rounded-full"></div>
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
          </div>
          <p className="text-center text-sm text-neutral-400 mt-2">Step 2 of 4</p>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
              {isInstalled ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <Download className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isInstalled ? 'Extension Installed!' : 'Install the Extension'}
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            {isInstalled
              ? 'Great! The ChatVault extension has been detected. You can now save conversations directly from ChatGPT, Claude, and Perplexity.'
              : 'Add the ChatVault extension to your browser to start saving conversations automatically.'}
          </p>
        </div>

        {!isInstalled && (
          <>
            {/* Instructions */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
              <h3 className="text-white font-semibold mb-4 text-center">Installation Instructions</h3>
              <ol className="space-y-3 text-neutral-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                    1
                  </span>
                  <span>Click the button below to open the Chrome Web Store</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                    2
                  </span>
                  <span>Click "Add to Chrome" to install the extension</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                    3
                  </span>
                  <span>Pin the extension to your browser toolbar for easy access</span>
                </li>
              </ol>
            </div>

            {/* Install button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleInstallClick}
                variant="secondary"
                size="lg"
                className="w-full md:w-auto px-8 gap-2"
              >
                <Chrome className="w-5 h-5" />
                Open Chrome Web Store
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        {/* Detection status */}
        <div className={`rounded-xl p-4 mb-8 ${
          isInstalled
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-yellow-500/10 border border-yellow-500/30'
        }`}>
          <div className="flex items-center justify-center gap-2 text-sm">
            {isInstalled ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Extension detected!</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-400">Waiting for extension installation...</span>
              </>
            )}
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-center">
          <Button onClick={handleContinueClick} size="lg" className="w-full md:w-auto px-12">
            {isInstalled ? 'Continue' : 'I\'ve Installed the Extension'}
          </Button>
        </div>
      </div>
    </div>
  );
};
