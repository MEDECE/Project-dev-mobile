const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/peiot")
  .then(async () => {
    console.log("Connected to DB");
    const users = await User.find({}, "location");
    console.log("All User Locations:");
    users.forEach((u) => console.log(`- "${u.location}" (ID: ${u._id})`));

    console.log("\nAggregation Test:");
    const agg = await User.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);
    console.log(agg);

    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
