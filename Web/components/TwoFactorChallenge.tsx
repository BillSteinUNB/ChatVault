import React, { useState, useEffect } from 'react';
import { Shield, Loader2, Key } from 'lucide-react';
import { supabase } from '../services/supabase';

interface TwoFactorChallengeProps {
  onSuccess: () => void;
  onCancel: () => void;
  factorId?: string;
}

interface Factor {
  id: string;
  friendly_name?: string | undefined;
  factor_type: string;
  status: string;
}

export const TwoFactorChallenge: React.FC<TwoFactorChallengeProps> = ({
  onSuccess,
  onCancel,
  factorId: providedFactorId,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [showBackupInput, setShowBackupInput] = useState(false);

  useEffect(() => {
    checkMFARequirement();
  }, []);

  const checkMFARequirement = async () => {
    try {
      // Check if MFA is required
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalError) throw aalError;

      // If next level is aal2, MFA is required
      if (aalData.nextLevel === 'aal2') {
        // List factors
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();

        if (factorsError) throw factorsError;

        const totpFactors = factorsData.all?.filter(
          (f: Factor) => f.factor_type === 'totp' && f.status === 'verified'
        ) || [];

        setFactors(totpFactors);

        // If we have factors, create challenge
        if (totpFactors.length > 0) {
          const factorId = providedFactorId || totpFactors[0].id;
          await createChallenge(factorId);
        }
      } else {
        // No MFA required, proceed
        onSuccess();
      }
    } catch (err) {
      console.error('Error checking MFA requirement:', err);
      setError(err instanceof Error ? err.message : 'Failed to check MFA requirement');
    }
  };

  const createChallenge = async (factorId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      setChallengeId(data.id);
    } catch (err) {
      console.error('Error creating challenge:', err);
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!challengeId || !verificationCode) {
      setError('Please enter a verification code');
      return;
    }

    if (!useBackupCode && verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const factorId = providedFactorId || factors[0]?.id;

      if (!factorId) {
        throw new Error('No 2FA factor found');
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      // Verification successful
      onSuccess();
    } catch (err) {
      console.error('Error verifying code:', err);
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupCodeClick = () => {
    setShowBackupInput(true);
    setUseBackupCode(true);
    setVerificationCode('');
    setError(null);
  };

  const handleBackToTOTP = () => {
    setShowBackupInput(false);
    setUseBackupCode(false);
    setVerificationCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Shield className="text-primary-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h1>
            <p className="text-neutral-400">
              {useBackupCode
                ? 'Enter a backup code to access your account'
                : 'Enter the 6-digit code from your authenticator app'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {!showBackupInput && (
            <div className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-neutral-400 mb-2">
                  Verification Code
                </label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={handleBackupCodeClick}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors w-full text-center"
              >
                Use a backup code instead
              </button>
            </div>
          )}

          {showBackupInput && (
            <div className="space-y-4">
              <div>
                <label htmlFor="backup-code" className="block text-sm font-medium text-neutral-400 mb-2">
                  Backup Code
                </label>
                <input
                  id="backup-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={handleBackToTOTP}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors w-full text-center"
              >
                <Key size={14} className="inline mr-1" />
                Back to authenticator app code
              </button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={isLoading}
              className="w-full bg-white/5 hover:bg-white/10 text-neutral-300 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          {isLoading && !challengeId && !error && (
            <div className="mt-6 flex flex-col items-center justify-center space-y-3">
              <Loader2 size={32} className="text-primary-500 animate-spin" />
              <p className="text-neutral-400 text-sm">Preparing verification...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
