import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Button } from '../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-neutral-400">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            <div className="text-center text-sm text-neutral-400">
              Didn't receive the email?{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  handleSubmit(new Event('submit') as any);
                }}
                className="text-primary-400 hover:text-primary-300 transition-colors"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend email'}
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-neutral-400">
              <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
            <p className="text-neutral-400">
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
