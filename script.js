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

const weddingDate = new Date("2026-09-13T10:00:00+05:30");

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
    "UID:hanna-arshad-wedding-20260913@example.com",
    "DTSTAMP:20260619T000000Z",
    "DTSTART:20260913T043000Z",
    "DTEND:20260913T093000Z",
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
updateCountdown();
window.setInterval(updateCountdown, 1000);
