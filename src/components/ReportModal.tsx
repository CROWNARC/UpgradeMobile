import React, { useState, useEffect } from 'react';
import { X, Search, AlertTriangle, Send, Check } from 'lucide-react';
import { Movie, ReportForm, ReportType } from '../types';
import { sendReportEmail, getReportTypeLabel, getReportTypeDescription, validateReportForm } from '../utils/reportUtils';
import { getAllMovies } from '../data/Data';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedMovie?: Movie;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, preSelectedMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(preSelectedMovie || null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    reportType: 'broken_link' as ReportType,
    additionalDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const allMovies = getAllMovies();

  useEffect(() => {
    if (preSelectedMovie) {
      setSelectedMovie(preSelectedMovie);
    }
  }, [preSelectedMovie]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchQuery(movie.title);
    setShowSearchResults(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovie) {
      setErrors(['Please select a movie to report']);
      return;
    }

    const reportData: ReportForm = {
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      moviePoster: selectedMovie.poster,
      reportType: formData.reportType,
      userName: formData.userName,
      userEmail: formData.userEmail,
      additionalDetails: formData.additionalDetails,
      timestamp: new Date().toISOString()
    };

    const validationErrors = validateReportForm(reportData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const success = await sendReportEmail(reportData);
      if (success) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
          setFormData({
            userName: '',
            userEmail: '',
            reportType: 'broken_link',
            additionalDetails: ''
          });
          setSelectedMovie(null);
          setSearchQuery('');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportTypes: ReportType[] = [
    'broken_link',
    'download_issue', 
    'video_quality',
    'subtitle_issue',
    'request_anime',
    'other'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Report Broken Anime Link</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Search for Anime */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Search for Anime <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type anime name to search..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {searchResults.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => handleMovieSelect(movie)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors"
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="text-left">
                      <div className="text-white font-medium">{movie.title}</div>
                      <div className="text-sm text-gray-400">{movie.year} • {movie.genre}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Movie Display */}
          {selectedMovie && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedMovie.poster} 
                  alt={selectedMovie.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-white font-semibold">{selectedMovie.title}</h3>
                  <p className="text-gray-400 text-sm">{selectedMovie.year} • {selectedMovie.genre}</p>
                </div>
              </div>
            </div>
          )}

          {/* Report Type */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reportType}
              onChange={(e) => handleInputChange('reportType', e.target.value as ReportType)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {getReportTypeLabel(type)}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-400">
              {getReportTypeDescription(formData.reportType)}
            </p>
          </div>

          {/* User Name */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* User Email */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) => handleInputChange('userEmail', e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <label className="block text-white font-medium">
              Additional Details (Optional)
            </label>
            <textarea
              value={formData.additionalDetails}
              onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
              placeholder="Describe the issue you encountered (e.g., video won't load, download link is broken, etc.)"
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-red-400 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-3 flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Report sent successfully!</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-400 text-sm">Failed to send report. Please try again.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Report'}</span>
            </button>
          </div>
        </form>

        {/* How this helps section */}
        <div className="p-6 bg-blue-900/20 border-t border-gray-800">
          <h3 className="text-blue-400 font-semibold mb-2">How this helps:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• We'll receive detailed information about the broken link</li>
            <li>• Our team will investigate and fix the issue promptly</li>
            <li>• You'll help improve the experience for all users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportModal; 