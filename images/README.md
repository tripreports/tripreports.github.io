# Images Directory

This folder contains all images for flight reports and trip reports.

## Folder Structure

```
images/
├── flights/
│   ├── [post-id]/
│   │   └── [image-files].jpg
└── trips/
    ├── [post-id]/
    │   └── [image-files].jpg
```

## Usage

### 1. Add Images to Your Post Folder

When creating a new post, add images to the corresponding folder:
- Flight reports: `images/flights/[your-post-id]/`
- Trip reports: `images/trips/[your-post-id]/`

### 2. Reference in Markdown

From your markdown file in `posts/flights/` or `posts/trips/`, use:

```markdown
![Image description](../../images/flights/your-post-id/image-name.jpg)

or

![Image description](../../images/trips/your-post-id/image-name.jpg)
```

### Example

For a post at `posts/flights/emirates-first-class.md`:

1. Create folder: `images/flights/emirates-first-class/`
2. Add images: `suite.jpg`, `meal.jpg`, etc.
3. In markdown:
   ```markdown
   ![Emirates First Class Suite](../../images/flights/emirates-first-class/suite.jpg)
   ```

## Image Optimization Tips

Before adding images to the repo:

- **Compress images** - Use TinyPNG, Squoosh, or ImageOptim
- **Resize appropriately** - Max width 1920px for full-width images
- **Target file size** - Aim for under 500KB per image
- **Use descriptive names** - `ana-suite-1a.jpg` not `IMG_1234.jpg`
- **Format:** JPG for photos, PNG for graphics/screenshots

## Existing Post Folders

- `images/flights/ana-first-class-tokyo-nyc/`
- `images/flights/singapore-airlines-suites-frankfurt/`
- `images/trips/japan-winter-adventure/`
- `images/trips/iceland-northern-lights/`
