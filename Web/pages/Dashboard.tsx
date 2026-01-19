import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentChats, WebChat } from '../components/dashboard/RecentChats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MessageSquare, Calendar, Database, Crown } from 'lucide-react';

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

  // TODO: These will be real stats from the backend in future PRDs
  // For now, showing placeholder data as per PRD-42 requirements
  const totalChats = 0;
  const chatsThisWeek = 0;
  const storageUsed = '0 MB';
  const currentTier = 'Hobbyist';

  // TODO: These will be real chats from Supabase in future PRDs
  // For now, showing empty state as per PRD-43 requirements
  const recentChats: WebChat[] = [];

  const handleExportAll = () => {
    // TODO: Implement export functionality in PRD-47 (Data & Privacy Section)
    console.log('Export all data');
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400">Welcome back! Here's an overview of your ChatVault activity.</p>
        </div>

        {/* Grid Layout for Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatsCard
            title="Total Chats"
            value={totalChats}
            icon={MessageSquare}
            subtitle="All saved conversations"
          />

          <StatsCard
            title="Chats This Week"
            value={chatsThisWeek}
            icon={Calendar}
            subtitle="New conversations in the last 7 days"
          />

          <StatsCard
            title="Storage Used"
            value={storageUsed}
            icon={Database}
            subtitle="Of 10 MB free tier limit"
          />

          <StatsCard
            title="Current Tier"
            value={currentTier}
            icon={Crown}
            subtitle="Upgrade for unlimited storage"
          />
        </div>

        {/* Recent Chats and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentChats chats={recentChats} />
          </div>
          <div>
            <QuickActions onExportAll={handleExportAll} currentTier={currentTier} />
          </div>
        </div>
      </div>
    </div>
  );
};
