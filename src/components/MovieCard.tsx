import React, { useState, useEffect } from 'react';
import { Play, Star, Clock, Heart, Share2, Check, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { isFavorite, addToFavorites, removeFromFavorites } from '../utils/profileUtils';
import ReportModal from './ReportModal';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(movie.id));
  }, [movie.id]);

  const sizeClasses = {
    small: 'w-40 h-60',
    medium: 'w-48 h-72',
    large: 'w-56 h-84'
  };

  const handleCardClick = () => {
    window.location.href = `/movie/${movie.id}`;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
      setFavorite(false);
    } else {
      addToFavorites(movie.id);
      setFavorite(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1800);
    } catch {}
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 group-hover:scale-105`}>
        {/* Poster Image */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* New Badge */}
        {movie.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
            NEW
          </div>
        )}

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/watch/${movie.id}`;
            }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
          >
            <Play className="w-6 h-6 text-white fill-current" />
          </button>
        </div>

        {/* Favorite, Share & Report Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full shadow-lg border border-white/10 ${favorite ? 'bg-pink-600 text-white' : 'bg-gray-900/80 text-white hover:bg-gray-700'}`}
            title={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} fill={favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full shadow-lg border border-white/10 bg-blue-600 text-white hover:bg-blue-700"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReportModal(true);
            }}
            className="p-2 rounded-full shadow-lg border border-white/10 bg-red-600 text-white hover:bg-red-700"
            title="Report Issue"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{movie.rating}</span>
            </div>
            {movie.watchSources && movie.watchSources.length > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Available</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {movie.genre}
          </p>
        </div>
        {/* Copied Message */}
        {showCopied && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm">Link of the page copied</span>
          </div>
        )}
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

export default MovieCard;