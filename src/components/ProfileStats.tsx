import React, { useState, useEffect } from 'react';
import { Heart, Clock, BarChart3 } from 'lucide-react';
import { getProfileStats } from '../utils/profileUtils';
import { ProfileStats } from '../types';

interface ProfileStatsProps {
  compact?: boolean;
}

const ProfileStatsComponent: React.FC<ProfileStatsProps> = ({ compact = false }) => {
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    setStats(getProfileStats());
  }, []);

  if (!stats) return null;

  if (compact) {
    return (
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1 text-blue-400">
          <Heart className="w-3 h-3" />
          <span>{stats.totalFavorites}</span>
        </div>
        <div className="flex items-center space-x-1 text-green-400">
          <Clock className="w-3 h-3" />
          <span>{stats.totalWatched}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Heart className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-400">Favorites</span>
        </div>
        <div className="text-lg font-bold text-blue-400">{stats.totalFavorites}</div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">Watched</span>
        </div>
        <div className="text-lg font-bold text-green-400">{stats.totalWatched}</div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">Minutes</span>
        </div>
        <div className="text-lg font-bold text-purple-400">{stats.totalWatchTime}</div>
      </div>
    </div>
  );
};

export default ProfileStatsComponent; 