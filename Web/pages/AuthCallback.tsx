import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Supabase handles the token exchange automatically
        // We just need to wait for the session to be established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          // Successfully authenticated, redirect to dashboard
          navigate('/');
        } else {
          // No session found, might be an error or still processing
          // Wait a bit and check again
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              navigate('/');
            } else {
              setError('Authentication failed. Please try again.');
            }
          }, 1000);
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary-500 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-600 transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary-500 border-t-transparent flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Signing you in...</h1>
        <p className="text-neutral-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};
