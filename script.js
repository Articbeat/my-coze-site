// =====================================================
//  ☕ Cozy Study Space — Live Comments + User Count
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// ✅ Paste your Firebase config here:
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR-PROJECT-default-rtdb.firebaseio.com/",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-MESSAGE-ID",
  appId: "YOUR-APP-ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================================================
//  🎧 Ambient Sound Toggle
// =====================================================
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

// =====================================================
//  ⏳ Pomodoro Timer
// =====================================================
let totalTime = 25 * 60;
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

// =====================================================
//  📝 Notes Auto-Save
// =====================================================
const noteArea = document.getElementById("noteArea");
noteArea.value = localStorage.getItem("cozyNotes") || "";

noteArea.addEventListener("input", () => {
  localStorage.setItem("cozyNotes", noteArea.value);
});

// =====================================================
//  🌙 Theme Toggle
// =====================================================
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  themeToggle.textContent = darkMode ? "☀️ Switch Theme" : "🌙 Switch Theme";
});

// =====================================================
//  💬 Real-Time Comment Box (Firebase)
// =====================================================
const commentInput = document.getElementById("commentInput");
const addComment = document.getElementById("addComment");
const commentList = document.getElementById("commentList");
const commentsRef = ref(db, "comments");

addComment.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (text) {
    push(commentsRef, {
      text: text,
      timestamp: serverTimestamp(),
    });
    commentInput.value = "";
  }
});

onValue(commentsRef, (snapshot) => {
  const data = snapshot.val();
  commentList.innerHTML = "";
  if (data) {
    const sorted = Object.entries(data).sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let [id, comment] of sorted) {
      const div = document.createElement("div");
      div.classList.add("comment");
      div.textContent = comment.text;
      commentList.appendChild(div);
    }
  }
});

// =====================================================
//  👩‍💻 Real-Time User Counter (Firebase)
// =====================================================
const usersRef = ref(db, "activeUsers");
const studyCountDisplay = document.getElementById("studyCount");
const thisUser = push(usersRef); // Create a unique ID for this visitor

set(thisUser, { joined: serverTimestamp() });

// Remove user when they leave
window.addEventListener("beforeunload", () => {
  remove(thisUser);
});

onValue(usersRef, (snapshot) => {
  const users = snapshot.val();
  const count = users ? Object.keys(users).length : 0;
  if (studyCountDisplay) {
    studyCountDisplay.textContent = count;
  }
});

// =====================================================
//  🌸 Fade In Animation for Widget
// =====================================================
window.addEventListener("load", () => {
  const widget = document.getElementById("studyWidget");
  if (widget) {
    widget.style.opacity = "0";
    setTimeout(() => {
      widget.style.opacity = "1";
    }, 800);
  }
});
