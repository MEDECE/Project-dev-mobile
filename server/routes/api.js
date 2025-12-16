const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Sensor = require("../models/Sensor");
const Measure = require("../models/Measure");

// --- USERS ---
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SENSORS ---
// Get all sensors or filter by location/type
router.get("/sensors", async (req, res) => {
  try {
    const sensors = await Sensor.find().populate("userID");
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Sensor
router.post("/sensors", async (req, res) => {
  const sensor = new Sensor({
    location: req.body.location,
    type: req.body.type,
    userID: req.body.userID,
  });
  try {
    const newSensor = await sensor.save();
    res.status(201).json(newSensor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Sensor
router.delete("/sensors/:id", async (req, res) => {
  try {
    await Sensor.findByIdAndDelete(req.params.id);
    // Optional: Delete associated measures
    await Measure.deleteMany({ sensorID: req.params.id });
    res.json({ message: "Sensor and associated measures deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MEASURES ---
// Get all measures (limit to last 1000 for performance if needed)
router.get("/measures", async (req, res) => {
  try {
    const measures = await Measure.find().populate("sensorID").limit(2000); // Protection against large dataset loading
    res.json(measures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// KPI: Sensor Count
router.get("/kpi/sensor-count", async (req, res) => {
  try {
    const count = await Sensor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
