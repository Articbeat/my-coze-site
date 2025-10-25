// 🎧 Ambient sound toggle
const soundToggle = document.getElementById("soundToggle");
const ambient = document.getElementById("ambient");
let soundPlaying = false;

soundToggle.addEventListener("click", () => {
  soundPlaying = !soundPlaying;
  if (soundPlaying) {
    ambient.play();
    soundToggle.textContent = "🔇 Stop Ambience";
  } else {
    ambient.pause();
    soundToggle.textContent = "🔈 Play Ambience";
  }
});

// 🕒 Pomodoro-style timer
let time = 25 * 60;
let timerInterval;
const display = document.getElementById("time");

document.getElementById("start").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    display.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(timerInterval);
      alert("Time’s up! Take a break ☕");
      time = 25 * 60;
    }
  }, 1000);
});

document.getElementById("reset").addEventListener("click", () => {
  clearInterval(timerInterval);
  time = 25 * 60;
  display.textContent = "25:00";
});

// 📝 Notes (saved to browser)
const noteArea = document.getElementById("noteArea");
noteArea.value = localStorage.getItem("cozyNotes") || "";
noteArea.addEventListener("input", () => {
  localStorage.setItem("cozyNotes", noteArea.value);
});

// 🌓 Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️ Switch Theme"
    : "🌙 Switch Theme";
});
