const express = require("express");
const router = express.Router();
const workoutControllers = require("../controllers/workout_controllers");

// Criar nova ficha
router.post("/create", workoutControllers.createWorkout);

// Editar ficha existente
router.put("/edit/:id", workoutControllers.editWorkout);

// Pegar todas as fichas de um usuário
router.get("/user/:userId", workoutControllers.getUserWorkouts);

module.exports = router;
