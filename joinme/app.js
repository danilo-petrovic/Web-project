const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");
const tripRoutes = require("./backend/routes/trips");

const app = express();
const PORT = process.env.PORT || 3000;

let serviceAccount;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
  const decoded = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf8');
  serviceAccount = JSON.parse(decoded);
} else {
  serviceAccount = require("./joinme-web-82168-firebase-adminsdk-fbsvc-1453f63390.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/trips", tripRoutes);

const publicDir = path.join(__dirname, "public");

fs.readdirSync(publicDir).forEach(file => {
  if (file.endsWith(".html")) {
    const baseRoute = file === "index.html" ? "/" : "/" + file.replace(".html", "");
    app.get(baseRoute, (req, res) => {
      res.sendFile(path.join(publicDir, file));
    });
  }
});

app.get("*", (req, res) => {
  const notFoundPath = path.join(publicDir, "404.html");
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).send("404 - Page Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
console.log("ENV LOADED:", !!process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64);

