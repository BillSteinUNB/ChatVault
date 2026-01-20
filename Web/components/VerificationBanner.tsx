import React, { useState } from 'react';
import { AlertCircle, X, Mail } from 'lucide-react';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';

interface VerificationBannerProps {
  user: User | null;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ user }) => {
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is logged in but not verified
  const isVerified = user?.email_confirmed_at != null;
  const shouldShow = user && !isVerified && !dismissed;

  if (!shouldShow) {
    return null;
  }

  const handleResend = async () => {
    if (!user?.email) return;

    setResending(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        setMessage(error.message || 'Failed to resend verification email');
      } else {
        setMessage('Verification email sent! Please check your inbox.');
        // Clear success message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30" role="alert" aria-live="polite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-yellow-200 font-medium">
                Please verify your email address
              </p>
              {message && (
                <p className={`text-xs mt-1 ${message.includes('sent') ? 'text-green-400' : 'text-red-400'}`} role="status">
                  {message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Resend verification email"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {resending ? 'Sending...' : 'Resend'}
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center justify-center p-1.5 text-yellow-400 hover:text-yellow-200 hover:bg-yellow-500/20 rounded-lg transition-colors"
              aria-label="Dismiss verification banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
