import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Film, Tv } from 'lucide-react';
import { SearchResult, searchContent } from '../utils/searchUtils';
import { getAllMovies } from '../data/Data';
import { getAllTVShows } from '../utils/tvShowUtils';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search movies & TV shows...",
  showSuggestions = true 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim() && showSuggestions) {
        setIsSearching(true);
        try {
          const movies = getAllMovies();
          const tvShows = getAllTVShows();
          const results = searchContent(movies, tvShows, searchQuery).slice(0, 8);
          setSuggestions(results);
          setShowSuggestionsList(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowSuggestionsList(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestionsList(false);
      }
    }, 300); // 300ms debounce
  }, [showSuggestions]);

  useEffect(() => {
    debouncedSearch(query);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestionsList(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const item = suggestions[selectedIndex];
          if (item.type === 'movie') {
            navigate(`/movie/${item.id}`);
          } else {
            navigate(`/tvshow/${item.id}`);
          }
          setShowSuggestionsList(false);
          setQuery('');
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (item: SearchResult) => {
    if (item.type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/tvshow/${item.id}`);
    }
    setShowSuggestionsList(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
  };

  const getTypeIcon = (type: 'movie' | 'tvshow') => {
    return type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />;
  };

  const getTypeLabel = (type: 'movie' | 'tvshow') => {
    return type === 'movie' ? 'Movie' : 'TV Show';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-1.5 md:py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base mobile-search-input"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white mobile-touch-target"
            >
              <X className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (suggestions.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 md:max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-3 md:p-4 text-center text-gray-400 text-sm">
              Searching...
            </div>
          ) : (
            suggestions.map((item, index) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSuggestionClick(item)}
                className={`flex items-center p-2 md:p-3 cursor-pointer transition-colors duration-200 mobile-touch-target ${
                  index === selectedIndex 
                    ? 'bg-blue-600' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-10 h-14 md:w-12 md:h-16 object-cover rounded mr-2 md:mr-3"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium truncate text-sm md:text-base">{item.title}</h4>
                    <div className="flex items-center gap-1 text-blue-400 flex-shrink-0">
                      {getTypeIcon(item.type)}
                      <span className="text-xs hidden sm:inline">{getTypeLabel(item.type)}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm truncate">{item.genre}</p>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <span className="text-yellow-400">{item.rating}</span>
                    {item.year && <span className="text-gray-500 hidden sm:inline">• {item.year}</span>}
                    {item.isNew && <span className="text-red-400 text-xs font-medium">NEW</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;