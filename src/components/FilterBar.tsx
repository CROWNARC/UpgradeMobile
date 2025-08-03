import React from 'react';
import { Filter, Film, Tv } from 'lucide-react';
import { SearchFilters } from '../types';

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  genres: string[];
  years: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFiltersChange, 
  genres, 
  years 
}) => {
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-white mr-2" />
        <h3 className="text-white font-semibold">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Content Type Filter */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Content Type
          </label>
          <select
            value={filters.contentType || 'all'}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Content</option>
            <option value="movie">Movies Only</option>
            <option value="tvshow">TV Shows Only</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Genre
          </label>
          <select
            value={filters.genre || 'all'}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Year
          </label>
          <select
            value={filters.year || 'all'}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.rating || 'all'}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Any Rating</option>
            <option value="9.0">9.0+ Excellent</option>
            <option value="8.0">8.0+ Very Good</option>
            <option value="7.0">7.0+ Good</option>
            <option value="6.0">6.0+ Fair</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'title'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Title A-Z</option>
            <option value="year">Year (Newest)</option>
            <option value="rating">Rating (Highest)</option>
            <option value="newest">New Releases</option>
            <option value="type">Content Type</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;