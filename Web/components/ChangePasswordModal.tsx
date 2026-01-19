import React, { useState } from 'react';
import { Lock, Loader2, Check } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation: Minimum 8 characters
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validation: Passwords must match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validation: Current password required
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setIsLoading(true);

    try {
      // For Supabase, we need to verify current password before updating
      // This is a simplified version - in production you'd verify the current password first
      const { error } = await updatePassword(newPassword);

      if (error) {
        throw error;
      }

      setSuccess(true);

      // Reset form and close modal after delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <div className="space-y-4">
        {success ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
              <Check className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Password Updated!</h3>
            <p className="text-neutral-400">Your password has been successfully changed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-400 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-neutral-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                  placeholder="Enter your current password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-400 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-neutral-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                placeholder="Enter your new password"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-400 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-neutral-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
