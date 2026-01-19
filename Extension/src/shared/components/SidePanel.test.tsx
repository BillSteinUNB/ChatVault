import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SidePanel } from './SidePanel';
import { useStore } from '../lib/storage';

// Mock the useStore hook
vi.mock('../lib/storage', () => ({
    useStore: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock all child components
vi.mock('./ChatItem', () => ({
    ChatItem: ({ chat }: any) => <div data-testid="chat-item">{chat.title}</div>,
}));

vi.mock('./SearchBar', () => ({
    SearchBar: () => <div data-testid="search-bar">Search</div>,
}));

vi.mock('./SearchFilters', () => ({
    SearchFilters: () => <div data-testid="search-filters">Filters</div>,
}));

vi.mock('./AuthBanner', () => ({
    AuthBanner: () => <div data-testid="auth-banner">Auth</div>,
}));

vi.mock('./FolderList', () => ({
    FolderList: () => <div data-testid="folder-list">Folders</div>,
}));

vi.mock('./CreateFolderModal', () => ({
    CreateFolderModal: ({ isOpen, onClose }: any) =>
        isOpen ? <div data-testid="create-folder-modal">Modal</div> : null,
}));

vi.mock('./TagFilter', () => ({
    TagFilter: () => <div data-testid="tag-filter">Tags</div>,
}));

vi.mock('./ExportMenu', () => ({
    ExportMenu: ({ onClose }: any) => <div data-testid="export-menu">Export</div>,
}));

vi.mock('./SettingsPage', () => ({
    SettingsPage: ({ onBack }: any) => (
        <div data-testid="settings-page">
            <button onClick={onBack}>Back</button>
        </div>
    ),
}));

vi.mock('./ui/Button', () => ({
    Button: ({ children, onClick, variant, size, className }: any) => (
        <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
            {children}
        </button>
    ),
}));

// Mock lucide icons
vi.mock('lucide-react', () => ({
    Folder: () => <div data-icon="folder" />,
    PieChart: () => <div data-icon="pie-chart" />,
    Star: () => <div data-icon="star" />,
    Clock: () => <div data-icon="clock" />,
    Plus: () => <div data-icon="plus" />,
    Loader2: () => <div data-icon="loader2" />,
    MessageSquare: () => <div data-icon="message-square" />,
    Settings: () => <div data-icon="settings" />,
    Home: () => <div data-icon="home" />,
}));

describe('SidePanel - Nav Icons Functionality (PRD-25)', () => {
    const mockSetViewMode = vi.fn();
    const mockSetSettingsOpen = vi.fn();

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        (useStore as any).mockReturnValue({
            chats: [
                {
                    id: '1',
                    title: 'Test Chat 1',
                    platform: 'chatgpt',
                    url: 'https://chatgpt.com/c/1',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    isPinned: true,
                    tags: [],
                    folderId: null,
                },
                {
                    id: '2',
                    title: 'Test Chat 2',
                    platform: 'claude',
                    url: 'https://claude.ai/c/2',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    isPinned: false,
                    tags: [],
                    folderId: null,
                },
            ],
            isLoading: false,
            activeFolder: null,
            activeTags: [],
            settingsOpen: false,
            viewState: { mode: 'all', selectedFolderId: undefined },
            setViewMode: mockSetViewMode,
            setSettingsOpen: mockSetSettingsOpen,
        });
    });

    describe('Nav Items Rendering', () => {
        it('renders All Chats nav item', () => {
            render(<SidePanel />);
            const allChatsNav = document.querySelector('nav button:first-child');
            expect(allChatsNav).toBeInTheDocument();
        });

        it('renders Starred nav item', () => {
            render(<SidePanel />);
            const starredNav = document.querySelector('nav > div:nth-child(2) > button');
            expect(starredNav).toBeInTheDocument();
        });

        it('renders Analytics nav item', () => {
            render(<SidePanel />);
            const analyticsNav = document.querySelector('nav > div:nth-child(3) > button');
            expect(analyticsNav).toBeInTheDocument();
        });

        it('renders Settings nav item', () => {
            render(<SidePanel />);
            const settingsNav = document.querySelector('nav > div:nth-child(4) > button');
            expect(settingsNav).toBeInTheDocument();
        });
    });

    describe('Nav Items Active State', () => {
        it('highlights All Chats nav when view mode is "all"', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'all', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const allChatsNav = document.querySelector('nav > div:first-child > button');
            expect(allChatsNav).toHaveClass('bg-primary-50', 'text-primary-600');
        });

        it('highlights Starred nav when view mode is "starred"', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'starred', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const starredNav = document.querySelector('nav > div:nth-child(2) > button');
            expect(starredNav).toHaveClass('bg-primary-50', 'text-primary-600');
        });

        it('highlights Analytics nav when view mode is "analytics"', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'analytics', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const analyticsNav = document.querySelector('nav > div:nth-child(3) > button');
            expect(analyticsNav).toHaveClass('bg-primary-50', 'text-primary-600');
        });

        it('does not highlight inactive nav items', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'all', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const starredNav = document.querySelector('nav > div:nth-child(2) > button');
            const analyticsNav = document.querySelector('nav > div:nth-child(3) > button');

            expect(starredNav).not.toHaveClass('bg-primary-50', 'text-primary-600');
            expect(analyticsNav).not.toHaveClass('bg-primary-50', 'text-primary-600');
        });
    });

    describe('Nav Items Click Handlers', () => {
        it('calls setViewMode("all") when All Chats nav is clicked', () => {
            render(<SidePanel />);
            const allChatsNav = document.querySelector('nav > div:first-child > button');
            fireEvent.click(allChatsNav!);
            expect(mockSetViewMode).toHaveBeenCalledWith('all');
        });

        it('calls setViewMode("starred") when Starred nav is clicked', () => {
            render(<SidePanel />);
            const starredNav = document.querySelector('nav > div:nth-child(2) > button');
            fireEvent.click(starredNav!);
            expect(mockSetViewMode).toHaveBeenCalledWith('starred');
        });

        it('calls setViewMode("analytics") when Analytics nav is clicked', () => {
            render(<SidePanel />);
            const analyticsNav = document.querySelector('nav > div:nth-child(3) > button');
            fireEvent.click(analyticsNav!);
            expect(mockSetViewMode).toHaveBeenCalledWith('analytics');
        });

        it('calls setSettingsOpen(true) when Settings nav is clicked', () => {
            render(<SidePanel />);
            const settingsNav = document.querySelector('nav > div:nth-child(4) > button');
            fireEvent.click(settingsNav!);
            expect(mockSetSettingsOpen).toHaveBeenCalledWith(true);
        });
    });

    describe('Tooltips', () => {
        it('shows "All Chats" tooltip on hover over Home nav', async () => {
            render(<SidePanel />);
            const allChatsNav = document.querySelector('nav > div:first-child > button');

            fireEvent.mouseEnter(allChatsNav!);
            await waitFor(() => {
                const tooltip = screen.getByText('All Chats');
                expect(tooltip).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows "Starred" tooltip on hover over Star nav', async () => {
            render(<SidePanel />);
            const starredNav = document.querySelector('nav > div:nth-child(2) > button');

            fireEvent.mouseEnter(starredNav!);
            await waitFor(() => {
                const tooltip = screen.getByText('Starred');
                expect(tooltip).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows "Analytics" tooltip on hover over Analytics nav', async () => {
            render(<SidePanel />);
            const analyticsNav = document.querySelector('nav > div:nth-child(3) > button');

            fireEvent.mouseEnter(analyticsNav!);
            await waitFor(() => {
                const tooltip = screen.getByText('Analytics');
                expect(tooltip).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows "Settings" tooltip on hover over Settings nav', async () => {
            render(<SidePanel />);
            const settingsNav = document.querySelector('nav > div:nth-child(4) > button');

            fireEvent.mouseEnter(settingsNav!);
            await waitFor(() => {
                const tooltip = screen.getByText('Settings');
                expect(tooltip).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('hides tooltip on mouse leave', async () => {
            render(<SidePanel />);
            const allChatsNav = document.querySelector('nav > div:first-child > button');

            fireEvent.mouseEnter(allChatsNav!);
            await waitFor(() => {
                const tooltip = screen.getByText('All Chats');
                expect(tooltip).toBeInTheDocument();
            }, { timeout: 3000 });

            fireEvent.mouseLeave(allChatsNav!);
            await waitFor(() => {
                const tooltip = screen.queryByText('All Chats');
                expect(tooltip).not.toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    describe('Header Updates Based on View Mode', () => {
        it('shows "Conversations" title in "all" mode', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'all', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const title = screen.getByText('Conversations');
            expect(title).toBeInTheDocument();
        });

        it('shows "Starred" title in "starred" mode', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'starred', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const title = screen.getByText('Starred');
            expect(title).toBeInTheDocument();
        });

        it('shows "Analytics" title in "analytics" mode', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'analytics', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            const title = screen.getByText('Analytics');
            expect(title).toBeInTheDocument();
        });
    });

    describe('Chat List Filtering', () => {
        it('shows all chats when view mode is "all"', () => {
            const chats = [
                { id: '1', title: 'Chat 1', platform: 'chatgpt', url: 'https://example.com', createdAt: Date.now(), updatedAt: Date.now(), isPinned: true, tags: [], folderId: null },
                { id: '2', title: 'Chat 2', platform: 'claude', url: 'https://example.com', createdAt: Date.now(), updatedAt: Date.now(), isPinned: false, tags: [], folderId: null },
            ];

            (useStore as any).mockReturnValue({
                chats,
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'all', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            expect(screen.getByText('Chat 1')).toBeInTheDocument();
            expect(screen.getByText('Chat 2')).toBeInTheDocument();
        });

        it('shows only pinned chats when view mode is "starred"', () => {
            const chats = [
                { id: '1', title: 'Pinned Chat', platform: 'chatgpt', url: 'https://example.com', createdAt: Date.now(), updatedAt: Date.now(), isPinned: true, tags: [], folderId: null },
                { id: '2', title: 'Unpinned Chat', platform: 'claude', url: 'https://example.com', createdAt: Date.now(), updatedAt: Date.now(), isPinned: false, tags: [], folderId: null },
            ];

            (useStore as any).mockReturnValue({
                chats,
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'starred', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            expect(screen.getByText('Pinned Chat')).toBeInTheDocument();
            expect(screen.queryByText('Unpinned Chat')).not.toBeInTheDocument();
        });

        it('shows empty state when no pinned chats in "starred" mode', () => {
            const chats = [
                { id: '1', title: 'Chat 1', platform: 'chatgpt', url: 'https://example.com', createdAt: Date.now(), updatedAt: Date.now(), isPinned: false, tags: [], folderId: null },
            ];

            (useStore as any).mockReturnValue({
                chats,
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'starred', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            expect(screen.getByText(/no chats/i)).toBeInTheDocument();
        });

        it('shows "Starred Chats" as list title in starred mode', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'starred', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            expect(screen.getByText('Starred Chats')).toBeInTheDocument();
        });

        it('shows "Analytics Overview" as list title in analytics mode', () => {
            (useStore as any).mockReturnValue({
                chats: [],
                isLoading: false,
                activeFolder: null,
                activeTags: [],
                settingsOpen: false,
                viewState: { mode: 'analytics', selectedFolderId: undefined },
                setViewMode: mockSetViewMode,
                setSettingsOpen: mockSetSettingsOpen,
            });

            render(<SidePanel />);
            expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
        });
    });
});
