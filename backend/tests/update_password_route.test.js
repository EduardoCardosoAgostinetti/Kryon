// update_password.test.js
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/database");
const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");

afterAll(async () => {
    await sequelize.close();
});

describe("PUT /user/update-password", () => {
    let user;
    beforeEach(async () => {
        await sequelize.sync({ force: true });

        const password = await bcrypt.hash("senha123", 10);
        await User.create({
            fullName: "Joao",
            username: "joao123",
            email: "joao@email.com",
            password
        });
        user = await User.findOne({ where: { email: "joao@email.com" } });
    });

    it("should update password successfully", async () => {
        const res = await request(app)
            .put("/user/update-password")
            .send({
                userId: user.id,
                currentPassword: "senha123",
                newPassword: "novaSenha123",
                confirmPassword: "novaSenha123"
            });

        expect(res.status).toBe(200);
        expect(res.body.code).toBe("PASSWORD_UPDATED");
    });

    it("should fail if current password is missing", async () => {
        const res = await request(app)
            .put("/user/update-password")
            .send({
                userId: user.id,
                newPassword: "novaSenha",
                confirmPassword: "novaSenha"
            });

        expect(res.status).toBe(400);
        expect(res.body.code).toBe("MISSING_CURRENT_PASSWORD");
    });

    it("should fail if passwords do not match", async () => {
        const res = await request(app)
            .put("/user/update-password")
            .send({
                userId: user.id,
                currentPassword: "senha123",
                newPassword: "nova1",
                confirmPassword: "nova2"
            });

        expect(res.status).toBe(400);
        expect(res.body.code).toBe("PASSWORD_MISMATCH");
    });

    it("should fail if current password is incorrect", async () => {
        const res = await request(app)
            .put("/user/update-password")
            .send({
                userId: user.id,
                currentPassword: "errada",
                newPassword: "novaSenha",
                confirmPassword: "novaSenha"
            });

        expect(res.status).toBe(401);
        expect(res.body.code).toBe("INVALID_CURRENT_PASSWORD");
    });

    it("should fail if user not found", async () => {
        const nonExistentUUID = "123e4567-e89b-12d3-a456-426614174000";
        const res = await request(app)
            .put("/user/update-password")
            .send({
                userId: nonExistentUUID,
                currentPassword: "senha123",
                newPassword: "novaSenha",
                confirmPassword: "novaSenha"
            });

        expect(res.status).toBe(404);
        expect(res.body.code).toBe("USER_NOT_FOUND");
    });
});
