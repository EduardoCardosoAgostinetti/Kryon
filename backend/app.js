// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user_routes");
const workoutRoutes = require("./routes/workout_routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use("/workout", workoutRoutes);

module.exports = app;
