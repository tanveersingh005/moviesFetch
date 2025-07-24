import React from 'react';

function MovieCard({ title, genre, year, rating, image, description, isFavorite, onFavorite, onClick, darkMode }) {
  // Convert genre string to array for chips
  const genreList = genre && genre !== 'N/A' ? genre.split(',').map(g => g.trim()) : [];

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center transition-all duration-300 min-h-[500px] h-full cursor-pointer focus:ring-2 focus:ring-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl relative group"
      tabIndex={0}
      onClick={onClick}
      aria-label={`View details for ${title}`}
      role="button"
    >
      <button
        onClick={e => { e.stopPropagation(); onFavorite && onFavorite(); }}
        className="absolute top-3 right-3 z-10 text-2xl focus:outline-none"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        tabIndex={0}
      >
        {isFavorite ? (
          <span className="text-red-500 drop-shadow">♥</span>
        ) : (
          <span className={darkMode ? 'text-gray-400' : 'text-gray-300'}>♡</span>
        )}
      </button>
      <div className="w-full flex justify-center mb-4">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300"
            onError={e => (e.target.style.display = 'none')}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-4xl">
            No Image
          </div>
        )}
      </div>
      <div className="font-extrabold text-xl text-center mb-2 text-gray-900 dark:text-white line-clamp-2 transition-colors duration-300">{title}</div>
      <div className="text-gray-600 dark:text-gray-300 text-center mb-2 text-sm italic line-clamp-3 transition-colors duration-300">{description || 'No description available.'}</div>
      <div className="flex flex-col gap-1 mt-auto w-full">
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <span className="font-semibold">Year:</span>
          <span className="ml-2">{year}</span>
        </div>
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <span className="font-semibold">Genre:</span>
          <span className="ml-2 flex flex-wrap gap-1">
            {genreList.length > 0 ? (
              genreList.map((g, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm transition-colors duration-300"
                >
                  {g}
                </span>
              ))
            ) : (
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm transition-colors duration-300">N/A</span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-400 font-bold mt-2 transition-colors duration-300">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            Rating:
          </span>
          <span className="ml-2">{rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard; 