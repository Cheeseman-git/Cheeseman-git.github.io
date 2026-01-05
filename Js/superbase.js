// Replace these with your project's values
const SUPABASE_URL = 'https://xcevjdrtrxlhquomtpzy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AQwAyYHqzQTRI_t6w0jx_A_uBL-6tw0';

// Import the Supabase client (ESM) from npm CDN.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements
// -- Community Auth Elements --
const statusText = document.getElementById('status-text');
const signoutBtn = document.getElementById('signout-btn');
const feedEl = document.getElementById('community-feed');
const userStatusSection = document.getElementById('user-status-section');
const guestPostPrompt = document.getElementById('guest-post-prompt'); // New

// -- Settings Auth Elements --
const authSection = document.getElementById('auth-section');
const accountInfoDisplay = document.getElementById('account-info-display');
const settingsUsername = document.getElementById('settings-username');
const settingsSignoutBtn = document.getElementById('settings-signout-btn');
const settingsDownloadKeyBtn = document.getElementById('settings-download-key-btn');

// -- Profile Elements --
const profileUsernameInput = document.getElementById('profile-username-input');
const updateProfileBtn = document.getElementById('update-profile-btn');


// -- Gatekeeper Elements REMOVED --
const gatekeeperModal = null;


// -- In-App Elements --
const downloadKeyBtn = document.getElementById('download-key-btn');
const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const postType = document.getElementById('post-type');
const postSubmitBtn = document.getElementById('post-submit-btn');


// State
let globalChannel = null;
let topicChannels = new Map();
const FEED_PAGE_SIZE = 5;
let currentOffset = 0;

// ... (other functions)

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
        div.className = 'glass p-6 rounded-3xl border border-white/5 hover:border-cheeseman-primary/30 transition-all group mb-6 animate-fade-in';

        const dateStr = row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Just now';
        const typeLabel = row.topic || row.type || 'Community';
        let iconClass = 'fa-bullhorn';
        let iconColor = 'text-cheeseman-primary';
        if (typeLabel.toLowerCase().includes('update')) { iconClass = 'fa-rotate'; iconColor = 'text-emerald-400'; }
        else if (typeLabel.toLowerCase().includes('event')) { iconClass = 'fa-calendar-star'; iconColor = 'text-pink-400'; }
        else if (typeLabel.toLowerCase().includes('score')) { iconClass = 'fa-trophy'; iconColor = 'text-yellow-400'; }

        // Use profile username if available, fallback to author_name or default
        const authorName = row.profiles?.username || row.author_name || 'Community Member';

        div.innerHTML = `
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${iconColor} text-xl border border-white/5">
           <i class="fa-solid ${iconClass}"></i>
        </div>
        <div>
           <h3 class="font-bold text-white group-hover:text-cheeseman-primary transition-colors text-lg">${row.title || 'Announcement'}</h3>
           <p class="text-xs text-cheeseman-muted font-bold tracking-wide uppercase">
             ${authorName} • ${dateStr} • <span class="${iconColor}">${typeLabel}</span>
             ${row.pinned ? '• <i class="fa-solid fa-thumbtack text-cheeseman-muted"></i>' : ''}
           </p>
        </div>
      </div>
      <p class="text-slate-300 mb-4 leading-relaxed whitespace-pre-line">${row.body || row.content || ''}</p>
      
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

    // If we received a full page of results, there might be more.
    if (rows.length === FEED_PAGE_SIZE) {
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
        fetchAnnouncements(true);
    });
}

// Fetch visible announcements
async function fetchAnnouncements(isLoadMore = false) {
    if (!feedEl) return;

    if (!isLoadMore) {
        // Reset check
        currentOffset = 0;
        if (feedEl.children.length === 0 || feedEl.querySelector('.fa-circle-notch')) {
            feedEl.innerHTML = `
            <div class="text-center py-12">
                <i class="fa-solid fa-circle-notch fa-spin text-cheeseman-primary text-3xl mb-4"></i>
                <p class="text-cheeseman-muted">Refreshing updates...</p>
            </div>`;
        }
    } else {
        // Show loading state on button if needed, or just let it spin
        const btn = document.getElementById('show-more-btn-action');
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...`;
            btn.disabled = true;
        }
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('announcements')
        .select('*, profiles(username)') // Fetch profiles username
        .eq('published', true)
        .or(`publish_at.is.null,publish_at.lte.${now}`)
        .order('created_at', { ascending: false }) // Most recent first
        .range(currentOffset, currentOffset + FEED_PAGE_SIZE - 1);

    if (error) {
        console.error('Fetch error', error);
        if (!isLoadMore) {
            feedEl.innerHTML = '<div class="text-red-400 text-center p-4">Error loading announcements.</div>';
        }
        return;
    }

    // Update offset for next fetch
    currentOffset += data.length;

    renderAnnouncements(data, isLoadMore);
}

