import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Protected route: redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400">Welcome back! Here's an overview of your ChatVault activity.</p>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder cards - will be populated in PRD-42 and PRD-43 */}
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Total Chats</h2>
            <p className="text-neutral-400">Your stats will appear here once you sync your chats.</p>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Chats This Week</h2>
            <p className="text-neutral-400">Your weekly activity will be displayed here.</p>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Storage Used</h2>
            <p className="text-neutral-400">Storage usage information coming soon.</p>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Current Tier</h2>
            <p className="text-neutral-400">Tier information will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
