import React from 'react';
import { Button } from '../ui/Button';
import { CheckCircle, LayoutDashboard, MessageSquare, Search, FolderTree } from 'lucide-react';

interface CompleteStepProps {
  onComplete: () => void;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Success animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-8 shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            You're All Set!
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            Congratulations! You've successfully set up ChatVault. Your AI conversations will now be automatically saved and organized.
          </p>
        </div>

        {/* What's next section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Keep Chatting</h3>
                <p className="text-sm text-neutral-400">
                  Continue using ChatGPT, Claude, and Perplexity as usual
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                  <Search className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Search Everything</h3>
                <p className="text-sm text-neutral-400">
                  Find any conversation instantly with powerful search
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                  <FolderTree className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Get Organized</h3>
                <p className="text-sm text-neutral-400">
                  Use folders and tags to organize your conversations
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-500/20 rounded-lg p-3 mb-4">
                  <LayoutDashboard className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">View Analytics</h3>
                <p className="text-sm text-neutral-400">
                  Track your usage and see conversation statistics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completion checklist */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
          <h3 className="text-white font-semibold mb-4">Setup Complete</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-neutral-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Account created and verified</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Extension installed</span>
            </li>
            <li className="flex items-center gap-3 text-neutral-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>First conversation saved</span>
            </li>
          </ul>
        </div>

        {/* CTA button */}
        <div className="flex justify-center">
          <Button onClick={onComplete} size="lg" className="w-full md:w-auto px-12 gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </Button>
        </div>

        {/* Additional help */}
        <div className="mt-8 text-center text-sm text-neutral-400">
          Need help?{' '}
          <a href="/contact" className="text-primary-400 hover:text-primary-300 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};