// REALTIME
function subscribeRealtime() {
    try {
        if (!globalChannel) {
            globalChannel = supabase.channel('announcements:all', { config: { private: true } })
                .on('broadcast', { event: '*' }, payload => {
                    fetchAnnouncements();
                })
                .subscribe();
        }
    } catch (e) { console.error('Realtime error', e); }
}

async function unsubscribeAll() {
    try {
        if (globalChannel) {
            await supabase.removeChannel(globalChannel);
            globalChannel = null;
        }
    } catch (err) { console.error('Error unsubscribing', err); }
}

// 5. Post Creation
async function createPost() {
    const title = postTitle.value.trim();
    const content = postContent.value.trim();
    const type = postType.value;

    if (!title || !content) {
        alert('Please fill out both title and content.');
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // We no longer rely on author_name in the announcements table for display, 
    // but we can still save it for archival or fallback.
    // Ideally, we rely on the profile.
    const author = localStorage.getItem('cheeseman_username') || user.email.split('@')[0];

    postSubmitBtn.disabled = true;
    postSubmitBtn.textContent = 'Posting...';

    const { error } = await supabase.from('announcements').insert({
        title,
        body: content,
        topic: type,
        published: true,
        author_name: author, // Kept for legacy compatibility
        user_id: user.id
    });

    if (error) {
        alert('Failed to post: ' + error.message);
    } else {
        postTitle.value = '';
        postContent.value = '';
        fetchAnnouncements();
    }
    postSubmitBtn.disabled = false;
    postSubmitBtn.textContent = 'Post';
}

// --- INITIALIZATION ---

async function updateUI(session) {
    if (session) {
        // Logged In
        // Try to get username from profile first, then local, then email
        let user = localStorage.getItem('cheeseman_username');

        // Fetch latest profile data
        const profileName = await getProfile(session.user.id);
        if (profileName) {
            user = profileName;
            localStorage.setItem('cheeseman_username', user);
        } else if (!user) {
            user = session.user.email.split('@')[0];
        }

        // Community View
        if (userStatusSection) userStatusSection.style.display = 'flex';
        if (guestPostPrompt) guestPostPrompt.style.display = 'none';
        if (statusText) statusText.textContent = user;

        // Settings View
        if (authSection) authSection.style.display = 'none';
        if (accountInfoDisplay) accountInfoDisplay.classList.remove('hidden');
        if (settingsUsername) settingsUsername.textContent = user;
        if (profileUsernameInput) profileUsernameInput.value = user;

    } else {
        // Logged Out (Guest)
        // Community View
        if (userStatusSection) userStatusSection.style.display = 'none';
        if (guestPostPrompt) guestPostPrompt.style.display = 'block';

        // Settings View
        if (authSection) authSection.style.display = 'block';
        if (accountInfoDisplay) accountInfoDisplay.classList.add('hidden');
    }
}

async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    updateUI(session);

    supabase.auth.onAuthStateChange((event, session) => {
        updateUI(session);
    });

    if (session) subscribeRealtime();
}

// --- EVENT LISTENERS ---

// Gatekeeper listeners removed


// App Actions
async function handleSignOut() {
    await supabase.auth.signOut();
    localStorage.removeItem('cheeseman_username');
    window.location.reload();
}

if (signoutBtn) signoutBtn.addEventListener('click', handleSignOut);
if (settingsSignoutBtn) settingsSignoutBtn.addEventListener('click', handleSignOut);

if (downloadKeyBtn) downloadKeyBtn.addEventListener('click', downloadSessionKey);
if (settingsDownloadKeyBtn) settingsDownloadKeyBtn.addEventListener('click', downloadSessionKey);

if (postSubmitBtn) {
    postSubmitBtn.addEventListener('click', createPost);
}

if (updateProfileBtn) {
    updateProfileBtn.addEventListener('click', updateProfile);
}

// Init
initAuth();
fetchAnnouncements();
