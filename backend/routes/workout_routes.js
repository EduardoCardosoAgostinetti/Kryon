const express = require("express");
const router = express.Router();
const workoutControllers = require("../controllers/workout_controllers");

router.post("/create", workoutControllers.createWorkout);
router.put("/edit/:id", workoutControllers.editWorkout);
router.get("/user/:userId", workoutControllers.getUserWorkouts);
router.delete("/delete/:id", workoutControllers.deleteWorkout);

module.exports = router;
