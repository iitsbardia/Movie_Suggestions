import os
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
CSV_FILE = "../data/movies.csv"  # Path to your CSV file
IMAGES_DIR = "../assets/images"  # Directory to save images
OMDB_API_KEY = os.getenv("OMDB_API_KEY")  # Load API key from .env
PLACEHOLDER_IMAGE = "https://via.placeholder.com/200x300?text=No+Image"  # Fallback image URL

if not OMDB_API_KEY:
    raise ValueError("OMDB_API_KEY is not set in the .env file.")

# Create the images directory if it doesn't exist
os.makedirs(IMAGES_DIR, exist_ok=True)

def fetch_image_url(title):
    """
    Fetch the image URL for a movie or TV show from OMDb API.
    """
    try:
        response = requests.get(f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}")
        data = response.json()
        if data.get("Response") == "True" and data.get("Poster") and data["Poster"] != "N/A":
            return data["Poster"]
        else:
            return PLACEHOLDER_IMAGE
    except Exception as e:
        print(f"Error fetching image for '{title}': {e}")
        return PLACEHOLDER_IMAGE

def download_image(url, filename):
    """
    Download an image from a URL and save it locally.
    """
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filename, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Downloaded: {filename}")
        else:
            print(f"Failed to download image from {url}")
    except Exception as e:
        print(f"Error downloading image: {e}")

def process_csv():
    """
    Process the CSV file, fetch image URLs, and download images.
    """
    # Load the CSV file
    df = pd.read_csv(CSV_FILE)
    
    # Add a new column for local image paths
    if "image_path" not in df.columns:
        df["image_path"] = ""

    # Iterate through each row and fetch/download images
    for index, row in df.iterrows():
        title = row["title"]
        image_url = row["image_url"] if pd.notna(row.get("image_url")) else fetch_image_url(title)
        
        # Generate local filename
        safe_title = "".join(c for c in title if c.isalnum() or c in " ._-").replace(" ", "_")
        local_image_path = os.path.join(IMAGES_DIR, f"{safe_title}.jpg")
        
        # Download the image if not already downloaded
        if not os.path.exists(local_image_path):
            download_image(image_url, local_image_path)
        
        # Update the CSV file with the local image path
        df.at[index, "image_path"] = local_image_path

    # Save the updated CSV file
    df.to_csv(CSV_FILE, index=False)
    print("CSV file updated with local image paths.")

if __name__ == "__main__":
    process_csv()
