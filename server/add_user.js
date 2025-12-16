const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect("mongodb://localhost:27017/peiot")
  .then(async () => {
    console.log("Adding missing user for Russia...");
    await User.create({
      location: "Russia",
      personsInHouse: 3,
      houseSize: "medium",
    });
    console.log("✅ User added successfully.");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
