import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const MOVIES_PER_PAGE = 8;

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('title');

  // On mount, check localStorage and system preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      setDarkMode(stored === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Persist dark mode to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios({
      method: 'get',
      url: `https://jsonfakery.com/movies/paginated?page=${page}&limit=${MOVIES_PER_PAGE}`,
      responseType: 'json'
    })
      .then(function (response) {
        const data = response.data;
        const moviesArray = Array.isArray(data) ? data : data.data || [];
        setMovies(moviesArray);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
        if (moviesArray.length > 0) {
          console.log('Sample movie:', moviesArray[0]);
        }
      })
      .catch(function (err) {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  // Filter and sort movies
  let filteredMovies = movies.filter(
    movie => movie.original_title?.toLowerCase().includes(search.toLowerCase())
  );
  if (showFavorites) {
    filteredMovies = filteredMovies.filter(movie => favorites.includes(movie.id));
  }
  filteredMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'title') {
      return a.original_title.localeCompare(b.original_title);
    } else if (sortBy === 'rating') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    }
    return 0;
  });

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  const toggleFavorite = (id) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  return (
    <div className={darkMode ? 'dark min-h-screen bg-gray-900' : 'min-h-screen bg-gray-100'}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-center dark:text-white">Movie Database</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDarkMode(dm => !dm)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white text-gray-800 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center gap-2"
              aria-label="Toggle dark mode"
            >
              <span className="inline-block transition-transform duration-300">
                {darkMode ? (
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.22 6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-6.78-2.22a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 10a1 1 0 100 2H3a1 1 0 100-2h1zm2.22-6.78a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                )}
              </span>
              <span className="hidden sm:inline">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <button
              onClick={() => setShowFavorites(f => !f)}
              className={`px-4 py-2 rounded font-semibold shadow transition ${showFavorites ? 'bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
            >
              {showFavorites ? '★ Favorites' : '☆ Favorites'}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center text-xl dark:text-white">Loading movies...</div>
          ) : error ? (
            <div className="col-span-full flex justify-center items-center text-red-500 text-xl">Error: {error}</div>
          ) : filteredMovies.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">No movies found.</div>
          ) : (
            filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                title={movie.original_title}
                genre={'N/A'}
                year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                rating={movie.vote_average || 'N/A'}
                image={movie.poster_path}
                description={movie.overview}
                isFavorite={favorites.includes(movie.id)}
                onFavorite={() => toggleFavorite(movie.id)}
                onClick={() => setModalMovie(movie)}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Previous
            </button>
            <span className="text-lg dark:text-white">Page {page} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 dark:disabled:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Next
            </button>
          </div>
        )}
        {/* Movie Modal */}
        {modalMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-lg w-full relative animate-fade-in">
              <button
                onClick={() => setModalMovie(null)}
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500 text-2xl font-bold focus:outline-none"
                aria-label="Close modal"
              >
                ×
              </button>
              {modalMovie.poster_path && (
                <img src={modalMovie.poster_path} alt={modalMovie.original_title} className="w-full h-80 object-cover rounded mb-4" />
              )}
              <h2 className="text-2xl font-bold mb-2 dark:text-white">{modalMovie.original_title}</h2>
              <div className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-semibold">Year:</span> {modalMovie.release_date ? modalMovie.release_date.split('-')[0] : 'N/A'}</div>
              <div className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-semibold">Rating:</span> {modalMovie.vote_average || 'N/A'}</div>
              <div className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-semibold">Language:</span> {modalMovie.original_language}</div>
              <div className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-semibold">Overview:</span> {modalMovie.overview || 'No description available.'}</div>
              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(modalMovie.original_title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View on IMDb
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
