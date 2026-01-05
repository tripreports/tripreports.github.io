import json
import os
import requests
import time
from pathlib import Path

# Load airlines data
with open('data/airlines.json', 'r', encoding='utf-8') as f:
    airlines = json.load(f)

print(f"Loaded {len(airlines)} airlines\n")

# Create logos directory
logos_dir = Path('images/logos')
logos_dir.mkdir(parents=True, exist_ok=True)

# Collect all unique ICAO codes
icao_codes = set()
for airline in airlines:
    icao = airline.get('ICAO')
    if icao:
        icao_codes.add(icao)

print(f"Found {len(icao_codes)} unique ICAO codes\n")

# Download logos
downloaded = 0
skipped = 0
failed = 0

for i, icao in enumerate(sorted(icao_codes), 1):
    logo_path = logos_dir / f"{icao}.png"

    # Skip if already exists
    if logo_path.exists():
        skipped += 1
        if i % 50 == 0:
            print(f"Progress: {i}/{len(icao_codes)} - Downloaded: {downloaded}, Skipped: {skipped}, Failed: {failed}")
        continue

    url = f"https://www.avcodes.co.uk/images/logos/{icao}.png"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            # Check if it's actually an image (not a 404 page)
            content_type = response.headers.get('content-type', '')
            if 'image' in content_type:
                with open(logo_path, 'wb') as f:
                    f.write(response.content)
                downloaded += 1
                print(f"  Downloaded: {icao}")
            else:
                failed += 1
                if i % 50 == 0:
                    print(f"  Not found: {icao}")
        else:
            failed += 1
            if i % 50 == 0:
                print(f"  Failed {icao}: HTTP {response.status_code}")

        # Progress update every 50 logos
        if i % 50 == 0:
            print(f"Progress: {i}/{len(icao_codes)} - Downloaded: {downloaded}, Skipped: {skipped}, Failed: {failed}")

        # Be nice to the server
        time.sleep(0.5)

    except Exception as e:
        failed += 1
        print(f"  Error {icao}: {e}")

print(f"\n{'='*80}")
print(f"\nFinal Summary:")
print(f"  Total ICAO codes: {len(icao_codes)}")
print(f"  Downloaded: {downloaded}")
print(f"  Skipped (already exists): {skipped}")
print(f"  Failed: {failed}")
print(f"\nLogos saved to: {logos_dir.absolute()}")
