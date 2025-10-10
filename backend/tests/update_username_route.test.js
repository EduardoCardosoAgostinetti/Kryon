// update_username.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");

afterAll(async () => {
    await sequelize.close();
});

describe("PUT /user/update-username", () => {
    let user;
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        const password = await bcrypt.hash("senha123", 10);
        await User.bulkCreate([
            { fullName: "Joao", username: "joao123", email: "joao@email.com", password },
            { fullName: "Maria", username: "maria123", email: "maria@email.com", password }
        ]);
        user = await User.findOne({ where: { username: "joao123" } });
    });

    it("should update username successfully", async () => {
        const res = await request(app)
            .put("/user/update-username")
            .send({ userId: user.id, newUsername: "joaoNovo" });

        expect(res.status).toBe(200);
        expect(res.body.code).toBe("USERNAME_UPDATED");
        expect(res.body.data.username).toBe("joaoNovo");
    });

    it("should fail if username missing", async () => {
        const res = await request(app)
            .put("/user/update-username")
            .send({ userId: user.id });

        expect(res.status).toBe(400);
        expect(res.body.code).toBe("MISSING_USERNAME");
    });

    it("should fail if username already exists", async () => {
        const res = await request(app)
            .put("/user/update-username")
            .send({ userId: user.id, newUsername: "maria123" });

        expect(res.status).toBe(409);
        expect(res.body.code).toBe("USERNAME_EXISTS");
    });

    it("should fail if user not found", async () => {
        const nonExistentUUID = "123e4567-e89b-12d3-a456-426614174000";
        const res = await request(app)
            .put("/user/update-username")
            .send({ userId: nonExistentUUID, newUsername: "semuser" });

        expect(res.status).toBe(404);
        expect(res.body.code).toBe("USER_NOT_FOUND");
    });
});
