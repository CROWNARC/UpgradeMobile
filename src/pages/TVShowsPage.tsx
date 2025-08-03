import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTVShows } from '../utils/tvShowUtils';
import { TVShow } from '../types';
import { Play, Star, Calendar, Clock, Heart, Share2, Check, Flag } from 'lucide-react';
import { isFavorite, addToFavorites, removeFromFavorites } from '../utils/profileUtils';
import ReportModal from '../components/ReportModal';

const TVShowsPage: React.FC = () => {
  const tvShows = getAllTVShows();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">TV Shows</h1>
            <p className="text-xl text-gray-300">Watch your favorite anime series</p>
          </div>
        </div>
      </div>

      {/* TV Shows Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tvShows.map((show) => (
            <TVShowCard key={show.id} show={show} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TVShowCardProps {
  show: TVShow;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ show }) => {
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(show.id));
  }, [show.id]);

  const handleCardClick = () => {
    window.location.href = `/tvshow/${show.id}`;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(show.id);
      setFavorite(false);
    } else {
      addToFavorites(show.id);
      setFavorite(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.origin + `/tvshow/${show.id}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1800);
    } catch {}
  };

  return (
    <div 
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-48 h-72 relative overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 group-hover:scale-105">
        {/* Poster Image */}
        <img
          src={show.poster}
          alt={show.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            show.status === 'completed' 
              ? 'bg-green-600 text-white' 
              : 'bg-yellow-600 text-black'
          }`}>
            {show.status === 'completed' ? 'Completed' : 'Ongoing'}
          </span>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/tvshow/${show.id}`;
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

        {/* Show Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
            {show.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span>{show.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{show.totalEpisodes} EP</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
            {show.genre}
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
        preSelectedMovie={show as any} // Type assertion for compatibility
      />
    </div>
  );
};

export default TVShowsPage; 