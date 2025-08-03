import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  size?: 'small' | 'medium' | 'large';
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, size = 'medium' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-6 md:py-8 mobile-movie-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 mobile-movie-section-header">
          <h2 className="text-xl md:text-2xl font-bold text-white mobile-movie-section-title">{title}</h2>
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-4 mobile-movie-scroll mobile-scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 mobile-movie-card">
              <MovieCard movie={movie} size={size} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;