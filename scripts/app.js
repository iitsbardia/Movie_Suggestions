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

            const [title, type, vibe] = columns;
            if (!title || !type || !vibe) {
                console.warn(`Skipping incomplete row: ${row}`);
                return null;
            }

            return {
                title: title.trim(),
                type: type.trim(),
                vibe: vibe.trim(),
            };
        })
        .filter(movie => movie); // Remove null values
}

// Function to generate poster gallery
function generateGallery(movies) {
    movies.forEach((poster) => {
        const posterPath = `assets/posters/${poster.type}/${poster.vibe}/${poster.title.replace(/ /g, "_")}.jpg`;

        // Create the image element
        const img = document.createElement("img");
        img.src = posterPath;
        img.alt = poster.title;

        // Add a fallback event in case the poster is missing
        img.onerror = () => {
            img.src = "assets/default.jpg"; // Path to a default placeholder image
            img.alt = "Poster not found";
        };

        // Append the image to the gallery
        gallery.appendChild(img);
    });
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
        generateGallery(movies);
    })
    .catch(error => console.error("Error loading CSV:", error));
