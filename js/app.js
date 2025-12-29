// State management
let allPosts = [];
let currentFilter = 'all';
let currentAirlineFilter = null;
let currentPost = null;
let sliderAnimationId = null;
let iataToIcaoMapping = null;

// DOM elements
const postsGrid = document.getElementById('posts-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const feedView = document.getElementById('feed-view');
const postView = document.getElementById('post-view');
const postContent = document.getElementById('post-content');
const backBtn = document.getElementById('back-btn');

// All tail images (ICAO codes + remaining IATA codes without ICAO equivalents)
const tailImages = [
    '4Y', '8R', 'AAF', 'AAL', 'AAR', 'AAT', 'AB', 'ABJ', 'ABL', 'ABY', 'ACA', 'ACI',
    'ADM', 'ADR', 'AEA', 'AEE', 'AES', 'AFB', 'AFF', 'AFL', 'AFR', 'AGX', 'AIB', 'AIC',
    'AIQ', 'AIZ', 'AJX', 'AL', 'ALK', 'AMC', 'AMX', 'ANA', 'ANE', 'ANZ', 'APW', 'ARG',
    'ASA', 'ASL', 'AU', 'AUA', 'AUI', 'AUT', 'AVA', 'AVN', 'AWE', 'AWQ', 'AXM', 'AZA',
    'AZU', 'B0', 'BAV', 'BAW', 'BCY', 'BEE', 'BER', 'BF', 'BKP', 'BLF', 'BMI', 'BOI',
    'BON', 'BOV', 'BRU', 'BTI', 'BTK', 'BXI', 'BZH', 'CAL', 'CAW', 'CCA', 'CCM', 'CEB',
    'CES', 'CFE', 'CFG', 'CHH', 'CIX', 'CLH', 'CMP', 'CPA', 'CRK', 'CRL', 'CSA', 'CSC',
    'CSH', 'CSN', 'CSZ', 'CTN', 'CWC', 'CXA', 'DAH', 'DAL', 'DDL', 'DJ', 'DLA', 'DLH',
    'E9', 'EAQ', 'EDW', 'EGF', 'EIA', 'EIN', 'EJU', 'ELY', 'ENY', 'ETD', 'ETH', 'EVA',
    'EWG', 'EXS', 'EZD', 'EZE', 'FAJ', 'FDB', 'FFM', 'FFT', 'FIF', 'FIN', 'FLA', 'FLE',
    'FLI', 'FOS', 'FWI', 'GFA', 'GIA', 'GLO', 'GUY', 'HAL', 'HDA', 'HRH', 'HVN', 'IAD',
    'IBB', 'IBE', 'IBS', 'ICE', 'IGO', 'IRA', 'IRC', 'IRM', 'ITY', 'JAF', 'JAI', 'JAL',
    'JAT', 'JBU', 'JEC', 'JGO', 'JJP', 'JSA', 'JST', 'JW', 'KAC', 'KAL', 'KFR', 'KLA',
    'KLC', 'KLM', 'KQA', 'LAN', 'LAO', 'LBC', 'LBT', 'LGL', 'LH', 'LNI', 'LNK', 'LOG',
    'LOT', 'LPE', 'LPV', 'LVG', 'LZB', 'MAC', 'MAS', 'MAU', 'MDA', 'MDG', 'MEA', 'MHS',
    'MLT', 'MSR', 'MXD', 'NBT', 'NOK', 'NOZ', 'NTW', 'OAL', 'OAW', 'OF', 'OMA', 'ONE',
    'PAL', 'PD', 'PGA', 'PGT', 'PIC', 'PRZ', 'PSD', 'QFA', 'QG', 'QSC', 'QTR', 'RAM',
    'RCK', 'REU', 'RJA', 'ROT', 'ROU', 'RSL', 'RSR', 'RWD', 'RYR', 'RZO', 'S5', 'SAA',
    'SAS', 'SCW', 'SDG', 'SEJ', 'SEY', 'SFJ', 'SFR', 'SIA', 'SJX', 'SKU', 'SLK', 'SNG',
    'SUS', 'SVA', 'SWA', 'SWR', 'SYX', 'TAM', 'TAP', 'TAR', 'TGW', 'THA', 'THT', 'THY',
    'TJT', 'TLM', 'TNA', 'TOM', 'TSC', 'TT', 'TTW', 'TUA', 'TUX', 'TVF', 'TVS', 'TWN',
    'UAE', 'UAL', 'UIA', 'US', 'UZB', 'VAW', 'VIR', 'VJC', 'VLG', 'VOE', 'VOZ', 'VTA',
    'VTI', 'WAJ', 'WEN', 'WIF', 'WJA', 'WOW', 'WW', 'WZZ', 'XAX', 'XLA', 'XZ'
];

// Load IATA to ICAO mapping
async function loadIataToIcaoMapping() {
    try {
        const response = await fetch('data/iata_to_icao_mapping.json');
        if (response.ok) {
            iataToIcaoMapping = await response.json();
        }
    } catch (error) {
        console.error('Error loading IATA to ICAO mapping:', error);
    }
}

// Convert IATA code to ICAO code (or return as-is if no mapping exists)
function getIcaoCode(iataCode) {
    if (!iataCode) return null;

    // If mapping is loaded and code exists in mapping, use ICAO
    if (iataToIcaoMapping && iataToIcaoMapping[iataCode]) {
        return iataToIcaoMapping[iataCode];
    }

    // Otherwise, return the code as-is (might already be ICAO or an IATA without ICAO equivalent)
    return iataCode;
}

// Get tail image path for a given airline code
function getTailImagePath(airlineCode) {
    if (!airlineCode) return 'images/tails/unknown.png';

    // Convert to ICAO if possible
    const icaoCode = getIcaoCode(airlineCode);
    return `images/tails/${icaoCode}.png`;
}

// Set random tail as favicon
function setRandomFavicon() {
    const randomTail = tailImages[Math.floor(Math.random() * tailImages.length)];
    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.href = `images/tails/${randomTail}.png`;
    }
}

