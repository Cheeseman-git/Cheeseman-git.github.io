// Local JSON Implementation (No Supabase)
const ANNOUNCEMENTS_URL = 'https://raw.githubusercontent.com/fkm-X3/my-database/main/Announcements.json';

// Elements
// -- Community Auth Elements --
let statusText, signoutBtn, feedEl, userStatusSection, guestPostPrompt;

// -- Settings Auth Elements --
let authSection, accountInfoDisplay, settingsUsername, settingsSignoutBtn, settingsDownloadKeyBtn;

// -- Profile Elements --
let profileUsernameInput, updateProfileBtn;

// -- In-App Elements --
let downloadKeyBtn, postTitle, postContent, postType, postSubmitBtn;

function initElements() {
    statusText = document.getElementById('status-text');
    signoutBtn = document.getElementById('signout-btn');
    feedEl = document.getElementById('community-feed');
    userStatusSection = document.getElementById('user-status-section');
    guestPostPrompt = document.getElementById('guest-post-prompt');

    authSection = document.getElementById('auth-section');
    accountInfoDisplay = document.getElementById('account-info-display');
    settingsUsername = document.getElementById('settings-username');
    settingsSignoutBtn = document.getElementById('settings-signout-btn');
    settingsDownloadKeyBtn = document.getElementById('settings-download-key-btn');

    profileUsernameInput = document.getElementById('profile-username-input');
    updateProfileBtn = document.getElementById('update-profile-btn');

    downloadKeyBtn = document.getElementById('download-key-btn');
    postTitle = document.getElementById('post-title');
    postContent = document.getElementById('post-content');
    postType = document.getElementById('post-type');
    postSubmitBtn = document.getElementById('post-submit-btn');

    // Re-attach listeners now that elements are found
    attachListeners();
}

// State
const FEED_PAGE_SIZE = 5;
let currentOffset = 0;
let allAnnouncements = []; // Store all fetched announcements

