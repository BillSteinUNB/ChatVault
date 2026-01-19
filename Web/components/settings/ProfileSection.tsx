import React, { useState } from 'react';
import { User, Mail, Check, Loader2 } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';

export const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Update local state when profile loads
  React.useEffect(() => {
    if (profile?.full_name) {
      setDisplayName(profile.full_name);
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    const { error } = await updateProfile({ full_name: displayName.trim() || null });

    if (error) {
      setSaveStatus('error');
      setErrorMessage(error.message);
    } else {
      setSaveStatus('success');
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }

    setIsSaving(false);
  };

  const hasChanges = displayName !== (profile?.full_name || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-neutral-400 mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
          className="w-full px-4 py-3 bg-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
        />
        <p className="text-sm text-neutral-500 mt-1">
          This name will be displayed on your profile and in comments.
        </p>
      </div>

      {/* Email (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Email Address
        </label>
        <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900/50 border border-white/5 rounded-lg">
          <Mail className="text-neutral-500" size={18} />
          <p className="text-white flex-1">{user?.email}</p>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Your email address is used for login and cannot be changed.
        </p>
      </div>

      {/* User ID */}
      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          User ID
        </label>
        <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900/50 border border-white/5 rounded-lg">
          <User className="text-neutral-500" size={18} />
          <p className="text-white text-sm font-mono flex-1">{user?.id}</p>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Your unique user identifier.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`
            px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            flex items-center gap-2
            ${hasChanges && !isSaving
              ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'bg-neutral-700/50 text-neutral-500 cursor-not-allowed'
            }
          `}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>

        {saveStatus === 'error' && (
          <p className="text-sm text-red-400">{errorMessage || 'Failed to save changes'}</p>
        )}
      </div>

      {/* Account Information */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-sm font-medium text-neutral-400 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Member Since</span>
            <span className="text-white">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Last Updated</span>
            <span className="text-white">
              {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
