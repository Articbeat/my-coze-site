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
