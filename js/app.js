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

// Initialize app
async function init() {
    await loadPosts();
    setupEventListeners();
    checkURLHash();
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

    const emoji = post.category === 'flight' ? '✈️' : '🌍';

    return `
        <div class="post-card" data-post-id="${post.id}" data-category="${post.category}">
            <div class="post-thumbnail">${emoji}</div>
            <div class="post-card-body">
                <span class="post-category ${post.category}">${post.category} report</span>
                <h2>${post.title}</h2>
                <div class="post-date">${date}</div>
                <p class="post-excerpt">${post.excerpt}</p>
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
