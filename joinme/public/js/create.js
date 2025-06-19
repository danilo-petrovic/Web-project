let currentUser;
let currentNickname;

getCurrentUserInfo().then(({ user, nickname }) => {
  currentUser = user;
  currentNickname = nickname;

  document.getElementById("user-nickname").textContent = nickname;
  logoutListener();

  document.getElementById("trip-form").addEventListener("submit", submitTrip);
});

function submitTrip(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const location = document.getElementById("location").value.trim();
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value.trim();
  const today = new Date().toISOString().split("T")[0];

  if (!title || !location || !date || !description) {
    alert("All fields are required");
    return;
  }

  if (date < today) {
    alert("You cannot create a trip in the past");
    return;
  }

  const trip = {
    title,
    location,
    date,
    description,
    creator: currentNickname,
    creatorUid: currentUser.uid,
    createdAt: new Date().toISOString()
  };

  fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip)
  })
    .then(res => {
      if (res.ok) {
        window.location.href = "home.html";
      } else {
        alert("Error creating trip");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Error");
    });
}

const slideshowImages = ["thailand.jpg", "tajikistan.jpg", "galapagos.jpg", "ecuador.jpg", "bali.jpg"];
let slideIndex = 0;

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideshowImages.length;
  document.getElementById("slideshow-img").src ="img/" + slideshowImages[slideIndex];
}, 1000);
