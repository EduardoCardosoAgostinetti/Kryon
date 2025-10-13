const express = require("express");
const router = express.Router();
const user_controllers = require("../controllers/user_controllers");

router.post("/register",  user_controllers.createUser);
router.post("/login", user_controllers.loginUser);

router.post("/forgot-password", user_controllers.forgotPassword);
router.post("/reset-password", user_controllers.resetPassword);
router.get("/activate-account", user_controllers.activateUser);

router.put("/update-fullname", user_controllers.updateFullName);
router.put("/update-email", user_controllers.updateEmail);
router.put("/update-username", user_controllers.updateUsername);
router.put("/update-password", user_controllers.updatePassword); 

module.exports = router;
