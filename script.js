// =====================================================
// ☕ Cozy Study Space — Real-Time Comments + User Count
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// 👩‍💻 Real-Time User Counter (Firebase)
const usersRef = ref(db, "activeUsers");
const studyCountDisplay = document.getElementById("studyCount");
const thisUser = push(usersRef);
set(thisUser, { joined: serverTimestamp() });

window.addEventListener("beforeunload", () => remove(thisUser));

onValue(usersRef, (snapshot) => {
  const users = snapshot.val();
  const count = users ? Object.keys(users).length : 0;
  studyCountDisplay.textContent = count;
});

// 🌸 Fade-In Animation for Widget
window.addEventListener("load", () => {
  const widget = document.getElementById("studyWidget");
  if (widget) {
    widget.style.opacity = "0";
    setTimeout(() => (widget.style.opacity = "1"), 800);
  }
});

