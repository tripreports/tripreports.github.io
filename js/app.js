// State management
let allPosts = [];
let currentFilter = 'all';
let currentPost = null;

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
    loadAirlineTails();
    setupEventListeners();
    checkURLHash();
}

// Load and display airline tail images with infinite scroll
function loadAirlineTails() {
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

    // Shuffle array for random order
    const shuffled = tailImages.sort(() => Math.random() - 0.5);

    // Create exactly 2 copies for seamless loop
    const allTails = [...shuffled, ...shuffled];

    // Create image elements
    const slider = document.getElementById('tail-slider');
    if (!slider) return;

    allTails.forEach(code => {
        const img = document.createElement('img');
        img.src = `images/tails/${code}.png`;
        img.alt = `${code} airline tail`;
        img.title = code; // Show code on hover
        img.onerror = function() {
            // If image fails to load, try .jpg
            this.onerror = null;
            this.src = `images/tails/${code}.jpg`;
        };
        slider.appendChild(img);
    });

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
                requestAnimationFrame(animate);
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

// Create post card HTML
function createPostCard(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // For flight reports, use cover image; for trip reports, use emoji
    let thumbnail;
    if (post.category === 'flight') {
        thumbnail = `<img src="images/flights/${post.id}/cover.jpg" alt="${post.title}" class="cover-image">`;
    } else {
        thumbnail = '🌍';
    }

    // Parse flight details from excerpt if it's a flight report
    let flightDetails = '';
    if (post.category === 'flight' && post.excerpt) {
        const details = {};
        const lines = post.excerpt.split('\n');

        lines.forEach(line => {
            const match = line.match(/\*\*([^:]+):\*\*(.+)/);
            if (match) {
                details[match[1]] = match[2].trim();
            }
        });

        if (Object.keys(details).length > 0) {
            // Extract airline code from flight number (first 2 characters)
            let airlineCode = '';
            let tailImage = '';
            if (details['Flight Number']) {
                airlineCode = details['Flight Number'].trim().substring(0, 2).toUpperCase();
                tailImage = `<img src="images/tails/${airlineCode}.png" alt="${airlineCode}" class="tail-thumbnail" onerror="this.src='images/tails/${airlineCode}.jpg'; this.onerror=null;">`;
            }

            flightDetails = `
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
        }
    }

    return `
        <div class="post-card" data-post-id="${post.id}" data-category="${post.category}">
            <div class="post-thumbnail">${thumbnail}</div>
            <div class="post-card-body">
                <span class="post-category ${post.category}">${post.category} report</span>
                <h2>${post.title}</h2>
                <div class="post-date">${date}</div>
                ${flightDetails}
                <span class="read-more">Read more →</span>
            </div>
        </div>
    `;
}

// Filter posts based on current filter
function filterPosts() {
    const cards = document.querySelectorAll('.post-card');

    cards.forEach(card => {
        const category = card.dataset.category;
        if (currentFilter === 'all' || category === currentFilter) {
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
