import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './components/ProfilePage';
import TVShowsPage from './pages/TVShowsPage';
import TVShowDetailPage from './pages/TVShowDetailPage';
import TVShowWatchPage from './pages/TVShowWatchPage';
import DMCAPage from './pages/DMCAPage';
import Loader from './components/Loader';

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-black">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tvshows" element={<TVShowsPage />} />
          <Route path="/tvshow/:id" element={<TVShowDetailPage />} />
          <Route path="/tvshow/:showId/episode/:episodeNumber" element={<TVShowWatchPage />} />
          <Route path="/dmca" element={<DMCAPage />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;