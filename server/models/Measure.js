const mongoose = require("mongoose");

const measureSchema = new mongoose.Schema({
  type: { type: String, required: true }, // humidity, temperature, airPollution
  creationDate: { type: Date, required: true },
  sensorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
    required: true,
  },
  value: { type: Number, required: true },
});

module.exports = mongoose.model("Measure", measureSchema);
