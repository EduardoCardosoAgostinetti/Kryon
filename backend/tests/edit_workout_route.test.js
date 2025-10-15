// edit_workout_route.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User, Workout } = require("../models/associations");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    fullName: "User Edit",
    username: "useredit",
    email: "useredit@test.com",
    password: "123456"
  });

  await Workout.create({
    userId: user.id,
    data: { name: "Treino Antigo", exercises: ["corrida"] }
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("PUT /workout/edit/:id", () => {
  it("should update workout successfully", async () => {
    const workout = await Workout.findOne();
    const res = await request(app)
      .put(`/workout/edit/${workout.id}`)
      .send({ data: { name: "Treino Atualizado", exercises: ["supino"] } });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("WORKOUT_UPDATED");
    expect(res.body.data.data.name).toBe("Treino Atualizado");
  });

  it("should fail if workout not found", async () => {
    const res = await request(app)
      .put("/workout/edit/860c0ebb-6425-439b-b42f-119243d97b05")
      .send({ data: { name: "Inexistente" } });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("WORKOUT_NOT_FOUND");
  });

  it("should fail if data is invalid type", async () => {
    const workout = await Workout.findOne();
    const res = await request(app)
      .put(`/workout/edit/${workout.id}`)
      .send({ data: "stringInsteadOfObject" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_DATA");
  });
});
