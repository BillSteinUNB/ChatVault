import React from 'react';
import { Button } from '../ui/Button';
import { Sparkles, Shield, Zap, Cloud } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onSkip }) => {
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

        {/* Hero icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to ChatVault
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Your personal AI conversation assistant. Save, search, and organize your ChatGPT, Claude, and Perplexity conversations in one secure place.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure Storage</h3>
              <p className="text-sm text-neutral-400">
                Your conversations are encrypted and stored safely
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                <Zap className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Search</h3>
              <p className="text-sm text-neutral-400">
                Find anything in your conversations with powerful search
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                <Cloud className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Cloud Sync</h3>
              <p className="text-sm text-neutral-400">
                Access your chats from any device, anywhere
              </p>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" className="w-full md:w-auto px-12">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
