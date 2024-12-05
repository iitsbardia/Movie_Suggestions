# Movie & TV Playlists

A lightweight web app for organizing and browsing movie and TV show recommendations by vibes and categories. The data is stored locally in a CSV file, making it easy to add or update playlists.

---

## Features

- **Dynamic Playlists**: Organizes movies and TV shows into playlists based on their vibe or category.
- **Local Data**: Uses a CSV file for storing data, so you can easily update or modify playlists without changing the code.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **Quick Access**: Links to IMDb for details and a "Play Online" button for streaming (URLs to be added manually).

---

## Repository Structure

```movie-suggestions/ │ ├── index.html # Main HTML file ├── styles/ │ └── styles.css # CSS file(s) for styling ├── scripts/ │ └── app.js # JavaScript for dynamic functionality ├── data/ │ └── movies.csv # CSV file with movie/show data ├── assets/ │ ├── images/ # Folder for downloaded images │ └── icons/ # Folder for icons (optional) ├── utils/ │ ├── fetch_images.py # Python script for fetching and saving images │ └── .env # Environment file for sensitive keys ├── README.md # Documentation about the project └── LICENSE # Optional: License for your project

```yaml

---

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/iitsbardia/movie_suggestions.git
   cd movie-suggestions
Open index.html in your browser to view the app.

To Add Movies or Shows:

Open the data/movies.csv file.
Add a new row with the format:
csv
title,type,vibe,imdb_link,play_link,image_url
(Optional) Host the project on a platform like GitHub Pages for public access.

Python Script: Fetch Images
The fetch_images.py script in the utils/ folder is designed to:

Read movie/show data from data/movies.csv.
Fetch poster images from the OMDb API.
Save the images locally in the assets/images/ folder.
Update the CSV file with local image paths.
Setup for Fetch Images Script
Install the dependencies:

bash
pip install requests pandas python-dotenv
Create a .env file in the utils/ folder:

makefile
OMDB_API_KEY=your_api_key_here
Run the script:

bash
python utils/fetch_images.py
Note: The script is still under development and may require debugging for full functionality.

Example CSV Data
Here’s an example of how movies.csv should look:

csv
title,type,vibe,imdb_link,play_link,image_url
The Big Short,movie,finance,"https://www.imdb.com/title/tt1596363/","#","https://image-url.com/the-big-short.jpg"
Lie to Me,tv show,detective,"https://www.imdb.com/title/tt1235099/","#","https://image-url.com/lie-to-me.jpg"
Knives Out,movie,mystery,"https://www.imdb.com/title/tt8946378/","#","https://image-url.com/knives-out.jpg"
Contributing
Fork the repository.
Create a new branch:
bash
git checkout -b feature-name
Commit your changes:
bash
git commit -m "Add a new feature"
Push to the branch:
bash
git push origin feature-name
Open a pull request.
