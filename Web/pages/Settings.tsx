import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Shield, Database, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
    </div>
  );
};
