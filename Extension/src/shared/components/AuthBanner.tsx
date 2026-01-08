import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/Button';

const WEB_APP_URL = 'http://localhost:5173';

export const AuthBanner: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
      setUser(response.user || null);
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
      setUser(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleLogin = () => {
    chrome.tabs.create({ url: `${WEB_APP_URL}/#/login` });
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-400 mb-2">
          Sign in to sync your chats across devices
        </p>
        <Button onClick={handleLogin} size="sm" className="w-full">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <p className="text-emerald-400 font-medium">{user.email}</p>
          <p className="text-neutral-500 text-xs">Synced</p>
        </div>
        <Button onClick={handleSignOut} variant="secondary" size="sm">
          Sign out
        </Button>
      </div>
    </div>
  );
};
