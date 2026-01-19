import React, { useState } from 'react';
import { Database, Download, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';

export const DataPrivacySection: React.FC = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportAllData = async () => {
    if (!user) {
      setExportError('You must be logged in to export your data');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      // Fetch all user's chats
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id);

      if (chatsError) {
        // If the chats table doesn't exist yet, export empty data
        if (chatsError.message.includes('does not exist')) {
          console.log('Chats table does not exist yet, exporting profile data only');
        } else {
          throw chatsError;
        }
      }

      // Fetch user profile data
      const { data: { user: userData }, error: userError } = await supabase.auth.admin.getUserById(user.id);

      // Prepare export data
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
        },
        chats: chats || [],
        settings: {
          // You can add settings export here if you have a settings table
        },
      };

      // Create and download the export file
      const jsonContent = JSON.stringify(exportData, null, 2);
      const filename = `chatvault-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(jsonContent, filename, 'application/json');

    } catch (err: any) {
      console.error('Error exporting data:', err);
      setExportError(err.message || 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    // This will be handled by the parent component
    // which has access to the DeleteAccountModal
    window.dispatchEvent(new CustomEvent('open-delete-account-modal'));
  };

  return (
    <div className="space-y-6">
      {/* Export Your Data */}
      <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary-500/20">
            <Download className="text-primary-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium mb-1">Export Your Data</p>
            <p className="text-sm text-neutral-400 mb-4">
              Download all your data including chats, settings, and profile information in JSON format.
            </p>

            {exportError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{exportError}</p>
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportAllData}
              disabled={isExporting || !user}
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Export All Data
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-red-400 font-medium mb-1">Danger Zone</p>
            <p className="text-sm text-neutral-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="secondary"
              className="border-red-500/30 hover:bg-red-500/10 text-red-400"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="p-6 bg-neutral-800/50 rounded-lg border border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-700/50">
            <Database className="text-neutral-500" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium mb-1">Privacy Policy</p>
            <p className="text-sm text-neutral-400 mb-4">
              Learn how we collect, use, and protect your data.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/privacy-policy'}
            >
              <ExternalLink size={16} className="mr-2" />
              View Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
