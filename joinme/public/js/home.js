let allTrips = [];

getCurrentUserInfo().then(({ user, nickname }) => {
  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();

  document.getElementById("filter-title").addEventListener("input", filterAndSortTrips);
  document.getElementById("sort-date").addEventListener("change", filterAndSortTrips);

  loadTrips(user.uid);
});

function loadTrips(currentUid) {
  fetch("/api/trips")
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().split("T")[0];
      allTrips = data.filter(trip =>
        trip.date >= today &&
        trip.creatorUid !== currentUid &&
        !(trip.joined || []).some(u => u.userId === currentUid)
      );
      filterAndSortTrips();
    })
    .catch(err => {
      console.error("Error loading trips:", err);
      document.getElementById("trips-container").innerHTML = "<p class='text-danger text-center'>Error loading trips</p>";
    });
}

function filterAndSortTrips() {
  const term = document.getElementById("filter-title").value.toLowerCase();
  const sort = document.getElementById("sort-date").value;

  let filtered = allTrips.filter(trip =>
    trip.title.toLowerCase().includes(term)
  );

  if (sort === "asc") {
    filtered.sort((a, b) => a.date.localeCompare(b.date));
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.date.localeCompare(a.date));
  }

  renderTrips(filtered);
}

function renderTrips(trips) {
  const container = document.getElementById("trips-container");
  container.innerHTML = "";

  if (trips.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">No trips</p>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row g-4 justify-content-center";

  trips.forEach(trip => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm trip-card text-center" onclick="window.location.href='trip.html?id=${trip.id}'">
        <div class="card-body d-flex flex-column justify-content-center">
          <h5 class="card-title">${trip.title}</h5>
          <p class="text-muted mb-0">${trip.date}</p>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  container.appendChild(row);
}

const slideshowImages = [
  "thailand.jpg", "tajikistan.jpg", "galapagos.jpg", "ecuador.jpg", "bali.jpg"
];
let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideshowImages.length;
  document.getElementById("slideshow-img").src = "img/" + slideshowImages[slideIndex];
}, 1000);
