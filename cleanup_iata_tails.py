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
tail_files = sorted([f for f in tail_dir.glob('*.png')])

print(f"Found {len(tail_files)} tail images\n")

# Categorize files
iata_files_to_delete = []
iata_files_to_keep = []
icao_files = []

for tail_file in tail_files:
    code = tail_file.stem  # Get filename without extension

    # Skip unknown.png
    if code == 'unknown':
        continue

    # Check if this is an IATA code with an ICAO equivalent
    if code in iata_to_icao:
        icao_equivalent = iata_to_icao[code]
        icao_file = tail_dir / f"{icao_equivalent}.png"

        if icao_file.exists():
            # ICAO version exists, mark IATA for deletion
            iata_files_to_delete.append((tail_file, code, icao_equivalent))
        else:
            # ICAO version doesn't exist, keep IATA
            iata_files_to_keep.append((tail_file, code, icao_equivalent))
    elif len(code) <= 2:
        # Looks like IATA but no mapping found
        iata_files_to_keep.append((tail_file, code, None))
    else:
        # Looks like ICAO code (3+ characters)
        icao_files.append(tail_file)

print(f"{'='*80}")
print(f"\nAnalysis:")
print(f"  ICAO codes (3+ chars): {len(icao_files)}")
print(f"  IATA codes with ICAO equivalent available: {len(iata_files_to_delete)}")
print(f"  IATA codes to keep (no ICAO equivalent): {len(iata_files_to_keep)}")

if iata_files_to_delete:
    print(f"\n{'='*80}")
    print(f"\nFiles to delete (IATA codes with ICAO equivalents):")
    for tail_file, iata, icao in iata_files_to_delete:
        print(f"  {iata}.png -> {icao}.png exists")

if iata_files_to_keep:
    print(f"\n{'='*80}")
    print(f"\nFiles to keep (IATA codes without ICAO equivalents):")
    for tail_file, iata, icao in iata_files_to_keep:
        if icao:
            print(f"  {iata}.png -> {icao}.png NOT found")
        else:
            print(f"  {iata}.png -> no ICAO mapping")

print(f"\n{'='*80}")

import sys
if len(sys.argv) > 1 and sys.argv[1] == '--delete':
    proceed = 'yes'
else:
    proceed = input(f"\nDelete {len(iata_files_to_delete)} IATA files? (yes/no): ").strip().lower()

if proceed == 'yes':
    deleted = 0
    for tail_file, iata, icao in iata_files_to_delete:
        try:
            tail_file.unlink()
            print(f"  Deleted: {iata}.png (ICAO equivalent: {icao}.png)")
            deleted += 1
        except Exception as e:
            print(f"  Error deleting {iata}.png: {e}")

    print(f"\n{'='*80}")
    print(f"\nDeleted {deleted} IATA tail files")
    print(f"Kept {len(iata_files_to_keep)} IATA files (no ICAO equivalent)")
    print(f"Total remaining: {len(icao_files) + len(iata_files_to_keep)} tail images")
else:
    print("\nNo files deleted.")
