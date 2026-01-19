import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Settings, User, Shield, Database, CreditCard, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DeleteAccountModal } from '../components/DeleteAccountModal';
import { useAuth } from '../hooks/useAuth';
import { ProfileSection } from '../components/settings/ProfileSection';
import { SecuritySection } from '../components/settings/SecuritySection';
import { DataPrivacySection } from '../components/settings/DataPrivacySection';

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
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Listen for delete account modal open event from DataPrivacySection
  React.useEffect(() => {
    const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
    window.addEventListener('open-delete-account-modal', handleOpenDeleteModal);
    return () => window.removeEventListener('open-delete-account-modal', handleOpenDeleteModal);
  }, []);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
                <SecuritySection />
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
                    <p className="text-white font-medium mb-2">Manage your subscription</p>
                    <p className="text-neutral-400 text-sm mb-4">
                      View your current plan, upgrade to higher tiers, or manage your payment methods.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/billing')}
                    >
                      Go to Billing
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'data-privacy' && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Database className="text-primary-500" />
                  Data & Privacy
                </h2>
                <DataPrivacySection />
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
    </div>
  );
};
