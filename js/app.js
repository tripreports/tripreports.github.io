// State management
let allPosts = [];
let currentFilter = 'all';
let currentAirlineFilter = null;
let currentPost = null;
let sliderAnimationId = null;

// DOM elements
const postsGrid = document.getElementById('posts-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const feedView = document.getElementById('feed-view');
const postView = document.getElementById('post-view');
const postContent = document.getElementById('post-content');
const backBtn = document.getElementById('back-btn');

// Set random tail as favicon
function setRandomFavicon() {
    const tailImages = [
        '2L', '3K', '3O', '3S', '3U', '4Y', '4Z', '5J', '6E', '7G', '8R', '9W',
        'A3', 'A6', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AH', 'AI', 'AK', 'AL',
        'AM', 'AR', 'AS', 'AT', 'AU', 'AV', 'AY', 'AZ', 'B0', 'B2', 'B6', 'B7',
        'BA', 'BE', 'BF', 'BJ', 'BL', 'BR', 'BT', 'BX', 'BY', 'CA', 'CE', 'CI',
        'CJ', 'CL', 'CM', 'CX', 'CZ', 'D7', 'DB', 'DD', 'DE', 'DJ', 'DL', 'DY',
        'E9', 'EC', 'EI', 'EK', 'EN', 'EP', 'ET', 'EW', 'EY', 'EZ', 'F6', 'F8',
        'F9', 'FA', 'FB', 'FD', 'FI', 'FM', 'FR', 'FY', 'FZ', 'G3', 'G9', 'GA',
        'GE', 'GF', 'GK', 'H2', 'HA', 'HM', 'HU', 'HX', 'HY', 'I2', 'I5', 'IB',
        'ID', 'IR', 'IT', 'IZ', 'JA', 'JJ', 'JL', 'JN', 'JP', 'JQ', 'JT', 'JU',
        'JW', 'JX', 'KA', 'KE', 'KF', 'KL', 'KM', 'KQ', 'KU', 'LA', 'LG', 'LH',
        'LM', 'LO', 'LP', 'LS', 'LV', 'LX', 'LY', 'MD', 'ME', 'MF', 'MH', 'MI',
        'MK', 'MN', 'MQ', 'MS', 'MU', 'N0', 'NF', 'NH', 'NI', 'NQ', 'NT', 'NZ',
        'O6', 'OA', 'OB', 'OD', 'OF', 'OK', 'OS', 'OU', 'OZ', 'PC', 'PD', 'PG',
        'PR', 'PS', 'QF', 'QG', 'QH', 'QR', 'QS', 'QV', 'QZ', 'RC', 'RJ', 'RO',
        'RV', 'S4', 'S5', 'SA', 'SB', 'SG', 'SK', 'SL', 'SN', 'SQ', 'SS', 'SU',
        'SV', 'SZ', 'T3', 'T5', 'T7', 'TB', 'TF', 'TG', 'TK', 'TN', 'TO', 'TP',
        'TR', 'TS', 'TT', 'TU', 'TX', 'UA', 'UG', 'UK', 'UL', 'US', 'UU', 'UX',
        'V7', 'VA', 'VJ', 'VN', 'VS', 'VT', 'VX', 'VY', 'W5', 'W6', 'WA', 'WB',
        'WE', 'WF', 'WK', 'WN', 'WR', 'WS', 'WW', 'WX', 'WY', 'XK', 'XZ', 'YU',
        'YW', 'Z2', 'ZH', 'ZI'
    ];

    const randomTail = tailImages[Math.floor(Math.random() * tailImages.length)];
    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.href = `images/tails/${randomTail}.png`;
    }
}

