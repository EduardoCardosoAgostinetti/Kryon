const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env", quiet: true });

let resetToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash("senha123", 10);
  const user = await User.create({
    fullName: "Carlos Souza",
    username: "carlossouza",
    email: "carlos@email.com",
    password: hashedPassword
  });

  // simula token de reset válido
  resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
    expiresIn: "15m"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /user/reset-password", () => {
  it("should reset password successfully with valid token", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({
        token: resetToken,
        newPassword: "novaSenha123",
        confirmPassword: "novaSenha123"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("PASSWORD_RESET_SUCCESS");
  });

  it("should fail if token is missing", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({
        newPassword: "novaSenha123",
        confirmPassword: "novaSenha123"
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_TOKEN");
  });

  it("should fail if token is invalid", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({
        token: "tokenInvalido",
        newPassword: "novaSenha123",
        confirmPassword: "novaSenha123"
      });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_TOKEN");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({ token: resetToken });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_NEW_PASSWORD");
  });

  it("should fail if confirmPassword is missing", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({ token: resetToken, newPassword: "novaSenha123" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_CONFIRM_PASSWORD");
  });

  it("should fail if passwords do not match", async () => {
    const res = await request(app)
      .post("/user/reset-password")
      .send({
        token: resetToken,
        newPassword: "novaSenha123",
        confirmPassword: "outraSenha"
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("PASSWORD_MISMATCH");
  });
});
