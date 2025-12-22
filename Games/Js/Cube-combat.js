// UPDATED CUBE DATA WITH SANDBOX STATS
const CUBE_DATA = [
    {
        id: 1, name: "Sword Master", color: "blue", hp: 100, attacks: "Slash, Parry",
        attack1: "[SPACE] Slash: Standard melee attack. Deals 25 dmg.",
        attack2: "[F] Parry: Turns black. Reflects attacks and stuns enemy.",
        counter: "Do not attack when he turns black (Parry). Wait for the parry to end (1 sec) then punish."
    },
    {
        id: 2, name: "Angry Sniper", color: "red", hp: 100, attacks: "Dash (No CD), Laser",
        attack1: "[SPACE] Dash: Quick burst charge. No cooldown.",
        attack2: "[F] Laser: Long range beam. Deals 30 dmg.",
        counter: "The Dash has no cooldown but short range. The Laser has a long windup (turns Cyan/Black). Jump over the laser."
    },
    {
        id: 3, name: "Sniper Cube", color: "green", hp: 100, attacks: "Slash, Laser (Windup)",
        attack1: "[SPACE] Slash: Standard melee.",
        attack2: "[F] Laser: Charges up (flashing) then fires a full screen beam (25 dmg).",
        counter: "Hit him while he is charging the laser. He cannot move while charging."
    },
    {
        id: 4, name: "Magic Cube", color: "hotpink", hp: 100, attacks: "Slash, Block (Bar)",
        attack1: "[SPACE] Slash: Standard melee.",
        attack2: "[F] Block: Creates a shield. Drains energy bar. Negates damage.",
        counter: "Wait for the blue energy bar to deplete. He cannot block forever."
    },
    {
        id: 5, name: "The Jorker", color: "#8B4513", hp: 75, attacks: "Kick, Laser (Windup)",
        attack1: "[SPACE] Kick: Short range, high knockback. 15 dmg + Stun.",
        attack2: "[F] Laser: Yellow beam. 25 dmg.",
        counter: "Low HP (75). Rush him down, but stay out of Kick range to avoid being stunned."
    },
    {
        id: 6, name: "Ima Touch You", color: "indigo", hp: 75, attacks: "Slash, Pull (Invert)",
        attack1: "[SPACE] Slash: Standard melee.",
        attack2: "[F] Pull: Drags enemy closer. If very close, inverts controls.",
        counter: "Low HP. If you see the purple line, run away to break the tether before he touches you."
    },
    {
        id: 7, name: "Vigilante", color: "#2F4F4F", hp: 125, attacks: "Takedown, Drone Support",
        attack1: "[SPACE] Takedown: High speed dash. 20 dmg + knockback.",
        attack2: "[F] Drone: Deploys a drone that shoots automatically.",
        counter: "High HP. Destroy the drone if possible (or just dodge). Jump over the Takedown dash."
    },
    {
        id: 8, name: "Fbt_7 (Secret)", color: "black", hp: 200, attacks: "Delete (Poison), Error 404, Hatred, Termination",
        attack1: "[SPACE] Delete: Poison Slash. [F] 404: Stun/Clone. [Q] Hatred: Rage Mode. [E] Termination: Ultimate.",
        attack2: "Developer character with OP stats.",
        counter: "Run. Survive the Hatred mode (Red glow) by kiting. Pray he misses the Delete slash.",
        dev: true
    },
    {
        id: 9, name: "Master Cube", color: "#FFD700", hp: "100", attacks: "Call back, Overtime",
        attack1: "[SPACE] Overtime: Buffs minion stats to 100%.",
        attack2: "[F] Call Back: Swaps out for a random Minion.",
        counter: "Kill the minion. When the Master returns, he is vulnerable before he can swap again."
    },
    {
        id: 10, name: "Bobbythe124", color: "#CCCCFF", hp: 149, attacks: "Silence, Hatred, Beam, Bleed",
        attack1: "[SPACE] Silence: 35 dmg. [F] Beam: 50 dmg. [E] Bleed: Poison DoT.",
        attack2: "Passive: Jumps get higher each time.",
        counter: "Do not get hit by Silence. Watch out for his super high jumps - he can attack from above.",
        dev: true
    }
];

let selectedCubeId = 1; // Default to Cube 1

let ACHIEVEMENT_DATA = [
    { id: 1, name: "First Blood", desc: "Win your first battle", unlocks: "Sniper Cube", unlocked: false },
    { id: 2, name: "Sharpshooter", desc: "Hit 15 beams total (Red Cube)", unlocks: "Magic Cube", unlocked: false, progress: 0, maxProgress: 15 },
    { id: 3, name: "Unstoppable", desc: "Win without taking damage", unlocks: "The Jorker", unlocked: false },
    { id: 4, name: "Wombo Combo", desc: "Counter an attack then hit every shot to win", unlocks: "Ima Touch You", unlocked: false },
    { id: 5, name: "In every timeline I kill you...", desc: "Lose to Fbt_7  ", unlocks: "Vigilante", unlocked: false },
    { id: 6, name: "Not like this", desc: "Fbt_7 vs Bobbythe124", unlocks: "The heartbreaking (placeholder)", unlocked: false },
    { id: 7, name: "Cube Master", desc: "Unlock all other cubes", unlocks: "Master Cube", unlocked: false }
];

// --- SPECIAL SETTINGS (Dev/Debug/Tester) ---
// These keys will appear in your Local Storage. Edit them to 'true' to activate.

// 1. Initialize keys if they don't exist yet so you can see them in your extension
if (localStorage.getItem('cc_debugMode') === null) localStorage.setItem('cc_debugMode', 'false');
if (localStorage.getItem('cc_dev') === null) localStorage.setItem('cc_dev', 'false');
if (localStorage.getItem('cc_tester') === null) localStorage.setItem('cc_tester', 'false');

// 2. Read values
const IS_DEBUG_MODE = localStorage.getItem('cc_debugMode') === 'true';
const IS_DEV = localStorage.getItem('cc_dev') === 'true';       // Placeholder for now
const IS_TESTER = localStorage.getItem('cc_tester') === 'true'; // Placeholder for now

// 3. Apply Debug Logic
if (IS_DEBUG_MODE) {
    console.log("DEBUG MODE ACTIVE: Unlocking all achievements...");
    // Call unlock with 'true' to silence the alert
    setTimeout(() => unlockAllAchievements(true), 100);
}

if (IS_DEV) console.log("Welcome Developer.");
if (IS_TESTER) console.log("Tester Access Granted.");

// --- ACHIEVEMENT SYSTEM ---

const savedData = localStorage.getItem('cubeCombatData');
if (savedData) {
    const parsed = JSON.parse(savedData);
    ACHIEVEMENT_DATA.forEach(ach => {
        const saved = parsed.find(p => p.id === ach.id);
        if (saved) {
            if (saved.unlocked) ach.unlocked = true;
            if (saved.progress !== undefined) ach.progress = saved.progress; // Restore progress
        }
    });
}

function saveGameData() {
    const toSave = ACHIEVEMENT_DATA.map(a => ({
        id: a.id,
        unlocked: a.unlocked,
        progress: a.progress
    }));
    localStorage.setItem('cubeCombatData', JSON.stringify(toSave));
}

function confirmResetProgress() {
    if (window.confirm("WARNING: Reset all progress?")) {
        localStorage.removeItem('cubeCombatData');
        ACHIEVEMENT_DATA.forEach(ach => {
            ach.unlocked = false;
            if (ach.progress !== undefined) ach.progress = 0;
        });
        selectedCubeId = 1;
        alert("Progress reset.");
        navTo('screen-main');
    }
}

function unlockAllAchievements(silent = false) {
    ACHIEVEMENT_DATA.forEach(ach => {
        ach.unlocked = true;
        if (ach.maxProgress) ach.progress = ach.maxProgress;
    });
    saveGameData();
    renderAchievements();

    // Only show alert if called manually (not via auto-debug)
    if (!silent) {
        alert("All achievements unlocked via Debug Mode!");
    }
}

function unlockAchievement(id) {
    const ach = ACHIEVEMENT_DATA.find(a => a.id === id);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        showAchievementToast(ach.name);
        saveGameData();

        if (ACHIEVEMENT_DATA.filter(a => a.id !== 6).every(a => a.unlocked)) unlockAchievement(6);
    }
}

