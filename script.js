
/* ==================================
   LEFT-SIDE DESTINATION PREVIEW
================================== */

// Create the preview panel
const preview = document.createElement("div");
preview.className = "preview-overlay";
preview.innerHTML = `
  <div class="preview-panel">
    <div class="preview-image" id="previewImage">
      <button class="preview-close" id="previewClose">×</button>
    </div>
    <div class="preview-content">
      <div class="preview-kicker" id="previewDay"></div>
      <h2 id="previewTitle"></h2>
      <div class="preview-time" id="previewTime"></div>
      <div class="preview-description" id="previewDescription"></div>
      <div class="preview-notes" id="previewNotes"></div>
    </div>
  </div>
`;
document.body.appendChild(preview);

function closePreview() {
  preview.classList.remove("open");
  document.body.classList.remove("preview-open");
}

document.getElementById("previewClose").addEventListener("click", closePreview);

preview.addEventListener("click", function(e) {
  if (e.target === preview) closePreview();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closePreview();
});

// Click any attraction card to open its preview
document.getElementById("itinerary").addEventListener("click", function(e) {
  const card = e.target.closest(".place-card");
  if (!card) return;

  const section = card.closest(".day");
  const dayNumber = Number(section.id.replace("day", ""));
  const day = days.find(d => d.n === dayNumber);

  if (!day) return;

  const cards = [...section.querySelectorAll(".place-card")];
  const cardIndex = cards.indexOf(card);
  const place = day.cards[cardIndex];

  if (!place) return;

  document.getElementById("previewImage").style.backgroundImage =
    `url('${day.photo}')`;

  document.getElementById("previewDay").textContent =
    `DAY ${String(day.n).padStart(2,"0")} · ${day.place}`;

  document.getElementById("previewTitle").textContent = place[0];

  document.getElementById("previewTime").textContent = place[1];

  document.getElementById("previewDescription").textContent = place[2];

  document.getElementById("previewNotes").innerHTML =
    `<strong>TRAVEL NOTES</strong><br>${place[3]}`;

  preview.classList.add("open");
  document.body.classList.add("preview-open");
});


/* ==================================
   INDIVIDUAL SCROLL ANIMATIONS
================================== */

const animatedElements = document.querySelectorAll(
  ".day-inner > *, .hero-content > *, .panel > *, " +
  ".route-item, .budget-row, .savings-box, .place-card"
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

animatedElements.forEach(element => {
  revealObserver.observe(element);
});


/* ==================================
   PARALLAX BACKGROUND MOVEMENT
================================== */

const daySections = document.querySelectorAll(".day");

let scrollAnimationRunning = false;

function updateParallax() {
  daySections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const screenHeight = window.innerHeight;

    if (rect.bottom > 0 && rect.top < screenHeight) {
      const movement = (rect.top / screenHeight) * -45;
      section.style.setProperty("--parallax", movement + "px");
    }
  });

  scrollAnimationRunning = false;
}

window.addEventListener("scroll", () => {
  if (!scrollAnimationRunning) {
    window.requestAnimationFrame(updateParallax);
    scrollAnimationRunning = true;
  }
}, { passive: true });

updateParallax();


/* ==================================
   NAVIGATION DOTS
================================== */

