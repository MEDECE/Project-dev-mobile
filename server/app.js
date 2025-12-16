require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/api"));
app.use("/api/stats", require("./routes/stats"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
