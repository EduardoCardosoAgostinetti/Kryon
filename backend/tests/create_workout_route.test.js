// create_workout_route.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    fullName: "User Test",
    username: "usertest",
    email: "user@test.com",
    password: "123456"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /workout/create", () => {
  it("should create a workout successfully with valid data", async () => {
    const user = await User.findOne({ where: { email: "user@test.com" } });
    const payload = {
      userId: user.id,
      data: { name: "Treino A", exercises: ["supino", "agachamento"] }
    };

    const res = await request(app).post("/workout/create").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("WORKOUT_CREATED");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.data.name).toBe("Treino A");
  });

  it("should fail if userId is missing", async () => {
    const res = await request(app).post("/workout/create").send({ data: {} });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_USER");
  });

  it("should fail if data is missing", async () => {
    const res = await request(app).post("/workout/create").send({ userId: 1 });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_DATA");
  });

  it("should fail if data is not an object", async () => {
    const res = await request(app).post("/workout/create").send({ userId: 1, data: "notObject" });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_DATA");
  });

  it("should fail if user not found", async () => {
    const res = await request(app).post("/workout/create").send({ userId: "860c0ebb-6425-439b-b42f-119243d97b05", data: {} });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });
});
