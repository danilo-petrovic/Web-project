const tripId = new URLSearchParams(window.location.search).get("id");

if (!tripId) {
  alert("ID not found");
  window.location.href = "mytrips.html";
}

getCurrentUserInfo().then(async ({ user, nickname }) => {
  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();

  try {
    const res = await fetch(`/api/trips/${tripId}`);
    const trip = await res.json();

    if (!trip || trip.creatorUid !== user.uid) {
      alert("You cannot edit this trip");
      window.location.href = "mytrips.html";
      return;
    }

    document.getElementById("title").value = trip.title;
    document.getElementById("location").value = trip.location;
    document.getElementById("date").value = trip.date;
    document.getElementById("description").value = trip.description;

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const updated = {
        title: document.getElementById("title").value.trim(),
        location: document.getElementById("location").value.trim(),
        date: document.getElementById("date").value,
        description: document.getElementById("description").value.trim()
      };

      if (!updated.title || !updated.location || !updated.date || !updated.description) {
        alert("All fields are required");
        return;
      }

      const updateRes = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (updateRes.ok) {
        window.location.href = "mytrips.html";
      } else {
        alert("Error");
      }
    });
  } catch (err) {
    alert("Error");
    window.location.href = "mytrips.html";
  }
});

const slideshowImages = ["thailand.jpg", "tajikistan.jpg", "galapagos.jpg", "ecuador.jpg", "bali.jpg"];
let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideshowImages.length;
  document.getElementById("slideshow-img").src = "img/" + slideshowImages[slideIndex];
}, 1000);
