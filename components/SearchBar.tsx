import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/Input';
import { useStore } from '../lib/storage';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <div className="relative group">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search conversations..."
        icon={<Search size={16} />}
        className="shadow-sm"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 pointer-events-none">
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-gray-200 rounded text-gray-500">⌘K</kbd>
      </div>
    </div>
  );
};