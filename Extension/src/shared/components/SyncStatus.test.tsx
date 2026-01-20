import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SyncStatus } from './SyncStatus';
import { useStore } from '../lib/storage';
import { fullSync } from '../lib/sync';

// Mock the store
vi.mock('../lib/storage');
vi.mock('../lib/sync');

describe('SyncStatus Component', () => {
  const mockSetSyncState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      syncState: {
        status: 'idle',
        lastSyncedAt: Date.now(),
        pendingChanges: 0,
        error: null,
      },
      user: { id: 'user-123', email: 'test@example.com' },
      setSyncState: mockSetSyncState,
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: Date.now(),
          pendingChanges: 0,
          error: null,
        },
        user: null,
        setSyncState: mockSetSyncState,
      });
    });

    it('should not render anything', () => {
      const { container } = render(<SyncStatus />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when user is logged in', () => {
    it('should render the sync status button', () => {
      render(<SyncStatus />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should display synced status when idle', () => {
      const lastSynced = Date.now();
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: lastSynced,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Synced/)).toBeInTheDocument();
    });

    it('should display syncing status when syncing', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'syncing',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 3,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Syncing\.\.\./)).toBeInTheDocument();
    });

    it('should display error status when there is an error', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'error',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 0,
          error: 'Network error',
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Sync error/)).toBeInTheDocument();
    });

    it('should display offline status when offline', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'offline',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Offline/)).toBeInTheDocument();
    });

    it('should show tooltip on hover', async () => {
      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on mouse leave', async () => {
      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      fireEvent.mouseLeave(button);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('should call fullSync when button is clicked', async () => {
      (fullSync as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        upload: { total: 1, successful: 1, failed: 0, errors: [] },
        download: { success: true, stats: { downloaded: 0, updated: 0, deleted: 0, skipped: 0 } },
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(fullSync).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call fullSync when already syncing', async () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'syncing',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 3,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(fullSync).not.toHaveBeenCalled();
      });
    });

    it('should disable button when syncing', () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'syncing',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 3,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
    });

    it('should show pending changes in tooltip when there are pending changes', async () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 5,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText(/5 pending changes/)).toBeInTheDocument();
      });
    });

    it('should display error message in tooltip when there is an error', async () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'error',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 0,
          error: 'Connection failed',
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);

      await waitFor(() => {
        // Error message appears in both button and tooltip
        const errorElements = screen.getAllByText('Connection failed');
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it('should format last sync time as "just now" for very recent syncs', () => {
      const lastSynced = Date.now() - 30000; // 30 seconds ago
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: lastSynced,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText('Synced just now')).toBeInTheDocument();
    });

    it('should format last sync time as "Xm ago" for syncs within an hour', () => {
      const lastSynced = Date.now() - 15 * 60 * 1000; // 15 minutes ago
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: lastSynced,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Synced 15m ago/)).toBeInTheDocument();
    });

    it('should format last sync time as "Xh ago" for syncs within a day', () => {
      const lastSynced = Date.now() - 3 * 60 * 60 * 1000; // 3 hours ago
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: lastSynced,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      expect(screen.getByText(/Synced 3h ago/)).toBeInTheDocument();
    });

    it('should format last sync time as date for older syncs', () => {
      const lastSynced = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'idle',
          lastSyncedAt: lastSynced,
          pendingChanges: 0,
          error: null,
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const dateText = new Date(lastSynced).toLocaleDateString();
      expect(screen.getByText(new RegExp(`Synced ${dateText}`))).toBeInTheDocument();
    });

    it('should show sync error in tooltip when sync fails', async () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'error',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 0,
          error: 'Sync failed: Network error',
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText('Sync Error')).toBeInTheDocument();
        // Error message appears in both button and tooltip
        const errorElements = screen.getAllByText('Sync failed: Network error');
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it('should show "Click to retry" in tooltip when there is an error', async () => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        syncState: {
          status: 'error',
          lastSyncedAt: Date.now() - 60000,
          pendingChanges: 0,
          error: 'Sync failed',
        },
        user: { id: 'user-123', email: 'test@example.com' },
        setSyncState: mockSetSyncState,
      });

      render(<SyncStatus />);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText('Click to retry')).toBeInTheDocument();
      });
    });
  });
});
