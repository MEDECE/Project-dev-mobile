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

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`POC Server running on port ${PORT}`);
  });
});
