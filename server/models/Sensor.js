const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  location: { type: String },
  creationDate: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Sensor", sensorSchema);
