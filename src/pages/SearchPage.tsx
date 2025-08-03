import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Film, Tv } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import { getAllMovies } from '../data/Data';
import { getAllTVShows } from '../utils/tvShowUtils';
import { searchContent, SearchResult, getUniqueGenres, getUniqueYears } from '../utils/searchUtils';
import { SearchFilters } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const allMovies = getAllMovies();
  const allTVShows = getAllTVShows();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    genre: searchParams.get('genre') || undefined,
    year: searchParams.get('year') || undefined,
    rating: searchParams.get('rating') || undefined,
    contentType: searchParams.get('contentType') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'title'
  });
  const [results, setResults] = useState<SearchResult[]>([]);

  // Get unique genres and years from both movies and TV shows
  const allGenres = [...getUniqueGenres(allMovies), ...getUniqueGenres(allTVShows)];
  const uniqueGenres = Array.from(new Set(allGenres)).sort();
  
  const allYears = [...getUniqueYears(allMovies), ...getUniqueYears(allTVShows)];
  const uniqueYears = Array.from(new Set(allYears)).sort().reverse();

  useEffect(() => {
    const filteredResults = searchContent(allMovies, allTVShows, query, filters);
    setResults(filteredResults);
  }, [query, filters, allMovies, allTVShows]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.year) params.set('year', filters.year);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.contentType) params.set('contentType', filters.contentType);
    if (filters.sortBy && filters.sortBy !== 'title') params.set('sortBy', filters.sortBy);
    
    setSearchParams(params);
  }, [query, filters, setSearchParams]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setQuery('');
    setFilters({ sortBy: 'title' });
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'movie') {
      navigate(`/movie/${result.id}`);
    } else {
      navigate(`/tvshow/${result.id}`);
    }
  };

  const getTypeIcon = (type: 'movie' | 'tvshow') => {
    return type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />;
  };

  const getTypeLabel = (type: 'movie' | 'tvshow') => {
    return type === 'movie' ? 'Movie' : 'TV Show';
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <SearchIcon className="w-8 h-8 mr-3" />
            Search Movies & TV Shows
          </h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              onSearch={handleSearch}
              showSuggestions={false}
            />
          </div>

          {/* Filters */}
          <FilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            genres={uniqueGenres}
            years={uniqueYears}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-300">
              {query ? (
                <span>
                  Found <span className="text-white font-semibold">{results.length}</span> results for "{query}"
                </span>
              ) : (
                <span>
                  Showing <span className="text-white font-semibold">{results.length}</span> items
                </span>
              )}
            </div>
            
            {(query || filters.genre || filters.year || filters.rating || filters.contentType) && (
              <button
                onClick={clearAllFilters}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={result.poster}
                      alt={result.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-1">
                      <div className="flex items-center gap-1 text-blue-400 text-xs">
                        {getTypeIcon(result.type)}
                        <span>{getTypeLabel(result.type)}</span>
                      </div>
                    </div>
                    {result.isNew && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        NEW
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <h3 className="text-white font-medium text-sm truncate">{result.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="text-yellow-400">{result.rating}</span>
                        {result.year && <span>• {result.year}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                {query ? 'No results found' : 'Search for movies and TV shows'}
              </div>
              <p className="text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;