function showAchievementToast(name) {
    const toast = document.getElementById('achievement-toast');
    document.getElementById('toast-message').innerText = name;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// SESSION STATS
let sessionStats = {
    beamStreak: 0,
    womboComboActive: false,
    womboComboHits: 0
};
let floatingTexts = []; // Store floating damage numbers
let particles = []; // Store visual effects
let shakeMagnitude = 0; // Screen shake intensity

// --- GLOBAL GAME MODES ---
let isRetroMode = false;
let shatterActive = false;
let shatterShards = [];

// --- NETWORK VARS ---
let peer = null;
let conn = null;
let p2pRole = null;
let networkKeys = {};

// --- NAVIGATION FLOW VARS ---
let pendingGameMode = null;
let returnScreenId = 'screen-main';

function quitGame() {
    if (window.parent && typeof window.parent.closeGame === 'function') {
        window.parent.closeGame();
    } else {
        window.location.href = '/';
    }
}

function navTo(screenId) {
    document.querySelectorAll('.menu-screen').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// New Flow: Select Mode -> Select Character
function prepareGame(mode, fromScreen) {
    pendingGameMode = mode;
    returnScreenId = fromScreen || 'screen-main';
    navTo('screen-cubes');
    renderCubes();
}

function handleCubeBack() {
    navTo(returnScreenId);
    pendingGameMode = null;
}

function confirmSelection() {
    if (!pendingGameMode) return;

    if (pendingGameMode === 'p2p_setup') {
        // P2P Flow: Setup Character -> Go to Lobby
        navTo('screen-p2p-lobby');
    } else {
        // Standard Flow: Character -> Start
        startGame(pendingGameMode);
    }
}

function renderCubes() {
    const container = document.getElementById('cubes-grid-container');
    container.innerHTML = '';

    // UI Updates for Flow
    const actionBtn = document.getElementById('btn-confirm-selection');
    if (pendingGameMode) {
        actionBtn.style.display = 'block';
        actionBtn.innerText = (pendingGameMode === 'p2p_setup') ? 'TO LOBBY >' : 'FIGHT!';
    } else {
        actionBtn.style.display = 'none';
    }

    // Prepare display list
    // Prepare display list
    let displayList = CUBE_DATA.filter(c => !c.dev || IS_DEV);

    // Find special Master Cube (ID 9) - FIXED FROM ID 7
    const masterCube = displayList.find(c => c.id === 9);
    const masterUnlocked = ACHIEVEMENT_DATA.find(a => a.id === 6).unlocked;

    // Remove ID 9 from standard list to handle placement manually
    displayList = displayList.filter(c => c.id !== 9);

    // Logic: "shows up as the first one ... pushing the rest down"
    if (masterUnlocked && masterCube) {
        displayList.unshift(masterCube);
    }

    displayList.forEach((cube) => {
        const div = document.createElement('div');

        let isLocked = false;

        // Standard locking logic (skip for ID 9 as visibility handles it, skip ID 10 bobbythe124 - not locked)
        if (cube.id !== 9 && cube.id !== 10 && cube.id > 2) {
            const unlockingAchievement = ACHIEVEMENT_DATA.find(a => a.unlocks === cube.name);
            if (unlockingAchievement && !unlockingAchievement.unlocked) {
                isLocked = true;
            }
        }

        div.className = 'cube-icon' + (isLocked ? ' locked' : '') + (selectedCubeId === cube.id ? ' selected' : '');
        div.style.backgroundColor = cube.color;

        if (!isLocked) {
            div.onclick = () => {
                selectedCubeId = cube.id;
                selectCube(cube, div);
                renderCubes();
            };
        } else {
            div.title = 'Locked';
        }
        container.appendChild(div);
    });

    // Restore detail view if something is selected
    const currentCube = CUBE_DATA.find(c => c.id === selectedCubeId);
    if (currentCube) selectCube(currentCube, null);
}

function selectCube(cube, element) {
    const panel = document.getElementById('cube-details-panel');
    panel.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
        <div style="background:${cube.color}; width:80px; height:80px; display:inline-block; border:2px solid white;"></div>
    </div>
    <div class="detail-row"><div class="detail-label">Name:</div><div class="detail-value">${cube.name}</div></div>
    <div class="detail-row"><div class="detail-label">Color:</div><div class="detail-value" style="text-transform:capitalize;">${cube.color}</div></div>
    <div class="detail-row"><div class="detail-label">Max HP:</div><div class="detail-value">${cube.hp}</div></div>
    <div class="detail-row"><div class="detail-label">Attacks:</div><div class="detail-value">${cube.attacks}</div></div>
    <div style="margin-top:20px; color:#00FF00; font-weight:bold; text-align:center;">${selectedCubeId === cube.id ? 'SELECTED' : ''}</div>
`;
}

function renderAchievements() {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';
    ACHIEVEMENT_DATA.forEach(ach => {
        const div = document.createElement('div');
        div.className = `achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`;

        // Build progress bar HTML if maxProgress exists
        let progressHtml = '';
        if (ach.maxProgress) {
            const current = ach.progress || 0;
            const pct = Math.min(100, (current / ach.maxProgress) * 100);
            progressHtml = `
            <div style="width: 100%; background: #222; height: 10px; margin-top: 8px; border-radius: 5px; position: relative; border: 1px solid #555;">
                <div style="width: ${pct}%; background: ${ach.unlocked ? '#00aa00' : '#00FFFF'}; height: 100%; border-radius: 5px; transition: width 0.3s;"></div>
                <div style="position: absolute; top: -18px; right: 0; font-size: 12px; color: #ccc;">${current}/${ach.maxProgress}</div>
            </div>
        `;
        }

        div.innerHTML = `
        <div style="width: 100%;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 24px; font-weight:bold;">#${ach.id} - ${ach.name}</div>
                <div style="font-size: 20px; font-weight:bold;">${ach.unlocked ? 'UNLOCKED' : 'LOCKED'}</div>
            </div>
            <div style="font-size: 16px; margin-top:5px;">${ach.desc}</div>
            ${progressHtml}
            <div style="font-size: 14px; margin-top:5px; font-style:italic;">Unlocks: ${ach.unlocks}</div>
        </div>
    `;
        container.appendChild(div);
    });
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = 800;
const HEIGHT = 600;

const GRAVITY = 0.6;
const FRICTION = 0.8;
const MOVE_SPEED = 5;
const JUMP_FORCE = 14;
const FLOOR_Y = HEIGHT - 50;
const CUBE_SIZE = 50;

const COLORS = {
    BLUE: '#0000FF',
    RED: '#FF0000',
    CYAN: '#00FFFF',
    PURPLE: '#800080',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY: '#C8C8C8'
};

let gameMode = 'ai';
let gameState = 'menu';
let winner = null;
let animationId = null;

const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Escape') {
        if (gameState === 'playing') showMainMenu();
        else if (gameState === 'menu' && !document.getElementById('screen-main').classList.contains('active')) {
            if (document.getElementById('screen-cubes').classList.contains('active')) {
                handleCubeBack();
            } else {
                navTo('screen-main');
            }
        }
    }
    if (e.code === 'KeyR') {
        if (gameState === 'gameover') requestRestart();
        if (gameState === 'playing' && gameMode === 'sandbox') toggleSandboxMenu();
    }
});
window.addEventListener('keyup', e => keys[e.code] = false);

// --- P2P LOGIC ---
function initP2PHost() {
    resetP2P();
    document.getElementById('p2p-buttons').style.display = 'none';
    document.getElementById('p2p-host-section').style.display = 'block';
    document.getElementById('p2p-status-msg').innerText = "Initializing Peer...";
    peer = new Peer();
    peer.on('open', (id) => {
        document.getElementById('host-id-display').value = id;
        document.getElementById('p2p-status-msg').innerText = "Wait for Player 2 to join...";
        p2pRole = 'host';
    });
    peer.on('connection', (c) => {
        conn = c;
        setupConnection();
    });
}

function initP2PJoin() {
    resetP2P();
    document.getElementById('p2p-buttons').style.display = 'none';
    document.getElementById('p2p-join-section').style.display = 'block';
    p2pRole = 'client';
}

function connectToHost() {
    const hostId = document.getElementById('join-id-input').value.trim();
    if (!hostId) return alert("Please enter the Host ID");
    document.getElementById('p2p-status-msg').innerText = "Connecting...";
    peer = new Peer();
    peer.on('open', () => {
        conn = peer.connect(hostId);
        setupConnection();
    });
}

function setupConnection() {
    conn.on('open', () => {
        document.getElementById('p2p-status-msg').innerText = "Connected! Starting Game...";
        if (p2pRole === 'host') {
            setTimeout(() => {
                conn.send({ type: 'START_GAME' });
                startGame('p2p');
            }, 1000);
        }
    });
    conn.on('data', (data) => handleNetworkData(data));
    conn.on('close', () => {
        alert("Connection lost");
        showMainMenu();
    });
}

function resetP2P() {
    if (peer) peer.destroy();
    peer = null;
    conn = null;
    p2pRole = null;
    networkKeys = {};
    document.getElementById('p2p-buttons').style.display = 'block';
    document.getElementById('p2p-host-section').style.display = 'none';
    document.getElementById('p2p-join-section').style.display = 'none';
    document.getElementById('p2p-status-msg').innerText = "Select Host or Join";
    document.getElementById('join-id-input').value = "";
}

function handleNetworkData(data) {
    if (data.type === 'INPUT') {
        networkKeys = data.keys;
    } else if (data.type === 'START_GAME') {
        if (p2pRole === 'client') startGame('p2p');
    } else if (data.type === 'STATE') {
        if (gameState === 'playing') {
            applyStateToCube(blueCube, data.p1);
            applyStateToCube(redCube, data.p2);
            updateUI();

            // Sync global modes
            isRetroMode = data.isRetroMode;
            shatterActive = data.shatterActive;
            if (data.shards) shatterShards = data.shards;
        }
    } else if (data.type === 'GAMEOVER') {
        gameState = 'gameover';
        winner = data.winner;
        showGameOver();
    } else if (data.type === 'RESTART') {
        restartGame(true);
    }
}

function applyStateToCube(cube, state) {
    cube.x = state.x;
    cube.y = state.y;
    cube.color = state.color;
    cube.hp = state.hp;
    cube.dead = cube.hp <= 0;
    cube.facingRight = state.facingRight;
}

// --- EFFECT CLASSES ---

class Particle {
    constructor(x, y, color, speed, life, type = 'spark') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.type = type;
        this.size = Math.random() * 3 + 2;
        this.gravity = 0.2;

        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        if (type === 'beam_charge') {
            this.gravity = 0;
            this.vx = 0;
            this.vy = 0;
        } else if (type === 'bubble') {
            this.gravity = -0.05; // float up
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = -Math.random() * 2;
        }
    }

    update() {
        if (this.type === 'beam_charge') {
            // Suck into center logic handled by spawner often, 
            // but here we just fade.
            this.size *= 0.9;
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
        }
        this.life--;
        if (this.type !== 'bubble') this.size *= 0.95;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;

        if (this.type === 'square') {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'bubble') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }
}

function spawnParticles(x, y, color, count, type = 'spark') {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color, Math.random() * 5 + 2, 30, type));
    }
}

function triggerShake(amount) {
    shakeMagnitude = amount;
}

class FloatingText {
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 60; // Frames
        this.vy = -2;
    }
    update() {
        this.y += this.vy;
        this.life--;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life / 60;
        ctx.fillStyle = this.color;
        ctx.font = "bold 24px Arial";
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1.0;
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

class Entity {
    constructor(x, y, color, maxHp) {
        this.x = x;
        this.y = y;
        this.w = CUBE_SIZE;
        this.h = CUBE_SIZE;
        this.color = color;
        this.baseColor = color;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.dead = false;
        this.facingRight = true;
        this.invertControlsTimer = 0; // For Cube 6 mechanic
        this.damageMult = 1.0; // For weak minion logic
    }

    update() {
        if (gameMode === 'p2p' && p2pRole === 'client') return;
        if (this.dead) return;

        if (this.invertControlsTimer > 0) this.invertControlsTimer--;

        if (isRetroMode) {
            // Retro Physics: Top Down, No Gravity, X/Y Friction
            this.x += this.vx;
            this.y += this.vy;

            // Wall bounds (all 4 sides)
            if (this.x < 0) this.x = 0;
            if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;
            if (this.y < 0) this.y = 0;
            if (this.y + this.h > HEIGHT) this.y = HEIGHT - this.h;

            this.vx *= FRICTION;
            this.vy *= FRICTION;

            if (Math.abs(this.vx) < 0.1) this.vx = 0;
            if (Math.abs(this.vy) < 0.1) this.vy = 0;

        } else {
            // Normal Physics
            this.vy += GRAVITY;
            this.x += this.vx;
            this.y += this.vy;

            if (this.y + this.h >= FLOOR_Y) {
                this.y = FLOOR_Y - this.h;
                this.vy = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }

            if (this.x < 0) this.x = 0;
            if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;

            this.vx *= FRICTION;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }
    }

    draw(ctx) {
        if (this.dead) return;

        if (isRetroMode) {
            // Simple Retro Draw
            ctx.fillStyle = this.color === COLORS.BLACK ? 'blue' : (this.color === COLORS.RED ? 'red' : this.color);
            // Force P1 blue/P2 red for retro aesthetic unless strictly defined otherwise
            if (this === blueCube) ctx.fillStyle = "blue";
            if (this === redCube) ctx.fillStyle = "red";

            ctx.fillRect(this.x, this.y, this.w, this.h);
            return;
        }

        // Normal Draw
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        // Invert indicator
        if (this.invertControlsTimer > 0) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("?", this.x + 20, this.y - 10);
        }

        ctx.fillStyle = "white";
        const eyeX = this.facingRight ? this.x + 30 : this.x + 10;
        ctx.fillRect(eyeX, this.y + 10, 10, 10);
    }

    takeDamage(amount) {
        if (gameMode === 'p2p' && p2pRole === 'client') return;
        if (this.dead) return;

        // SANDBOX LOGIC: SHOW TEXT
        if (gameMode === 'sandbox') {
            floatingTexts.push(new FloatingText(this.x + Math.random() * 20, this.y, Math.round(amount), "#FF0000"));
            spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "gray", 5, 'square');
            return; // Don't actually take damage
        }

        // VISUAL EFFECTS
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, this.color, 10, 'square');
        if (amount > 15) triggerShake(amount / 2);

        // WOMBO COMBO FAIL: Taking Damage
        if (this === blueCube) {
            sessionStats.womboComboActive = false;
        }

        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            spawnParticles(this.x + this.w / 2, this.y + this.h / 2, this.color, 40, 'square');
            checkGameOver();
        }
        updateUI();
    }
}

// --- PLAYER CUBES ---

// CUBE 1: SWORD MASTER (Base)
class BlueCube extends Entity {
    constructor() {
        super(50, FLOOR_Y - CUBE_SIZE, COLORS.BLUE, 100);
        this.slashCooldown = 0;
        this.slashActive = false;
        this.slashTimer = 0;
        this.parryActive = false;
        this.parryTimer = 0;
        this.parryCooldown = 0;
    }

    update() {
        super.update();
        if (gameMode === 'p2p' && p2pRole === 'client') return;
        if (this.dead) return;

        if (IS_TESTER) {
            this.slashCooldown = 0;
            this.parryCooldown = 0;
        }
        if (this.slashCooldown > 0) this.slashCooldown--;
        if (this.parryCooldown > 0) this.parryCooldown--;

        // Handle Control Inversion
        let inputLeft = keys['KeyA'];
        let inputRight = keys['KeyD'];
        let inputUp = keys['KeyW'];
        let inputDown = keys['KeyS'];

        if (this.invertControlsTimer > 0) {
            const temp = inputLeft;
            inputLeft = inputRight;
            inputRight = temp;
            const tempY = inputUp;
            inputUp = inputDown;
            inputDown = tempY;
        }

        if (!this.parryActive) {
            // Movement Logic
            if (isRetroMode) {
                if (inputLeft) this.vx = -MOVE_SPEED;
                if (inputRight) this.vx = MOVE_SPEED;
                if (inputUp) this.vy = -MOVE_SPEED;
                if (inputDown) this.vy = MOVE_SPEED;

                if (inputRight) this.facingRight = true;
                if (inputLeft) this.facingRight = false;

                // Allow simple collision attack in retro mode
                if (rectIntersect(this.x, this.y, this.w, this.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
                    if (this.slashCooldown <= 0) {
                        redCube.takeDamage(10);
                        redCube.vx = this.facingRight ? 10 : -10;
                        redCube.vy = inputUp ? -10 : 10;
                        this.slashCooldown = 30;
                    }
                }

            } else {
                if (inputLeft) {
                    this.vx = -MOVE_SPEED;
                    this.facingRight = false;
                }
                if (inputRight) {
                    this.vx = MOVE_SPEED;
                    this.facingRight = true;
                }
                if (keys['KeyW'] && this.isGrounded) {
                    this.vy = -JUMP_FORCE;
                }
            }

            // Attack Logic (Only in Normal Mode usually, but let's allow it in Retro for gameplay)
            if (keys['Space'] && this.slashCooldown <= 0) {
                this.performSlash();
            }
        }

        if (keys['KeyF'] && this.parryCooldown <= 0 && !this.parryActive && !isRetroMode) {
            if (this.constructor.name === 'BlueCube' && !(this instanceof GoldCube)) {
                this.parryActive = true;
                this.parryTimer = 30;
                this.color = COLORS.BLACK;
            }
        }

        if (this.parryActive) {
            this.parryTimer--;
            this.vx = 0;
            if (this.parryTimer <= 0) {
                this.parryActive = false;
                this.color = this.baseColor;
                this.parryCooldown = 60;
            }
        }

        if (this.slashActive) {
            this.slashTimer--;
            if (this.slashTimer <= 0) this.slashActive = false;
        }
    }

    performSlash() {
        this.slashActive = true;
        this.slashTimer = 15;
        this.slashCooldown = 60;

        const reach = 70;
        const hitX = this.facingRight ? this.x + this.w : this.x - reach;

        // Visual Effect
        spawnParticles(hitX + reach / 2, this.y + this.h / 2, "white", 5, 'spark');

        if (!redCube.dead && rectIntersect(hitX, this.y, reach, this.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
            if (!redCube.isInvincible) {
                // Apply Damage Multiplier
                redCube.takeDamage(20 * this.damageMult);
                redCube.vx = this.facingRight ? 10 : -10;
                redCube.vy = -5;
                // Combo Logic: Hit
                if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
            }
        } else {
            // Combo Logic: Miss
            sessionStats.womboComboActive = false;
        }
    }

    draw(ctx) {
        super.draw(ctx);
        if (this.dead) return;
        if (isRetroMode) return; // No slash visuals in Retro

        if (this.slashActive) {
            ctx.fillStyle = "rgba(128, 0, 128, 0.6)";
            const reach = 70;
            const hitX = this.facingRight ? this.x + this.w : this.x - reach;

            // Draw fancy arc
            ctx.beginPath();
            if (this.facingRight) {
                ctx.arc(this.x + this.w / 2, this.y + this.h / 2, reach, -Math.PI / 2, Math.PI / 2);
            } else {
                ctx.arc(this.x + this.w / 2, this.y + this.h / 2, reach, Math.PI / 2, -Math.PI / 2);
            }
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.fillRect(hitX, this.y, reach, this.h);
        }

        if (this.parryActive) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 40, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// CUBE 3: SNIPER CUBE
class GreenCube extends BlueCube {
    constructor() {
        super();
        this.color = "green";
        this.baseColor = "green";
        this.beamState = 'IDLE'; // IDLE, WINDUP, FIRING
        this.beamTimer = 0;
    }

    update() {
        super.update(); // Handles slash (Space)
        if (this.dead) return;
        if (isRetroMode) return; // No special moves in retro

        if (this.beamState !== 'IDLE') {
            this.vx = 0;
            this.beamTimer--;

            if (this.beamState === 'WINDUP') {
                this.color = (Math.floor(Date.now() / 100) % 2 === 0) ? "green" : "white";

                // Suck in particles
                if (Math.random() < 0.5) {
                    const angle = Math.random() * Math.PI * 2;
const dist = 60;
const px = this.x + this.w / 2 + Math.cos(angle) * dist;
const py = this.y + this.h / 2 + Math.sin(angle) * dist;
const p = new Particle(px, py, "#00FF00", 0, 10, 'beam_charge');
p.vx = (this.x + this.w / 2 - px) * 0.1;
p.vy = (this.y + this.h / 2 - py) * 0.1;
particles.push(p);
                }

if (this.beamTimer <= 0) {
    this.beamState = 'FIRING';
    this.beamTimer = 15;
    this.fireBeam();
}
            } else if (this.beamState === 'FIRING') {
    this.color = "green";
    if (this.beamTimer <= 0) this.beamState = 'IDLE';
}
        } else {
    if (keys['KeyF']) {
        this.beamState = 'WINDUP';
        this.beamTimer = 40;
    }
}
    }

fireBeam() {
    const beamW = 600;
    const beamH = 30;
    const beamX = this.facingRight ? this.x + this.w : this.x - beamW;
    const beamY = this.y + 15;

    triggerShake(10);
    spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "#00FF00", 20, 'spark');

    if (rectIntersect(beamX, beamY, beamW, beamH, redCube.x, redCube.y, redCube.w, redCube.h)) {
        spawnParticles(redCube.x + redCube.w / 2, redCube.y + redCube.h / 2, "#00FF00", 15, 'spark');
        redCube.takeDamage(20 * this.damageMult);
        redCube.vx = this.facingRight ? 15 : -15;
        if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
    } else {
        sessionStats.womboComboActive = false;
    }
}

draw(ctx) {
    super.draw(ctx);
    if (isRetroMode) return;

    if (this.beamState === 'FIRING') {
        ctx.fillStyle = "#00FF00";
        const beamW = 600;
        const beamX = this.facingRight ? this.x + this.w : this.x - beamW;

        // Glowy beam
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00FF00";
        ctx.fillRect(beamX, this.y + 15, beamW, 30);

        // Inner core
        ctx.fillStyle = "white";
        ctx.fillRect(beamX, this.y + 22, beamW, 16);

        ctx.shadowBlur = 0;
    }
}
}

// CUBE 4: MAGIC CUBE
class PinkCube extends BlueCube {
    constructor() {
        super();
        this.color = "hotpink";
        this.baseColor = "hotpink";
        this.blockEnergy = 100;
        this.isBlocking = false;
    }

    update() {
        if (isRetroMode) {
            super.update();
            return;
        }
        // Regen
        if (IS_TESTER) this.blockEnergy = 100;
        if (!this.isBlocking && this.blockEnergy < 100) this.blockEnergy += 0.5;

        // Block Logic (Override F from Base)
        if (keys['KeyF'] && this.blockEnergy > 0) {
            this.isBlocking = true;
            this.blockEnergy -= 2.0;
            this.vx = 0;
            this.color = "#FFC0CB";
            // Disable slash while blocking
        } else {
            this.isBlocking = false;
            this.color = this.baseColor;
            super.update(); // Normal movement/slash
        }
    }

    takeDamage(amount) {
        if (this.isBlocking) {
            // Negate damage, drain energy
            this.blockEnergy -= 20;
            spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "cyan", 5, 'spark');
            if (this.blockEnergy < 0) this.blockEnergy = 0;
        } else {
            super.takeDamage(amount);
        }
    }

    draw(ctx) {
        super.draw(ctx);
        if (isRetroMode) return;
        // Draw Block Bar
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 15, this.w, 8);
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.x, this.y - 15, this.w * (this.blockEnergy / 100), 8);

        if (this.isBlocking) {
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 45, 0, Math.PI * 2);
            ctx.stroke();

            // Ripple effect (visual trick)
            ctx.strokeStyle = `rgba(0, 255, 255, ${Math.random() * 0.5})`;
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 50 + Math.random() * 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// CUBE 5: THE JORKER
class BrownCube extends BlueCube {
    constructor() {
        super();
        this.maxHp = 75;
        this.hp = 75;
        this.color = "#8B4513";
        this.baseColor = "#8B4513";
        this.beamState = 'IDLE';
        this.beamTimer = 0;
    }

    update() {
        if (isRetroMode) {
            super.update();
            return;
        }
        // Laser Logic
        if (this.beamState !== 'IDLE') {
            this.vx = 0;
            this.beamTimer--;
            if (this.beamState === 'WINDUP') {
                this.color = (Math.floor(Date.now() / 100) % 2 === 0) ? this.baseColor : "yellow";
                if (this.beamTimer <= 0) {
                    this.beamState = 'FIRING';
                    this.beamTimer = 15;
                    this.fireBeam();
                }
            } else if (this.beamState === 'FIRING') {
                this.color = this.baseColor;
                if (this.beamTimer <= 0) this.beamState = 'IDLE';
            }
            return;
        }

        if (keys['KeyF'] && this.beamState === 'IDLE') {
            this.beamState = 'WINDUP';
            this.beamTimer = 40;
        }

        // Standard movement
        super.update();
    }

    // Override Slash with Kick
    performSlash() {
        this.slashActive = true;
        this.slashTimer = 10;
        this.slashCooldown = 50;

        const reach = 60;
        const hitX = this.facingRight ? this.x + this.w : this.x - reach;

        if (rectIntersect(hitX, this.y + 20, reach, 30, redCube.x, redCube.y, redCube.w, redCube.h)) {
            redCube.takeDamage(15 * this.damageMult);
            // HIGH Knockback
            redCube.vx = this.facingRight ? 25 : -25;
            redCube.vy = -10;
            redCube.state = 'STUNNED'; // Mini stun
            redCube.stateTimer = 20;
            spawnParticles(redCube.x + redCube.w / 2, redCube.y + redCube.h / 2, "yellow", 10, 'spark');
            triggerShake(8);
            if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    fireBeam() {
        const beamW = 600;
        const beamX = this.facingRight ? this.x + this.w : this.x - beamW;
        triggerShake(10);
        if (rectIntersect(beamX, this.y + 15, beamW, 30, redCube.x, redCube.y, redCube.w, redCube.h)) {
            redCube.takeDamage(20 * this.damageMult);
            spawnParticles(redCube.x + redCube.w / 2, redCube.y + redCube.h / 2, "yellow", 10, 'spark');
            if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    draw(ctx) {
        super.draw(ctx);
        if (isRetroMode) return;
        if (this.beamState === 'FIRING') {
            ctx.fillStyle = "yellow";
            const beamW = 600;
            const beamX = this.facingRight ? this.x + this.w : this.x - beamW;

            ctx.shadowBlur = 15;
            ctx.shadowColor = "yellow";
            ctx.fillRect(beamX, this.y + 15, beamW, 30);

            ctx.fillStyle = "white";
            ctx.fillRect(beamX, this.y + 22, beamW, 16);

            ctx.shadowBlur = 0;
        }
    }
}

// CUBE 6: IMA TOUCH YOU
class PurpleCube extends BlueCube {
    constructor() {
        super();
        this.maxHp = 75;
        this.hp = 75;
        this.color = "indigo";
        this.baseColor = "indigo";
        this.pullActive = false;
        this.pullTimer = 0;
        this.pullCooldown = 0;
        this.pullWindup = 0; // NEW
    }

    update() {
        if (isRetroMode) {
            super.update();
            return;
        }
        if (IS_TESTER) this.pullCooldown = 0;
        if (this.pullCooldown > 0) this.pullCooldown--;

        // PULL WINDUP
        if (this.pullWindup > 0) {
            this.pullWindup--;
            this.vx = 0;
            this.color = (Math.floor(Date.now() / 50) % 2 === 0) ? "purple" : "indigo";
            if (this.pullWindup <= 0) {
                this.executePull();
            }
            return;
        }

        if (this.pullActive) {
            this.pullTimer--;
            this.vx = 0;

            // Pull mechanics
            const dx = this.x - redCube.x;
            const dist = Math.abs(dx);

            // If close enough, drag them
            if (dist < 500) {
                redCube.vx = (dx > 0) ? 8 : -8;

                // Invert Controls Effect (3 seconds = ~180 frames)
                // Apply if we actually "touch" them (get close)
                if (dist < 80) {
                    redCube.invertControlsTimer = 180;
                }
            }

            if (this.pullTimer <= 0) this.pullActive = false;
            return;
        }

        // Trigger Pull
        if (keys['KeyF'] && this.pullCooldown <= 0 && this.pullWindup <= 0 && !this.pullActive) {
            this.pullWindup = 20; // 0.3s Windup
        }

        super.update();
    }

    executePull() {
        this.pullActive = true;
        this.pullTimer = 30;
        this.pullCooldown = 120;
        this.color = "purple";
    }

    draw(ctx) {
        super.draw(ctx);
        if (isRetroMode) return;

        // Windup Indicator
        if (this.pullWindup > 0) {
            ctx.strokeStyle = "rgba(128, 0, 128, 0.5)";
            ctx.beginPath();
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 100 - this.pullWindup * 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.pullActive) {
            ctx.strokeStyle = "purple";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.x + this.w / 2, this.y + this.h / 2);
            ctx.lineTo(redCube.x + redCube.w / 2, redCube.y + redCube.h / 2);
            ctx.stroke();

            // Electric effect
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + this.w / 2, this.y + this.h / 2);
            const midX = (this.x + redCube.x) / 2 + (Math.random() - 0.5) * 50;
            const midY = (this.y + redCube.y) / 2 + (Math.random() - 0.5) * 50;
            ctx.lineTo(midX, midY);
            ctx.lineTo(redCube.x + redCube.w / 2, redCube.y + redCube.h / 2);
            ctx.stroke();
        }
    }
}

// CUBE 7: VIGILANTE
class VigilanteCube extends BlueCube {
    constructor() {
        super();
        this.color = "#2F4F4F";
        this.baseColor = "#2F4F4F";
        this.maxHp = 125;
        this.hp = 125;

        // Dash Vars
        this.dashActive = false;
        this.dashTimer = 0;
        this.dashHit = false; // Added to track hit for combo logic

        // Drone Vars
        this.droneActive = false;
        this.droneTimer = 0;
        this.droneCooldown = 0;
        this.droneX = this.x;
        this.droneY = this.y - 100;
        this.droneFireTimer = 0;
    }

    update() {
        if (this.dead) return;
        if (isRetroMode) {
            super.update();
            return;
        }

        // Cooldowns
        if (IS_TESTER) {
            this.slashCooldown = 0;
            this.droneCooldown = 0;
        }
        if (this.slashCooldown > 0) this.slashCooldown--;
        if (this.droneCooldown > 0) this.droneCooldown--;

        // DRONE UPDATE LOGIC
        if (this.droneActive) {
            this.droneTimer--;

            // Drone Movement (Hover over enemy)
            let targetX = redCube.x;
            let targetY = redCube.y - 150;

            // Smooth Lerp
            this.droneX += (targetX - this.droneX) * 0.1;
            this.droneY += (targetY - this.droneY) * 0.1;

            // Fire Logic
            this.droneFireTimer--;
            if (this.droneFireTimer <= 0) {
                this.droneFireTimer = 60; // Fire every 1 second
                // Hitscan check (simple)
                if (Math.abs(this.droneX - redCube.x) < 50) {
                    redCube.takeDamage(5);
                    spawnParticles(redCube.x + redCube.w / 2, redCube.y, "cyan", 5, 'spark');
                }
            }

            if (this.droneTimer <= 0) {
                this.droneActive = false;
                this.droneCooldown = 900; // 15 seconds cooldown
            }
        }

        // Input Handling (Dash/Attack)
        // Override 'Space' for Dash-Attack
        if (keys['Space'] && this.slashCooldown <= 0 && !this.dashActive) {
            this.performSlash();
        }

        // Override 'F' for Drone
        if (keys['KeyF'] && !this.droneActive && this.droneCooldown <= 0) {
            this.droneActive = true;
            this.droneTimer = 480; // 8 Seconds
            this.droneX = this.x; // Spawn at player
            this.droneY = this.y - 50;
            this.droneFireTimer = 30;
        }

        // DASH STATE
        if (this.dashActive) {
            this.vx = this.facingRight ? 20 : -20; // High speed
            this.dashTimer--;

            // Dust trail
            if (this.isGrounded) {
                spawnParticles(this.x + this.w / 2, this.y + this.h, "#555", 1, 'square');
            }

            // Collision during dash
            if (rectIntersect(this.x, this.y, this.w, this.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
                redCube.takeDamage(15);
                redCube.vx = this.facingRight ? 15 : -15; // Knockback
                redCube.vy = -5;
                triggerShake(8);

                // Stop dash on impact
                this.dashActive = false;
                this.vx = this.facingRight ? -5 : 5; // Bounce back
                this.dashHit = true;

                if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
            }

            if (this.dashTimer <= 0) {
                this.dashActive = false;
                // Missed dash - Break Combo
                if (!this.dashHit) {
                    sessionStats.womboComboActive = false;
                }
            }

            // Gravity applies during dash (optional, but keeps it grounded)
            this.vy += GRAVITY;
            this.x += this.vx;
            this.y += this.vy;
            if (this.y + this.h >= FLOOR_Y) {
                this.y = FLOOR_Y - this.h;
                this.vy = 0;
                this.isGrounded = true;
            }
        } else {
            super.update(); // Normal movement when not dashing
        }
    }

    performSlash() {
        // Takedown Dash logic
        this.dashActive = true;
        this.dashTimer = 15; // Short burst
        this.slashCooldown = 60; // 1 second cooldown
        this.dashHit = false; // Reset hit tracker
    }

    draw(ctx) {
        super.draw(ctx);
        if (isRetroMode) return;

        // Draw Dash Afterimage effect
        if (this.dashActive) {
            ctx.fillStyle = "rgba(47, 79, 79, 0.5)";
            ctx.fillRect(this.x - (this.facingRight ? 20 : -20), this.y, this.w, this.h);
        }

        // Draw Drone
        if (this.droneActive) {
            // Drone Body
            ctx.fillStyle = "#00FFFF";
            ctx.fillRect(this.droneX, this.droneY, 30, 10);
            ctx.fillStyle = "white";
            ctx.fillRect(this.droneX + 10, this.droneY - 5, 10, 5); // Propeller area

            // Laser Beam (Flash)
            if (this.droneFireTimer > 55) { // Show beam for first 5 frames of cycle
                ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
                ctx.fillRect(this.droneX + 14, this.droneY + 10, 2, redCube.y - this.droneY);

                // Muzzle flash
                ctx.beginPath();
                ctx.arc(this.droneX + 15, this.droneY + 10, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Connecting line (optional, high tech look)
            ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
            ctx.beginPath();
            ctx.moveTo(this.x + this.w / 2, this.y);
            ctx.lineTo(this.droneX + 15, this.droneY + 10);
            ctx.stroke();
        }
    }
}

// CUBE 2: ANGRY SNIPER (Player Version)
class AngrySniperCube extends BlueCube {
    constructor() {
        super();
        this.color = "red";
        this.baseColor = "red";
        this.dashActive = false;
        this.dashTimer = 0;
        this.dashWindup = 0; // NEW: Windup timer
        this.dashCooldown = 0; // NEW: Cooldown
        this.dashHit = false;
        this.beamState = 'IDLE';
        this.beamTimer = 0;
    }

    update() {
        if (this.dead) return;

        // Cooldown Management
        if (IS_TESTER) this.dashCooldown = 0;
        if (this.dashCooldown > 0) this.dashCooldown--;

        if (isRetroMode) {
            super.update();
            return;
        }

        // BEAM LOGIC
        if (this.beamState !== 'IDLE') {
            this.vx = 0; // Stop moving
            this.beamTimer--;

            if (this.beamState === 'WINDUP') {
                this.color = (Math.floor(Date.now() / 100) % 2 === 0) ? "cyan" : "black";
                // Charge particles
                if (Math.random() < 0.5) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 60;
                    const px = this.x + this.w / 2 + Math.cos(angle) * dist;
                    const py = this.y + this.h / 2 + Math.sin(angle) * dist;
                    const p = new Particle(px, py, "red", 0, 10, 'beam_charge');
                    p.vx = (this.x + this.w / 2 - px) * 0.1;
                    p.vy = (this.y + this.h / 2 - py) * 0.1;
                    particles.push(p);
                }
                if (this.beamTimer <= 0) {
                    this.beamState = 'FIRING';
                    this.beamTimer = 20;
                    this.fireBeam();
                }
            } else if (this.beamState === 'FIRING') {
                this.color = "red";
                if (this.beamTimer <= 0) {
                    this.beamState = 'IDLE';
                }
            }
            return; // Skip normal movement
        }

        // DASH WINDUP LOGIC
        if (this.dashWindup > 0) {
            this.dashWindup--;
            this.vx = 0; // Roots player
            this.color = (Math.floor(Date.now() / 50) % 2 === 0) ? "#500000" : "red"; // Flash dark red

            if (this.dashWindup <= 0) {
                this.executeDash();
            }
            return;
        }

        // DASH LOGIC
        if (this.dashActive) {
            this.dashTimer--;
            this.vx = this.facingRight ? 20 : -20;

            // Dust trail
            if (this.isGrounded) {
                spawnParticles(this.x + this.w / 2, this.y + this.h, "#555", 1, 'square');
            }

            // Collision with Enemy
            if (rectIntersect(this.x, this.y, this.w, this.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
                redCube.takeDamage(15 * this.damageMult); // Reduced to 15 (Standard Dash Dmg)
                redCube.vx = this.facingRight ? 15 : -15;
                redCube.vy = -5;
                this.dashActive = false; // Stop dash on impact
                this.vx = this.facingRight ? -5 : 5; // Bounce back
                this.dashHit = true;
                triggerShake(5);
                if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
            }

            if (this.dashTimer <= 0) {
                this.dashActive = false;
                this.vx = 0;
                if (!this.dashHit) {
                    sessionStats.womboComboActive = false;
                }
            }

            // Platforming physics during dash
            this.vy += GRAVITY;
            this.y += this.vy;
            if (this.y + this.h >= FLOOR_Y) {
                this.y = FLOOR_Y - this.h;
                this.vy = 0;
                this.isGrounded = true;
            }
            this.x += this.vx;
            if (this.x < 0) this.x = 0;
            if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;
            return; // Skip normal movement
        }

        // Check for Laser Input (F)
        if (keys['KeyF']) {
            this.beamState = 'WINDUP';
            this.beamTimer = 50;
            return;
        }

        // Delegated Movement & Space (Dash) to super
        super.update();
    }

    // Override Space Action - Starts WINDUP instead of instant dash
    performSlash() {
        if (!this.dashActive && this.dashWindup <= 0 && this.dashCooldown <= 0) {
            this.dashWindup = 15; // 0.25s telegraph
            // Play a charge sound or effect here if we had audio
            spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "#FF4444", 5, 'spark');
        }
    }

    executeDash() {
        this.dashActive = true;
        this.dashTimer = 15;
        this.dashCooldown = 90; // 1.5s cooldown (was 15/instant)
        this.dashHit = false;
        this.color = "red";
        // Boom effect
        spawnParticles(this.x + (this.facingRight ? 0 : this.w), this.y + this.h / 2, "white", 10, 'spark');
    }

    fireBeam() {
        const beamW = 600;
        const beamH = 40;
        const beamX = this.facingRight ? this.x + this.w : this.x - beamW;
        const beamY = this.y + (this.h / 2) - (beamH / 2);

        triggerShake(8);
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "cyan", 15, 'spark');

        if (rectIntersect(beamX, beamY, beamW, beamH, redCube.x, redCube.y, redCube.w, redCube.h)) {
            redCube.takeDamage(25 * this.damageMult); // Reduced from 30 -> 25
            if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    takeDamage(amount) {
        if (this.dashActive) return; // Invincible while dashing
        super.takeDamage(amount);
    }

    draw(ctx) {
        super.draw(ctx);
        if (isRetroMode) return;

        // Draw Windup Indicator
        if (this.dashWindup > 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.x - 5, this.y - 5, this.w + 10, this.h + 10);
        }

        // Dash Ghost
        if (this.dashActive) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(this.x - (this.facingRight ? 20 : -20), this.y, this.w, this.h);
        }

        // Beam
        if (this.beamState === 'FIRING') {
            ctx.fillStyle = "cyan";
            const beamW = 600;
            const beamH = 40;
            const beamX = this.facingRight ? this.x + this.w : this.x - beamW;
            const beamY = this.y + (this.h / 2) - (beamH / 2);

            ctx.shadowColor = "cyan";
            ctx.shadowBlur = 20;
            ctx.fillRect(beamX, beamY, beamW, beamH);

            ctx.fillStyle = "white";
            ctx.fillRect(beamX, beamY + 15, beamW, 10);

            ctx.shadowBlur = 0;
        }

        // Cooldown text
        if (this.dashCooldown > 0) {
            ctx.fillStyle = "gray";
            ctx.font = "12px Arial";
            ctx.fillText(Math.ceil(this.dashCooldown / 60), this.x + 15, this.y - 10);
        }
    }
}

// CUBE 8: Fbt_7 (Secret/Dev)
class Fbt7Cube extends BlueCube {
    constructor() {
        super();
        this.color = "black";
        this.baseColor = "black";
        this.hp = 200;
        this.maxHp = 200;

        // DELETE ability
        this.deleteSlashActive = false;
        this.deleteSlashTimer = 0;
        this.deleteCooldown = 0;
        this.poisonTargets = [];

        // ERROR 404 ability
        this.error404Active = false;
        this.error404Timer = 0;
        this.error404Cooldown = 0;
        this.clone = null;

        // HATRED ability
        this.hatredActive = false;
        this.hatredTimer = 0;
        this.hatredCooldown = 0;
        this.originalSpeed = MOVE_SPEED;

        // TERMINATION ability
        this.terminationCooldown = 0;
    }

    update() {
        if (this.dead) return;

        // Update cooldowns
        // Update cooldowns
        if (IS_TESTER) {
            this.deleteCooldown = 0;
            this.error404Cooldown = 0;
            this.hatredCooldown = 0;
            this.terminationCooldown = 0;
        }
        if (this.deleteCooldown > 0) this.deleteCooldown--;
        if (this.error404Cooldown > 0) this.error404Cooldown--;
        if (this.hatredCooldown > 0) this.hatredCooldown--;
        if (this.terminationCooldown > 0) this.terminationCooldown--;

        // If Retro Mode, handle basic movement and skip abilities visually, but maybe keep effects?
        // For simplicity, disable advanced abilities in Retro Mode
        if (isRetroMode) {
            super.update();
            return;
        }

        // Process poison damage
        this.processPoisonDamage();

        // HATRED mode effects
        if (this.hatredActive) {
            this.hatredTimer--;
            this.color = (Math.floor(Date.now() / 80) % 2 === 0) ? "#8B0000" : "black";
            this.damageMult = 2.0;

            // Rage particles
            if (Math.random() < 0.2) {
                spawnParticles(this.x + Math.random() * this.w, this.y + Math.random() * this.h, "red", 1, 'spark');
            }

            if (this.hatredTimer <= 0) {
                this.hatredActive = false;
                this.color = this.baseColor;
                this.damageMult = 1.0;
                this.hatredCooldown = 600;
            }
        }

        // ERROR 404 effects
        if (this.error404Active) {
            this.error404Timer--;
            if (redCube && !redCube.dead) {
                redCube.stateTimer += 0.5;
            }

            if (this.error404Timer <= 0) {
                this.error404Active = false;
                if (this.clone) {
                    this.clone = null;
                }
                this.error404Cooldown = 480;
            }
        }

        if (this.clone) {
            this.updateClone();
        }

        if (this.deleteSlashActive) {
            this.deleteSlashTimer--;
            if (this.deleteSlashTimer <= 0) {
                this.deleteSlashActive = false;
            }
        }

        // ABILITY 1: DELETE (Space)
        if (keys['Space'] && this.deleteCooldown <= 0 && !this.deleteSlashActive) {
            this.performDeleteSlash();
        }

        // ABILITY 2: ERROR 404 (F)
        if (keys['KeyF'] && this.error404Cooldown <= 0 && !this.error404Active) {
            this.performError404();
        }

        // ABILITY 3: HATRED (Q)
        if (keys['KeyQ'] && this.hatredCooldown <= 0 && !this.hatredActive) {
            this.activateHatred();
        }

        // ABILITY 4: TERMINATION (E)
        if (keys['KeyE'] && this.terminationCooldown <= 0) {
            this.performTermination();
        }

        // Movement handling
        let inputLeft = keys['KeyA'];
        let inputRight = keys['KeyD'];

        if (this.invertControlsTimer > 0) {
            const temp = inputLeft;
            inputLeft = inputRight;
            inputRight = temp;
        }

        const currentSpeed = this.hatredActive ? MOVE_SPEED * 1.8 : MOVE_SPEED;

        if (inputLeft) {
            this.vx = -currentSpeed;
            this.facingRight = false;
        }
        if (inputRight) {
            this.vx = currentSpeed;
            this.facingRight = true;
        }
        if (keys['KeyW'] && this.isGrounded) {
            this.vy = this.hatredActive ? -JUMP_FORCE * 1.2 : -JUMP_FORCE;
        }

        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.h >= FLOOR_Y) {
            this.y = FLOOR_Y - this.h;
            this.vy = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;

        this.vx *= FRICTION;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    performDeleteSlash() {
        this.deleteSlashActive = true;
        this.deleteSlashTimer = 20;
this.deleteCooldown = 90;

const reach = 120;
const hitX = this.facingRight ? this.x + this.w : this.x - reach;

// Poison Particles
spawnParticles(hitX + reach / 2, this.y + this.h / 2, "#00FF00", 20, 'bubble');

if (!redCube.dead && rectIntersect(hitX, this.y - 20, reach, this.h + 40, redCube.x, redCube.y, redCube.w, redCube.h)) {
    if (!redCube.isInvincible) {
        redCube.takeDamage(15 * this.damageMult);
        redCube.vx = this.facingRight ? 12 : -12;
        redCube.vy = -8;

        this.poisonTargets.push({
            target: redCube,
            ticksRemaining: 5,
            tickTimer: 60
        });
        if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
    }
} else {
    sessionStats.womboComboActive = false;
}
    }

processPoisonDamage() {
    for (let i = this.poisonTargets.length - 1; i >= 0; i--) {
        const poison = this.poisonTargets[i];
        poison.tickTimer--;

        // Visual bubble effect on poisoned target
        if (Math.random() < 0.1) {
            spawnParticles(poison.target.x + poison.target.w / 2, poison.target.y, "#00FF00", 1, 'bubble');
        }

        if (poison.tickTimer <= 0) {
            poison.tickTimer = 60;
            poison.ticksRemaining--;

            if (!poison.target.dead) {
                poison.target.takeDamage(8);
                poison.target.color = "#00FF00";
                setTimeout(() => {
                    if (!poison.target.dead) {
                        poison.target.color = poison.target.baseColor || COLORS.RED;
                    }
                }, 100);
            }

            if (poison.ticksRemaining <= 0) {
                this.poisonTargets.splice(i, 1);
            }
        }
    }
}

performError404() {
    this.error404Active = true;
    this.error404Timer = 180;
    this.error404Cooldown = 480;

    if (!redCube.dead) {
        redCube.invertControlsTimer = 180;
        redCube.state = 'STUNNED';
        redCube.stateTimer = 30;
        triggerShake(5);
    }

    if (Math.random() < 0.4) {
        this.spawnClone();
    }
}

spawnClone() {
    this.clone = {
        x: this.facingRight ? this.x - 60 : this.x + 60,
        y: this.y,
        w: this.w,
        h: this.h,
        facingRight: this.facingRight,
        hp: 50,
        dead: false,
        attackTimer: 60,
        alpha: 0.6
    };
}

updateClone() {
    if (!this.clone || this.clone.dead) return;

    const dx = redCube.x - this.clone.x;
    if (Math.abs(dx) > 100) {
        this.clone.x += dx > 0 ? 3 : -3;
        this.clone.facingRight = dx > 0;
    }

    this.clone.attackTimer--;
    if (this.clone.attackTimer <= 0) {
        this.clone.attackTimer = 90;
        const reach = 70;
        const hitX = this.clone.facingRight ? this.clone.x + this.clone.w : this.clone.x - reach;

        if (!redCube.dead && rectIntersect(hitX, this.clone.y, reach, this.clone.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
            redCube.takeDamage(10);
        }
    }

    if (!this.error404Active) {
        this.clone = null;
    }
}

activateHatred() {
    this.hatredActive = true;
    this.hatredTimer = 300;
    this.hatredCooldown = 600;
    triggerShake(5);
    spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "red", 30, 'spark');
}

// TERMINATION: Reality Shatter and Retro Transition
performTermination() {
    this.terminationCooldown = 1200; // Long cooldown

    // 1. Shatter Effect
    triggerShatter();
    triggerShake(20);

    // 2. Start Sequence
    // Sequence: Retro(2s) -> Normal(1s) -> Retro(2s) -> Normal(1s) -> Retro(2s) -> Normal(1s) -> Retro(2s) -> Normal(End)
    // Times in ms
    const phase1 = 1000; // Wait for shatter anim
    const retroDur = 2000;
    const normalDur = 1000;

    let time = phase1;

    // Phase 1 Retro
    setTimeout(() => { isRetroMode = true; }, time);
    time += retroDur;

    // Phase 1 Normal
    setTimeout(() => { isRetroMode = false; triggerShatter(); }, time);
    time += normalDur;

    // Phase 2 Retro
    setTimeout(() => { isRetroMode = true; }, time);
    time += retroDur;

    // Phase 2 Normal
    setTimeout(() => { isRetroMode = false; triggerShatter(); }, time);
    time += normalDur;

    // Phase 3 Retro
    setTimeout(() => { isRetroMode = true; }, time);
    time += retroDur;

    // Phase 3 Normal
    setTimeout(() => { isRetroMode = false; triggerShatter(); }, time);
    time += normalDur;

    // Phase 4 Retro
    setTimeout(() => { isRetroMode = true; }, time);
    time += retroDur;

    // Final Normal
    setTimeout(() => { isRetroMode = false; triggerShatter(); }, time);
}

draw(ctx) {
    if (this.dead) return;
    if (isRetroMode) {
        // Simple retro draw override
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        return;
    }

    // Draw main cube
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // Hatred glow effect
    if (this.hatredActive) {
        ctx.shadowColor = "#FF0000";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    // Eye
    ctx.fillStyle = this.hatredActive ? "#FF0000" : "#00FF00";
    const eyeX = this.facingRight ? this.x + 30 : this.x + 10;
    ctx.fillRect(eyeX, this.y + 10, 10, 10);

    // DELETE SLASH visual
    if (this.deleteSlashActive) {
        const reach = 120;
        const hitX = this.facingRight ? this.x + this.w : this.x - reach;

        // Poison green slash
        ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
        ctx.fillRect(hitX, this.y - 20, reach, this.h + 40);

        // Dripping poison effect
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = "rgba(0, 180, 0, 0.8)";
            ctx.beginPath();
            ctx.arc(hitX + Math.random() * reach, this.y + this.h + Math.random() * 20, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ERROR 404 visual
    if (this.error404Active) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.font = "bold 16px monospace";
        ctx.fillText("ERROR 404", this.x - 10, this.y - 30);

        // Glitch lines
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgba(255, 0, 0, ${0.5 - i * 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + Math.random() * this.w, this.y);
            ctx.lineTo(this.x + Math.random() * this.w, this.y + this.h);
            ctx.stroke();
        }
    }

    // Draw clone
    if (this.clone && !this.clone.dead) {
        ctx.globalAlpha = this.clone.alpha;
        ctx.fillStyle = "black";
        ctx.fillRect(this.clone.x, this.clone.y, this.clone.w, this.clone.h);
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.clone.x, this.clone.y, this.clone.w, this.clone.h);

        // Clone eye
        ctx.fillStyle = "#00FF00";
        const cloneEyeX = this.clone.facingRight ? this.clone.x + 30 : this.clone.x + 10;
        ctx.fillRect(cloneEyeX, this.clone.y + 10, 10, 10);
        ctx.globalAlpha = 1.0;
    }

    // Draw ability cooldown indicators
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    let indicatorY = this.y - 45;

    // DELETE cooldown
    ctx.fillStyle = this.deleteCooldown > 0 ? "#666" : "#00FF00";
    ctx.fillText(`[SPACE] DELETE ${this.deleteCooldown > 0 ? Math.ceil(this.deleteCooldown / 60) + 's' : 'READY'}`, this.x - 20, indicatorY);
    indicatorY += 12;

    // ERROR 404 cooldown
    ctx.fillStyle = this.error404Cooldown > 0 ? "#666" : "#FF0000";
    ctx.fillText(`[F] 404 ${this.error404Active ? 'ACTIVE' : (this.error404Cooldown > 0 ? Math.ceil(this.error404Cooldown / 60) + 's' : 'READY')}`, this.x - 20, indicatorY);
    indicatorY += 12;

    // HATRED cooldown
    ctx.fillStyle = this.hatredCooldown > 0 ? "#666" : "#8B0000";
    ctx.fillText(`[Q] HATRED ${this.hatredActive ? 'ACTIVE' : (this.hatredCooldown > 0 ? Math.ceil(this.hatredCooldown / 60) + 's' : 'READY')}`, this.x - 20, indicatorY);
    indicatorY += 12;

    // TERMINATION
    ctx.fillStyle = this.terminationCooldown > 0 ? "#666" : "#000000";
    ctx.fillText(`[E] TERMINATION ${this.terminationCooldown > 0 ? Math.ceil(this.terminationCooldown / 60) + 's' : 'READY'}`, this.x - 20, indicatorY);
}
}

// --- SHATTER EFFECT UTILS ---
function triggerShatter() {
    shatterActive = true;
    shatterShards = [];

    // Create 30 random shards
    for (let i = 0; i < 30; i++) {
        shatterShards.push({
            x: WIDTH / 2,
            y: HEIGHT / 2,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 30,
            w: Math.random() * 50 + 20,
            h: Math.random() * 50 + 20,
            angle: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.5,
            color: Math.random() > 0.5 ? '#333' : '#111',
            alpha: 1.0
        });
    }

    // Stop shatter after 1 sec
    setTimeout(() => { shatterActive = false; }, 800);
}

// CUBE 9: MASTER CUBE 
class GoldCube extends BlueCube {
    constructor() {
        super();
        this.color = "#FFD700";
        this.baseColor = "#FFD700";
        this.masterState = 'MASTER'; // MASTER, SWAPPING_OUT, MINION_MODE, SWAPPING_IN
        this.minion = null;
        this.swapTargetX = -150;

        // Overtime Mechanics
        this.overtimeActive = false;
        this.overtimeTimer = 0;
        this.overtimeCooldown = 0;
    }

    update() {
        if (this.dead) return;
        if (isRetroMode) {
            // If minion active, use minion for retro pos
            if (this.masterState === 'MINION_MODE' && this.minion) {
                this.minion.update();
                this.x = this.minion.x;
                this.y = this.minion.y;
            } else {
                super.update();
            }
            return;
        }

        // Handle Overtime Timer
        if (this.overtimeActive) {
            this.overtimeTimer--;
            if (this.overtimeTimer <= 0) {
                this.overtimeActive = false;
                document.getElementById('overtime-overlay').classList.remove('active');
                this.overtimeCooldown = 300; // 5 seconds cooldown after effect ends
            }
        } else {
            if (IS_TESTER) this.overtimeCooldown = 0;
            if (this.overtimeCooldown > 0) this.overtimeCooldown--;
        }

        // --- MASTER STATE ---
        if (this.masterState === 'MASTER') {
            super.update(); // Normal movement

            // OVERTIME Ability (Space)
            if (keys['Space'] && !this.overtimeActive && this.overtimeCooldown <= 0) {
                this.overtimeActive = true;
                this.overtimeTimer = 300; // 5 seconds duration
                document.getElementById('overtime-overlay').classList.add('active');
            }

            // CALL BACK Ability (F)
            if (keys['KeyF']) {
                this.masterState = 'SWAPPING_OUT';
            }
        }
        // --- SWAPPING OUT (Animation) ---
        else if (this.masterState === 'SWAPPING_OUT') {
            this.vx = -15; // Slide left fast
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -100) {
                this.spawnMinion();
                this.masterState = 'MINION_MODE';
                this.vx = 0;
            }
        }
        // --- MINION MODE ---
        else if (this.masterState === 'MINION_MODE') {
            if (this.minion) {
                this.minion.update();

                // DECREASE COOLDOWNS IF OVERTIME ACTIVE
                if (this.overtimeActive) {
                    if (this.minion.slashCooldown > 0) this.minion.slashCooldown--;
                    if (this.minion.parryCooldown > 0) this.minion.parryCooldown--;
                    if (this.minion.beamTimer > 0 && this.minion.beamState !== 'FIRING') this.minion.beamTimer--;
                    if (this.minion.pullCooldown > 0) this.minion.pullCooldown--;
                    if (this.minion.blockEnergy < 100 && !this.minion.isBlocking) this.minion.blockEnergy += 0.5;
                    if (this.minion.droneCooldown > 0) this.minion.droneCooldown--;
                }

                // Sync position so AI targets the minion (and camera follows logic if exists)
                this.x = this.minion.x;
                this.y = this.minion.y;

                if (this.minion.dead) {
                    this.minion = null;
                    this.masterState = 'SWAPPING_IN';
                    // Teleport Master Cube to edge
                    this.x = -100;
                    this.y = FLOOR_Y - this.h;
                }
            }
        }
        // --- SWAPPING IN (Animation) ---
        else if (this.masterState === 'SWAPPING_IN') {
            this.vx = 15;
            this.x += this.vx;
            if (this.y + this.h >= FLOOR_Y) this.y = FLOOR_Y - this.h;

            if (this.x >= 50) { // Original spawn area
                this.masterState = 'MASTER';
                this.vx = 0;
            }
        }
    }

    spawnMinion() {
        // Random class choice (excluding GoldCube/RedCube)
        // Added AngrySniperCube to pool
        const types = [BlueCube, GreenCube, PinkCube, BrownCube, PurpleCube, VigilanteCube, AngrySniperCube];
        const RandomClass = types[Math.floor(Math.random() * types.length)];

        this.minion = new RandomClass();
        this.minion.x = -50; // Start off screen
        this.minion.y = FLOOR_Y - CUBE_SIZE;
        this.minion.vx = 20; // Jump in
        this.minion.vy = -10;

        // WEAKEN (Default)
        this.minion.maxHp = 50;
        this.minion.hp = 50;
        this.minion.damageMult = 0.5;

        spawnParticles(this.minion.x, this.minion.y, "white", 10, 'square'); // Poof effect

        // OVERTIME BUFF
        if (this.overtimeActive) {
            this.minion.maxHp = 100;
            this.minion.hp = 100;
            this.minion.damageMult = 1.0;
            this.minion.baseColor = this.minion.color;
        }
    }

    takeDamage(amount) {
        if (this.masterState === 'MINION_MODE' && this.minion) {
            this.minion.takeDamage(amount);
        } else if (this.masterState === 'MASTER' || this.masterState === 'SWAPPING_IN') {
            super.takeDamage(amount);
        }
    }

    draw(ctx) {
        if (this.dead) return;
        if (isRetroMode) {
            if (this.masterState === 'MINION_MODE' && this.minion) this.minion.draw(ctx);
            else super.draw(ctx);
            return;
        }

        if (this.masterState === 'MINION_MODE' && this.minion) {
            this.minion.draw(ctx);
        } else {
            super.draw(ctx);

            // Draw Overtime Status text above head
            if (this.masterState === 'MASTER') {
                if (this.overtimeActive) {
                    ctx.fillStyle = "#FF00FF";
                    ctx.font = "bold 16px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("OVERTIME!", this.x + this.w / 2, this.y - 20);
                } else if (this.overtimeCooldown > 0) {
                    ctx.fillStyle = "gray";
                    ctx.font = "14px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(Math.ceil(this.overtimeCooldown / 60), this.x + this.w / 2, this.y - 20);
                } else {
                    ctx.fillStyle = "yellow";
                    ctx.font = "14px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Ready", this.x + this.w / 2, this.y - 20);
                }
            }
        }
    }
}

// CUBE 10: BOBBYTHE124 (Not Achievement Locked)
class Bobbythe124Cube extends BlueCube {
    constructor() {
        super();
        this.color = "#CCCCFF"; // Periwinkle
        this.baseColor = "#CCCCFF";
        this.maxHp = 149;
        this.hp = 149;

        // Jump passive - increases jump force after each jump
        this.jumpCount = 0;
        this.baseJumpForce = JUMP_FORCE;

        // Silence attack (slash)
        this.silenceCooldown = 0;
        this.silenceActive = false;
        this.silenceTimer = 0;

        // Hatred ability (from Fbt_7)
        this.hatredActive = false;
        this.hatredTimer = 0;
        this.hatredCooldown = 0;

        // Beam attack
        this.beamState = 'IDLE';
        this.beamTimer = 0;

        // Bleed attack (poison slash)
        this.bleedCooldown = 0;
        this.bleedActive = false;
        this.bleedTimer = 0;
        this.poisonTargets = [];
    }

    update() {
        if (this.dead) return;

        // Update cooldowns
        // Update cooldowns
        if (IS_TESTER) {
            this.silenceCooldown = 0;
            this.hatredCooldown = 0;
            this.bleedCooldown = 0;
        }
        if (this.silenceCooldown > 0) this.silenceCooldown--;
        if (this.hatredCooldown > 0) this.hatredCooldown--;
        if (this.bleedCooldown > 0) this.bleedCooldown--;

        if (isRetroMode) {
            super.update();
            return;
        }

        // Process poison damage from bleed
        this.processPoisonDamage();

        // HATRED mode effects
        if (this.hatredActive) {
            this.hatredTimer--;
            this.color = (Math.floor(Date.now() / 80) % 2 === 0) ? "#8B0000" : this.baseColor;
            this.damageMult = 1.5;

            if (Math.random() < 0.2) {
                spawnParticles(this.x + Math.random() * this.w, this.y + Math.random() * this.h, "red", 1, 'spark');
            }

            if (this.hatredTimer <= 0) {
                this.hatredActive = false;
                this.color = this.baseColor;
                this.damageMult = 1.0;
                this.hatredCooldown = 480;
            }
        }

        // Beam state machine
        if (this.beamState !== 'IDLE') {
            this.vx = 0;
            this.beamTimer--;

            if (this.beamState === 'WINDUP') {
                this.color = (Math.floor(Date.now() / 100) % 2 === 0) ? this.baseColor : "white";

                // Charge particles
                if (Math.random() < 0.5) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 60;
                    const px = this.x + this.w / 2 + Math.cos(angle) * dist;
                    const py = this.y + this.h / 2 + Math.sin(angle) * dist;
                    const p = new Particle(px, py, "#CCCCFF", 0, 10, 'beam_charge');
                    p.vx = (this.x + this.w / 2 - px) * 0.1;
                    p.vy = (this.y + this.h / 2 - py) * 0.1;
                    particles.push(p);
                }

                if (this.beamTimer <= 0) {
                    this.beamState = 'FIRING';
                    this.beamTimer = 15;
                    this.fireBeam();
                }
            } else if (this.beamState === 'FIRING') {
                if (!this.hatredActive) this.color = this.baseColor;
                if (this.beamTimer <= 0) this.beamState = 'IDLE';
            }
        }

        // Attack timers
        if (this.silenceActive) {
            this.silenceTimer--;
            if (this.silenceTimer <= 0) this.silenceActive = false;
        }

        if (this.bleedActive) {
            this.bleedTimer--;
            if (this.bleedTimer <= 0) this.bleedActive = false;
        }

        // Input handling
        let inputLeft = keys['KeyA'];
        let inputRight = keys['KeyD'];

        if (this.invertControlsTimer > 0) {
            const temp = inputLeft;
            inputLeft = inputRight;
            inputRight = temp;
        }

        const currentSpeed = this.hatredActive ? MOVE_SPEED * 1.5 : MOVE_SPEED;

        if (inputLeft) {
            this.vx = -currentSpeed;
            this.facingRight = false;
        }
        if (inputRight) {
            this.vx = currentSpeed;
            this.facingRight = true;
        }

        // PASSIVE: Higher jumps after each jump
        if (keys['KeyW'] && this.isGrounded) {
            this.jumpCount++;
            const jumpBonus = Math.min(this.jumpCount * 1.5, 10); // Cap at +10
            this.vy = -(this.baseJumpForce + jumpBonus);
        }

        // Reset jump count when grounded for a bit (optional, or keep stacking)
        // For now, let's keep it stacking as per the spec

        // ABILITY 1: SILENCE (Space) - 35 damage slash
        if (keys['Space'] && this.silenceCooldown <= 0 && this.beamState === 'IDLE') {
            this.performSilence();
        }

        // ABILITY 2: HATRED (Q) - Rage mode from Fbt_7
        if (keys['KeyQ'] && this.hatredCooldown <= 0 && !this.hatredActive) {
            this.activateHatred();
        }

        // ABILITY 3: BEAM (F) - 50 damage beam
        if (keys['KeyF'] && this.beamState === 'IDLE') {
            this.beamState = 'WINDUP';
            this.beamTimer = 40;
        }

        // ABILITY 4: BLEED (E) - Poison slash
        if (keys['KeyE'] && this.bleedCooldown <= 0 && this.beamState === 'IDLE') {
            this.performBleed();
        }

        // Physics
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.h >= FLOOR_Y) {
            this.y = FLOOR_Y - this.h;
            this.vy = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;

        this.vx *= FRICTION;
        if (Math.abs(this.vx) < 0.1) this.vx = 0;

        if (this.invertControlsTimer > 0) this.invertControlsTimer--;
    }

    performSilence() {
        this.silenceActive = true;
        this.silenceTimer = 15;
        this.silenceCooldown = 60;

        const reach = 70;
        const hitX = this.facingRight ? this.x + this.w : this.x - reach;

        spawnParticles(hitX + reach / 2, this.y + this.h / 2, "white", 5, 'spark');

        if (!redCube.dead && rectIntersect(hitX, this.y, reach, this.h, redCube.x, redCube.y, redCube.w, redCube.h)) {
            if (!redCube.isInvincible) {
                redCube.takeDamage(35 * this.damageMult);
                redCube.vx = this.facingRight ? 10 : -10;
                redCube.vy = -5;
                if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
            }
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    activateHatred() {
        this.hatredActive = true;
        this.hatredTimer = 300; // 5 seconds
        this.hatredCooldown = 600;
        triggerShake(5);
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "red", 30, 'spark');
    }

    fireBeam() {
        const beamW = 600;
        const beamH = 30;
        const beamX = this.facingRight ? this.x + this.w : this.x - beamW;
        const beamY = this.y + 15;

        triggerShake(10);

        if (rectIntersect(beamX, beamY, beamW, beamH, redCube.x, redCube.y, redCube.w, redCube.h)) {
            redCube.takeDamage(50 * this.damageMult);
            redCube.vx = this.facingRight ? 15 : -15;
            if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    performBleed() {
        this.bleedActive = true;
        this.bleedTimer = 20;
        this.bleedCooldown = 90;

        const reach = 100;
        const hitX = this.facingRight ? this.x + this.w : this.x - reach;

        spawnParticles(hitX + reach / 2, this.y + this.h / 2, "red", 15, 'bubble');

        if (!redCube.dead && rectIntersect(hitX, this.y - 20, reach, this.h + 40, redCube.x, redCube.y, redCube.w, redCube.h)) {
            if (!redCube.isInvincible) {
                redCube.takeDamage(20 * this.damageMult);
                redCube.vx = this.facingRight ? 12 : -12;
                redCube.vy = -8;

                // Apply bleed/poison effect
                this.poisonTargets.push({
                    target: redCube,
                    ticksRemaining: 6,
                    tickTimer: 60
                });
                if (sessionStats.womboComboActive) sessionStats.womboComboHits++;
            }
        } else {
            sessionStats.womboComboActive = false;
        }
    }

    processPoisonDamage() {
        for (let i = this.poisonTargets.length - 1; i >= 0; i--) {
            const poison = this.poisonTargets[i];
            poison.tickTimer--;

            if (poison.tickTimer <= 0) {
                poison.tickTimer = 60;
                poison.ticksRemaining--;

                if (!poison.target.dead) {
                    poison.target.takeDamage(10);
                    poison.target.color = "#8B0000"; // Dark red for bleed
                    spawnParticles(poison.target.x + poison.target.w / 2, poison.target.y, "red", 2, 'bubble');
                    setTimeout(() => {
                        if (!poison.target.dead) {
                            poison.target.color = poison.target.baseColor || COLORS.RED;
                        }
                    }, 100);
                }

                if (poison.ticksRemaining <= 0) {
                    this.poisonTargets.splice(i, 1);
                }
            }
        }
    }

    draw(ctx) {
        if (this.dead) return;
        if (isRetroMode) {
            ctx.fillStyle = this.baseColor;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            return;
        }

        // Draw main cube
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Hatred glow effect
        if (this.hatredActive) {
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = 20;
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
            ctx.shadowBlur = 0;
        } else {
            ctx.strokeStyle = "#9999CC";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }

        // Eye
        ctx.fillStyle = this.hatredActive ? "#FF0000" : "#6666AA";
        const eyeX = this.facingRight ? this.x + 30 : this.x + 10;
        ctx.fillRect(eyeX, this.y + 10, 10, 10);

        // SILENCE SLASH visual
        if (this.silenceActive) {
            const reach = 70;
            const hitX = this.facingRight ? this.x + this.w : this.x - reach;
            ctx.fillStyle = "rgba(153, 153, 204, 0.6)";
            ctx.fillRect(hitX, this.y, reach, this.h);
        }

        // BEAM visual
        if (this.beamState === 'FIRING') {
            ctx.fillStyle = "#AAAAFF";
            const beamW = 600;
            const beamX = this.facingRight ? this.x + this.w : this.x - beamW;

            ctx.shadowBlur = 10;
            ctx.shadowColor = "#AAAAFF";
            ctx.fillRect(beamX, this.y + 15, beamW, 30);

            ctx.fillStyle = "white";
            ctx.fillRect(beamX, this.y + 22, beamW, 16);
            ctx.shadowBlur = 0;
        }

        // BLEED SLASH visual
        if (this.bleedActive) {
            const reach = 100;
            const hitX = this.facingRight ? this.x + this.w : this.x - reach;

            ctx.fillStyle = "rgba(139, 0, 0, 0.6)";
            ctx.fillRect(hitX, this.y - 20, reach, this.h + 40);

            // Dripping blood effect
            for (let i = 0; i < 5; i++) {
                ctx.fillStyle = "rgba(139, 0, 0, 0.8)";
                ctx.beginPath();
                ctx.arc(hitX + Math.random() * reach, this.y + this.h + Math.random() * 20, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw ability cooldown indicators
        ctx.font = "10px Arial";
        ctx.textAlign = "left";
        let indicatorY = this.y - 55;

        // SILENCE cooldown
        ctx.fillStyle = this.silenceCooldown > 0 ? "#666" : "#9999CC";
        ctx.fillText(`[SPACE] SILENCE ${this.silenceCooldown > 0 ? Math.ceil(this.silenceCooldown / 60) + 's' : 'READY'}`, this.x - 20, indicatorY);
        indicatorY += 12;

        // HATRED cooldown
        ctx.fillStyle = this.hatredCooldown > 0 ? "#666" : "#8B0000";
        ctx.fillText(`[Q] HATRED ${this.hatredActive ? 'ACTIVE' : (this.hatredCooldown > 0 ? Math.ceil(this.hatredCooldown / 60) + 's' : 'READY')}`, this.x - 20, indicatorY);
        indicatorY += 12;

        // BEAM cooldown
        ctx.fillStyle = this.beamState !== 'IDLE' ? "#666" : "#AAAAFF";
        ctx.fillText(`[F] BEAM ${this.beamState !== 'IDLE' ? 'CHARGING' : 'READY'}`, this.x - 20, indicatorY);
        indicatorY += 12;

        // BLEED cooldown
        ctx.fillStyle = this.bleedCooldown > 0 ? "#666" : "#8B0000";
        ctx.fillText(`[E] BLEED ${this.bleedCooldown > 0 ? Math.ceil(this.bleedCooldown / 60) + 's' : 'READY'}`, this.x - 20, indicatorY);
        indicatorY += 12;

        // Jump bonus indicator
        ctx.fillStyle = "#CCCCFF";
        ctx.fillText(`JUMPS: ${this.jumpCount} (+${Math.min(this.jumpCount * 1.5, 10).toFixed(1)})`, this.x - 20, indicatorY);
    }
}

// CUBE 2: ANGRY SNIPER (Red) - AI/P2
class RedCube extends Entity {
    constructor() {
        super(WIDTH - 100, FLOOR_Y - CUBE_SIZE, COLORS.RED, 100);
        this.facingRight = false;
        this.state = 'IDLE';
        this.stateTimer = 0;
        this.isInvincible = false;
        this.beamActive = false;
        // New dash property
        this.dashTimer = 0;
    }

    update() {
        super.update();
        if (gameMode === 'p2p' && p2pRole === 'client') return;
if (this.dead) return;

// Simple AI
if (this.stateTimer > 0) {
    this.stateTimer--;
    if (this.stateTimer <= 0) {
        this.state = 'IDLE';
        this.isInvincible = false;
        this.color = COLORS.RED;
    } else if (this.state === 'STUNNED') {
        this.vx = 0;
    }
    return;
}

const dist = Math.abs(this.x - blueCube.x);

// AI Logic
if (Math.random() < 0.02 && dist < 300) {
    // Dash Attack
    this.state = 'DASHING';
    this.stateTimer = 20;
    this.vx = (blueCube.x < this.x) ? -15 : 15;
    this.isInvincible = true;
    this.color = "#FF4444"; // Lighter red
} else if (Math.random() < 0.005) {
    // Jump
    if (this.isGrounded) this.vy = -JUMP_FORCE;
} else if (Math.random() < 0.01 && dist > 400) {
    // Laser Attack
    this.state = 'LASER_CHARGE';
    this.stateTimer = 60; // 1 second charge
    this.color = "cyan"; // Telegraph color
} else {
    // Move towards player
    if (blueCube.x < this.x) {
        this.vx = -MOVE_SPEED * 0.8;
        this.facingRight = false;
    } else {
        this.vx = MOVE_SPEED * 0.8;
        this.facingRight = true;
    }
}

// LASER LOGIC
if (this.state === 'LASER_CHARGE') {
    this.vx = 0; // Stop moving
    if (this.stateTimer <= 1) { // Fire at end of charge
        this.fireBeam();
    }
} else if (this.state === 'DASHING') {
    // Dash damage
    if (rectIntersect(this.x, this.y, this.w, this.h, blueCube.x, blueCube.y, blueCube.w, blueCube.h)) {
        blueCube.takeDamage(15);
        // Knockback player
        blueCube.vx = (this.vx > 0) ? 15 : -15;
        blueCube.vy = -5;
        this.state = 'IDLE'; // Stop dash on hit
        this.stateTimer = 0;
        this.isInvincible = false;
        this.color = COLORS.RED;
    }
}
    }

fireBeam() {
    const beamW = 800;
    const beamH = 30;
    const beamX = (blueCube.x < this.x) ? this.x - beamW : this.x + this.w;
    const beamY = this.y + 15;

    // Visual telegraph end
    spawnParticles(this.x + this.w / 2, this.y + this.h / 2, "red", 20, 'spark');
    triggerShake(10);

    // Hit Check
    // Simple full screen beam in facing direction
    // AI usually faces player when starting charge, but let's check direction
    const firingLeft = (blueCube.x < this.x);

    // Draw Logic handled in draw() based on flag? No, let's just do instant effect
    // We need to persist the beam visual for a few frames
    this.beamActive = true;
    setTimeout(() => this.beamActive = false, 200);

    if (firingLeft) {
        if (blueCube.x < this.x && blueCube.y + blueCube.h > beamY && blueCube.y < beamY + beamH) {
            blueCube.takeDamage(30);
        }
    } else {
        // Firing Right
        if (blueCube.x > this.x && blueCube.y + blueCube.h > beamY && blueCube.y < beamY + beamH) {
            blueCube.takeDamage(30);
        }
    }
}

draw(ctx) {
    if (this.dead) return;
    super.draw(ctx);

    if (this.beamActive) {
        ctx.fillStyle = "red";
        const beamW = 800;
        const beamX = (blueCube.x < this.x) ? this.x - beamW : this.x + this.w;
        ctx.fillRect(beamX, this.y + 15, beamW, 30);
        ctx.fillStyle = "white";
        ctx.fillRect(beamX, this.y + 22, beamW, 16);
    }

    if (this.state === 'LASER_CHARGE') {
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, 40 * ((60 - this.stateTimer) / 60), 0, Math.PI * 2);
        ctx.strokeStyle = "cyan";
        ctx.stroke();
    }
}
}

let blueCube = null;
let redCube = null;

// --- INITIALIZATION ---
function startGame(mode) {
    if (mode) gameMode = mode;
    gameState = 'playing';
    winner = null;
    shatterActive = false;
    isRetroMode = false;

    // Reset Session Stats
    sessionStats = {
        beamStreak: 0,
        womboComboActive: true,
        womboComboHits: 0
    };

    // UI Reset
    navTo('game-container');
    document.getElementById('ui-layer').style.display = 'flex';
    document.querySelector('.sidebar').style.display = 'none'; // Only for P2P/Spectator? Should be 'flex' usually?
    // Actually sidebar is currently unused in main flow, let's hide it or show it if we want side stats.
    // Spec didn't specify sidebar, but existing code has it. Let's keep it hidden for now as it takes space.
    document.querySelector('.sidebar').style.display = 'none';

    document.getElementById('rainbow-overlay').classList.remove('active');
    document.getElementById('rainbow-text').innerText = "";

    // Instantiate Player Cube based on Selection
    const CubeClass = getClassForId(selectedCubeId);
    blueCube = new CubeClass();

    // Instantiate Enemy
    // If Mode is P2P, we need logic. For now assuming AI.
    if (gameMode === 'p2p') {
        // P2P Logic:
        // Host is P1 (Left), Client is P2 (Right)
        if (p2pRole === 'host') {
            blueCube.x = 50;
            redCube = new CubeClass(); // Placeholder, will sync
            redCube.x = WIDTH - 100;
            redCube.color = "red"; // Force red for visual distinction?
        } else {
            // Client
            blueCube.x = WIDTH - 100; // Client is on right usually?
            // Actually P2P logic typically syncs state.
            // Let's keep it simple: Local is always BlueCube controlled, Remote is RedCube proxy.
            redCube = new CubeClass(); // Just a dummy entity to receive content
        }
        // Actually, let's stick to standard P2P: P1Host, P2Client
        if (p2pRole === 'host') {
            // I am Blue
            // Enemy is Red
        }
    } else {
        // AI Mode
        redCube = new RedCube();
    }

    // Special Case: Fbt_7 vs Bobbythe124 (Secret)
    if (blueCube instanceof Fbt7Cube) {
        // Check if map/enemy allows secret?
        // Let's just standard AI for now.
    }

    // Apply Sandbox Overrides if needed
    if (gameMode === 'sandbox') {
        // Make enemy invincible dummy?
        redCube = new Entity(WIDTH - 150, FLOOR_Y - CUBE_SIZE, "gray", 9999);
        redCube.ai = false; // Disable AI
        redCube.update = function () {
            this.vy += GRAVITY;
            this.y += this.vy;
            if (this.y + this.h >= FLOOR_Y) {
                this.y = FLOOR_Y - this.h;
                this.vy = 0;
            }
        }; // Simple gravity only
    }

    updateUI();
    if (animationId) cancelAnimationFrame(animationId);
    gameLoop();
}

function getClassForId(id) {
    switch (id) {
        case 1: return BlueCube;
        case 2: return AngrySniperCube;
        case 3: return GreenCube;
        case 4: return PinkCube;
        case 5: return BrownCube;
        case 6: return PurpleCube;
        case 7: return VigilanteCube;
        case 8: return Fbt7Cube;
        case 9: return GoldCube;
        case 10: return Bobbythe124Cube;
        default: return BlueCube;
    }
}

function showMainMenu() {
    gameState = 'menu';
    navTo('screen-main');
    document.getElementById('ui-layer').style.display = 'none';
    if (animationId) cancelAnimationFrame(animationId);

    // Clear canvas
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function showGameOver() {
    // Stop game loop
    if (animationId) cancelAnimationFrame(animationId);
    gameState = 'gameover';

    const overlay = document.getElementById('menu-overlay');
    // We already have a winner set
    const winnerName = (winner === 'player') ? "PLAYER WINS" : "ENEMY WINS";

    alert(winnerName + "\nPress R to Restart");

    // Check Achievements
    checkWinAchievements();
}

function checkWinAchievements() {
    if (winner === 'player') {
        // 1. First Blood
        unlockAchievement(1);

        // 3. Unstoppable (No Damage)
        if (blueCube.hp >= blueCube.maxHp) unlockAchievement(3);

        // 4. Wombo Combo
        if (sessionStats.womboComboActive && sessionStats.womboComboHits >= 4) {
            unlockAchievement(4);
        }

        // 7. Cube Master (Unlock all) - Checked inside unlock
    } else {
        // Loss Achievements
        // 5. In every timeline I kill you... (Lose to Fbt_7)
        // Hard to detect if Enemy was Fbt7 unless we set it.
        // Assuming RedCube behaves like Fbt7? No, RedCube is AI.
        // Needs specific scenario.
    }
}

function requestRestart() {
    startGame(gameMode);
}

function checkGameOver() {
    if (blueCube.hp <= 0) {
        winner = 'enemy';
        if (gameMode === 'p2p') {
            conn.send({ type: 'GAMEOVER', winner: 'enemy' });
        }
        showGameOver();
    } else if (redCube.hp <= 0 && gameMode !== 'sandbox') {
        winner = 'player';
        if (gameMode === 'p2p') {
            conn.send({ type: 'GAMEOVER', winner: 'player' });
        }
        showGameOver();
    }
}

function updateUI() {
    if (!blueCube || !redCube) return;

    // Health Bars
    const p1Pct = (blueCube.hp / blueCube.maxHp) * 100;
    const p2Pct = (redCube.hp / redCube.maxHp) * 100;

    document.getElementById('p1-health').style.width = Math.max(0, p1Pct) + '%';
    document.getElementById('p2-health').style.width = Math.max(0, p2Pct) + '%';

    document.getElementById('p1-hp-text').innerText = Math.ceil(blueCube.hp);
    document.getElementById('p2-hp-text').innerText = Math.ceil(redCube.hp);

    // Combo Box
    const comboBox = document.getElementById('combo-box');
    if (sessionStats.womboComboHits > 1) {
        comboBox.style.display = 'flex';
        comboBox.innerText = sessionStats.womboComboHits;
    } else {
        comboBox.style.display = 'none';
    }
}

// --- GAME LOOP ---
function gameLoop() {
    // 1. Update
    if (gameMode === 'p2p') {
        // Send Input
        if (conn && conn.open) {
            conn.send({ type: 'INPUT', keys: keys });

            if (p2pRole === 'host') {
                // Host simulates everything and sends state
                updateGameLogic();
                const state = {
                    type: 'STATE',
                    p1: { x: blueCube.x, y: blueCube.y, color: blueCube.color, hp: blueCube.hp, facingRight: blueCube.facingRight },
                    p2: { x: redCube.x, y: redCube.y, color: redCube.color, hp: redCube.hp, facingRight: redCube.facingRight },
                    isRetroMode: isRetroMode,
                    shatterActive: shatterActive,
                    shards: shatterShards
                };
                conn.send(state);
            } else {
                // Client just predicts/interpolates or waits for state
                // For simplicity, client rendering is handled by state updates in handleNetworkData
            }
        }
    } else {
        updateGameLogic();
    }

    // 2. Draw
    drawGame();

    if (gameState === 'playing') {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function updateGameLogic() {
    blueCube.update();
    redCube.update();

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    // Update Floating Text
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        floatingTexts[i].update();
        if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
    }

    // Screen Shake decay
    if (shakeMagnitude > 0) shakeMagnitude *= 0.9;
    if (shakeMagnitude < 0.5) shakeMagnitude = 0;

    // Shatter Logic
    if (shatterActive) {
        shatterShards.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.angle += s.rotSpeed;
            s.alpha *= 0.95;
        });
    }
}

function drawGame() {
    // Clear
    ctx.fillStyle = isRetroMode ? "#000" : "#f0f0f0";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Shake Offset
    ctx.save();
    if (shakeMagnitude > 0) {
        const dx = (Math.random() - 0.5) * shakeMagnitude;
        const dy = (Math.random() - 0.5) * shakeMagnitude;
        ctx.translate(dx, dy);
    }

    // Draw Floor (Normal Mode)
    if (!isRetroMode) {
        ctx.fillStyle = "#333";
        ctx.fillRect(0, FLOOR_Y, WIDTH, HEIGHT - FLOOR_Y);
    }

    // Draw Particles
    particles.forEach(p => p.draw(ctx));

    // Draw Entities
    if (blueCube) blueCube.draw(ctx);
    if (redCube) redCube.draw(ctx);

    // Draw Shatter
    if (shatterActive) {
        shatterShards.forEach(s => {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = s.color;
            ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
            ctx.restore();
        });
    }

    // Draw Floating Text
    floatingTexts.forEach(t => t.draw(ctx));

    ctx.restore();
}

// SANDBOX MENU LOGIC
function toggleSandboxMenu() {
    const min = document.getElementById('sandbox-menu');
    min.classList.toggle('active');

    if (min.classList.contains('active')) {
        renderSandboxList();
    }
}

function renderSandboxList() {
    const list = document.getElementById('sb-cube-list');
    list.innerHTML = '';

    CUBE_DATA.forEach(cube => {
        const div = document.createElement('div');
        div.className = 'sb-cube-item' + (blueCube.constructor.name === getClassForId(cube.id).name ? ' active' : '');
        div.innerHTML = `
            <div style="width:30px; height:30px; background:${cube.color}; margin-right:10px;"></div>
            <div>${cube.name}</div>
        `;
        div.onclick = () => {
            switchPlayerCube(cube.id);
            toggleSandboxMenu(); // Close after pick
            // Or stay open? Let's close.
        };
        list.appendChild(div);
    });
}

function switchPlayerCube(id) {
    const x = blueCube.x;
    const y = blueCube.y;
    const hp = blueCube.hp;

    const CubeClass = getClassForId(id);
    blueCube = new CubeClass();
    blueCube.x = x;
    blueCube.y = y;
    // Keep HP or reset? Reset for sandbox fun
    // blueCube.hp = hp; 
}

// Init first render (black screen or menu)
gameState = 'menu';
showMainMenu();
ctx.fillStyle = "#f0f0f0";
ctx.fillRect(0, 0, WIDTH, HEIGHT);
