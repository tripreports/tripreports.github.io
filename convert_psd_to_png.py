from PIL import Image
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

        # Open PSD and convert to PNG
        with Image.open(psd_file) as img:
            # Convert to RGB if necessary (PSD might have alpha channel)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # Keep alpha channel
                img_rgb = img.convert('RGBA')
            else:
                img_rgb = img.convert('RGB')

            # Save as PNG
            img_rgb.save(png_file, 'PNG')
            print(f"  Converted: {psd_file.name} -> {png_file.name}")
            converted += 1

    except Exception as e:
        print(f"  FAILED: {psd_file.name} - {e}")
        failed += 1

print(f"\n{'='*80}")
print(f"\nConversion Summary:")
print(f"  Converted: {converted}")
print(f"  Skipped (already exists): {skipped}")
print(f"  Failed: {failed}")
print(f"  Total PSD files: {len(psd_files)}")
print(f"\nPNG files saved to: {dest_dir.absolute()}")
