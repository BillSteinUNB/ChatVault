import React from 'react';
import { Button } from '../ui/Button';
import { MessageSquare, ExternalLink, ArrowRight, Check } from 'lucide-react';

interface ConnectStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export const ConnectStep: React.FC<ConnectStepProps> = ({ onNext, onSkip }) => {
  const openChatGPT = () => {
    window.open('https://chat.openai.com', '_blank');
  };

  const openClaude = () => {
    window.open('https://claude.ai', '_blank');
  };

  const openPerplexity = () => {
    window.open('https://www.perplexity.ai', '_blank');
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
            <div className="w-8 h-1 bg-primary-500 rounded-full"></div>
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
            <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
          </div>
          <p className="text-center text-sm text-neutral-400 mt-2">Step 3 of 4</p>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Save Your First Conversation
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Visit your favorite AI platform and have a conversation. The ChatVault extension will automatically save it to your vault.
          </p>
        </div>

        {/* Platform cards */}
        <div className="space-y-4 mb-8">
          {/* ChatGPT */}
          <button
            onClick={openChatGPT}
            className="w-full bg-neutral-900/50 border border-white/10 hover:border-primary-500/50 rounded-xl p-6 backdrop-blur-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 rounded-lg p-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#10a37f"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="white"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">ChatGPT</h3>
                  <p className="text-sm text-neutral-400">Open AI's most popular chatbot</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Claude */}
          <button
            onClick={openClaude}
            className="w-full bg-neutral-900/50 border border-white/10 hover:border-primary-500/50 rounded-xl p-6 backdrop-blur-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500/20 rounded-lg p-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#f59e0b"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Claude</h3>
                  <p className="text-sm text-neutral-400">Anthropic's helpful assistant</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Perplexity */}
          <button
            onClick={openPerplexity}
            className="w-full bg-neutral-900/50 border border-white/10 hover:border-primary-500/50 rounded-xl p-6 backdrop-blur-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-teal-500/20 rounded-lg p-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#20B2AA"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Perplexity</h3>
                  <p className="text-sm text-neutral-400">AI-powered search engine</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
          <h3 className="text-white font-semibold mb-4 text-center">How It Works</h3>
          <ol className="space-y-3 text-neutral-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                1
              </span>
              <span>Click on one of the platforms above to open it in a new tab</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                2
              </span>
              <span>Start a conversation and ask some questions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-sm font-semibold">
                3
              </span>
              <span>The ChatVault extension will automatically save your conversation</span>
            </li>
          </ol>
        </div>

        {/* Note */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary-300 font-medium">No manual action required</p>
              <p className="text-neutral-400 mt-1">
                Once installed, the extension works in the background. Just have conversations normally and they'll be saved automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg" className="w-full md:w-auto px-12">
            I've Saved a Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};
