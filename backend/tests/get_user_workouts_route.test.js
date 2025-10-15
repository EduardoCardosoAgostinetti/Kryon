// get_user_workouts_route.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User, Workout } = require("../models/associations");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    fullName: "User Get",
    username: "userget",
    email: "userget@test.com",
    password: "123456"
  });

  await Workout.bulkCreate([
    { userId: user.id, data: { name: "Treino A", exercises: ["corrida"] } },
    { userId: user.id, data: { name: "Treino B", exercises: ["supino"] } }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /workout/user/:userId", () => {
  it("should retrieve all workouts for a user", async () => {
    const user = await User.findOne({ where: { email: "userget@test.com" } });
    const res = await request(app).get(`/workout/user/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("WORKOUTS_FOUND");
    expect(res.body.data.Workouts.length).toBe(2);
  });

  it("should fail if user not found", async () => {
    const res = await request(app).get("/workout/user/860c0ebb-6425-439b-b42f-119243d97b05");
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });
});
