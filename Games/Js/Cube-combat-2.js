
const AudioSystem = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    currentMusic: null,

    init: function() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.6;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.4;
        this.sfxGain.connect(this.masterGain);
    },

    
    playSFX: function(type) {
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        switch(type) {
            case 'alert':
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'damage':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'explosion':
                const noise = this.ctx.createBufferSource();
                const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.5, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < buffer.length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                const noiseFilter = this.ctx.createBiquadFilter();
                noiseFilter.type = 'lowpass';
                noiseFilter.frequency.setValueAtTime(800, now);
                noiseFilter.frequency.exponentialRampToValueAtTime(50, now + 0.5);
                noise.connect(noiseFilter);
                noiseFilter.connect(gain);
                gain.gain.setValueAtTime(0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                noise.start(now);
                noise.stop(now + 0.5);
                break;

            case 'glitch':
                osc.type = 'square';
                osc.frequency.setValueAtTime(Math.random() * 500 + 200, now);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'whoosh':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'tension':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(120, now + 2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.5, now + 2);
                osc.start(now);
                osc.stop(now + 2);
                break;
        }
    },

    
    startMusic: function(mood = 'ambient') {
        if (!this.ctx) return;
        this.stopMusic();

        const now = this.ctx.currentTime;

        if (mood === 'ambient') {
            
            const bass = this.ctx.createOscillator();
            bass.type = 'sine';
            bass.frequency.value = 55; 

            const mid = this.ctx.createOscillator();
            mid.type = 'triangle';
            mid.frequency.value = 110; 

            const pad = this.ctx.createOscillator();
            pad.type = 'sine';
            pad.frequency.value = 220; 

            const bassGain = this.ctx.createGain();
            const midGain = this.ctx.createGain();
            const padGain = this.ctx.createGain();

            bassGain.gain.value = 0.2;
            midGain.gain.value = 0.1;
            padGain.gain.value = 0.05;

            bass.connect(bassGain).connect(this.musicGain);
            mid.connect(midGain).connect(this.musicGain);
            pad.connect(padGain).connect(this.musicGain);

            bass.start(now);
            mid.start(now);
            pad.start(now);

            this.currentMusic = [bass, mid, pad];

        } else if (mood === 'danger') {
            
            const bass = this.ctx.createOscillator();
            bass.type = 'sawtooth';
            bass.frequency.value = 65; 

            const pulse = this.ctx.createOscillator();
            pulse.type = 'square';
            pulse.frequency.value = 130; 

            const bassGain = this.ctx.createGain();
            const pulseGain = this.ctx.createGain();

            bassGain.gain.value = 0.25;
            pulseGain.gain.value = 0.1;

            
            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 2;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.05;
            lfo.connect(lfoGain).connect(pulseGain.gain);

            bass.connect(bassGain).connect(this.musicGain);
            pulse.connect(pulseGain).connect(this.musicGain);

            bass.start(now);
            pulse.start(now);
            lfo.start(now);

            this.currentMusic = [bass, pulse, lfo];
        }
    },

    stopMusic: function() {
        if (this.currentMusic) {
            const now = this.ctx.currentTime;
            this.currentMusic.forEach(osc => {
                try {
                    osc.stop(now + 0.5);
                } catch(e) {}
            });
            this.currentMusic = null;
        }
    },

    fadeMusic: function(targetVolume, duration = 1) {
        if (!this.musicGain) return;
        const now = this.ctx.currentTime;
        this.musicGain.gain.linearRampToValueAtTime(targetVolume, now + duration);
    }
};


