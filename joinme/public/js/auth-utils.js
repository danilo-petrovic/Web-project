async function getCurrentUserInfo(redirectIfNotLoggedIn = true) {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let nickname = user.email || "Guest";

        try {
          const doc = await firebase.firestore().collection("users").doc(user.uid).get();
          if (doc.exists && doc.data().nickname) {
            nickname = doc.data().nickname;
          }
        } catch (err) {
          console.warn("Nickname error:", err);
        }

        resolve({ user, nickname });
      } else if (redirectIfNotLoggedIn) {
        window.location.href = "/";
      } else {
        resolve({ user: null, nickname: "Guest" });
      }
    });
  });
}

function logoutListener(btnId = "logout-btn") {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener("click", async () => {
      try {
        await firebase.auth().signOut();
        window.location.href = "/";
      } catch (err) {
        console.error("Logout failed:", err);
      }
    });
  }
}
