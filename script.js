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


(function () {
  const weatherDestinations = [
    {
      day: "DAY 01–04",
      name: "Osaka",
      location: "Dotonbori · Osaka Castle · USJ",
      high: "12–18°C",
      low: "5–10°C",
      tip: "Comfortable layers, sweaters and a medium jacket.",
      query: "Osaka Japan"
    },
    {
      day: "DAY 03",
      name: "Nara",
      location: "Nara Park · Todai-ji · Naramachi",
      high: "11–17°C",
      low: "3–8°C",
      tip: "Bring a warm jacket, especially for the afternoon return.",
      query: "Nara Japan"
    },
    {
      day: "DAY 05–07",
      name: "Kyoto",
      location: "Gion · Fushimi Inari · Arashiyama",
      high: "11–17°C",
      low: "3–8°C",
      tip: "Layer up for temple visits and evening walks.",
      query: "Kyoto Japan"
    },
    {
      day: "DAY 08",
      name: "Hakone",
      location: "Lake Ashi · Hakone Shrine",
      high: "6–14°C",
      low: "-1–7°C",
      tip: "Wear a warm coat. Temperatures vary with altitude.",
      query: "Hakone Japan"
    },
    {
      day: "DAY 09",
      name: "Kawaguchiko",
      location: "Lake Kawaguchi · Oishi Park",
      high: "7–12°C",
      low: "-3–3°C",
      tip: "Prepare thermal layers, gloves and a warm jacket.",
      query: "Lake Kawaguchi Japan"
    },
    {
      day: "DAY 09",
      name: "Mount Fuji Viewpoints",
      location: "Chureito Pagoda · Fuji viewing areas",
      high: "3–10°C",
      low: "-5–2°C",
      tip: "Expect colder conditions at exposed and elevated viewpoints.",
      query: "Mount Fuji Japan"
    },
    {
      day: "DAY 10–13",
      name: "Tokyo",
      location: "Shibuya · Asakusa · Harajuku · Ginza",
      high: "11–17°C",
      low: "3–9°C",
      tip: "A sweater and winter jacket should be useful.",
      query: "Tokyo Japan"
    }
  ];

  const weatherGrid = document.getElementById("weatherGrid");

  if (!weatherGrid) return;

  weatherGrid.innerHTML = weatherDestinations.map(place => `
    <article class="weather-card">
      <span class="weather-day">${place.day}</span>
      <h3>${place.name}</h3>
      <p class="weather-location">${place.location}</p>

      <div class="weather-temperatures">
        <div class="weather-temp">
          <span>DAYTIME HIGH</span>
          <strong>${place.high}</strong>
        </div>
        <div class="weather-temp">
          <span>NIGHT / LOW</span>
          <strong>${place.low}</strong>
        </div>
      </div>

      <p class="weather-tip">${place.tip}</p>

      <a class="weather-link"
         href="https://www.google.com/search?q=${encodeURIComponent(
           "weather forecast " + place.query
         )}"
         target="_blank"
         rel="noopener">
        Check Live Weather ↗
      </a>
    </article>
  `).join("");
})();

/* ==================================
   NAVIGATION DOTS
================================== */

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("weatherGrid");

  if (!grid) {
    console.error("Weather grid not found!");
    return;
  }

  grid.innerHTML = `
    <article class="weather-card">
      <span class="weather-day">DAY 01–04</span>
      <h3>Osaka</h3>
      <p class="weather-location">Dotonbori · Osaka Castle · USJ</p>

      <div class="weather-temperatures">
        <div class="weather-temp">
          <span>DAYTIME HIGH</span>
          <strong>12–18°C</strong>
        </div>
        <div class="weather-temp">
          <span>NIGHT / LOW</span>
          <strong>5–10°C</strong>
        </div>
      </div>

      <p class="weather-tip">
        Comfortable layers, sweaters and a medium jacket.
      </p>

      <a class="weather-link"
         href="https://www.google.com/search?q=Osaka+weather"
         target="_blank">
        Check Live Weather ↗
      </a>
    </article>
  `;
});

