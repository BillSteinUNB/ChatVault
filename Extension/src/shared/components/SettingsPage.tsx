import React, { useState } from 'react';
import { useStore } from '../lib/storage';
import { Button } from './ui/Button';
import { ChevronDown, ChevronUp, Monitor, Sun, Moon, Database, Shield, User, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  icon,
  children,
  isOpen = true,
  onToggle
}) => {
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-600">
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings, chats } = useStore();
  const [openSection, setOpenSection] = useState<string>('appearance');

  // Calculate storage usage
  const storageUsage = new Blob([JSON.stringify(chats)]).size;
  const storageUsageMB = (storageUsage / (1024 * 1024)).toFixed(2);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronUp className="w-5 h-5 rotate-[-90deg]" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Customize your ChatVault experience</p>
          </div>
        </div>
      </header>

      {/* Settings Sections */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Appearance Section */}
        <SettingsSection
          title="Appearance"
          icon={<Monitor size={20} />}
          isOpen={openSection === 'appearance'}
          onToggle={() => setOpenSection(openSection === 'appearance' ? '' : 'appearance')}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Theme</label>
              <div className="flex gap-2">
                <ThemeButton
                  icon={<Sun size={16} />}
                  label="Light"
                  active={settings.theme === 'light'}
                />
                <ThemeButton
                  icon={<Moon size={16} />}
                  label="Dark"
                  active={settings.theme === 'dark'}
                />
                <ThemeButton
                  icon={<Monitor size={16} />}
                  label="System"
                  active={settings.theme === 'system'}
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Scraping Section */}
        <SettingsSection
          title="Scraping"
          icon={<Shield size={20} />}
          isOpen={openSection === 'scraping'}
          onToggle={() => setOpenSection(openSection === 'scraping' ? '' : 'scraping')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-save</p>
                <p className="text-sm text-gray-500">Automatically save new conversations</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5"></div>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-2">Platforms</p>
              <div className="space-y-2">
                <Checkbox label="ChatGPT" checked={settings.enabledPlatforms.chatgpt} />
                <Checkbox label="Claude" checked={settings.enabledPlatforms.claude} />
                <Checkbox label="Perplexity" checked={settings.enabledPlatforms.perplexity} />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Storage Section */}
        <SettingsSection
          title="Storage"
          icon={<HardDrive size={20} />}
          isOpen={openSection === 'storage'}
          onToggle={() => setOpenSection(openSection === 'storage' ? '' : 'storage')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-sm font-medium text-gray-900">
                {storageUsageMB} MB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${Math.min((parseFloat(storageUsageMB) / 10) * 100, 100)}%` }}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" className="flex-1">
                Export All Data
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                Clear All Data
              </Button>
            </div>
          </div>
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection
          title="Account"
          icon={<User size={20} />}
          isOpen={openSection === 'account'}
          onToggle={() => setOpenSection(openSection === 'account' ? '' : 'account')}
        >
          <div className="text-sm text-gray-500 py-2">
            Not logged in. Sign in to sync your chats across devices.
          </div>
          <Button variant="primary" className="w-full">
            Sign In
          </Button>
        </SettingsSection>
      </div>
    </div>
  );
};

// Sub-components for Settings Page
const ThemeButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
}> = ({ icon, label, active }) => (
  <button
    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
      active
        ? 'border-primary-500 bg-primary-50 text-primary-700'
        : 'border-gray-200 text-gray-600 hover:border-gray-300'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
}> = ({ label, checked }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
        checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);
