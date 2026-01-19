import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Calendar, Filter } from 'lucide-react';
import { Button } from './ui/Button';
import { Platform } from '../types';
import { useStore } from '../lib/storage';

/**
 * SearchFilters component provides visual filtering interface
 * Supports date range (before/after) and platform filtering
 */
export const SearchFilters: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [platforms, setPlatforms] = useState<Record<Platform, boolean>>({
    chatgpt: true,
    claude: true,
    perplexity: true,
  });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Extract current filter values from search query on mount/changes
  useEffect(() => {
    const query = searchQuery;
    const fromMatch = query.match(/after:(\d{4}-\d{2}-\d{2})/i);
    const toMatch = query.match(/before:(\d{4}-\d{2}-\d{2})/i);
    const platformMatch = query.match(/platform:(\w+)/i);

    if (fromMatch) setDateFrom(fromMatch[1]);
    else setDateFrom('');

    if (toMatch) setDateTo(toMatch[1]);
    else setDateTo('');

    // If platform operator exists, only enable that platform
    // Otherwise, enable all platforms
    if (platformMatch) {
      const platform = platformMatch[1].toLowerCase() as Platform;
      setPlatforms({
        chatgpt: platform === 'chatgpt',
        claude: platform === 'claude',
        perplexity: platform === 'perplexity',
      });
    } else {
      setPlatforms({
        chatgpt: true,
        claude: true,
        perplexity: true,
      });
    }
  }, [searchQuery]);

  // Build query from filters
  const buildQuery = (): string => {
    let query = searchQuery;

    // Remove ALL existing operators (date range and platform)
    query = query.replace(/platform:\w+/gi, '').trim();
    query = query.replace(/after:\d{4}-\d{2}-\d{2}/gi, '').trim();
    query = query.replace(/before:\d{4}-\d{2}-\d{2}/gi, '').trim();

    // Add new platform operator (if exactly one platform selected)
    const enabledPlatforms = Object.entries(platforms).filter(([_, enabled]) => enabled);
    if (enabledPlatforms.length === 1) {
      const platform = enabledPlatforms[0][0] as Platform;
      query += ` platform:${platform}`;
    }

    // Add new date range operators
    if (dateFrom) {
      query += ` after:${dateFrom}`;
    }
    if (dateTo) {
      query += ` before:${dateTo}`;
    }

    return query.trim();
  };

  const handleApply = () => {
    setSearchQuery(buildQuery());
    setIsExpanded(false);
  };

  const handleClear = () => {
    setPlatforms({
      chatgpt: true,
      claude: true,
      perplexity: true,
    });
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  const hasFilters = dateFrom || dateTo || Object.values(platforms).some(v => !v);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`justify-between items-center text-sm gap-2 ${
          hasFilters ? 'border-primary-200 text-primary-700' : 'text-gray-500'
        }`}
      >
        <span className="flex items-center gap-2">
          <Filter size={14} />
          {hasFilters ? 'Filters Active' : 'Search Filters'}
        </span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>

      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4 animate-in slide-in-from-top-1 fade-in duration-200">
          {/* Date Range Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">Date Range</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="dateFrom" className="text-xs text-gray-500 mb-1 block">From</label>
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="dateTo" className="text-xs text-gray-500 mb-1 block">To</label>
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Platform Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">Platform</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.chatgpt}
                  onChange={(e) =>
                    setPlatforms({
                      ...platforms,
                      chatgpt: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <span className={`w-3 h-3 rounded-full bg-[#10A37F]`}></span>
                  ChatGPT
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.claude}
                  onChange={(e) =>
                    setPlatforms({
                      ...platforms,
                      claude: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <span className={`w-3 h-3 rounded-full bg-[#D97757]`}></span>
                  Claude
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.perplexity}
                  onChange={(e) =>
                    setPlatforms({
                      ...platforms,
                      perplexity: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <span className={`w-3 h-3 rounded-full bg-[#6B4FFF]`}></span>
                  Perplexity
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClear}
              className="flex-1 gap-2"
            >
              <X size={14} />
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
