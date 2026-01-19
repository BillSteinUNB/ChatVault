import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { TwoFactorChallenge } from '../components/TwoFactorChallenge';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import { supabase } from '../services/supabase';

type LoginStep = 'credentials' | 'mfa';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, sign in with credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if MFA is required
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalData && aalData.nextLevel === 'aal2') {
        // MFA required, get the first TOTP factor
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const totpFactor = factorsData?.all?.find(
          (f: any) => f.factor_type === 'totp' && f.status === 'verified'
        );

        if (totpFactor) {
          setFactorId(totpFactor.id);
          setLoginStep('mfa');
          setLoading(false);
          return;
        }
      }

      // No MFA required, proceed to dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleMFASuccess = () => {
    // MFA verification successful, navigate to dashboard
    navigate('/');
  };

  const handleMFACancel = () => {
    // User cancelled MFA, go back to credentials
    setLoginStep('credentials');
    setFactorId(undefined);
    setError('');
  };

  return (
    <>
      {loginStep === 'mfa' ? (
        <TwoFactorChallenge
          onSuccess={handleMFASuccess}
          onCancel={handleMFACancel}
          factorId={factorId}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                <p className="text-neutral-400">Sign in to access your vault</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <SocialLoginButtons onError={(err) => setError(err.message)} />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-neutral-900 text-neutral-400">Or continue with email</span>
                </div>
              </div>

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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-400">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-neutral-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
