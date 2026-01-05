import json
import os

# Load list of available tail images
available_tails = set()
tail_dir = 'images/tails'
if os.path.exists(tail_dir):
    for filename in os.listdir(tail_dir):
        if filename.endswith('.png'):
            tail_code = filename[:-4]  # Remove .png extension
            available_tails.add(tail_code)
    print(f"Loaded {len(available_tails)} available tail images")
else:
    print(f"Warning: Tail images directory not found at {tail_dir}")

# Load airlines data
with open('data/airlines.json', 'r', encoding='utf-8') as f:
    airlines = json.load(f)

# Create IATA -> ICAO mapping
iata_to_icao = {}
duplicates_resolved = 0
duplicates_skipped = 0

for airline in airlines:
    iata = airline.get('IATA')
    icao = airline.get('ICAO')

    if iata and icao:
        # If IATA already exists, check which one has a tail image
        if iata in iata_to_icao:
            existing_icao = iata_to_icao[iata]
            existing_has_tail = existing_icao in available_tails
            new_has_tail = icao in available_tails

            # Prefer the one with a tail image
            if new_has_tail and not existing_has_tail:
                print(f"  IATA={iata}: Replacing {existing_icao} (no tail) with {icao} (has tail)")
                iata_to_icao[iata] = icao
                duplicates_resolved += 1
            elif existing_has_tail and not new_has_tail:
                # Keep existing, it has a tail
                duplicates_skipped += 1
            else:
                # Both have tails or neither have tails - keep first
                duplicates_skipped += 1
        else:
            iata_to_icao[iata] = icao

print(f"\nCreated {len(iata_to_icao)} IATA -> ICAO mappings")
print(f"  Resolved {duplicates_resolved} duplicate(s) by preferring tail availability")
print(f"  Kept first occurrence for {duplicates_skipped} duplicate(s)")

# Save to file
with open('data/iata_to_icao_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(iata_to_icao, f, indent=2, ensure_ascii=False)

print(f"\nSaved to data/iata_to_icao_mapping.json")
