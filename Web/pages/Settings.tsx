import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Shield, Database, Trash2, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { Enable2FAModal } from '../components/Enable2FAModal';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-mono mb-4">
          <Settings size={14} />
          SETTINGS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Account Settings</h1>
        <p className="text-xl text-neutral-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="text-primary-500" />
            Profile
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Email
                </label>
                <p className="text-white">{user?.email || 'Not signed in'}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-primary-500" />
            Security
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              {/* 2FA Status */}
              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <Lock className={is2FAEnabled ? 'text-emerald-500' : 'text-neutral-500'} size={20} />
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className={`text-sm ${is2FAEnabled ? 'text-emerald-400' : 'text-neutral-500'}`}>
                      {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                {!is2FAEnabled && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIs2FAModalOpen(true)}
                  >
                    Enable
                  </Button>
                )}
              </div>

              <p className="text-neutral-300">
                You can manage your password and authentication settings.
              </p>
              <Button
                variant="secondary"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </section>

        {/* Data & Privacy Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="text-primary-500" />
            Data & Privacy
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-neutral-300 mb-4">
                Manage your data and privacy settings. You can export your data or delete your account permanently.
              </p>
              <Button
                variant="secondary"
                className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 size={16} />
                Delete Account
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