// Initialize app
async function init() {
    setRandomFavicon();
    await loadPosts();
    loadSliderImages('all');
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
            <img src="images/tails/${code}.png" alt="${code}" onerror="this.src='images/tails/${code}.jpg'">
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
    // List of all airline tail images we actually have
    const tailImages = [
        '2L', '3K', '3O', '3S', '3U', '4Y', '4Z', '5J', '6E', '7G', '8R', '9W',
        'A3', 'A6', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AH', 'AI', 'AK', 'AL',
        'AM', 'AR', 'AS', 'AT', 'AU', 'AV', 'AY', 'AZ', 'B0', 'B2', 'B6', 'B7',
        'BA', 'BE', 'BF', 'BJ', 'BL', 'BR', 'BT', 'BX', 'BY', 'CA', 'CE', 'CI',
        'CJ', 'CL', 'CM', 'CX', 'CZ', 'D7', 'DB', 'DD', 'DE', 'DJ', 'DL', 'DY',
        'E9', 'EC', 'EI', 'EK', 'EN', 'EP', 'ET', 'EW', 'EY', 'EZ', 'F6', 'F8',
        'F9', 'FA', 'FB', 'FD', 'FI', 'FM', 'FR', 'FY', 'FZ', 'G3', 'G9', 'GA',
        'GE', 'GF', 'GK', 'H2', 'HA', 'HM', 'HU', 'HX', 'HY', 'I2', 'I5', 'IB',
        'ID', 'IR', 'IT', 'IZ', 'JA', 'JJ', 'JL', 'JN', 'JP', 'JQ', 'JT', 'JU',
        'JW', 'JX', 'KA', 'KE', 'KF', 'KL', 'KM', 'KQ', 'KU', 'LA', 'LG', 'LH',
        'LM', 'LO', 'LP', 'LS', 'LV', 'LX', 'LY', 'MD', 'ME', 'MF', 'MH', 'MI',
        'MK', 'MN', 'MQ', 'MS', 'MU', 'N0', 'NF', 'NH', 'NI', 'NQ', 'NT', 'NZ',
        'O6', 'OA', 'OB', 'OD', 'OF', 'OK', 'OS', 'OU', 'OZ', 'PC', 'PD', 'PG',
        'PR', 'PS', 'QF', 'QG', 'QH', 'QR', 'QS', 'QV', 'QZ', 'RC', 'RJ', 'RO',
        'RV', 'S4', 'S5', 'SA', 'SB', 'SG', 'SK', 'SL', 'SN', 'SQ', 'SS', 'SU',
        'SV', 'SZ', 'T3', 'T5', 'T7', 'TB', 'TF', 'TG', 'TK', 'TN', 'TO', 'TP',
        'TR', 'TS', 'TT', 'TU', 'TX', 'UA', 'UG', 'UK', 'UL', 'US', 'UU', 'UX',
        'V7', 'VA', 'VJ', 'VN', 'VS', 'VT', 'VX', 'VY', 'W5', 'W6', 'WA', 'WB',
        'WE', 'WF', 'WK', 'WN', 'WR', 'WS', 'WW', 'WX', 'WY', 'XK', 'XZ', 'YU',
        'YW', 'Z2', 'ZH', 'ZI'
    ].filter(code => code !== 'unknown'); // Exclude unknown.png

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
        imagesToUse = tailImages;
        imageFolder = 'tails';
    } else if (filterType === 'trip') {
        imagesToUse = flagImages;
        imageFolder = 'flags';
    } else { // 'all' - mix both
        imagesToUse = [...tailImages.map(t => ({code: t, folder: 'tails'})),
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
                tailImage = `<img src="images/tails/${airlineCode}.png" alt="${airlineCode}" class="tail-thumbnail" onerror="this.src='images/tails/${airlineCode}.jpg'; this.onerror=null;">`;
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
                flagImage = `<img src="images/flags/${countryCode}.png" alt="${countryName}" class="tail-thumbnail">`;
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

        // Parse markdown to HTML using marked.js
        const html = marked.parse(markdown);

        // Display post
        currentPost = post;
        postContent.innerHTML = html;
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
