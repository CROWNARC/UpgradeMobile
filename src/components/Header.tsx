import React, { useState } from 'react';
import { Menu, X, Home, Film, Bell, User, Monitor, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

const initialNotifications = [
  { id: 'notif-1', message: 'All Doraemon movies added', read: false },
  { id: 'notif-2', message: 'Shinchan movies will be added soon', read: false },
];

const Header: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = notifications.filter(n => !n.read).length;

  // Full reload navigation
  const reloadNavigate = (url: string) => {
    window.location.href = url;
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu Button */}
          <div className="flex items-center relative">
            <button
              className="p-2 text-gray-200 hover:text-white transition-colors duration-200 rounded-full bg-black/50 backdrop-blur-md shadow-lg border border-white/10"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7" />
            </button>
            {/* Dropdown Panel */}
            {menuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50 animate-fade-in">
                <button
                  onClick={() => reloadNavigate('/')}
                  className={`flex items-center space-x-3 w-full px-5 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-800/80'}`}
                >
                  <Home className="w-6 h-6" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => reloadNavigate('/search')}
                  className={`flex items-center space-x-3 w-full px-5 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${isActive('/search') ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-800/80'}`}
                >
                  <Film className="w-6 h-6" />
                  <span>Movies</span>
                </button>
                <button
                  onClick={() => reloadNavigate('/tvshows')}
                  className={`flex items-center space-x-3 w-full px-5 py-3 text-lg font-semibold rounded-lg transition-colors duration-200 ${isActive('/tvshows') ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-800/80'}`}
                >
                  <Monitor className="w-6 h-6" />
                  <span>TV Shows</span>
                </button>
              </div>
            )}
          </div>

          {/* Center: (empty for now, no logo) */}
          <div className="flex-1" />

          {/* Right: SearchBar, Notification, Account */}
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-1 shadow-lg relative">
            <div className="w-48 md:w-64">
              <SearchBar 
                placeholder="Search movies & TV shows..."
                showSuggestions={true}
              />
            </div>
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-2 text-gray-200 hover:text-white transition-colors duration-200 rounded-full relative"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border-2 border-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-4 pb-2">
                    <span className="text-white font-semibold text-lg">Notifications</span>
                    <button
                      className="text-blue-400 hover:underline text-sm"
                      onClick={markAllRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-gray-400 px-4 py-6 text-center">No notifications</div>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`flex items-center px-4 py-3 gap-3 ${n.read ? 'opacity-60' : ''}`}>
                        <CheckCircle className={`w-5 h-5 ${n.read ? 'text-green-400' : 'text-blue-400'}`} />
                        <span className="text-white flex-1">{n.message}</span>
                        {!n.read && (
                          <button
                            className="text-xs text-blue-400 hover:underline"
                            onClick={() => setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="p-2 text-gray-200 hover:text-white transition-colors duration-200 rounded-full"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Dropdown fade-in animation */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Click outside to close */}
      {(menuOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
};

export default Header;