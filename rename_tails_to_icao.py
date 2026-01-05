import json
import os
from pathlib import Path

# Load airlines data and IATA->ICAO mapping
with open('data/airlines.json', 'r', encoding='utf-8') as f:
    airlines = json.load(f)

with open('data/iata_to_icao_mapping.json', 'r', encoding='utf-8') as f:
    iata_to_icao = json.load(f)

print(f"Loaded {len(airlines)} airlines")
print(f"Loaded {len(iata_to_icao)} IATA->ICAO mappings\n")

# Get tail files
tail_dir = Path('images/tails')
tail_files = sorted([f.name for f in tail_dir.glob('*.png')])

print(f"Found {len(tail_files)} tail images\n")

# Rename IATA files to ICAO
renamed = 0
skipped_already_icao = 0
skipped_no_mapping = 0

for filename in tail_files:
    code = filename[:-4]  # Remove .png extension

    # Skip unknown.png
    if code == 'unknown':
        continue

    # Check if this is an IATA code with ICAO mapping
    if code in iata_to_icao:
        icao = iata_to_icao[code]
        old_path = tail_dir / filename
        new_path = tail_dir / f"{icao}.png"

        if not new_path.exists():
            os.rename(old_path, new_path)
            print(f"  Renamed: {code} -> {icao}")
            renamed += 1
        else:
            print(f"  Skipped: {code} (ICAO file {icao}.png already exists)")
            skipped_already_icao += 1
    elif len(code) <= 2:
        # Looks like IATA but no mapping
        skipped_no_mapping += 1
    else:
        # Already ICAO (3+ characters)
        skipped_already_icao += 1

print(f"\n{'='*80}")
print(f"\nSummary:")
print(f"  Renamed: {renamed}")
print(f"  Skipped (already ICAO or ICAO exists): {skipped_already_icao}")
print(f"  Skipped (IATA without mapping): {skipped_no_mapping}")
