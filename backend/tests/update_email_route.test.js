// update_email.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");



afterAll(async () => {
  await sequelize.close();
});

describe("PUT /user/update-email", () => {
  let user;
  beforeEach(async () => {
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash("senha123", 10);
  await User.bulkCreate([
    { fullName: "Joao Original", username: "joao123", email: "joao@email.com", password },
    { fullName: "Maria Original", username: "maria123", email: "maria@email.com", password },
  ]);

  user = await User.findOne({ where: { email: "joao@email.com" } });
});


  it("should update email successfully", async () => {
    const res = await request(app)
      .put("/user/update-email")
      .send({ userId: user.id, newEmail: "novo@email.com" });

    expect(res.status).toBe(200);
    expect(res.body.code).toBe("EMAIL_UPDATED");
    expect(res.body.data.email).toBe("novo@email.com");
  });

  it("should fail if email missing", async () => {
    const res = await request(app)
      .put("/user/update-email")
      .send({ userId: user.id });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("MISSING_EMAIL");
  });

  it("should fail if invalid email format", async () => {
    const res = await request(app)
      .put("/user/update-email")
      .send({ userId: user.id, newEmail: "invalidemail" });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_EMAIL");
  });

  it("should fail if email already exists", async () => {
    const maria = await User.findOne({ where: { email: "maria@email.com" } });
    const res = await request(app)
      .put("/user/update-email")
      .send({ userId: user.id, newEmail: maria.email });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe("EMAIL_EXISTS");
  });

  it("should fail if user not found", async () => {
    const nonExistentUUID = "123e4567-e89b-12d3-a456-426614174000"; // UUID fake
    const res = await request(app)
      .put("/user/update-email")
      .send({ userId: nonExistentUUID, newEmail: "naoexiste@email.com" });

    expect(res.status).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });

});
