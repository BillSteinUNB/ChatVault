import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { ChangePasswordModal } from '../ChangePasswordModal';
import { Enable2FAModal } from '../Enable2FAModal';
import { supabase } from '../../services/supabase';

interface SecuritySectionProps {
  on2FASuccess?: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ on2FASuccess }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check 2FA status on mount
  React.useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const { data: factors, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        console.error('Error checking 2FA status:', error);
        return;
      }

      // Check if there's an active TOTP factor
      const totpFactor = factors?.all?.find(
        (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
      );

      setIs2FAEnabled(!!totpFactor);
    } catch (err) {
      console.error('Error checking 2FA status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
    if (on2FASuccess) {
      on2FASuccess();
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    try {
      const { data: factors, error } = await supabase.auth.mfa.listFactors();

      if (error) throw error;

      const totpFactor = factors?.all?.find(
        (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
      );

      if (!totpFactor) {
        throw new Error('No verified TOTP factor found');
      }

      // Unenroll the factor
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId: totpFactor.id,
      });

      if (unenrollError) throw unenrollError;

      setIs2FAEnabled(false);
    } catch (err: any) {
      console.error('Error disabling 2FA:', err);
      alert(err.message || 'Failed to disable two-factor authentication');
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${is2FAEnabled ? 'bg-emerald-500/20' : 'bg-neutral-700/50'}`}>
              {is2FAEnabled ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <AlertCircle className="text-neutral-500" size={20} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-medium">Two-Factor Authentication</p>
                {isLoading ? (
                  <span className="text-xs text-neutral-500">Loading...</span>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${is2FAEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700/50 text-neutral-500'}`}>
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
              <p className={`text-sm ${is2FAEnabled ? 'text-emerald-400' : 'text-neutral-500'} mb-2`}>
                {is2FAEnabled
                  ? 'Your account is protected with 2FA. You\'ll need a verification code to sign in.'
                  : 'Add an extra layer of security to your account.'}
              </p>
              <p className="text-sm text-neutral-400">
                Require a verification code in addition to your password when signing in.
              </p>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            {!isLoading && (
              <>
                {is2FAEnabled ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDisable2FA}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIs2FAModalOpen(true)}
                  >
                    Enable
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-700/50">
            <Lock className="text-neutral-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium mb-1">Password</p>
            <p className="text-sm text-neutral-400 mb-4">
              Change your password to keep your account secure.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsChangePasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Active Sessions (Future) */}
      <div className="p-6 bg-neutral-800/30 rounded-lg border border-white/5 opacity-50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-700/30">
            <Shield className="text-neutral-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-neutral-400 font-medium mb-1">Active Sessions</p>
            <p className="text-sm text-neutral-500">
              View and manage all active sessions across your devices. (Coming soon)
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />

      {/* 2FA Enrollment Modal */}
      <Enable2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onSuccess={handle2FASuccess}
      />
    </div>
  );
};
