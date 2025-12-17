#!/usr/bin/env python3
import re
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time

def get_static_image_url(flickr_page_url):
    """Scrape the static image URL from a Flickr page"""
    try:
        print(f"Fetching: {flickr_page_url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(flickr_page_url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Try to find the image URL in meta tags (og:image)
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            img_url = og_image['content']
            print(f"  Found: {img_url}")
            return img_url

        # Try to find in the main image element
        main_img = soup.find('img', class_='main-photo')
        if main_img and main_img.get('src'):
            img_url = main_img['src']
            print(f"  Found: {img_url}")
            return img_url

        # Try looking for any image with live.staticflickr.com
        img_tag = soup.find('img', src=re.compile(r'live\.staticflickr\.com'))
        if img_tag and img_tag.get('src'):
            img_url = img_tag['src']
            print(f"  Found: {img_url}")
            return img_url

        print(f"  WARNING: Could not find image URL for {flickr_page_url}")
        return None

    except Exception as e:
        print(f"  ERROR: {e}")
        return None

def process_markdown_file(file_path):
    """Process a markdown file and replace Flickr page URLs with static image URLs"""
    print(f"\nProcessing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all Flickr URLs in markdown image syntax
    pattern = r'!\[\]\((https://www\.flickr\.com/photos/[^)]+)\)'
    matches = re.findall(pattern, content)

    if not matches:
        print(f"  No Flickr URLs found")
        return

    print(f"  Found {len(matches)} Flickr URLs")

    replacements = {}
    for flickr_url in matches:
        if flickr_url not in replacements:
            static_url = get_static_image_url(flickr_url)
            if static_url:
                replacements[flickr_url] = static_url
            time.sleep(0.5)  # Be nice to Flickr's servers

    # Replace URLs in content
    new_content = content
    for old_url, new_url in replacements.items():
        new_content = new_content.replace(f'![]({old_url})', f'![]({new_url})')

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  Replaced {len(replacements)} URLs")

def main():
    trips_dir = Path('posts/trips')

    # Process all markdown files
    md_files = [
        'albania-2024.md',
        'cyprus-2024.md',
        'jordan-2025.md',
        'kosovo-2024.md',
        'kuwait-2025.md',
        'saudi-arabia-2025.md',
        'ukraine-2024.md',
        'uzbekistan-2025.md',
        'aland-2025.md'
    ]

    for md_file in md_files:
        file_path = trips_dir / md_file
        if file_path.exists():
            process_markdown_file(file_path)
        else:
            print(f"File not found: {file_path}")

    print("\nDone!")

if __name__ == '__main__':
    main()
