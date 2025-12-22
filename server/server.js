require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Mongoose Models ---

// 1. User Model (Foyers)
const UserSchema = new mongoose.Schema({
  location: String,
  personsInHouse: Number,
  houseSize: String,
});
const User = mongoose.model("User", UserSchema);

// 2. Sensor Model (Capteurs)
const SensorSchema = new mongoose.Schema({
  type: String,
  creationDate: String,
  location: String,
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Sensor = mongoose.model("Sensor", SensorSchema);

// 3. Measure Model (Mesures)
const MeasureSchema = new mongoose.Schema({
  type: String,
  creationDate: Date,
  value: Number,
  sensorID: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
});
const Measure = mongoose.model("Measure", MeasureSchema);

// --- DB Connection ---
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/peiot";
    await mongoose.connect(uri);
    console.log("MongoDB Connected to", uri);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// --- API Endpoints ---

// Endpoint A: KPIs Globaux
app.get("/api/kpis", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSensors = await Sensor.countDocuments();

    // Moyenne globale pollution
    const avgPollutionResult = await Measure.aggregate([
      { $match: { type: "airPollution" } },
      { $group: { _id: null, avgValue: { $avg: "$value" } } },
    ]);

    const avgGlobalPollution =
      avgPollutionResult.length > 0 ? avgPollutionResult[0].avgValue : 0;

    res.json({
      totalUsers,
      totalSensors,
      avgGlobalPollution,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint B: Analyse par Pays (Aggregation Pipeline)
app.get("/api/analysis", async (req, res) => {
  try {
    const analysis = await Measure.aggregate([
      // 1. Join with Sensors to get the Sensor location (room) and User ID
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensorInfo",
        },
      },
      { $unwind: "$sensorInfo" },

      // 2. Join with Users to get the Country (User.location)
      {
        $lookup: {
          from: "users",
          localField: "sensorInfo.userID",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      // 3. Group by Country (userInfo.location) and Measure Type
      {
        $group: {
          _id: {
            country: "$userInfo.location",
            measureType: "$type",
          },
          avgValue: { $avg: "$value" },
        },
      },

      // 4. Regroup to format the output: Country -> List of averages
      {
        $group: {
          _id: "$_id.country",
          measures: {
            $push: {
              type: "$_id.measureType",
              avg: "$avgValue",
            },
          },
        },
      },

      // 5. Project for cleaner output
      {
        $project: {
          _id: 0,
          country: "$_id",
          averages: "$measures",
        },
      },
    ]);

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint C: Détail Foyer (User + Sensors + Last Measure)
app.get("/api/house/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    // 1. Get User Info
    const user = await User.findById(userID).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 2. Get Sensors for this User
    const sensors = await Sensor.find({ userID: userID }).lean();

    // 3. For each sensor, get the LAST measure
    // We use Promise.all to run queries in parallel
    const sensorsWithLastMeasure = await Promise.all(
      sensors.map(async (sensor) => {
        const lastMeasure = await Measure.findOne({ sensorID: sensor._id })
          .sort({ creationDate: -1 }) // Descending order (latest first)
          .select("value creationDate type -_id") // Select specific fields
          .lean();

        return {
          ...sensor,
          lastMeasure: lastMeasure || null,
        };
      })
    );

    res.json({
      user,
      sensors: sensorsWithLastMeasure,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper Endpoint: List Users (for Frontend Navigation)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "location personsInHouse houseSize"); // Select specific fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint D: Sensor Distribution by Room Type (for Donut Chart)
app.get("/api/sensors/distribution", async (req, res) => {
  try {
    const distribution = await Sensor.aggregate([
      {
        $group: {
          _id: "$location", // Group by sensor location (room type)
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
      { $sort: { value: -1 } },
    ]);
    res.json(distribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === DATA ANALYST ENDPOINTS ===

// Endpoint E: Pollution moyenne par taille de maison (Bar Chart)
app.get("/api/analytics/pollution-by-size", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      { $match: { type: "airPollution" } },
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensor",
        },
      },
      { $unwind: "$sensor" },
      {
        $lookup: {
          from: "users",
          localField: "sensor.userID",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.houseSize",
          avgPollution: { $avg: "$value" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          houseSize: "$_id",
          avgPollution: { $round: ["$avgPollution", 2] },
          sampleCount: "$count",
        },
      },
      { $sort: { avgPollution: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint F: Corrélation Humidité vs Nombre de personnes (Scatter Plot)
app.get("/api/analytics/humidity-correlation", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      { $match: { type: "humidity" } },
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensor",
        },
      },
      { $unwind: "$sensor" },
      {
        $lookup: {
          from: "users",
          localField: "sensor.userID",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user._id",
          personsInHouse: { $first: "$user.personsInHouse" },
          avgHumidity: { $avg: "$value" },
        },
      },
      {
        $project: {
          _id: 0,
          x: "$personsInHouse",
          y: { $round: ["$avgHumidity", 2] },
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint G: Évolution température 2025 (Line Chart)
app.get("/api/analytics/temperature-trend", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      { $match: { type: "temperature" } },
      {
        $addFields: {
          month: { $month: "$creationDate" },
          year: { $year: "$creationDate" },
        },
      },
      { $match: { year: 2025 } },
      {
        $group: {
          _id: "$month",
          avgTemp: { $avg: "$value" },
          minTemp: { $min: "$value" },
          maxTemp: { $max: "$value" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          avg: { $round: ["$avgTemp", 1] },
          min: { $round: ["$minTemp", 1] },
          max: { $round: ["$maxTemp", 1] },
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Convert month number to name
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const formatted = result.map((r) => ({
      ...r,
      name: monthNames[r.month - 1] || `M${r.month}`,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === BUSINESS & CROISSANCE ENDPOINTS ===

// Endpoint H: Deployment Speed (Sensors per month/year)
app.get("/api/business/deployment-speed", async (req, res) => {
  try {
    const result = await Sensor.aggregate([
      // creationDate is already a Date object in MongoDB
      {
        $group: {
          _id: {
            year: { $year: "$creationDate" },
            month: { $month: "$creationDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    const formatted = result.map((r) => ({
      name: `${monthNames[r.month - 1]} ${r.year}`,
      value: r.count,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint I: Customer Segmentation (House size x Persons)
app.get("/api/business/segmentation", async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            houseSize: "$houseSize",
            personCategory: {
              $switch: {
                branches: [
                  { case: { $lte: ["$personsInHouse", 2] }, then: "1-2 pers." },
                  { case: { $lte: ["$personsInHouse", 4] }, then: "3-4 pers." },
                ],
                default: "5+ pers.",
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          segment: {
            $concat: ["$_id.houseSize", " - ", "$_id.personCategory"],
          },
          houseSize: "$_id.houseSize",
          personCategory: "$_id.personCategory",
          value: "$count",
        },
      },
      { $sort: { value: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === SANTÉ & ENVIRONNEMENT ENDPOINTS ===

// Endpoint J: Comfort Radar (Metrics by Room)
app.get("/api/health/comfort-radar", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensor",
        },
      },
      { $unwind: "$sensor" },
      {
        $group: {
          _id: {
            room: "$sensor.location",
            metric: "$type",
          },
          avgValue: { $avg: "$value" },
        },
      },
      {
        $group: {
          _id: "$_id.room",
          metrics: {
            $push: {
              metric: "$_id.metric",
              value: { $round: ["$avgValue", 1] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          room: "$_id",
          metrics: 1,
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint K: Top 5 Risky Countries (Worst Pollution)
app.get("/api/health/top-risky-countries", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      { $match: { type: "airPollution" } },
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensor",
        },
      },
      { $unwind: "$sensor" },
      {
        $lookup: {
          from: "users",
          localField: "sensor.userID",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.location",
          avgPollution: { $avg: "$value" },
          maxPollution: { $max: "$value" },
          measureCount: { $sum: 1 },
        },
      },
      { $sort: { avgPollution: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          country: "$_id",
          avgPollution: { $round: ["$avgPollution", 1] },
          maxPollution: 1,
          measureCount: 1,
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === TECHNIQUE & ANOMALIES ENDPOINTS ===

// Endpoint L: Critical Alerts (Extreme Measures)
app.get("/api/technical/critical-alerts", async (req, res) => {
  try {
    const result = await Measure.aggregate([
      {
        $match: {
          $or: [
            { type: "airPollution", value: { $gt: 80 } },
            { type: "temperature", value: { $lt: 5 } },
            { type: "temperature", value: { $gt: 35 } },
            { type: "humidity", value: { $gt: 85 } },
          ],
        },
      },
      {
        $lookup: {
          from: "sensors",
          localField: "sensorID",
          foreignField: "_id",
          as: "sensor",
        },
      },
      { $unwind: "$sensor" },
      {
        $lookup: {
          from: "users",
          localField: "sensor.userID",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { creationDate: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          type: 1,
          value: 1,
          creationDate: 1,
          room: "$sensor.location",
          country: "$user.location",
          severity: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $eq: ["$type", "airPollution"] },
                      { $gt: ["$value", 90] },
                    ],
                  },
                  then: "critical",
                },
                {
                  case: {
                    $or: [{ $lt: ["$value", 0] }, { $gt: ["$value", 40] }],
                  },
                  then: "critical",
                },
              ],
              default: "warning",
            },
          },
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint M: Temp-Humidity Correlation (Scatter Plot)
app.get("/api/technical/temp-humidity-correlation", async (req, res) => {
  try {
    // Get temperature and humidity for same sensors
    const tempMeasures = await Measure.aggregate([
      { $match: { type: "temperature" } },
      { $group: { _id: "$sensorID", avgTemp: { $avg: "$value" } } },
    ]);

    const humidityMeasures = await Measure.aggregate([
      { $match: { type: "humidity" } },
      { $group: { _id: "$sensorID", avgHumidity: { $avg: "$value" } } },
    ]);

    // Combine by finding matching sensor IDs
    const result = [];
    for (const temp of tempMeasures) {
      const humidity = humidityMeasures.find((h) => h._id.equals(temp._id));
      if (humidity) {
        result.push({
          x: Math.round(temp.avgTemp * 10) / 10,
          y: Math.round(humidity.avgHumidity * 10) / 10,
        });
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`POC Server running on port ${PORT}`);
  });
});
