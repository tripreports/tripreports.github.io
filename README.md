# Trip Reports Website

A clean, easy-to-maintain travel blog featuring flight reports and trip reports. Built with plain HTML, CSS, and JavaScript - no build process required!

## Features

- ✈️ Combined feed with filtering (All, Flights, Trips)
- 📝 Write posts in simple Markdown
- 🎨 Clean, responsive design
- 🚀 Zero maintenance - just push and go
- 📱 Mobile-friendly
- 🔗 Direct links to individual posts
- ⚡ Fast loading with client-side rendering

## Project Structure

```
/
├── index.html              # Main page
├── css/
│   └── style.css          # Styling
├── js/
│   └── app.js             # Application logic
├── posts/
│   ├── index.json         # Post metadata
│   ├── flights/           # Flight report markdown files
│   └── trips/             # Trip report markdown files
└── README.md              # This file
```

## How to Add a New Post

Adding a new post is a simple 2-step process:

### Step 1: Create the Markdown File

1. Navigate to the appropriate folder:
   - `posts/flights/` for flight reports
   - `posts/trips/` for trip reports

2. Create a new `.md` file (e.g., `emirates-first-class-dubai.md`)

3. Write your post in Markdown format. Example:

```markdown
# Emirates First Class: Dubai to New York

**Flight:** EK201
**Route:** Dubai (DXB) → New York JFK
**Aircraft:** Airbus A380
**Date:** January 15, 2025

## Overview

Your post content here...

## In-Flight Experience

More content...

### Subsection

Even more details...
```

### Step 2: Add to Index

1. Open `posts/index.json`

2. Add a new entry to the array:

```json
{
    "id": "emirates-first-class-dubai",
    "title": "Emirates First Class: Dubai to New York",
    "date": "2025-01-15",
    "category": "flight",
    "file": "posts/flights/emirates-first-class-dubai.md",
    "excerpt": "A luxurious journey aboard Emirates' flagship A380 First Class suite..."
}
```

**Field Descriptions:**
- `id`: Unique identifier (use kebab-case, will be used in URL)
- `title`: Post title (displayed on card and post page)
- `date`: Publication date in YYYY-MM-DD format
- `category`: Either `"flight"` or `"trip"`
- `file`: Path to your markdown file
- `excerpt`: Short description (2-3 sentences)

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add new post: Emirates First Class"
git push
```

Your post will be live on GitHub Pages within a few minutes!

## Markdown Guide

### Headers
```markdown
# H1 - Main Title
## H2 - Section
### H3 - Subsection
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

### Lists
```markdown
Unordered:
- Item 1
- Item 2
  - Nested item

Ordered:
1. First item
2. Second item
```

### Links & Images
```markdown
[Link text](https://example.com)
![Image alt text](path/to/image.jpg)
```

### Quotes
```markdown
> This is a blockquote
```

### Code
```markdown
Inline `code` uses backticks

\`\`\`
Code block
uses three backticks
\`\`\`
```

## Customization

### Change Site Title
Edit `index.html`:
```html
<h1>Your Site Name</h1>
<p class="tagline">Your tagline</p>
```

### Change Colors
Edit `css/style.css`. Main color variables:
- Header gradient: `#667eea` and `#764ba2`
- Flight category: `#e3f2fd` (background), `#1976d2` (text)
- Trip category: `#f3e5f5` (background), `#7b1fa2` (text)

### Modify Layout
The posts grid automatically adjusts based on screen size:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

To change this, edit the grid in `css/style.css`:
```css
.posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```

## Local Development

To test locally, you need a local web server (can't just open `index.html` due to CORS restrictions when loading JSON/markdown files).

### Option 1: Python
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Option 2: Node.js
```bash
npx http-server

# Then visit: http://localhost:8080
```

### Option 3: VS Code
Install the "Live Server" extension and click "Go Live"

## GitHub Pages Setup

1. Go to repository Settings
2. Navigate to "Pages" section
3. Under "Source", select "main" branch
4. Click Save

Your site will be available at: `https://[username].github.io/[repository-name]`

## Tips for Great Posts

### Flight Reports
Include:
- Flight number and route
- Aircraft type
- Class of service
- Ground experience (lounge, check-in)
- Seat/suite details
- Dining experience
- Service quality
- Entertainment
- Sleep quality
- Overall rating

### Trip Reports
Include:
- Duration and itinerary
- Daily highlights
- Accommodation recommendations
- Food experiences
- Activities and attractions
- Transportation tips
- Budget breakdown
- Practical tips
- Would you return?

## Troubleshooting

**Posts not showing up?**
- Check `posts/index.json` syntax (use a JSON validator)
- Ensure file paths are correct
- Verify markdown file exists

**Styling looks broken?**
- Clear browser cache
- Check browser console for errors
- Verify `css/style.css` path in `index.html`

**Links not working?**
- Make sure `id` in index.json matches the URL hash
- Check for special characters in IDs

## Contributing

Feel free to customize this template to fit your needs. The code is simple and well-commented for easy modification.

## License

Free to use and modify as you wish.

---

Happy blogging! ✈️🌍
