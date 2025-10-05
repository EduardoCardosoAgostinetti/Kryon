const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Cria um usuário para os testes de login
  const hashedPassword = await bcrypt.hash("senha123", 10);
  await User.create({
    fullName: "Joao Da Silva 2",
    username: "joaosilva 2",
    email: "joao2@email.com",
    password: hashedPassword
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /user/login", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "joao2@email.com", password: "senha123" });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("LOGIN_SUCCESS");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.email).toBe("joao2@email.com");
  });

  it("should fail if email is missing", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ password: "senha123" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_EMAIL");
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "invalidemail", password: "senha123" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_EMAIL");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "joao2@email.com" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_PASSWORD");
  });

  it("should fail if user is not found", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "naoexiste@email.com", password: "senha123" });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });

  it("should fail if password is incorrect", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "joao2@email.com", password: "senhaErrada" });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_PASSWORD");
  });
});
