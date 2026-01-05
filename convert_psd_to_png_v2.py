from psd_tools import PSDImage
from pathlib import Path
import os

# Source and destination directories
source_dir = Path(r'C:\tripreports\website_tools\downloads')
dest_dir = Path(r'C:\tripreports\website_tools\downloads\png')

# Create destination directory if it doesn't exist
dest_dir.mkdir(parents=True, exist_ok=True)

# Find all PSD files
psd_files = sorted(source_dir.glob('*.psd'))

print(f"Found {len(psd_files)} PSD files to convert\n")

converted = 0
failed = 0
skipped = 0

for psd_file in psd_files:
    try:
        # Create output filename
        png_file = dest_dir / f"{psd_file.stem}.png"

        # Skip if PNG already exists
        if png_file.exists():
            print(f"  Skipped: {psd_file.name} (PNG already exists)")
            skipped += 1
            continue

        # Open PSD file
        psd = PSDImage.open(psd_file)

        # Composite the image (merge all layers)
        image = psd.composite()

        # Save as PNG
        image.save(png_file, 'PNG')
        print(f"  Converted: {psd_file.name}")
        converted += 1

    except Exception as e:
        print(f"  FAILED: {psd_file.name} - {str(e)[:80]}")
        failed += 1

print(f"\n{'='*80}")
print(f"\nConversion Summary:")
print(f"  Converted: {converted}")
print(f"  Skipped (already exists): {skipped}")
print(f"  Failed: {failed}")
print(f"  Total PSD files: {len(psd_files)}")
print(f"\nPNG files saved to: {dest_dir.absolute()}")
