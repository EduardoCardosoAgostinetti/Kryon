// delete_workout_route.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User, Workout } = require("../models/associations");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    fullName: "User Delete",
    username: "userdelete",
    email: "userdelete@test.com",
    password: "123456"
  });

  await Workout.create({
    userId: user.id,
    data: { name: "Treino Delete", exercises: ["supino"] }
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("DELETE /workout/delete/:id", () => {
  it("should delete workout successfully", async () => {
    const workout = await Workout.findOne();
    const res = await request(app).delete(`/workout/delete/${workout.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("WORKOUT_DELETED");
  });

  it("should fail if workout not found", async () => {
    const res = await request(app).delete("/workout/delete/860c0ebb-6425-439b-b42f-119243d97b05");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("WORKOUT_NOT_FOUND");
  });

  it("should fail if id is missing", async () => {
    const res = await request(app).delete("/workout/delete/");
    expect(res.status).toBe(404); // rota inválida, não existe /delete/
  });
});
