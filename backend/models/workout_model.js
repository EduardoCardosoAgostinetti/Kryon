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
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

module.exports = { Workout };
