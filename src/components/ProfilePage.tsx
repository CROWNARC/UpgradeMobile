import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  Clock, 
  Settings, 
  Edit, 
  Camera, 
  Trash2, 
  Star,
  Play,
  Calendar,
  BarChart3,
  LogOut,
  Flag,
  AlertTriangle
} from 'lucide-react';
import { 
  getUserProfile, 
  updateProfileName, 
  updateProfileAvatar, 
  getProfileStats,
  clearWatchHistory,
  clearFavorites,
  resetProfile,
  removeFromFavorites
} from '../utils/profileUtils';
import { getAllMovies } from '../data/Data';
import { UserProfile, ProfileStats } from '../types';
import MovieCard from './MovieCard';
import ReportModal from './ReportModal';
import { getUserReports, getReportTypeLabel } from '../utils/reportUtils';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'history' | 'reports'>('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userReports, setUserReports] = useState<any[]>([]);
  const allMovies = getAllMovies();

  useEffect(() => {
    loadProfile();
    loadUserReports();
  }, []);

  const loadUserReports = () => {
    const reports = getUserReports();
    setUserReports(reports);
  };

  const loadProfile = () => {
    const userProfile = getUserProfile();
    const userStats = getProfileStats();
    setProfile(userProfile);
    setStats(userStats);
    setNewName(userProfile.name);
  };

  const handleNameSave = () => {
    if (newName.trim()) {
      updateProfileName(newName.trim());
      setIsEditing(false);
      loadProfile();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        updateProfileAvatar(avatarUrl);
        loadProfile();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFavorite = (movieId: string) => {
    removeFromFavorites(movieId);
    loadProfile();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      clearWatchHistory();
      loadProfile();
    }
  };

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites();
      loadProfile();
    }
  };

  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile? This will clear all data.')) {
      resetProfile();
      loadProfile();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getFavoriteMovies = () => {
    return allMovies.filter(movie => profile?.favorites.includes(movie.id));
  };

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Profile Header */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleNameSave}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewName(profile.name);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stats Preview */}
            <div className="hidden md:flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.totalFavorites}</div>
                <div className="text-sm text-gray-400">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.totalWatched}</div>
                <div className="text-sm text-gray-400">Watched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{stats.totalWatchTime}</div>
                <div className="text-sm text-gray-400">Minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 backdrop-blur-xl rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'favorites' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorites ({stats.totalFavorites})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'history' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History ({stats.totalWatched})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'reports' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Reports ({userReports.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Favorites</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalFavorites}</div>
                  <p className="text-gray-400 text-sm">Movies in your collection</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <Play className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Watched</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">{stats.totalWatched}</div>
                  <p className="text-gray-400 text-sm">Movies completed</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-600 p-2 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Watch Time</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">{stats.totalWatchTime}</div>
                  <p className="text-gray-400 text-sm">Total minutes watched</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                {profile.watchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {profile.watchHistory.slice(0, 5).map((item) => (
                      <div key={item.movieId} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <img 
                          src={item.poster} 
                          alt={item.movieTitle}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.movieTitle}</div>
                          <div className="text-sm text-gray-400">
                            {formatDate(item.watchedAt)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.progress ? `${item.progress}%` : 'Watched'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Favorites</h3>
                {getFavoriteMovies().length > 0 && (
                  <button
                    onClick={handleClearFavorites}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {getFavoriteMovies().length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {getFavoriteMovies().map((movie) => (
                    <div key={movie.id} className="relative group">
                      <MovieCard movie={movie} />
                      <button
                        onClick={() => handleRemoveFavorite(movie.id)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-gray-400">Start adding movies to your favorites!</p>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Watch History</h3>
                {profile.watchHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {profile.watchHistory.length > 0 ? (
                <div className="space-y-3">
                  {profile.watchHistory.map((item) => (
                    <div key={item.movieId} className="flex items-center space-x-4 p-4 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10">
                      <img 
                        src={item.poster} 
                        alt={item.movieTitle}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.movieTitle}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.watchedAt)}</span>
                          </div>
                          {item.progress && (
                            <div className="flex items-center space-x-1">
                              <Play className="w-3 h-3" />
                              <span>{item.progress}% watched</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = `/watch/${item.movieId}`}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Watch Again
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No watch history</h3>
                  <p className="text-gray-400">Start watching movies to build your history!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Reports</h3>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>New Report</span>
              </button>
            </div>

            {userReports.length > 0 ? (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={report.moviePoster} 
                        alt={report.movieTitle}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{report.movieTitle}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            report.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                            report.status === 'in_progress' ? 'bg-blue-600 text-blue-100' :
                            report.status === 'resolved' ? 'bg-green-600 text-green-100' :
                            'bg-red-600 text-red-100'
                          }`}>
                            {report.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          <div>Type: {getReportTypeLabel(report.reportType)}</div>
                          <div>Reported: {new Date(report.timestamp).toLocaleDateString()}</div>
                        </div>
                        {report.additionalDetails && (
                          <p className="text-sm text-gray-300">{report.additionalDetails}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Flag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
                <p className="text-gray-400 mb-4">Report issues with movies or request new anime!</p>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
                >
                  Create First Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="mt-12 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Account Settings</span>
        </h3>
        <div className="space-y-4">
          <button
            onClick={handleResetProfile}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Reset Profile</span>
          </button>
          <p className="text-xs text-gray-500">
            All data is stored locally in your browser. Clearing browser data will reset your profile.
          </p>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          loadUserReports(); // Refresh reports after closing modal
        }}
      />
    </div>
  );
};

export default ProfilePage; 