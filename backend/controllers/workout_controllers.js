const { Workout, User } = require("../models/associations");
const apiResponse = require("../config/api_response");

// Criar nova ficha
exports.createWorkout = async (req, res) => {
  try {
    const { userId, data } = req.body;

    if (!userId) return apiResponse(res, false, "MISSING_USER", "User ID is required.", null, 400);
    if (!data) return apiResponse(res, false, "MISSING_DATA", "Workout data is required.", null, 400);
    if (typeof data !== "object") return apiResponse(res, false, "INVALID_DATA", "Workout data must be a JSON object.", null, 400);

    const user = await User.findByPk(userId);
    if (!user) return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    const workout = await Workout.create({ userId, data });

    return apiResponse(res, true, "WORKOUT_CREATED", "Workout plan created successfully.", workout, 201);
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error creating workout plan.", null, 500);
  }
};

// Editar ficha
exports.editWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const workout = await Workout.findByPk(id);
    if (!workout) return apiResponse(res, false, "WORKOUT_NOT_FOUND", "Workout plan not found.", null, 404);

    if (data) {
      if (typeof data !== "object") return apiResponse(res, false, "INVALID_DATA", "Workout data must be a JSON object.", null, 400);
      await workout.update({ data });
    }

    return apiResponse(res, true, "WORKOUT_UPDATED", "Workout plan updated successfully.", workout, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error updating workout plan.", null, 500);
  }
};

// Pegar todas as fichas de um usuário
exports.getUserWorkouts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Workout,
          order: [["createdAt", "DESC"]], // 🔥 ordena pelos mais recentes primeiro
        },
      ],
    });

    if (!user)
      return apiResponse(res, false, "USER_NOT_FOUND", "User not found.", null, 404);

    return apiResponse(
      res,
      true,
      "WORKOUTS_FOUND",
      "Workout plans retrieved successfully.",
      user,
      200
    );
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error retrieving workout plans.", null, 500);
  }
};


exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return apiResponse(res, false, "MISSING_ID", "Workout ID is required.", null, 400);

    const workout = await Workout.findByPk(id);
    if (!workout)
      return apiResponse(res, false, "WORKOUT_NOT_FOUND", "Workout plan not found.", null, 404);

    await workout.destroy();

    return apiResponse(res, true, "WORKOUT_DELETED", "Workout plan deleted successfully.", null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, "SERVER_ERROR", "Error deleting workout plan.", null, 500);
  }
};