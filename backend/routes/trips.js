const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/trips/save
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { tripTitle, destination, duration, highlights, days, localTips, packingEssentials, bestTimeToVisit } = req.body;
    const trip = await Trip.create({
      user: req.user.id,
      tripTitle, destination, duration, highlights, days, localTips, packingEssentials, bestTimeToVisit,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/trips/my-trips
router.get("/my-trips", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE /api/trips/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ message: "Not authorized" });
    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;