import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-2xl font-bold mb-4">
              <span className="text-blue-500">Project</span>Z
            </div>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for anime movies and series. Stream your favorite shows anytime, anywhere.
            </p>
                              <p className="text-gray-400 text-xs mt-2">
                    We do not store any content on our platform. We only index videos from third-party sources.
                  </p>
                </div>
            
                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Movies</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Series</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">My List</a></li>
                  </ul>
                </div>
            
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Doraemon</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Shin-chan</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pokemon</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">New Releases</a></li>
                  </ul>
                </div>
            
                {/* Social & Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <div className="flex space-x-4 mb-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/dmca" className="text-gray-400 hover:text-white transition-colors duration-200">DMCA</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
                  </ul>
                </div>
              </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 ProjectZ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;