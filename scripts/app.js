// Read CSV and render movies
async function loadMovies() {
  const response = await fetch('./data/movies.csv');
  const data = await response.text();

  // Parse CSV data
  const rows = data.split('\n').slice(1); // Remove header
  const movies = rows.map(row => {
      const [title, type, vibe, imdbLink, playLink, imageUrl] = row.split(',');
      return { title, type, vibe, imdbLink, playLink, imageUrl: imageUrl || 'https://via.placeholder.com/300x450?text=No+Image' };
  });

  // Group movies by vibe
  const groupedMovies = groupBy(movies, 'vibe');

  // Render playlists
  const container = document.getElementById('playlist-container');
  container.innerHTML = ''; // Clear the "Loading..." message

  Object.keys(groupedMovies).forEach(vibe => {
      const playlist = document.createElement('div');
      playlist.classList.add('playlist');

      const header = document.createElement('h2');
      header.textContent = `${vibe} Vibes`;
      playlist.appendChild(header);

      groupedMovies[vibe].forEach(movie => {
          const movieBox = document.createElement('div');
          movieBox.classList.add('movie-box');

          movieBox.innerHTML = `
              <img src="${movie.imageUrl}" alt="${movie.title}">
              <h2>${movie.title}</h2>
              <p>${movie.type}</p>
              <a href="${movie.imdbLink}" target="_blank" class="imdb-link">View on IMDb</a>
              <a href="${movie.playLink}" target="_blank" class="play-link">Play Online</a>
          `;

          playlist.appendChild(movieBox);
      });

      container.appendChild(playlist);
  });
}

// Utility to group by a key
function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
  }, {});
}

// Load movies on page load
loadMovies();
