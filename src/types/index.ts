export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
  rating: string;
  year?: string;
  description?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  watchSources?: WatchSource[];
  downloadSources?: DownloadSource[];
  isNew?: boolean;
  spotlightImage?: string;
  hidden?: boolean;
}

export interface WatchSource {
  type: string;
  id?: string;
  url?: string;
  server?: string;
}

export interface DownloadSource {
  type: string;
  url: string;
  quality?: string;
}

export interface Show {
  id: string;
  title: string;
  poster: string;
  moviesCount: string;
}

export interface MoviesData {
  [key: string]: Movie[];
}

export interface SpotlightMovie extends Movie {
  spotlightImage: string;
}

export interface SearchFilters {
  genre?: string;
  year?: string;
  rating?: string;
  contentType?: 'movie' | 'tvshow';
  sortBy?: 'title' | 'year' | 'rating' | 'newest' | 'type';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  favorites: string[]; // Array of movie IDs
  watchHistory: WatchHistoryItem[];
  createdAt: string;
  lastUpdated: string;
}

export interface WatchHistoryItem {
  movieId: string;
  movieTitle: string;
  poster: string;
  watchedAt: string;
  duration?: number; // in seconds
  progress?: number; // 0-100 percentage
}

export interface ProfileStats {
  totalWatched: number;
  totalFavorites: number;
  totalWatchTime: number; // in minutes
  favoriteGenres: string[];
}

export interface ReportForm {
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  reportType: ReportType;
  userName: string;
  userEmail: string;
  additionalDetails?: string;
  timestamp: string;
}

export type ReportType = 'broken_link' | 'download_issue' | 'video_quality' | 'subtitle_issue' | 'request_anime' | 'other';

export interface ReportStatus {
  id: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  message?: string;
  updatedAt: string;
}

export interface TVShow {
  id: string;
  title: string;
  poster: string;
  genre: string;
  rating: string;
  year: string;
  description: string;
  totalSeasons: number;
  totalEpisodes: number;
  status: 'ongoing' | 'completed';
  seasons: Season[];
  isNew?: boolean;
  spotlightImage?: string;
  manual?: boolean;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
  totalEpisodes: number;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string;
  watchUrl: string;
  airDate?: string;
}