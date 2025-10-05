// user_controller.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /user/register", () => {
  const validUser = {
    fullName: "joao da silva 1",
    username: "joaosilva 1",
    email: "joao1@email.com",
    password: "senha123",
    confirmPassword: "senha123"
  };

  it("should create user with valid data", async () => {
    const res = await request(app)
      .post("/user/register")
      .send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.code).toBe("USER_CREATED_SUCCESS");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.fullName).toBe("Joao Da Silva 1");
    expect(res.body.data.username).toBe(validUser.username);
    expect(res.body.data.email).toBe(validUser.email);
  });

  it("should fail if fullName is missing", async () => {
    const { fullName, ...payload } = validUser;
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_FULLNAME");
  });

  it("should fail if username is missing", async () => {
    const { username, ...payload } = validUser;
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_USERNAME");
  });

  it("should fail if email is missing", async () => {
    const { email, ...payload } = validUser;
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_EMAIL");
  });

  it("should fail if email is invalid", async () => {
    const payload = { ...validUser, email: "invalidemail" };
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_EMAIL");
  });

  it("should fail if password is missing", async () => {
    const { password, ...payload } = validUser;
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_PASSWORD");
  });

  it("should fail if confirmPassword is missing", async () => {
    const { confirmPassword, ...payload } = validUser;
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_CONFIRM_PASSWORD");
  });

  it("should fail if passwords do not match", async () => {
    const payload = { ...validUser, confirmPassword: "different" };
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("PASSWORD_MISMATCH");
  });

  it("should fail if email already exists", async () => {
    const payload = { ...validUser, username: "uniqueusername" };
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe("EMAIL_EXISTS");
  });

  it("should fail if username already exists", async () => {
    const payload = { ...validUser, email: "unique@email.com" };
    const res = await request(app).post("/user/register").send(payload);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe("USERNAME_EXISTS");
  });
});