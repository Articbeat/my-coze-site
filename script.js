// =====================================================
// ☕ Cozy Study Space — Real-Time Comments + User Count
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove, serverTimestamp, onDisconnect } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// ✅ Your Firebase Configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🎧 Ambient Sound Toggle
const soundToggle = document.getElementById("soundToggle");
const ambient = document.getElementById("ambient");
let isPlaying = false;

soundToggle.addEventListener("click", () => {
  if (!isPlaying) {
    ambient.play().catch(err => console.log("Audio playback blocked:", err));
    soundToggle.textContent = "🔇 Stop Ambience";
  } else {
    ambient.pause();
    soundToggle.textContent = "🔈 Play Ambience";
  }
  isPlaying = !isPlaying;
});

// ⏳ Pomodoro Timer
let totalTime = 45 * 60;
let remaining = totalTime;
let timer = null;
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

function updateTime() {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  timeDisplay.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

startBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(timer);
      alert("Time’s up! Take a break ☕");
      remaining = totalTime;
      updateTime();
      return;
    }
    remaining--;
    updateTime();
  }, 1000);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  remaining = totalTime;
  updateTime();
});

updateTime();

// 📝 Notes Auto-Save
const noteArea = document.getElementById("noteArea");
noteArea.value = localStorage.getItem("cozyNotes") || "";

noteArea.addEventListener("input", () => {
  localStorage.setItem("cozyNotes", noteArea.value);
});

// 🌙 Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  themeToggle.textContent = darkMode ? "☀️ Switch Theme" : "🌙 Switch Theme";
});

// 💬 Real-Time Comment Box (Firebase)
const commentInput = document.getElementById("commentInput");
const addComment = document.getElementById("addComment");
const commentList = document.getElementById("commentList");
const commentsRef = ref(db, "comments");

addComment.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (text) {
    console.log("Posting comment:", text);
    push(commentsRef, { text, timestamp: serverTimestamp() })
      .then(() => console.log("✅ Comment sent"))
      .catch(err => console.error("❌ Firebase error:", err));
    commentInput.value = "";
  }
});

onValue(commentsRef, (snapshot) => {
  const data = snapshot.val();
  commentList.innerHTML = "";
  if (data) {
    const sorted = Object.entries(data).sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let [id, c] of sorted) {
      const div = document.createElement("div");
      div.classList.add("comment");
      div.textContent = c.text;
      commentList.appendChild(div);
    }
  }
});

// 🧍‍♀️ Live User Counter (Fixed)
const usersRef = ref(db, "activeUsers");
const studyCountDisplay = document.getElementById("studyCount");

// Create a new record for this visitor
const thisUser = push(usersRef);
set(thisUser, { joined: serverTimestamp() });

// 🔌 Auto-remove this user when disconnected or tab closed
onDisconnect(thisUser).remove();
window.addEventListener("beforeunload", () => remove(thisUser));

// 👥 Count active users (only recent ones)
onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  const now = Date.now();
  let count = 0;

  if (data) {
    for (const id in data) {
      const joinedTime = data[id].joined?.seconds * 1000 || data[id].joined;
      // Only count users active within the last 10 minutes
      if (now - joinedTime < 10 * 60 * 1000) {
        count++;
      } else {
        // Clean up old inactive entries
        remove(ref(db, "activeUsers/" + id));
      }
    }
  }

  studyCountDisplay.textContent = count;
});
// ✨ Floating Dust / Glitter Effect
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create random particles
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 0.5, // small dots
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.6 + 0.2
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;

    // soft wraparound edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(drawParticles);
}

drawParticles();




