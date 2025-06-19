document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    window.location.href = "/home";
  } catch (err) {
    alert(err.message);
  }
});
