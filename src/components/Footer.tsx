import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 md:py-12 mobile-footer mobile-safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mobile-footer-grid">
          {/* Brand */}
          <div className="col-span-1 mobile-footer-brand">
            <div className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              <span className="text-blue-500">Project</span>Z
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for anime movies and series. Stream your favorite shows anytime, anywhere.
            </p>
            <p className="text-gray-400 text-xs mt-2">
                    We do not store any content on our platform. We only index videos from third-party sources.
            </p>
          </div>
            
          {/* Quick Links */}
          <div className="mobile-footer-section">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 mobile-footer-title">Quick Links</h3>
            <ul className="space-y-2 text-sm mobile-footer-links">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Home</a></li>
              <li><a href="/search" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Movies</a></li>
              <li><a href="/tvshows" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">TV Shows</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">My List</a></li>
            </ul>
          </div>
            
          {/* Categories */}
          <div className="mobile-footer-section">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 mobile-footer-title">Categories</h3>
            <ul className="space-y-2 text-sm mobile-footer-links">
              <li><a href="/search?genre=Adventure" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Doraemon</a></li>
              <li><a href="/search?genre=Comedy" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Shin-chan</a></li>
              <li><a href="/tvshows" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">TV Shows</a></li>
              <li><a href="/search?sortBy=newest" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">New Releases</a></li>
            </ul>
          </div>
            
          {/* Social & Support */}
          <div className="mobile-footer-section">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 mobile-footer-title">Connect</h3>
            <div className="flex space-x-4 mb-4 mobile-footer-social">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <ul className="space-y-2 text-sm mobile-footer-links">
              <li><a href="/dmca" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">DMCA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 mobile-touch-target">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 ProjectZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;