let currentUser;

getCurrentUserInfo().then(({ user, nickname }) => {
  currentUser = user;
  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();
  loadMyTrips(user.uid);
});

function loadMyTrips(uid) {
  fetch("/api/trips")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("trips-container");
      container.innerHTML = "";

      const myTrips = data.filter(trip => trip.creatorUid === uid);

      if (myTrips.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No created trips</p>';
        return;
      }

      const row = document.createElement("div");
      row.className = "row g-4 justify-content-center";

      myTrips.forEach(trip => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const participants = (trip.joined && trip.joined.length > 0)
          ? `<ul class="list-group mt-2">${trip.joined.map(u => `<li class="list-group-item">${u.nickname}</li>`).join("")}</ul>`
          : `<p class="text-muted mt-2">Nobody joined the trip</p>`;

        col.innerHTML = `
          <div class="card h-100 shadow-sm trip-card p-3">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title text-center">${trip.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted text-center">${trip.location}</h6>
                <h6 class="card-subtitle mb-2 text-muted text-center">${trip.date}</h6>
                <p class="card-text text-center">${trip.description}</p>
                <h6 class="mt-3">Participants:</h6>
                ${participants}
              </div>
              <div class="mt-3 d-flex justify-content-between">
                <button class="btn btn-sm btn-warning" onclick="editTrip('${trip.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTrip('${trip.id}')">Delete</button>
              </div>
            </div>
          </div>
        `;

        row.appendChild(col);
      });

      container.appendChild(row);
    })
    .catch(err => {
      console.error("Error loading trips:", err);
      document.getElementById("trips-container").innerHTML = "<p class='text-danger text-center'>Error loading trips</p>";
    });
}

function deleteTrip(id) {
  if (!confirm("Do you want to delete this trip?")) return;

  fetch(`/api/trips/${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) {
        loadMyTrips(currentUser.uid);
      } else {
        alert("Error deleting trip");
      }
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

function editTrip(id) {
  if (!id) return;
  window.location.href = `edit.html?id=${id}`;
}

const slideshowImages = ["thailand.jpg", "tajikistan.jpg", "galapagos.jpg", "ecuador.jpg", "bali.jpg"];
let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideshowImages.length;
  document.getElementById("slideshow-img").src = "img/" + slideshowImages[slideIndex];
}, 1000);