const Cutscene3D = {
    active: false,
    scene: null, camera: null, renderer: null, clock: null,
    animationId: null,

    
    azure: null, greenCube: null, yellowCube: null, tesseract: null, groundGrid: null,
    particles: [],
    isGlitching: false,

    
    width: 800,
    height: 600,

    init: function() {
        const container = document.getElementById('three-canvas-container');
        container.innerHTML = ''; 

        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02);

        
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        
        const ambientLight = new THREE.AmbientLight(0x202040, 1.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        
        const rimLight = new THREE.DirectionalLight(0x00ffff, 0.8);
        rimLight.position.set(-5, 3, -5);
        this.scene.add(rimLight);

        
        this.ambientLight = ambientLight;
        this.dirLight = dirLight;
        this.rimLight = rimLight;

        
        this.particles = [];
        this.isGlitching = false;
        this.clock = new THREE.Clock();

        this.createWorld();
        this.createCharacters();
        this.animate();
    },

    createWorld: function() {
        
        const gridHelper = new THREE.GridHelper(100, 100, 0x00ffff, 0x333333);
        this.scene.add(gridHelper);
        this.groundGrid = gridHelper;

        
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x0a0a0a, side: THREE.DoubleSide, transparent: true, opacity: 0.8 
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.1;
        plane.receiveShadow = true;
        this.scene.add(plane);
    },

    createCharacters: function() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        const azMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x0066ff,
            emissiveIntensity: 0.7,
            roughness: 0.15,
            metalness: 0.9
        });
        this.azure = new THREE.Mesh(geometry, azMat);
        this.azure.position.set(0, 0.5, 0);
        this.azure.castShadow = true;
        this.azure.receiveShadow = true;
        this.scene.add(this.azure);

        
        const greenMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 0.4,
            roughness: 0.3,
            metalness: 0.7
        });
        this.greenCube = new THREE.Mesh(geometry, greenMat);
        this.greenCube.position.set(-2, 0.5, -1);
        this.greenCube.castShadow = true;
        this.scene.add(this.greenCube);

        
        const yellowMat = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0x444400,
            emissiveIntensity: 0.4,
            roughness: 0.3,
            metalness: 0.7
        });
        this.yellowCube = new THREE.Mesh(geometry, yellowMat);
        this.yellowCube.position.set(2, 0.5, -1);
        this.yellowCube.castShadow = true;
        this.scene.add(this.yellowCube);
    },

    createTesseract: function() {
        const outerGeometry = new THREE.BoxGeometry(3, 3, 3);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0033,
            wireframe: true,
            transparent: true,
            opacity: 0.9
        });
        const outerCube = new THREE.Mesh(outerGeometry, outerMaterial);

        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x880011,
            emissive: 0xff0033,
            emissiveIntensity: 1.2,
            roughness: 0.1,
            metalness: 0.9
        });
        const core = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), coreMaterial);

        this.tesseract = new THREE.Group();
        this.tesseract.add(outerCube);
        this.tesseract.add(core);
        this.tesseract.position.set(0, 20, -10);

        
        const tesseractLight = new THREE.PointLight(0xff0033, 3, 15);
        this.tesseract.add(tesseractLight);

        this.scene.add(this.tesseract);
    },

    createDeResParticles: function(position, color) {
        const geo = new THREE.BufferGeometry();
        const count = 100; 
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for(let i=0; i<count; i++) {
            positions[i*3] = position.x + (Math.random() - 0.5) * 0.5;
            positions[i*3+1] = position.y + (Math.random() - 0.5) * 0.5;
            positions[i*3+2] = position.z + (Math.random() - 0.5) * 0.5;
            velocities.push({
                x: (Math.random() - 0.5) * 0.3,
                y: Math.random() * 0.25,
                z: (Math.random() - 0.5) * 0.3
            });
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: color,
            size: 0.15,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const ps = new THREE.Points(geo, mat);
        ps.userData = { velocities: velocities, life: 90 };
        this.scene.add(ps);
        this.particles.push(ps);
    },

    animate: function() {
        if (!this.active) return;
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        
        if(this.azure) {
            this.azure.rotation.y = Math.sin(elapsed * 1.2) * 0.1;
            this.azure.position.y = 0.5 + Math.sin(elapsed * 2) * 0.05;
        }

        
        if(this.tesseract) {
            this.tesseract.rotation.x += delta * 0.8;
            this.tesseract.rotation.y += delta * 1.2;
            this.tesseract.rotation.z += delta * 0.5;
        }

        
        if (this.isGlitching) {
            this.camera.position.x += (Math.random() - 0.5) * 0.3;
            this.camera.position.y += (Math.random() - 0.5) * 0.3;
            if (Math.random() > 0.8) {
                this.groundGrid.material.color.setHex(Math.random() > 0.5 ? 0xff0000 : 0x00ffff);
            }
            
            if (Math.random() > 0.7) {
                this.ambientLight.intensity = Math.random() * 2;
            }
        } else {
            if (this.groundGrid) {
                this.groundGrid.material.color.setHex(0x00ffff);
            }
            if (this.ambientLight) {
                this.ambientLight.intensity = 1.5;
            }
        }

        
        this.particles.forEach((p, index) => {
            const pos = p.geometry.attributes.position.array;
            const v = p.userData.velocities;
            for(let i=0; i<v.length; i++) {
                pos[i*3] += v[i].x;
                pos[i*3+1] += v[i].y;
                pos[i*3+2] += v[i].z;
                v[i].y -= 0.005; 
            }
            p.geometry.attributes.position.needsUpdate = true;
            p.userData.life--;

            
            p.material.opacity = p.userData.life / 90;

            if(p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(index, 1);
            }
        });

        this.renderer.render(this.scene, this.camera);
    },

    
    playSequence: async function() {
        this.active = true;
        this.init();
        document.getElementById('cutscene-layer').classList.remove('hidden');

        
        if (!AudioSystem.ctx) {
            AudioSystem.init();
        }

        
        AudioSystem.startMusic('ambient');

        const showText = async (text, dur = 3000) => {
            const box = document.getElementById('cs-dialog-box');
            const content = document.getElementById('cs-dialog-text');
            content.innerHTML = text;
            box.style.opacity = 1;
            await this.sleep(dur);
            box.style.opacity = 0;
            await this.sleep(500);
        };

        
        const moveDialogAway = () => {
            const box = document.getElementById('cs-dialog-box');
            if (box) box.classList.add('cs-move-up');
        };
        const moveDialogBack = () => {
            const box = document.getElementById('cs-dialog-box');
            if (box) box.classList.remove('cs-move-up');
        };

        
        await this.sleep(1000);

        
        AudioSystem.playSFX('whoosh');
        const camStartPos = { x: 0, y: 5, z: 10 };
        let t = 0;
        while(t < 1) {
            t += 0.008;
            this.camera.position.x = camStartPos.x + Math.sin(t * Math.PI) * 1.5;
            this.camera.lookAt(0, 0, 0);
            await this.sleep(16);
        }

        await showText("System: Sector Zero. Hub World. Status: Normal.", 3000);

        
        AudioSystem.playSFX('tension');
        AudioSystem.fadeMusic(0.1, 1); 

        this.scene.fog.color.setHex(0x330000);
        this.scene.background.setHex(0x110000);
        this.ambientLight.color.setHex(0x400000);
        this.rimLight.color.setHex(0xff0000);

        
        const camZoomStart = this.camera.position.clone();
        t = 0;
        while(t < 1) {
            t += 0.03;
            this.camera.position.z = camZoomStart.z - t * 2;
            this.camera.position.y = camZoomStart.y + t * 1;
            this.camera.lookAt(0, 2, -5);
            await this.sleep(16);
        }

        AudioSystem.playSFX('alert');
        document.getElementById('game-wrapper').classList.add('screen-shake');
        await showText("System Alert: Anomalous energy signature detected!", 2000);

        
        AudioSystem.stopMusic();
        await this.sleep(300);
        AudioSystem.startMusic('danger');

        this.createTesseract();
        AudioSystem.playSFX('whoosh');
        moveDialogAway();

        
        t = 0;
        while(t < 1) {
            t += 0.01;
            const easeT = t * t; 
            this.tesseract.position.y = 20 + (5 - 20) * easeT;
            
            this.camera.lookAt(0, this.tesseract.position.y * 0.3, -5);
            await this.sleep(16);
        }

        
        AudioSystem.playSFX('explosion');
        document.getElementById('game-wrapper').classList.remove('screen-shake');
        await this.sleep(300);
        moveDialogBack();

        
        this.isGlitching = true;
        const warn = document.getElementById('warning-overlay');
        warn.style.display = 'block';
        warn.classList.add('glitch-anim');

        
        for(let i = 0; i < 5; i++) {
            AudioSystem.playSFX('glitch');
            await this.sleep(300);
        }

        await this.sleep(0);
        warn.style.display = 'none';

        await showText("Entity: Crimson Tesseract. executing: DELETE_ALL.EXE", 3000);

        
        AudioSystem.playSFX('whoosh');
        const startG = this.greenCube.position.clone();
        const startY = this.yellowCube.position.clone();
        t = 0;
        while(t < 1) {
            t += 0.01;
            this.greenCube.position.lerpVectors(startG, this.tesseract.position, t);
            this.yellowCube.position.lerpVectors(startY, this.tesseract.position, t);
            const s = 1 - t;
            this.greenCube.scale.set(s, s, 0.1);
            this.yellowCube.scale.set(s, s, 0.1);
            await this.sleep(16);
        }

        
        AudioSystem.playSFX('damage');
        this.scene.remove(this.greenCube);
        this.scene.remove(this.yellowCube);
        this.createDeResParticles(this.tesseract.position, 0x00ff00);
        this.createDeResParticles(this.tesseract.position, 0xffff00);

        await showText("Azure: NO! They're being compressed!", 2000);

        
        AudioSystem.playSFX('explosion');
        AudioSystem.playSFX('damage');
        this.createDeResParticles(this.azure.position, 0x00ffff);
        const azStart = this.azure.position.clone();
        const azEnd = new THREE.Vector3(0, 0.5, 8); 
        const camDamageStart = this.camera.position.clone();

        t = 0;
        while(t < 1) {
            t += 0.02;
            this.azure.position.lerpVectors(azStart, azEnd, t);
            this.azure.rotation.z += 0.2;
            
            this.azure.material.color.setHex(Math.random() > 0.5 ? 0x333333 : 0x00ffff);
            this.azure.material.emissiveIntensity = Math.random() * 0.8;

            
            this.camera.position.z = camDamageStart.z + Math.sin(t * Math.PI * 4) * 0.5;
            this.camera.lookAt(this.azure.position);

            if (t % 0.1 < 0.02) AudioSystem.playSFX('glitch');

            await this.sleep(16);
        }

        await showText("System: CORE INTEGRITY CRITICAL. ABILITIES OFFLINE.", 2000);

        
        AudioSystem.playSFX('whoosh');
        while(this.azure.position.x > -15) {
            this.azure.position.x -= 0.5;
            this.camera.position.x -= 0.2;
            this.camera.lookAt(this.azure.position);
            await this.sleep(16);
        }

        
        AudioSystem.fadeMusic(0, 1.5);
        await this.sleep(500);
        this.cleanup();
    },

    cleanup: function() {
        this.active = false;
        cancelAnimationFrame(this.animationId);
        document.getElementById('cutscene-layer').classList.add('hidden');
        
        AudioSystem.stopMusic();
        
        startGame();
    },

    sleep: function(ms) { return new Promise(r => setTimeout(r, ms)); }
};



const CAMPAIGN_DATA = {
    act1: {
        title: "The Glitch",
        levels: [
            {
                id: "level_1_tutorial",
                scene: "Sector Zero (Ruins)",
                introDialogue: [
                    { speaker: "Azure", text: "Ugh... my render buffer... hurts." },
                    { speaker: "System", text: "DIAGNOSTIC: Friends deleted. World corrupted. Jump module online." },
                    { speaker: "Azure", text: "I have to get them back. I have to find that red box." }
                ],
                bg: "#111", 
                floorColor: "#003366"
            }
        ]
    }
};


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = 800;
const HEIGHT = 600;

const GAME_STATE = { MENU: 0, DIALOGUE: 1, COMBAT: 2 };
let currentState = GAME_STATE.MENU;
let keys = {};

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (StoryManager.active && e.code === 'Space') {
        e.preventDefault();
        StoryManager.advance();
    }
});
window.addEventListener('keyup', e => keys[e.code] = false);

const StoryManager = {
    active: false, queue: [], currentLineIndex: 0,
    container: document.getElementById('dialogue-box'),
    speakerEl: document.getElementById('speaker-name'),
    textEl: document.getElementById('dialogue-text'),

    startDialogue: function (dialogueArray) {
        this.queue = dialogueArray;
        this.currentLineIndex = 0;
        this.active = true;
        currentState = GAME_STATE.DIALOGUE;
        this.container.classList.remove('hidden');
        this.showLine();
    },
    showLine: function () {
        if (this.currentLineIndex >= this.queue.length) {
            this.endDialogue();
            return;
        }
        const line = this.queue[this.currentLineIndex];
        this.speakerEl.innerText = line.speaker;
        this.textEl.innerText = line.text;
    },
    advance: function () { this.currentLineIndex++; this.showLine(); },
    endDialogue: function () {
        this.active = false;
        this.container.classList.add('hidden');
        currentState = GAME_STATE.COMBAT;
    }
};

class Entity {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.w = 50; this.h = 50;
        this.color = color; this.vx = 0; this.vy = 0; this.isGrounded = false;
    }
    update() {
        this.vy += 0.6; this.x += this.vx; this.y += this.vy;
        this.vx *= 0.8;
        if (this.y + this.h >= HEIGHT - 50) {
            this.y = HEIGHT - 50 - this.h; this.vy = 0; this.isGrounded = true;
        } else { this.isGrounded = false; }
        if (this.x < 0) this.x = 0;
        if (this.x + this.w > WIDTH) this.x = WIDTH - this.w;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        if (this === player) {
            ctx.shadowBlur = 10; ctx.shadowColor = this.color;
            ctx.strokeStyle = "white"; ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.shadowBlur = 0;
        }
    }
}

class Player extends Entity {
    constructor() { super(100, HEIGHT - 150, '#0000FF'); }
    update() {
        if (currentState !== GAME_STATE.COMBAT) return;
        super.update();
        if (keys['ArrowLeft'] || keys['KeyA']) this.vx -= 1.0;
        if (keys['ArrowRight'] || keys['KeyD']) this.vx += 1.0;
        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && this.isGrounded) this.vy = -14;
    }
}

let player = new Player();

function loop() {
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, WIDTH, HEIGHT); 
    ctx.fillStyle = '#003366'; ctx.fillRect(0, HEIGHT - 50, WIDTH, 50); 
    player.update();
    player.draw();
    requestAnimationFrame(loop);
}




function startCampaignFlow() {
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('main-menu').classList.add('hidden');
    
    
    Cutscene3D.playSequence();
}


function startGame() {
    const level = CAMPAIGN_DATA.act1.levels[0];
    player.x = 100; player.y = HEIGHT - 150;
    
    
    StoryManager.startDialogue(level.introDialogue);
    
    if (!gameLoopStarted) {
        gameLoopStarted = true;
        loop();
    }
}

function showCredits() {
    alert("Act 1: Three.js Cinematic\nAct 2: Canvas Combat\nCreated by Will Bowman & AI");
}

let gameLoopStarted = false;

ctx.fillStyle = '#111'; ctx.fillRect(0, 0, WIDTH, HEIGHT);