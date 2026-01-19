import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Settings, User, Shield, Database, CreditCard, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { Enable2FAModal } from '../components/Enable2FAModal';
import { useAuth } from '../hooks/useAuth';
import { ProfileSection } from '../components/settings/ProfileSection';

type SettingsSection = 'profile' | 'security' | 'subscription' | 'data-privacy';

interface SettingsNavItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsNavItems: SettingsNavItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database },
];

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-mono mb-4">
          <Settings size={14} />
          SETTINGS
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Account Settings</h1>
        <p className="text-xl text-neutral-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card className="p-4">
            <nav className="space-y-1">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-primary-400' : 'text-neutral-500 group-hover:text-neutral-300'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight size={16} className="text-primary-400" />}
                  </button>
                );
              })}
            </nav>
          </Card>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Card className="p-8">
            {activeSection === 'profile' && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="text-primary-500" />
                  Profile
                </h2>
                <ProfileSection />
              </section>
            )}

            {activeSection === 'security' && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="text-primary-500" />
                  Security
                </h2>
                <div className="space-y-6">
                  {/* 2FA Status */}
                  <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${is2FAEnabled ? 'bg-emerald-500/20' : 'bg-neutral-700/50'}`}>
                          <Shield className={is2FAEnabled ? 'text-emerald-500' : 'text-neutral-500'} size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">Two-Factor Authentication</p>
                          <p className={`text-sm ${is2FAEnabled ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            {is2FAEnabled ? 'Enabled - Your account is protected' : 'Disabled - Protect your account'}
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
                    <p className="text-sm text-neutral-400">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>

                  {/* Password */}
                  <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
                    <p className="text-white font-medium mb-2">Password</p>
                    <p className="text-sm text-neutral-400 mb-4">
                      You can change your password to keep your account secure.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.location.href = '/forgot-password'}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'subscription' && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="text-primary-500" />
                  Subscription
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
                    <p className="text-white font-medium mb-2">Current Plan</p>
                    <p className="text-2xl font-bold text-primary-400 mb-2">Hobbyist (Free)</p>
                    <p className="text-sm text-neutral-400">
                      You are currently on the free tier. Upgrade to unlock more features and higher limits.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View Plans
                  </Button>
                </div>
              </section>
            )}

            {activeSection === 'data-privacy' && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Database className="text-primary-500" />
                  Data & Privacy
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
                    <p className="text-white font-medium mb-2">Export Your Data</p>
                    <p className="text-sm text-neutral-400 mb-4">
                      Download all your data including chats, settings, and profile information in JSON format.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement export functionality
                        alert('Export functionality will be implemented in a future PRD');
                      }}
                    >
                      Export All Data
                    </Button>
                  </div>

                  <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                    <p className="text-red-400 font-medium mb-2">Danger Zone</p>
                    <p className="text-sm text-neutral-400 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      variant="secondary"
                      className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </div>

                  <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
                    <p className="text-white font-medium mb-2">Privacy Policy</p>
                    <p className="text-sm text-neutral-400 mb-4">
                      Learn how we collect, use, and protect your data.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.location.href = '/terms'}
                    >
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </section>
            )}
          </Card>
        </div>
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
