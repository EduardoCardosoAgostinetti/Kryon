const express = require("express");
const router = express.Router();
const user_controllers = require("../controllers/user_controllers");

router.post("/register",  user_controllers.createUser);
router.post("/login", user_controllers.loginUser);

module.exports = router;
