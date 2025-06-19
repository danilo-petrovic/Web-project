document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nickname = document.getElementById("nickname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!nickname || !email || !password || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    await firebase.firestore().collection("users").doc(uid).set({
      nickname: nickname,
      email: email,
      createdAt: new Date()
    });

    window.location.href = "/home";
  } catch (err) {
    alert(err.message);
  }
});
