// update_fullname.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash("senha123", 10);
  await User.create({
    fullName: "Joao Original",
    username: "joao123",
    email: "joao@email.com",
    password
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("PUT /user/update-fullname", () => {
  let user;
  beforeEach(async () => {
    user = await User.findOne({ where: { email: "joao@email.com" } });
  });

  it("should update full name successfully", async () => {
    const res = await request(app)
      .put("/user/update-fullname")
      .send({ userId: user.id, newFullName: "joao da silva" });

    expect(res.status).toBe(200);
    expect(res.body.code).toBe("FULLNAME_UPDATED");
    expect(res.body.data.fullName).toBe("Joao Da Silva");
  });

  it("should fail if newFullName is missing", async () => {
    const res = await request(app)
      .put("/user/update-fullname")
      .send({ userId: user.id });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_FULLNAME");
  });

  it("should fail if user not found", async () => {
    const res = await request(app)
      .put("/user/update-fullname")
      .send({ userId: "4825976f-addb-4386-9254-ad063c786634", newFullName: "Nome Qualquer" });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });
});
