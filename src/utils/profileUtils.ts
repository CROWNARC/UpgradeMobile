import { UserProfile, WatchHistoryItem, ProfileStats } from '../types';

const PROFILE_KEY = 'projectz_user_profile';
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iNzUiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTI1IDEyNUMzNSA5NSA1NSA4NSA3NSA4NUM5NSA4NSAxMTUgOTUgMTI1IDEyNUgyNVoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+';

// Initialize default profile
const getDefaultProfile = (): UserProfile => ({
  id: 'user_' + Date.now(),
  name: 'User',
  avatar: DEFAULT_AVATAR,
  favorites: [],
  watchHistory: [],
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
});

// Get user profile from localStorage
export const getUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Create default profile if none exists
    const defaultProfile = getDefaultProfile();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return getDefaultProfile();
  }
};

// Save user profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Update profile name
export const updateProfileName = (name: string): void => {
  const profile = getUserProfile();
  profile.name = name;
  saveUserProfile(profile);
};

// Update profile avatar
export const updateProfileAvatar = (avatar: string): void => {
  const profile = getUserProfile();
  profile.avatar = avatar;
  saveUserProfile(profile);
};

// Add movie to favorites
export const addToFavorites = (movieId: string): void => {
  const profile = getUserProfile();
  if (!profile.favorites.includes(movieId)) {
    profile.favorites.push(movieId);
    saveUserProfile(profile);
  }
};

// Remove movie from favorites
export const removeFromFavorites = (movieId: string): void => {
  const profile = getUserProfile();
  profile.favorites = profile.favorites.filter(id => id !== movieId);
  saveUserProfile(profile);
};

// Check if movie is in favorites
export const isFavorite = (movieId: string): boolean => {
  const profile = getUserProfile();
  return profile.favorites.includes(movieId);
};

// Add movie to watch history
export const addToWatchHistory = (movieId: string, movieTitle: string, poster: string, duration?: number, progress?: number): void => {
  const profile = getUserProfile();
  
  // Remove existing entry if it exists
  profile.watchHistory = profile.watchHistory.filter(item => item.movieId !== movieId);
  
  // Add new entry at the beginning
  const watchItem: WatchHistoryItem = {
    movieId,
    movieTitle,
    poster,
    watchedAt: new Date().toISOString(),
    duration,
    progress
  };
  
  profile.watchHistory.unshift(watchItem);
  
  // Keep only last 50 entries
  if (profile.watchHistory.length > 50) {
    profile.watchHistory = profile.watchHistory.slice(0, 50);
  }
  
  saveUserProfile(profile);
};

// Get profile statistics
export const getProfileStats = (): ProfileStats => {
  const profile = getUserProfile();
  const allMovies = profile.watchHistory;
  
  // Calculate total watch time
  const totalWatchTime = allMovies.reduce((total, movie) => {
    return total + (movie.duration || 0);
  }, 0) / 60; // Convert to minutes
  
  // Get favorite genres (simplified - would need genre data from movies)
  const favoriteGenres: string[] = [];
  
  return {
    totalWatched: allMovies.length,
    totalFavorites: profile.favorites.length,
    totalWatchTime: Math.round(totalWatchTime),
    favoriteGenres
  };
};

// Clear watch history
export const clearWatchHistory = (): void => {
  const profile = getUserProfile();
  profile.watchHistory = [];
  saveUserProfile(profile);
};

// Clear favorites
export const clearFavorites = (): void => {
  const profile = getUserProfile();
  profile.favorites = [];
  saveUserProfile(profile);
};

// Reset profile to default
export const resetProfile = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  getUserProfile(); // This will create a new default profile
}; 