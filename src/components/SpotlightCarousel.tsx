import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SpotlightMovie } from '../types';

interface SpotlightCarouselProps {
  movies: SpotlightMovie[];
}

const SpotlightCarousel: React.FC<SpotlightCarouselProps> = ({ movies }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [movies.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentMovie = movies[currentIndex];

  const handlePlayClick = () => {
    navigate(`/watch/${currentMovie.id}`);
  };

  const handleMoreInfoClick = () => {
    navigate(`/movie/${currentMovie.id}`);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={movie.spotlightImage}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Logo instead of title */}
            <div className="mb-6">
              {currentMovie.title.toLowerCase().includes('doraemon') ? (
                <img 
                  src="https://i.postimg.cc/Vs2Gm50M/doraemon-logo.webp"
                  alt="Doraemon"
                  className="w-80 h-20 object-contain"
                />
              ) : currentMovie.title.toLowerCase().includes('shin-chan') || currentMovie.title.toLowerCase().includes('shinchan') ? (
                <img 
                  src="https://i.postimg.cc/MGs54G8n/shinchan-logo.webp"
                  alt="Shin-chan"
                  className="w-64 h-20 object-contain"
                />
              ) : (
                <h1 className="text-5xl md:text-7xl font-bold text-green-400 mb-4 leading-tight drop-shadow-2xl">
                  {currentMovie.title}
                </h1>
              )}
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentMovie.genre.split(', ').map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded-full border border-gray-600"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Movie Details */}
            <div className="flex items-center space-x-4 mb-6 text-white">
              <span className="text-lg">Movie</span>
              <span className="text-gray-400">•</span>
              <span className="text-lg">2023</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium">{currentMovie.rating}</span>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl">
              {currentMovie.description || "A captivating story that will take you on an unforgettable journey through imagination and adventure."}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePlayClick}
                className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Now</span>
              </button>
              <button 
                onClick={handleMoreInfoClick}
                className="flex items-center space-x-3 bg-gray-700/80 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 shadow-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 rounded-full bg-black/50 text-white hover:bg-black/70 shadow-lg transition-colors duration-200"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-500 scale-125 shadow-lg'
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotlightCarousel;