// =====================================================
// Cozy Study Space - script.js
// - particles canvas
// - side panel slide logic
// - Firebase + existing app logic (timer, notes, comments, user count)
// =====================================================

/* =========================
   Particle Background
   ========================= */
(function initParticles(){
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const PARTICLE_COUNT = Math.round((w * h) / 70000); // adapt to screen
  const DPR = window.devicePixelRatio || 1;
  canvas.width = Math.floor(w * DPR);
  canvas.height = Math.floor(h * DPR);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  function rand(min, max){ return Math.random() * (max - min) + min; }

  class Particle {
    constructor(){
      this.reset(true);
    }
    reset(initial = false){
      // spawn near bottom quarter to mimic 'dust in air' from below-ish
      this.x = rand(0, w);
      this.y = initial ? rand(h * 0.6, h) : h + rand(2, 120);
      this.size = rand(0.6, 2.6);
      this.velY = rand(-0.05, -0.6); // slow upward drift
      this.velX = rand(-0.25, 0.25);
      this.alpha = rand(0.05, 0.28);
      this.twinkle = rand(0.002, 0.02);
      this.phase = Math.random() * Math.PI * 2;
    }
    update(){
      this.x += this.velX;
      this.y += this.velY;
      this.phase += this.twinkle;
      // gentle horizontal wrap
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      // if gone above top, reset to bottom
      if (this.y < -20) this.reset(false);
    }
    draw(){
      ctx.beginPath();
      const alpha = Math.max(0, this.alpha + 0.12 * Math.sin(this.phase));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles(){
    particles.length = 0;
    for (let i = 0; i < Math.max(12, PARTICLE_COUNT); i++){
      particles.push(new Particle());
    }
  }

  function onResize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createParticles();
  }
  addEventListener('resize', onResize);

  function loop(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient overlay inside the canvas to add depth
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, 'rgba(255,255,255,0.01)');
    g.addColorStop(1, 'rgba(0,0,0,0.03)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }

  createParticles();
  loop();
})();

/* =========================
   Side Panel — slide left
   ========================= */
(() => {
  const panel = document.getElementById('sidePanel');
  const toggle = document.getElementById('panelToggle');
  const closeBtn = document.getElementById('panelClose');

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }
  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  // also allow panel to slide out when user moves pointer outside it
  panel.addEventListener('mouseleave', () => {
    // only auto-close on larger screens to avoid mobile annoyance
    if (window.innerWidth > 900) {
      closePanel();
    }
  });

  // open on hover for desktop (optional subtle effect)
  panel.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) openPanel();
  });
})();

/* =========================
   Existing App Logic (kept & polished)
   ========================= */

/* Firebase imports are module-style in HTML. Keep your imports in this file.
   NOTE: this file expects to run as module via <script type="module" src="script.js"></script>
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// ------------------
// Firebase config
// ------------------
const firebaseConfig = {
  apiKey: "AIzaSyCTSXqcVmFKkvo0gXVY2xez9Yx7su3iFMw",
  authDomain: "cozy-study-space.firebaseapp.com",
  databaseURL: "https://cozy-study-space-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cozy-study-space",
  storageBucket: "cozy-study-space.firebasestorage.app",
  messagingSenderId: "721938051355",
  appId: "1:721938051355:web:00df438c75eda2f9dfe3be",
  measurementId: "G-59EW1K4EN2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* =========================
   Ambient Sound Toggle
   ========================= */
const soundToggle = document.getElementById("soundToggle");
const ambient = document.getElementById("ambient");
let isPlaying = false;
soundToggle.addEventListener("click", () => {
  if (!isPlaying) {
    ambient.play().catch(err => console.log("Audio playback blocked:", err));
    soundToggle.textContent = "🔇 Stop Ambience";
