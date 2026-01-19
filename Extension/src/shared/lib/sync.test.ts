import { describe, it, expect, beforeEach, vi } from 'vitest';
import { uploadChat, bulkUploadChats, uploadUnsyncedChats, trackChatSave, clearPendingChanges, UploadResult, BulkUploadResult } from './sync';
import { useStore } from './storage';
import { supabase } from './supabase';
import { Chat } from '../types';

// Mock supabase module
vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(),
    })),
  },
}));

// Helper to create a mock Supabase user
function createMockUser(overrides: Partial<any> = {}) {
  return {
    id: 'user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('PRD-56: Sync Service - Upload', () => {
  const mockChat: Chat = {
    id: 'chat-1',
    title: 'Test Chat',
    preview: 'This is a test chat',
    platform: 'claude',
    timestamp: Date.now(),
    folderId: undefined,
    isPinned: false,
    tags: [],
    syncedAt: undefined,
    localUpdatedAt: Date.now(),
  };

  const mockChat2: Chat = {
    id: 'chat-2',
    title: 'Test Chat 2',
    preview: 'Another test chat',
    platform: 'chatgpt',
    timestamp: Date.now(),
    folderId: undefined,
    isPinned: true,
    tags: ['tag-1'],
    syncedAt: undefined,
    localUpdatedAt: Date.now(),
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Reset store state
    useStore.setState({
      chats: [],
      syncState: {
        status: 'idle',
        lastSyncedAt: null,
        pendingChanges: 0,
        error: null,
      },
    });
  });

  describe('uploadChat', () => {
    it('should export uploadChat function', () => {
      expect(typeof uploadChat).toBe('function');
    });

    it('should return UploadResult with success, error, and chatId properties', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await uploadChat(mockChat);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('chatId');
      // error is optional, may be undefined
    });

    it('should upload chat successfully when user is authenticated', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await uploadChat(mockChat);

      expect(result.success).toBe(true);
      expect(result.chatId).toBe(mockChat.id);
      expect(result.error).toBeUndefined();
    });

    it('should return error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: null }, error: null });

      const result = await uploadChat(mockChat);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not authenticated');
      expect(result.chatId).toBe(mockChat.id);
    });

    it('should handle Supabase upsert errors', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockError = new Error('Database connection failed');
      const mockUpsert = vi.fn().mockResolvedValue({ error: mockError });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await uploadChat(mockChat);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
      expect(result.chatId).toBe(mockChat.id);
    });

    it('should set sync state to syncing during upload', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockImplementation(() => new Promise(resolve => {
        // Check that sync state was set to syncing
        expect(useStore.getState().syncState.status).toBe('syncing');
        resolve({ error: null });
      }));
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await uploadChat(mockChat);
    });

    it('should set sync state to idle after successful upload', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await uploadChat(mockChat);

      expect(useStore.getState().syncState.status).toBe('idle');
      expect(useStore.getState().syncState.lastSyncedAt).toBeGreaterThan(0);
    });

    it('should set sync state to error on upload failure', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockError = new Error('Upload failed');
      const mockUpsert = vi.fn().mockResolvedValue({ error: mockError });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await uploadChat(mockChat);

      expect(useStore.getState().syncState.status).toBe('error');
      expect(useStore.getState().syncState.error).toBe('Upload failed');
    });

    it('should handle auth errors', async () => {
      vi.mocked(supabase.auth.getUser).mockRejectedValue(new Error('Auth service unavailable'));

      const result = await uploadChat(mockChat);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Auth service unavailable');
    });

    it('should convert chat to Supabase format correctly', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await uploadChat(mockChat);

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockChat.id,
          user_id: 'user-123',
          title: mockChat.title,
          platform: mockChat.platform,
          tags: mockChat.tags,
          pinned: mockChat.isPinned,
        }),
        expect.any(Object)
      );
    });
  });

  describe('bulkUploadChats', () => {
    it('should export bulkUploadChats function', () => {
      expect(typeof bulkUploadChats).toBe('function');
    });

    it('should return BulkUploadResult with total, successful, failed, and errors', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await bulkUploadChats([mockChat, mockChat2]);

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('successful');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should upload multiple chats successfully', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await bulkUploadChats([mockChat, mockChat2]);

      expect(result.total).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial failures in bulk upload', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      let callCount = 0;
      const mockUpsert = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ error: null });
        }
        return Promise.resolve({ error: new Error('Second chat failed') });
      });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const result = await bulkUploadChats([mockChat, mockChat2]);

      expect(result.total).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toHaveProperty('chatId');
      expect(result.errors[0]).toHaveProperty('error');
    });

    it('should set sync state to syncing with pendingChanges at start', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockImplementation(() => {
        expect(useStore.getState().syncState.status).toBe('syncing');
        expect(useStore.getState().syncState.pendingChanges).toBeGreaterThan(0);
        return Promise.resolve({ error: null });
      });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await bulkUploadChats([mockChat, mockChat2]);

      expect(useStore.getState().syncState.pendingChanges).toBe(0);
    });

    it('should update pendingChanges count during upload', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await bulkUploadChats([mockChat, mockChat2]);

      // After completion, pendingChanges should be 0
      expect(useStore.getState().syncState.pendingChanges).toBe(0);
    });

    it('should set sync state to idle when all uploads succeed', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await bulkUploadChats([mockChat, mockChat2]);

      const syncState = useStore.getState().syncState;
      expect(syncState.status).toBe('idle');
      expect(syncState.lastSyncedAt).toBeGreaterThan(0);
      expect(syncState.error).toBeNull();
    });

    it('should set sync state to error when all uploads fail', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: new Error('Upload failed') });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await bulkUploadChats([mockChat, mockChat2]);

      const syncState = useStore.getState().syncState;
      expect(syncState.status).toBe('error');
      expect(syncState.error).toContain('All 2 uploads failed');
    });

    it('should set partial error when some uploads fail', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      let callCount = 0;
      const mockUpsert = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ error: null });
        }
        return Promise.resolve({ error: new Error('Failed') });
      });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      await bulkUploadChats([mockChat, mockChat2]);

      const syncState = useStore.getState().syncState;
      expect(syncState.status).toBe('idle');
      expect(syncState.error).toContain('1 of 2 uploads failed');
    });

    it('should handle empty chat array', async () => {
      const result = await bulkUploadChats([]);

      expect(result.total).toBe(0);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('uploadUnsyncedChats', () => {
    it('should export uploadUnsyncedChats function', () => {
      expect(typeof uploadUnsyncedChats).toBe('function');
    });

    it('should upload chats without syncedAt', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const unsyncedChat: Chat = { ...mockChat, syncedAt: undefined };
      const syncedChat: Chat = { ...mockChat2, syncedAt: Date.now(), localUpdatedAt: Date.now() - 10000 };

      useStore.setState({ chats: [unsyncedChat, syncedChat] });

      const result = await uploadUnsyncedChats();

      expect(result.total).toBe(1);
      expect(result.successful).toBe(1);
    });

    it('should upload chats with local updates newer than syncedAt', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const now = Date.now();
      const outdatedChat: Chat = {
        ...mockChat,
        syncedAt: now - 10000,
        localUpdatedAt: now,
      };

      useStore.setState({ chats: [outdatedChat] });

      const result = await uploadUnsyncedChats();

      expect(result.total).toBe(1);
      expect(result.successful).toBe(1);
    });

    it('should not upload chats syncedAt is newer than localUpdatedAt', async () => {
      const mockUser = createMockUser();
      vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        upsert: mockUpsert,
      } as any);

      const now = Date.now();
      const upToDateChat: Chat = {
        ...mockChat,
        syncedAt: now,
        localUpdatedAt: now - 10000,
      };

      useStore.setState({ chats: [upToDateChat] });

      const result = await uploadUnsyncedChats();

      expect(result.total).toBe(0);
      expect(mockUpsert).not.toHaveBeenCalled();
    });
  });

  describe('trackChatSave', () => {
    it('should export trackChatSave function', () => {
      expect(typeof trackChatSave).toBe('function');
    });

    it('should increment pendingChanges when chat is saved', () => {
      useStore.setState({
        syncState: { status: 'idle', lastSyncedAt: null, pendingChanges: 0, error: null }
      });

      trackChatSave('chat-1');

      expect(useStore.getState().syncState.pendingChanges).toBe(1);
    });

    it('should increment pendingChanges multiple times', () => {
      useStore.setState({
        syncState: { status: 'idle', lastSyncedAt: null, pendingChanges: 0, error: null }
      });

      trackChatSave('chat-1');
      trackChatSave('chat-2');
      trackChatSave('chat-3');

      expect(useStore.getState().syncState.pendingChanges).toBe(3);
    });
  });

  describe('clearPendingChanges', () => {
    it('should export clearPendingChanges function', () => {
      expect(typeof clearPendingChanges).toBe('function');
    });

    it('should reset pendingChanges to zero', () => {
      useStore.setState({
        syncState: { status: 'idle', lastSyncedAt: null, pendingChanges: 5, error: null }
      });

      clearPendingChanges();

      expect(useStore.getState().syncState.pendingChanges).toBe(0);
    });
  });
});
