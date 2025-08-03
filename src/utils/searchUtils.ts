import { Movie, TVShow, SearchFilters } from '../types';
import { getAllMovies } from '../data/Data';

// Combined content type for search results
export interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'tvshow';
  poster: string;
  genre: string;
  rating: string;
  year?: string;
  description?: string;
  isNew?: boolean;
}

// Convert movies to search results
const moviesToSearchResults = (movies: Movie[]): SearchResult[] => {
  return movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    type: 'movie' as const,
    poster: movie.poster,
    genre: movie.genre,
    rating: movie.rating,
    year: movie.year,
    description: movie.description,
    isNew: movie.isNew
  }));
};

// Convert TV shows to search results
const tvShowsToSearchResults = (tvShows: TVShow[]): SearchResult[] => {
  return tvShows.map(show => ({
    id: show.id,
    title: show.title,
    type: 'tvshow' as const,
    poster: show.poster,
    genre: show.genre,
    rating: show.rating,
    year: show.year,
    description: show.description
  }));
};

// Unified search function for both movies and TV shows
export const searchContent = (
  movies: Movie[], 
  tvShows: TVShow[], 
  query: string, 
  filters?: SearchFilters
): SearchResult[] => {
  let allContent = [
    ...moviesToSearchResults(movies),
    ...tvShowsToSearchResults(tvShows)
  ];

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    allContent = allContent.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.genre.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply filters
  if (filters) {
    if (filters.genre && filters.genre !== 'all') {
      allContent = allContent.filter(item =>
        item.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters.year && filters.year !== 'all') {
      allContent = allContent.filter(item =>
        item.year === filters.year
      );
    }

    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      allContent = allContent.filter(item => {
        const rating = parseFloat(item.rating.split('/')[0]);
        return rating >= minRating;
      });
    }

    // Content type filter
    if (filters.contentType && filters.contentType !== 'all') {
      allContent = allContent.filter(item => item.type === filters.contentType);
    }
  }

  // Sort results
  if (filters?.sortBy) {
    allContent.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.year || '0').localeCompare(a.year || '0');
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }

  return allContent;
};

// Legacy function for backward compatibility
export const searchMovies = (movies: Movie[], query: string, filters?: SearchFilters): Movie[] => {
  let filteredMovies = movies;

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredMovies = filteredMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genre.toLowerCase().includes(searchTerm) ||
      movie.director?.toLowerCase().includes(searchTerm) ||
      movie.cast?.some(actor => actor.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.genre && filters.genre !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters.year && filters.year !== 'all') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.year === filters.year
      );
    }

    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filteredMovies = filteredMovies.filter(movie => {
        const rating = parseFloat(movie.rating.split('/')[0]);
        return rating >= minRating;
      });
    }
  }

  // Sort results
  if (filters?.sortBy) {
    filteredMovies.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.year || '0').localeCompare(a.year || '0');
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  return filteredMovies;
};

export const getUniqueGenres = (movies: Movie[]): string[] => {
  const genres = new Set<string>();
  movies.forEach(movie => {
    movie.genre.split(',').forEach(genre => {
      genres.add(genre.trim());
    });
  });
  return Array.from(genres).sort();
};

export const getUniqueYears = (movies: Movie[]): string[] => {
  const years = new Set<string>();
  movies.forEach(movie => {
    if (movie.year) {
      years.add(movie.year);
    }
  });
  return Array.from(years).sort().reverse();
};

// Get all content for search - this function will be called from SearchBar
export const getAllContent = (): SearchResult[] => {
  const movies = getAllMovies();
  // Import getAllTVShows dynamically to avoid circular dependency
  const { getAllTVShows } = require('./tvShowUtils');
  const tvShows = getAllTVShows();
  return [
    ...moviesToSearchResults(movies),
    ...tvShowsToSearchResults(tvShows)
  ];
};