import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Download, Star, Calendar, Clock, User, ArrowLeft, Heart, Share2, Check, Flag } from 'lucide-react';
import { getAllMovies } from '../data/Data';
import ReportModal from '../components/ReportModal';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allMovies = getAllMovies();
  
  const movie = allMovies.find(m => m.id === id);

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

  const handleWatchNow = () => {
    navigate(`/watch/${movie.id}`);
  };

  const [showCopied, setShowCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });
  const isFavorite = favorites.includes(movie.id);

  const handleFavorite = () => {
    let updated: string[];
    if (isFavorite) {
      updated = favorites.filter(id => id !== movie.id);
    } else {
      updated = [...favorites, movie.id];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.spotlightImage || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 z-20 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* New Badge */}
              {movie.isNew && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium mb-4">
                  NEW
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>

              {/* Movie Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{movie.rating}</span>
                </div>
                {movie.year && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                {movie.director && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-1" />
                    <span>{movie.director}</span>
                  </div>
                )}
              </div>

              {/* Genre */}
              <p className="text-gray-300 text-lg mb-6">{movie.genre}</p>

              {/* Description */}
              {movie.description && (
                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl">
                  {movie.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleWatchNow}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Watch Now</span>
                </button>
                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${isFavorite ? 'bg-pink-600 text-white' : 'bg-gray-700/80 text-white hover:bg-gray-600'}`}
                >
                  {isFavorite ? <Heart className="w-5 h-5 fill-current text-white" fill="currentColor" /> : <Heart className="w-5 h-5" />}
                  <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
                </button>
                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                {/* Report Button */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  <Flag className="w-5 h-5" />
                  <span>Report Issue</span>
                </button>
              </div>
              {/* Copied Message */}
              {showCopied && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-fade-in">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Link of the page copied</span>
                </div>
              )}

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-3">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm"
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

      {/* Additional Info Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Movie Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-semibold text-white">Genre:</span> {movie.genre}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Rating:</span> {movie.rating}
                  </div>
                  {movie.year && (
                    <div>
                      <span className="font-semibold text-white">Year:</span> {movie.year}
                    </div>
                  )}
                  {movie.duration && (
                    <div>
                      <span className="font-semibold text-white">Duration:</span> {movie.duration}
                    </div>
                  )}
                  {movie.director && (
                    <div>
                      <span className="font-semibold text-white">Director:</span> {movie.director}
                    </div>
                  )}
                </div>
              </div>

              {/* Streaming Info */}
              {movie.watchSources && movie.watchSources.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Available Servers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {movie.watchSources.map((source, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-800 rounded-lg text-center"
                      >
                        <div className="text-white font-medium">Server {index + 1}</div>
                        <div className="text-gray-400 text-sm capitalize">{source.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        preSelectedMovie={movie}
      />
    </div>
  );
};

export default MovieDetailPage;