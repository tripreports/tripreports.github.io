#!/usr/bin/env python3
import re
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time

def get_wordpress_image_url(wordpress_url):
    """Get the actual image URL from a WordPress image URL"""
    # WordPress URLs often have query parameters like ?w=1024
    # We want to get the full resolution image by removing the query params
    # The URL format is typically: https://domain/wp-content/uploads/YYYY/MM/filename.jpeg?w=size

    # Remove query parameters to get full resolution
    clean_url = wordpress_url.split('?')[0]

    print(f"  WordPress URL: {wordpress_url}")
    print(f"  Clean URL: {clean_url}")

    return clean_url

def process_markdown_file(file_path):
    """Process a markdown file and replace WordPress URLs with clean URLs"""
    print(f"\nProcessing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all WordPress URLs in markdown image syntax
    pattern = r'!\[\]\((https://yetanothertravelblog8\.wordpress\.com/[^)]+)\)'
    matches = re.findall(pattern, content)

    if not matches:
        print(f"  No WordPress URLs found")
        return

    print(f"  Found {len(matches)} WordPress URLs")

    replacements = {}
    for wordpress_url in matches:
        if wordpress_url not in replacements:
            clean_url = get_wordpress_image_url(wordpress_url)
            replacements[wordpress_url] = clean_url

    # Replace URLs in content
    new_content = content
    for old_url, new_url in replacements.items():
        new_content = new_content.replace(f'![]({old_url})', f'![]({new_url})')

    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  Replaced {len(replacements)} URLs")

def main():
    flights_dir = Path('posts/flights')

    # Process all markdown files with WordPress URLs
    md_files = [
        'at217-at218-business-class-review.md',
        'br315-business-class-review.md',
        'br721-business-class-review.md',
        'ci7-business-class-review.md',
        'gf124-business-class-review.md',
        'lh456-first-class-and-fct-review.md',
        'lx38-business-class-review.md',
        'qr67-qsuites-review.md',
        'qr742-qsuites-review.md',
        'qr782-qsuites-review.md',
        'qr845-business-class-review.md'
    ]

    for md_file in md_files:
        file_path = flights_dir / md_file
        if file_path.exists():
            process_markdown_file(file_path)
        else:
            print(f"File not found: {file_path}")

    print("\nDone!")

if __name__ == '__main__':
    main()
