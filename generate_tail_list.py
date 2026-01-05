import os

# Get all tail PNG files
tail_dir = 'images/tails'
tail_files = sorted([f[:-4] for f in os.listdir(tail_dir) if f.endswith('.png')])

# Generate JavaScript array format
print("const tailImages = [")

# Print in rows of 12 codes
for i in range(0, len(tail_files), 12):
    row = tail_files[i:i+12]
    formatted_row = ", ".join([f"'{code}'" for code in row])
    if i + 12 < len(tail_files):
        print(f"    {formatted_row},")
    else:
        print(f"    {formatted_row}")

print("];")

print(f"\n// Total: {len(tail_files)} tail images")
