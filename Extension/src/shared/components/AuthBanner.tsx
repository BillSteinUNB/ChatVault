import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';

const WEB_APP_URL = 'http://localhost:5173';

export const AuthBanner: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handleResendVerification = async () => {
    setResending(true);
    setMessage(null);

    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'RESEND_VERIFICATION',
        email: user?.email 
      });

      if (response.error) {
        setMessage({ type: 'error', text: response.error });
      } else {
        setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to resend verification email' });
    } finally {
      setResending(false);
    }
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

  const isVerified = user.email_confirmed_at != null;

  return (
    <div className={`rounded-lg p-4 mb-4 border ${
      isVerified 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-yellow-500/10 border-yellow-500/30'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isVerified ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
            <p className={`font-medium ${isVerified ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {user.email}
            </p>
          </div>
          <p className={`text-xs ${isVerified ? 'text-neutral-500' : 'text-yellow-400/80'}`}>
            {isVerified ? 'Verified' : 'Please verify your email address'}
          </p>
          {message && (
            <p className={`text-xs mt-2 ${
              message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {message.text}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!isVerified && (
            <Button 
              onClick={handleResendVerification} 
              size="sm" 
              variant="secondary"
              disabled={resending}
              className="text-xs"
            >
              {resending ? 'Sending...' : 'Resend'}
            </Button>
          )}
          <Button onClick={handleSignOut} variant="secondary" size="sm" className="text-xs">
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
