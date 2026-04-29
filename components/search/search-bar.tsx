'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  name?: string;
  platform?: string;
  status?: string;
  type: 'creator' | 'campaign' | 'contract';
  url: string;
}

interface SearchBarProps {
  tenantId: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  tenantId,
  placeholder = 'Search creators, campaigns, contracts...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&tenantId=${tenantId}`
      );
      const data = await response.json();
      
      const allResults = [
        ...(data.creators || []),
        ...(data.campaigns || []),
        ...(data.contracts || []),
      ];
      
      setResults(allResults);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    router.push(result.url);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creator': return '👤';
      case 'campaign': return '📢';
      case 'contract': return '📄';
      default: return '📄';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: 'white' }}
        />
        {loading ? (
          <Loader2 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-xl">{getTypeIcon(result.type)}</span>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">
                  {result.name || `Contract ${result.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {result.type} {result.platform ? `• ${result.platform}` : ''} {result.status ? `• ${result.status}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
