// Path to the CSV file
const csvFilePath = "./data/movies_list.csv";

// IMDb logo URL
const imdbLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg";

// Global variables
let allMovies = []; // Store all parsed movies
let filteredMovies = []; // Store currently filtered movies

// Function to parse CSV into an array of objects
function parseCSV(text) {
    const rows = text.split("\n").slice(1); // Skip the header row
    return rows
        .map(row => {
            const columns = row.split(",");
            if (columns.length < 3) {
                console.warn(`Skipping malformed row: ${row}`);
                return null;
            }

            const [title, type, vibe] = columns.map(col => col.trim());
            if (!title || !type || !vibe) {
                console.warn(`Skipping incomplete row: ${row}`);
                return null;
            }

            return { title, type, vibe }; // Return as an object
        })
        .filter(movie => movie); // Remove null values
}

// Function to fetch movie or show details from OMDb API
async function fetchDetails(title, type) {
    const baseUrl = `http://www.omdbapi.com/`; // OMDb base URL
    const apiKey = "8df771d"; // Replace with your valid OMDb API key

    try {
        const response = await fetch(`${baseUrl}?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for ${title}`);
        }

        const data = await response.json();

        if (data.Response === "True") {
            return {
                title: data.Title || title,
                released: new Date(data.Released) || new Date(0), // Use release date or epoch as fallback
                director: data.Director || (type === "Movie" ? "Unknown" : null),
                totalSeasons: data.totalSeasons || (type === "TV Show" ? "Unknown" : null),
                poster: data.Poster !== "N/A" ? data.Poster : "assets/placeholder.jpg",
                imdbRating: parseFloat(data.imdbRating) || 0,
                genre: data.Genre || "Unknown",
                plot: data.Plot || "No description available.",
                type: type,
                vibe: type,
            };
        } else {
            console.warn(`No data found for ${title}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching details for ${title}:`, error);
        return null;
    }
}

// Function to generate a gallery of movies/shows
function generateGallery(movies) {
    const gallery = document.getElementById("poster-gallery");
    gallery.innerHTML = ""; // Clear existing content

    if (!movies || movies.length === 0) {
        gallery.innerHTML = "<p>No results found.</p>";
        return;
    }

    movies.forEach(details => {
        const posterDiv = document.createElement("div");
        posterDiv.className = "poster";

        const img = document.createElement("img");
        img.src = details.poster;
        img.alt = details.title;

        const titleElem = document.createElement("h3");
        titleElem.textContent = details.title;

        const releaseDateElem = document.createElement("p");
        releaseDateElem.textContent = `Released: ${details.released.getFullYear()}`;


        const imdbElem = document.createElement("p");
        imdbElem.innerHTML = `
            <img src="${imdbLogoUrl}" alt="IMDb" style="width: 40px; vertical-align: middle; margin-right: 5px;">
            <strong>${details.imdbRating}</strong>
        `;

        const extraInfoElem = document.createElement("p");
        extraInfoElem.textContent = details.type === "Movie"
            ? `Director: ${details.director}`
            : `Seasons: ${details.totalSeasons}`;

        posterDiv.addEventListener("click", () => showDetailsPage(details));

        posterDiv.appendChild(img);
        posterDiv.appendChild(titleElem);
        posterDiv.appendChild(releaseDateElem);
        posterDiv.appendChild(imdbElem);
        posterDiv.appendChild(extraInfoElem);

        gallery.appendChild(posterDiv);
    });
}

// Function to display a detailed page
function showDetailsPage(details) {
    const body = document.body;
    body.innerHTML = `
        <div class="details-page">
            <button id="back-button">Back</button>
            <div class="details-content">
                <img src="${details.poster}" alt="${details.title}">
                <h1>${details.title}</h1>
                <p><strong>Released:</strong> ${details.released.toDateString()}</p>
                <p><strong>Director:</strong> ${details.director}</p>
                <p><strong>Genre:</strong> ${details.genre}</p>
                <p><strong>IMDb Rating:</strong> ${details.imdbRating}</p>
                <p><strong>Plot:</strong> ${details.plot}</p>
            </div>
        </div>
    `;

    document.getElementById("back-button").addEventListener("click", () => location.reload());
}

// Function to filter movies by type
function filterMovies(type) {
    if (type === "All") {
        filteredMovies = allMovies;
    } else {
        filteredMovies = allMovies.filter(movie => movie.type === type);
    }
    sortMovies("random"); // Default to random sorting when filtering
}

// Function to sort movies by selected criteria
function sortMovies(order = "random") {
    if (order === "random") {
        filteredMovies.sort(() => Math.random() - 0.5); // Randomize array
    } else if (order === "imdb") {
        filteredMovies.sort((a, b) => b.imdbRating - a.imdbRating);
    } else if (order === "release") {
        filteredMovies.sort((a, b) => b.released - a.released);
    }
    generateGallery(filteredMovies);
}

// Fetch and process the CSV
async function init() {
    const response = await fetch(csvFilePath);
    const text = await response.text();
    const movies = parseCSV(text);

    allMovies = await Promise.all(
        movies.map(movie => fetchDetails(movie.title, movie.type))
    ).then(results => results.filter(details => details));

    filteredMovies = [...allMovies];
    sortMovies("random"); // Initial render sorted by random

    generateGallery(filteredMovies);

    document.getElementById("filter-select").addEventListener("change", e => filterMovies(e.target.value));
    document.getElementById("sort-select").addEventListener("change", e => sortMovies(e.target.value));
}

init().catch(error => console.error("Initialization error:", error));
