import os
import csv
import requests
from imdb import IMDb

def download_image(url, save_path):
    """Download an image from a URL and save it to a specified path."""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(save_path, 'wb') as out_file:
            for chunk in response.iter_content(chunk_size=8192):
                out_file.write(chunk)
        print(f"Downloaded poster to {save_path}")
    except Exception as e:
        print(f"Failed to download image from {url}: {e}")

def fetch_and_save_poster(title, media_type, vibe, save_dir):
    """Fetch the poster URL for a given title and save the image."""
    ia = IMDb()
    search_results = ia.search_movie(title)
    if not search_results:
        print(f"No results found for {title}")
        return

    # Assume the first result is the most relevant
    movie = search_results[0]
    ia.update(movie)
    if 'cover url' in movie:
        poster_url = movie['cover url']
        # Create directory structure
        directory = os.path.join(save_dir, media_type, vibe)
        os.makedirs(directory, exist_ok=True)
        # Define the path to save the poster
        poster_path = os.path.join(directory, f"{title.replace(' ', '_')}.jpg")
        # Download and save the poster
        download_image(poster_url, poster_path)
    else:
        print(f"No poster found for {title}")

def main(csv_file, save_dir):
    """Read the CSV file and process each entry."""
    with open(csv_file, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            title = row['title']
            media_type = row['type']
            vibe = row['vibe']
            fetch_and_save_poster(title, media_type, vibe, save_dir)

if __name__ == "__main__":
    # Absolute paths for CSV file and save directory
    csv_file = '/Users/bardi/Desktop/movie-suggestions/data/movies_list.csv'
    save_dir = '/Users/bardi/Desktop/movie-suggestions/assets/posters'
    main(csv_file, save_dir)
