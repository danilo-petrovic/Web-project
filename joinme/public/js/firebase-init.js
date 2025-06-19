const firebaseConfig = {
  apiKey: "AIzaSyAW7IY6uFfLsl3ydiMGopvPG26xeGUH4q4",
  authDomain: "joinme-web-82168.firebaseapp.com",
  projectId: "joinme-web-82168",
  storageBucket: "joinme-web-82168.appspot.com",
  messagingSenderId: "863451647078",
  appId: "1:863451647078:web:ec14455fd8ec50ec0eb1a7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