// --- FEED RENDERING ---
function renderAnnouncements(rows, isLoadMore = false) {
    // Remove existing "Show More" button if it exists
    const existingShowMore = document.getElementById('feed-show-more-btn');
    if (existingShowMore) existingShowMore.remove();

    if (!isLoadMore) {
        if (!rows || rows.length === 0) {
            feedEl.innerHTML = `
          <div class="glass p-8 rounded-3xl border border-white/5 text-center">
            <i class="fa-solid fa-wind text-4xl text-cheeseman-muted mb-4"></i>
            <p class="text-white text-lg font-bold">It's quiet here...</p>
            <p class="text-cheeseman-muted">No announcements found yet.</p>
          </div>`;
            return;
        }
        feedEl.innerHTML = '';
    }

    rows.forEach(row => {
        const div = document.createElement('div');
        div.className = 'glass p-6 rounded-3xl border border-white/5 hover:border-cheeseman-primary/30 transition-all group mb-6 animate-fade-in relative overflow-hidden';

        // Map JSON fields to UI fields
        const title = row.Title || row.title || 'Announcement';
        const content = row.content || row.body || '';
        const rawDate = row.date || row.created_at;
        const dateStr = rawDate ? new Date(rawDate).toLocaleDateString() : 'Just now';

        // Metadata
        const typeLabel = row.type || row.topic || 'Community';
        const isPinned = row.pinned === true || row.pinned === 'true';
        const priority = (row.priority || 'low').toLowerCase();
        const tags = row.tags || [];

        // Colors & Icons based on type/priority
        let iconClass = 'fa-bullhorn';
        let iconColor = 'text-cheeseman-primary';
        let borderColor = 'border-white/5';

        // Priority Styling
        let priorityBadge = '';
        if (priority === 'high') {
            borderColor = 'border-rose-500/30';
            priorityBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/20 mr-2">High Priority</span>`;
        } else if (priority === 'medium') {
            priorityBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase border border-amber-500/20 mr-2">Notice</span>`;
        }

        if (typeLabel.toLowerCase().includes('update')) { iconClass = 'fa-rotate'; iconColor = 'text-emerald-400'; }
        else if (typeLabel.toLowerCase().includes('event')) { iconClass = 'fa-calendar-star'; iconColor = 'text-pink-400'; }
        else if (typeLabel.toLowerCase().includes('score')) { iconClass = 'fa-trophy'; iconColor = 'text-yellow-400'; }
        else if (typeLabel.toLowerCase().includes('alert')) { iconClass = 'fa-triangle-exclamation'; iconColor = 'text-amber-400'; }

        // Tags HTML
        let tagsHtml = '';
        if (Array.isArray(tags) && tags.length > 0) {
            tagsHtml = `<div class="flex flex-wrap gap-2 mt-3">
                ${tags.map(tag => `<span class="px-2 py-1 rounded-lg bg-white/5 text-cheeseman-muted text-xs font-bold border border-white/5 hover:bg-white/10 transition-colors">#${tag}</span>`).join('')}
            </div>`;
        }

        const authorName = row.author || 'Community Member';

        // Pinned visual cue
        const pinnedIcon = isPinned ? `<div class="absolute top-4 right-4 text-cheeseman-primary transform rotate-45"><i class="fa-solid fa-thumbtack text-xl opacity-20 group-hover:opacity-100 transition-opacity"></i></div>` : '';

        // Apply dynamic border if high priority
        if (priority === 'high') {
            div.style.borderColor = 'rgba(244, 63, 94, 0.3)'; // Tailwind rose-500/30
        }

        div.innerHTML = `
      ${pinnedIcon}
      <div class="flex items-center gap-4 mb-4 relative z-10">
        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${iconColor} text-xl border border-white/5 shadow-inner">
           <i class="fa-solid ${iconClass}"></i>
        </div>
        <div>
           <div class="flex items-center gap-2 mb-1">
               ${priorityBadge}
               <h3 class="font-bold text-white group-hover:text-cheeseman-primary transition-colors text-lg leading-tight">${title}</h3>
           </div>
           <p class="text-xs text-cheeseman-muted font-bold tracking-wide uppercase">
             ${authorName} • ${dateStr}
           </p>
        </div>
      </div>
      <div class="text-slate-300 mb-4 leading-relaxed whitespace-pre-line relative z-10 text-sm md:text-base pl-2 border-l-2 border-white/5 hover:border-white/20 transition-colors">
        ${content}
      </div>
      
      ${tagsHtml}
      
      <div class="flex items-center gap-6 text-cheeseman-muted text-sm font-bold border-t border-white/5 pt-4 mt-4">
          <button class="hover:text-pink-500 transition-colors flex items-center gap-2 group/btn">
            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-pink-500/20 transition-colors">
                <i class="fa-regular fa-heart"></i> 
            </div>
            <span>Like</span>
          </button>
          <button class="hover:text-sky-500 transition-colors flex items-center gap-2 ml-auto group/btn">
            <i class="fa-solid fa-share"></i> Share
          </button>
      </div>
    `;
        feedEl.appendChild(div);
    });

    // Handle Pagination Logic based on remaining items in global array
    if (currentOffset < allAnnouncements.length) {
        renderShowMoreButton();
    }
}

function renderShowMoreButton() {
    const btnContainer = document.createElement('div');
    btnContainer.id = 'feed-show-more-btn';
    btnContainer.className = 'flex justify-center mt-4 pb-8';
    btnContainer.innerHTML = `
        <button id="show-more-btn-action" class="px-6 py-2 bg-white/5 hover:bg-white/10 text-cheeseman-muted hover:text-white font-bold rounded-xl transition-all border border-white/5">
            Show More <i class="fa-solid fa-chevron-down ml-2"></i>
        </button>
    `;
    feedEl.appendChild(btnContainer);

    document.getElementById('show-more-btn-action').addEventListener('click', () => {
        loadMoreAnnouncements();
    });
}

// Fetch Announcements from JSON
async function fetchAnnouncements() {
    if (!feedEl) return;

    // Reset
    currentOffset = 0;
    allAnnouncements = [];

    allAnnouncements = mockData;
    renderAnnouncements(allAnnouncements, false);
    return; // STOP HERE FOR MOCK

}

function loadMoreAnnouncements() {
    const nextBatch = allAnnouncements.slice(currentOffset, currentOffset + FEED_PAGE_SIZE);

    // Simulate loading delay for UX
    const btn = document.getElementById('show-more-btn-action');
    if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...`;
        btn.disabled = true;
    }

    setTimeout(() => {
        if (nextBatch.length > 0) {
            currentOffset += nextBatch.length;
            renderAnnouncements(nextBatch, true);
        } else {
            // remove button if no more
            const existingShowMore = document.getElementById('feed-show-more-btn');
            if (existingShowMore) existingShowMore.remove();
        }
    }, 500);
}


// --- POST CREATION (MOCKED) ---
async function createPost() {
    alert("Posting is currently disabled in this static version. \nPlease submit an update via Pull Request to Data/Announcements.json");
    // Clear inputs
    if (postTitle) postTitle.value = '';
    if (postContent) postContent.value = '';
}


// --- AUTH & PROFILE (LOCAL MOCK) ---

function updateUI(isLoggedIn) {
    let username = localStorage.getItem('cheeseman_username') || 'Guest';

    if (isLoggedIn) {
        // Logged In View
        if (userStatusSection) userStatusSection.style.display = 'flex';
        if (guestPostPrompt) guestPostPrompt.style.display = 'none';
        if (statusText) statusText.textContent = username;

        // Settings View
        // Hide "Magic Link" section
        if (authSection) {
            authSection.style.display = 'none';
        }

        if (accountInfoDisplay) accountInfoDisplay.classList.remove('hidden');
        if (settingsUsername) settingsUsername.textContent = username;
        if (profileUsernameInput) profileUsernameInput.value = username;

    } else {
        // Guest View
        if (userStatusSection) userStatusSection.style.display = 'none';
        if (guestPostPrompt) guestPostPrompt.style.display = 'block';

        if (authSection) authSection.style.display = 'block';
        if (accountInfoDisplay) accountInfoDisplay.classList.add('hidden');
    }
}

// Simple "Login" simulation
function loginLocal(username) {
    localStorage.setItem('cheeseman_is_logged_in', 'true');
    localStorage.setItem('cheeseman_username', username);
    updateUI(true);
}

function handleSignOut() {
    localStorage.removeItem('cheeseman_is_logged_in');
    localStorage.removeItem('cheeseman_username');
    window.location.reload();
}

function updateProfile() {
    const newName = profileUsernameInput.value.trim();
    if (newName) {
        localStorage.setItem('cheeseman_username', newName);
        updateUI(true);
        alert("Profile updated locally!");
    }
}

function initAuth() {
    // Check local storage for session state
    const isLoggedIn = localStorage.getItem('cheeseman_is_logged_in') === 'true';
    updateUI(isLoggedIn);

    // Attach listeners to the "Magic Link" button to act as a simple login for now (or hide it)
    // For this refactor, let's repurpose the Magic Link button to just "Log In as User" for testing
    const magicBtn = document.getElementById('magic-btn');
    const magicEmail = document.getElementById('magic-email');

    if (magicBtn) {
        magicBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-2"></i> Enter (Local)';
        // Remove old listeners by cloning or just overwriting onclick
        magicBtn.onclick = (e) => {
            e.preventDefault();
            const email = magicEmail.value || 'User';
            const name = email.split('@')[0];
            loginLocal(name);
        };
    }
}


// --- EVENT LISTENERS ---

function attachListeners() {
    if (signoutBtn) signoutBtn.onclick = handleSignOut;
    if (settingsSignoutBtn) settingsSignoutBtn.onclick = handleSignOut;

    if (postSubmitBtn) {
        postSubmitBtn.onclick = createPost;
    }

    if (updateProfileBtn) {
        updateProfileBtn.onclick = updateProfile;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initAuth();
    fetchAnnouncements();
});
