
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

// ==========================================
// WEATHER SECTION
// ==========================================

(function renderWeather() {
  const weatherData = [
    {
      day: "DAYS 01–04",
      location: "Osaka",
      high: "12–18°C",
      low: "5–10°C",
      tip: "Comfortable layers, a sweater and a medium-weight jacket.",
      query: "Osaka Japan"
    },
    {
      day: "DAY 03",
      location: "Nara",
      high: "11–17°C",
      low: "3–8°C",
      tip: "A warm jacket is useful, especially during the afternoon and evening.",
      query: "Nara Japan"
    },
    {
      day: "DAYS 05–07",
      location: "Kyoto",
      high: "11–17°C",
      low: "3–8°C",
      tip: "Wear layers. Temple visits and outdoor walks can feel cold.",
      query: "Kyoto Japan"
    },
    {
      day: "DAY 08",
      location: "Hakone",
      high: "6–14°C",
      low: "-1–7°C",
      tip: "Bring a warm coat. Mountain areas can be much colder.",
      query: "Hakone Japan"
    },
    {
      day: "DAY 09",
      location: "Lake Kawaguchi",
      high: "7–12°C",
      low: "-3–3°C",
      tip: "Thermal layers, gloves and a warm jacket are recommended.",
      query: "Lake Kawaguchi Japan"
    },
    {
      day: "DAY 09",
      location: "Mount Fuji Viewpoints",
      high: "3–10°C",
      low: "-5–2°C",
      tip: "Exposed and elevated areas may feel colder. Prepare extra layers.",
      query: "Mount Fuji Japan"
    },
    {
      day: "DAYS 10–13",
      location: "Tokyo",
      high: "11–17°C",
      low: "3–9°C",
      tip: "A sweater and winter jacket should be useful for outdoor sightseeing.",
      query: "Tokyo Japan"
    }
  ];

  const grid = document.getElementById("weatherGrid");

  grid.innerHTML = weatherData.map(place => {
    const weatherSearch =
      "https://www.google.com/search?q=" +
      encodeURIComponent("weather forecast " + place.query);

    return `
      <article class="weather-card">
        <div class="weather-day">${place.day}</div>
        <div class="weather-location">${place.location}</div>

        <div class="weather-temperatures">
          <div class="weather-temp">
            <small>Daytime</small>
            <strong>${place.high}</strong>
          </div>

          <div class="weather-temp">
            <small>Night</small>
            <strong>${place.low}</strong>
          </div>
        </div>

        <div class="weather-tip">${place.tip}</div>

        <a class="weather-link"
           href="${weatherSearch}"
           target="_blank"
           rel="noopener">
          Check local weather ↗
        </a>
      </article>
    `;
  }).join("");
})();

