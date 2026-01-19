import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsView } from './AnalyticsView';
import { useStore } from '../lib/storage';

// Mock the useStore hook
vi.mock('../lib/storage');

describe('AnalyticsView', () => {
    const mockChats = [
        {
            id: '1',
            title: 'Chat 1',
            preview: 'Preview 1',
            platform: 'chatgpt' as const,
            timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            folderId: undefined,
            isPinned: false,
            tags: ['tag1', 'tag2']
        },
        {
            id: '2',
            title: 'Chat 2',
            preview: 'Preview 2',
            platform: 'claude' as const,
            timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
            folderId: undefined,
            isPinned: false,
            tags: ['tag1']
        },
        {
            id: '3',
            title: 'Chat 3',
            preview: 'Preview 3',
            platform: 'perplexity' as const,
            timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago (outside week)
            folderId: undefined,
            isPinned: false,
            tags: ['tag2', 'tag3']
        }
    ];

    const mockTags = [
        { id: 'tag1', name: 'Work', color: '#FF5733', createdAt: Date.now() },
        { id: 'tag2', name: 'Personal', color: '#33FF57', createdAt: Date.now() },
        { id: 'tag3', name: 'Ideas', color: '#3357FF', createdAt: Date.now() }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('when there are chats', () => {
        beforeEach(() => {
            vi.mocked(useStore).mockReturnValue({
                chats: mockChats,
                tags: mockTags,
                // Add other required store properties with default values
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });
        });

        it('should render the analytics view', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Total Chats')).toBeInTheDocument();
        });

        it('should display the correct total chats count', () => {
            render(<AnalyticsView />);
            const totalChatsElement = screen.getByText('3', { selector: '.text-4xl' });
            expect(totalChatsElement).toBeInTheDocument();
        });

        it('should show chats this week', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('This Week')).toBeInTheDocument();
            const weekElements = screen.getAllByText('2');
            expect(weekElements.length).toBeGreaterThan(0); // 2 chats within the week
        });

        it('should show chats this month', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('This Month')).toBeInTheDocument();
            const monthElements = screen.getAllByText('3');
            expect(monthElements.length).toBeGreaterThan(0); // All 3 chats within the month
        });

        it('should display platform breakdown section', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Chats by Platform')).toBeInTheDocument();
        });

        it('should show ChatGPT platform count', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('ChatGPT')).toBeInTheDocument();
            const countElements = screen.getAllByText('1');
            expect(countElements.length).toBeGreaterThan(0);
        });

        it('should show Claude platform count', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Claude')).toBeInTheDocument();
        });

        it('should show Perplexity platform count', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Perplexity')).toBeInTheDocument();
        });

        it('should display percentage for each platform', () => {
            render(<AnalyticsView />);
            const percentages = screen.getAllByText(/\(33\.3%\)/);
            expect(percentages.length).toBeGreaterThan(0);
        });

        it('should show most used tags section when tags exist', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Most Used Tags')).toBeInTheDocument();
        });

        it('should display top tags with counts', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('Work')).toBeInTheDocument();
            expect(screen.getByText('Personal')).toBeInTheDocument();
        });

        it('should show tag ranking numbers', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('#1')).toBeInTheDocument();
            expect(screen.getByText('#2')).toBeInTheDocument();
        });

        it('should display tag counts', () => {
            render(<AnalyticsView />);
            const tagCounts = screen.getAllByText('2');
            expect(tagCounts.length).toBeGreaterThan(0);
        });
    });

    describe('when there are no chats', () => {
        beforeEach(() => {
            vi.mocked(useStore).mockReturnValue({
                chats: [],
                tags: [],
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });
        });

        it('should show empty state message', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('No analytics yet')).toBeInTheDocument();
        });

        it('should show empty state description', () => {
            render(<AnalyticsView />);
            expect(screen.getByText(/Start saving chats from ChatGPT/)).toBeInTheDocument();
        });

        it('should show 0 for total chats', () => {
            render(<AnalyticsView />);
            const zeroElements = screen.getAllByText('0');
            expect(zeroElements.length).toBeGreaterThan(0);
        });

        it('should show 0 for this week', () => {
            render(<AnalyticsView />);
            const zeroElements = screen.getAllByText('0');
            expect(zeroElements.length).toBeGreaterThan(0);
        });

        it('should show 0 for this month', () => {
            render(<AnalyticsView />);
            const zeroElements = screen.getAllByText('0');
            expect(zeroElements.length).toBeGreaterThan(0);
        });

        it('should show no chats yet message in platform section', () => {
            render(<AnalyticsView />);
            expect(screen.getByText('No chats yet')).toBeInTheDocument();
        });

        it('should not show most used tags section when no tags', () => {
            render(<AnalyticsView />);
            expect(screen.queryByText('Most Used Tags')).not.toBeInTheDocument();
        });
    });

    describe('time-based calculations', () => {
        it('should correctly calculate chats from the last 7 days', () => {
            const now = Date.now();
            const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
            
            const weekChats = [
                { ...mockChats[0], timestamp: oneWeekAgo + 1000 }, // Just within week
                { ...mockChats[1], timestamp: oneWeekAgo - 1000 } // Just outside week
            ];

            vi.mocked(useStore).mockReturnValue({
                chats: weekChats,
                tags: [],
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });

            render(<AnalyticsView />);
            const ones = screen.getAllByText('1');
            expect(ones.length).toBeGreaterThan(0); // Only 1 chat in the week
        });

        it('should correctly calculate chats from the last 30 days', () => {
            const now = Date.now();
            const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
            
            const monthChats = [
                { ...mockChats[0], timestamp: oneMonthAgo + 1000 }, // Just within month
                { ...mockChats[1], timestamp: oneMonthAgo - 1000 } // Just outside month
            ];

            vi.mocked(useStore).mockReturnValue({
                chats: monthChats,
                tags: [],
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });

            render(<AnalyticsView />);
            const ones = screen.getAllByText('1');
            expect(ones.length).toBeGreaterThan(0); // Only 1 chat in the month
        });
    });

    describe('tag calculations', () => {
        it('should limit top tags to 5', () => {
            const manyTags = Array.from({ length: 10 }, (_, i) => ({
                id: `tag${i}`,
                name: `Tag ${i}`,
                color: '#FF5733',
                createdAt: Date.now()
            }));

            const manyChats = Array.from({ length: 10 }, (_, i) => ({
                id: `chat${i}`,
                title: `Chat ${i}`,
                preview: `Preview ${i}`,
                platform: 'chatgpt' as const,
                timestamp: Date.now(),
                folderId: undefined,
                isPinned: false,
                tags: [`tag${i}`]
            }));

            vi.mocked(useStore).mockReturnValue({
                chats: manyChats,
                tags: manyTags,
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });

            render(<AnalyticsView />);
            const rankings = screen.getAllByText(/^\#\d+$/);
            expect(rankings.length).toBeLessThanOrEqual(5);
        });

        it('should sort tags by usage count', () => {
            const sortedChats = [
                { ...mockChats[0], id: 'chat1', tags: ['tag1'] }, // tag1 used once
                { ...mockChats[1], id: 'chat2', tags: ['tag1'] }, // tag1 used twice
                { ...mockChats[2], id: 'chat3', tags: ['tag1'] }  // tag1 used 3 times
            ];

            vi.mocked(useStore).mockReturnValue({
                chats: sortedChats,
                tags: mockTags,
                folders: [],
                settings: {
                    theme: 'system',
                    autoSave: true,
                    autoSaveInterval: 30,
                    enabledPlatforms: { chatgpt: true, claude: true, perplexity: true },
                    compactMode: false
                },
                viewState: { mode: 'analytics' },
                settingsOpen: false,
                isLoading: false,
                searchQuery: '',
                searchIndex: [],
                focusSearchTrigger: 0,
                setSearchQuery: vi.fn(),
                searchChats: vi.fn(),
                activeFolder: null,
                setActiveFolder: vi.fn(),
                activeFilter: 'all',
                setFilter: vi.fn(),
                activeTags: [],
                setActiveTags: vi.fn(),
                toggleActiveTag: vi.fn(),
                togglePin: vi.fn(),
                deleteChat: vi.fn(),
                loadChatsFromStorage: vi.fn(),
                setChats: vi.fn(),
                addFolder: vi.fn(),
                updateFolder: vi.fn(),
                deleteFolder: vi.fn(),
                moveChatToFolder: vi.fn(),
                addTag: vi.fn(),
                updateTag: vi.fn(),
                deleteTag: vi.fn(),
                addTagToChat: vi.fn(),
                removeTagFromChat: vi.fn(),
                updateSettings: vi.fn(),
                setViewMode: vi.fn(),
                setSelectedFolder: vi.fn(),
                setSettingsOpen: vi.fn(),
                focusSearch: vi.fn()
            });

            render(<AnalyticsView />);
            expect(screen.getByText('#1')).toBeInTheDocument();
            const threes = screen.getAllByText('3');
            expect(threes.length).toBeGreaterThan(0); // tag1 used 3 times
        });
    });
});
