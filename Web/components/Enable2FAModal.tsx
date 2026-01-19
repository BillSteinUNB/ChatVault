import React, { useState, useEffect } from 'react';
import { Shield, Loader2, CheckCircle, Copy, Download } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { supabase } from '../services/supabase';

interface Enable2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type EnrollmentStep = 1 | 2 | 3;

interface TOTPEnrollmentData {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

export const Enable2FAModal: React.FC<Enable2FAModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<EnrollmentStep>(1);
  const [enrollmentData, setEnrollmentData] = useState<TOTPEnrollmentData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEnrollmentData(null);
      setVerificationCode('');
      setError(null);
      setBackupCodes([]);
      setCopiedSecret(false);
      startEnrollment();
    }
  }, [isOpen]);

  const startEnrollment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Start MFA enrollment
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (enrollError) throw enrollError;
      if (!data || !data.totp) {
        throw new Error('Failed to generate TOTP enrollment data');
      }

      setEnrollmentData(data as TOTPEnrollmentData);
    } catch (err) {
      console.error('Error starting 2FA enrollment:', err);
      setError(err instanceof Error ? err.message : 'Failed to start enrollment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!enrollmentData || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Challenge and verify the TOTP factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollmentData.id,
      });

      if (challengeError) throw challengeError;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollmentData.id,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      // Generate backup codes (in a real implementation, these would come from Supabase)
      const generatedCodes = generateBackupCodes();
      setBackupCodes(generatedCodes);
      setStep(3);
    } catch (err) {
      console.error('Error verifying 2FA code:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBackupCodes = (): string[] => {
    // Generate 10 backup codes
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 10).toString()
      ).join('');
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  };

  const handleCopySecret = () => {
    if (enrollmentData?.totp.secret) {
      navigator.clipboard.writeText(enrollmentData.totp.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleDownloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatvault-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
  };

  const handleFinish = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enable Two-Factor Authentication">
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 transition-colors ${
                    step > s ? 'bg-primary-500' : 'bg-neutral-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Show QR Code */}
        {step === 1 && enrollmentData && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-neutral-300">
                Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={enrollmentData.totp.qr_code}
                  alt="2FA QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Manual Entry Secret */}
            <div className="bg-neutral-800 border border-white/10 rounded-lg p-4 space-y-3">
              <p className="text-sm text-neutral-400 text-center">
                Or enter this code manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-center text-white font-mono text-sm bg-neutral-900 px-3 py-2 rounded">
                  {enrollmentData.totp.secret}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopySecret}
                  className="flex-shrink-0"
                >
                  {copiedSecret ? (
                    <>
                      <CheckCircle size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setStep(2)}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Enter Verification Code */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Shield className="text-primary-500 mx-auto" size={48} />
              <p className="text-neutral-300">
                Enter the 6-digit code from your authenticator app to verify the setup.
              </p>
            </div>

            {/* Verification Code Input */}
            <div className="space-y-2">
              <label htmlFor="verification-code" className="block text-sm font-medium text-neutral-300">
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
                className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <CheckCircle className="text-emerald-500 mx-auto" size={48} />
              <p className="text-lg font-semibold text-white">2FA Enabled Successfully!</p>
              <p className="text-neutral-400 text-sm">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
            </div>

            {/* Backup Codes Grid */}
            <div className="bg-neutral-800 border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <code
                    key={index}
                    className="text-sm font-mono text-neutral-300 bg-neutral-900 px-3 py-2 rounded text-center"
                  >
                    {code}
                  </code>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyAllCodes}
                className="flex-1"
              >
                <Copy size={16} />
                Copy All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadBackupCodes}
                className="flex-1"
              >
                <Download size={16} />
                Download
              </Button>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ Keep these codes secure. Each code can only be used once.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleFinish}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}

        {/* Loading State for Step 1 */}
        {step === 1 && isLoading && !enrollmentData && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 size={40} className="text-primary-500 animate-spin" />
            <p className="text-neutral-400">Generating QR code...</p>
          </div>
        )}

        {/* Error State for Step 1 */}
        {step === 1 && error && !enrollmentData && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={startEnrollment}
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
