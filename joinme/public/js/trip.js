const params = new URLSearchParams(window.location.search);
const tripId = params.get("id");

let currentUser;
let currentNickname;

getCurrentUserInfo().then(({ user, nickname }) => {
  currentUser = user;
  currentNickname = nickname;

  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();

  loadTripDetails();
});

async function loadTripDetails() {
  try {
    const res = await fetch(`/api/trips/${tripId}`);
    const trip = await res.json();

    const container = document.getElementById("trip-details");
    container.innerHTML = `
      <h3 class="mb-3">${trip.title}</h3>
      <p><strong>Destination:</strong> ${trip.location}</p>
      <p><strong>Start date:</strong> ${trip.date}</p>
      <p><strong>Description:</strong> ${trip.description}</p>
      <p><strong>Created by:</strong> ${trip.creator}</p>
      <div class="text-end">
        <button class="btn btn-success" onclick="acceptTrip()">Join</button>
      </div>
    `;
  } catch (err) {
    alert("Error loading trip");
    window.location.href = "home.html";
  }
}

async function acceptTrip() {
  try {
    const res = await fetch(`/api/trips/${tripId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.uid, nickname: currentNickname })
    });

    if (res.ok) {
      window.location.href = "joined.html";
    } else {
      alert("Error accepting trip");
    }
  } catch (err) {
    alert("Error joining");
  }
}
