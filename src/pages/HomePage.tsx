import React from 'react';
import SpotlightCarousel from '../components/SpotlightCarousel';
import MovieSection from '../components/MovieSection';
import { spotlightMovies } from '../data/spotlightMovies';
import { getDoraemonMovies, getShinchanMovies, getDetectiveConanMovies, getPokemonMovies, getAnimeMovies, getDigimonMovies, getAllMovies } from '../data/Data';

const HomePage: React.FC = () => {
  const allMovies = getAllMovies();
  const doraemonMovies = getDoraemonMovies();
  const shinchanMovies = getShinchanMovies();
  const detectiveConanMovies = getDetectiveConanMovies();
  const pokemonMovies = getPokemonMovies();
  const animeMovies = getAnimeMovies();
  const digimonMovies = getDigimonMovies();
  
  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Shuffle anime movies for random display
  const shuffledAnimeMovies = shuffleArray(animeMovies);
  const newReleases = allMovies
    .filter(movie => movie.isNew)
    .slice(0, 8);
  const popularMovies = allMovies
    .filter(movie => parseFloat(movie.rating) > 8)
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));


  return (
    <div className="min-h-screen bg-black">
      {/* Spotlight Section */}
      <SpotlightCarousel movies={spotlightMovies} />
      
      {/* Movie Sections */}
      <div className="relative z-10 pt-2">
        <MovieSection title="New Releases" movies={newReleases} size="medium" />
        <MovieSection title="Popular Movies" movies={popularMovies} size="medium" />
        <MovieSection title="Doraemon Collection" movies={doraemonMovies} size="medium" />
        <MovieSection title="Shin-chan Collection" movies={shinchanMovies} size="medium" />
        <MovieSection title="Detective Conan Collection" movies={detectiveConanMovies} size="medium" />
        <MovieSection title="Pokemon Collection" movies={pokemonMovies} size="medium" />
        <MovieSection title="Digimon Collection" movies={digimonMovies} size="medium" />
        <MovieSection title="Anime Movies Collection" movies={shuffledAnimeMovies} size="medium" />
      </div>
    </div>
  );
};

export default HomePage;