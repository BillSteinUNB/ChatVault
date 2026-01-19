import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchFilters } from './SearchFilters';
import { useStore } from '../lib/storage';

// Mock the useStore hook
vi.mock('../lib/storage', () => ({
  useStore: vi.fn(),
}));

describe('SearchFilters', () => {
  const mockSetSearchQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders filter button', () => {
    render(<SearchFilters />);
    expect(screen.getByText('Search Filters')).toBeInTheDocument();
  });

  it('expands panel when filter button is clicked', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('collapses panel when clicked again', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');

    // Click to expand
    fireEvent.click(button);
    expect(screen.getByText('Date Range')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(button);
    expect(screen.queryByText('Date Range')).not.toBeInTheDocument();
  });

  it('displays "Filters Active" when filters are applied', () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'platform:claude after:2024-01-01',
      setSearchQuery: mockSetSearchQuery,
    });
    render(<SearchFilters />);
    expect(screen.getByText('Filters Active')).toBeInTheDocument();
  });

  it('has date range from input', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    // Check that the date input exists
    const fromInput = screen.getByLabelText('From');
    expect(fromInput).toBeInTheDocument();
    expect(fromInput).toHaveAttribute('type', 'date');
  });

  it('has date range to input', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const toInput = screen.getByLabelText('To');
    expect(toInput).toBeInTheDocument();
    expect(toInput).toHaveAttribute('type', 'date');
  });

  it('has ChatGPT platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('ChatGPT');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('has Claude platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('Claude');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('has Perplexity platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('Perplexity');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('has Apply Filters button', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
  });

  it('has Clear button', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('updates date from input when value changes', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
    expect(fromInput).toHaveValue('2024-01-01');
  });

  it('updates date to input when value changes', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const toInput = screen.getByLabelText('To');
    fireEvent.change(toInput, { target: { value: '2024-12-31' } });
    expect(toInput).toHaveValue('2024-12-31');
  });

  it('toggles ChatGPT platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('ChatGPT');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('toggles Claude platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('Claude');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('toggles Perplexity platform checkbox', () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const checkbox = screen.getByLabelText('Perplexity');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('calls setSearchQuery with after: operator when Apply Filters is clicked with from date', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('after:2024-01-01');
    });
  });

  it('calls setSearchQuery with before: operator when Apply Filters is clicked with to date', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const toInput = screen.getByLabelText('To');
    fireEvent.change(toInput, { target: { value: '2024-12-31' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('before:2024-12-31');
    });
  });

  it('calls setSearchQuery with both date operators when both dates are set', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    const toInput = screen.getByLabelText('To');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
    fireEvent.change(toInput, { target: { value: '2024-12-31' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('after:2024-01-01 before:2024-12-31');
    });
  });

  it('calls setSearchQuery with platform: operator when single platform is selected', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    // Uncheck ChatGPT 和 Perplexity to have only Claude enabled
    const chatgptCheckbox = screen.getByLabelText('ChatGPT');
    fireEvent.click(chatgptCheckbox);
    const perplexityCheckbox = screen.getByLabelText('Perplexity');
    fireEvent.click(perplexityCheckbox);

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('platform:claude');
    });
  });

  it('clears all filters when Clear button is clicked', async () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'platform:claude after:2024-01-01',
      setSearchQuery: mockSetSearchQuery,
    });

    render(<SearchFilters />);
    const button = screen.getByText('Filters Active');
    fireEvent.click(button);

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('');
    });
  });

  it('closes panel when Apply Filters is clicked', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.queryByText('Date Range')).not.toBeInTheDocument();
    });
  });

  it('extracts existing platform from search query on mount', () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'platform:claude',
      setSearchQuery: mockSetSearchQuery,
    });

    render(<SearchFilters />);
    const button = screen.getByText('Filters Active');
    fireEvent.click(button);

    const chatgptCheckbox = screen.getByLabelText('ChatGPT');
    const claudeCheckbox = screen.getByLabelText('Claude');

    expect(chatgptCheckbox).not.toBeChecked();
    expect(claudeCheckbox).toBeChecked();
  });

  it('extracts existing after date from search query on mount', () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'after:2024-01-15',
      setSearchQuery: mockSetSearchQuery,
    });

    render(<SearchFilters />);
    const button = screen.getByText('Filters Active');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    expect(fromInput).toHaveValue('2024-01-15');
  });

  it('extracts existing before date from search query on mount', () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'before:2024-12-31',
      setSearchQuery: mockSetSearchQuery,
    });

    render(<SearchFilters />);
    const button = screen.getByText('Filters Active');
    fireEvent.click(button);

    const toInput = screen.getByLabelText('To');
    expect(toInput).toHaveValue('2024-12-31');
  });

  it('combines date filter with existing platform and date filters', async () => {
    (useStore as any).mockReturnValue({
      searchQuery: 'platform:chatgpt before:2024-12-31',
      setSearchQuery: mockSetSearchQuery,
    });

    render(<SearchFilters />);
    const button = screen.getByText('Filters Active');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('platform:chatgpt after:2024-01-01 before:2024-12-31');
    });
  });

  it('does not add platform operator when all platforms are enabled', async () => {
    render(<SearchFilters />);
    const button = screen.getByText('Search Filters');
    fireEvent.click(button);

    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });

    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('after:2024-01-01');
    });
  });
});
