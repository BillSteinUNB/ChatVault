import React, { useState } from 'react';
import { AlertTriangle, Loader2, Download } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { supabase } from '../services/supabase';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDeleteEnabled = confirmationText === 'DELETE';

  const handleDelete = async () => {
    if (!isDeleteEnabled) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session found');
      }

      // Call the delete-account edge function
      const { data: { functionsUrl } } = supabase as any;
      const functionUrl = `${functionsUrl || import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No active user found');
      }

      // Fetch user's chats from Supabase
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Prepare export data
      const exportData = {
        profile: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        chats: chats || [],
        exportDate: new Date().toISOString(),
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chatvault-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="space-y-6">
        {/* Warning message */}
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="space-y-2">
            <p className="text-red-400 font-semibold">Warning: This action cannot be undone</p>
            <p className="text-neutral-300 text-sm">
              Deleting your account will permanently remove all your data including:
            </p>
            <ul className="list-disc list-inside text-neutral-400 text-sm space-y-1 ml-2">
              <li>All saved chats and conversations</li>
              <li>Your profile information</li>
              <li>Tags and folders</li>
              <li>Account settings and preferences</li>
            </ul>
          </div>
        </div>

        {/* Download data option */}
        <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <p className="text-neutral-300 text-sm mb-3">
            We recommend downloading your data before deleting your account.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            className="w-full sm:w-auto"
          >
            <Download size={16} />
            Download my data
          </Button>
        </div>

        {/* Confirmation input */}
        <div className="space-y-2">
          <label htmlFor="confirmation" className="block text-sm font-medium text-neutral-300">
            Type <span className="text-white font-bold">DELETE</span> to confirm:
          </label>
          <input
            id="confirmation"
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={isDeleting}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={!isDeleteEnabled || isDeleting}
            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)]"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
