import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTVShowInfo, fetchEpisodes, getCachedEpisodes, getDetectiveConanEpisodes } from '../utils/tvShowUtils';
import { TVShow, Episode } from '../types';
import { Play, Star, Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';

const TVShowDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShow | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadShowData(id);
    }
  }, [id]);

  const loadShowData = async (showId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get show info
      const showInfo = getTVShowInfo(showId);
      if (!showInfo) {
        setError('Show not found');
        return;
      }
      setShow(showInfo);

      // --- Custom logic for Detective Conan only ---
      if (showId === 'detective-conan') {
        const episodes = await getDetectiveConanEpisodes();
        setEpisodes(episodes);
        setLoading(false);
        return;
      }

      // Check cache first
      const cachedEpisodes = getCachedEpisodes(showId, selectedSeason);
      if (cachedEpisodes) {
        setEpisodes(cachedEpisodes);
        setLoading(false);
        return;
      }

      // Fetch episodes
      const result = await fetchEpisodes(showId, selectedSeason);
      if (result.success && result.episodes) {
        setEpisodes(result.episodes);
      } else {
        setError(result.error || 'Failed to load episodes');
      }
    } catch (err) {
      setError('An error occurred while loading the show');
      console.error('Error loading show:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setLoading(true);
    
    // Check cache first
    const cachedEpisodes = getCachedEpisodes(show?.id || '', seasonNumber);
    if (cachedEpisodes) {
      setEpisodes(cachedEpisodes);
      setLoading(false);
      return;
    }

    // Fetch new episodes
    if (show) {
      const result = await fetchEpisodes(show.id, seasonNumber);
      if (result.success && result.episodes) {
        setEpisodes(result.episodes);
      } else {
        setError(result.error || 'Failed to load episodes');
      }
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link to="/tvshows" className="text-red-500 hover:text-red-400">
            Back to TV Shows
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Show Not Found</h2>
          <Link to="/tvshows" className="text-red-500 hover:text-red-400">
            Back to TV Shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/tvshows" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to TV Shows
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={show.poster}
          alt={show.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{show.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{show.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{show.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{show.totalSeasons} Season{show.totalSeasons > 1 ? 's' : ''}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                show.status === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-yellow-600 text-black'
              }`}>
                {show.status === 'completed' ? 'Completed' : 'Ongoing'}
              </span>
            </div>
            
            <p className="text-lg text-gray-300 max-w-3xl">{show.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Season Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <div className="flex gap-2">
            {Array.from({ length: show.totalSeasons }, (_, i) => i + 1).map((season) => (
              <button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedSeason === season
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Season {season}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading episodes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} showId={show.id} />
            ))}
          </div>
        )}

        {!loading && episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No episodes found for this season.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface EpisodeCardProps {
  episode: Episode;
  showId: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, showId }) => {
  return (
    <Link 
      to={`/tvshow/${showId}/episode/${episode.episodeNumber}`}
      className="group"
    >
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-red-600 rounded-full p-3">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          {/* Episode Number */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/80 text-white px-2 py-1 rounded text-sm font-semibold">
              EP {episode.episodeNumber}
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
            {episode.title}
          </h3>
          {episode.duration && (
            <p className="text-sm text-gray-400">{episode.duration}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TVShowDetailPage; 