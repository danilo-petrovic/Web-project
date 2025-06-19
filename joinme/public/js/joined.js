let currentUser;

getCurrentUserInfo().then(({ user, nickname }) => {
  currentUser = user;
  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();

  loadJoinedTrips(user.uid);
});

function loadJoinedTrips(uid) {
  fetch("/api/trips")
    .then(res => res.json())
    .then(trips => {
      const container = document.getElementById("trips-container");
      container.innerHTML = "";

      const joinedTrips = trips.filter(trip =>
        Array.isArray(trip.joined) && trip.joined.some(u => u.userId === uid)
      );

      if (joinedTrips.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">There are no joined trips.</p>';
        return;
      }

      const row = document.createElement("div");
      row.className = "row g-4";

      joinedTrips.forEach(trip => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">${trip.title}</h5>
              <p class="card-subtitle mb-1 text-muted">Location: ${trip.location}</p>
              <p class="card-subtitle mb-2 text-muted">Start date: ${trip.date}</p>
              <p class="card-text">${trip.description}</p>
              <small class="text-muted">Created by: ${trip.creator}</small>
              <div class="mt-3 d-flex justify-content-center">
                <button class="btn btn-sm btn-outline-danger" onclick="leaveTrip('${trip.id}')">Leave</button>
              </div>
            </div>
          </div>
        `;
        row.appendChild(col);
      });

      container.appendChild(row);
    })
    .catch(err => {
      console.error("Error loading joined trips:", err);
    });
}

function leaveTrip(id) {
  if (!confirm("Are you sure you want to leave this trip?")) return;

  fetch(`/api/trips/${id}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: currentUser.uid })
  })
    .then(res => {
      if (res.ok) {
        loadJoinedTrips(currentUser.uid);
      } else {
        alert("Error leaving trip");
      }
    })
    .catch(err => {
      console.error("Leave trip error:", err);
      alert("Error");
    });
}

const slideshowImages = ["thailand.jpg", "tajikistan.jpg", "galapagos.jpg", "ecuador.jpg", "bali.jpg"];
let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideshowImages.length;
  document.getElementById("slideshow-img").src = "img/" + slideshowImages[slideIndex];
}, 1000);
