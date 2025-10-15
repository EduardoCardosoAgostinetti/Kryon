// activate_account_route.test.js
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /user/activate-account", () => {
  it("should activate user successfully with valid token", async () => {
    // Cria um usuário inativo
    const user = await User.create({
      fullName: "User Activate",
      username: "useractivate",
      email: "user@activate.com",
      password: "hashedpass",
      isActive: false,
    });

    // Gera token válido
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "25m" }
    );

    // Faz requisição
    const res = await request(app).get(`/user/activate-account?token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("USER_ACTIVATED");

    // Confirma que o usuário foi ativado no banco
    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser.isActive).toBe(true);
  });

  it("should fail if token is missing", async () => {
    const res = await request(app).get("/user/activate-account");
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_TOKEN");
  });

  it("should fail if token is invalid", async () => {
    const res = await request(app).get("/user/activate-account?token=invalidtoken");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_TOKEN");
  });

  it("should fail if user not found", async () => {
    // Gera token para ID inexistente
    const fakeToken = jwt.sign(
      { id: "860c0ebb-6425-439b-b42f-119243d97b05", email: "ghost@user.com" },
      process.env.JWT_SECRET,
      { expiresIn: "25m" }
    );

    const res = await request(app).get(`/user/activate-account?token=${fakeToken}`);

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });

  it("should fail if user already active", async () => {
    // Cria usuário já ativo
    const user = await User.create({
      fullName: "Already Active",
      username: "alreadyactive",
      email: "active@user.com",
      password: "hashedpass",
      isActive: true,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "25m" }
    );

    const res = await request(app).get(`/user/activate-account?token=${token}`);

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("ALREADY_ACTIVE");
  });
});
