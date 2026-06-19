const gate = document.getElementById("gate");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");
const countdown = document.getElementById("countdown");
const rsvpForm = document.getElementById("rsvpForm");
const blessingForm = document.getElementById("blessingForm");
const wishes = document.getElementById("wishes");
const calendarLink = document.getElementById("calendarLink");
const musicToggle = document.getElementById("musicToggle");
const weddingMusic = document.getElementById("weddingMusic");
const dateScratchCard = document.getElementById("dateScratchCard");
const dateScratchCanvas = document.getElementById("dateScratchCanvas");

const weddingDate = new Date("2026-09-12T10:00:00+05:30");

function openInvitation() {
  gate.classList.add("is-open");
  invitation.classList.add("is-visible");
  document.body.classList.add("invitation-open");
  document.body.style.overflow = "";
  startMusic();
  window.setTimeout(() => {
    gate.setAttribute("aria-hidden", "true");
  }, 950);
}

function updateCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());
  const seconds = Math.floor(distance / 1000) % 60;
  const minutes = Math.floor(distance / (1000 * 60)) % 60;
  const hours = Math.floor(distance / (1000 * 60 * 60)) % 24;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const values = { days, hours, minutes, seconds };

  Object.entries(values).forEach(([unit, value]) => {
    const node = countdown.querySelector(`[data-unit="${unit}"]`);
    node.textContent = String(value).padStart(2, "0");
  });
}

function makeCalendarFile() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hanna Arshad Wedding//Invitation//EN",
    "BEGIN:VEVENT",
    "UID:hanna-arshad-wedding-20260912@example.com",
    "DTSTAMP:20260619T000000Z",
    "DTSTART:20260912T043000Z",
    "DTEND:20260912T093000Z",
    "SUMMARY:Hanna and Arshad Wedding",
    "LOCATION:Deluxe Convention Centre, Pathappiriyam",
    "DESCRIPTION:Wedding celebration for Hanna and Arshad.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  calendarLink.href = URL.createObjectURL(blob);
}

function setupRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px" });

  revealItems.forEach((item) => observer.observe(item));
}

function selectedValue(form, name) {
  return new FormData(form).get(name);
}

