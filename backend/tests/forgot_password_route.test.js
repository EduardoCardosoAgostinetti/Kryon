const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash("senha123", 10);
  await User.create({
    fullName: "Maria Oliveira",
    username: "mariaoliveira",
    email: "maria@email.com",
    password: hashedPassword
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /user/forgot-password", () => {
  it("should send reset email successfully for valid email", async () => {
    const res = await request(app)
      .post("/user/forgot-password")
      .send({ email: "maria@email.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("RESET_EMAIL_SENT");
    expect(res.body.message).toMatch("Password reset email sent successfully.");
  });

  it("should fail if email is missing", async () => {
    const res = await request(app)
      .post("/user/forgot-password")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_EMAIL");
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app)
      .post("/user/forgot-password")
      .send({ email: "invalidemail" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_EMAIL");
  });

  it("should fail if user not found", async () => {
    const res = await request(app)
      .post("/user/forgot-password")
      .send({ email: "naoexiste@email.com" });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });
});
