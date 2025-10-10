const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Workout = sequelize.define("Workout", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    // Estrutura JSON para armazenar grupos musculares, exercícios e séries
    //   { group: "Peito", exercises: [{ name: "Supino", series: [{ weight: 40, reps: 12 }] }] }
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

module.exports = { Workout };
