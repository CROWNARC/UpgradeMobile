import React, { useState } from 'react';
import { Play, Download, ExternalLink, AlertCircle, Share2, Check, Flag } from 'lucide-react';
import { WatchSource, DownloadSource, Movie } from '../types';
import ReportModal from './ReportModal';

interface VideoPlayerProps {
  watchSources: WatchSource[];
  downloadSources?: DownloadSource[];
  movieTitle: string;
  movieId?: string; // Add movieId prop for sharing
  movie?: Movie; // Add movie prop for reporting
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  watchSources, 
  downloadSources = [], 
  movieTitle,
  movieId,
  movie
}) => {
  // Find Watch1 server index, default to 0 if not found
  const watch1Index = watchSources.findIndex(source => source.type === 'watch1');
  const [selectedSource, setSelectedSource] = useState(watch1Index >= 0 ? watch1Index : 0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const currentSource = watchSources[selectedSource];

  const getEmbedUrl = (source: WatchSource): string => {
    if (source.url) {
      return source.url;
    }
    
    switch (source.type) {
      case 'dailymotion':
        return `https://www.dailymotion.com/embed/video/${source.id}`;
      case 'youtube':
        return `https://www.youtube.com/embed/${source.id}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${source.id}`;
      default:
        return source.url || '';
    }
  };

  const handleSourceChange = (index: number) => {
    setSelectedSource(index);
    setIsLoading(true);
    setHasError(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleShare = async () => {
    if (!movieId) return;
    try {
      await navigator.clipboard.writeText(window.location.origin + `/movie/${movieId}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1800);
    } catch {}
  };

  if (!watchSources || watchSources.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">No Streaming Sources Available</h3>
        <p className="text-gray-400">This movie is currently not available for streaming.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      {(movieId || movie) && (
        <div className="flex justify-end space-x-3">
          {movieId && (
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mb-2 shadow-lg"
              title="Share this movie"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          )}
          {movie && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 mb-2 shadow-lg"
              title="Report issue with this movie"
            >
              <Flag className="w-5 h-5" />
              <span>Report</span>
            </button>
          )}
        </div>
      )}
      {/* Copied Message */}
      {showCopied && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-fade-in">
          <Check className="w-5 h-5 text-green-400" />
          <span>Link of the page copied</span>
        </div>
      )}
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-white">Loading video...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Playback Error</h3>
              <p className="text-gray-400 mb-4">Unable to load this video source.</p>
              <button
                onClick={() => handleSourceChange((selectedSource + 1) % watchSources.length)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Next Server
              </button>
            </div>
          </div>
        )}

        <iframe
          src={getEmbedUrl(currentSource)}
          title={`${movieTitle} - ${currentSource.type}`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Server Selection */}
      {watchSources.length > 1 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Select Server
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {watchSources.map((source, index) => (
              <button
                key={index}
                onClick={() => handleSourceChange(index)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedSource === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Server {index + 1}
                <br />
                <span className="text-xs opacity-75 capitalize">{source.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download Links */}
      {downloadSources.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Options
          </h3>
          <div className="space-y-2">
            {downloadSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <Download className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white font-medium">{source.type}</span>
                  {source.quality && (
                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {source.quality}
                    </span>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {movie && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          preSelectedMovie={movie}
        />
      )}
    </div>
  );
};

export default VideoPlayer;