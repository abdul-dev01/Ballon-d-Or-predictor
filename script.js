/* ============================================================
   PART 1 — COUNTDOWN
   ============================================================ */

// The exact moment the countdown counts down to.
// Format: "YYYY-MM-DDTHH:MM:SS+01:00"  (+01:00 = London is 1 hour ahead of UTC in October)
const CEREMONY_DATE = new Date("2026-10-26T19:00:00+01:00");

// Grab the 4 number elements once, so we don't search the page every second.
const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

// Remember the last value shown in each box, so we only "flip" a box
// when its number actually changes (not 4 times a second for no reason).
const lastValue = { days: null, hours: null, minutes: null, seconds: null };

function updateCountdown() {
  const now = new Date();
  let diff = CEREMONY_DATE - now; // milliseconds remaining

  if (diff < 0) diff = 0; // ceremony has happened — freeze at 0 instead of going negative

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setUnit("days", days);
  setUnit("hours", hours);
  setUnit("minutes", minutes);
  setUnit("seconds", seconds);
}

// Updates one box (e.g. "hours") and plays the 3D flip only if the number changed.
function setUnit(key, value) {
  const text = String(value).padStart(2, "0");
  if (lastValue[key] === text) return; // nothing changed, do nothing
  lastValue[key] = text;

  els[key].textContent = text;

  const card = els[key].closest(".flip-card");
  card.classList.remove("flip"); // reset in case it's still animating
  void card.offsetWidth;         // trick to force the browser to notice the reset
  card.classList.add("flip");    // this class runs the rotateX animation (see style.css)
}

updateCountdown();               // run once immediately, so the page isn't blank for a second
setInterval(updateCountdown, 1000); // then every second after that


/* ============================================================
   PART 2 — NOMINEE LEADERBOARD
   ============================================================ */

fetch("nominees.json")
  .then((response) => response.json())
  .then((nominees) => {
    // Highest probability first.
    nominees.sort((a, b) => b.probability - a.probability);

    const list = document.getElementById("leaderboard");

    nominees.forEach((player, index) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span class="rank">${index + 1}</span>
        <span class="avatar" style="background:${colorFromName(player.name)}">
          ${initials(player.name)}
        </span>
        <span class="name-club">
          <span class="name">${player.name}</span><br>
          <span class="club">${player.club}</span>
        </span>
        <span class="bar-track"><span class="bar-fill" data-target="${player.probability}"></span></span>
        <span class="percent">${player.probability}%</span>
      `;

      list.appendChild(li);
    });

    // Wait one frame, then set each bar's real width.
    // (If we set it immediately, the browser skips the animation.)
    requestAnimationFrame(() => {
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.target + "%";
      });
    });
  })
  .catch((error) => {
    console.error("Could not load nominees.json:", error);
  });

// Turns "Harry Kane" into "HK"
function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Turns a name into a consistent gold-ish color, so avatars aren't all identical.
function colorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 40 + 30; // stays in the gold/amber range (30–70)
  return `hsl(${hue}, 55%, 65%)`;
}
