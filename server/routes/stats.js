const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Sensor = require("../models/Sensor");
const Measure = require("../models/Measure");

// KPI Global Stats
router.get("/kpi", async (req, res) => {
  try {
    const [userCount, sensorCount, measureCount] = await Promise.all([
      User.countDocuments(),
      Sensor.countDocuments(),
      Measure.countDocuments(),
    ]);

    // Example Trend logic (mocked because no historical data on creation date for entities strictly speaking in this POC context)
    // In real app, we would compare with last month
    res.json({
      users: { value: userCount, trend: "+12%", label: "Total Users" },
      sensors: { value: sensorCount, trend: "+5%", label: "Active Sensors" },
      measures: { value: measureCount, trend: "+24%", label: "Data Points" },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Map Data: Users by Country
router.get("/map", async (req, res) => {
  try {
    // Group users by location (Country)
    const aggregation = await User.aggregate([
      {
        $group: {
          _id: { $toLower: "$location" }, // Case insensitive grouping
          count: { $sum: 1 },
        },
      },
    ]);

    // Format for frontend: [{ name: "China", value: 12 }, ...]
    const mapData = aggregation
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        name: item._id, // This is the country name from DB
        value: item.count,
      }));

    res.json(mapData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chart Data: Measures Trend (Last 20)
router.get("/trend", async (req, res) => {
  try {
    const measures = await Measure.find()
      .sort({ creationDate: -1 }) // Newest first
      .limit(50);

    // Return reversed to show timeline left-to-right
    res.json(measures.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