function submitRsvp(event) {
  event.preventDefault();
  const data = new FormData(rsvpForm);
  const name = data.get("name").trim();
  const guests = selectedValue(rsvpForm, "guests");
  const response = selectedValue(rsvpForm, "response");
  const message = `Assalamu alaikum, this is ${name}. RSVP for Hanna and Arshad: ${response}. Guests: ${guests}.`;
  const whatsappUrl = `https://wa.me/919605290806?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

function submitBlessing(event) {
  event.preventDefault();
  const data = new FormData(blessingForm);
  const name = data.get("blessingName").trim();
  const message = data.get("message").trim();
  const entry = document.createElement("article");
  entry.innerHTML = `<p>"${escapeHtml(message)}"</p><span>${escapeHtml(name)}</span>`;
  wishes.append(entry);
  blessingForm.reset();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function setupDateScratchCard() {
  if (!dateScratchCard || !dateScratchCanvas) return;

  const context = dateScratchCanvas.getContext("2d", { willReadFrequently: true });
  const sparkleLayer = dateScratchCard.querySelector(".scratch-card__sparkles");
  let isDrawing = false;
  let hasRevealed = false;

  function paintCover() {
    const rect = dateScratchCard.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    dateScratchCanvas.width = Math.round(rect.width * ratio);
    dateScratchCanvas.height = Math.round(rect.height * ratio);
    dateScratchCanvas.style.width = `${rect.width}px`;
    dateScratchCanvas.style.height = `${rect.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const cover = context.createLinearGradient(0, 0, rect.width, rect.height);
    cover.addColorStop(0, "#fff8e8");
    cover.addColorStop(0.22, "#d8a94f");
    cover.addColorStop(0.5, "#f5df9b");
    cover.addColorStop(0.78, "#bb8232");
    cover.addColorStop(1, "#fff4da");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = cover;
    context.fillRect(0, 0, rect.width, rect.height);

    context.save();
    context.globalAlpha = 0.34;
    context.translate(rect.width / 2, rect.height / 2);
    context.rotate(-0.42);
    context.fillStyle = "rgba(255, 255, 255, 0.42)";
    for (let x = -rect.width; x < rect.width; x += 22) {
      context.fillRect(x, -rect.height, 3, rect.height * 2.4);
    }
    context.restore();

    context.fillStyle = "rgba(255, 255, 255, 0.2)";
    for (let index = 0; index < 95; index += 1) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const size = Math.random() * 1.8 + 0.5;
      context.fillRect(x, y, size, size);
    }
  }

  function scratch(event) {
    const rect = dateScratchCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 24, 0, Math.PI * 2);
    context.fill();
  }

  function revealProgress() {
    const { width, height } = dateScratchCanvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    let cleared = 0;

    for (let index = 3; index < pixels.length; index += 16) {
      if (pixels[index] < 20) cleared += 1;
    }

    return cleared / (pixels.length / 16);
  }

  function revealDate() {
    hasRevealed = true;
    createSparkles();
    dateScratchCard.classList.add("is-revealed");
    context.clearRect(0, 0, dateScratchCanvas.width, dateScratchCanvas.height);
  }

  function createSparkles() {
    if (!sparkleLayer) return;
    const bursts = [
      [-170, -52],
      [-132, 42],
      [-82, -72],
      [-34, 68],
      [36, -70],
      [82, 58],
      [132, -38],
      [170, 48],
      [0, -88],
      [0, 82]
    ];

    sparkleLayer.innerHTML = "";
    bursts.forEach(([x, y], index) => {
      const sparkle = document.createElement("i");
      sparkle.style.setProperty("--x", `${x}px`);
      sparkle.style.setProperty("--y", `${y}px`);
      sparkle.style.animationDelay = `${index * 36}ms`;
      sparkleLayer.append(sparkle);
    });
  }

  function startScratch(event) {
    if (hasRevealed) return;
    isDrawing = true;
    dateScratchCard.classList.add("is-scratching");
    dateScratchCanvas.setPointerCapture(event.pointerId);
    scratch(event);
  }

  function moveScratch(event) {
    if (!isDrawing || hasRevealed) return;
    scratch(event);
  }

  function endScratch(event) {
    if (!isDrawing || hasRevealed) return;
    isDrawing = false;
    dateScratchCard.classList.remove("is-scratching");
    dateScratchCanvas.releasePointerCapture(event.pointerId);

    if (revealProgress() > 0.42) {
      revealDate();
    }
  }

  paintCover();
  window.addEventListener("resize", paintCover);
  dateScratchCanvas.addEventListener("pointerdown", startScratch);
  dateScratchCanvas.addEventListener("pointermove", moveScratch);
  dateScratchCanvas.addEventListener("pointerup", endScratch);
  dateScratchCanvas.addEventListener("pointercancel", endScratch);
}

let musicPlaying = false;

async function startMusic() {
  if (musicPlaying) return;
  try {
    await weddingMusic.play();
    musicPlaying = true;
    musicToggle.classList.add("is-playing");
  } catch (error) {
    musicPlaying = false;
    musicToggle.classList.remove("is-playing");
  }
}

function stopMusic() {
  musicPlaying = false;
  musicToggle.classList.remove("is-playing");
  weddingMusic.pause();
}

function toggleMusic() {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

document.body.style.overflow = "hidden";
openButton.addEventListener("click", openInvitation);
rsvpForm.addEventListener("submit", submitRsvp);
blessingForm.addEventListener("submit", submitBlessing);
musicToggle.addEventListener("click", toggleMusic);

makeCalendarFile();
setupRevealAnimation();
setupDateScratchCard();
updateCountdown();
window.setInterval(updateCountdown, 1000);