// Initialize app
async function init() {
    setRandomFavicon();
    await loadIataToIcaoMapping();
    await loadPosts();

    // Check for URL parameters (e.g., ?filter=flight)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam && ['all', 'flight', 'trip'].includes(filterParam)) {
        currentFilter = filterParam;
        // Update active button
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filterParam) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        // Apply the filter
        filterPosts();
    }

    loadSliderImages(currentFilter);
    loadAirlineFilterBar();
    setupEventListeners();
    checkURLHash();
}

// Load airline filter bar
function loadAirlineFilterBar() {
    const airlineFilterBar = document.getElementById('airline-filter-bar');
    if (!airlineFilterBar) return;

    // Get all flight reports
    const flightPosts = allPosts.filter(post => post.category === 'flight');

    // Extract airline codes and count occurrences
    const airlineCounts = {};
    flightPosts.forEach(post => {
        const match = post.excerpt.match(/\*\*Flight Number:\*\*\s*([A-Z0-9]{2})/);
        if (match) {
            const airlineCode = match[1];
            airlineCounts[airlineCode] = (airlineCounts[airlineCode] || 0) + 1;
        }
    });

    // Sort airlines by count (descending)
    const sortedAirlines = Object.entries(airlineCounts).sort((a, b) => b[1] - a[1]);

    // Create airline filter items
    airlineFilterBar.innerHTML = sortedAirlines.map(([code, count]) => `
        <div class="airline-filter-item" data-airline="${code}" title="${code}">
            <img src="${getTailImagePath(code)}" alt="${code}" onerror="this.src='images/tails/unknown.png'">
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.airline-filter-item').forEach(item => {
        item.addEventListener('click', () => {
            const airline = item.dataset.airline;

            // Toggle airline filter
            if (currentAirlineFilter === airline) {
                currentAirlineFilter = null;
                item.classList.remove('active');
            } else {
                // Remove active from all items
                document.querySelectorAll('.airline-filter-item').forEach(i => i.classList.remove('active'));
                currentAirlineFilter = airline;
                item.classList.add('active');
            }

            filterPosts();
        });
    });
}

// Load and display slider images (tails or flags) with infinite scroll
function loadSliderImages(filterType) {
    // List of all country flag images
    const flagImages = [
        'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at',
        'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi',
        'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by',
        'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn',
        'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm',
        'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'fi', 'fj', 'fk',
        'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl',
        'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm',
        'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir',
        'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn',
        'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls',
        'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk',
        'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw',
        'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np',
        'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm',
        'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw',
        'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm',
        'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf',
        'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw',
        'tz', 'ua', 'ug', 'um', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi',
        'vn', 'vu', 'wf', 'ws', 'xk', 'ye', 'yt', 'za', 'zm', 'zw'
    ];

    // Determine which images to use based on filter
    let imagesToUse, imageFolder;
    if (filterType === 'flight') {
        imagesToUse = tailImages.filter(code => code !== 'unknown'); // Exclude unknown.png
        imageFolder = 'tails';
    } else if (filterType === 'trip') {
        imagesToUse = flagImages;
        imageFolder = 'flags';
    } else { // 'all' - mix both
        imagesToUse = [...tailImages.filter(code => code !== 'unknown').map(t => ({code: t, folder: 'tails'})),
                       ...flagImages.map(f => ({code: f, folder: 'flags'}))];
        imageFolder = null; // Will use individual folder from object
    }

    // Shuffle array for random order
    const shuffled = imagesToUse.sort(() => Math.random() - 0.5);

    // Create exactly 2 copies for seamless loop
    const allImages = [...shuffled, ...shuffled];

    // Create image elements
    const slider = document.getElementById('tail-slider');
    if (!slider) return;

    // Clear existing images
    slider.innerHTML = '';

    allImages.forEach(item => {
        const img = document.createElement('img');

        // Handle both string format (flight/trip) and object format (all)
        if (typeof item === 'string') {
            img.src = `images/${imageFolder}/${item}.png`;
            img.alt = `${item}`;
            img.title = item;
            // Add class for flags
            if (imageFolder === 'flags') {
                img.classList.add('flag-image');
            }
        } else {
            img.src = `images/${item.folder}/${item.code}.png`;
            img.alt = `${item.code}`;
            img.title = item.code;
            // Add class for flags
            if (item.folder === 'flags') {
                img.classList.add('flag-image');
            }
        }

        slider.appendChild(img);
    });

    // Cancel any existing animation
    if (sliderAnimationId) {
        cancelAnimationFrame(sliderAnimationId);
        sliderAnimationId = null;
    }

    // Start infinite scroll animation after images load
    const scrollSpeed = 0.5; // pixels per frame
    let singleSetWidth = 0;
    let scrollPosition = 0;

    // Wait for first image to load to calculate width
    const firstImg = slider.querySelector('img');
    if (firstImg) {
        firstImg.onload = function() {
            // Calculate the width of one complete set (half of all images)
            const imageCount = slider.children.length;
            const singleImageWidth = firstImg.offsetWidth + parseFloat(getComputedStyle(slider).gap);
            singleSetWidth = (imageCount / 2) * singleImageWidth;

            // Start from the left (negative position) for left-to-right scroll
            scrollPosition = -singleSetWidth;

            // Start the animation (scrolling left to right)
            function animate() {
                scrollPosition += scrollSpeed;

                // When we've scrolled all the way to 0, reset to start position
                if (scrollPosition >= 0) {
                    scrollPosition = -singleSetWidth;
                }

                slider.style.transform = `translateX(${scrollPosition}px)`;
                sliderAnimationId = requestAnimationFrame(animate);
            }

            animate();
        };
    }
}

// Load posts from index.json
async function loadPosts() {
    try {
        const response = await fetch('posts/index.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        allPosts = await response.json();
        renderPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        postsGrid.innerHTML = '<div class="loading">Failed to load posts. Please try again later.</div>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterPosts();
            loadSliderImages(currentFilter);
        });
    });

    // Back button
    backBtn.addEventListener('click', () => {
        showFeed();
        window.location.hash = '';
    });

    // Handle browser back/forward
    window.addEventListener('hashchange', checkURLHash);
}

// Check URL hash for direct post links
function checkURLHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const post = allPosts.find(p => p.id === hash);
        if (post) {
            loadPost(post);
        }
    } else {
        showFeed();
    }
}

// Render all posts
function renderPosts() {
    if (allPosts.length === 0) {
        postsGrid.innerHTML = '<div class="loading">No posts yet. Check back soon!</div>';
        return;
    }

    postsGrid.innerHTML = allPosts.map(post => createPostCard(post)).join('');

    // Add click listeners to post cards
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.dataset.postId;
            const post = allPosts.find(p => p.id === postId);
            if (post) {
                window.location.hash = post.id;
            }
        });
    });
}

// Country name to ISO code mapping
const countryToCode = {
    'Åland Islands': 'ax',
    'Albania': 'al',
    'Azerbaijan': 'az',
    'Cyprus': 'cy',
    'Jordan': 'jo',
    'Kosovo': 'xk',
    'Kuwait': 'kw',
    'Oman': 'om',
    'Saudi Arabia': 'sa',
    'Ukraine': 'ua',
    'Uzbekistan': 'uz'
};

// Create post card HTML
function createPostCard(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Use cover image for both flight and trip reports
    let thumbnail;
    let coverImageSrc;

    // Check if post has custom coverImage, otherwise use default path
    if (post.coverImage) {
        coverImageSrc = post.coverImage;
    } else if (post.category === 'flight') {
        coverImageSrc = `images/flights/${post.id}/cover.jpg`;
    } else {
        coverImageSrc = `images/trips/${post.id}/cover.jpg`;
    }

    thumbnail = `<img src="${coverImageSrc}" alt="${post.title}" class="cover-image">`;

    // Parse details from excerpt
    let detailsHTML = '';
    let airlineCode = '';

    if (post.excerpt) {
        const details = {};
        const lines = post.excerpt.split('\n');

        lines.forEach(line => {
            const match = line.match(/\*\*([^:]+):\*\*(.+)/);
            if (match) {
                details[match[1]] = match[2].trim();
            }
        });

        if (post.category === 'flight' && Object.keys(details).length > 0) {
            // Extract airline code from flight number (first 2 characters)
            let tailImage = '';
            if (details['Flight Number']) {
                airlineCode = details['Flight Number'].trim().substring(0, 2).toUpperCase();
                tailImage = `<img src="${getTailImagePath(airlineCode)}" alt="${airlineCode}" class="tail-thumbnail" onerror="this.src='images/tails/unknown.png'">`;
            }

            detailsHTML = `
                <div class="flight-details">
                    <div class="flight-info">
                        ${details.Airline ? `<div class="detail-item"><strong>Airline:</strong> ${details.Airline}</div>` : ''}
                        ${details['Flight Number'] ? `<div class="detail-item"><strong>Flight:</strong> ${details['Flight Number']}</div>` : ''}
                        ${details.Aircraft ? `<div class="detail-item"><strong>Aircraft:</strong> ${details.Aircraft}</div>` : ''}
                        ${details['From/To'] ? `<div class="detail-item"><strong>Route:</strong> ${details['From/To']}</div>` : ''}
                        ${details['Distance Flown'] ? `<div class="detail-item"><strong>Distance:</strong> ${details['Distance Flown']}</div>` : ''}
                    </div>
                    ${tailImage ? `<div class="flight-tail">${tailImage}</div>` : ''}
                </div>
            `;
        } else if (post.category === 'trip' && details.Country) {
            // Extract country code and display flag
            const countryName = details.Country.trim();
            const countryCode = countryToCode[countryName];
            let flagImage = '';

            if (countryCode) {
                flagImage = `<img src="images/flags/${countryCode}.png" alt="${countryName}" class="tail-thumbnail flag-thumbnail">`;
            }

            detailsHTML = `
                <div class="flight-details">
                    <div class="flight-info">
                        ${details.Date || details.Dates ? `<div class="detail-item"><strong>Date:</strong> ${details.Date || details.Dates}</div>` : ''}
                        ${details.Country ? `<div class="detail-item"><strong>Country:</strong> ${details.Country}</div>` : ''}
                    </div>
                    ${flagImage ? `<div class="flight-tail">${flagImage}</div>` : ''}
                </div>
            `;
        }
    }

    return `
        <div class="post-card" data-post-id="${post.id}" data-category="${post.category}" ${airlineCode ? `data-airline="${airlineCode}"` : ''}>
            <div class="post-thumbnail">${thumbnail}</div>
            <div class="post-card-body">
                <span class="post-category ${post.category}">${post.category} report</span>
                <h2>${post.title}</h2>
                <div class="post-date">${date}</div>
                ${detailsHTML}
                <span class="read-more">Read more →</span>
            </div>
        </div>
    `;
}

// Filter posts based on current filter
function filterPosts() {
    const cards = document.querySelectorAll('.post-card');
    const airlineFilterBar = document.getElementById('airline-filter-bar');
    const tripBanner = document.getElementById('trip-banner');

    // Show/hide airline filter bar and trip banner
    if (currentFilter === 'flight') {
        airlineFilterBar.style.display = 'flex';
        tripBanner.style.display = 'none';
    } else if (currentFilter === 'trip') {
        airlineFilterBar.style.display = 'none';
        tripBanner.style.display = 'block';
        currentAirlineFilter = null;
        document.querySelectorAll('.airline-filter-item').forEach(i => i.classList.remove('active'));
    } else {
        airlineFilterBar.style.display = 'none';
        tripBanner.style.display = 'none';
        currentAirlineFilter = null;
        document.querySelectorAll('.airline-filter-item').forEach(i => i.classList.remove('active'));
    }

    cards.forEach(card => {
        const category = card.dataset.category;
        const airlineCode = card.dataset.airline;

        // Check category filter
        const categoryMatch = currentFilter === 'all' || category === currentFilter;

        // Check airline filter (only applies to flight reports)
        const airlineMatch = !currentAirlineFilter ||
                            (category === 'flight' && airlineCode === currentAirlineFilter);

        if (categoryMatch && airlineMatch) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Load and display individual post
async function loadPost(post) {
    try {
        const response = await fetch(post.file);
        if (!response.ok) {
            throw new Error('Failed to load post content');
        }
        const markdown = await response.text();

        // Extract metadata section and rest of content
        const lines = markdown.split('\n');
        let metadataEndIndex = -1;
        let titleLine = '';

        // Find title (first h1)
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('# ')) {
                titleLine = lines[i];
                // Look for metadata after title
                for (let j = i + 1; j < lines.length; j++) {
                    // Metadata ends at --- or when we hit content (## or paragraph)
                    if (lines[j].trim() === '---' ||
                        (lines[j].trim() && !lines[j].startsWith('**') && lines[j-1].trim() === '')) {
                        metadataEndIndex = j;
                        break;
                    }
                }
                break;
            }
        }

        let metadataHTML = '';
        let contentMarkdown = markdown;

        if (metadataEndIndex > 0) {
            // Extract metadata lines
            const metadataLines = [];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('# ')) continue;
                if (i >= metadataEndIndex) break;
                if (lines[i].startsWith('**')) {
                    metadataLines.push(lines[i]);
                }
            }

            // Parse metadata
            const metadata = {};
            metadataLines.forEach(line => {
                const match = line.match(/\*\*([^:]+):\*\*(.+)/);
                if (match) {
                    metadata[match[1]] = match[2].trim();
                }
            });

            // Create styled metadata section
            if (Object.keys(metadata).length > 0) {
                let iconHTML = '';

                if (post.category === 'flight' && metadata['Flight Number']) {
                    const airlineCode = metadata['Flight Number'].substring(0, 2).toUpperCase();
                    iconHTML = `<div class="post-metadata-icon">
                        <img src="${getTailImagePath(airlineCode)}" alt="${airlineCode}" onerror="this.src='images/tails/unknown.png'">
                    </div>`;
                } else if (post.category === 'trip' && metadata['Country']) {
                    const countryCode = countryToCode[metadata['Country'].trim()];
                    if (countryCode) {
                        iconHTML = `<div class="post-metadata-icon">
                            <img src="images/flags/${countryCode}.png" alt="${metadata['Country']}">
                        </div>`;
                    }
                }

                const metadataItems = Object.entries(metadata).map(([key, value]) =>
                    `<div class="post-metadata-item"><strong>${key}:</strong> ${value}</div>`
                ).join('');

                metadataHTML = `
                    <div class="post-metadata">
                        <div class="post-metadata-content">
                            ${metadataItems}
                        </div>
                        ${iconHTML}
                    </div>
                `;

                // Remove metadata from content
                contentMarkdown = titleLine + '\n\n' + lines.slice(metadataEndIndex + 1).join('\n');
            }
        }

        // Parse markdown to HTML using marked.js
        const html = marked.parse(contentMarkdown);

        // Display post with metadata
        currentPost = post;
        postContent.innerHTML = metadataHTML + html;
        showPost();

        // Scroll to top
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = '<p>Failed to load post content. Please try again later.</p>';
        showPost();
    }
}

// Show feed view
function showFeed() {
    feedView.style.display = 'block';
    postView.style.display = 'none';
    document.querySelector('.filter-nav').style.display = 'block';
}

// Show post view
function showPost() {
    feedView.style.display = 'none';
    postView.style.display = 'block';
    document.querySelector('.filter-nav').style.display = 'none';
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
