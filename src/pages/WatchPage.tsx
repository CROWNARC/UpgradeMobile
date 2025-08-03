import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import MovieCard from '../components/MovieCard';
import { getAllMovies } from '../data/Data';
import { addToWatchHistory } from '../utils/profileUtils';

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allMovies = getAllMovies();
  
  const movie = allMovies.find(m => m.id === id);
  
  // Get random recommendations (excluding current movie)
  const getRandomRecommendations = () => {
    const otherMovies = allMovies.filter(m => m.id !== id);
    const shuffled = [...otherMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };
  
  const recommendations = getRandomRecommendations();

  // Add to watch history when page loads
  useEffect(() => {
    if (movie) {
      addToWatchHistory(movie.id, movie.title, movie.poster);
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 mobile-safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 mobile-watch-header">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200 mobile-touch-target"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white mobile-watch-title">{movie.title}</h1>
              <p className="text-gray-400 text-sm md:text-base mobile-watch-subtitle">{movie.genre} • {movie.rating}</p>
            </div>
          </div>
          
          <div className="mobile-watch-controls">
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 mobile-watch-control-button mobile-touch-target"
            >
              <Info className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Movie Info</span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-6 md:mb-8 mobile-video-container">
          <VideoPlayer
            watchSources={movie.watchSources || []}
            downloadSources={movie.downloadSources}
            movieTitle={movie.title}
            movieId={movie.id}
            movie={movie}
          />
        </div>

        {/* Movie Info Card */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 h-36 md:w-32 md:h-48 object-cover rounded-lg mx-auto md:mx-0"
            />
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4 text-gray-300 text-sm md:text-base">
                <span>{movie.rating}</span>
                {movie.year && <span>{movie.year}</span>}
                {movie.duration && <span>{movie.duration}</span>}
              </div>
              <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">{movie.genre}</p>
              {movie.description && (
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{movie.description}</p>
              )}
              {movie.director && (
                <p className="text-gray-400 mt-3 md:mt-4 text-sm md:text-base">
                  <span className="font-semibold text-white">Director:</span> {movie.director}
                </p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div className="mt-3 md:mt-4">
                  <span className="font-semibold text-white">Cast:</span>
                  <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                    {movie.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs md:text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Notice for Better Experience */}
        <div className="bg-blue-900 text-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 text-xs md:text-sm">
          <strong>💡 For the Best Experience:</strong><br />
          We recommend using an <span className="font-semibold">ad blocker</span> or the <span className="font-semibold">Brave browser</span> for an ad-free streaming experience.<br />
          This will help you avoid unwanted redirects and enjoy smoother playback.
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {recommendations.map((recMovie) => (
            <MovieCard key={recMovie.id} movie={recMovie} size="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;