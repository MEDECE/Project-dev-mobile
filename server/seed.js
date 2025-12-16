require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("./models/User");
const Sensor = require("./models/Sensor");
const Measure = require("./models/Measure");
const connectDB = require("./database");

// Helper to transform "$oid" to string _id
const transformData = (data) => {
  return data.map((item) => {
    const newItem = { ...item };
    if (newItem._id && newItem._id.$oid) {
      newItem._id = newItem._id.$oid;
    }
    if (newItem.userID && newItem.userID.$oid) {
      newItem.userID = newItem.userID.$oid;
    }
    if (newItem.sensorID && newItem.sensorID.$oid) {
      newItem.sensorID = newItem.sensorID.$oid;
    }
    // Handle dates if needed, but Mongoose usually parses ISO strings well
    return newItem;
  });
};

const importData = async () => {
  try {
    await connectDB();

    // Read files
    const users = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../rules/resources/User.json"),
        "utf-8"
      )
    );
    const sensors = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../rules/resources/Sensor.json"),
        "utf-8"
      )
    );
    const measures = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../rules/resources/Measure.json"),
        "utf-8"
      )
    );

    // Clear DB
    await User.deleteMany();
    await Sensor.deleteMany();
    await Measure.deleteMany();

    console.log("Data destroyed...");

    // Transform and Insert
    await User.insertMany(transformData(users));
    await Sensor.insertMany(transformData(sensors));
    await Measure.insertMany(transformData(measures));

    console.log("Data Imported!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
