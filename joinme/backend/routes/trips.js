const express = require("express");
const router = express.Router();
const tripService = require("../services/tripService");

router.get("/", async (req, res) => {
  try {
    const trips = await tripService.getAllTrips(req.db);
    res.json(trips);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    res.status(500).json({ error: "Error fetching trips" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.db, req.params.id);
    if (!trip) return res.status(404).json({ error: "Not found" });
    res.json(trip);
  } catch (error) {
    console.error("GET /api/trips/:id error:", error);
    res.status(500).json({ error: "Error fetching trip" });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = await tripService.createTrip(req.db, req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    res.status(500).json({ error: "Error creating trip" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await tripService.updateTrip(req.db, req.params.id, req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("PUT /api/trips/:id error:", error);
    res.status(500).json({ error: "Error updating trip" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await tripService.deleteTrip(req.db, req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error("DELETE /api/trips/:id error:", error);
    res.status(500).json({ error: "Error deleting trip" });
  }
});

router.post("/:id/join", async (req, res) => {
  const { userId, nickname } = req.body;
  try {
    const result = await tripService.joinTrip(req.db, req.params.id, userId, nickname);
    if (result === "not_found") return res.status(404).json({ error: "Not found" });
    if (result === "already_joined") return res.status(400).json({ error: "Already joined" });
    res.sendStatus(200);
  } catch (error) {
    console.error("POST /api/trips/:id/join error:", error);
    res.status(500).json({ error: "Error joining trip" });
  }
});

router.post("/:id/leave", async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await tripService.leaveTrip(req.db, req.params.id, userId);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.sendStatus(200);
  } catch (error) {
    console.error("POST /api/trips/:id/leave error:", error);
    res.status(500).json({ error: "Error leaving trip" });
  }
});

module.exports = router;
