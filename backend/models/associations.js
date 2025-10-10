const { User } = require("./user_model");
const { Workout } = require("./workout_model");

Workout.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Workout, { foreignKey: "userId" });

module.exports = { User, Workout };