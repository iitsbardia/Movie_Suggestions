// Reference the poster gallery container
const gallery = document.getElementById("poster-gallery");

// Path to the CSV file
const csvFilePath = "data/movies_list.csv";

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

            return { title, type, vibe };
        })
        .filter(movie => movie); // Remove null values
}

// Function to generate poster gallery
function generateGallery(movies) {
    gallery.innerHTML = ""; // Clear previous content
    movies.forEach(poster => {
        const posterPath = `assets/posters/${poster.type}/${poster.vibe}/${poster.title.replace(/ /g, "_")}.jpg`;

        // Create a wrapper div for the poster
        const posterDiv = document.createElement("div");
        posterDiv.className = "poster";

        // Create the image element
        const img = document.createElement("img");
        img.src = posterPath;
        img.alt = poster.title;
        img.loading = "lazy"; // Enable lazy loading

        // Add a fallback event in case the poster is missing
        img.onerror = () => {
            img.src = "assets/placeholder.jpg"; // Fallback image
            img.alt = "Image not available";
        };

        // Add a title caption
        const caption = document.createElement("p");
        caption.textContent = poster.title;

        // Append elements to the posterDiv
        posterDiv.appendChild(img);
        posterDiv.appendChild(caption);

        // Append the posterDiv to the gallery
        gallery.appendChild(posterDiv);
    });
}

// Function to filter movies by dropdown value
function filterByDropdown(movies) {
    const filterValue = document.getElementById("filter-type").value;

    // If "all" is selected, return all movies
    if (filterValue === "all") return movies;

    // Return filtered movies based on the dropdown value
    return movies.filter(movie => movie.type.toLowerCase() === filterValue);
}

// Fetch and process the CSV
fetch(csvFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        const movies = parseCSV(text);

        // Generate initial gallery
        generateGallery(movies);

        // Set up dropdown filter functionality
        const dropdown = document.getElementById("filter-type");
        dropdown.addEventListener("change", () => {
            const filteredMovies = filterByDropdown(movies);
            generateGallery(filteredMovies);
        });
    })
    .catch(error => console.error("Error loading CSV:", error));
